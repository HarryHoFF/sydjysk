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
    title: '1. Generelle vilkår',
    body: 'Ved at oprette en konto hos Sydjyske Business accepterer du disse vilkår og betingelser. Tjenesten er udelukkende til erhvervsbrug og er underlagt dansk lovgivning. Du er ansvarlig for at holde dine loginoplysninger fortrolige og for alle handlinger, der foretages via din konto.',
  },
  {
    title: '2. Kontoadministration',
    body: 'Kontoen oprettes med de oplysninger, du angiver under registreringen. Du er ansvarlig for at holde dine oplysninger opdaterede. Sydjyske Business forbeholder sig retten til at anmode om yderligere dokumentation i henhold til gældende lovgivning om hvidvask.',
  },
  {
    title: '3. Transaktioner',
    body: 'Overførsler udføres inden for 1-2 hverdage for nationale overførsler og 2-4 hverdage for internationale overførsler. Vekslinger udføres til den gældende kurs på udførelsestidspunktet. Gebyrer kan forekomme for visse transaktionstyper og vil altid fremgå, inden du bekræfter.',
  },
  {
    title: '4. Kort',
    body: 'Debitkort udstedes i forbindelse med din erhvervskonto. Du er ansvarlig for at opbevare kortet sikkert og straks rapportere tab eller tyveri. Kortet kan fryses midlertidigt via appen. Kontaktløse betalinger og onlinebetalinger kan aktiveres og deaktiveres individuelt.',
  },
  {
    title: '5. Gebyrer og priser',
    body: 'Den aktuelle prisliste er tilgængelig på vores hjemmeside og i appen. Gebyrer kan ændres med 30 dages varsel. Kontogebyr, transaktionsgebyrer og vekslingsgebyrer fremgår af din månedlige kontoudtog.',
  },
  {
    title: '6. Sikkerhed',
    body: 'Vi anvender branchestandard kryptering og sikkerhedsforanstaltninger til at beskytte dine data. Du er forpligtet til at bruge stærke adgangskoder og aktivere biometrisk login, hvor det er muligt. Mistænkelig aktivitet bør straks rapporteres til vores kundeservice.',
  },
  {
    title: '7. Ansvarsbegrænsning',
    body: 'Sydjyske Business er ikke ansvarlig for tab, der skyldes uautoriseret adgang som følge af brugerens forsømmelse, tekniske forstyrrelser uden for vores kontrol, eller force majeure-begivenheder. Vores erstatningsansvar er begrænset til direkte tab.',
  },
  {
    title: '8. Opsigelse',
    body: 'Du kan opsige din konto når som helst. Eventuelle udestående saldi vil blive overført til en konto efter dit valg. Sydjyske Business kan opsige kontoforholdet med 60 dages varsel. Ved misbrug kan kontoen lukkes med øjeblikkelig virkning.',
  },
];

export default function TermsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.6}>
          <ArrowLeft size={22} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Vilkår og betingelser</Text>
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
