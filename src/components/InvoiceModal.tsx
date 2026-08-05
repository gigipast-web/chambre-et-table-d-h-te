import React from 'react';
import { Invoice } from '../types';
import { useApp } from '../context/AppContext';
import { Printer, Download, X, CheckCircle2, ShieldCheck } from 'lucide-react';

interface InvoiceModalProps {
  invoice: Invoice;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ invoice, onClose }) => {
  const { settings } = useApp();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-stone-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-stone-200 relative my-8 text-stone-800">
        {/* Action Header - Screen Only */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 print:hidden">
          <div className="flex items-center space-x-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
              invoice.type === 'devis' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
            }`}>
              {invoice.type === 'devis' ? 'Devis Officiel' : 'Facture d\'Hébergement'}
            </span>
            <span className="font-mono text-xs font-bold text-stone-500">{invoice.number}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-xs transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 text-xl font-bold cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE DOCUMENT BODY */}
        <div className="space-y-6 pt-4 text-xs font-sans">
          {/* Header info */}
          <div className="flex justify-between items-start border-b border-stone-200 pb-6">
            <div>
              <h2 className="font-serif font-bold text-xl text-stone-900">{settings.name}</h2>
              <p className="text-stone-600 mt-1">{settings.ownerName}</p>
              <p className="text-stone-500">{settings.address}</p>
              <p className="text-stone-500">Tél : {settings.phone} • {settings.email}</p>
              <p className="text-[11px] text-stone-400 font-mono mt-1">SIRET : {settings.siret} • TVA : {settings.tvaNumber}</p>
            </div>

            <div className="text-right space-y-1">
              <h1 className="font-serif font-bold text-2xl text-amber-950 uppercase tracking-tight">
                {invoice.type === 'devis' ? 'DEVIS' : 'FACTURE'}
              </h1>
              <p className="font-mono font-bold text-sm text-amber-900">{invoice.number}</p>
              <p className="text-stone-500">Date d'émission : <strong>{invoice.date}</strong></p>
              <p className="text-stone-500">Échéance : <strong>{invoice.dueDate}</strong></p>
            </div>
          </div>

          {/* Guest Box */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Facturé à :</p>
              <h3 className="font-serif font-bold text-sm text-stone-900">{invoice.guestName}</h3>
              <p className="text-stone-600">{invoice.guestAddress || "Adresse non spécifiée"}</p>
              <p className="text-stone-500">{invoice.guestEmail}</p>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Statut du paiement :</p>
              <span className={`inline-block px-2.5 py-1 rounded-md font-bold text-xs ${
                invoice.status === 'paid'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                {invoice.status === 'paid' ? '✔ Payée intégralement' : 'Acompte versé / Solde dû'}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left border-collapse border border-stone-200">
            <thead>
              <tr className="bg-stone-100 font-bold text-stone-700 border-b border-stone-200 font-mono">
                <th className="p-2.5 border-r border-stone-200">Désignation des prestations</th>
                <th className="p-2.5 border-r border-stone-200 text-center w-16">Qté</th>
                <th className="p-2.5 border-r border-stone-200 text-right w-24">Prix Unit. (€)</th>
                <th className="p-2.5 border-r border-stone-200 text-center w-16">TVA</th>
                <th className="p-2.5 text-right w-28">Total TTC (€)</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (
                <tr key={idx} className="border-b border-stone-200 hover:bg-stone-50/50">
                  <td className="p-2.5 border-r border-stone-200 font-medium text-stone-900">{item.description}</td>
                  <td className="p-2.5 border-r border-stone-200 text-center font-mono">{item.quantity}</td>
                  <td className="p-2.5 border-r border-stone-200 text-right font-mono">{item.unitPrice.toFixed(2)}</td>
                  <td className="p-2.5 border-r border-stone-200 text-center font-mono">{item.tvaRate}%</td>
                  <td className="p-2.5 text-right font-bold text-stone-900 font-mono">{item.totalPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals & Payments */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-2 bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Sous-total HT :</span>
                <span className="font-mono">{invoice.subtotal.toFixed(2)} €</span>
              </div>

              <div className="flex justify-between text-stone-600">
                <span>TVA collectée :</span>
                <span className="font-mono">{invoice.tvaTotal.toFixed(2)} €</span>
              </div>

              {invoice.touristTaxTotal > 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>Taxe de séjour (exonérée TVA) :</span>
                  <span className="font-mono">{invoice.touristTaxTotal.toFixed(2)} €</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-sm pt-2 border-t border-stone-200 text-stone-900">
                <span>Total TTC :</span>
                <span className="font-serif text-base text-amber-950">{invoice.totalTTC.toFixed(2)} €</span>
              </div>

              <div className="pt-2 border-t border-stone-200 space-y-1 text-emerald-800 font-medium text-[11px]">
                <div className="flex justify-between">
                  <span>Acompte déjà perçu :</span>
                  <span className="font-mono">{invoice.depositPaid.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between font-bold text-xs text-rose-700">
                  <span>Solde restant dû :</span>
                  <span className="font-mono">{invoice.balanceDue.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Footers */}
          <div className="pt-6 border-t border-stone-200 text-[10px] text-stone-400 space-y-1 text-center">
            <p>
              Modes de règlement acceptés : Carte Bancaire, Virement, Chèque, Espèces, Chèques Vacances ANCV.
            </p>
            <p>
              {settings.name} • Propriété enregistrée sous le SIRET {settings.siret} • Exonération de pénalités de retard selon conditions légales en vigueur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
