import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  User,
  Bell,
  Lock,
  CreditCard,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Shield,
  Smartphone,
  Globe,
  Building,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAccount } from '@/hooks/useAccount';
import { formatFullDate } from '@/utils/format';

export default function SettingsScreen() {
  const router = useRouter();
  const { account } = useAccount();
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mere</Text>
      </View>

      <TouchableOpacity style={styles.profileCard} activeOpacity={0.7}>
        <View style={styles.profileAvatar}>
          <Building size={24} color={colors.green400} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{account?.account_name}</Text>
          <Text style={styles.profileSub}>
            {account?.created_at ? `Medlem siden ${formatFullDate(account.created_at)}` : ''}
          </Text>
        </View>
        <ChevronRight size={18} color={colors.gray600} />
      </TouchableOpacity>

      <Section title="Konto">
        <NavRow icon={User} label="Personlige oplysninger" onPress={() => router.push('/personal-info')} />
        <NavRow icon={CreditCard} label="Administrer kort" onPress={() => router.push('/(tabs)/cards')} />
        <NavRow icon={FileText} label="Kontoudtog" onPress={() => router.push('/statements')} />
        <NavRow icon={Globe} label="Valutakonto" onPress={() => router.push('/currency-account')} />
      </Section>

      <Section title="Sikkerhed">
        <NavRow icon={Lock} label="Skift adgangskode" onPress={() => router.push('/change-password')} />
        <ToggleRow
          icon={Shield}
          label="Biometrisk login"
          value={biometrics}
          onToggle={setBiometrics}
        />
        <NavRow icon={Smartphone} label="Aktive enheder" onPress={() => router.push('/active-devices')} />
      </Section>

      <Section title="Notifikationer">
        <ToggleRow
          icon={Bell}
          label="Push-notifikationer"
          value={notifications}
          onToggle={setNotifications}
        />
      </Section>

      <Section title="Support">
        <NavRow icon={HelpCircle} label="Hjælp & FAQ" onPress={() => router.push('/help')} />
        <NavRow icon={FileText} label="Vilkår og betingelser" onPress={() => router.push('/terms')} />
        <NavRow icon={Shield} label="Privatlivspolitik" onPress={() => router.push('/privacy')} />
      </Section>

      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.7} onPress={() => router.replace('/login')}>
          <LogOut size={18} color={colors.red400} />
          <Text style={styles.logoutText}>Log ud</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerBrand}>Sydjyske Business</Text>
        <Text style={styles.footerVersion}>v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBlock}>{children}</View>
    </View>
  );
}

function NavRow({ icon: Icon, label, onPress }: { icon: any; label: string; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.settingRow} activeOpacity={0.6} onPress={onPress}>
      <View style={styles.settingIcon}>
        <Icon size={18} color={colors.green400} />
      </View>
      <Text style={styles.settingLabel}>{label}</Text>
      <ChevronRight size={16} color={colors.gray600} />
    </TouchableOpacity>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  value,
  onToggle,
}: {
  icon: any;
  label: string;
  value: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingIcon}>
        <Icon size={18} color={colors.green400} />
      </View>
      <Text style={styles.settingLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.dark300, true: colors.green900 }}
        thumbColor={value ? colors.green400 : colors.gray500}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  scrollContent: { paddingBottom: 40 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 28, fontWeight: '700', color: colors.white },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: colors.dark200,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.green900,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 17, fontWeight: '600', color: colors.white, marginBottom: 3 },
  profileSub: { fontSize: 13, color: colors.gray500 },
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    paddingLeft: 4,
  },
  sectionBlock: {
    backgroundColor: colors.dark200,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(74,222,128,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray200,
  },
  logoutSection: { marginTop: 28, paddingHorizontal: 20 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark200,
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  logoutText: { fontSize: 15, fontWeight: '600', color: colors.red400 },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerBrand: { fontSize: 14, fontWeight: '600', color: colors.gray600, marginBottom: 2 },
  footerVersion: { fontSize: 12, color: colors.gray700 },
});
