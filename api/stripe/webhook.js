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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get raw body for signature verification
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('❌ STRIPE_WEBHOOK_SECRET not configured');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  console.log('📥 Stripe webhook event:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Get consultation ID from client_reference_id
        const consultationId = session.client_reference_id;
        const paymentIntentId = session.payment_intent;
        
        console.log('✅ Payment successful for consultation:', consultationId);
        
        if (!consultationId) {
          console.error('❌ No consultation ID found in session');
          return res.status(400).json({ error: 'No consultation ID' });
        }

        // Update consultation payment status
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
          console.error('❌ Error updating payment status:', error);
          throw error;
        }

        console.log('✅ Payment status updated:', data);
        
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
