// Test endpoint pour simuler un webhook Stripe
export default async function handler(req, res) {
  console.log('🧪 TEST STRIPE WEBHOOK CALLED');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Simule un événement checkout.session.completed
    const mockEvent = {
      id: 'evt_test_webhook',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_manual',
          payment_status: 'paid',
          payment_intent: 'pi_test_manual',
          metadata: {
            consultation_id: 'test-consultation-id',
            chunks_count: '1',
            chunk_0: JSON.stringify({
              email: 'test@example.com',
              nom_prenom: 'Test User',
              maladie_presumee: 'Grippe',
              // ... autres champs de test
            })
          }
        }
      }
    };

    console.log('🧪 Mock event:', JSON.stringify(mockEvent, null, 2));

    // Appelle le vrai webhook avec les données mockées
    const webhookUrl = '/api/stripe/webhook';
    
    // Pour ce test, on va juste logger ce qui se passerait
    console.log('🧪 Would call webhook with mock data');
    
    return res.status(200).json({ 
      message: 'Mock webhook test completed',
      mockEvent: mockEvent
    });

  } catch (error) {
    console.error('❌ Test webhook error:', error);
    return res.status(500).json({ error: error.message });
  }
}
