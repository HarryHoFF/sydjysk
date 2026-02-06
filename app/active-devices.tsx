import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Monitor, Smartphone, Tablet, X } from 'lucide-react-native';
import { colors } from '@/constants/colors';

const DEVICES = [
  {
    id: '1',
    name: 'Chrome - Windows',
    type: 'desktop' as const,
    location: 'Haderslev, DK',
    lastActive: 'Aktiv nu',
    current: true,
  },
  {
    id: '2',
    name: 'iPhone 15 Pro',
    type: 'phone' as const,
    location: 'Haderslev, DK',
    lastActive: 'For 2 timer siden',
    current: false,
  },
  {
    id: '3',
    name: 'iPad Air',
    type: 'tablet' as const,
    location: 'København, DK',
    lastActive: 'For 3 dage siden',
    current: false,
  },
];

const DEVICE_ICONS = {
  desktop: Monitor,
  phone: Smartphone,
  tablet: Tablet,
};

export default function ActiveDevicesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.6}>
          <ArrowLeft size={22} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Aktive enheder</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>
          Her kan du se alle enheder, der er logget ind på din konto. Fjern enheder, du ikke genkender.
        </Text>

        {DEVICES.map((device) => {
          const Icon = DEVICE_ICONS[device.type];
          return (
            <View key={device.id} style={styles.deviceCard}>
              <View style={styles.deviceIcon}>
                <Icon size={22} color={colors.green400} />
              </View>
              <View style={styles.deviceInfo}>
                <View style={styles.deviceHeader}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  {device.current && (
                    <View style={styles.currentBadge}>
                      <Text style={styles.currentBadgeText}>Denne enhed</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.deviceLocation}>{device.location}</Text>
                <Text style={[styles.deviceActive, device.current && styles.deviceActiveNow]}>
                  {device.lastActive}
                </Text>
              </View>
              {!device.current && (
                <TouchableOpacity style={styles.removeBtn} activeOpacity={0.6}>
                  <X size={16} color={colors.red400} />
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        <TouchableOpacity style={styles.logoutAllButton} activeOpacity={0.7}>
          <Text style={styles.logoutAllText}>Log ud af alle andre enheder</Text>
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
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.gray400,
    lineHeight: 22,
    marginBottom: 24,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark200,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  deviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(74,222,128,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  deviceInfo: { flex: 1 },
  deviceHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  deviceName: { fontSize: 15, fontWeight: '600', color: colors.white },
  currentBadge: {
    backgroundColor: 'rgba(74,222,128,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  currentBadgeText: { fontSize: 10, fontWeight: '600', color: colors.green400 },
  deviceLocation: { fontSize: 13, fontWeight: '400', color: colors.gray500, marginBottom: 2 },
  deviceActive: { fontSize: 12, fontWeight: '400', color: colors.gray600 },
  deviceActiveNow: { color: colors.green400 },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(239,68,68,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutAllButton: {
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.15)',
  },
  logoutAllText: { fontSize: 15, fontWeight: '500', color: colors.red400 },
});
