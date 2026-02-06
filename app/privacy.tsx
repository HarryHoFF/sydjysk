import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { colors } from '@/constants/colors';

const SECTIONS = [
  {
    title: '1. Dataansvarlig',
    body: 'Sydjyske Business ApS er dataansvarlig for behandlingen af dine personoplysninger. Vi behandler dine data i overensstemmelse med EU\'s databeskyttelsesforordning (GDPR) og den danske databeskyttelseslov.',
  },
  {
    title: '2. Indsamling af oplysninger',
    body: 'Vi indsamler de oplysninger, du afgiver ved oprettelse af konto, herunder virksomhedsnavn, CVR-nummer, kontaktoplysninger og identifikationsdokumenter. Derudover indsamler vi transaktionsdata, login-aktivitet og enhedsoplysninger for at levere og sikre vores tjenester.',
  },
  {
    title: '3. Formål med behandlingen',
    body: 'Dine oplysninger bruges til kontoadministration, udførelse af transaktioner, overholdelse af lovkrav (herunder hvidvasklovgivning), kundesupport, sikkerhedsovervågning og forbedring af vores tjenester. Vi anvender ikke dine data til markedsføring uden dit samtykke.',
  },
  {
    title: '4. Opbevaring',
    body: 'Dine personoplysninger opbevares, så længe dit kundeforhold er aktivt, og i op til 5 år herefter i henhold til bogføringsloven. Transaktionsdata opbevares i mindst 5 år i overensstemmelse med gældende lovgivning. Data slettes sikkert, når opbevaringsperioden udløber.',
  },
  {
    title: '5. Videregivelse',
    body: 'Vi videregiver kun dine oplysninger til tredjeparter, når det er nødvendigt for at gennemføre transaktioner (f.eks. til andre pengeinstitutter), overholde lovkrav eller med dit udtrykkelige samtykke. Vi sælger aldrig dine personoplysninger.',
  },
  {
    title: '6. Sikkerhed',
    body: 'Vi anvender tekniske og organisatoriske sikkerhedsforanstaltninger, herunder kryptering af data under overførsel og lagring, adgangskontrol, regelmæssige sikkerhedsaudits og medarbejderuddannelse i databeskyttelse.',
  },
  {
    title: '7. Dine rettigheder',
    body: 'Du har ret til at få indsigt i dine personoplysninger, rette fejlagtige oplysninger, anmode om sletning (med forbehold for lovkrav), begrænse behandlingen, dataportabilitet og gøre indsigelse mod behandlingen. Kontakt os for at udøve dine rettigheder.',
  },
  {
    title: '8. Cookies og teknologi',
    body: 'Vores app bruger cookies og lignende teknologier til at huske dine præferencer, sikre login-sessioner og analysere brugen af appen. Du kan administrere dine cookie-præferencer i appens indstillinger.',
  },
  {
    title: '9. Kontakt',
    body: 'For spørgsmål om vores privatlivspolitik eller behandling af dine personoplysninger, kontakt venligst vores databeskyttelsesansvarlige på privacy@sydjyske.dk eller tlf. +45 74 52 00 00.',
  },
];

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.6}>
          <ArrowLeft size={22} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Privatlivspolitik</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Senest opdateret: 1. januar 2026</Text>

        {SECTIONS.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
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
  content: { paddingHorizontal: 24, paddingBottom: 40 },
  lastUpdated: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.gray500,
    marginBottom: 24,
  },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.white, marginBottom: 10 },
  sectionBody: { fontSize: 14, fontWeight: '400', color: colors.gray400, lineHeight: 24 },
});
