import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, KeyRound, Building2, User, Mail, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { login, signUp, resetPassword, error, setError } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [establishmentName, setEstablishmentName] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setResetSent(false);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else if (mode === 'signup') {
        await signUp(email, password, displayName, establishmentName);
      } else if (mode === 'reset') {
        await resetPassword(email);
        setResetSent(true);
      }
    } catch (err) {
      // Error is set in AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoAccount = async () => {
    setSubmitting(true);
    setError(null);
    try {
      // Try to log in as demo or create demo
      const demoEmail = 'demo@domaine-lavandes.fr';
      const demoPass = 'DemoPass2026!';
      try {
        await login(demoEmail, demoPass);
      } catch (e) {
        // Create demo account if not existing
        await signUp(demoEmail, demoPass, 'Jean-Claude', 'Mas des Lavandes');
      }
    } catch (err) {
      // Handled
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center items-center p-4 font-sans text-stone-800">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-[#2D3436] text-white p-6 text-center space-y-2 border-b border-stone-800">
          <div className="inline-flex items-center justify-center p-2.5 bg-[#4A6741] rounded-full text-white mb-1 shadow-inner">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-stone-100">
            Gestion de Gîte & Table d'Hôtes
          </h1>
          <p className="text-xs text-stone-300">
            {mode === 'login' && 'Connectez-vous à votre espace de gestion'}
            {mode === 'signup' && 'Créer votre compte de gestionnaire'}
            {mode === 'reset' && 'Réinitialisation de votre mot de passe'}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50 text-xs font-bold text-stone-600">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-3 text-center cursor-pointer transition flex items-center justify-center space-x-1.5 ${
              mode === 'login' ? 'bg-white text-[#4A6741] border-b-2 border-[#4A6741]' : 'hover:bg-stone-100'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Se Connecter</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); }}
            className={`flex-1 py-3 text-center cursor-pointer transition flex items-center justify-center space-x-1.5 ${
              mode === 'signup' ? 'bg-white text-[#4A6741] border-b-2 border-[#4A6741]' : 'hover:bg-stone-100'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>S'inscrire</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded text-xs font-medium">
              {error}
            </div>
          )}

          {resetSent && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Un e-mail de réinitialisation vous a été envoyé. Vérifiez votre boîte de réception.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Nom complet (Gestionnaire) *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: Jean Dupont"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-300 rounded font-medium text-stone-900 text-xs focus:ring-1 focus:ring-[#4A6741]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Nom de votre Établissement / Gîte *</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: Le Domaine du Mas des Lavandes"
                      value={establishmentName}
                      onChange={e => setEstablishmentName(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-300 rounded font-medium text-stone-900 text-xs focus:ring-1 focus:ring-[#4A6741]"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block font-bold text-stone-700 mb-1">Adresse E-mail *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="votre.email@exemple.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-300 rounded font-medium text-stone-900 text-xs focus:ring-1 focus:ring-[#4A6741]"
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-stone-700">Mot de passe *</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setMode('reset'); setError(null); }}
                      className="text-[11px] text-[#4A6741] hover:underline font-medium cursor-pointer"
                    >
                      Oublié ?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-300 rounded font-medium text-stone-900 text-xs focus:ring-1 focus:ring-[#4A6741]"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-[#4A6741] hover:bg-[#3d5636] text-white font-bold rounded shadow transition cursor-pointer flex items-center justify-center space-x-2 text-xs disabled:opacity-50 mt-2"
            >
              {submitting ? (
                <span>Chargement...</span>
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Se Connecter</span>
                </>
              ) : mode === 'signup' ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Créer Mon Compte</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Envoyer l'e-mail de réinitialisation</span>
                </>
              )}
            </button>

            {mode === 'reset' && (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full text-center text-xs text-stone-600 hover:underline pt-2 font-medium cursor-pointer block"
              >
                ← Retour à la connexion
              </button>
            )}
          </form>

          {/* Quick Demo Access */}
          <div className="pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={handleDemoAccount}
              disabled={submitting}
              className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded border border-stone-300 transition cursor-pointer flex items-center justify-center space-x-2 text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Tester directement avec un Compte Démo</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 p-3 text-center border-t border-stone-200 text-[11px] text-stone-500 space-y-1">
          <div>Données synchronisées en temps réel via Firebase Firestore</div>
          <div className="text-stone-600 font-medium pt-1 border-t border-stone-200/60">
            Créé par <a href="tel:0681535770" className="font-bold text-stone-800 hover:text-[#4A6741] hover:underline">"l'escapade de jos 0681535770"</a>
          </div>
        </div>
      </div>
    </div>
  );
};
