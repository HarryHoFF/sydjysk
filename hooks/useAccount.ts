import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Account, Transaction, Contact } from '@/types/banking';

const ACCOUNT_NUMBER = '8765-4321-0987';

export function useAccount() {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAccount = useCallback(async () => {
    const { data } = await supabase
      .from('accounts')
      .select('*')
      .eq('account_number', ACCOUNT_NUMBER)
      .maybeSingle();

    if (data) setAccount(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  return { account, loading, refetch: fetchAccount, setAccount };
}

export function useTransactions(accountId: string | undefined) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    if (!accountId) return;
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('account_id', accountId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) setTransactions(data);
    setLoading(false);
  }, [accountId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { transactions, loading, refetch: fetchTransactions };
}

export function useContacts(accountId: string | undefined) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = useCallback(async () => {
    if (!accountId) return;
    const { data } = await supabase
      .from('contacts')
      .select('*')
      .eq('account_id', accountId)
      .order('favorite', { ascending: false })
      .order('name', { ascending: true });

    if (data) setContacts(data);
    setLoading(false);
  }, [accountId]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return { contacts, setContacts, loading, refetch: fetchContacts };
}
