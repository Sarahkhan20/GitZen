# **GitZen - GitHub Code Summarizer**

**GitZen** is a powerful web-based tool designed to help users extract and summarize code from public GitHub repositories. It simplifies the process of understanding and contributing to open-source projects by providing a concise summary of the repository's contents and purpose.

---

## 🚀 **Features**

- **GitHub Code Extraction**: Easily extract all files and their contents from a public GitHub repository.
- **Automated Code Summarization**: Get AI-generated summaries using the *Gemini* to understand the key features and objectives of a repository.
- **Customizable Extraction**: Exclude/include files based on extensions, directories, and set a maximum file size in bytes to tailor the extraction process to your needs.
- **Clipboard & Download Support**: Copy extracted code and summaries to your clipboard or download them as plain text files.
- **Interactive User Interface**: Clean and intuitive design for a seamless user experience.

---

## 🛠️ **Tech Stack**

- **Frontend**: React.js  
- **Backend**: Node.js with Express.js  
- **APIs**:
  - GitHub REST API (for fetching repository data)
  - Google Generative AI (for code summarization)

- **Dependencies**:
  - `axios`: For API requests
  - `react-icons`: For UI icons
  - `@google/generative-ai`: For integrating Google Generative AI

---

## 🧩 **Project Structure**

    Directory structure:
    └── sarahkhan20-gitzen/
      ├── README.md
      ├── LICENSE
      ├── package.json
      ├── public/
      │   ├── index.html
      │   ├── manifest.json
      │   └── robots.txt
      ├── server/
      │   ├── package-lock.json
      │   ├── package.json
      │   └── server.js
      └── src/
          ├── App.css
          ├── App.js
          ├── App.test.js
          ├── index.css
          ├── index.js
          ├── reportWebVitals.js
          ├── setupTests.js
          └── components/
              ├── ChatInterface.jsx
              ├── CodeExtractor.jsx
              ├── CodeSummarizer.jsx
              ├── Footer.jsx
              └── Header.jsx

---

## ⚙️ **Setup and Installation**

### 1. **Clone the Repository**

```bash
git clone https://github.com/YOUR_USERNAME/GitZen.git
cd GitZen

```
### 2. **Install Dependencies**
    npm install
    cd server
    npm install

### 3. **Configure Environment Variables**
Create a .env file in the root directory and add your GitHub Personal Access Token and Groq API Key.

          GITHUB_TOKEN=YOUR_GITHUB_ACCESS_TOKEN
          GEMINI_API_KEY=YOUR_GEMINI_API_KEY

- **Generate a GitHub Token** from: [GitHub Developer Settings](https://github.com/settings/tokens)  
- **Obtain a GEMINI API Key** from: [GEMINI Platform](https://aistudio.google.com/apikey)

---

## 🚀 **Start the Development Server**

Run the following command to start the app:

```bash
npm start
cd server
node server.js
```
The app will run locally at: http://localhost:3000

## 🤝 **Contributing**

We welcome contributions to enhance **GitZen**!  

### To contribute:  
1. Fork the repository.  
2. Create a new branch:  

       git checkout -b feature-name
3. Commit your changes:

       git commit -m "Add new feature"
4. Push to your branch:

       git push origin feature-name

5. Open a Pull Request.
   ## 🛡️ **License**

This project is licensed under the **MIT License**.  

## 👨‍💻 **Author**

Developed with ❤️ by **Sarah Khan**.  

- **LinkedIn**: [Sarah Khan](https://www.linkedin.com/in/sarah-khan-13283222a/)  
- **Email**: sarahejaz77@gmail.com  


