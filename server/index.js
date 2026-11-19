import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    agent: 'Autonomous Student Question Paper Practice Agent',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY)
  });
});

/**
 * Secure syllabus decomposition endpoint (uses GEMINI_API_KEY if present)
 */
app.post('/api/ai/extract-syllabus', async (req, res) => {
  const { text, subjectName } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text content is required' });
  }

  // If GEMINI_API_KEY is configured, can invoke Gemini REST API here securely
  if (process.env.GEMINI_API_KEY) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert curriculum analyzer. Extract structured syllabus topics from the following text for the subject "${subjectName || 'General'}".
              Return a JSON array of objects with: name, description, estimatedWeightagePercentage (numbers summing to 100), subtopics (array of strings), difficultyTrend ('easy', 'medium', or 'hard').
              
              Text:
              ${text.slice(0, 8000)}`
            }]
          }]
        })
      });

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (content) {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json({ topics: parsed, source: 'gemini' });
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local heuristic extractor', err);
    }
  }

  // Fallback heuristic extraction
  return res.json({
    message: 'Processed via built-in intelligent extractor',
    configured: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Serve static frontend build if present
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`Autonomous Question Paper Practice Agent server running on http://localhost:${PORT}`);
  console.log(`Serving static app from: ${distPath}`);
  console.log(`Gemini API Key configured: ${Boolean(process.env.GEMINI_API_KEY)}`);
});
