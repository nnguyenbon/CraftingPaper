import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendPaperEmail, getGmailConfig } from './src/server/emailService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Support high payload size for base64 image data
app.use(express.json({ limit: '25mb' }));

// API: Check if Gmail credentials are configured
app.get('/api/email-config-status', (_req, res) => {
  const config = getGmailConfig();
  res.json({
    isConfigured: config.isConfigured,
    userEmail: config.user ? config.user.replace(/(.{2})(.*)(@.*)/, '$1***$3') : '',
  });
});

// API: Send paper image and specs via Google Mail
app.post('/api/send-email', async (req, res) => {
  const result = await sendPaperEmail(req.body);
  res.status(result.status).json(result);
});

// Serve static assets from dist in production
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[CraftingPaper] Production server running on http://localhost:${PORT}`);
});
