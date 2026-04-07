# IoT Hub Uganda Email Design System

## 1. Visual Theme & Atmosphere

IoT Hub Uganda's email design balances technical credibility with warm African hospitality. The aesthetic is clean, trustworthy, and modern — reflecting a professional electronics supplier that understands both technology and local needs. The design prioritizes clarity and action: emails should feel like a helpful assistant, not a corporate bulletin.

The color story draws from Ugandan landscapes — the deep greens of fertile land, warm earth tones, and clean sky blues — while maintaining the precision expected of a tech supplier. This creates a unique identity: globally competent, locally rooted.

**Key Characteristics:**
- Clean, spacious layouts with clear visual hierarchy
- Warm, approachable color palette inspired by Uganda
- Generous whitespace to reduce cognitive load
- Clear call-to-action buttons that stand out
- Mobile-first responsive design (most emails opened on phones)
- Professional but not cold — human warmth in copy and design

## 2. Color Palette & Roles

### Primary Brand Colors
- **IoT Green** (`#16a34a`): Primary brand color, CTAs, links. Represents growth, technology, and Uganda's natural wealth.
- **Deep Forest** (`#14532d`): Darker green for hover states and emphasis.
- **Warm Earth** (`#92400e`): Accent for secondary elements, warmth, Ugandan soil.

### Background Colors
- **Pure White** (`#ffffff`): Primary email background. Clean, professional.
- **Soft Cream** (`#fefce8`): Alternative light background for sections. Warmer than stark white.
- **Light Gray** (`#f3f4f6`): Subtle section backgrounds, alternating rows.

### Text Colors
- **Near Black** (`#111827`): Primary headings. High contrast for readability.
- **Dark Gray** (`#374151`): Body text. Softened for comfortable reading.
- **Medium Gray** (`#6b7280`): Secondary text, captions, metadata.
- **Light Gray** (`#9ca3af`): Tertiary text, dividers.

### Semantic Colors
- **Success Green** (`#22c55e`): Success messages, confirmations, order completed.
- **Warning Amber** (`#f59e0b`): Alerts, pending actions, attention needed.
- **Error Red** (`#dc2626`): Errors, failed payments, critical alerts.
- **Info Blue** (`#2563eb`): Informational notes, tips, neutral alerts.

### Interactive States
- **Link Default**: IoT Green (`#16a34a`) with underline.
- **Link Hover**: Deep Forest (`#14532d`), darker shade.
- **Button Primary**: IoT Green background, white text.
- **Button Hover**: Deep Forest background.
- **Button Secondary**: White background, IoT Green border and text.

## 3. Typography Rules

### Font Family
- **Primary**: `Inter`, `system-ui`, `-apple-system`, `Segoe UI`, `Roboto`, `Helvetica`, `Arial`, `sans-serif`
- **Fallback Stack**: Ensure good rendering across all email clients.

### Hierarchy

| Role | Size | Weight | Line Height | Color | Use Case |
|------|------|--------|-------------|-------|----------|
| Email Title | 24px | 700 | 1.3 | Near Black | Main email headline |
| Section Heading | 20px | 600 | 1.4 | Near Black | Order details, section titles |
| Subheading | 18px | 600 | 1.4 | Dark Gray | Product names, key info |
| Body Large | 16px | 400 | 1.6 | Dark Gray | Important body text |
| Body | 14px | 400 | 1.6 | Dark Gray | Standard text |
| Body Small | 13px | 400 | 1.5 | Medium Gray | Secondary information |
| Caption | 12px | 400 | 1.4 | Medium Gray | Metadata, timestamps |
| Caption Bold | 12px | 600 | 1.4 | Dark Gray | Labels, emphasized captions |
| Button | 14px | 600 | 1 | White/Green | CTA buttons |

### Principles
- **Generous line-height** (1.5-1.6) for readability on mobile screens.
- **Weight contrast**: Use 400 (regular) for body, 600 (semibold) for headings, 700 (bold) for titles.
- **Left-aligned text** for body content (better readability than center-aligned).
- **Center-aligned** only for email title and section headers.

## 4. Component Stylings

### Buttons

**Primary Button**
- Background: IoT Green (`#16a34a`)
- Text: White (`#ffffff`)
- Padding: 12px 24px
- Border-radius: 6px
- Font: 14px, weight 600
- Display: inline-block
- Hover: Deep Forest (`#14532d`) background
- Use: Main CTAs — "Shop Now", "Reset Password", "View Order"

**Secondary Button**
- Background: White (`#ffffff`)
- Text: IoT Green (`#16a34a`)
- Border: 2px solid IoT Green
- Padding: 12px 24px
- Border-radius: 6px
- Font: 14px, weight 600
- Hover: Light gray background
- Use: Secondary actions — "Learn More", "Contact Support"

**Text Link**
- Color: IoT Green (`#16a34a`)
- Text-decoration: underline
- Font: inherit size
- Hover: Deep Forest color
- Use: Inline links within text

### Cards & Containers

**Order Summary Card**
- Background: White (`#ffffff`)
- Border: 1px solid Light Gray (`#e5e7eb`)
- Border-radius: 8px
- Padding: 24px
- Shadow: none (keep it clean)

**Product Item**
- Layout: horizontal flex
- Image: 80x80px, rounded 6px
- Content: left-aligned text
- Divider: 1px solid Light Gray between items

**Info Box**
- Background: Soft Cream (`#fefce8`) for neutral/info
- Background: `#f0fdf4` (green tint) for success
- Background: `#fef2f2` (red tint) for errors
- Border-left: 4px solid (matching semantic color)
- Padding: 16px
- Border-radius: 0 6px 6px 0

### Header & Footer

**Email Header**
- Background: White or IoT Green (for welcome emails)
- Logo: centered, 150px width max
- Padding: 24px
- Border-bottom: 1px solid Light Gray (optional)

**Email Footer**
- Background: Light Gray (`#f3f4f6`)
- Padding: 32px 24px
- Text: centered, Medium Gray, 12px
- Links: Dark Gray, underlined
- Social icons: 24px, Dark Gray

## 5. Layout Principles

### Email Container
- Max-width: 600px (standard email width)
- Background: Pure White (`#ffffff`)
- Padding: 24px (desktop), 16px (mobile)

### Spacing System
- Base unit: 8px
- Common spacings: 8px, 16px, 24px, 32px, 48px
- Section padding: 24px vertical
- Between paragraphs: 16px
- Between related items: 12px

### Responsive Behavior
- **Desktop (>600px)**: Full layout, side-by-side product images
- **Mobile (<600px)**: Single column, stacked layout
- **Images**: Max-width 100%, height auto
- **Buttons**: Full width on mobile, auto on desktop
- **Font sizes**: Slightly reduced on mobile if needed

## 6. Email-Specific Guidelines

### Preheader Text
- Hidden visually but shown in email previews
- Max 100 characters
- Complement the subject line, don't repeat it

### Images
- Always include alt text
- Use absolute URLs (not relative)
- Optimize for email (compress, appropriate dimensions)
- Fallback: background color if image fails to load

### Accessibility
- Minimum contrast ratio: 4.5:1 for text
- Don't rely solely on color to convey meaning
- Use semantic HTML (tables for layout in email)
- Provide text alternatives for visual content

### Dark Mode Support
- Test in clients with dark mode (Apple Mail, Outlook)
- Use `prefers-color-scheme` media queries if supported
- Ensure logos have transparent or appropriate backgrounds

## 7. Do's and Don'ts

### Do
- Use IoT Green as the primary action color
- Keep emails focused on ONE primary action
- Make buttons large and tappable (minimum 44px touch target)
- Use clear, action-oriented button text ("Shop Now" not "Click Here")
- Include the company logo at the top
- Add clear contact information in the footer
- Test emails in multiple clients before sending

### Don't
- Use more than 2-3 colors in one email
- Make text too small (minimum 12px)
- Use background images (poor client support)
- Rely on images for critical information
- Use web fonts that aren't widely supported
- Create emails wider than 600px
- Forget to include an unsubscribe link

## 8. Template-Specific Patterns

### Order Confirmation
- Hero: Checkmark icon + "Order Confirmed" heading
- Order number: prominent, copy-friendly
- Product list: image + name + quantity + price
- Summary: subtotal, shipping, tax, total
- CTA: "View Order Details" (primary), "Continue Shopping" (secondary)
- Footer: delivery estimate, support contact

### Password Reset
- Hero: Lock icon + "Reset Your Password"
- Clear explanation text
- Prominent reset button (centered)
- Security note: "Expires in 24 hours"
- Footer: "Didn't request this? Contact support"

### Welcome Email
- Hero: Warm welcome message
- Brand introduction (1-2 sentences)
- "What you can do" section with 3 icons
- Featured products or collections
- CTA: "Start Shopping" (primary)
- Footer: social links, contact info

### Email Verification
- Hero: Envelope icon + "Verify Your Email"
- Clear value proposition
- Verification button (centered, prominent)
- Alternative: "Or copy this link"
- Footer: "Link expires in 48 hours"

## 9. Agent Prompt Guide

### Quick Color Reference
- Primary CTA: IoT Green (`#16a34a`)
- Primary Text: Near Black (`#111827`)
- Body Text: Dark Gray (`#374151`)
- Background: White (`#ffffff`)
- Secondary Background: Light Gray (`#f3f4f6`)
- Success: Success Green (`#22c55e`)
- Error: Error Red (`#dc2626`)

### Example Prompts

**Order Confirmation Email:**
"Create an order confirmation email with white background. Header with IoT Hub Uganda logo centered. Title 'Order Confirmed' in 24px bold Near Black. Green checkmark icon above title. Order #12345 displayed prominently. Product list with images, names, quantities, and prices. Order summary with subtotal, shipping, tax, total. Two buttons: 'View Order Details' (IoT Green background, white text) and 'Continue Shopping' (white background, green border). Footer with contact info and social links."

**Password Reset Email:**
"Design a password reset email. White background. Centered lock icon in IoT Green. Title 'Reset Your Password' in 24px bold. Body text explaining the request. Large centered button 'Reset Password' in IoT Green with white text. Note: 'This link expires in 24 hours'. Footer: 'Didn't request this? Contact support'."

**Welcome Email:**
"Create a welcome email. IoT Green header bar with white logo. Title 'Welcome to IoT Hub Uganda!' in 24px bold white text on green. Body introducing the store. Three feature boxes with icons: 'Quality Products', 'Fast Delivery', 'Expert Support'. Featured products section. 'Start Shopping' CTA button. Footer with contact and social links."

### MJML Component Structure
```
<mjml>
  <mj-head>
    <mj-attributes>
      <mj-text font-family="Inter, system-ui, sans-serif" />
      <mj-button background-color="#16a34a" color="#ffffff" border-radius="6px" />
    </mj-attributes>
  </mj-head>
  <mj-body background-color="#ffffff">
    <mj-section padding="24px">
      <!-- Content here -->
    </mj-section>
  </mj-body>
</mjml>
```
