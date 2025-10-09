// API endpoint pour rediriger vers la page de succès
export default async function handler(req, res) {
  console.log('🎉 Payment Success API called');
  console.log('🎉 Method:', req.method);
  console.log('🎉 Query:', req.query);
  
  // Rediriger vers la page de succès avec les paramètres
  const sessionId = req.query.session_id;
  const redirectUrl = sessionId 
    ? `/?payment=success&session_id=${sessionId}`
    : '/?payment=success';
  
  console.log('🎉 Redirecting to:', redirectUrl);
  
  return res.redirect(302, redirectUrl);
}
