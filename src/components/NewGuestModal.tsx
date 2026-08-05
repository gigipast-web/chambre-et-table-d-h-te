import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, UserPlus, ShieldAlert, Heart } from 'lucide-react';

interface NewGuestModalProps {
  onClose: () => void;
}

export const NewGuestModal: React.FC<NewGuestModalProps> = ({ onClose }) => {
  const { addGuest } = useApp();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('France');
  const [dietaryInput, setDietaryInput] = useState('Sans Gluten, Végétarien');
  const [allergiesInput, setAllergiesInput] = useState('Arachides, Fruits de mer');
  const [privateNotes, setPrivateNotes] = useState('');
  const [vipTag, setVipTag] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName) return;

    addGuest({
      firstName,
      lastName,
      email: email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: phone || '06 00 00 00 00',
      address,
      city,
      zipCode,
      country,
      dietaryPreferences: dietaryInput ? dietaryInput.split(',').map(s => s.trim()) : [],
      allergies: allergiesInput ? allergiesInput.split(',').map(s => s.trim()) : [],
      privateNotes,
      vipTag,
      createdDate: new Date().toISOString().split('T')[0]
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3">
      <div className="bg-white rounded-lg max-w-lg w-full p-4 space-y-3 shadow-2xl border border-stone-300 text-xs">
        <div className="flex items-center justify-between border-b border-stone-200 pb-2">
          <div className="flex items-center space-x-2">
            <UserPlus className="w-4 h-4 text-stone-800" />
            <h2 className="font-bold text-sm text-stone-900">Créer une fiche client CRM</h2>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 text-lg font-bold cursor-pointer">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-bold text-stone-700 mb-0.5">Prénom *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full p-1.5 bg-stone-50 border border-stone-300 rounded text-xs focus:ring-1 focus:ring-[#4A6741]"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-0.5">Nom *</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full p-1.5 bg-stone-50 border border-stone-300 rounded text-xs focus:ring-1 focus:ring-[#4A6741]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-bold text-stone-700 mb-0.5">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-1.5 bg-stone-50 border border-stone-300 rounded text-xs focus:ring-1 focus:ring-[#4A6741]"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-0.5">Téléphone</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-1.5 bg-stone-50 border border-stone-300 rounded text-xs focus:ring-1 focus:ring-[#4A6741]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block font-bold text-stone-700 mb-0.5">Ville</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full p-1.5 bg-stone-50 border border-stone-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-0.5">Code postal</label>
              <input
                type="text"
                value={zipCode}
                onChange={e => setZipCode(e.target.value)}
                className="w-full p-1.5 bg-stone-50 border border-stone-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-0.5">Pays</label>
              <input
                type="text"
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="w-full p-1.5 bg-stone-50 border border-stone-300 rounded text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-0.5">Régimes alimentaires (séparés par virgules)</label>
            <input
              type="text"
              placeholder="Ex: Végétarien, Sans Lactose"
              value={dietaryInput}
              onChange={e => setDietaryInput(e.target.value)}
              className="w-full p-1.5 bg-stone-50 border border-stone-300 rounded text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-0.5 text-rose-700">Allergies (séparées par virgules)</label>
            <input
              type="text"
              placeholder="Ex: Arachides, Fruits de mer, Gluten"
              value={allergiesInput}
              onChange={e => setAllergiesInput(e.target.value)}
              className="w-full p-1.5 bg-rose-50/50 border border-rose-300 rounded text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-0.5">Notes privées / Préférences conciergerie</label>
            <textarea
              rows={2}
              placeholder="Ex: Préfère les oreillers fermes, bouteille de vin rosé d'accueil..."
              value={privateNotes}
              onChange={e => setPrivateNotes(e.target.value)}
              className="w-full p-1.5 bg-stone-50 border border-stone-300 rounded text-xs"
            />
          </div>

          <label className="flex items-center space-x-2 cursor-pointer font-bold text-stone-800">
            <input
              type="checkbox"
              checked={vipTag}
              onChange={e => setVipTag(e.target.checked)}
              className="w-3.5 h-3.5 text-[#4A6741] rounded cursor-pointer"
            />
            <span>Marquer comme client VIP</span>
          </label>

          <div className="flex justify-end space-x-2 pt-2 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 font-medium rounded text-stone-700 cursor-pointer text-xs"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#4A6741] hover:bg-[#3d5636] text-white font-medium rounded shadow-2xs cursor-pointer text-xs"
            >
              Sauvegarder le client
            </button>
          </div>
        </form>
      </div>
    </div>
  );

};
