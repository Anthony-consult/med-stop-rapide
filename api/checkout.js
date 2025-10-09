// API Checkout - Creates Stripe Checkout Session
// Called from Step20 when user clicks "Pay"

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export const config = {
  api: {
    bodyParser: true, // We need to parse JSON body
  },
};

export default async function handler(req, res) {
  console.log('💳 /api/checkout called - Method:', req.method);
  
  if (req.method !== 'POST') {
    console.log('❌ Wrong method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { formData } = req.body;

    if (!formData) {
      console.error('❌ No formData provided');
      return res.status(400).json({ error: 'Form data is required' });
    }

    console.log('📝 Form data received:', {
      email: formData.email,
      nom_prenom: formData.nom_prenom,
      fieldsCount: Object.keys(formData).length
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Arrêt de travail médical',
              description: 'Consultation médicale en ligne - Arrêt de travail',
            },
            unit_amount: 1400, // 14.00 EUR in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      
      // Customer email
      customer_email: formData.email || undefined,
      
      // Store ALL form data in metadata (Stripe limit: 500 chars per value, 50 keys)
      // We'll use a single metadata key with JSON stringified data
      metadata: {
        formData: JSON.stringify(formData),
      },
      
      // Success and cancel URLs
      success_url: 'https://consult-chrono.fr/payment/success',
      cancel_url: 'https://consult-chrono.fr/',
      
      // Automatic tax calculation (optional)
      // automatic_tax: { enabled: false },
    });

    console.log('✅ Stripe session created:', session.id);
    console.log('🔗 Checkout URL:', session.url);

    // Return the session URL to redirect user
    return res.status(200).json({
      url: session.url,
      sessionId: session.id,
    });

  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    return res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: error.message 
    });
  }
}

