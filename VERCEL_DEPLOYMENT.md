# Vercel Deployment Guide

This guide walks you through deploying the Business Marketplace to Vercel.

## Prerequisites

- [Vercel Account](https://vercel.com) (free tier available)
- [Git Repository](https://github.com) - Push your code to GitHub, GitLab, or Bitbucket
- Supabase project with credentials

## Step 1: Prepare Your Code

The project is already configured for Vercel deployment:

- ✅ `vercel.json` - Contains build configuration and rewrites for SPA routing
- ✅ `.vercelignore` - Specifies files to ignore during deployment
- ✅ `.env.example` - Documents required environment variables

## Step 2: Set Up Environment Variables

1. Create a `.env.local` file locally (never commit this):
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Test locally:
   ```bash
   npm run dev
   ```

## Step 3: Push to Git

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Step 4: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Configure project settings:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click "Deploy"

### Option B: Via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts to link your project and set environment variables

## Step 5: Configure Environment Variables in Vercel

1. Go to your project settings in Vercel dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add your Supabase credentials
4. Make sure variables are available for:
   - Production
   - Preview
   - Development (optional)

## Step 6: Set Supabase CORS

In your Supabase project settings, add your Vercel domain to allowed CORS origins:

1. Go to Supabase Dashboard → Project Settings → API
2. Under "CORS", add your Vercel domain (e.g., `https://your-project.vercel.app`)

## Troubleshooting

### 404 Errors on Page Refresh
The `vercel.json` includes a rewrite rule that routes all requests to `/index.html` for proper SPA routing. This should be handled automatically.

### Environment Variables Not Loading
- Ensure variables are prefixed with `VITE_` to be accessible in the browser
- Redeploy after adding new environment variables
- Check the build logs in Vercel dashboard

### Build Failures
- Check build logs in Vercel dashboard
- Verify TypeScript compilation: `npm run build`
- Ensure all dependencies are in `package.json`

### Supabase Connection Issues
- Verify your Supabase URL and key are correct
- Check CORS settings in Supabase
- Ensure your RLS policies allow the anon key access
- Check browser console for specific error messages

## Monitoring & Optimization

- View analytics in Vercel dashboard
- Check deployment logs for errors
- Monitor performance with Vercel Analytics
- Use browser DevTools to debug client-side issues

## Custom Domain

1. In Vercel dashboard, go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update Supabase CORS if needed

## Rollback

If needed, you can rollback to a previous deployment:

1. Go to Deployments tab
2. Find the previous deployment
3. Click the three dots → Promote to Production

## Next Steps

- Set up automated deployments (push to main = auto deploy)
- Configure preview deployments for pull requests
- Set up custom domain with SSL
- Monitor performance and optimize
