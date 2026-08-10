import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Check,
  X,
  CreditCard,
  Zap,
  ShieldCheck,
  Star,
  CheckCircle2,
  Calendar,
  Lock,
  ArrowRight,
  Gift,
  HelpCircle
} from 'lucide-react';
import { SubscriptionPlanId } from '../types';

interface SubscriptionModalProps {
  onClose: () => void;
  initialTargetPlan?: 'pro' | 'premium';
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  onClose,
  initialTargetPlan
}) => {
  const { settings, updateSubscription, startProTrial, cancelSubscription } = useApp();
  const currentSub = settings.subscription || {
    planId: 'free',
    planName: 'Formule Découverte (Gratuit)',
    status: 'active',
    billingCycle: 'monthly',
    priceEuro: 0,
    startDate: '2026-08-01',
    renewalDate: 'Sans engagement'
  };

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<SubscriptionPlanId | null>(null);
  const [stripeConfigured, setStripeConfigured] = useState(false);

  // Check if backend has Stripe keys
  React.useEffect(() => {
    fetch('/api/stripe/config')
      .then(res => res.json())
      .then(data => {
        if (data.configured) {
          setStripeConfigured(true);
        }
      })
      .catch(() => {});
  }, []);

  // Simulated Checkout Form state
  const [cardName, setCardName] = useState(settings.ownerName || 'Titulaire de la carte');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExp, setCardExp] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('123');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const handleStartTrial = () => {
    startProTrial();
    onClose();
  };

  const handleOpenCheckout = async (planId: SubscriptionPlanId) => {
    if (stripeConfigured) {
      try {
        setIsProcessing(true);
        const response = await fetch('/api/stripe/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planId,
            billingCycle,
            successUrl: window.location.origin,
            cancelUrl: window.location.origin
          })
        });
        const data = await response.json();
        setIsProcessing(false);
        if (data.success && data.url) {
          window.location.href = data.url;
          return;
        }
      } catch (e) {
        setIsProcessing(false);
      }
    }
    setSelectedPlanForCheckout(planId);
  };

  const handleConfirmCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const last4 = cardNumber.replace(/\s/g, '').slice(-4) || '4242';
      if (selectedPlanForCheckout) {
        updateSubscription(selectedPlanForCheckout, billingCycle, last4);
      }
      setCheckoutSuccess(true);
    }, 1200);
  };

  const isProActive = currentSub.planId.startsWith('pro');
  const isPremiumActive = currentSub.planId.startsWith('premium');
  const isFree = currentSub.planId === 'free';
  const isTrial = currentSub.status === 'trialing';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-4xl my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-[#2D3436] text-white p-4 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-white bg-stone-800/60 p-1.5 rounded-full transition cursor-pointer"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-amber-400 font-mono text-[11px] uppercase tracking-wider font-bold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Formules & Abonnements SaaS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif mt-1 text-stone-100">
            Choisissez l'offre adaptée à votre Gîte ou Chambre d'Hôtes
          </h2>
          <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
            Démarrez gratuitement sans carte bancaire, puis passez à la formule Pro pour débloquer les hébergements illimités, la synchronisation iCal et l'assistant IA.
          </p>

          {/* Current Status Badge */}
          <div className="mt-3 pt-3 border-t border-stone-700/60 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-stone-400">Abonnement actuel :</span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] flex items-center gap-1 ${
                isTrial ? 'bg-amber-500 text-stone-900' :
                isProActive || isPremiumActive ? 'bg-emerald-500 text-stone-900' :
                'bg-stone-700 text-stone-200'
              }`}>
                <Zap className="w-3.5 h-3.5" />
                {currentSub.planName}
              </span>
            </div>
            {currentSub.renewalDate && (
              <span className="text-[11px] text-stone-400">
                Statut : <strong className="text-stone-200">{currentSub.renewalDate}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        {checkoutSuccess ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-4 max-w-md mx-auto my-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-stone-900 font-serif">Abonnement activé avec succès !</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Félicitations ! Votre formule <strong>{currentSub.planName}</strong> est désormais active. Vous bénéficiez immédiatement de toutes les fonctionnalités avancées.
            </p>
            <div className="bg-stone-50 p-3 rounded border border-stone-200 text-left text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-stone-500">Mode de paiement:</span>
                <span className="font-mono font-medium text-stone-800">Visa •••• {currentSub.paymentMethodLast4 || '4242'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Prochaine échéance:</span>
                <span className="font-medium text-stone-800">{currentSub.renewalDate}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-[#4A6741] hover:bg-[#3d5636] text-white font-bold py-2.5 px-4 rounded-lg text-xs transition cursor-pointer shadow-sm"
            >
              Accéder à mon espace gîte
            </button>
          </div>
        ) : selectedPlanForCheckout ? (
          /* Checkout Modal Step */
          <div className="p-4 sm:p-6">
            <button
              onClick={() => setSelectedPlanForCheckout(null)}
              className="text-xs text-stone-500 hover:text-stone-800 font-medium mb-4 flex items-center gap-1 cursor-pointer"
            >
              &larr; Retour au comparatif des offres
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Plan Summary */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                <h3 className="font-bold text-stone-900 text-sm font-serif">Récapitulatif de la commande</h3>
                <div className="bg-white p-3 rounded border border-stone-200 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-stone-800">
                      {selectedPlanForCheckout.startsWith('pro') ? 'Formule Pro' : 'Formule Domaine'}
                    </span>
                    <span className="font-bold text-stone-900">
                      {billingCycle === 'yearly' ?
                        (selectedPlanForCheckout.startsWith('pro') ? '180,00 € TTC / an' : '384,00 € TTC / an') :
                        (selectedPlanForCheckout.startsWith('pro') ? '19,00 € TTC / mois' : '39,00 € TTC / mois')
                      }
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Facturation {billingCycle === 'yearly' ? 'annuelle (2 mois offerts inclus)' : 'mensuelle sans engagement'}.
                  </p>
                </div>

                <div className="space-y-1.5 text-[11px] text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Accès immédiat à toutes les fonctionnalités</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Chambres et réservations illimitées</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Résiliez ou modifiez à tout moment en 1 clic</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 text-amber-800 rounded border border-amber-200 text-[11px] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Garantie satisfait ou remboursé 14 jours</span>
                </div>
              </div>

              {/* Payment Card Form */}
              <form onSubmit={handleConfirmCheckout} className="space-y-3">
                <h3 className="font-bold text-stone-900 text-sm font-serif flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#4A6741]" />
                  Paiement sécurisé par carte
                </h3>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Nom sur la carte</label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded text-xs focus:ring-1 focus:ring-[#4A6741] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Numéro de Carte Bancaire</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-1.5 border border-stone-300 rounded text-xs focus:ring-1 focus:ring-[#4A6741] outline-none font-mono"
                      maxLength={19}
                    />
                    <Lock className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-2.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Expiration (MM/YY)</label>
                    <input
                      type="text"
                      required
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      placeholder="08/28"
                      className="w-full px-3 py-1.5 border border-stone-300 rounded text-xs focus:ring-1 focus:ring-[#4A6741] outline-none font-mono text-center"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">CVC / Cryptogramme</label>
                    <input
                      type="text"
                      required
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="123"
                      className="w-full px-3 py-1.5 border border-stone-300 rounded text-xs focus:ring-1 focus:ring-[#4A6741] outline-none font-mono text-center"
                      maxLength={4}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-[#4A6741] hover:bg-[#3d5636] text-white font-bold py-2.5 px-4 rounded-lg text-xs transition cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span>Validation sécurisée...</span>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Valider et Payer {billingCycle === 'yearly' ? (selectedPlanForCheckout.startsWith('pro') ? '180,00 €' : '384,00 €') : (selectedPlanForCheckout.startsWith('pro') ? '19,00 €' : '39,00 €')}</span>
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-stone-400 text-center mt-2 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Paiement chiffré SSL 256 bits • Annulation à tout moment
                  </p>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Main Pricing Grid */
          <div className="p-4 sm:p-6 space-y-6">
            
            {/* Billing Switcher Toggle */}
            <div className="flex items-center justify-center space-x-3 bg-stone-100 p-1.5 rounded-xl max-w-sm mx-auto border border-stone-200">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Mensuel
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 ${
                  billingCycle === 'yearly'
                    ? 'bg-[#4A6741] text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <span>Annuel</span>
                <span className="bg-amber-400 text-stone-900 text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase">
                  -20%
                </span>
              </button>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* CARD 1: GRATUIT */}
              <div className={`rounded-xl border p-4 sm:p-5 flex flex-col justify-between transition-all ${
                isFree && !isTrial
                  ? 'bg-stone-50 border-stone-400 ring-2 ring-stone-300'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}>
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-stone-900 text-base font-serif">Gratuit</h3>
                      <p className="text-[11px] text-stone-500">Pour débuter la gestion de votre hébergement</p>
                    </div>
                  </div>

                  <div className="my-4">
                    <span className="text-3xl font-extrabold text-stone-900">0 €</span>
                    <span className="text-xs text-stone-500"> / mois</span>
                  </div>

                  <ul className="space-y-2 text-xs text-stone-700 my-4 border-t border-stone-100 pt-3">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Jusqu'à <strong>5 chambres</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>10 réservations / mois</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Planning & Facturation de base</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Application mobile PWA incluses</span>
                    </li>
                    <li className="flex items-center gap-2 text-stone-400 line-through">
                      <X className="w-3.5 h-3.5 shrink-0" />
                      <span>Synchronisation iCal (Airbnb/Booking)</span>
                    </li>
                    <li className="flex items-center gap-2 text-stone-400 line-through">
                      <X className="w-3.5 h-3.5 shrink-0" />
                      <span>Assistant Menus & E-mails IA</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2">
                  {isFree && !isTrial ? (
                    <button
                      disabled
                      className="w-full bg-stone-200 text-stone-600 font-bold py-2 px-3 rounded text-xs cursor-default text-center"
                    >
                      Votre formule actuelle
                    </button>
                  ) : (
                    <button
                      onClick={cancelSubscription}
                      className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-2 px-3 rounded text-xs transition cursor-pointer text-center"
                    >
                      Revenir au plan gratuit
                    </button>
                  )}
                </div>
              </div>

              {/* CARD 2: PRO (MOST POPULAR) */}
              <div className={`rounded-xl border-2 p-4 sm:p-5 flex flex-col justify-between relative shadow-md transition-all ${
                isProActive
                  ? 'bg-emerald-50/50 border-[#4A6741] ring-2 ring-[#4A6741]/20'
                  : 'bg-white border-[#4A6741]'
              }`}>
                {/* Popular Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4A6741] text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                  <span>Formule Recommandée</span>
                </div>

                <div>
                  <div className="flex justify-between items-start pt-1">
                    <div>
                      <h3 className="font-bold text-stone-900 text-base font-serif flex items-center gap-1.5">
                        <span>Formule Pro</span>
                        <Zap className="w-4 h-4 text-amber-500 fill-amber-400" />
                      </h3>
                      <p className="text-[11px] text-stone-500">Gîtes, chambres d'hôtes & tables d'hôtes actives</p>
                    </div>
                  </div>

                  <div className="my-4">
                    {billingCycle === 'yearly' ? (
                      <div>
                        <span className="text-3xl font-extrabold text-stone-900">15 €</span>
                        <span className="text-xs text-stone-500"> / mois</span>
                        <p className="text-[10px] text-emerald-700 font-bold mt-0.5">180 € facturés par an (2 mois offerts !)</p>
                      </div>
                    ) : (
                      <div>
                        <span className="text-3xl font-extrabold text-stone-900">19 €</span>
                        <span className="text-xs text-stone-500"> / mois</span>
                        <p className="text-[10px] text-stone-500 mt-0.5">Sans engagement, résiliable à tout moment</p>
                      </div>
                    )}
                  </div>

                  <ul className="space-y-2 text-xs text-stone-800 my-4 border-t border-stone-100 pt-3">
                    <li className="flex items-center gap-2 font-bold text-emerald-800">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Chambres & Hébergements <strong>ILLIMITÉS</strong></span>
                    </li>
                    <li className="flex items-center gap-2 font-bold text-emerald-800">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Réservations <strong>ILLIMITÉES</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Synchronisation iCal Airbnb, Booking, Abritel</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Générateur de Menus & Recettes IA (Gemini)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Assistant e-mail & réponses clients automatisées</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Facturation pro, taxe de séjour & Acomptes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Exports comptables CSV / Excel</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2 space-y-2">
                  {isProActive ? (
                    <button
                      disabled
                      className="w-full bg-emerald-700 text-white font-bold py-2 px-3 rounded text-xs cursor-default text-center flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Formule Pro Active</span>
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleOpenCheckout(billingCycle === 'yearly' ? 'pro_yearly' : 'pro_monthly')}
                        className="w-full bg-[#4A6741] hover:bg-[#3d5636] text-white font-bold py-2.5 px-3 rounded-lg text-xs transition cursor-pointer shadow-sm text-center flex items-center justify-center gap-1.5"
                      >
                        <span>S'abonner à la Formule Pro</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      {isFree && (
                        <button
                          type="button"
                          onClick={handleStartTrial}
                          className="w-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold py-1.5 px-3 rounded text-[11px] transition cursor-pointer text-center flex items-center justify-center gap-1 border border-amber-300"
                        >
                          <Gift className="w-3.5 h-3.5 text-amber-700" />
                          <span>Essai gratuit 14 jours (Sans CB)</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* CARD 3: DOMAINE / PREMIUM */}
              <div className={`rounded-xl border p-4 sm:p-5 flex flex-col justify-between transition-all ${
                isPremiumActive
                  ? 'bg-amber-50/50 border-amber-400 ring-2 ring-amber-300'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}>
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-stone-900 text-base font-serif">Domaine & Équipe</h3>
                      <p className="text-[11px] text-stone-500">Pour grands domaines & équipes multi-utilisateurs</p>
                    </div>
                  </div>

                  <div className="my-4">
                    {billingCycle === 'yearly' ? (
                      <div>
                        <span className="text-3xl font-extrabold text-stone-900">32 €</span>
                        <span className="text-xs text-stone-500"> / mois</span>
                        <p className="text-[10px] text-emerald-700 font-bold mt-0.5">384 € facturés par an</p>
                      </div>
                    ) : (
                      <div>
                        <span className="text-3xl font-extrabold text-stone-900">39 €</span>
                        <span className="text-xs text-stone-500"> / mois</span>
                        <p className="text-[10px] text-stone-500 mt-0.5">Sans engagement</p>
                      </div>
                    )}
                  </div>

                  <ul className="space-y-2 text-xs text-stone-700 my-4 border-t border-stone-100 pt-3">
                    <li className="flex items-center gap-2 font-bold text-stone-900">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Tout ce qui est dans la formule Pro</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Accès Multi-utilisateurs (Gérant, Réception, Ménage)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Marque Blanche sur les factures PDF</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Rapports financiers avancés & prévisions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Support prioritaire par e-mail et téléphone 7j/7</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2">
                  {isPremiumActive ? (
                    <button
                      disabled
                      className="w-full bg-amber-600 text-white font-bold py-2 px-3 rounded text-xs cursor-default text-center flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Formule Domaine Active</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenCheckout(billingCycle === 'yearly' ? 'premium_yearly' : 'premium_monthly')}
                      className="w-full bg-stone-800 hover:bg-stone-900 text-white font-bold py-2 px-3 rounded text-xs transition cursor-pointer text-center"
                    >
                      Choisir l'offre Domaine
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* FAQ / Trust footer */}
            <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200 text-stone-600 text-[11px] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#4A6741] shrink-0" />
                <span>Facturation transparente. Changez ou annulez votre formule à tout moment depuis vos paramètres.</span>
              </div>
              <div className="font-semibold text-stone-800">
                Support client : contact@masdeslavandes-gordes.fr
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
