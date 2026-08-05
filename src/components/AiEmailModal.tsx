import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Mail, Copy, Check, Send } from 'lucide-react';

interface AiEmailModalProps {
  onClose: () => void;
}

export const AiEmailModal: React.FC<AiEmailModalProps> = ({ onClose }) => {
  const { bookings } = useApp();

  const [selectedBookingId, setSelectedBookingId] = useState<string>(bookings[0]?.id || '');
  const [emailType, setEmailType] = useState<'confirmation' | 'welcome' | 'thank_you'>('confirmation');
  const [loading, setLoading] = useState(false);
  const [emailText, setEmailText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedBooking = bookings.find(b => b.id === selectedBookingId);

  const handleGenerateEmail = async () => {
    if (!selectedBooking) return;

    setLoading(true);
    setEmailText(null);

    try {
      const res = await fetch("/api/ai/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: selectedBooking.guestName,
          bookingNumber: selectedBooking.bookingNumber,
          roomName: selectedBooking.roomName,
          checkIn: selectedBooking.checkIn,
          checkOut: selectedBooking.checkOut,
          type: emailType
        })
      });
      const data = await res.json();
      if (data.success) {
        setEmailText(data.emailContent);
      } else {
        alert("Impossible de générer l'e-mail.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur lors de la génération de l'e-mail.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (emailText) {
      navigator.clipboard.writeText(emailText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-stone-200 text-xs my-8">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h2 className="font-serif font-bold text-lg text-stone-900">Rédacteur d'E-mails d'Accueil IA</h2>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl font-bold cursor-pointer">×</button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Sélectionnez la réservation concernée</label>
            <select
              value={selectedBookingId}
              onChange={e => setSelectedBookingId(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900"
            >
              {bookings.map(b => (
                <option key={b.id} value={b.id}>
                  {b.bookingNumber} — {b.guestName} ({b.roomName}, {b.checkIn})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Type d'e-mail à rédiger</label>
            <select
              value={emailType}
              onChange={e => setEmailType(e.target.value as any)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900"
            >
              <option value="confirmation">Confirmation de réservation & Accompte</option>
              <option value="welcome">Livret d'accueil & Consignes d'arrivée (Check-in)</option>
              <option value="thank_you">Remerciements après le séjour & Demande d'avis</option>
            </select>
          </div>

          <button
            onClick={handleGenerateEmail}
            disabled={loading}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow cursor-pointer transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{loading ? "Rédaction de l'e-mail personnalisé..." : "Rédiger l'e-mail avec l'IA"}</span>
          </button>
        </div>

        {emailText && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-700">Aperçu du message rédigé :</span>
              <button
                onClick={handleCopy}
                className="text-amber-800 hover:text-amber-900 font-bold flex items-center space-x-1 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copié dans le presse-papier !" : "Copier le texte"}</span>
              </button>
            </div>

            <textarea
              rows={10}
              readOnly
              value={emailText}
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl font-sans text-stone-800 leading-relaxed focus:outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};
