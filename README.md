# 📋 CotizaciónPro

**Professional quote generator for Mexican contractors**

Built by a 17-year-old entrepreneur to help contractors create professional quotes in minutes from their mobile phones.

## 🎯 Problem Solved

Mexican contractors (plumbers, electricians, construction workers) lose jobs because their handwritten or WhatsApp quotes look unprofessional. CotizaciónPro gives them professional-looking quotes they can create and share in 2 minutes.

## ✨ Features

- 📱 **Mobile-first** - Works great on cheap Android phones
- ⚡ **Fast** - Minimal JavaScript, optimized for slow internet
- 🇲🇽 **Spanish only** - Built for Mexican contractors
- 💰 **Auto-calculations** - Subtotal + 16% IVA + Total
- 📤 **WhatsApp sharing** - Native share to WhatsApp
- 💾 **Auto-save** - Forms save to localStorage (works offline)
- 🔒 **Secure auth** - Email/password with Supabase
- 📸 **Screenshot-optimized** - Professional quote display

## 🚀 Quick Start

### 1. Clone and Install
```bash
cd cotizacionpro
npm install
```

### 2. Set Up Supabase
Follow the detailed instructions in [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)

Quick version:
1. Create account at https://supabase.com
2. Create new project
3. Copy API keys to `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```
4. Run the SQL from `SUPABASE_SETUP.md` to create tables

### 3. Run Locally
```bash
npm run dev
```
Open http://localhost:3000

### 4. Deploy to Vercel
```bash
npm i -g vercel
vercel
```

Add environment variables in Vercel dashboard, then:
```bash
vercel --prod
```

## 📁 Project Structure

```
cotizacionpro/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── login/page.tsx              # Login
│   ├── registro/page.tsx           # Sign up
│   ├── dashboard/page.tsx          # Main dashboard
│   ├── crear-cotizacion/page.tsx   # Create quote form
│   └── cotizacion/[id]/page.tsx    # View quote
├── lib/
│   └── supabase.ts                 # Supabase client
├── SUPABASE_SETUP.md               # Database setup guide
├── QUICKSTART.md                   # Launch guide
└── README.md                       # This file
```

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Deployment:** Vercel
- **Bundle Size:** ~105 KB (first load)

## 🎨 Design Principles

Built specifically for:
- Contractors making $500-2000/month
- Cheap Android phones with slow internet
- Users who aren't tech-savvy
- WhatsApp as primary communication tool

Optimizations:
- Large touch targets (48px minimum)
- High contrast colors (readable outdoors)
- Minimal JavaScript
- WhatsApp green color scheme (familiar)
- No tiny text or complex UI
- One action per page

## 💰 Business Model

**Target:** $30k/month revenue (1,200-1,500 customers @ $20-25/month)

**Pricing:** $20 USD/month subscription

**Payment:** Add later (Stripe/Mercado Pago) when you have 10+ users

## 📊 Database Schema

### quotes table
- `id` - UUID primary key
- `user_id` - Foreign key to auth.users
- `customer_name` - Customer name
- `customer_phone` - Customer phone/WhatsApp
- `line_items` - JSONB array of items
- `subtotal` - Decimal(10,2)
- `iva` - Decimal(10,2) - 16% tax
- `total` - Decimal(10,2)
- `created_at` - Timestamp
- `updated_at` - Timestamp

Row Level Security (RLS) enabled - users only see their own quotes.

## 🔐 Security

- Supabase Row Level Security (RLS) enabled
- Users can only access their own quotes
- Auth required for all protected pages
- Environment variables for sensitive data
- HTTPS enforced in production

## 📝 Development

### Build
```bash
npm run build
```

### Lint
```bash
npm run lint
```

### Type Check
```bash
npx tsc --noEmit
```

## 🐛 Troubleshooting

**Build fails with "supabaseUrl is required"**
- Create `.env.local` with Supabase keys
- See `SUPABASE_SETUP.md` for details

**"quotes table does not exist"**
- Run the SQL in `SUPABASE_SETUP.md`

**Styles not loading**
- Restart dev server
- Clear `.next` folder: `rm -rf .next`

## 🚀 Roadmap

### MVP (Done ✅)
- [x] Landing page
- [x] Auth (signup/login)
- [x] Dashboard
- [x] Create quotes
- [x] View quotes
- [x] Auto-calculations
- [x] WhatsApp sharing

### Next Features
- [ ] List all quotes on dashboard
- [ ] Edit/delete quotes
- [ ] PDF generation
- [ ] Customer database
- [ ] Quote templates
- [ ] Payment integration (Stripe/Mercado Pago)
- [ ] Business info (logo, address)
- [ ] Analytics dashboard

## 📚 Learning Resources

This project teaches:
- Next.js 15 with App Router
- React with TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Auth)
- Mobile-first design
- Building for low-tech users
- SaaS business basics

## 🤝 Contributing

This is a personal project, but suggestions are welcome! Open an issue to discuss.

## 📄 License

MIT

## 🙏 Acknowledgments

Built with Claude Code - AI-powered coding assistant

---

**Made with ❤️ by a 17-year-old entrepreneur**

Building in public. Ship fast, get feedback, improve.
