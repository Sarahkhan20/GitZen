const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyCX3qBPXXWd1lCFZJ-SDDjgZMGf2lzYgoM');

// Configuration for optimization
const CONFIG = {
  MAX_TOKENS_PER_REQUEST: 25000, // Conservative limit for Gemini
  MAX_FILE_SIZE: 5000, // Reduced max characters per file
  MAX_TOTAL_SIZE: 80000, // Reduced total size before chunking
  EXCLUDED_EXTENSIONS: ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.pdf', '.zip', '.tar', '.gz', '.css', '.scss', '.sass', '.less', '.woff', '.woff2', '.ttf', '.eot', '.mp4', '.mp3', '.avi', '.mov', '.exe', '.dll', '.so', '.dylib'], // More exclusions
  EXCLUDED_DIRS: ['node_modules', '.git', 'dist', 'build', 'coverage', '.next', '__pycache__', '.vscode', '.idea', 'target', 'bin', 'obj', 'vendor'],
  CODE_EXTENSIONS: ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.h', '.cs', '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.scala', '.md', '.txt', '.json', '.yml', '.yaml', '.xml', '.html', '.vue', '.svelte']
};

// Helper function to check if file should be included
const shouldIncludeFile = (path, name, size = 0) => {
  // Check if it's in excluded directories
  if (CONFIG.EXCLUDED_DIRS.some(dir => path.includes(`/${dir}/`) || path.startsWith(`${dir}/`))) {
    return false;
  }

  // Check file size limit
  if (size > CONFIG.MAX_FILE_SIZE) {
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
  if (!content || typeof content !== 'string') return '';
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + '\n... [Content truncated due to size limits] ...';
};

// Helper function to chunk content intelligently
const chunkContent = (content, maxChunkSize) => {
  if (!content || typeof content !== 'string') return [''];

  const chunks = [];
  let currentChunk = '';

  // Split by files first
  const fileSections = content.split(/(?=File: [^\n]+\n=+)/);

  for (const section of fileSections) {
    if (!section.trim()) continue;

    if ((currentChunk + section).length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = section;
    } else {
      currentChunk += section;
    }

    // If a single section is too large, split it further
    if (currentChunk.length > maxChunkSize) {
      const lines = currentChunk.split('\n');
      let tempChunk = '';

      for (const line of lines) {
        if ((tempChunk + line + '\n').length > maxChunkSize && tempChunk.length > 0) {
          chunks.push(tempChunk.trim());
          tempChunk = line + '\n';
        } else {
          tempChunk += line + '\n';
        }
      }

      currentChunk = tempChunk;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.length > 0 ? chunks : [''];
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

    const fetchContents = async (path, depth = 0) => {
      if (depth > 10) return ''; // Prevent infinite recursion

      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.GITHUB_TOKEN ? `Bearer ${process.env.GITHUB_TOKEN}` : undefined,
            Accept: 'application/vnd.github.v3+json',
          },
        });

        let contentOutput = '';
        let fileCount = 0;

        for (const item of response.data) {
          if (contentOutput.length > CONFIG.MAX_TOTAL_SIZE) {
            contentOutput += '\n... [Additional files omitted due to size limits] ...';
            break;
          }

          if (item.type === 'file' && shouldIncludeFile(item.path, item.name, item.size)) {
            try {
              const fileResponse = await axios.get(item.download_url, {
                timeout: 10000,
                maxContentLength: 500000 // 500KB limit per file
              });

              let content = fileResponse.data;

              // Handle different content types
              if (content === null || content === undefined) {
                content = '[Empty file]';
              } else if (typeof content === 'object') {
                try {
                  content = JSON.stringify(content, null, 2);
                } catch (e) {
                  content = '[Binary or complex object - cannot display]';
                }
              } else if (typeof content !== 'string') {
                content = String(content);
              }

              // Skip if content is too large or binary
              if (content.length > CONFIG.MAX_FILE_SIZE * 2) {
                content = `[File too large: ${content.length} characters - truncated]\n${content.substring(0, CONFIG.MAX_FILE_SIZE)}`;
              }

              const truncatedContent = truncateContent(content, CONFIG.MAX_FILE_SIZE);

              contentOutput += `File: ${item.path}\n`;
              contentOutput += '='.repeat(60) + '\n';
              contentOutput += truncatedContent + '\n';
              contentOutput += '='.repeat(60) + '\n\n';
              fileCount++;

              // Stop if we're getting too much content
              if (contentOutput.length > CONFIG.MAX_TOTAL_SIZE) {
                contentOutput += '\n... [Additional files omitted due to size limits] ...';
                console.log(`Stopping extraction due to size limit. Processed ${fileCount} files.`);
                break;
              }

            } catch (fileError) {
              console.error(`Error fetching file ${item.path}:`, fileError.message);
              // Don't include failed files in output to avoid corruption
              if (fileError.code !== 'ECONNABORTED') {
                contentOutput += `File: ${item.path}\n`;
                contentOutput += '='.repeat(60) + '\n';
                contentOutput += `[Error: ${fileError.message}]\n`;
                contentOutput += '='.repeat(60) + '\n\n';
              }
            }
          } else if (item.type === 'dir' && !CONFIG.EXCLUDED_DIRS.includes(item.name)) {
            const subContent = await fetchContents(item.path, depth + 1);
            contentOutput += subContent;
          }
        }

        console.log(`Processed ${fileCount} files from ${path || 'root'}`);
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

// Route to summarize code using Gemini API with chunking
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
          await new Promise(resolve => setTimeout(resolve, 1000));
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

// Helper function to summarize a single chunk using Gemini
const summarizeSingleChunk = async (code, chunkNum = null, totalChunks = null) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const chunkPrefix = chunkNum ? `[Chunk ${chunkNum}/${totalChunks}] ` : '';
    const prompt = `${chunkPrefix}Analyze this GitHub repository code and provide a concise bullet-point summary. Focus on:
- Main purpose and functionality
- Key features and components
- Technologies and frameworks used
- Project structure and architecture
- Important files and their roles

Code to analyze:
\`\`\`
${code}
\`\`\`

Provide a clear, structured summary:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error with Gemini API:', error.message);
    throw new Error(`Failed to generate summary: ${error.message}`);
  }
};

// Helper function to combine multiple chunk summaries using Gemini
const combineSummaries = async (summaries) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const combinedText = summaries.join('\n\n---\n\n');
    const prompt = `The following are summaries of different parts of a GitHub repository. Please create a unified, comprehensive summary that combines all the information into a coherent overview of the entire project:

${combinedText}

Create a unified summary with:
- Overall project purpose and goals
- Main features and functionality
- Technical stack and architecture
- Key components and structure
- Notable patterns or approaches used

Provide a well-organized, comprehensive summary:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error combining summaries:', error.message);
    // Fallback: return combined summaries if unification fails
    return `REPOSITORY SUMMARY (Multiple Parts):\n\n${summaries.join('\n\n---\n\n')}`;
  }
};

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});