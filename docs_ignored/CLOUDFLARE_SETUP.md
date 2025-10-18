# Cloudflare Setup Guide for kmaurinjones.dev

## Overview
This site is configured to work behind Cloudflare's proxy, which provides:
- ✅ Free SSL/TLS (HTTPS)
- ✅ DDoS protection
- ✅ CDN/caching
- ✅ Web Application Firewall (WAF)

## Step 1: Add Your Domain to Cloudflare

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Click "Add a site"
3. Enter `kmaurinjones.dev`
4. Select the Free plan
5. Cloudflare will scan your existing DNS records

## Step 2: Configure DNS Records

Add the following A records in Cloudflare DNS:

```
Type: A
Name: @
Content: <YOUR_PI_IP_ADDRESS>
Proxy status: Proxied (orange cloud)
TTL: Auto

Type: A
Name: www
Content: <YOUR_PI_IP_ADDRESS>
Proxy status: Proxied (orange cloud)
TTL: Auto
```

**Important**: Make sure the orange cloud is enabled (Proxied) for both records!

## Step 3: Update Nameservers

Cloudflare will provide you with nameservers like:
- `alice.ns.cloudflare.com`
- `bob.ns.cloudflare.com`

Update these at your domain registrar (where you bought kmaurinjones.dev).

⏱️ **Note**: DNS propagation can take up to 24 hours, but usually happens within a few minutes.

## Step 4: Configure SSL/TLS Settings

In Cloudflare Dashboard → SSL/TLS:

1. **SSL/TLS Encryption Mode**: Select **"Flexible"**
   - This encrypts traffic between visitors and Cloudflare
   - Your Pi serves HTTP (port 80), Cloudflare handles HTTPS

2. **Always Use HTTPS**: Turn this ON
   - Automatically redirects HTTP to HTTPS

3. **Automatic HTTPS Rewrites**: Turn this ON
   - Helps avoid mixed content warnings

### Alternative: Full (Strict) Mode (Recommended for Production)

For better security, you can set up a Cloudflare Origin Certificate:

1. Go to SSL/TLS → Origin Server
2. Click "Create Certificate"
3. Save the certificate and private key
4. Install on your Pi (requires nginx HTTPS configuration)
5. Change SSL/TLS mode to "Full (strict)"

## Step 5: Performance Optimization (Optional)

### Auto Minify
**Speed → Optimization → Auto Minify**
- Enable: JavaScript, CSS, HTML

### Brotli Compression
**Speed → Optimization → Brotli**
- Enable this for better compression

### Browser Cache TTL
**Caching → Configuration**
- Set to "4 hours" or higher for static sites

### Page Rules (Optional)
Create a page rule for static assets:
- URL pattern: `kmaurinjones.dev/_app/*`
- Cache Level: Cache Everything
- Edge Cache TTL: 1 month

## Step 6: Security Settings (Optional)

### Security Level
**Security → Settings**
- Set to "Medium" (default is good)

### Bot Fight Mode
**Security → Bots**
- Enable "Bot Fight Mode" (Free)

### Firewall Rules (Advanced)
You can create rules to block traffic by country, IP, etc.

## Nginx Configuration

Your nginx is already configured with:
- ✅ Cloudflare IP ranges for `set_real_ip_from`
- ✅ `CF-Connecting-IP` header to get real visitor IPs
- ✅ Security headers
- ✅ Static asset caching

Configuration file: `/etc/nginx/sites-available/kmaurinjones-dev`

## Verifying It Works

Once DNS propagates, test:

```bash
# Check SSL certificate
curl -I https://kmaurinjones.dev

# Should show Cloudflare server
# Server: cloudflare
```

From your browser:
1. Visit `https://kmaurinjones.dev`
2. Click the padlock icon
3. Certificate should be issued by Cloudflare

## Cloudflare Analytics

View traffic analytics at:
**Analytics & Logs → Web Analytics**

Free tier includes:
- Requests, bandwidth, and unique visitors
- Threats blocked
- Cache statistics

## Troubleshooting

### Site not loading
- Check DNS propagation: `dig kmaurinjones.dev`
- Verify nginx is running: `systemctl status nginx`
- Check nginx logs: `sudo tail -f /var/log/nginx/error.log`

### Mixed content warnings
- Enable "Automatic HTTPS Rewrites" in Cloudflare
- Check that all assets use relative URLs or https://

### 520/521/522 errors
- 520: Web server returned unknown error
- 521: Web server is down
- 522: Connection timed out
  - Check nginx is running
  - Verify firewall allows port 80
  - Check Pi is accessible from internet

### Get real visitor IPs
Your nginx config already handles this. Check with:
```bash
sudo tail -f /var/log/nginx/access.log
```
You should see real visitor IPs, not Cloudflare IPs.

## Important Notes

1. **Port 80 must be open**: Your Pi must accept HTTP connections on port 80 from Cloudflare's IPs
2. **No port 443 needed**: Cloudflare handles HTTPS, your Pi only needs HTTP
3. **Orange cloud = Proxied**: Always keep the orange cloud enabled for protection
4. **Gray cloud = DNS only**: Would bypass Cloudflare protection (not recommended)

## Resources

- [Cloudflare Dashboard](https://dash.cloudflare.com)
- [Cloudflare Docs](https://developers.cloudflare.com/fundamentals/)
- [Cloudflare Status](https://www.cloudflarestatus.com/)

