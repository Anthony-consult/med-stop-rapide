// Cloudflare Pages Function - Stripe Checkout
// Format: Cloudflare Workers (not Vercel)

import Stripe from 'stripe';

export async function onRequestPost(context) {
  const { request, env } = context;
  
  console.log('💳 /api/checkout called - Method: POST');
  
  try {
    // Parse request body
    const body = await request.json();
    const { formData, consultationId } = body;

    if (!formData) {
      console.error('❌ No formData provided');
      return new Response(
        JSON.stringify({ error: 'Form data is required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('📋 Consultation ID received:', consultationId);
    console.log('📝 Form data received:', {
      email: formData.email,
      nom_prenom: formData.nom_prenom,
      fieldsCount: Object.keys(formData).length
    });

    // Initialize Stripe
    const stripeSecretKey = env.STRIPE_SECRET_KEY || '';
    if (!stripeSecretKey) {
      console.error('❌ STRIPE_SECRET_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Stripe not configured' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
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
    const priceId = env.STRIPE_PRICE_ID || 'price_1SG0iHHo4fFKK68LxMXXr2EN';
    
    console.log('💰 Using Stripe Price ID:', priceId);

    // Get success and cancel URLs from env or use defaults
    const successUrl = env.STRIPE_SUCCESS_URL || 'https://med-stop-rapide.pages.dev/payment/success?session_id={CHECKOUT_SESSION_ID}';
    const cancelUrl = env.STRIPE_CANCEL_URL || 'https://med-stop-rapide.pages.dev/';

    // Create Stripe Checkout Session
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
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    console.log('✅ Stripe session created:', session.id);
    console.log('🔗 Checkout URL:', session.url);

    // Return the session URL to redirect user
    return new Response(
      JSON.stringify({
        url: session.url,
        sessionId: session.id,
      }),
      {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );

  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create checkout session',
        message: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle OPTIONS for CORS
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

