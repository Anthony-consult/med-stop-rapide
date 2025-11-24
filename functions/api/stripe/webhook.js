// Cloudflare Pages Function - Stripe Webhook
// Format: Cloudflare Workers

import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export async function onRequestPost(context) {
  const { request, env } = context;
  
  console.log('🔔 Webhook called - Method: POST');
  
  // Debug environment variables
  console.log('🔍 Environment check:');
  console.log('🔍 STRIPE_SECRET_KEY exists:', !!env.STRIPE_SECRET_KEY);
  console.log('🔍 STRIPE_WEBHOOK_SECRET exists:', !!env.STRIPE_WEBHOOK_SECRET);
  console.log('🔍 VITE_SUPABASE_URL exists:', !!env.VITE_SUPABASE_URL);
  console.log('🔍 SUPABASE_SERVICE_ROLE_KEY exists:', !!env.SUPABASE_SERVICE_ROLE_KEY);

  // Initialize Stripe
  const stripeSecretKey = env.STRIPE_SECRET_KEY || '';
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

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

  if (!webhookSecret) {
    console.error('❌ STRIPE_WEBHOOK_SECRET not configured');
    return new Response(
      JSON.stringify({ error: 'Webhook secret not configured' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16',
  });

  // Initialize Supabase
  const supabaseUrl = env.VITE_SUPABASE_URL || '';
  const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Supabase not configured');
    return new Response(
      JSON.stringify({ error: 'Supabase not configured' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Get raw body and signature
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  console.log('🔑 Webhook secret exists:', !!webhookSecret);
  console.log('🔑 Signature exists:', !!sig);

  let event;

  try {
    // Verify webhook signature
    console.log('🔐 Verifying signature...');
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log('✅ Signature verified successfully');
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return new Response(
      JSON.stringify({ error: `Webhook Error: ${err.message}` }),
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // Handle the event
  console.log('📥 Stripe webhook event:', event.type);
  console.log('📥 Event ID:', event.id);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        console.log('💰 CHECKOUT SESSION COMPLETED');
        console.log('💰 Session ID:', session.id);
        console.log('💰 Payment status:', session.payment_status);
        console.log('💰 Metadata keys:', Object.keys(session.metadata || {}));
        
        const paymentIntentId = session.payment_intent;
        const metadata = session.metadata || {};
        
        // Get consultation ID from metadata
        const consultationId = metadata.consultation_id;
        
        console.log('🔍 Consultation ID from metadata:', consultationId);
        
        if (!consultationId) {
          console.error('❌ No consultation ID found in metadata');
          return new Response(
            JSON.stringify({ error: 'No consultation ID in metadata' }),
            { 
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }

        console.log('📝 Attempting to update Supabase...');
        
        // Update existing consultation
        const { data, error } = await supabase
          .from('consultations')
          .update({
            payment_status: 'done',
            payment_id: paymentIntentId,
          })
          .eq('id', consultationId)
          .select()
          .single();

        if (error) {
          console.error('❌ SUPABASE ERROR:', error);
          throw error;
        }

        console.log('✅ PAYMENT STATUS UPDATED SUCCESSFULLY!');
        console.log('✅ Consultation ID:', data.id);
        console.log('✅ Payment status:', data.payment_status);
        
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.log('❌ Payment failed:', paymentIntent.id);
        break;
      }

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('❌ Error handling webhook:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

