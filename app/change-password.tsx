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
import { ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    setError(null);
    if (!currentPassword.trim()) {
      setError('Indtast din nuværende adgangskode');
      return;
    }
    if (newPassword.length < 8) {
      setError('Ny adgangskode skal være mindst 8 tegn');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Adgangskoderne matcher ikke');
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successCircle}>
            <CheckCircle2 size={56} color={colors.green400} strokeWidth={1.5} />
          </View>
          <Text style={styles.successTitle}>Adgangskode ændret</Text>
          <Text style={styles.successMessage}>
            Din adgangskode er blevet opdateret. Brug den nye adgangskode ved næste login.
          </Text>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => router.back()}
            activeOpacity={0.7}>
            <Text style={styles.doneButtonText}>Tilbage</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.6}>
          <ArrowLeft size={22} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Skift adgangskode</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Nuværende adgangskode</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Indtast nuværende adgangskode"
              placeholderTextColor={colors.gray600}
              secureTextEntry={!showCurrent}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)} style={styles.eyeBtn}>
              {showCurrent ? <EyeOff size={18} color={colors.gray500} /> : <Eye size={18} color={colors.gray500} />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Ny adgangskode</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Mindst 8 tegn"
              placeholderTextColor={colors.gray600}
              secureTextEntry={!showNew}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowNew(!showNew)} style={styles.eyeBtn}>
              {showNew ? <EyeOff size={18} color={colors.gray500} /> : <Eye size={18} color={colors.gray500} />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Bekræft ny adgangskode</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Gentag ny adgangskode"
              placeholderTextColor={colors.gray600}
              secureTextEntry={!showConfirm}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
              {showConfirm ? <EyeOff size={18} color={colors.gray500} /> : <Eye size={18} color={colors.gray500} />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.requirements}>
          <Text style={styles.requirementsTitle}>Krav til adgangskode:</Text>
          <Text style={[styles.requirement, newPassword.length >= 8 && styles.requirementMet]}>
            {newPassword.length >= 8 ? '\u2713' : '\u2022'} Mindst 8 tegn
          </Text>
          <Text style={[styles.requirement, /[A-Z]/.test(newPassword) && styles.requirementMet]}>
            {/[A-Z]/.test(newPassword) ? '\u2713' : '\u2022'} Mindst ét stort bogstav
          </Text>
          <Text style={[styles.requirement, /[0-9]/.test(newPassword) && styles.requirementMet]}>
            {/[0-9]/.test(newPassword) ? '\u2713' : '\u2022'} Mindst ét tal
          </Text>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.7}>
          <Text style={styles.saveButtonText}>Skift adgangskode</Text>
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
  inputGroup: { marginBottom: 18 },
  inputLabel: { fontSize: 13, fontWeight: '500', color: colors.gray400, marginBottom: 8 },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark200,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.white,
  },
  eyeBtn: { paddingHorizontal: 16, paddingVertical: 16 },
  errorBanner: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
  },
  errorText: { fontSize: 14, fontWeight: '500', color: colors.red400 },
  requirements: {
    backgroundColor: colors.dark200,
    borderRadius: 14,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  requirementsTitle: { fontSize: 13, fontWeight: '600', color: colors.gray400, marginBottom: 12 },
  requirement: { fontSize: 14, fontWeight: '400', color: colors.gray500, marginBottom: 6 },
  requirementMet: { color: colors.green400 },
  saveButton: {
    backgroundColor: colors.green600,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  saveButtonText: { fontSize: 16, fontWeight: '600', color: colors.white },
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
