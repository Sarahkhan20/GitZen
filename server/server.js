const express = require('express');
const cors = require('cors');
const axios = require('axios');
const Groq = require('groq-sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Configuration for optimization
const CONFIG = {
  MAX_TOKENS_PER_REQUEST: 25000, // Conservative limit
  MAX_FILE_SIZE: 10000, // Max characters per file
  MAX_TOTAL_SIZE: 50000, // Max total characters before chunking
  EXCLUDED_EXTENSIONS: ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.pdf', '.zip', '.tar', '.gz'],
  EXCLUDED_DIRS: ['node_modules', '.git', 'dist', 'build', 'coverage', '.next', '__pycache__'],
  CODE_EXTENSIONS: ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.h', '.cs', '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.scala', '.md', '.txt', '.json', '.yml', '.yaml', '.xml', '.html', '.css', '.scss', '.sass']
};

// Helper function to check if file should be included
const shouldIncludeFile = (path, name) => {
  // Check if it's in excluded directories
  if (CONFIG.EXCLUDED_DIRS.some(dir => path.includes(`/${dir}/`) || path.startsWith(`${dir}/`))) {
    return false;
  }

  // Check file extension
  const ext = name.toLowerCase().substring(name.lastIndexOf('.'));
  if (CONFIG.EXCLUDED_EXTENSIONS.includes(ext)) {
    return false;
  }

  // Include if it has a code extension or no extension (like README, Dockerfile, etc.)
  return CONFIG.CODE_EXTENSIONS.includes(ext) || !ext || name === 'README' || name === 'Dockerfile';
};

// Helper function to truncate content
const truncateContent = (content, maxLength) => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + '\n... [Content truncated due to size limits] ...';
};

// Helper function to chunk content
const chunkContent = (content, maxChunkSize) => {
  const chunks = [];
  let currentChunk = '';
  const lines = content.split('\n');

  for (const line of lines) {
    if ((currentChunk + line).length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = line + '\n';
    } else {
      currentChunk += line + '\n';
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk);
  }

  return chunks;
};

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
        let fileCount = 0;

        for (const item of response.data) {
          if (item.type === 'file' && shouldIncludeFile(item.path, item.name)) {
            try {
              const fileResponse = await axios.get(item.download_url);
              // Handle different content types properly
              let content = fileResponse.data;
              if (typeof content !== 'string') {
                content = String(content);
              }
              const truncatedContent = truncateContent(content, CONFIG.MAX_FILE_SIZE);

              contentOutput += `File: ${item.path}\n`;
              contentOutput += '='.repeat(60) + '\n';
              contentOutput += truncatedContent + '\n';
              contentOutput += '='.repeat(60) + '\n\n';
              fileCount++;

              // Stop if we're getting too much content
              if (contentOutput.length > CONFIG.MAX_TOTAL_SIZE * 2) {
                contentOutput += '\n... [Additional files omitted due to size limits] ...';
                console.log(`Stopping extraction due to size limit. Processed ${fileCount} files.`);
                break;
              }
            } catch (fileError) {
              console.error(`Error fetching file ${item.path}:`, fileError.message);
            }
          } else if (item.type === 'dir' && !CONFIG.EXCLUDED_DIRS.includes(item.name)) {
            const subContent = await fetchContents(item.path);
            contentOutput += subContent;

            // Stop if we're getting too much content
            if (contentOutput.length > CONFIG.MAX_TOTAL_SIZE * 2) {
              break;
            }
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

// Route to summarize code using Groq API with chunking
app.post('/api/summarize-code', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code content is required' });
    }

    // Check if content needs to be chunked
    if (code.length <= CONFIG.MAX_TOKENS_PER_REQUEST) {
      // Content is small enough, process normally
      const summary = await summarizeSingleChunk(code);
      return res.json({ summary });
    }

    // Content is too large, chunk it and process
    const chunks = chunkContent(code, CONFIG.MAX_TOKENS_PER_REQUEST);
    console.log(`Processing ${chunks.length} chunks for large repository`);

    const chunkSummaries = [];

    for (let i = 0; i < chunks.length; i++) {
      try {
        console.log(`Processing chunk ${i + 1}/${chunks.length}`);
        const chunkSummary = await summarizeSingleChunk(chunks[i], i + 1, chunks.length);
        chunkSummaries.push(chunkSummary);

        // Add delay between requests to respect rate limits
        if (i < chunks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`Error processing chunk ${i + 1}:`, error.message);
        chunkSummaries.push(`[Error processing chunk ${i + 1}: ${error.message}]`);
      }
    }

    // Combine all chunk summaries
    const finalSummary = await combineSummaries(chunkSummaries);
    res.json({ summary: finalSummary });

  } catch (error) {
    console.error('Summarize code error:', error.message);
    res.status(500).json({ error: 'Failed to summarize code' });
  }
});

// Helper function to summarize a single chunk
const summarizeSingleChunk = async (code, chunkNum = null, totalChunks = null) => {
  const chunkPrefix = chunkNum ? `[Chunk ${chunkNum}/${totalChunks}] ` : '';
  const template = `${chunkPrefix}Summarize this GitHub repository code. Focus on key features, objectives, and functionality that would help new contributors understand the project. Provide a concise bullet-point summary.\n\n\`\`\`${code}\`\`\`\n\nBULLET POINT SUMMARY:`;

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: template,
      },
    ],
    model: 'llama-3.1-8b-instant',
    temperature: 0.3,
    max_tokens: 2000,
  });

  if (chatCompletion && chatCompletion.choices.length > 0) {
    return chatCompletion.choices[0].message.content;
  } else {
    throw new Error('No summary returned from API');
  }
};

// Helper function to combine multiple chunk summaries
const combineSummaries = async (summaries) => {
  const combinedText = summaries.join('\n\n---\n\n');

  const template = `The following are summaries of different parts of a GitHub repository. Please create a unified, comprehensive summary that combines all the information into a coherent overview of the entire project:\n\n${combinedText}\n\nUNIFIED REPOSITORY SUMMARY:`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: template,
        },
      ],
    model: 'llama-3.1-8b-instant',
    temperature: 0.3,
    max_tokens: 3000,
  });

  if (chatCompletion && chatCompletion.choices.length > 0) {
    return chatCompletion.choices[0].message.content;
  } else {
    // Fallback: return combined summaries if unification fails
    return `REPOSITORY SUMMARY (Multiple Parts):\n\n${combinedText}`;
  }
  } catch (error) {
    console.error('Error combining summaries:', error.message);
    // Fallback: return combined summaries if unification fails
    return `REPOSITORY SUMMARY (Multiple Parts):\n\n${combinedText}`;
  }
};

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});