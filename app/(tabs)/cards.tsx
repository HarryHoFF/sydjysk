import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useState } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Globe,
  ShoppingCart,
  Wifi,
  Smartphone,
  Clock,
  ChevronRight,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';
import { useAccount } from '@/hooks/useAccount';

export default function CardsScreen() {
  const { account } = useAccount();
  const [showDetails, setShowDetails] = useState(false);
  const [cardFrozen, setCardFrozen] = useState(false);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kort</Text>
      </View>

      <View style={styles.cardStage}>
        <LinearGradient
          colors={
            cardFrozen
              ? [colors.gray700, colors.gray600, colors.gray700]
              : [colors.green800, colors.green900, colors.green950]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}>

          {cardFrozen && (
            <View style={styles.frozenOverlay}>
              <Lock size={14} color={colors.white} />
              <Text style={styles.frozenLabel}>FROSSET</Text>
            </View>
          )}

          <View style={styles.orderedBanner}>
            <Clock size={14} color={colors.amber400} />
            <Text style={styles.orderedText}>Bestilt - Kortet er undervejs</Text>
          </View>

          <View style={styles.cardRow1}>
            <Text style={styles.cardBank}>Sydjyske Business</Text>
            <TouchableOpacity onPress={() => setShowDetails(!showDetails)} activeOpacity={0.6}>
              {showDetails ? (
                <EyeOff size={18} color="rgba(255,255,255,0.6)" />
              ) : (
                <Eye size={18} color="rgba(255,255,255,0.6)" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.chipArea}>
            <View style={styles.chip}>
              <View style={styles.chipInner} />
            </View>
            <Wifi size={20} color="rgba(255,255,255,0.4)" style={{ transform: [{ rotate: '90deg' }] }} />
          </View>

          <View style={styles.numberRow}>
            <Text style={styles.cardNumber}>
              {'XXXX  XXXX  XXXX  XXXX'}
            </Text>
          </View>

          <View style={styles.cardRow3}>
            <View>
              <Text style={styles.cardMiniLabel}>KORTHOLDER</Text>
              <Text style={styles.cardMiniValue}>{account?.account_name?.toUpperCase()}</Text>
            </View>
            <View>
              <Text style={styles.cardMiniLabel}>UDLØBER</Text>
              <Text style={styles.cardMiniValue}>{'XX/XX'}</Text>
            </View>
            <View>
              <Text style={styles.cardMiniLabel}>CVV</Text>
              <Text style={styles.cardMiniValue}>{'XXX'}</Text>
            </View>
          </View>

          <View style={styles.cardRow4}>
            <Text style={styles.debitLabel}>DEBIT</Text>
            <Text style={styles.visaLabel}>VISA</Text>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.pendingInfo}>
        <View style={styles.pendingDot} />
        <Text style={styles.pendingText}>
          Dit kort er bestilt og sendes til din adresse inden for 5-7 hverdage.
          Du modtager en besked, når kortet er aktiveret.
        </Text>
      </View>

      <View style={styles.freezeRow}>
        <TouchableOpacity
          style={[styles.freezeBtn, cardFrozen && styles.freezeBtnActive]}
          onPress={() => setCardFrozen(!cardFrozen)}
          activeOpacity={0.7}>
          {cardFrozen ? <Unlock size={20} color={colors.white} /> : <Lock size={20} color={colors.green400} />}
          <Text style={[styles.freezeText, cardFrozen && styles.freezeTextActive]}>
            {cardFrozen ? 'Aktivér' : 'Frys kort'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.freezeBtn} activeOpacity={0.7}>
          <Smartphone size={20} color={colors.green400} />
          <Text style={styles.freezeText}>Apple Pay</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Indstillinger</Text>
        <View style={styles.settingsBlock}>
          <ToggleItem icon={ShoppingCart} label="Onlinebetalinger" defaultValue={false} />
          <ToggleItem icon={Wifi} label="Kontaktløs betaling" defaultValue={false} />
          <ToggleItem icon={Globe} label="Udlandstransaktioner" defaultValue={false} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Grænser</Text>
        <View style={styles.settingsBlock}>
          <LimitItem label="Daglig hævning" value="5.000 DKK" pct={0} />
          <LimitItem label="Daglig overførsel" value="25.000 DKK" pct={0} />
          <LimitItem label="Månedligt forbrug" value="100.000 DKK" pct={0} />
        </View>
      </View>
    </ScrollView>
  );
}

function ToggleItem({ icon: Icon, label, defaultValue }: { icon: any; label: string; defaultValue: boolean }) {
  const [on, setOn] = useState(defaultValue);
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleIcon}>
        <Icon size={18} color={colors.green400} />
      </View>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch
        value={on}
        onValueChange={setOn}
        trackColor={{ false: colors.dark300, true: colors.green900 }}
        thumbColor={on ? colors.green400 : colors.gray500}
      />
    </View>
  );
}

function LimitItem({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <TouchableOpacity style={styles.limitRow} activeOpacity={0.6}>
      <View style={styles.limitTop}>
        <Text style={styles.limitLabel}>{label}</Text>
        <View style={styles.limitRight}>
          <Text style={styles.limitValue}>{value}</Text>
          <ChevronRight size={16} color={colors.gray600} />
        </View>
      </View>
      <View style={styles.limitBar}>
        <View style={[styles.limitFill, { width: `${Math.max(pct, 2)}%` }]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
  },
  cardStage: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    minHeight: 220,
  },
  frozenOverlay: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 5,
  },
  frozenLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 1,
  },
  orderedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(251,191,36,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  orderedText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.amber400,
    letterSpacing: 0.2,
  },
  cardRow1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardBank: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
    letterSpacing: 0.5,
  },
  chipArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  chip: {
    width: 36,
    height: 26,
    borderRadius: 5,
    backgroundColor: 'rgba(255,215,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipInner: {
    width: 20,
    height: 14,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(180,150,0,0.5)',
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 2.5,
    flex: 1,
  },
  cardRow3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardMiniLabel: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardMiniValue: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
  },
  cardRow4: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  debitLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 2,
  },
  visaLabel: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 3,
  },
  pendingInfo: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
    alignItems: 'flex-start',
  },
  pendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.amber400,
    marginTop: 5,
  },
  pendingText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '400',
    color: colors.gray400,
    lineHeight: 20,
  },
  freezeRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  freezeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.dark200,
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  freezeBtnActive: {
    backgroundColor: colors.green800,
    borderColor: colors.green700,
  },
  freezeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray300,
  },
  freezeTextActive: {
    color: colors.white,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray500,
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingLeft: 4,
  },
  settingsBlock: {
    backgroundColor: colors.dark200,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  toggleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(74,222,128,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  toggleLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray200,
  },
  limitRow: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  limitTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  limitLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray200,
  },
  limitRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  limitValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray400,
  },
  limitBar: {
    height: 3,
    backgroundColor: colors.dark400,
    borderRadius: 2,
  },
  limitFill: {
    height: 3,
    backgroundColor: colors.green500,
    borderRadius: 2,
  },
});
