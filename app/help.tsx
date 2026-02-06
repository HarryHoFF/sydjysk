import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronDown, ChevronUp, MessageCircle, Phone, Mail } from 'lucide-react-native';
import { colors } from '@/constants/colors';

const FAQ_ITEMS = [
  {
    q: 'Hvordan overfører jeg penge til en anden konto?',
    a: 'Tryk på "Send" fra forsiden, indtast modtagerens oplysninger (enten Reg. + Konto-Nr. eller IBAN + BIC), beløb og eventuel reference. Bekræft overførslen, og den udføres inden for 1-2 hverdage.',
  },
  {
    q: 'Hvordan anmoder jeg om en betaling?',
    a: 'Tryk på "Anmod" fra forsiden. Indtast afsenderens oplysninger og det ønskede beløb. Afsenderen modtager en notifikation med betalingsanmodningen.',
  },
  {
    q: 'Hvordan fryser jeg mit kort?',
    a: 'Gå til fanen "Kort" og tryk på "Frys kort". Kortet kan aktiveres igen med det samme ved at trykke på "Aktivér".',
  },
  {
    q: 'Hvordan ændrer jeg min adgangskode?',
    a: 'Gå til "Mere" > "Skift adgangskode". Indtast din nuværende adgangskode og den nye adgangskode to gange. Adgangskoden skal være mindst 8 tegn.',
  },
  {
    q: 'Hvad er en valutakonto?',
    a: 'En valutakonto giver dig mulighed for at holde saldi i forskellige valutaer. Du kan veksle mellem valutaer direkte fra appen under "Veksle" eller "Mere" > "Valutakonto".',
  },
  {
    q: 'Hvordan tilføjer jeg penge til min konto?',
    a: 'Tryk på "Tilføj" fra forsiden. Vælg indbetalingsmetode (bankoverførsel eller kort), indtast beløbet og bekræft. Kortindbetalinger er tilgængelige med det samme.',
  },
  {
    q: 'Hvordan henter jeg kontoudtog?',
    a: 'Gå til "Mere" > "Kontoudtog". Her finder du månedlige kontoudtog, som kan downloades som PDF.',
  },
  {
    q: 'Er mine oplysninger sikre?',
    a: 'Ja. Vi bruger bankniveau-kryptering til at beskytte dine data. Du kan også aktivere biometrisk login under "Mere" > "Sikkerhed" for ekstra beskyttelse.',
  },
];

export default function HelpScreen() {
  const router = useRouter();
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.6}>
          <ArrowLeft size={22} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Hjælp & FAQ</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Kontakt os</Text>

        <View style={styles.contactRow}>
          <TouchableOpacity style={styles.contactCard} activeOpacity={0.7}>
            <View style={styles.contactIcon}>
              <Phone size={20} color={colors.green400} />
            </View>
            <Text style={styles.contactTitle}>Ring til os</Text>
            <Text style={styles.contactSub}>+45 74 52 00 00</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} activeOpacity={0.7}>
            <View style={styles.contactIcon}>
              <Mail size={20} color={colors.green400} />
            </View>
            <Text style={styles.contactTitle}>E-mail</Text>
            <Text style={styles.contactSub}>support@sydjyske.dk</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} activeOpacity={0.7}>
            <View style={styles.contactIcon}>
              <MessageCircle size={20} color={colors.green400} />
            </View>
            <Text style={styles.contactTitle}>Chat</Text>
            <Text style={styles.contactSub}>Hverdage 8-16</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionLabel, { marginTop: 28 }]}>Ofte stillede spørgsmål</Text>

        {FAQ_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.faqItem}
            onPress={() => setExpanded(expanded === index ? null : index)}
            activeOpacity={0.7}>
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{item.q}</Text>
              {expanded === index ? (
                <ChevronUp size={18} color={colors.gray500} />
              ) : (
                <ChevronDown size={18} color={colors.gray500} />
              )}
            </View>
            {expanded === index && (
              <Text style={styles.faqAnswer}>{item.a}</Text>
            )}
          </TouchableOpacity>
        ))}
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
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 14,
    paddingLeft: 4,
  },
  contactRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  contactCard: {
    flex: 1,
    backgroundColor: colors.dark200,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(74,222,128,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactTitle: { fontSize: 13, fontWeight: '600', color: colors.white, marginBottom: 4 },
  contactSub: { fontSize: 11, fontWeight: '400', color: colors.gray500, textAlign: 'center' },
  faqItem: {
    backgroundColor: colors.dark200,
    borderRadius: 14,
    padding: 18,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: { fontSize: 14, fontWeight: '500', color: colors.white, flex: 1, paddingRight: 12 },
  faqAnswer: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.gray400,
    lineHeight: 22,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
});
