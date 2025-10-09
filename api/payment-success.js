// API endpoint pour rediriger vers la page de succès
export default async function handler(req, res) {
  console.log('🎉 Payment Success API called');
  console.log('🎉 Method:', req.method);
  console.log('🎉 Query:', req.query);
  console.log('🎉 Headers:', req.headers);
  
  // Pour debug, retourner du JSON au lieu de rediriger
  if (req.method === 'GET') {
    const sessionId = req.query.session_id;
    
    return res.status(200).json({
      message: 'Payment Success API is working!',
      method: req.method,
      query: req.query,
      sessionId: sessionId,
      redirectUrl: sessionId 
        ? `/?payment=success&session_id=${sessionId}`
        : '/?payment=success',
      timestamp: new Date().toISOString()
    });
  }
  
  // Rediriger vers la page de succès avec les paramètres
  const sessionId = req.query.session_id;
  const redirectUrl = sessionId 
    ? `/?payment=success&session_id=${sessionId}`
    : '/?payment=success';
  
  console.log('🎉 Redirecting to:', redirectUrl);
  
  return res.redirect(302, redirectUrl);
}
