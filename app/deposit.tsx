import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle2, Plus, CreditCard, Building2 } from 'lucide-react-native';
import { colors } from '@/constants/colors';

type DepositStep = 'form' | 'confirm' | 'success';
type DepositMethod = 'bank' | 'card';

export default function DepositScreen() {
  const router = useRouter();
  const [step, setStep] = useState<DepositStep>('form');
  const [method, setMethod] = useState<DepositMethod>('bank');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    setError(null);
    if (!amount.trim() || isNaN(Number(amount.replace(',', '.'))) || Number(amount.replace(',', '.')) <= 0) {
      setError('Indtast et gyldigt beløb');
      return;
    }
    setStep('confirm');
  };

  const handleConfirm = () => {
    setStep('success');
  };

  const methodLabel = method === 'bank' ? 'Bankoverførsel' : 'Kort';

  if (step === 'success') {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successCircle}>
            <CheckCircle2 size={56} color={colors.green400} strokeWidth={1.5} />
          </View>
          <Text style={styles.successTitle}>Indbetaling modtaget</Text>
          <Text style={styles.successMessage}>
            Din indbetaling på {amount} DKK er modtaget.
            {'\n\n'}
            {method === 'bank'
              ? 'Beløbet vil være tilgængeligt inden for 1-2 hverdage.'
              : 'Beløbet er tilgængeligt med det samme.'}
          </Text>
          <View style={styles.successDetails}>
            <DetailRow label="Beløb" value={`${amount} DKK`} />
            <DetailRow label="Metode" value={methodLabel} />
            <DetailRow label="Til konto" value="Goondocks Haderslev" />
            {reference.trim() ? <DetailRow label="Reference" value={reference} /> : null}
          </View>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => router.back()}
            activeOpacity={0.7}>
            <Text style={styles.doneButtonText}>Tilbage til oversigt</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (step === 'confirm') {
    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => setStep('form')} style={styles.backButton} activeOpacity={0.6}>
            <ArrowLeft size={22} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Bekræft indbetaling</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView contentContainerStyle={styles.confirmContent} showsVerticalScrollIndicator={false}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmAmount}>{amount} DKK</Text>
            <Text style={styles.confirmTo}>til Goondocks Haderslev</Text>
          </View>

          <View style={styles.confirmDetails}>
            <DetailRow label="Beløb" value={`${amount} DKK`} />
            <DetailRow label="Metode" value={methodLabel} />
            <DetailRow label="Til konto" value="8765-4321-0987" />
            {reference.trim() ? <DetailRow label="Reference" value={reference} /> : null}
          </View>

          <Text style={styles.confirmNote}>
            {method === 'bank'
              ? 'Indbetalingen behandles inden for 1-2 hverdage.'
              : 'Indbetalingen behandles med det samme.'}
          </Text>

          <TouchableOpacity style={styles.sendButton} onPress={handleConfirm} activeOpacity={0.7}>
            <Plus size={20} color={colors.white} strokeWidth={1.8} />
            <Text style={styles.sendButtonText}>Bekræft indbetaling</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setStep('form')}
            activeOpacity={0.6}>
            <Text style={styles.cancelButtonText}>Rediger</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.6}>
          <ArrowLeft size={22} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Indsæt penge</Text>
        <View style={styles.backButton} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Text style={styles.sectionLabel}>Til konto</Text>

          <View style={styles.accountCard}>
            <View style={styles.accountDot} />
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>Goondocks Haderslev</Text>
              <Text style={styles.accountDetail}>Reg. Nr. 8765  {'\u2022'}  Konto-Nr. 4321-0987</Text>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { marginTop: 28 }]}>Metode</Text>

          <View style={styles.methodRow}>
            <TouchableOpacity
              style={[styles.methodCard, method === 'bank' && styles.methodCardActive]}
              onPress={() => setMethod('bank')}
              activeOpacity={0.7}>
              <View style={[styles.methodIcon, method === 'bank' && styles.methodIconActive]}>
                <Building2 size={24} color={method === 'bank' ? colors.green400 : colors.gray500} strokeWidth={1.5} />
              </View>
              <Text style={[styles.methodTitle, method === 'bank' && styles.methodTitleActive]}>
                Bankoverførsel
              </Text>
              <Text style={styles.methodSub}>1-2 hverdage</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.methodCard, method === 'card' && styles.methodCardActive]}
              onPress={() => setMethod('card')}
              activeOpacity={0.7}>
              <View style={[styles.methodIcon, method === 'card' && styles.methodIconActive]}>
                <CreditCard size={24} color={method === 'card' ? colors.green400 : colors.gray500} strokeWidth={1.5} />
              </View>
              <Text style={[styles.methodTitle, method === 'card' && styles.methodTitleActive]}>
                Kort
              </Text>
              <Text style={styles.methodSub}>Straks</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.sectionLabel, { marginTop: 28 }]}>Betaling</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Beløb (DKK)</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="0,00"
              placeholderTextColor={colors.gray600}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.quickAmounts}>
            {['500', '1.000', '5.000', '10.000'].map((qa) => (
              <TouchableOpacity
                key={qa}
                style={styles.quickAmount}
                onPress={() => setAmount(qa.replace('.', ''))}
                activeOpacity={0.7}>
                <Text style={styles.quickAmountText}>{qa}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Reference (valgfri)</Text>
            <TextInput
              style={styles.input}
              value={reference}
              onChangeText={setReference}
              placeholder="Note til indbetalingen"
              placeholderTextColor={colors.gray600}
            />
          </View>

          <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.7}>
            <Text style={styles.continueButtonText}>Fortsæt</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitle: { fontSize: 18, fontWeight: '600', color: colors.white },
  formContent: { paddingHorizontal: 24, paddingBottom: 40 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
    paddingLeft: 2,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74,222,128,0.08)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.15)',
  },
  accountDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.green400,
    marginRight: 14,
  },
  accountInfo: { flex: 1 },
  accountName: { fontSize: 15, fontWeight: '600', color: colors.white, marginBottom: 4 },
  accountDetail: { fontSize: 13, fontWeight: '500', color: colors.green300 },
  methodRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  methodCard: {
    flex: 1,
    backgroundColor: colors.dark200,
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  methodCardActive: {
    borderColor: 'rgba(74,222,128,0.3)',
    backgroundColor: 'rgba(74,222,128,0.06)',
  },
  methodIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  methodIconActive: { backgroundColor: 'rgba(74,222,128,0.1)' },
  methodTitle: { fontSize: 14, fontWeight: '600', color: colors.gray400, marginBottom: 4 },
  methodTitleActive: { color: colors.white },
  methodSub: { fontSize: 12, fontWeight: '400', color: colors.gray600 },
  inputGroup: { marginBottom: 18 },
  inputLabel: { fontSize: 13, fontWeight: '500', color: colors.gray400, marginBottom: 8 },
  input: {
    backgroundColor: colors.dark200,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  quickAmount: {
    flex: 1,
    backgroundColor: colors.dark200,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  quickAmountText: { fontSize: 14, fontWeight: '500', color: colors.gray400 },
  errorBanner: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
  },
  errorText: { fontSize: 14, fontWeight: '500', color: colors.red400 },
  continueButton: {
    backgroundColor: colors.green600,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 12,
  },
  continueButtonText: { fontSize: 16, fontWeight: '600', color: colors.white },
  confirmContent: { paddingHorizontal: 24, paddingBottom: 40 },
  confirmCard: {
    backgroundColor: 'rgba(74,222,128,0.08)',
    borderRadius: 20,
    paddingVertical: 32,
    alignItems: 'center',
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.15)',
  },
  confirmAmount: { fontSize: 36, fontWeight: '300', color: colors.white, marginBottom: 6 },
  confirmTo: { fontSize: 15, fontWeight: '500', color: colors.gray400 },
  confirmDetails: {
    backgroundColor: colors.dark200,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  confirmNote: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.gray500,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 20,
  },
  sendButton: {
    backgroundColor: colors.green600,
    borderRadius: 14,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  sendButtonText: { fontSize: 16, fontWeight: '600', color: colors.white },
  cancelButton: { paddingVertical: 16, alignItems: 'center' },
  cancelButtonText: { fontSize: 15, fontWeight: '500', color: colors.gray400 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  detailLabel: { fontSize: 14, fontWeight: '500', color: colors.gray500 },
  detailValue: { fontSize: 14, fontWeight: '500', color: colors.white, maxWidth: '60%', textAlign: 'right' },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(74,222,128,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  successTitle: { fontSize: 24, fontWeight: '600', color: colors.white, marginBottom: 12 },
  successMessage: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.gray400,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  successDetails: {
    width: '100%',
    backgroundColor: colors.dark200,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 18,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  doneButton: {
    backgroundColor: colors.dark200,
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  doneButtonText: { fontSize: 16, fontWeight: '600', color: colors.white },
});
