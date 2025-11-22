# Deployment Guide

This guide covers several options for deploying your Hours Declaration app so you can access it from anywhere, including mobile devices.

## Quick Deploy Options (Recommended)

### 1. Railway (Easiest - Recommended)

**Pros:**
- Free tier with $5 credit monthly
- Automatic deployments from GitHub
- Very easy setup
- HTTPS included
- Mobile-friendly

**Steps:**

1. **Push your code to GitHub** (if not already):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Go to Railway**:
   - Visit https://railway.app
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Configure**:
   - Railway will auto-detect the Dockerfile
   - Add environment variable if needed: `PORT=80` (already set in Dockerfile)
   - Click "Deploy"

4. **Access**:
   - Railway provides a URL like `your-app.railway.app`
   - Access from anywhere, including mobile!

**Cost:** Free tier available, then pay-as-you-go

---

### 2. Render

**Pros:**
- Free tier available
- Easy Docker deployment
- Automatic HTTPS
- Good documentation

**Steps:**

1. **Push to GitHub** (same as above)

2. **Go to Render**:
   - Visit https://render.com
   - Sign up with GitHub
   - Click "New" → "Web Service"
   - Connect your GitHub repository

3. **Configure**:
   - Name: `hours-declaration`
   - Environment: Docker
   - Region: Choose closest to you
   - Build Command: (auto-detected from Dockerfile)
   - Start Command: (auto-detected)
   - Plan: Free

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for build and deployment

**Cost:** Free tier available

---

### 3. Fly.io

**Pros:**
- Great for Docker
- Free tier with 3 VMs
- Global edge network
- Fast deployment

**Steps:**

1. **Install Fly CLI**:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login**:
   ```bash
   fly auth login
   ```

3. **Initialize**:
   ```bash
   cd /Users/phc/Delclaration
   fly launch
   ```
   - Follow prompts
   - Choose app name
   - Select region

4. **Deploy**:
   ```bash
   fly deploy
   ```

**Cost:** Free tier available

---

### 4. DigitalOcean App Platform

**Pros:**
- Simple interface
- Good free trial
- Reliable

**Steps:**

1. **Push to GitHub**

2. **Go to DigitalOcean**:
   - Visit https://cloud.digitalocean.com
   - Sign up (get $200 free credit)
   - Go to "App Platform"
   - Click "Create App"

3. **Configure**:
   - Connect GitHub
   - Select repository
   - Auto-detect Docker
   - Choose plan (Basic $5/month or use free trial)

4. **Deploy**

**Cost:** $5/month or use free trial credit

---

## VPS Deployment (More Control)

If you want more control, deploy to a VPS:

### Option A: DigitalOcean Droplet

1. **Create Droplet**:
   - Ubuntu 22.04
   - $6/month minimum

2. **SSH into server**:
   ```bash
   ssh root@your-server-ip
   ```

3. **Install Docker**:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```

4. **Clone and deploy**:
   ```bash
   git clone YOUR_REPO_URL
   cd Delclaration
   docker compose up -d
   ```

5. **Setup Nginx reverse proxy** (for HTTPS):
   - Install certbot for SSL
   - Configure domain

### Option B: AWS EC2 / Google Cloud / Azure

Similar process but more complex setup. Good for production with high traffic.

---

## Mobile Access Tips

1. **Add to Home Screen**:
   - On iOS: Safari → Share → Add to Home Screen
   - On Android: Chrome → Menu → Add to Home Screen
   - Works like a native app!

2. **Use HTTPS**:
   - All recommended platforms provide HTTPS
   - Required for PWA features

3. **Responsive Design**:
   - Your app is already mobile-responsive
   - Test on mobile after deployment

---

## Recommended: Railway (Easiest)

For the easiest deployment experience, I recommend **Railway**:

1. It's the simplest to set up
2. Free tier is generous
3. Automatic HTTPS
4. Works great on mobile
5. Auto-deploys on git push

**Quick Start with Railway:**
```bash
# 1. Push to GitHub
git push origin main

# 2. Go to railway.app, sign up, deploy
# 3. Done! Your app is live
```

---

## Environment Variables (if needed)

Most platforms auto-detect, but you can set:
- `NODE_ENV=production` (usually auto-set)
- `PORT=80` (already in Dockerfile)

---

## Post-Deployment Checklist

- [ ] Test login/signup
- [ ] Test hours declaration
- [ ] Test on mobile browser
- [ ] Add to mobile home screen
- [ ] Test visualization features
- [ ] Verify HTTPS is working
- [ ] Test account management

---

## Need Help?

- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- Fly.io Docs: https://fly.io/docs

