// Serveur Express minimal pour servir les fonctions API en développement local
// Lancez ce serveur en parallèle de Vite

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001; // Port différent de Vite (8080)

// Middleware
app.use(express.json());
app.use(express.raw({ type: 'application/json' }));

// Middleware pour logger les requêtes
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// Route pour /api/checkout
app.post('/api/checkout', async (req, res) => {
  try {
    console.log('📥 POST /api/checkout');
    console.log('📥 Body:', JSON.stringify(req.body, null, 2));
    console.log('📥 Headers:', req.headers);
    
    // Créer un objet req compatible avec le format Vercel
    const vercelReq = {
      method: req.method,
      body: req.body,
      headers: req.headers,
      query: req.query,
    };
    
    // Créer un objet res compatible avec le format Vercel
    let responseSent = false;
    const vercelRes = {
      status: (code) => {
        if (!responseSent) {
          res.status(code);
        }
        return vercelRes;
      },
      json: (data) => {
        if (!responseSent) {
          responseSent = true;
          console.log('📤 Sending JSON response:', JSON.stringify(data, null, 2));
          res.json(data);
        }
        return vercelRes;
      },
      end: (data) => {
        if (!responseSent) {
          responseSent = true;
          console.log('📤 Sending response (end)');
          res.end(data);
        }
        return vercelRes;
      },
      setHeader: (name, value) => {
        if (!responseSent) {
          res.setHeader(name, value);
        }
        return vercelRes;
      },
    };
    
    const { default: handler } = await import('./api/checkout.js');
    console.log('🔄 Calling handler...');
    await handler(vercelReq, vercelRes);
    
    // Si aucune réponse n'a été envoyée après 5 secondes, envoyer une erreur
    if (!responseSent) {
      console.error('⚠️ Handler did not send a response');
      res.status(500).json({ error: 'Handler did not send a response' });
    }
  } catch (error) {
    console.error('❌ Error in /api/checkout:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: error.message,
        details: error.toString(),
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
});

// Route pour /api/stripe/webhook
app.post('/api/stripe/webhook', async (req, res) => {
  try {
    const { default: handler } = await import('./api/stripe/webhook.js');
    await handler(req, res);
  } catch (error) {
    console.error('Error in /api/stripe/webhook:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route pour /api/internal/new-lead
app.post('/api/internal/new-lead', async (req, res) => {
  try {
    const { default: handler } = await import('./api/internal/new-lead.js');
    await handler(req, res);
  } catch (error) {
    console.error('Error in /api/internal/new-lead:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route pour /api/test-email
app.get('/api/test-email', async (req, res) => {
  try {
    const { default: handler } = await import('./api/test-email.js');
    await handler(req, res);
  } catch (error) {
    console.error('Error in /api/test-email:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/test-email', async (req, res) => {
  try {
    const { default: handler } = await import('./api/test-email.js');
    await handler(req, res);
  } catch (error) {
    console.error('Error in /api/test-email:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur API sur http://localhost:${PORT}`);
  console.log(`📡 Routes disponibles:`);
  console.log(`   - POST /api/checkout`);
  console.log(`   - POST /api/stripe/webhook`);
  console.log(`   - POST /api/internal/new-lead`);
  console.log(`   - GET/POST /api/test-email`);
  console.log(`\n🔑 Variables d'environnement:`);
  console.log(`   - STRIPE_SECRET_KEY: ${process.env.STRIPE_SECRET_KEY ? '✅ Configurée' : '❌ Manquante'}`);
  console.log(`   - VITE_SUPABASE_URL: ${process.env.VITE_SUPABASE_URL ? '✅ Configurée' : '❌ Manquante'}`);
  console.log(`   - RESEND_API_KEY: ${process.env.RESEND_API_KEY ? '✅ Configurée' : '❌ Manquante'}`);
});

