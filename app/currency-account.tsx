import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react-native';
import { colors } from '@/constants/colors';

const CURRENCY_BALANCES = [
  { code: 'EUR', name: 'Euro', balance: 2450.0, flag: 'EU', change: '+1.2%' },
  { code: 'USD', name: 'US Dollar', balance: 890.5, flag: 'US', change: '-0.3%' },
  { code: 'GBP', name: 'Britisk pund', balance: 0, flag: 'GB', change: '+0.5%' },
  { code: 'SEK', name: 'Svensk krone', balance: 15200.0, flag: 'SE', change: '-0.1%' },
  { code: 'NOK', name: 'Norsk krone', balance: 0, flag: 'NO', change: '+0.2%' },
  { code: 'CHF', name: 'Schweizisk franc', balance: 0, flag: 'CH', change: '+0.8%' },
];

export default function CurrencyAccountScreen() {
  const router = useRouter();

  const totalDKK = CURRENCY_BALANCES.reduce((sum, c) => {
    const rates: Record<string, number> = {
      EUR: 7.4573,
      USD: 6.8636,
      GBP: 8.6807,
      SEK: 0.648,
      NOK: 0.6585,
      CHF: 7.8174,
    };
    return sum + c.balance * (rates[c.code] ?? 0);
  }, 0);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.6}>
          <ArrowLeft size={22} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Valutakonto</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Samlet saldo i DKK</Text>
          <Text style={styles.totalAmount}>
            {totalDKK.toLocaleString('da-DK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DKK
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Valutabeholdning</Text>

        {CURRENCY_BALANCES.map((currency) => {
          const isPositive = currency.change.startsWith('+');
          return (
            <TouchableOpacity
              key={currency.code}
              style={styles.currencyCard}
              activeOpacity={0.7}
              onPress={() => router.push('/exchange')}>
              <View style={styles.currencyLeft}>
                <Text style={styles.currencyFlag}>{currency.flag}</Text>
                <View style={styles.currencyInfo}>
                  <Text style={styles.currencyCode}>{currency.code}</Text>
                  <Text style={styles.currencyName}>{currency.name}</Text>
                </View>
              </View>
              <View style={styles.currencyRight}>
                <Text style={styles.currencyBalance}>
                  {currency.balance.toLocaleString('da-DK', { minimumFractionDigits: 2 })}
                </Text>
                <View style={styles.changeRow}>
                  {isPositive ? (
                    <TrendingUp size={12} color={colors.green400} />
                  ) : (
                    <TrendingDown size={12} color={colors.red400} />
                  )}
                  <Text style={[styles.changeText, { color: isPositive ? colors.green400 : colors.red400 }]}>
                    {currency.change}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={styles.exchangeButton}
          onPress={() => router.push('/exchange')}
          activeOpacity={0.7}>
          <Text style={styles.exchangeButtonText}>Veksle valuta</Text>
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
  totalCard: {
    backgroundColor: 'rgba(74,222,128,0.08)',
    borderRadius: 20,
    paddingVertical: 28,
    alignItems: 'center',
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.15)',
  },
  totalLabel: { fontSize: 14, fontWeight: '500', color: colors.gray400, marginBottom: 8 },
  totalAmount: { fontSize: 32, fontWeight: '300', color: colors.white },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    paddingLeft: 4,
  },
  currencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.dark200,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  currencyLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  currencyFlag: { fontSize: 22, marginRight: 14 },
  currencyInfo: {},
  currencyCode: { fontSize: 16, fontWeight: '600', color: colors.white, marginBottom: 2 },
  currencyName: { fontSize: 13, fontWeight: '400', color: colors.gray500 },
  currencyRight: { alignItems: 'flex-end' },
  currencyBalance: { fontSize: 16, fontWeight: '600', color: colors.white, marginBottom: 2 },
  changeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  changeText: { fontSize: 12, fontWeight: '500' },
  exchangeButton: {
    backgroundColor: colors.green600,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 16,
  },
  exchangeButtonText: { fontSize: 16, fontWeight: '600', color: colors.white },
});
