export interface Account {
  id: string;
  account_name: string;
  account_number: string;
  balance: number;
  currency: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  account_id: string;
  type: 'credit' | 'debit' | 'transfer';
  amount: number;
  recipient: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
}

export interface Contact {
  id: string;
  account_id: string;
  name: string;
  account_number: string;
  favorite: boolean;
  created_at: string;
}
