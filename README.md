# **GitZen - GitHub Code Summarizer**

**GitZen** is a powerful web-based tool designed to help users extract and summarize code from public GitHub repositories. It simplifies the process of understanding and contributing to open-source projects by providing a concise summary of the repository's contents and purpose.

---

## 🚀 **Features**

- **GitHub Code Extraction**  
  Easily extract all files and their contents from a public GitHub repository.

- **Automated Code Summarization**  
  Get AI-generated bullet-point summaries using the **Groq API** to understand the key features and objectives of a repository.

- **Clipboard & Download Support**  
  - Copy extracted code and summaries to your clipboard.
  - Download extracted files and summaries as plain text files.

- **Interactive User Interface**  
  Clean and intuitive design for a seamless user experience.

---

## 🛠️ **Tech Stack**

- **Frontend**: React.js  
- **APIs**:  
  - GitHub REST API (for fetching repository data)  
  - Groq SDK (for code summarization using LLAMA-3.3 model)  
- **Dependencies**:
  - `axios`: For API requests  
  - `react-icons`: For UI icons  
  - `groq-sdk`: For integrating Groq's summarization API  
- **Build Tools**: React Scripts

---

## 🧩 **Project Structure**

    Directory structure:
    └── Sarahkhan20-GitZen
        ├── public
        │   ├── manifest.json
        │   ├── index.html
        │   ├── favicon.ico
        │   └── robots.txt
        ├── package.json
        └── src
            ├── setupTests.js
            ├── components
            │   ├── CodeExtractor.jsx
            │   ├── CodeSummarizer.jsx
            │   ├── Header.jsx
            │   └── Footer.jsx
            ├── App.js
            ├── reportWebVitals.js
            ├── App.test.js
            └── index.js


---

## ⚙️ **Setup and Installation**

### 1. **Clone the Repository**

```bash
git clone https://github.com/YOUR_USERNAME/GitZen.git
cd GitZen

```
### 2. **Install Dependencies**
    npm install

### 3. **Configure Environment Variables**
Create a .env file in the root directory and add your GitHub Personal Access Token and Groq API Key.

          REACT_APP_GITHUB_TOKEN=YOUR_GITHUB_ACCESS_TOKEN
          REACT_APP_GROQ_API_KEY=YOUR_GROQ_API_KEY

- **Generate a GitHub Token** from: [GitHub Developer Settings](https://github.com/settings/tokens)  
- **Obtain a Groq API Key** from: [Groq Platform](https://console.groq.com/keys)

---

## 🚀 **Start the Development Server**

Run the following command to start the app:

```bash
npm start
```
The app will run locally at: http://localhost:3000

## 🔧 **Usage**

1. Enter a **public GitHub repository URL** (e.g., `https://github.com/facebook/react`).  
2. Click on **"Extract Code"** to fetch and display the repository's files and contents.  
3. The extracted code will appear along with:  
   - Options to **Copy** or **Download** the code.  
   - An **AI-generated summary** of the repository, helping new contributors understand its functionality.
   

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

---

## 🙌 **Acknowledgments**

- **React.js**: Framework for building the UI.  
- **GitHub API**: For fetching repository contents.  
- **Groq API**: For providing code summarization using LLAMA models.  
- **React Icons**: For adding user-friendly icons.  

---

## 👨‍💻 **Author**

Developed with ❤️ by **Sarah Khan**.  

- **LinkedIn**: [Sarah Khan](https://www.linkedin.com/in/sarah-khan-13283222a/)  
- **Email**: sarahejaz77@gmail.com  


