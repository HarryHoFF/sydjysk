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
import { ArrowLeft, CheckCircle2, ArrowDownLeft } from 'lucide-react-native';
import { colors } from '@/constants/colors';

type RequestStep = 'form' | 'confirm' | 'success';
type RequestMode = 'account' | 'iban';

export default function RequestScreen() {
  const router = useRouter();
  const [step, setStep] = useState<RequestStep>('form');
  const [mode, setMode] = useState<RequestMode>('account');
  const [name, setName] = useState('');
  const [accountNr, setAccountNr] = useState('');
  const [regNr, setRegNr] = useState('');
  const [iban, setIban] = useState('');
  const [bic, setBic] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    setError(null);
    if (!name.trim()) {
      setError('Indtast afsenderens navn');
      return;
    }
    if (mode === 'account') {
      if (!regNr.trim()) {
        setError('Indtast registreringsnummer');
        return;
      }
      if (!accountNr.trim()) {
        setError('Indtast kontonummer');
        return;
      }
    } else {
      if (!iban.trim()) {
        setError('Indtast IBAN-nummer');
        return;
      }
      if (!bic.trim()) {
        setError('Indtast BIC/SWIFT-kode');
        return;
      }
    }
    if (!amount.trim() || isNaN(Number(amount.replace(',', '.')))) {
      setError('Indtast et gyldigt beløb');
      return;
    }
    setStep('confirm');
  };

  const handleSend = () => {
    setStep('success');
  };

  if (step === 'success') {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successCircle}>
            <CheckCircle2 size={56} color={colors.green400} strokeWidth={1.5} />
          </View>
          <Text style={styles.successTitle}>Anmodning sendt</Text>
          <Text style={styles.successMessage}>
            Din anmodning på {amount} DKK er sendt til {name}.
            {'\n\n'}
            Du får besked, når beløbet er modtaget.
          </Text>
          <View style={styles.successDetails}>
            <DetailRow label="Fra" value={name} />
            {mode === 'account' ? (
              <>
                <DetailRow label="Reg. Nr." value={regNr} />
                <DetailRow label="Konto-Nr." value={accountNr} />
              </>
            ) : (
              <>
                <DetailRow label="IBAN" value={iban} />
                <DetailRow label="BIC/SWIFT" value={bic} />
              </>
            )}
            <DetailRow label="Beløb" value={`${amount} DKK`} />
            {reference.trim() ? <DetailRow label="Besked" value={reference} /> : null}
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
          <Text style={styles.topBarTitle}>Bekræft anmodning</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView contentContainerStyle={styles.confirmContent} showsVerticalScrollIndicator={false}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmAmount}>{amount} DKK</Text>
            <Text style={styles.confirmTo}>fra {name}</Text>
          </View>

          <View style={styles.confirmDetails}>
            <DetailRow label="Fra" value={name} />
            {mode === 'account' ? (
              <>
                <DetailRow label="Reg. Nr." value={regNr} />
                <DetailRow label="Konto-Nr." value={accountNr} />
              </>
            ) : (
              <>
                <DetailRow label="IBAN" value={iban} />
                <DetailRow label="BIC/SWIFT" value={bic} />
              </>
            )}
            <DetailRow label="Beløb" value={`${amount} DKK`} />
            {reference.trim() ? <DetailRow label="Besked" value={reference} /> : null}
          </View>

          <Text style={styles.confirmNote}>
            Modtageren vil modtage en betalingsanmodning.
          </Text>

          <TouchableOpacity style={styles.sendButton} onPress={handleSend} activeOpacity={0.7}>
            <ArrowDownLeft size={20} color={colors.white} strokeWidth={1.8} />
            <Text style={styles.sendButtonText}>Send anmodning</Text>
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
        <Text style={styles.topBarTitle}>Anmod om betaling</Text>
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

          <Text style={styles.sectionLabel}>Til</Text>

          <View style={styles.senderCard}>
            <View style={styles.senderDot} />
            <View style={styles.senderInfo}>
              <Text style={styles.senderName}>Goondocks Haderslev</Text>
              <Text style={styles.senderDetail}>Reg. Nr. 8765  {'\u2022'}  Konto-Nr. 4321-0987</Text>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { marginTop: 28 }]}>Afsender</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Navn</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Afsenderens fulde navn"
              placeholderTextColor={colors.gray600}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[styles.modeTab, mode === 'account' && styles.modeTabActive]}
              onPress={() => setMode('account')}
              activeOpacity={0.7}>
              <Text style={[styles.modeTabText, mode === 'account' && styles.modeTabTextActive]}>
                Reg. + Konto-Nr.
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeTab, mode === 'iban' && styles.modeTabActive]}
              onPress={() => setMode('iban')}
              activeOpacity={0.7}>
              <Text style={[styles.modeTabText, mode === 'iban' && styles.modeTabTextActive]}>
                IBAN + BIC
              </Text>
            </TouchableOpacity>
          </View>

          {mode === 'account' ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Reg. Nr.</Text>
                <TextInput
                  style={styles.input}
                  value={regNr}
                  onChangeText={setRegNr}
                  placeholder="f.eks. 8765"
                  placeholderTextColor={colors.gray600}
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Konto-Nr.</Text>
                <TextInput
                  style={styles.input}
                  value={accountNr}
                  onChangeText={setAccountNr}
                  placeholder="f.eks. 4321-0987"
                  placeholderTextColor={colors.gray600}
                  autoCapitalize="characters"
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>IBAN</Text>
                <TextInput
                  style={styles.input}
                  value={iban}
                  onChangeText={setIban}
                  placeholder="f.eks. DK50 0040 0440 1162 43"
                  placeholderTextColor={colors.gray600}
                  autoCapitalize="characters"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>BIC / SWIFT</Text>
                <TextInput
                  style={styles.input}
                  value={bic}
                  onChangeText={setBic}
                  placeholder="f.eks. NDEADKKK"
                  placeholderTextColor={colors.gray600}
                  autoCapitalize="characters"
                />
              </View>
            </>
          )}

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

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Besked (valgfri)</Text>
            <TextInput
              style={styles.input}
              value={reference}
              onChangeText={setReference}
              placeholder="Besked til afsender"
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
  senderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74,222,128,0.08)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.15)',
  },
  senderDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.green400,
    marginRight: 14,
  },
  senderInfo: { flex: 1 },
  senderName: { fontSize: 15, fontWeight: '600', color: colors.white, marginBottom: 4 },
  senderDetail: { fontSize: 13, fontWeight: '500', color: colors.green300 },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: colors.dark200,
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  modeTab: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  modeTabActive: { backgroundColor: 'rgba(74,222,128,0.15)' },
  modeTabText: { fontSize: 14, fontWeight: '500', color: colors.gray500 },
  modeTabTextActive: { color: colors.green400 },
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
