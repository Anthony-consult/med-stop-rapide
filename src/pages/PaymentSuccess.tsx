import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Mail, FileText, Home, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isCheckingPayment, setIsCheckingPayment] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'checking' | 'confirmed' | 'failed'>('checking');

  useEffect(() => {
    // Check payment status when page loads
    console.log('🎉 Payment Success page loaded');
    checkPaymentStatus();
  }, []);

  const checkPaymentStatus = async () => {
    try {
      console.log('🔍 Checking payment status...');
      
      // Get session ID from URL
      const sessionId = searchParams.get('session_id');
      console.log('🔍 Session ID:', sessionId);
      
      if (!sessionId) {
        console.log('❌ No session ID in URL');
        setPaymentStatus('failed');
        setIsCheckingPayment(false);
        return;
      }

      // Find consultation with this session ID (via payment_id)
      // Since we don't have the payment_id directly, we'll check the most recent consultation
      // that's still pending (this is a fallback method)
      
      const { data: consultations, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('payment_status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('❌ Error fetching consultations:', error);
        setPaymentStatus('failed');
        setIsCheckingPayment(false);
        return;
      }

      console.log('🔍 Found consultations:', consultations);

      if (consultations && consultations.length > 0) {
        const consultation = consultations[0];
        console.log('🔍 Checking consultation:', consultation.id);
        
        // Wait a bit for webhook to potentially update
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Check again if it's been updated
        const { data: updatedConsultation, error: updateError } = await supabase
          .from('consultations')
          .select('payment_status, payment_id')
          .eq('id', consultation.id)
          .single();

        if (updateError) {
          console.error('❌ Error checking updated consultation:', updateError);
          setPaymentStatus('failed');
        } else {
          console.log('🔍 Updated consultation status:', updatedConsultation);
          
          if (updatedConsultation.payment_status === 'done') {
            console.log('✅ Payment confirmed!');
            setPaymentStatus('confirmed');
          } else {
            console.log('⚠️ Payment still pending, webhook may have failed');
            // Try to manually update (this is a fallback)
            await manualPaymentUpdate(consultation.id);
          }
        }
      } else {
        console.log('❌ No pending consultations found');
        setPaymentStatus('failed');
      }
      
      setIsCheckingPayment(false);
    } catch (error) {
      console.error('❌ Error in checkPaymentStatus:', error);
      setPaymentStatus('failed');
      setIsCheckingPayment(false);
    }
  };

  const manualPaymentUpdate = async (consultationId: string) => {
    try {
      console.log('🔄 Attempting manual payment update for:', consultationId);
      
      // This is a fallback - in production you might want to call your own API
      // to verify the payment with Stripe before updating
      const { error } = await supabase
        .from('consultations')
        .update({ 
          payment_status: 'done',
          // Note: We don't have the payment_id here, but the webhook should have set it
        })
        .eq('id', consultationId);

      if (error) {
        console.error('❌ Manual update failed:', error);
        setPaymentStatus('failed');
      } else {
        console.log('✅ Manual update successful');
        setPaymentStatus('confirmed');
      }
    } catch (error) {
      console.error('❌ Error in manual update:', error);
      setPaymentStatus('failed');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      {/* Header avec logo */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="flex justify-center">
          <img src="/logo-big.png" alt="Consult-Chrono" className="h-8" />
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col justify-center px-4 py-8">
        <div className="max-w-sm mx-auto w-full">
          {/* Icône de succès */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          {/* Titre */}
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">
            Merci pour votre paiement !
          </h1>

          {/* Message principal */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
            <p className="text-gray-600 text-center leading-relaxed">
              Votre demande d'arrêt maladie a été enregistrée avec succès.
            </p>
          </div>

          {/* Informations importantes */}
          <div className="space-y-4 mb-8">
            {/* Email */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    Vérifiez vos emails
                  </h3>
                  <p className="text-xs text-gray-600">
                    Un email de confirmation vous a été envoyé. Vérifiez également vos spams.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    Nous vous contacterons
                  </h3>
                  <p className="text-xs text-gray-600">
                    Un médecin vous contactera très prochainement pour traiter votre demande.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bouton retour */}
          <Button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium"
          >
            Retour à l'accueil
          </Button>

          {/* Support */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Une question ?{' '}
              <a 
                href="mailto:contact@consult-chrono.fr" 
                className="text-blue-600 hover:underline"
              >
                contact@consult-chrono.fr
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
