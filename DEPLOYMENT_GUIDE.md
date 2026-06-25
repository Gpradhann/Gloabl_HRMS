# WorkFlow HRMS - Deployment Guide & Concepts

Welcome! If you have never deployed a website or backend API before, don't worry. This guide is written specifically for you. We will go through the concepts of deployment in the simplest way possible, explain exactly how to deploy **WorkFlow**, and make sure your code remains completely safe and functional.

---

## 1. What is Deployment? (The Absolute Basics)

Right now, you are running the project on your local computer. When you run `npm run dev` and open `http://localhost:3000`, the project is running inside your computer's local memory, using your local files. 
- Only **you** can see it. If you turn off your computer, the website stops working.
- **Deployment** is the process of putting your code onto a specialized, permanently powered-on computer in the cloud (called a **Web Server**).
- Once deployed, your project is assigned a public web address (e.g., `https://workflow-hrms.vercel.app`) so that anyone in the world with a browser can access it.

---

## 2. Core Concepts You Must Know

### Concept A: The Client-Server Model
1. **The Client (Frontend):** This is the user's web browser. It downloads the HTML/CSS/JavaScript and renders the visuals (buttons, cards, menus, CEO video modal).
2. **The Server (Backend):** This is where your code executes backend calculations and processes requests. It handles tasks like fetching employee records, recording clock-ins, or submitting tickets.

In **Next.js**, the frontend and backend are unified into a single project. The client pages (in `app/(app)/`) and API routes (in `app/api/`) compile together and deploy to the same server simultaneously.

### Concept B: The Build Step
Before your project can run in production, it must go through a **Build Phase** (`npm run build`). 
- What happens: The framework checks all TypeScript code for syntax safety, bundles files together, minifies JavaScript to make it load fast, and optimizes all images.
- **Why this matters:** We have already run the build test locally, and it passed with **zero errors**. This means the code is structurally sound and ready for Vercel without compilation failures.

### Concept C: Your Code is Safe!
One of your primary concerns is: *"Will my code crash, be lost, or destroyed during/after deployment?"*
- **No.** The deployment process reads a copy of your codebase. It never edits or deletes your local source code files.
- The standard way to deploy is to upload your code to a hosting website (like Vercel) through **Git/GitHub**.
- **Git** is a version control tool that acts like an undo-history for your project. If you link your code to GitHub, your work is securely backed up in the cloud, protected against local data losses.

---

## 3. The Database Problem in Cloud Deployments

In your current local setup, all database records (leave balances, relocation tickets, clock-in times) are saved in a local file called `db.json` inside the `next.js` folder. 
When you click "Mark as Met" or submit a ticket, the backend API reads `db.json`, makes the edit, and writes it back to your computer disk.

### How Cloud Hosting Platforms (like Vercel) differ:
- **Serverless Hosting:** To keep hosting free and scalable, Vercel hosts backend API routes as **Serverless Functions**. These functions wake up when a user clicks a button, execute the code, and immediately fall asleep.
- **Stateless Files:** Every time a serverless function falls asleep or restarts, its filesystem resets. In addition, Vercel's filesystem is **read-only** in production.
- **The Result:** If you write to `db.json` in production on Vercel, the writes will fail or reset every time the server restarts.

### How to solve this for a real-world production deployment:
For real-world databases, we connect our code to a **hosted database provider** in the cloud. Instead of saving data in `db.json`, the API endpoints talk to a remote database database (like PostgreSQL or Supabase) which preserves data permanently.
For a prototype or demo release, you can also connect your mock database to a cloud JSON hosting provider like **jsonbin.io** or deploy a tiny mock server (like JSON Server) on a stateful platform like **Render.com**.

---

## 4. Step-by-Step Vercel Deployment Instructions

Vercel is the official platform created by the authors of Next.js. It is free, automatically handles code compilations, and is the easiest way to deploy Next.js apps.

Follow these 4 simple steps to deploy:

### Step 1: Upload Your Code to GitHub (Backup & Sync)
1. Go to [GitHub](https://github.com) and log in or create a free account.
2. Create a new repository and name it (e.g., `workflow-hrms`). Keep it **Private** if you don't want others to view your code.
3. Open your terminal in the project folder and push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/workflow-hrms.git
   git push -u origin main
   ```
*(Note: If you have already linked your workspace to a Git repository, you can simply commit and push your code.)*

### Step 2: Import Project to Vercel
1. Go to [Vercel](https://vercel.com) and log in using your **GitHub** account.
2. In the Vercel Dashboard, click **Add New** and select **Project**.
3. You will see a list of your GitHub repositories. Find `workflow-hrms` and click **Import**.

### Step 3: Configure Settings
On the Vercel configuration screen:
- **Framework Preset:** Vercel automatically detects **Next.js**.
- **Root Directory:** If Vercel asks, choose `next.js` (since your Next.js application is nested in the `next.js` sub-folder).
- **Build and Output Settings:** Leave these at their defaults. Vercel automatically runs `npm run build` and locates the output.

### Step 4: Click Deploy!
- Click the **Deploy** button.
- Vercel will download your code, build it (running the exact build phase we verified), and put it online.
- In 1 to 2 minutes, you will receive a public website link (e.g. `https://workflow-hrms.vercel.app`).
- **Any time you update your code locally and push it to GitHub, Vercel will automatically re-deploy the updates!**

---

## 5. Reviewing the Technical Guide
To help you understand where every single screen, feature, and data route exists in this project, we have generated a high-fidelity reference guide.

You can view it in two ways:
1. **Interactive HTML Webpage:** Open `next.js/public/REFERENCE_GUIDE.html` in your browser, or visit `http://localhost:3000/REFERENCE_GUIDE.html` while running `npm run dev`. You can print it directly as a PDF or save it to your disk.
2. **Markdown Document:** View the file [REFERENCE_GUIDE.md](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/public/REFERENCE_GUIDE.md) in your workspace code editor.
