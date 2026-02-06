import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { Star, Send, X, Search, ArrowRight, UserPlus } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { supabase } from '@/lib/supabase';
import { useAccount, useContacts } from '@/hooks/useAccount';
import { formatCurrency, getInitials } from '@/utils/format';
import type { Contact } from '@/types/banking';

export default function ContactsScreen() {
  const { account, setAccount } = useAccount();
  const { contacts, setContacts } = useContacts(account?.id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [sendAmount, setSendAmount] = useState('');
  const [sendDescription, setSendDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const openSend = (contact: Contact) => {
    setSelectedContact(contact);
    setModalVisible(true);
    setSendAmount('');
    setSendDescription('');
    setSendSuccess(false);
    setErrorMsg('');
  };

  const processSend = async () => {
    if (!selectedContact || !account) return;
    setErrorMsg('');
    const amount = parseFloat(sendAmount.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) {
      setErrorMsg('Indtast et gyldigt bel\u00f8b');
      return;
    }
    if (amount > account.balance) {
      setErrorMsg('Ikke nok saldo');
      return;
    }
    setSending(true);
    try {
      const { error: e1 } = await supabase.from('transactions').insert({
        account_id: account.id,
        type: 'debit',
        amount,
        recipient: selectedContact.name,
        description: sendDescription || 'Overf\u00f8rsel',
        status: 'completed',
      });
      if (e1) throw e1;
      const newBal = account.balance - amount;
      const { error: e2 } = await supabase.from('accounts').update({ balance: newBal }).eq('id', account.id);
      if (e2) throw e2;
      setAccount({ ...account, balance: newBal });
      setSendSuccess(true);
    } catch {
      setErrorMsg('Overf\u00f8rsel mislykkedes');
    } finally {
      setSending(false);
    }
  };

  const toggleFav = async (c: Contact) => {
    const { error } = await supabase.from('contacts').update({ favorite: !c.favorite }).eq('id', c.id);
    if (!error) {
      setContacts(
        contacts
          .map((x) => (x.id === c.id ? { ...x, favorite: !x.favorite } : x))
          .sort((a, b) => Number(b.favorite) - Number(a.favorite) || a.name.localeCompare(b.name))
      );
    }
  };

  const filtered = contacts.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const favs = filtered.filter((c) => c.favorite);
  const rest = filtered.filter((c) => !c.favorite);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Kontakter</Text>
          <TouchableOpacity style={styles.addBtn} activeOpacity={0.7}>
            <UserPlus size={18} color={colors.green400} />
          </TouchableOpacity>
        </View>
        <View style={styles.searchRow}>
          <Search size={16} color={colors.gray500} />
          <TextInput
            style={styles.searchInput}
            placeholder="S\u00f8g..."
            placeholderTextColor={colors.gray600}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {favs.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Favoritter</Text>
            <View style={styles.block}>
              {favs.map((c, i) => (
                <View key={c.id}>
                  {i > 0 && <View style={styles.sep} />}
                  <Row contact={c} onSend={() => openSend(c)} onFav={() => toggleFav(c)} />
                </View>
              ))}
            </View>
          </>
        )}

        {rest.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Alle</Text>
            <View style={styles.block}>
              {rest.map((c, i) => (
                <View key={c.id}>
                  {i > 0 && <View style={styles.sep} />}
                  <Row contact={c} onSend={() => openSend(c)} onFav={() => toggleFav(c)} />
                </View>
              ))}
            </View>
          </>
        )}

        {filtered.length === 0 && (
          <Text style={styles.emptyText}>Ingen kontakter fundet</Text>
        )}
        <View style={{ height: 32 }} />
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
            {sendSuccess ? (
              <View style={styles.successArea}>
                <View style={styles.successCircle}>
                  <Send size={28} color={colors.white} />
                </View>
                <Text style={styles.successTitle}>Gennemf\u00f8rt</Text>
                <Text style={styles.successAmt}>
                  {formatCurrency(parseFloat(sendAmount.replace(',', '.')), 'DKK')}
                </Text>
                <Text style={styles.successTo}>til {selectedContact?.name}</Text>
                <TouchableOpacity
                  style={styles.doneBtn}
                  onPress={() => setModalVisible(false)}
                  activeOpacity={0.7}>
                  <Text style={styles.doneBtnText}>F\u00e6rdig</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.sheetHeader}>
                  <Text style={styles.sheetTitle}>Send penge</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                    <X size={20} color={colors.gray400} />
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.sheetBody} showsVerticalScrollIndicator={false}>
                  <View style={styles.recipientRow}>
                    <View style={styles.bigAvatar}>
                      <Text style={styles.bigInitials}>
                        {selectedContact ? getInitials(selectedContact.name) : ''}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.recipientName}>{selectedContact?.name}</Text>
                      <Text style={styles.recipientAcct}>{selectedContact?.account_number}</Text>
                    </View>
                  </View>

                  <Text style={styles.fieldLabel}>BEL\u00d8B</Text>
                  <View style={styles.amountBox}>
                    <TextInput
                      style={styles.amountInput}
                      placeholder="0,00"
                      placeholderTextColor={colors.gray600}
                      value={sendAmount}
                      onChangeText={setSendAmount}
                      keyboardType="decimal-pad"
                    />
                    <Text style={styles.amountCurrency}>DKK</Text>
                  </View>

                  <Text style={styles.fieldLabel}>BESKED</Text>
                  <TextInput
                    style={styles.msgInput}
                    placeholder="Valgfri besked..."
                    placeholderTextColor={colors.gray600}
                    value={sendDescription}
                    onChangeText={setSendDescription}
                  />

                  <View style={styles.balancePill}>
                    <Text style={styles.balancePillLabel}>Tilg\u00e6ngelig</Text>
                    <Text style={styles.balancePillVal}>{formatCurrency(account?.balance ?? 0, 'DKK')}</Text>
                  </View>

                  {errorMsg !== '' && <Text style={styles.errorText}>{errorMsg}</Text>}

                  <TouchableOpacity
                    style={[styles.confirmBtn, sending && { opacity: 0.5 }]}
                    onPress={processSend}
                    disabled={sending}
                    activeOpacity={0.7}>
                    {sending ? (
                      <ActivityIndicator color={colors.white} />
                    ) : (
                      <>
                        <Text style={styles.confirmText}>Bekr\u00e6ft</Text>
                        <ArrowRight size={20} color={colors.white} />
                      </>
                    )}
                  </TouchableOpacity>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Row({ contact, onSend, onFav }: { contact: Contact; onSend: () => void; onFav: () => void }) {
  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Text style={styles.initials}>{getInitials(contact.name)}</Text>
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.rowName}>{contact.name}</Text>
        <Text style={styles.rowAcct}>{contact.account_number}</Text>
      </View>
      <TouchableOpacity onPress={onFav} style={styles.favBtn} activeOpacity={0.6}>
        <Star
          size={16}
          color={contact.favorite ? colors.amber400 : colors.gray600}
          fill={contact.favorite ? colors.amber400 : 'transparent'}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onSend} style={styles.sendBtn} activeOpacity={0.7}>
        <Send size={16} color={colors.dark} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  headerTitle: { fontSize: 28, fontWeight: '700', color: colors.white },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(74,222,128,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark200,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  searchInput: { flex: 1, fontSize: 15, color: colors.white },
  list: { flex: 1, paddingHorizontal: 20 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 12,
    paddingLeft: 4,
  },
  block: {
    backgroundColor: colors.dark200,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  sep: { height: 1, backgroundColor: 'rgba(255,255,255,0.04)', marginLeft: 68 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.green900,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  initials: { fontSize: 14, fontWeight: '700', color: colors.green300 },
  rowInfo: { flex: 1 },
  rowName: { fontSize: 15, fontWeight: '600', color: colors.white, marginBottom: 2 },
  rowAcct: { fontSize: 12, color: colors.gray500 },
  favBtn: { padding: 8 },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.green400,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  emptyText: { fontSize: 15, color: colors.gray500, textAlign: 'center', marginTop: 48 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.dark100,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '88%',
    minHeight: 400,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.dark400,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  sheetTitle: { fontSize: 20, fontWeight: '700', color: colors.white },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.dark300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetBody: { paddingHorizontal: 24, paddingBottom: 32 },
  recipientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark200,
    padding: 16,
    borderRadius: 14,
    marginVertical: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  bigAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.green900,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigInitials: { fontSize: 18, fontWeight: '700', color: colors.green300 },
  recipientName: { fontSize: 17, fontWeight: '600', color: colors.white, marginBottom: 2 },
  recipientAcct: { fontSize: 13, color: colors.gray500 },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.gray500,
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 8,
    paddingLeft: 2,
  },
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark200,
    borderRadius: 14,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 16,
  },
  amountInput: { flex: 1, fontSize: 32, fontWeight: '300', color: colors.white, paddingVertical: 14 },
  amountCurrency: { fontSize: 16, fontWeight: '500', color: colors.gray500 },
  msgInput: {
    backgroundColor: colors.dark200,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 16,
  },
  balancePill: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(74,222,128,0.06)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.1)',
  },
  balancePillLabel: { fontSize: 14, color: colors.gray400 },
  balancePillVal: { fontSize: 15, fontWeight: '600', color: colors.green400 },
  errorText: {
    fontSize: 14,
    color: colors.red400,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  confirmBtn: {
    backgroundColor: colors.green600,
    borderRadius: 14,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  confirmText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  successArea: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 },
  successCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.green600,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: { fontSize: 22, fontWeight: '700', color: colors.white, marginBottom: 8 },
  successAmt: { fontSize: 32, fontWeight: '300', color: colors.green400, marginBottom: 4 },
  successTo: { fontSize: 15, color: colors.gray400, marginBottom: 32 },
  doneBtn: {
    backgroundColor: colors.green600,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 48,
  },
  doneBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },
});
