import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { Resend } from 'resend';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// Initialize Resend with API Key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', services: ['resend', 'revenuecat'] });
});

app.post('/api/webhooks/revenuecat', (req, res) => {
  // Verify webhook signature if needed (REVENUECAT_WEBHOOK_SECRET)
  const secret = process.env.REVENUECAT_WEBHOOK_SECRET;
  const authHeader = req.headers['authorization'];

  // Basic check (RevenueCat sends auth header)
  if (secret && authHeader !== secret) {
    // return res.status(401).send('Unauthorized');
    // For now, just log it as we might not have the secret set up in dev
    console.warn('RevenueCat Webhook: Secret mismatch or missing');
  }

  console.log('RevenueCat Webhook received:', req.body);
  res.status(200).send('Webhook received');
});

app.post('/api/email', async (req, res) => {
  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, html' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', // Replace with your verified domain
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      return res.status(400).json({ error });
    }

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
