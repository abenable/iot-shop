# CloudFlare R2 Setup Guide for IoT Shop

## Overview
This guide helps you set up CloudFlare R2 for storing product images and assets.

## Why CloudFlare R2?
- ✅ **No egress fees** - Pay only for storage, not bandwidth
- ✅ **Generous free tier** - 10GB storage + 10M operations/month
- ✅ **S3-compatible** - Works with Vendure's built-in S3 plugin
- ✅ **Global CDN** - Fast asset delivery worldwide
- ✅ **Custom domains** - Use your own domain for assets

---

## Step 1: Create CloudFlare Account

1. Go to https://www.cloudflare.com/
2. Sign up or log in
3. Complete account verification

---

## Step 2: Enable R2 Object Storage

1. In CloudFlare dashboard, click **"R2"** in the left sidebar
2. You may need to add a payment method (R2 has generous free tier)
3. Accept the R2 terms of service

---

## Step 3: Create Your Bucket

1. Click **"Create bucket"**
2. **Bucket name**: `iot-shop-assets` (must be globally unique)
3. **Location**: Select "Automatic" (recommended)
4. Click **"Create bucket"**

---

## Step 4: Get Your Account ID

1. Look at your browser URL when in R2 dashboard
2. It should look like: `https://dash.cloudflare.com/1234567890abcdef/r2/overview`
3. Copy the **Account ID** (the long string of numbers/letters)

---

## Step 5: Create API Token

1. In R2 dashboard, click **"Manage R2 API Tokens"**
2. Click **"Create API Token"**
3. **Token name**: `Vendure IoT Shop`
4. **Permissions**: Select "Object Read & Write"
5. Click **"Create API Token"**
6. **IMPORTANT**: Copy the **Access Key ID** and **Secret Access Key** immediately!
   - The Secret Key will NOT be shown again

---

## Step 6: Configure Your .env File

Edit `apps/server/.env` and update these values:

```env
# CloudFlare R2 Configuration
S3_BUCKET=iot-shop-assets
S3_ACCESS_KEY_ID=your-actual-access-key-id
S3_SECRET_ACCESS_KEY=your-actual-secret-access-key
S3_REGION=auto
S3_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
S3_FORCE_PATH_STYLE=true
```

Replace:
- `your-actual-access-key-id` - From step 5
- `your-actual-secret-access-key` - From step 5  
- `your-account-id` - From step 4

---

## Step 7: Set Up Public Access (Optional)

By default, R2 buckets are private. To make assets publicly accessible:

### Option A: Use CloudFlare's Public URL (Quick)

1. In your R2 bucket, click **"Settings"**
2. Enable **"Public access"**
3. You'll get a URL like: `https://pub-your-hash.r2.dev`
4. Add to your `.env`:
   ```env
   S3_FILE_URL=https://pub-your-hash.r2.dev/
   ```

### Option B: Custom Domain (Professional)

1. In your R2 bucket, click **"Settings"**
2. Under **"Custom domains"**, click **"Connect domain"**
3. Enter your subdomain: `assets.yourdomain.com`
4. Follow DNS setup instructions in CloudFlare
5. Add to your `.env`:
   ```env
   S3_FILE_URL=https://assets.yourdomain.com/
   ```

---

## Step 8: Test Your Setup

1. **Restart your server**:
   ```bash
   npm run dev:server
   ```

2. **Upload a test image**:
   - Go to http://localhost:3000/dashboard
   - Navigate to **Catalog > Assets**
   - Click **"Upload assets"**
   - Select an image and upload

3. **Verify in R2**:
   - Go to CloudFlare R2 dashboard
   - Check if the file appears in your bucket

4. **Check the URL**:
   - The asset URL should point to R2 (e.g., `https://pub-xxx.r2.dev/...`)

---

## Troubleshooting

### "Access Denied" Error
- Verify your Access Key ID and Secret are correct
- Ensure the API token has "Object Read & Write" permissions
- Check that the bucket name matches exactly

### "Bucket Not Found" Error
- Verify the bucket exists in your CloudFlare account
- Check that `S3_FORCE_PATH_STYLE=true` is set
- Ensure the endpoint URL includes your correct Account ID

### Assets Not Loading
- Enable public access in bucket settings, OR
- Set up proper CORS configuration
- Verify `S3_FILE_URL` is set correctly

### Connection Timeout
- Check your internet connection
- Verify the endpoint URL is correct: `https://your-account-id.r2.cloudflarestorage.com`
- Ensure no firewall is blocking the connection

---

## Free Tier Limits

CloudFlare R2 free tier includes:
- **10 GB** storage per month
- **10 million** operations per month (GET, PUT, DELETE)
- **No egress fees** (unlimited downloads!)

For most small-to-medium shops, this is more than enough.

---

## Next Steps

After setting up R2:

1. **Upload your product images** to the admin dashboard
2. All images will be automatically stored in R2
3. Your storefront will serve images from CloudFlare's global CDN
4. Enjoy fast loading times worldwide!

---

## Need Help?

- [CloudFlare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Vendure S3 Storage Guide](https://docs.vendure.io/current/core/how-to/s3-asset-storage/)
- [CloudFlare Community Forum](https://community.cloudflare.com/)
