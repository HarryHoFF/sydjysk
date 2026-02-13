import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Repeat,
  Plus,
  Eye,
  EyeOff,
  ChevronDown,
  CheckCircle,
  Link,
  ChevronRight,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';
import { useAccount } from '@/hooks/useAccount';
import { formatBalance } from '@/utils/format';

export default function HomeScreen() {
  const router = useRouter();
  const { account, loading } = useAccount();
  const [balanceHidden, setBalanceHidden] = useState(false);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.green400} />
      </View>
    );
  }

  const actions = [
    { icon: ArrowUpRight, label: 'Send', onPress: () => router.push('/transfer') },
    { icon: ArrowDownLeft, label: 'Anmod', onPress: () => router.push('/request') },
    { icon: Repeat, label: 'Veksle', onPress: () => router.push('/exchange') },
    { icon: Plus, label: 'Tilføj', onPress: () => router.push('/deposit') },
  ];

  return (
    <LinearGradient
      colors={[colors.green950, colors.dark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.6 }}
      style={styles.container}>

      <View style={styles.topBar}>
        <View style={styles.accountPill}>
          <View style={styles.accountDot} />
          <Text style={styles.accountPillText}>{account?.account_name}</Text>
          <ChevronDown size={14} color={colors.gray400} />
        </View>
        <TouchableOpacity
          onPress={() => setBalanceHidden(!balanceHidden)}
          style={styles.eyeButton}
          activeOpacity={0.6}>
          {balanceHidden ? (
            <EyeOff size={20} color={colors.gray400} />
          ) : (
            <Eye size={20} color={colors.gray400} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        <View style={styles.balanceArea}>
          <Text style={styles.balanceLabel}>Disponibel saldo</Text>
          {balanceHidden ? (
            <Text style={styles.balanceAmount}>{'\u2022\u2022\u2022\u2022\u2022\u2022'}</Text>
          ) : (
            <View style={styles.balanceRow}>
              <Text style={styles.balanceAmount}>{formatBalance(account?.balance ?? 0)}</Text>
              <Text style={styles.balanceCurrency}> DKK</Text>
            </View>
          )}
          <Text style={styles.accountNumber}>Konto {account?.account_number}</Text>
        </View>

        <View style={styles.actionsRow}>
          {actions.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.actionItem}
              activeOpacity={0.7}
              onPress={action.onPress}>
              <View style={styles.actionCircle}>
                <action.icon size={24} color={colors.white} strokeWidth={1.8} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.cardsArea}>
          <TouchableOpacity style={styles.promoCard} activeOpacity={0.8}>
            <LinearGradient
              colors={[colors.green900, colors.green800]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.promoGradient}>
              <View style={styles.promoContent}>
                <Text style={styles.promoTitle}>Sydjyske Business</Text>
                <Text style={styles.promoSubtitle}>Erhvervskonto  {'\u2022'}  Haderslev</Text>
              </View>
              <View style={styles.promoBadge}>
                <Text style={styles.promoBadgeText}>Aktiv</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Indgående</Text>
              <Text style={styles.statValueGreen}>+55.542 DKK</Text>
              <Text style={styles.statPeriod}>denne måned</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Udgående</Text>
              <Text style={styles.statValueWhite}>43.242 DKK</Text>
              <Text style={styles.statPeriod}>denne måned</Text>
            </View>
          </View>

          <Text style={styles.servicesHeading}>Betalingstjenester</Text>

          <TouchableOpacity style={styles.serviceCard} activeOpacity={0.7}>
            <View style={styles.serviceLeft}>
              <View style={[styles.serviceIconCircle, styles.paypalIcon]}>
                <Text style={styles.paypalLetter}>P</Text>
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>PayPal</Text>
                <View style={styles.serviceStatusRow}>
                  <CheckCircle size={13} color={colors.green400} strokeWidth={2.2} />
                  <Text style={styles.serviceConnectedText}>Forbundet</Text>
                </View>
                <Text style={styles.serviceDetail}>Goondocks Haderslev</Text>
              </View>
            </View>
            <ChevronRight size={18} color={colors.gray500} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.serviceCard} activeOpacity={0.7}>
            <View style={styles.serviceLeft}>
              <View style={[styles.serviceIconCircle, styles.mobilepayIcon]}>
                <Text style={styles.mobilepayLetter}>M</Text>
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>MobilePay</Text>
                <View style={styles.serviceStatusRow}>
                  <Link size={13} color={colors.gray500} strokeWidth={2.2} />
                  <Text style={styles.serviceDisconnectedText}>Ikke forbundet</Text>
                </View>
              </View>
            </View>
            <View style={styles.connectButton}>
              <Text style={styles.connectButtonText}>Forbind</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.dark,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  accountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  accountDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green400,
  },
  accountPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  eyeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceArea: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 48,
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.gray400,
    fontWeight: '500',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: '200',
    color: colors.white,
    letterSpacing: -1,
  },
  balanceCurrency: {
    fontSize: 20,
    fontWeight: '400',
    color: colors.gray400,
    marginLeft: 4,
  },
  accountNumber: {
    fontSize: 13,
    color: colors.gray500,
    marginTop: 12,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 28,
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  actionItem: {
    alignItems: 'center',
    width: 68,
  },
  actionCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.green800,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray400,
    letterSpacing: 0.2,
  },
  cardsArea: {
    paddingHorizontal: 20,
  },
  promoCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  promoGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 13,
    color: colors.green300,
    fontWeight: '500',
  },
  promoBadge: {
    backgroundColor: 'rgba(74,222,128,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  promoBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.green400,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  statLabel: {
    fontSize: 13,
    color: colors.gray500,
    fontWeight: '500',
    marginBottom: 8,
  },
  statValueGreen: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.green400,
    marginBottom: 4,
  },
  statValueWhite: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 4,
  },
  statPeriod: {
    fontSize: 11,
    color: colors.gray600,
    fontWeight: '500',
  },
  servicesHeading: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray400,
    marginTop: 24,
    marginBottom: 12,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  serviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  paypalIcon: {
    backgroundColor: '#003087',
  },
  paypalLetter: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    fontStyle: 'italic',
  },
  mobilepayIcon: {
    backgroundColor: '#5A78FF',
  },
  mobilepayLetter: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 4,
  },
  serviceStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  serviceConnectedText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.green400,
  },
  serviceDisconnectedText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray500,
  },
  serviceDetail: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.gray500,
    marginTop: 2,
  },
  connectButton: {
    backgroundColor: 'rgba(74,222,128,0.12)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  connectButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.green400,
  },
});
