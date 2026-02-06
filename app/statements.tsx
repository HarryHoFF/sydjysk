import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Download, FileText } from 'lucide-react-native';
import { colors } from '@/constants/colors';

const STATEMENTS = [
  { id: '1', period: 'Januar 2026', date: '01.02.2026', size: '124 KB' },
  { id: '2', period: 'December 2025', date: '01.01.2026', size: '98 KB' },
  { id: '3', period: 'November 2025', date: '01.12.2025', size: '112 KB' },
  { id: '4', period: 'Oktober 2025', date: '01.11.2025', size: '87 KB' },
  { id: '5', period: 'September 2025', date: '01.10.2025', size: '134 KB' },
  { id: '6', period: 'August 2025', date: '01.09.2025', size: '105 KB' },
  { id: '7', period: 'Juli 2025', date: '01.08.2025', size: '91 KB' },
  { id: '8', period: 'Juni 2025', date: '01.07.2025', size: '78 KB' },
  { id: '9', period: 'Maj 2025', date: '01.06.2025', size: '142 KB' },
  { id: '10', period: 'April 2025', date: '01.05.2025', size: '116 KB' },
  { id: '11', period: 'Marts 2025', date: '01.04.2025', size: '99 KB' },
  { id: '12', period: 'Februar 2025', date: '01.03.2025', size: '88 KB' },
];

export default function StatementsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.6}>
          <ArrowLeft size={22} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Kontoudtog</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.accountInfo}>
          <Text style={styles.accountName}>Goondocks Haderslev</Text>
          <Text style={styles.accountNumber}>Konto 8765-4321-0987</Text>
        </View>

        <Text style={styles.sectionLabel}>2026</Text>
        <View style={styles.list}>
          {STATEMENTS.filter((s) => s.date.includes('2026')).map((s) => (
            <StatementRow key={s.id} statement={s} />
          ))}
        </View>

        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>2025</Text>
        <View style={styles.list}>
          {STATEMENTS.filter((s) => s.date.includes('2025')).map((s) => (
            <StatementRow key={s.id} statement={s} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function StatementRow({ statement }: { statement: typeof STATEMENTS[0] }) {
  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.6}>
      <View style={styles.rowIcon}>
        <FileText size={18} color={colors.green400} />
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.rowTitle}>{statement.period}</Text>
        <Text style={styles.rowSub}>Oprettet {statement.date}  {'\u2022'}  {statement.size}</Text>
      </View>
      <Download size={18} color={colors.gray500} />
    </TouchableOpacity>
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
  accountInfo: {
    backgroundColor: 'rgba(74,222,128,0.08)',
    borderRadius: 14,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.15)',
  },
  accountName: { fontSize: 16, fontWeight: '600', color: colors.white, marginBottom: 4 },
  accountNumber: { fontSize: 13, fontWeight: '500', color: colors.green300 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    paddingLeft: 4,
  },
  list: {
    backgroundColor: colors.dark200,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(74,222,128,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  rowInfo: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: '500', color: colors.white, marginBottom: 3 },
  rowSub: { fontSize: 12, fontWeight: '400', color: colors.gray500 },
});
