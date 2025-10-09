// Test endpoint pour vérifier si le webhook est accessible
export default async function handler(req, res) {
  console.log('🧪 TEST WEBHOOK ENDPOINT CALLED');
  console.log('🧪 Method:', req.method);
  console.log('🧪 Headers:', JSON.stringify(req.headers, null, 2));
  console.log('🧪 Body:', JSON.stringify(req.body, null, 2));
  
  return res.status(200).json({ 
    message: 'Test webhook endpoint is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    headers: req.headers,
    body: req.body
  });
}
