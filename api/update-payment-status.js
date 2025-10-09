import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('🔄 Payment status update API called');

  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing Supabase credentials');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find the most recent pending consultation
    const { data: consultations, error: fetchError } = await supabase
      .from('consultations')
      .select('*')
      .eq('payment_status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error('❌ Error fetching consultations:', fetchError);
      return res.status(500).json({ error: 'Database error', details: fetchError });
    }

    console.log('🔍 Found consultations:', consultations?.length || 0);

    if (!consultations || consultations.length === 0) {
      console.log('✅ No pending consultations found (already updated)');
      return res.status(200).json({ 
        success: true, 
        message: 'No pending consultations found',
        alreadyUpdated: true
      });
    }

    const consultation = consultations[0];
    console.log('🔄 Updating consultation:', consultation.id);

    // Update the consultation to 'done'
    const { data: updatedData, error: updateError } = await supabase
      .from('consultations')
      .update({ payment_status: 'done' })
      .eq('id', consultation.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error updating consultation:', updateError);
      return res.status(500).json({ error: 'Update failed', details: updateError });
    }

    console.log('✅ Payment status updated successfully');
    
    return res.status(200).json({ 
      success: true, 
      message: 'Payment status updated',
      consultationId: consultation.id,
      data: updatedData
    });

  } catch (error) {
    console.error('❌ Error in update-payment-status:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}

