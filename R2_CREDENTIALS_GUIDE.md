# How to Get CloudFlare R2 S3 Credentials

## The Problem

You're probably looking at **CloudFlare API Tokens** (which start with `cfat_` or `cfut_`), but you need **R2 S3-compatible credentials**.

These are **different things** in different places!

---

## Step-by-Step: Get the CORRECT Credentials

### 1. Go to R2 Dashboard

Open this exact URL (replace with your account ID):
```
https://dash.cloudflare.com/7db8ddd2e4eb60dc49a3c644f70e2908/r2/overview
```

### 2. Look for "Manage R2 API Tokens"

On the **right side** of the R2 dashboard, you'll see a panel with:
- Bucket details
- **"Manage R2 API Tokens"** ← Click this!
- Usage statistics

![Location](https://cdn.vendure.io/learn/s3-guides/cloudflareR2-bucket.gif)

### 3. Click "Create API Token"

1. Click the **"Create API Token"** button
2. Give it a name: `Vendure IoT Shop`
3. Under **Permissions**, select: **"Object Read & Write"**
4. Click **"Create API Token"**

### 4. ⚠️  CRITICAL: Copy BOTH Values

After clicking "Create", you'll see **TWO** values:

```
Access Key ID:     1234567890abcdef1234567890abcdef
Secret Access Key: abc123xyz789... (very long string)
```

**IMPORTANT:** 
- ✅ Copy the **Access Key ID** 
- ✅ Copy the **Secret Access Key** (this is ONLY shown once!)
- ❌ The tokens you pasted (`cfut_...` and `cfat_...`) are NOT these - those are different API tokens

### 5. What the Credentials Should Look Like

**Correct R2 S3 Credentials:**
```
Access Key ID:     4f8a2b9c1d3e5f7g8h9i0j1k2l3m4n5o
Secret Access Key: 9x8y7z6w5v4u3t2s1r0q9p8o7n6m5l4k3j2i1h0g9f8e7d6c5b4a321
```

**NOT these (these are CloudFlare API tokens, not R2 S3):**
```
cfut_foE1kkJsy4sTmrGnIKKwLtdIa4WHqpAZ1BdYYrMt9fa6b408
cfat_GG3tLo0SnLw6JI1mxQwLGkVCqkcauibKsrDTa6Gg1966278c
```

---

## Troubleshooting

### "I only see one value"

You're probably in the wrong place. Make sure you're in:
- ✅ **R2 Object Storage** → **Manage R2 API Tokens**
- ❌ Not: "My Profile" → "API Tokens" (that's for CloudFlare's API, not R2)

### "I already created a token but only got one key"

Delete it and create a new one. Make sure you see BOTH:
1. Access Key ID
2. Secret Access Key

Right after creation, before closing the dialog.

### "The Secret Access Key field is empty"

You missed it! It was shown once when you created the token. You need to:
1. Delete the existing token
2. Create a new one
3. Copy the Secret Access Key immediately

---

## Quick Checklist

- [ ] I'm at: https://dash.cloudflare.com/7db8ddd2e4eb60dc49a3c644f70e2908/r2/overview
- [ ] I clicked "Manage R2 API Tokens" (right side panel)
- [ ] I clicked "Create API Token"
- [ ] I set permissions to "Object Read & Write"
- [ ] I copied BOTH the Access Key ID and Secret Access Key
- [ ] The Access Key ID does NOT start with `cfat_` or `cfut_`
- [ ] The Secret Access Key is a long random string

---

## Still Stuck?

Try this direct link to the R2 API tokens page:
```
https://dash.cloudflare.com/7db8ddd2e4eb60dc49a3c644f70e2908/r2/api-tokens
```

Or watch CloudFlare's official video: https://developers.cloudflare.com/r2/api/s3/tokens/
