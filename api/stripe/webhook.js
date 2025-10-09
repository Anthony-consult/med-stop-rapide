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
        console.log('💰 Metadata:', session.metadata);
        
        // Get form data from metadata
        const formDataJson = session.metadata?.formData;
        const paymentIntentId = session.payment_intent;
        
        console.log('📦 Form data JSON exists:', !!formDataJson);
        
        if (!formDataJson) {
          console.error('❌ No formData found in session metadata');
          console.error('❌ Metadata keys:', Object.keys(session.metadata || {}));
          return res.status(400).json({ error: 'No form data in metadata' });
        }

        let formData;
        try {
          formData = JSON.parse(formDataJson);
          console.log('✅ Form data parsed successfully');
          console.log('📝 Form data fields:', Object.keys(formData));
        } catch (parseError) {
          console.error('❌ Failed to parse form data JSON:', parseError);
          return res.status(400).json({ error: 'Invalid form data JSON' });
        }

        console.log('📝 Attempting to insert into Supabase...');
        console.log('📝 Supabase URL:', process.env.VITE_SUPABASE_URL);
        console.log('📝 Service role key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
        
        // Prepare consultation data for insertion
        const consultationData = {
          maladie_presumee: formData.maladie_presumee,
          symptomes: formData.symptomes,
          diagnostic_anterieur: formData.diagnostic_anterieur,
          autres_symptomes: formData.autres_symptomes || null,
          zones_douleur: formData.zones_douleur,
          apparition_soudaine: formData.apparition_soudaine,
          medicaments_reguliers: formData.medicaments_reguliers,
          facteurs_risque: formData.facteurs_risque,
          type_arret: formData.type_arret,
          profession: formData.profession,
          date_debut: formData.date_debut,
          date_fin: formData.date_fin,
          date_fin_lettres: formData.date_fin_lettres,
          nom_prenom: formData.nom_prenom,
          date_naissance: formData.date_naissance,
          email: formData.email,
          adresse: formData.adresse,
          code_postal: formData.code_postal,
          ville: formData.ville,
          pays: formData.pays,
          situation_pro: formData.situation_pro,
          localisation_medecin: formData.localisation_medecin,
          numero_securite_sociale: formData.numero_securite_sociale,
          conditions_acceptees: formData.conditions_acceptees,
          payment_status: 'done', // Directly set to done
          payment_id: paymentIntentId,
        };

        console.log('💾 Inserting consultation with payment_status = done');
        
        // Insert consultation into Supabase
        const { data, error } = await supabase
          .from('consultations')
          .insert([consultationData])
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

        console.log('✅ CONSULTATION INSERTED SUCCESSFULLY!');
        console.log('✅ Inserted data:', JSON.stringify(data, null, 2));
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
