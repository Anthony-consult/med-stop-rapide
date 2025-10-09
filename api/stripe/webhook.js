// Stripe Webhook Handler for Payment Confirmation
// This endpoint receives Stripe webhook events and updates the payment status in Supabase

import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Initialize Supabase with service role key (bypasses RLS)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export const config = {
  api: {
    bodyParser: false, // Stripe needs raw body for signature verification
  },
};

export default async function handler(req, res) {
  console.log('🔔 Webhook called - Method:', req.method);
  console.log('🔔 Headers:', JSON.stringify(req.headers, null, 2));
  
  if (req.method !== 'POST') {
    console.log('❌ Wrong method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get raw body for signature verification
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  console.log('🔑 Webhook secret exists:', !!webhookSecret);
  console.log('🔑 Signature exists:', !!sig);

  if (!webhookSecret) {
    console.error('❌ STRIPE_WEBHOOK_SECRET not configured');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event;

  try {
    // Verify webhook signature
    console.log('🔐 Verifying signature...');
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    console.log('✅ Signature verified successfully');
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    console.error('❌ Error details:', err);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  console.log('📥 Stripe webhook event:', event.type);
  console.log('📥 Event ID:', event.id);
  console.log('📥 Event data:', JSON.stringify(event.data, null, 2));

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        console.log('💰 CHECKOUT SESSION COMPLETED');
        console.log('💰 Session ID:', session.id);
        console.log('💰 Payment status:', session.payment_status);
        console.log('💰 Payment intent:', session.payment_intent);
        console.log('💰 Metadata keys:', Object.keys(session.metadata || {}));
        
        const paymentIntentId = session.payment_intent;
        const metadata = session.metadata || {};
        
        // Get consultation ID from metadata (plus simple et fiable)
        const consultationId = metadata.consultation_id;
        
        console.log('🔍 Consultation ID from metadata:', consultationId);
        
        if (!consultationId) {
          console.error('❌ No consultation ID found in metadata');
          console.error('❌ Metadata keys:', Object.keys(metadata));
          return res.status(400).json({ error: 'No consultation ID in metadata' });
        }

        console.log('📝 Attempting to update Supabase...');
        console.log('📝 Supabase URL:', process.env.VITE_SUPABASE_URL);
        console.log('📝 Service role key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
        
        // Update existing consultation (plus simple et fiable)
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
          console.error('❌ Error code:', error.code);
          console.error('❌ Error message:', error.message);
          console.error('❌ Error details:', error.details);
          console.error('❌ Error hint:', error.hint);
          throw error;
        }

        console.log('✅ PAYMENT STATUS UPDATED SUCCESSFULLY!');
        console.log('✅ Updated data:', JSON.stringify(data, null, 2));
        console.log('✅ Consultation ID:', data.id);
        console.log('✅ Payment status:', data.payment_status);
        
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.log('❌ Payment failed:', paymentIntent.id);
        
        // Optionally update status to 'failed'
        // const consultationId = paymentIntent.metadata?.consultation_id;
        // if (consultationId) {
        //   await supabase
        //     .from('consultations')
        //     .update({ payment_status: 'failed' })
        //     .eq('id', consultationId);
        // }
        
        break;
      }

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('❌ Error handling webhook:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Helper function to get raw body
async function buffer(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}
