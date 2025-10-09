// Test endpoint pour vérifier si la page success est accessible
export default async function handler(req, res) {
  console.log('🧪 TEST SUCCESS ENDPOINT CALLED');
  
  return res.status(200).json({ 
    message: 'Success endpoint is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
}
