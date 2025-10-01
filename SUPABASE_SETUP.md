# Supabase Setup Guide for CotizaciónPro

## Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub or email
4. Create a new project:
   - Project Name: `cotizacionpro`
   - Database Password: (create a strong password and save it)
   - Region: Choose closest to Mexico (e.g., `us-east-1`)

## Step 2: Get API Keys

1. In your Supabase project dashboard, go to Settings → API
2. Copy these values:
   - `Project URL` → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Create a file called `.env.local` in your project root:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 3: Create Database Tables

Go to the SQL Editor in Supabase dashboard and run this SQL:

```sql
-- Create quotes table
CREATE TABLE quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  line_items JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  iva DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own quotes
CREATE POLICY "Users can view own quotes"
  ON quotes FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own quotes
CREATE POLICY "Users can insert own quotes"
  ON quotes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own quotes
CREATE POLICY "Users can update own quotes"
  ON quotes FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy: Users can delete their own quotes
CREATE POLICY "Users can delete own quotes"
  ON quotes FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_quotes_user_id ON quotes(user_id);
CREATE INDEX idx_quotes_created_at ON quotes(created_at DESC);
```

## Step 4: Configure Authentication

1. Go to Authentication → Settings in Supabase
2. Configure Email Auth:
   - Enable "Email" provider
   - Disable "Confirm email" (for MVP - enable later)
3. Set Site URL:
   - Site URL: `http://localhost:3000` (for development)
   - Add production URL later when deploying

## Step 5: Test Your Setup

1. Make sure `.env.local` exists with your keys
2. Run the dev server:
```bash
cd cotizacionpro
npm run dev
```
3. Open http://localhost:3000
4. Try creating an account
5. Try logging in
6. Try creating a quote

## Database Schema Details

### quotes table
- `id`: Unique identifier (UUID)
- `user_id`: Links to the user who created it
- `customer_name`: Name of the customer receiving the quote
- `customer_phone`: Customer's phone number (optional)
- `line_items`: JSON array of line items with structure:
  ```json
  [
    {
      "id": "string",
      "description": "string",
      "quantity": number,
      "pricePerUnit": number
    }
  ]
  ```
- `subtotal`: Total before tax (DECIMAL)
- `iva`: 16% tax amount (DECIMAL)
- `total`: Final total including tax (DECIMAL)
- `created_at`: When quote was created
- `updated_at`: When quote was last modified

## Security Notes

- Row Level Security (RLS) is enabled
- Users can only access their own quotes
- API keys are safe to expose in frontend (anon key only allows authenticated operations)
- Never commit `.env.local` to git (it's already in .gitignore)

## Next Steps After MVP

1. Enable email confirmation for security
2. Add password reset functionality
3. Add ability to update/delete quotes
4. Add search/filter for quotes
5. Add analytics/stats
