// API Checkout - Creates Stripe Checkout Session
// Called from Step20 when user clicks "Pay"

import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';

if (!STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY is not configured in environment variables');
}

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
}) : null;

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

  if (!stripe) {
    console.error('❌ Stripe not initialized - STRIPE_SECRET_KEY missing');
    return res.status(500).json({ 
      error: 'Stripe not configured',
      message: 'STRIPE_SECRET_KEY environment variable is required'
    });
  }

  try {
    console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
    const { formData, consultationId } = req.body;

    if (!formData) {
      console.error('❌ No formData provided');
      console.error('❌ Request body keys:', Object.keys(req.body || {}));
      return res.status(400).json({ error: 'Form data is required' });
    }

    console.log('📋 Consultation ID received:', consultationId);

    console.log('📝 Form data received:', {
      email: formData.email,
      nom_prenom: formData.nom_prenom,
      fieldsCount: Object.keys(formData).length
    });

    // Stripe metadata limit: 500 chars per value, 50 keys max
    // Split form data into multiple metadata keys
    const formDataJson = JSON.stringify(formData);
    const chunkSize = 450; // Leave margin for safety
    const chunks = [];
    
    for (let i = 0; i < formDataJson.length; i += chunkSize) {
      chunks.push(formDataJson.substring(i, i + chunkSize));
    }
    
    console.log('📦 Splitting formData into', chunks.length, 'chunks');
    
    // Build metadata object with chunked data
    const metadata = {
      chunks_count: chunks.length.toString(),
    };
    
    chunks.forEach((chunk, index) => {
      metadata[`chunk_${index}`] = chunk;
    });

    console.log('📦 Metadata keys:', Object.keys(metadata));

    // Get price ID from environment variable or use default
    const priceId = process.env.STRIPE_PRICE_ID || 'price_1SG0iHHo4fFKK68LxMXXr2EN';
    
    console.log('💰 Using Stripe Price ID:', priceId);

    // Create Stripe Checkout Session
    console.log('🔄 Creating Stripe checkout session...');
    console.log('🔄 Price ID:', priceId);
    console.log('🔄 Customer email:', formData.email);
    console.log('🔄 Consultation ID:', consultationId);
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      
      // Customer email
      customer_email: formData.email || undefined,
      
      // Store form data split into chunks + consultation ID
      metadata: {
        ...metadata,
        consultation_id: consultationId, // ID pour le webhook
      },
      
      // Success and cancel URLs
      success_url: 'https://consult-chrono.fr/payment/success?session_id={CHECKOUT_SESSION_ID}',
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
    console.error('❌ Error details:', {
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode,
      stack: error.stack
    });
    
    // S'assurer qu'on renvoie toujours une réponse JSON valide
    if (!res.headersSent) {
    return res.status(500).json({ 
      error: 'Failed to create checkout session',
        message: error.message,
        type: error.type || 'Unknown',
        code: error.code || 'UNKNOWN_ERROR'
    });
    } else {
      console.error('⚠️ Response already sent, cannot send error response');
    }
  }
}

