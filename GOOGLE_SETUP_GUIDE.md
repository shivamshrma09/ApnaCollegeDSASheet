# 🚀 Google Tools Setup Guide for PlusDSA

## 📊 Google Analytics Setup

### Step 1: Create Google Analytics Account
1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with: `shivamsharma27107@gmail.com`
3. Click "Start measuring"
4. Account name: `PlusDSA`
5. Property name: `+DSA | PlusDSA - Code Your Way to Success`
6. Website URL: `https://plusdsa.vercel.app`
7. Industry: `Education`
8. Time zone: `India Standard Time`

### Step 2: Get Tracking ID
1. After setup, copy your `G-XXXXXXXXXX` tracking ID
2. Replace `G-PLUSDSA2024` in `index.html` with your real tracking ID

## 🔍 Google Search Console Setup

### Step 1: Add Property
1. Go to [Google Search Console](https://search.google.com/search-console/)
2. Add property: `https://plusdsa.vercel.app`
3. Choose "URL prefix" method

### Step 2: Verify Ownership
1. Download HTML verification file
2. Upload to `/public/` folder in your project
3. OR copy meta tag and replace `VERCEL_GOOGLE_SEARCH_CONSOLE_CODE` in `index.html`

### Step 3: Submit Sitemap
1. After verification, go to "Sitemaps" section
2. Submit: `https://plusdsa.vercel.app/sitemap.xml`

## 📈 Microsoft Clarity Setup

### Step 1: Create Account
1. Go to [Microsoft Clarity](https://clarity.microsoft.com/)
2. Sign up with: `shivamsharma27107@gmail.com`
3. Create project: `PlusDSA`
4. Website: `https://plusdsa.vercel.app`

### Step 2: Get Tracking Code
1. Copy your Clarity ID
2. Replace `PLUSDSA_CLARITY_2024` in `index.html`

## 🎯 Hotjar Setup (Optional)

### Step 1: Create Account
1. Go to [Hotjar](https://www.hotjar.com/)
2. Sign up with: `shivamsharma27107@gmail.com`
3. Site name: `PlusDSA`
4. Website URL: `https://plusdsa.vercel.app`

### Step 2: Get Tracking ID
1. Copy your Hotjar ID
2. Replace `PLUSDSA_HOTJAR_ID` in `index.html`

## 🚀 Deployment Commands

```bash
# Generate sitemap before deployment
npm run generate-sitemap

# Build and deploy
npm run build

# Deploy to Vercel
vercel --prod
```

## 📋 Post-Deployment Checklist

- [ ] Google Analytics tracking working
- [ ] Search Console verified
- [ ] Sitemap submitted
- [ ] Clarity tracking active
- [ ] All meta tags updated
- [ ] Social media links working
- [ ] Performance optimized

## 🎯 SEO Monitoring

### Weekly Tasks:
- Check Google Search Console for errors
- Monitor keyword rankings
- Update content regularly
- Check page speed insights

### Monthly Tasks:
- Analyze user behavior in Analytics
- Update meta descriptions
- Add new blog content
- Build backlinks

## 📞 Contact Information
- **Founder:** Shivam Kumar
- **Email:** shivamsharma27107@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/shivam-kumar-321810324/
- **Domain:** https://plusdsa.vercel.app
- **Tagline:** "Code Your Way to Success"