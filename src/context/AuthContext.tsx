import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export interface UserProfile {
  displayName: string;
  establishmentName: string;
  email: string;
}

interface CustomUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface LocalAccount {
  uid: string;
  email: string;
  pass: string;
  displayName: string;
  establishmentName: string;
}

interface AuthContextType {
  user: User | CustomUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  setError: (err: string | null) => void;
  signUp: (email: string, pass: string, displayName: string, establishmentName: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const LOCAL_USERS_KEY = 'gite_app_registered_users_v1';
const LOCAL_CURRENT_SESSION_KEY = 'gite_app_current_session_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | CustomUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check local session first or fallback
    const savedSession = localStorage.getItem(LOCAL_CURRENT_SESSION_KEY);
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setUser(parsed.user);
        setUserProfile(parsed.profile);
      } catch (e) {
        console.error("Error restoring local session:", e);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Firebase user logged in
        setUser(currentUser);
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            setUserProfile(userSnap.data() as UserProfile);
          } else {
            const profile: UserProfile = {
              displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Gestionnaire',
              establishmentName: 'Maison d\'Hôtes',
              email: currentUser.email || ''
            };
            await setDoc(userDocRef, profile);
            setUserProfile(profile);
          }
        } catch (e) {
          console.error("Error fetching user profile:", e);
        }
      } else {
        // Only clear if no local session exists
        const localSess = localStorage.getItem(LOCAL_CURRENT_SESSION_KEY);
        if (!localSess) {
          setUser(null);
          setUserProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Save local accounts helper
  const getLocalAccounts = (): LocalAccount[] => {
    try {
      const stored = localStorage.getItem(LOCAL_USERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const setLocalAccounts = (accs: LocalAccount[]) => {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(accs));
  };

  const saveLocalSession = (userObj: CustomUser, profile: UserProfile) => {
    setUser(userObj);
    setUserProfile(profile);
    localStorage.setItem(LOCAL_CURRENT_SESSION_KEY, JSON.stringify({ user: userObj, profile }));
  };

  const signUp = async (email: string, pass: string, displayName: string, establishmentName: string) => {
    setError(null);
    const cleanEmail = email.trim().toLowerCase();

    try {
      // Try Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      const createdUser = userCredential.user;
      if (displayName) {
        try {
          await updateProfile(createdUser, { displayName });
        } catch (e) {}
      }

      const profile: UserProfile = {
        displayName: displayName || cleanEmail.split('@')[0] || 'Gestionnaire',
        establishmentName: establishmentName || 'Mon Établissement',
        email: cleanEmail
      };

      try {
        await setDoc(doc(db, 'users', createdUser.uid), profile);
      } catch (e) {}

      setUserProfile(profile);
      return;
    } catch (err: any) {
      console.warn("Firebase Auth Signup attempt:", err?.code || err?.message);

      if (err.code === 'auth/email-already-in-use') {
        const msg = "Un compte existe déjà avec cette adresse email.";
        setError(msg);
        throw new Error(msg);
      }

      if (err.code === 'auth/weak-password') {
        const msg = "Le mot de passe doit contenir au moins 6 caractères.";
        setError(msg);
        throw new Error(msg);
      }

      // If Firebase Auth provider is disabled (auth/operation-not-allowed) or any network restriction occurs, use Local Authentication Fallback
      const localAccs = getLocalAccounts();
      const existingAcc = localAccs.find(a => a.email.toLowerCase() === cleanEmail);
      if (existingAcc) {
        const msg = "Un compte existe déjà avec cette adresse email.";
        setError(msg);
        throw new Error(msg);
      }

      const uid = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newAcc: LocalAccount = {
        uid,
        email: cleanEmail,
        pass,
        displayName: displayName || cleanEmail.split('@')[0] || 'Gestionnaire',
        establishmentName: establishmentName || 'Mon Établissement'
      };

      localAccs.push(newAcc);
      setLocalAccounts(localAccs);

      const customUser: CustomUser = {
        uid,
        email: cleanEmail,
        displayName: newAcc.displayName
      };

      const profile: UserProfile = {
        displayName: newAcc.displayName,
        establishmentName: newAcc.establishmentName,
        email: cleanEmail
      };

      // Try saving profile to Firestore if allowed
      try {
        await setDoc(doc(db, 'users', uid), profile);
      } catch (e) {}

      saveLocalSession(customUser, profile);
    }
  };

  const login = async (email: string, pass: string) => {
    setError(null);
    const cleanEmail = email.trim().toLowerCase();

    try {
      // Try Firebase Auth first
      await signInWithEmailAndPassword(auth, cleanEmail, pass);
      return;
    } catch (err: any) {
      console.warn("Firebase Auth Login attempt:", err?.code || err?.message);

      // Fallback to local accounts
      const localAccs = getLocalAccounts();
      const matched = localAccs.find(a => a.email.toLowerCase() === cleanEmail);

      if (matched) {
        if (matched.pass === pass) {
          const customUser: CustomUser = {
            uid: matched.uid,
            email: matched.email,
            displayName: matched.displayName
          };
          const profile: UserProfile = {
            displayName: matched.displayName,
            establishmentName: matched.establishmentName,
            email: matched.email
          };
          saveLocalSession(customUser, profile);
          return;
        } else {
          const msg = "Mot de passe incorrect.";
          setError(msg);
          throw new Error(msg);
        }
      }

      let msg = "Adresse e-mail ou mot de passe incorrect.";
      if (err.code === 'auth/too-many-requests') {
        msg = "Trop de tentatives. Veuillez réessayer plus tard.";
      }
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    setError(null);
    localStorage.removeItem(LOCAL_CURRENT_SESSION_KEY);
    setUser(null);
    setUserProfile(null);
    try {
      await signOut(auth);
    } catch (e) {}
  };

  const resetPassword = async (email: string) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      // If local account exists or error
      const localAccs = getLocalAccounts();
      const matched = localAccs.find(a => a.email.toLowerCase() === email.trim().toLowerCase());
      if (matched) {
        // Handled silently
        return;
      }
      let msg = "Aucun compte trouvé avec cette adresse e-mail.";
      setError(msg);
      throw new Error(msg);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        error,
        setError,
        signUp,
        login,
        logout,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
