import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, Shield, Building2 } from 'lucide-react-native';
import { colors } from '@/constants/colors';

const VALID_CVR = '43978381';
const VALID_PASSWORD = '132313';

export default function LoginScreen() {
  const router = useRouter();
  const [cvr, setCvr] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setError(null);

    if (!cvr.trim()) {
      setError('Indtast CVR-nummer');
      return;
    }
    if (!password.trim()) {
      setError('Indtast adgangskode');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (cvr.trim() === VALID_CVR && password === VALID_PASSWORD) {
        router.replace('/(tabs)');
      } else {
        setError('Forkert CVR-nummer eller adgangskode');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Building2 size={36} color={colors.green400} strokeWidth={1.5} />
            </View>
            <Text style={styles.brandName}>Sydjyske</Text>
            <Text style={styles.brandSub}>Business</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Log ind</Text>
            <Text style={styles.formSubtitle}>Brug dit CVR-nummer og adgangskode</Text>

            {error && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CVR-nummer</Text>
              <TextInput
                style={styles.input}
                value={cvr}
                onChangeText={setCvr}
                placeholder="Indtast CVR-nummer"
                placeholderTextColor={colors.gray600}
                keyboardType="number-pad"
                maxLength={8}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Adgangskode</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Indtast adgangskode"
                  placeholderTextColor={colors.gray600}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}>
                  {showPassword ? (
                    <EyeOff size={18} color={colors.gray500} />
                  ) : (
                    <Eye size={18} color={colors.gray500} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              activeOpacity={0.7}
              disabled={loading}>
              <Text style={styles.loginButtonText}>
                {loading ? 'Logger ind...' : 'Log ind'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotButton} activeOpacity={0.6}>
              <Text style={styles.forgotText}>Glemt adgangskode?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.securityNote}>
            <Shield size={14} color={colors.gray600} />
            <Text style={styles.securityText}>
              Beskyttet med bankniveau-kryptering
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Sydjyske Business</Text>
            <Text style={styles.footerVersion}>v1.0.0</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(74,222,128,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.2)',
  },
  brandName: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.5,
  },
  brandSub: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.green400,
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  formCard: {
    backgroundColor: colors.dark200,
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.gray500,
    marginBottom: 24,
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
  inputGroup: { marginBottom: 18 },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray400,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.dark300,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark300,
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
  eyeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  loginButton: {
    backgroundColor: colors.green600,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  forgotButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray400,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 28,
  },
  securityText: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.gray600,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray700,
    marginBottom: 2,
  },
  footerVersion: {
    fontSize: 11,
    color: colors.gray700,
  },
});
