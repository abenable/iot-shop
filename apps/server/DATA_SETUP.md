# IoT Shop Data Setup Guide

This guide explains how to fix the channel issue and populate your IoT electronics shop with real data.

## Table of Contents

1. [Fixing the Default Channel](#fixing-the-default-channel)
2. [Populating IoT Data](#populating-iot-data)
3. [Understanding the Structure](#understanding-the-structure)
4. [Troubleshooting](#troubleshooting)

---

## Fixing the Default Channel

### Understanding the Issue

The Vendure **default channel** (code: `__default_channel__`) is special - it cannot actually be deleted because it's protected by the system. However, if you tried to delete it through the admin UI, it may appear hidden or have issues.

### Solution Steps

#### Option 1: Check Current Channel Status (Recommended First Step)

Run the channel diagnostic script:

```bash
cd apps/server
npx ts-node src/scripts/fix-channels.ts
```

This script will:
- Check if the default channel exists
- Display all channels and their status
- Provide recommendations for fixing issues

#### Option 2: Reset Database (For Development)

If the default channel is truly missing or corrupted, the simplest fix is to reset the database:

```bash
# 1. Stop the server if it's running
# 2. Drop and recreate the database
#    - For PostgreSQL: dropdb vendure && createdb vendure
# 3. Run migrations
npx ts-node src/index.ts
# 4. The default channel will be auto-created
```

#### Option 3: Check Admin Dashboard

1. Go to http://localhost:3000/dashboard
2. Navigate to **Settings > Channels**
3. Look for the default channel (should have code `__default_channel__`)
4. If it exists but is hidden, you may need to update its visibility

---

## Populating IoT Data

### Prerequisites

1. Database is running (PostgreSQL)
2. Server dependencies are installed: `npm install`
3. Environment variables are configured in `.env`

### Quick Start

#### Method 1: Fresh Database (Recommended for First Setup)

If you're setting up for the first time or want to start fresh:

```bash
cd apps/server

# This will sync the database schema and populate data
npx ts-node src/scripts/populate-iot-data.ts --sync
```

**WARNING**: The `--sync` flag will DROP all existing tables and recreate them!

#### Method 2: Add to Existing Database

If you already have data and want to add IoT products:

```bash
cd apps/server
npx ts-node src/scripts/populate-iot-data.ts
```

### What's Included

The population script adds:

#### Products (42 items)

| Category | Products |
|----------|----------|
| **Microcontrollers** | Arduino Uno R3, Arduino Nano, Raspberry Pi Pico |
| **Development Boards** | Raspberry Pi 4, ESP32, NodeMCU ESP8266, ESP32-CAM |
| **Sensors** | DHT22, HC-SR04, MPU6050, BMP280, BME680, VL53L0X, MQ-2, Soil Moisture, PIR Motion, Sound Sensor, IR Sensor |
| **Wireless Modules** | NRF24L01, HC-05 Bluetooth, NEO-6M GPS |
| **Power Supplies** | Power Module, Battery Holders, TP4056 Charger |
| **Components** | OLED Display, Relay Modules, LEDs, Resistors, Capacitors, Transistors |
| **Kits** | Arduino Starter Kit, Raspberry Pi Complete Kit |
| **Prototyping** | Breadboard, Jumper Wires |

#### Collections

- **Microcontrollers** - Arduino, Raspberry Pi Pico, etc.
- **Sensors** - Temperature, humidity, motion, distance sensors
- **Development Boards** - ESP32, Raspberry Pi, etc.
- **Wireless Modules** - WiFi, Bluetooth, GPS modules
- **Power Supplies** - Batteries, chargers, power modules
- **Components** - Motors, displays, relays, discrete components

#### Facets for Filtering

- **Category**: Microcontrollers, Sensors, Development Boards, Wireless, Power Supplies, Components, Kits
- **Brand**: Arduino, Raspberry Pi, Espressif, Bosch, Generic
- **Connectivity**: WiFi, Bluetooth, 2.4GHz, GPS
- **Sensor Type**: Temperature, Humidity, Pressure, Motion, Distance, Gas, Infrared

#### Configuration

- **Payment Methods**: Credit Card, PayPal, Bank Transfer
- **Shipping Methods**: Standard ($5), Express ($15), Free ($0)
- **Countries**: US, Canada, UK, Germany, France, Netherlands, Australia, Japan, Singapore
- **Tax Rates**: Standard (20%), Reduced (10%), Zero (0%)

---

## Understanding the Structure

### File Organization

```
apps/server/
├── src/
│   ├── data/
│   │   ├── initial-data.ts      # Configuration data
│   │   ├── products.csv         # Product catalog
│   │   └── assets/              # Product images (placeholders)
│   └── scripts/
│       ├── fix-channels.ts      # Channel diagnostic/repair
│       └── populate-iot-data.ts # Data population script
```

### Product CSV Format

The `products.csv` uses Vendure's standard import format:

```csv
name,slug,description,assets,facets,sku,price,taxCategory,stockOnHand,trackInventory
Arduino Uno R3,arduino-uno-r3,"Description...",arduino-uno.jpg,category:Microcontrollers|brand:Arduino,ARD-UNO-R3,24.99,standard,150,true
```

Key columns:
- **name**: Product name
- **slug**: URL-friendly identifier
- **description**: Product description
- **assets**: Image filenames (pipe-separated)
- **facets**: Facet values for filtering (format: `facetName:value|facetName:value`)
- **sku**: Stock keeping unit
- **price**: Product price
- **stockOnHand**: Initial inventory count
- **trackInventory**: Whether to track stock levels

---

## Troubleshooting

### "Default channel not found" Error

1. Run the channel fix script: `npx ts-node src/scripts/fix-channels.ts`
2. Check the admin dashboard at Settings > Channels
3. If missing, reset the database with `--sync` flag

### "Cannot find module" Errors

Make sure you're in the correct directory:
```bash
cd apps/server
npx ts-node src/scripts/populate-iot-data.ts
```

### Database Connection Errors

Check your `.env` file:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vendure
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

### Products Not Showing in Storefront

After populating data:
1. Start the server: `npm run dev:server`
2. Open admin dashboard: http://localhost:3000/dashboard
3. Go to Catalog > Products
4. Click "Rebuild search index" button

### Images Not Loading

The products.csv references images that should be in `src/data/assets/`.
For initial setup, you can:
1. Add your own product images to that folder
2. Or use placeholder images
3. Or update the CSV to remove asset references

---

## Next Steps

After successful population:

1. **Start the server**:
   ```bash
   npm run dev:server
   ```

2. **Start the storefront** (in a new terminal):
   ```bash
   npm run dev:storefront
   ```

3. **Access the applications**:
   - Admin Dashboard: http://localhost:3000/dashboard
   - Storefront: http://localhost:3001
   - GraphQL Playground: http://localhost:3000/shop-api

4. **Log in to admin dashboard**:
   - Username: `admin` (or your SUPERADMIN_USERNAME)
   - Password: `lurex4098` (or your SUPERADMIN_PASSWORD)

5. **Verify data**:
   - Check products in Catalog > Products
   - View collections in Catalog > Collections
   - Check channels in Settings > Channels

---

## Customization

### Adding Your Own Products

1. Edit `src/data/products.csv`
2. Follow the existing format
3. Add product images to `src/data/assets/`
4. Run the populate script again

### Creating Custom Collections

Edit `src/data/initial-data.ts` and modify the `collections` array:

```typescript
collections: [
    {
        name: 'Your Collection',
        filters: [
            {
                code: 'facet-value-filter',
                args: { facetValueNames: ['YourFacetValue'], containsAny: false },
            },
        ],
    },
],
```

### Adding Custom Facets

Add facet values in the products.csv:
```csv
facets
category:YourCategory|brand:YourBrand
```

---

## Support

- [Vendure Documentation](https://docs.vendure.io)
- [Vendure Discord Community](https://vendure.io/community)
- [Importing Data Guide](https://docs.vendure.io/current/core/developer-guide/importing-data/)
