import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export default function PersonalInfoScreen() {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [companyName, setCompanyName] = useState('Goondocks Haderslev');
  const [cvr, setCvr] = useState('43978381');
  const [address, setAddress] = useState('Knokbjerg 51');
  const [postalCity, setPostalCity] = useState('6100 Haderslev');
  const [phone, setPhone] = useState('52233847');
  const [email, setEmail] = useState('info@soulfuel.store');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.6}>
          <ArrowLeft size={22} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Personlige oplysninger</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {saved && (
          <View style={styles.savedBanner}>
            <CheckCircle2 size={16} color={colors.green400} />
            <Text style={styles.savedText}>Oplysninger gemt</Text>
          </View>
        )}

        <Text style={styles.sectionLabel}>Virksomhed</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Virksomhedsnavn</Text>
          <TextInput
            style={styles.input}
            value={companyName}
            onChangeText={setCompanyName}
            placeholderTextColor={colors.gray600}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>CVR-nummer</Text>
          <TextInput
            style={[styles.input, styles.readOnly]}
            value={cvr}
            editable={false}
          />
        </View>

        <Text style={[styles.sectionLabel, { marginTop: 28 }]}>Adresse</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Adresse</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholderTextColor={colors.gray600}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Postnr. og by</Text>
          <TextInput
            style={styles.input}
            value={postalCity}
            onChangeText={setPostalCity}
            placeholderTextColor={colors.gray600}
          />
        </View>

        <Text style={[styles.sectionLabel, { marginTop: 28 }]}>Kontakt</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Telefon</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholderTextColor={colors.gray600}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={colors.gray600}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.7}>
          <Text style={styles.saveButtonText}>Gem ændringer</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
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
  content: { paddingHorizontal: 24, paddingBottom: 40 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
    paddingLeft: 2,
  },
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
  readOnly: { opacity: 0.5 },
  savedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(74,222,128,0.1)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.2)',
  },
  savedText: { fontSize: 14, fontWeight: '500', color: colors.green400 },
  saveButton: {
    backgroundColor: colors.green600,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 12,
  },
  saveButtonText: { fontSize: 16, fontWeight: '600', color: colors.white },
});
