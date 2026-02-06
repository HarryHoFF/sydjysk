/*
  # Sydjyske Business Banking App Schema

  ## Overview
  Database schema for a LARP banking simulation app with accounts, transactions, and contacts.

  ## New Tables
  
  ### `accounts`
  - `id` (uuid, primary key) - Unique account identifier
  - `account_name` (text) - Account holder name (e.g., "Goondocks Haderslev")
  - `account_number` (text) - Account number for display
  - `balance` (numeric) - Current account balance in DKK
  - `currency` (text) - Currency code (default: DKK)
  - `created_at` (timestamptz) - Account creation timestamp
  
  ### `transactions`
  - `id` (uuid, primary key) - Unique transaction identifier
  - `account_id` (uuid, foreign key) - Reference to accounts table
  - `type` (text) - Transaction type: 'credit', 'debit', 'transfer'
  - `amount` (numeric) - Transaction amount
  - `recipient` (text) - Recipient name
  - `description` (text) - Transaction description
  - `status` (text) - Status: 'completed', 'pending', 'failed'
  - `created_at` (timestamptz) - Transaction timestamp
  
  ### `contacts`
  - `id` (uuid, primary key) - Unique contact identifier
  - `account_id` (uuid, foreign key) - Reference to accounts table
  - `name` (text) - Contact name
  - `account_number` (text) - Contact's account number
  - `favorite` (boolean) - Whether contact is marked as favorite
  - `created_at` (timestamptz) - Contact creation timestamp

  ## Security
  - Enable RLS on all tables
  - All data is accessible without authentication (LARP simulation, no real auth needed)
  - Public read/write policies for simulation purposes

  ## Important Notes
  - This is a simulation app for LARP purposes
  - No real money or authentication required
  - Sample data will be inserted separately
*/

-- Create accounts table
CREATE TABLE IF NOT EXISTS accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_name text NOT NULL,
  account_number text UNIQUE NOT NULL,
  balance numeric(15, 2) DEFAULT 0.00,
  currency text DEFAULT 'DKK',
  created_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES accounts(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('credit', 'debit', 'transfer')),
  amount numeric(15, 2) NOT NULL,
  recipient text NOT NULL,
  description text DEFAULT '',
  status text DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')),
  created_at timestamptz DEFAULT now()
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES accounts(id) ON DELETE CASCADE,
  name text NOT NULL,
  account_number text NOT NULL,
  favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_account_id ON contacts(account_id);

-- Enable Row Level Security
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create public access policies (for LARP simulation - no authentication needed)
CREATE POLICY "Allow public read access to accounts"
  ON accounts FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to accounts"
  ON accounts FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update to accounts"
  ON accounts FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to transactions"
  ON transactions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to transactions"
  ON transactions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update to transactions"
  ON transactions FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to contacts"
  ON contacts FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to contacts"
  ON contacts FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update to contacts"
  ON contacts FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to contacts"
  ON contacts FOR DELETE
  TO anon
  USING (true);

-- Insert initial account for Goondocks Haderslev
INSERT INTO accounts (account_name, account_number, balance, currency)
VALUES ('Goondocks Haderslev', '8765-4321-0987', 125000.00, 'DKK')
ON CONFLICT (account_number) DO NOTHING;

-- Insert sample contacts
INSERT INTO contacts (account_id, name, account_number, favorite)
SELECT 
  a.id,
  contact_data.name,
  contact_data.account_number,
  contact_data.favorite
FROM accounts a
CROSS JOIN (
  VALUES 
    ('Nørrebro Taverna', '8765-1234-5678', true),
    ('Haderslev Bryggeriet', '8765-2345-6789', true),
    ('Danske Våbenhandel', '8765-3456-7890', false),
    ('Sønderjysk Marked', '8765-4567-8901', false),
    ('Viking Skibsværft', '8765-5678-9012', false)
) AS contact_data(name, account_number, favorite)
WHERE a.account_number = '8765-4321-0987'
ON CONFLICT DO NOTHING;

-- Insert sample transactions
INSERT INTO transactions (account_id, type, amount, recipient, description, created_at)
SELECT 
  a.id,
  trans_data.type,
  trans_data.amount,
  trans_data.recipient,
  trans_data.description,
  trans_data.created_at
FROM accounts a
CROSS JOIN (
  VALUES 
    ('credit', 5000.00, 'Nørrebro Taverna', 'Betaling for festlokale', now() - interval '2 days'),
    ('debit', 1250.00, 'Haderslev Bryggeriet', 'Drikkevarer til arrangement', now() - interval '3 days'),
    ('credit', 7500.00, 'Sønderjysk Marked', 'Salg af håndværk', now() - interval '5 days'),
    ('debit', 890.00, 'Danske Våbenhandel', 'LARP våben og udstyr', now() - interval '7 days'),
    ('credit', 3200.00, 'Nørrebro Taverna', 'Depositum retur', now() - interval '10 days'),
    ('debit', 2100.00, 'Viking Skibsværft', 'Reparation af skib', now() - interval '12 days'),
    ('credit', 15000.00, 'Sydjyske Bank', 'Månedlig indtægt', now() - interval '15 days')
) AS trans_data(type, amount, recipient, description, created_at)
WHERE a.account_number = '8765-4321-0987'
ON CONFLICT DO NOTHING;