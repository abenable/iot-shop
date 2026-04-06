# Fixing Inactive Update Button in Vendure Admin

## The Problem

The "Update" button is inactive because **prices in Vendure are set at the Product Variant level**, not the Product level.

## Solution: Update Prices at the Variant Level

### Method 1: Admin Dashboard (Correct Way)

1. **Go to Catalog > Products**
2. **Click on the product** you want to edit
3. **Click the "Variants" tab** (next to "Details")
4. **Click on the variant** (usually there's just one)
5. **Set the price** in the "Price" field
6. **Click "Update"** - this button should now be active!

![Steps](https://docs.vendure.io/assets/images/product-variants-tab.png)

### Why This Happens

In Vendure's data model:
- **Product** = The general product info (name, description, images)
- **Product Variant** = The sellable unit (SKU, price, stock)

A product can have multiple variants (e.g., different sizes, colors), each with their own price.

---

## Method 2: Using the Script (Quick Fix)

If you need to update many prices quickly:

### List All Current Prices
```bash
cd apps/server
npm run update:prices
```

### Update Specific Product
```bash
cd apps/server
npx ts-node src/scripts/update-product-prices.ts "Arduino Uno R3" 75000
```

### Update Multiple Products
Edit the `products.csv` file and re-populate:
```bash
npm run populate:fresh
```

---

## Method 3: Direct Database Update

If you need to update prices in bulk:

```bash
cd apps/server
npx ts-node -e "
const { bootstrapWorker, RequestContextService, TransactionalConnection } = require('@vendure/core');
const { config } = require('./src/vendure-config');

async function update() {
  const { app } = await bootstrapWorker(config);
  const conn = app.get(TransactionalConnection);
  
  // Update all prices by 10%
  await conn.rawConnection.query('
    UPDATE product_variant SET price = price * 1.1
  ');
  
  console.log('Prices updated');
  await app.close();
}
update();
"
```

---

## Common Issues & Fixes

### Issue: "Update" Button Still Inactive

**Cause**: Missing required fields

**Fix**: Make sure all required fields are filled:
- SKU (Stock Keeping Unit)
- Price
- Tax Category
- Stock On Hand (if tracking inventory)

### Issue: Price Changes Don't Show in Storefront

**Cause**: Cache not cleared

**Fix**: 
1. Go to **Settings > Cache**
2. Click **"Clear Cache"**
3. Or restart the server

### Issue: "Cannot update product"

**Cause**: Product is in multiple channels with different settings

**Fix**: 
1. Check which channel you're editing in
2. Make sure the product is assigned to the correct channel

---

## Understanding the Structure

```
Product: Arduino Uno R3
├── Name: "Arduino Uno R3"
├── Description: "The Arduino Uno R3 is..."
├── Assets: [images]
└── Variants:
    └── Variant 1:
        ├── SKU: ARD-UNO-R3
        ├── Price: 65000  ← UPDATE THIS
        ├── Stock: 150
        └── Tax: Standard
```

---

## Quick Checklist

When updating prices, ensure:
- [ ] You're in the **Variants** tab, not just the product details
- [ ] All required fields are filled (especially SKU and Price)
- [ ] The price is a valid number (no commas, just digits)
- [ ] You've selected the correct variant (if multiple exist)
- [ ] You click **"Save"** or **"Update"** after making changes

---

## Alternative: Bulk Price Update via CSV

1. Export products to CSV
2. Edit prices in spreadsheet
3. Re-import using the populate script

```bash
# After editing products.csv
npm run populate:fresh
```

---

## Need More Help?

- [Vendure Product Variants Docs](https://docs.vendure.io/current/core/concepts/products-variants/)
- [Vendure Admin Guide](https://docs.vendure.io/current/core/administrator-guide/)
- Run: `npm run update:prices` to see current prices
