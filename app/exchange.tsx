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
import { ArrowLeft, CheckCircle2, ArrowDownUp, ChevronDown } from 'lucide-react-native';
import { colors } from '@/constants/colors';

type ExchangeStep = 'form' | 'confirm' | 'success';

const CURRENCIES = [
  { code: 'DKK', name: 'Dansk krone', flag: 'DK' },
  { code: 'EUR', name: 'Euro', flag: 'EU' },
  { code: 'USD', name: 'US Dollar', flag: 'US' },
  { code: 'GBP', name: 'Britisk pund', flag: 'GB' },
  { code: 'SEK', name: 'Svensk krone', flag: 'SE' },
  { code: 'NOK', name: 'Norsk krone', flag: 'NO' },
  { code: 'CHF', name: 'Schweizisk franc', flag: 'CH' },
];

const RATES: Record<string, Record<string, number>> = {
  DKK: { EUR: 0.1341, USD: 0.1457, GBP: 0.1152, SEK: 1.5432, NOK: 1.5187, CHF: 0.1279, DKK: 1 },
  EUR: { DKK: 7.4573, USD: 1.0867, GBP: 0.8592, SEK: 11.508, NOK: 11.326, CHF: 0.9536, EUR: 1 },
  USD: { DKK: 6.8636, EUR: 0.9202, GBP: 0.7908, SEK: 10.593, NOK: 10.425, CHF: 0.8775, USD: 1 },
  GBP: { DKK: 8.6807, EUR: 1.1639, USD: 1.2646, SEK: 13.394, NOK: 13.181, CHF: 1.1096, GBP: 1 },
  SEK: { DKK: 0.6480, EUR: 0.0869, USD: 0.0944, GBP: 0.0747, NOK: 0.9841, CHF: 0.0829, SEK: 1 },
  NOK: { DKK: 0.6585, EUR: 0.0883, USD: 0.0959, GBP: 0.0759, SEK: 1.0162, CHF: 0.0842, NOK: 1 },
  CHF: { DKK: 7.8174, EUR: 1.0487, USD: 1.1396, GBP: 0.9012, SEK: 12.064, NOK: 11.876, CHF: 1 },
};

export default function ExchangeScreen() {
  const router = useRouter();
  const [step, setStep] = useState<ExchangeStep>('form');
  const [fromCurrency, setFromCurrency] = useState('DKK');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('');
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rate = RATES[fromCurrency]?.[toCurrency] ?? 0;
  const parsedAmount = Number(amount.replace(',', '.')) || 0;
  const convertedAmount = (parsedAmount * rate).toFixed(2).replace('.', ',');

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleContinue = () => {
    setError(null);
    if (!amount.trim() || parsedAmount <= 0) {
      setError('Indtast et gyldigt beløb');
      return;
    }
    if (fromCurrency === toCurrency) {
      setError('Vælg to forskellige valutaer');
      return;
    }
    setStep('confirm');
  };

  const handleConfirm = () => {
    setStep('success');
  };

  const getCurrencyInfo = (code: string) => CURRENCIES.find((c) => c.code === code)!;

  if (step === 'success') {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successCircle}>
            <CheckCircle2 size={56} color={colors.green400} strokeWidth={1.5} />
          </View>
          <Text style={styles.successTitle}>Veksling gennemført</Text>
          <Text style={styles.successMessage}>
            {amount} {fromCurrency} er vekslet til {convertedAmount} {toCurrency}.
            {'\n\n'}
            Beløbet er tilgængeligt på din konto.
          </Text>
          <View style={styles.successDetails}>
            <DetailRow label="Fra" value={`${amount} ${fromCurrency}`} />
            <DetailRow label="Til" value={`${convertedAmount} ${toCurrency}`} />
            <DetailRow label="Kurs" value={`1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`} />
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
          <Text style={styles.topBarTitle}>Bekræft veksling</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView contentContainerStyle={styles.confirmContent} showsVerticalScrollIndicator={false}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmAmount}>{amount} {fromCurrency}</Text>
            <ArrowDownUp size={20} color={colors.gray500} style={{ marginVertical: 8 }} />
            <Text style={styles.confirmConverted}>{convertedAmount} {toCurrency}</Text>
          </View>

          <View style={styles.confirmDetails}>
            <DetailRow label="Du betaler" value={`${amount} ${fromCurrency}`} />
            <DetailRow label="Du modtager" value={`${convertedAmount} ${toCurrency}`} />
            <DetailRow label="Kurs" value={`1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`} />
          </View>

          <Text style={styles.confirmNote}>
            Kursen er vejledende og kan variere ved udførelse.
          </Text>

          <TouchableOpacity style={styles.sendButton} onPress={handleConfirm} activeOpacity={0.7}>
            <ArrowDownUp size={20} color={colors.white} strokeWidth={1.8} />
            <Text style={styles.sendButtonText}>Bekræft veksling</Text>
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
        <Text style={styles.topBarTitle}>Veksle valuta</Text>
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

          <Text style={styles.sectionLabel}>Fra</Text>

          <TouchableOpacity
            style={styles.currencySelector}
            onPress={() => { setShowFromPicker(!showFromPicker); setShowToPicker(false); }}
            activeOpacity={0.7}>
            <Text style={styles.currencyFlag}>{getCurrencyInfo(fromCurrency).flag}</Text>
            <View style={styles.currencyInfo}>
              <Text style={styles.currencyCode}>{fromCurrency}</Text>
              <Text style={styles.currencyName}>{getCurrencyInfo(fromCurrency).name}</Text>
            </View>
            <ChevronDown size={18} color={colors.gray500} />
          </TouchableOpacity>

          {showFromPicker && (
            <View style={styles.pickerList}>
              {CURRENCIES.filter((c) => c.code !== fromCurrency).map((c) => (
                <TouchableOpacity
                  key={c.code}
                  style={styles.pickerItem}
                  onPress={() => {
                    if (c.code === toCurrency) setToCurrency(fromCurrency);
                    setFromCurrency(c.code);
                    setShowFromPicker(false);
                  }}
                  activeOpacity={0.6}>
                  <Text style={styles.pickerFlag}>{c.flag}</Text>
                  <Text style={styles.pickerCode}>{c.code}</Text>
                  <Text style={styles.pickerName}>{c.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Beløb ({fromCurrency})</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="0,00"
              placeholderTextColor={colors.gray600}
              keyboardType="decimal-pad"
            />
          </View>

          <TouchableOpacity style={styles.swapButton} onPress={handleSwap} activeOpacity={0.7}>
            <ArrowDownUp size={20} color={colors.green400} />
          </TouchableOpacity>

          <Text style={styles.sectionLabel}>Til</Text>

          <TouchableOpacity
            style={styles.currencySelector}
            onPress={() => { setShowToPicker(!showToPicker); setShowFromPicker(false); }}
            activeOpacity={0.7}>
            <Text style={styles.currencyFlag}>{getCurrencyInfo(toCurrency).flag}</Text>
            <View style={styles.currencyInfo}>
              <Text style={styles.currencyCode}>{toCurrency}</Text>
              <Text style={styles.currencyName}>{getCurrencyInfo(toCurrency).name}</Text>
            </View>
            <ChevronDown size={18} color={colors.gray500} />
          </TouchableOpacity>

          {showToPicker && (
            <View style={styles.pickerList}>
              {CURRENCIES.filter((c) => c.code !== toCurrency).map((c) => (
                <TouchableOpacity
                  key={c.code}
                  style={styles.pickerItem}
                  onPress={() => {
                    if (c.code === fromCurrency) setFromCurrency(toCurrency);
                    setToCurrency(c.code);
                    setShowToPicker(false);
                  }}
                  activeOpacity={0.6}>
                  <Text style={styles.pickerFlag}>{c.flag}</Text>
                  <Text style={styles.pickerCode}>{c.code}</Text>
                  <Text style={styles.pickerName}>{c.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {parsedAmount > 0 && fromCurrency !== toCurrency && (
            <View style={styles.previewCard}>
              <Text style={styles.previewLabel}>Omregnet beløb</Text>
              <Text style={styles.previewAmount}>{convertedAmount} {toCurrency}</Text>
              <Text style={styles.previewRate}>1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}</Text>
            </View>
          )}

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
    marginBottom: 12,
    paddingLeft: 2,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark200,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  currencyFlag: { fontSize: 22, marginRight: 14 },
  currencyInfo: { flex: 1 },
  currencyCode: { fontSize: 16, fontWeight: '600', color: colors.white, marginBottom: 2 },
  currencyName: { fontSize: 13, fontWeight: '400', color: colors.gray500 },
  pickerList: {
    backgroundColor: colors.dark200,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  pickerFlag: { fontSize: 18, marginRight: 12 },
  pickerCode: { fontSize: 15, fontWeight: '600', color: colors.white, width: 44 },
  pickerName: { fontSize: 14, fontWeight: '400', color: colors.gray400 },
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
  swapButton: {
    alignSelf: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(74,222,128,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.2)',
  },
  previewCard: {
    backgroundColor: 'rgba(74,222,128,0.08)',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.15)',
  },
  previewLabel: { fontSize: 13, fontWeight: '500', color: colors.gray400, marginBottom: 6 },
  previewAmount: { fontSize: 28, fontWeight: '300', color: colors.white, marginBottom: 4 },
  previewRate: { fontSize: 13, fontWeight: '400', color: colors.gray500 },
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
    paddingVertical: 28,
    alignItems: 'center',
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.15)',
  },
  confirmAmount: { fontSize: 32, fontWeight: '300', color: colors.white },
  confirmConverted: { fontSize: 28, fontWeight: '300', color: colors.green400 },
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
