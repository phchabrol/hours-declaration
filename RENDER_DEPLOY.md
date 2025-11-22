# Quick Render Deployment Guide

Your code is ready! Follow these steps to deploy:

## ✅ Pre-Deployment Checklist

- [x] Code pushed to GitHub: `https://github.com/phchabrol/hours-declaration.git`
- [x] Dockerfile configured
- [x] render.yaml configured
- [x] All files committed

## 🚀 Deployment Steps

### 1. Go to Render
Visit: https://render.com

### 2. Sign Up / Login
- Click "Get Started for Free"
- Sign up with GitHub (recommended - one-click repo access)

### 3. Create Web Service
1. Click "New +" button (top right)
2. Select "Web Service"
3. If prompted, authorize Render to access your GitHub

### 4. Connect Repository
1. Find and select: `phchabrol/hours-declaration`
2. Click "Connect"

### 5. Configure Service
Render should auto-detect your `render.yaml` file, but verify:

**Basic Settings:**
- **Name**: `hours-declaration` (or your choice)
- **Region**: `Oregon` (or closest to you)
- **Branch**: `main`
- **Root Directory**: Leave empty

**Build & Deploy:**
- **Environment**: `Docker` (should auto-detect)
- **Dockerfile Path**: `./Dockerfile` (should auto-detect)
- **Docker Context**: `.` (should auto-detect)

**Plan:**
- Select: **Free** (or upgrade if needed)

### 6. Deploy
1. Scroll down
2. Click **"Create Web Service"**
3. Wait 5-10 minutes for first build

### 7. Access Your App
Once deployed, you'll get a URL like:
```
https://hours-declaration.onrender.com
```

## 📱 Mobile Access

1. Open the URL on your phone
2. Test login/signup
3. Add to home screen:
   - **iOS**: Safari → Share → Add to Home Screen
   - **Android**: Chrome → Menu → Add to Home Screen

## ⚙️ Post-Deployment

### Auto-Deploy
- Render automatically deploys on every push to `main` branch
- No manual action needed for updates

### View Logs
- Go to your service dashboard
- Click "Logs" tab to see build and runtime logs

### Custom Domain (Optional)
1. Go to Settings → Custom Domain
2. Add your domain
3. Follow DNS setup instructions

## 🔒 Security Features

Your app includes:
- ✅ HTTPS (automatic on Render)
- ✅ User authentication
- ✅ Secure data storage
- ✅ Security headers (via nginx)

## ⚠️ Free Tier Notes

- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Upgrade to paid plan ($7/month) to avoid spin-down

## 🐛 Troubleshooting

**Build Fails:**
- Check logs in Render dashboard
- Verify Dockerfile is correct
- Ensure all dependencies are in package.json

**App Won't Load:**
- Wait a few minutes (first build takes time)
- Check service status
- Review logs for errors

**Can't Access:**
- Verify service is running (not sleeping)
- Check URL is correct
- Try clearing browser cache

## 📞 Need Help?

- Render Docs: https://render.com/docs
- Render Support: Available in dashboard

---

**Your app will be live and accessible from anywhere! 🎉**

