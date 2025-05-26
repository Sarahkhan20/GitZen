
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const Groq = require('groq-sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Route to extract code from GitHub repository
app.post('/api/extract-code', async (req, res) => {
  try {
    const { repoUrl } = req.body;
    
    if (!repoUrl) {
      return res.status(400).json({ error: 'Repository URL is required' });
    }

    // Parse GitHub URL
    const parts = repoUrl.split('/');
    const owner = parts[parts.length - 2];
    const repo = parts[parts.length - 1];

    if (!owner || !repo) {
      return res.status(400).json({ error: 'Invalid GitHub repository URL' });
    }

    const fetchContents = async (path) => {
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
      
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3.raw',
          },
        });

        let contentOutput = '';

        for (const item of response.data) {
          if (item.type === 'file') {
            try {
              const fileResponse = await axios.get(item.download_url);
              contentOutput += `File: ${item.path}\n`;
              contentOutput += '='.repeat(60) + '\n';
              contentOutput += fileResponse.data + '\n';
              contentOutput += '='.repeat(60) + '\n\n';
            } catch (fileError) {
              console.error(`Error fetching file ${item.path}:`, fileError.message);
            }
          } else if (item.type === 'dir') {
            contentOutput += await fetchContents(item.path);
          }
        }

        return contentOutput;
      } catch (err) {
        console.error('Error fetching contents:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to fetch repository contents');
      }
    };

    const allCode = await fetchContents('');
    res.json({ code: allCode });

  } catch (error) {
    console.error('Extract code error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Route to summarize code using Groq API
app.post('/api/summarize-code', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code content is required' });
    }

    const template = `Summarize this GitHub repository. The aim of this project is to assist individuals who are contributing to open source projects and may not fully understand the repository's purpose or functionality. Please provide a concise summary that includes key features, objectives, and any important information that would help new contributors understand the project better.\n\n\`\`\`${code}\`\`\`\n\nBULLET POINT SUMMARY:\n`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: template,
        },
      ],
      model: 'llama-3.3-70b-versatile',
    });

    if (chatCompletion && chatCompletion.choices.length > 0) {
      res.json({ summary: chatCompletion.choices[0].message.content });
    } else {
      res.status(500).json({ error: 'No summary returned from API' });
    }

  } catch (error) {
    console.error('Summarize code error:', error.message);
    res.status(500).json({ error: 'Failed to summarize code' });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
