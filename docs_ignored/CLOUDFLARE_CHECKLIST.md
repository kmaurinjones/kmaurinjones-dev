# Cloudflare Setup Checklist for kmaurinjones.dev

## ✅ Completed (Server-Side)
- [x] Nginx configured with Cloudflare IP ranges
- [x] Real IP restoration configured (CF-Connecting-IP)
- [x] Security headers added
- [x] Static asset caching configured
- [x] Site deployed and serving on port 80
- [x] Permissions set correctly

## 📋 Your To-Do (Cloudflare Dashboard)

### 1. Add Domain to Cloudflare
- [ ] Go to https://dash.cloudflare.com
- [ ] Click "Add a site"
- [ ] Enter: `kmaurinjones.dev`
- [ ] Select: Free plan

### 2. Configure DNS
- [ ] Add A record:
  - Name: `@`
  - Content: `<YOUR_PI_IP_ADDRESS>`
  - Proxy: **ON** (orange cloud ☁️)
- [ ] Add A record:
  - Name: `www`
  - Content: `<YOUR_PI_IP_ADDRESS>`
  - Proxy: **ON** (orange cloud ☁️)

### 3. Update Nameservers at Registrar
- [ ] Copy nameservers from Cloudflare (e.g., `alice.ns.cloudflare.com`)
- [ ] Update at your domain registrar
- [ ] Wait for propagation (5-30 minutes typically)

### 4. SSL/TLS Settings
- [ ] Go to SSL/TLS tab
- [ ] Set mode to: **Flexible**
- [ ] Turn ON: "Always Use HTTPS"
- [ ] Turn ON: "Automatic HTTPS Rewrites"

### 5. Performance (Optional but Recommended)
- [ ] Speed → Optimization → Enable Auto Minify (JS, CSS, HTML)
- [ ] Speed → Optimization → Enable Brotli
- [ ] Caching → Configuration → Browser Cache TTL: 4 hours

### 6. Security (Optional but Recommended)
- [ ] Security → Bots → Enable "Bot Fight Mode"
- [ ] Security → Settings → Set Security Level to "Medium"

### 7. Verify It Works
- [ ] Visit https://kmaurinjones.dev in browser
- [ ] Check for padlock icon (SSL working)
- [ ] Check certificate is from Cloudflare
- [ ] Test www subdomain: https://www.kmaurinjones.dev
- [ ] Verify HTTP redirects to HTTPS

## 🔍 Troubleshooting

If site doesn't load:
```bash
# Check DNS propagation
dig kmaurinjones.dev

# Check nginx is running
systemctl status nginx

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
```

Common issues:
- **522 Error**: Nginx not running or port 80 blocked
- **Mixed content**: Enable "Automatic HTTPS Rewrites"
- **Slow propagation**: Wait up to 24 hours (usually much faster)

## 📚 Documentation
- Full setup guide: `CLOUDFLARE_SETUP.md`
- Deployment info: `DEPLOYMENT_SUMMARY.txt`
- Deployment guide: `DEPLOYMENT.md`

## 🎉 Success Criteria
Your site is live when:
- ✅ `https://kmaurinjones.dev` loads without errors
- ✅ SSL certificate shows (padlock icon)
- ✅ `http://` automatically redirects to `https://`
- ✅ Both `kmaurinjones.dev` and `www.kmaurinjones.dev` work

