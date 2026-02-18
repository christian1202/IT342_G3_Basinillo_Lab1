# Backend Deployment Guide

Your Spring Boot backend is now "Cloud Ready"! 🚀

I have made the following changes:

1.  **Added `Dockerfile`**: Allows deployment on any container platform (Render, Railway, Fly.io).
2.  **Updated `application.properties`**: Now accepts Database credentials via Environment Variables.
3.  **Updated `CorsConfig.java`**: Accepts `CORS_ALLOWED_ORIGINS` env var to allow your Vercel frontend to connect.

---

## 🚀 Step 1: Push Changes to GitHub

Make sure all my changes are committed and pushed to your repository.

## ☁️ Step 2: Choose a Cloud Provider (Recommended: Railway or Render)

### Option A: Railway (Easiest)

1.  Go to [railway.app](https://railway.app/) and login.
2.  Click **New Project** -> **Deploy from GitHub repo**.
3.  Select your repository (`IT342_G3_Basinillo_Lab1`).
4.  It should automatically detect the `Dockerfile` in `backend/basinillo/Dockerfile`?
    - _Note_: Since your backend is in a generic subdirectory, you might need to configure the **Root Directory** in Railway settings to `backend/basinillo`.
5.  **Add a Database (Postgres)**:
    - In the same project, click "New" -> Database -> PostgreSQL.
    - Railway provides the connection variables automatically.
6.  **Configure Environment Variables**:
    - `JDBC_DATABASE_URL`: `${Postgres.DATABASE_URL}` (Railway often provides `DATABASE_URL`, check their docs or just link services).
    - `CORS_ALLOWED_ORIGINS`: `https://your-vercel-app.vercel.app` (The URL of your frontend).

### Option B: Render

1.  Go to [render.com](https://render.com/).
2.  New **Web Service** -> Connect GitHub.
3.  **Settings**:
    - **Root Directory**: `backend/basinillo`
    - **Runtime**: Docker
4.  **Environment Variables**:
    - `JDBC_DATABASE_URL`: `jdbc:postgresql://<host>:5432/<db_name>` (You need to create a Postgres database separately on Render and get these details).
    - `JDBC_DATABASE_USERNAME`: ...
    - `JDBC_DATABASE_PASSWORD`: ...
    - `CORS_ALLOWED_ORIGINS`: `https://your-vercel-app.vercel.app`
    - `PORT`: `8080`

## 🔗 Step 3: Connect Frontend

Once deployed, copy the **HTTPS URL** of your new backend (e.g., `https://web-production-1234.up.railway.app`).

1.  Go to your **Vercel Dashboard** -> Project -> Settings -> Environment Variables.
2.  Add/Update `NEXT_PUBLIC_API_URL` with that backend URL.
3.  **Redeploy** your frontend on Vercel.

🎉 **Done!** Your app should now work without "Mixed Content" errors.
