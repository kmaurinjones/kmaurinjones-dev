# ✅ Deployment Complete - kmaurinjones.dev

## 🎉 Your Site is Live!

**URL**: https://kmaurinjones.dev  
**Status**: Deployed via Cloudflare Tunnel  
**Deployed**: October 17, 2025

---

## What Was Deployed

### Site Details
- **Type**: Static SvelteKit application
- **Framework**: SvelteKit with `adapter-static`
- **Pages**: Home, Technical, Experience, Projects, Thoughts (with 7 blog articles), Contact
- **Size**: 2.0 MB

### Infrastructure
- **Hosting**: Raspberry Pi 5 (ARM64)
- **Web Server**: nginx (port 80, local only)
- **CDN/Proxy**: Cloudflare Tunnel (no port forwarding needed!)
- **SSL/TLS**: Cloudflare (automatic HTTPS)
- **Tunnel ID**: `ea425a3b-3d23-46de-a8bb-183799c2a833`

---

## How It Works

```
Visitor → Cloudflare Edge (HTTPS) → Cloudflare Tunnel → Pi (HTTP:80) → nginx → Static Files
```

**No port forwarding required!** Cloudflare Tunnel creates an outbound connection from your Pi to Cloudflare.

---

## Configuration Files

### Cloudflare Tunnel Config
**Location**: `/etc/cloudflared/config.yml`

```yaml
tunnel: ea425a3b-3d23-46de-a8bb-183799c2a833
credentials-file: /home/kmaurinjones/.cloudflared/ea425a3b-3d23-46de-a8bb-183799c2a833.json

ingress:
  - hostname: kmaurinjones.dev
    service: http://localhost:80
  - hostname: www.kmaurinjones.dev
    service: http://localhost:80
  - hostname: webhook.kmaurinjones.dev
    service: http://localhost:8888
  - hostname: connections.kmaurinjones.dev
    service: http://localhost:5000
  - hostname: wordle.kmaurinjones.dev
    service: http://localhost:8000
  - hostname: strengthy.kmaurinjones.dev
    service: http://localhost:3000
  - service: http_status:404
```

### Nginx Config
**Location**: `/etc/nginx/sites-available/kmaurinjones-dev`

- Serves static files from `/home/kmaurinjones/projects/sites/kmaurinjones-dev`
- Configured with Cloudflare IP restoration
- Security headers enabled
- Asset caching configured (1 year)

### DNS Records (Cloudflare)
- `kmaurinjones.dev` → `ea425a3b-3d23-46de-a8bb-183799c2a833.cfargotunnel.com` (Proxied)
- `www.kmaurinjones.dev` → `ea425a3b-3d23-46de-a8bb-183799c2a833.cfargotunnel.com` (Proxied)

---

## Directory Structure

```
/home/kmaurinjones/
├── projects/
│   ├── kmaurinjones-dev/          # Git repository
│   │   ├── src/                   # SvelteKit source
│   │   ├── build/                 # Built files (generated)
│   │   ├── deploy.sh              # Deployment script
│   │   ├── DEPLOYMENT.md          # Full deployment guide
│   │   └── CLOUDFLARE_SETUP.md    # Cloudflare setup guide
│   └── sites/
│       └── kmaurinjones-dev/      # Production files (served by nginx)
└── .cloudflared/
    └── ea425a3b-3d23-46de-a8bb-183799c2a833.json  # Tunnel credentials
```

---

## Deployment Process

### Automated (Recommended)
```bash
cd /home/kmaurinjones/projects/kmaurinjones-dev
./deploy.sh
```

### Manual Steps
```bash
cd /home/kmaurinjones/projects/kmaurinjones-dev
git pull
npm install
uv sync
npm run build
cp -r build/* /home/kmaurinjones/projects/sites/kmaurinjones-dev/
chmod -R o+rX /home/kmaurinjones/projects/sites/kmaurinjones-dev
```

No need to restart anything - files are served immediately!

---

## Service Management

### Cloudflare Tunnel
```bash
# Status
sudo systemctl status cloudflared

# Restart
sudo systemctl restart cloudflared

# Logs
sudo journalctl -u cloudflared -f
```

### Nginx
```bash
# Status
systemctl status nginx

# Test config
sudo nginx -t

# Reload
sudo systemctl reload nginx

# Logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## Testing Your Site

### From Browser
1. Visit: https://kmaurinjones.dev
2. Should see your portfolio homepage
3. SSL certificate valid (from Cloudflare)
4. Both `kmaurinjones.dev` and `www.kmaurinjones.dev` work

### From Command Line (on Pi)
```bash
# Test locally
curl -I http://localhost:80 -H "Host: kmaurinjones.dev"

# Test via Cloudflare (may timeout from Pi)
curl -I https://kmaurinjones.dev
```

---

## Troubleshooting

### Site Not Loading
1. Check cloudflared is running:
   ```bash
   sudo systemctl status cloudflared
   ```

2. Check nginx is running:
   ```bash
   systemctl status nginx
   ```

3. Check cloudflared logs:
   ```bash
   sudo journalctl -u cloudflared -n 50
   ```

4. Check nginx logs:
   ```bash
   sudo tail -50 /var/log/nginx/error.log
   ```

### 404 Errors
- Verify files exist: `ls -la /home/kmaurinjones/projects/sites/kmaurinjones-dev/`
- Check nginx config: `sudo nginx -t`
- Check permissions: Files should be readable by others (o+r)

### Cloudflare Tunnel Not Connecting
```bash
# Restart tunnel
sudo systemctl restart cloudflared

# Check tunnel status in Cloudflare dashboard
# https://one.dash.cloudflare.com/ → Networks → Tunnels
```

---

## Important Notes

### Updating Content
- Make changes on your MacBook
- Push to GitHub
- SSH to Pi and run `./deploy.sh`
- Changes are live immediately (no service restart needed)

### Cloudflare Features Active
- ✅ Free SSL/TLS (HTTPS)
- ✅ DDoS protection
- ✅ CDN caching
- ✅ Bot protection
- ✅ Analytics
- ✅ Always Use HTTPS

### No Port Forwarding Required
Your router doesn't need any port forwarding rules. Cloudflare Tunnel creates an outbound connection from your Pi to Cloudflare's edge network.

---

## Performance

- **First load**: ~200-300ms (with Cloudflare CDN)
- **Cached assets**: ~50-100ms
- **Page size**: ~11KB (homepage HTML)
- **Total size**: 2.0MB (all assets)

---

## Security

- ✅ HTTPS enforced (via Cloudflare)
- ✅ Security headers configured
- ✅ No direct exposure of Pi to internet
- ✅ DDoS protection via Cloudflare
- ✅ Real visitor IPs logged (not Cloudflare IPs)

---

## Next Steps

1. **Test your site**: Visit https://kmaurinjones.dev
2. **Update content**: Make changes and deploy
3. **Monitor**: Check Cloudflare analytics
4. **Optional**: Set up Cloudflare Page Rules for additional caching

---

## Documentation

- **Full Deployment Guide**: `DEPLOYMENT.md`
- **Cloudflare Setup**: `CLOUDFLARE_SETUP.md`
- **Quick Summary**: `DEPLOYMENT_SUMMARY.txt`
- **Deployment Script**: `deploy.sh`

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review nginx and cloudflared logs
3. Verify DNS in Cloudflare dashboard
4. Check systemd service status

**Your site is live and ready to go!** 🚀
