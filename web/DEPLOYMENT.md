# Deployment Instructions

Your application is ready for deployment to Vercel!

## 1. Environment Variables

I've created a `.env.example` file for you. When adding your project to Vercel:

1. Go to **Settings > Environment Variables**.
2. Add the following keys (copy values from your local `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Build Checks

I ran `npm run lint` and `npx tsc --noEmit`. The code is type-safe and ready.

## 3. Git Configuration

I updated `.gitignore` to ensure `.env` and `.env.local` are strictly excluded.

## 4. Next Steps

Run these commands to push your code:

```bash
git add .
git commit -m "feat: prepare for deployment"
git push origin main
```

Then import your repository in the Vercel dashboard. The build command `npm run build` will work automatically.
