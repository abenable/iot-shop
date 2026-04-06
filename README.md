# IoT Electronics Shop

A full-stack e-commerce application for selling IoT electronics components, built with [Vendure](https://www.vendure.io/) (headless commerce) and [Next.js](https://nextjs.org/) (storefront).

## Features

- **Product Catalog**: 42+ IoT products including microcontrollers, sensors, development boards, and components
- **Collections**: Organized by category (Microcontrollers, Sensors, Development Boards, etc.)
- **Faceted Search**: Filter by brand, connectivity, sensor type, and more
- **Multi-currency Support**: USD with extensible currency configuration
- **Responsive Storefront**: Modern Next.js frontend with Tailwind CSS
- **Admin Dashboard**: Full-featured Vendure admin for managing products, orders, and customers

## Project Structure

```
iot-shop/
├── apps/
│   ├── server/          # Vendure backend (GraphQL API, Admin Dashboard)
│   │   ├── src/
│   │   │   ├── data/           # Product data and initial configuration
│   │   │   │   ├── initial-data.ts    # Collections, facets, payment methods
│   │   │   │   ├── products.csv       # 42 IoT products
│   │   │   │   └── assets/            # Product images
│   │   │   └── scripts/
│   │   │       ├── fix-channels.ts    # Fix channel issues
│   │   │       ├── populate-iot-data.ts # Populate database
│   │   │       └── verify-setup.ts    # Verify installation
│   │   └── DATA_SETUP.md       # Detailed data setup guide
│   └── storefront/      # Next.js frontend
├── package.json         # Root workspace configuration
└── README.md           # This file
```

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` files (already provided):

**apps/server/.env**:
```env
APP_ENV=dev
PORT=3000
COOKIE_SECRET=your-secret
SUPERADMIN_USERNAME=admin
SUPERADMIN_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vendure
DB_USERNAME=postgres
DB_PASSWORD=your-db-password
DB_SCHEMA=public
```

**apps/storefront/.env.local**:
```env
VENDURE_SHOP_API_URL=http://localhost:3000/shop-api
VENDURE_CHANNEL_TOKEN=__default_channel__
NEXT_PUBLIC_SITE_URL=http://localhost:3001
REVALIDATION_SECRET=your-secret
```

### 3. Verify Setup

```bash
cd apps/server
npx ts-node src/scripts/verify-setup.ts
```

### 4. Populate IoT Data

For first-time setup (⚠️ This will reset the database):

```bash
cd apps/server
npx ts-node src/scripts/populate-iot-data.ts --sync
```

To add to existing data (without reset):

```bash
npx ts-node src/scripts/populate-iot-data.ts
```

### 5. Start Development

Start both server and storefront:

```bash
npm run dev
```

Or start individually:

```bash
# Terminal 1 - Server
npm run dev:server

# Terminal 2 - Storefront
npm run dev:storefront
```

### 6. Access Applications

- **Vendure Dashboard**: http://localhost:3000/dashboard
  - Username: `admin` (or your SUPERADMIN_USERNAME)
  - Password: `lurex4098` (or your SUPERADMIN_PASSWORD)
- **Storefront**: http://localhost:3001
- **Shop GraphQL API**: http://localhost:3000/shop-api
- **Admin GraphQL API**: http://localhost:3000/admin-api

## Troubleshooting

### Default Channel Issues

If you accidentally "deleted" the default channel:

```bash
cd apps/server
npx ts-node src/scripts/fix-channels.ts
```

This will diagnose and provide solutions for channel issues.

### Products Not Showing

After populating data, rebuild the search index:
1. Go to http://localhost:3000/dashboard
2. Navigate to Catalog > Products
3. Click "Rebuild search index" button

### Database Reset

To completely reset and start fresh:

```bash
# Drop and recreate database
dropdb vendure && createdb vendure

# Populate fresh data
cd apps/server
npx ts-node src/scripts/populate-iot-data.ts --sync
```

## IoT Product Catalog

### Categories

| Category | Products | Description |
|----------|----------|-------------|
| **Microcontrollers** | 3 | Arduino Uno, Nano, Raspberry Pi Pico |
| **Development Boards** | 5 | Raspberry Pi 4, ESP32 variants, NodeMCU |
| **Sensors** | 14 | Temperature, humidity, motion, distance, gas, pressure |
| **Wireless Modules** | 3 | Bluetooth, WiFi, GPS modules |
| **Power Supplies** | 3 | Battery holders, charging modules |
| **Components** | 12 | Displays, motors, relays, discrete components |
| **Kits** | 2 | Arduino and Raspberry Pi starter kits |

### Sample Products

- **Arduino Uno R3** - $24.99 - Perfect for beginners
- **Raspberry Pi 4 (4GB)** - $75.00 - Full-featured mini computer
- **ESP32 Dev Board** - $12.99 - WiFi + Bluetooth microcontroller
- **DHT22 Sensor** - $9.99 - Temperature & humidity sensor
- **Arduino Starter Kit** - $89.99 - Complete beginner kit

See [apps/server/src/data/products.csv](apps/server/src/data/products.csv) for complete list.

## Development

### Adding New Products

1. Edit `apps/server/src/data/products.csv`
2. Add product images to `apps/server/src/data/assets/`
3. Run populate script

### Customizing Collections

Edit `apps/server/src/data/initial-data.ts` to modify collections and facets.

### API Documentation

- [Vendure GraphQL API](https://docs.vendure.io/reference/graphql-api/)
- [Shop API Playground](http://localhost:3000/shop-api) (when server is running)
- [Admin API Playground](http://localhost:3000/admin-api) (when server is running)

## Production Build

```bash
# Build all packages
npm run build

# Start production server
npm run start
```

## Documentation

- **[Detailed Setup Guide](apps/server/DATA_SETUP.md)** - Complete data setup and troubleshooting
- [Vendure Documentation](https://docs.vendure.io)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vendure Discord Community](https://vendure.io/community)

## License

This project is private and for educational purposes.
