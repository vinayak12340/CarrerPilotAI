# Deployment Guide - CareerPilot AI

This Next.js App Router project is ready to be pushed to GitHub and deployed live on Vercel. 

---

## 🐙 Step 1: Upload to GitHub

I have staged and committed all files locally. To push them to your GitHub:

1. Go to [GitHub](https://github.com/) and create a new **public or private repository** (e.g., `careerpilot-ai`). **Do not** initialize it with a README, license, or `.gitignore` (keep it completely blank).
2. Copy the repository URL (e.g. `https://github.com/your-username/careerpilot-ai.git`).
3. Run the following commands in your terminal:
   ```bash
   # Add your GitHub repository link as the remote origin
   git remote add origin <your-copied-github-url>
   
   # Rename default branch to main (if not already done)
   git branch -M main
   
   # Push your code to GitHub
   git push -u origin main
   ```

---

## ⚡ Step 2: Deploy to Vercel

Once your code is on GitHub, deploying it to Vercel takes 1 minute:

1. Go to [Vercel](https://vercel.com/) and log in (using your GitHub account).
2. Click **Add New** -> **Project**.
3. Select your `careerpilot-ai` repository from the imported list and click **Import**.
4. In the configuration window:
   - **Framework Preset**: Next.js (detected automatically).
   - **Build & Development Settings**: Leave as default.
   - **Environment Variables** (Crucial for production AI):
     - Key: `GEMINI_API_KEY`
     - Value: `<your-gemini-api-key>`
5. Click **Deploy**.

Vercel will build the project in ~1 minute and provide a live `.vercel.app` URL!

---

## ⚙️ How to generate a Gemini API Key?
If you do not have an API key:
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Click **Create API Key**.
3. Copy the key and add it to your Vercel Environment Variables.
