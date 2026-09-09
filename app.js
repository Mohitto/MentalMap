/**
 * MentalMap — Planetary Relationship Mapper
 * Maps your relationships as planets orbiting you (the Sun).
 * Scoring: 0-17 = Level 1, 18-34 = Level 2, 35-50 = Level 3 (closest).
 */

// ═══════════════════════════════════════════
// SURVEY DATA
// ═══════════════════════════════════════════

const SURVEY_QUESTIONS = [
  // ── Indicator questions (indices 0, 1, 2) ──
  {
    text: 'Jak ta osoba reaguje, gdy mówisz o swoim małym sukcesie lub czymś dla ciebie ważnym?',
    answers: [
      { points: 3, text: 'Aktywnie dopytuje o szczegóły i skupia się na tym, co mówisz.' },
      { points: 2, text: 'Reaguje krótko, ale pozytywnie, napisze że gratuluje albo że super, bez wdawania się w szczegóły.' },
      { points: 0, text: 'Nie odnosi się do tematu, ignoruje wiadomość, ewentualnie zostawi "lajka".' },
      { points: -3, text: 'Umniejsza znaczenie Twojego sukcesu lub od razu skupia się na sobie.' },
      { points: 0, text: 'Jeszcze nie było sytuacji, by to ocenić.' }
    ]
  },
  {
    text: 'Jak wygląda wsparcie w sytuacjach, gdy potrzebujesz pomocy?',
    answers: [
      { points: 3, text: 'Proponuje pomoc, zanim w ogóle o nią poprosisz.' },
      { points: 2, text: 'Pomaga, gdy poprosisz o pomoc wprost.' },
      { points: 0, text: 'Szuka wymówek, kalkuluje lub zgadza się, ale z widoczną niechęcią.' },
      { points: -3, text: 'Całkowicie odcina się od problemu, nie oferuje żadnej pomocy.' },
      { points: 0, text: 'Jeszcze nie było sytuacji, by to ocenić.' }
    ]
  },
  {
    text: 'Czy ta osoba cię inspiruje?',
    answers: [
      { points: 6, text: 'Inspiruje mnie do samych dobrych rzeczy.' },
      { points: 3, text: 'Nie inspiruje mnie ani do dobrych ani do złych rzeczy.' },
      { points: 0, text: 'Inspiruje mnie zarówno do dobrych jak i złych rzeczy.' },
      { points: -3, text: 'Inspiruje mnie do samych złych rzeczy.' }
    ]
  },
  // ── Remaining questions ──
  {
    text: 'Kto inicjuje kontakt (pisze, lub dzwoni pierwszy, proponuje spotkania)?',
    answers: [
      { points: 3, text: 'Inicjatywa jest rozłożona po równo.' },
      { points: 2, text: 'Zazwyczaj to ta druga osoba inicjuje kontakt.' },
      { points: 0, text: 'Zazwyczaj to ja inicjuję kontakt.' },
      { points: -3, text: 'Nie ma kontaktu do czasu aż ja go nie zainicjuję.' }
    ]
  },
  {
    text: 'Jak się czujesz po spotkaniu lub rozmowie z tą osobą?',
    answers: [
      { points: 3, text: 'Mam więcej energii, czuję się zainspirowany, mam ochotę spotkać się znów.' },
      { points: 2, text: 'Czuję się normalnie, ani lepiej, ani gorzej, rozmowa mnie nie męczy.' },
      { points: 0, text: 'Czuję lekkie zmęczenie, potrzebuję chwili dla siebie.' },
      { points: -3, text: 'Czuję się wyładowany z energii, zirytowany lub niespokojny.' }
    ]
  },
  {
    text: 'Jak rozwiązujecie różnice zdań i konflikty?',
    answers: [
      { points: 3, text: 'Logicznie analizujecie problem i wspólnie dochodzicie do obiektywnej prawdy.' },
      { points: 2, text: 'Ktoś ustępuje, żeby nie podejmować trudnego tematu i uniknąć kłótni.' },
      { points: 1, text: 'Druga strona walczy o to, by mieć rację, bez względu na to, jaka ona jest.' },
      { points: -3, text: 'Pojawia się agresja słowna, wytykanie problemów lub "ciche dni".' },
      { points: 0, text: 'Jeszcze nie było sytuacji, by to ocenić.' }
    ]
  },
  {
    text: 'Jak wygląda kontakt z tą osobą (wiadomości/telefony)?',
    answers: [
      { points: 3, text: 'Rozmowa jest płynna, zawsze odbiera, a jeśli nastąpiło opóźnienie w odpowiedzi, odnosi się do każdej wiadomości i zawsze oddzwania.' },
      { points: 2, text: 'Zdarza się że nie odbierze, ale oddzwania. Odpowiada często z opóźnieniem, ale zawsze wraca do sedna sprawy.' },
      { points: 1, text: 'Często nie odbiera, odpisuje tylko czasem, wtedy kiedy ma na to ochotę, nie zawsze na temat.' },
      { points: -3, text: 'Nie odbiera telefonów, a wiadomości są systematycznie ignorowane.' }
    ]
  },
  {
    text: 'Jak wygląda sposób umawiania się na spotkania?',
    answers: [
      { points: 3, text: 'Wspólnie dążycie do spotkań i szukacie na nie czasu.' },
      { points: 2, text: 'Druga osoba stara się spotkać, ale Ty nie masz dla niej czasu.' },
      { points: 1, text: 'Ty próbujesz się spotkać i ciągle jest problem z ustaleniem terminu.' },
      { points: 0, text: 'Spotkanie na żywo nie jest możliwe, albo nikomu z was na tym nie zależy.' }
    ]
  },
  {
    text: 'Czy ta osoba pamięta szczegóły z twojego życia?',
    answers: [
      { points: 3, text: 'Pamięta szczegóły, fakty z twojego życia i sama do nich wraca w kolejnych rozmowach.' },
      { points: 2, text: 'Pamięta najważniejsze rzeczy, ale zapomina o drobnostkach.' },
      { points: 1, text: 'Musisz powtarzać te same rzeczy wiele razy, mówisz jak "grochem o ścianę".' },
      { points: -3, text: 'Nie pamięta niczego, nie kojarzy podstawowych faktów na twój temat.' },
      { points: 0, text: 'Jeszcze nie było sytuacji, by to ocenić.' }
    ]
  },
  {
    text: 'Jak ta osoba reaguje, gdy stawiasz twardą granicę lub jej odmawiasz?',
    answers: [
      { points: 3, text: 'Od razu akceptuje twoją decyzję i nie próbuje jej zmieniać.' },
      { points: 2, text: 'Akceptuje to, ale widać, że na chwilę psuje jej się humor.' },
      { points: 1, text: 'Próbuje negocjować lub wymusza na tobie tłumaczenie się z podjętej decyzji.' },
      { points: -3, text: 'Nie szanuje twojej granicy, wywołuje poczucie winy lub zmusza cię do zmiany zdania.' },
      { points: 0, text: 'Jeszcze nie było sytuacji, by to ocenić.' }
    ]
  },
  {
    text: 'Jak długo znasz tę osobę?',
    answers: [
      { points: 3, text: '3 lata i więcej.' },
      { points: 2, text: 'Od 1 roku do 3 lat.' },
      { points: 1, text: 'Od 3 do 12 miesięcy.' },
      { points: 0, text: 'Mniej niż 3 miesiące.' }
    ]
  },
  // ── New questions (indices 11-15) ──
  {
    text: 'Jak ta osoba okazuje wdzięczność za udzieloną pomoc?',
    answers: [
      { points: 3, text: 'Stara się odwdzięczyć z nawiązką.' },
      { points: 2, text: 'Stara się wyrównać rachunek.' },
      { points: 1, text: 'Po prostu dziękuje.' },
      { points: 0, text: 'Nie okazuje wdzięczności wcale.' },
      { points: 0, text: 'Jeszcze nie było sytuacji, by to ocenić.' }
    ]
  },
  {
    text: 'Jak ta osoba zachowuje się wobec ciebie w towarzystwie innych?',
    answers: [
      { points: 3, text: 'Staje w Twojej obronie.' },
      { points: 2, text: 'Zachowuje neutralność, nie komentuje, milczy gdy ktoś Cię atakuje.' },
      { points: 0, text: 'Zmienia zachowanie pod wpływem otoczenia.' },
      { points: -3, text: 'Wykorzystuje okazję by sobie na Tobie poużywać, przyłącza się do ataku.' },
      { points: 0, text: 'Jeszcze nie było sytuacji, by to ocenić.' }
    ]
  },
  {
    text: 'Czy ta osoba była przy tobie w trudnym momencie twojego życia?',
    answers: [
      { points: 3, text: 'Była obecna, starała się pomagać i martwiła się.' },
      { points: 2, text: 'Pytała tylko co u Ciebie, bez oferowania pomocy.' },
      { points: 1, text: 'Nie interesowała się zbytnio lub dowiedziała się z opóźnienia.' },
      { points: -3, text: 'Wiedziała co się dzieje ale "zniknęła" na ten czas.' },
      { points: 0, text: 'Jeszcze nie było sytuacji, by to ocenić.' }
    ]
  },
  {
    text: 'Czy ta osoba mówi ci prawdę, nawet gdy jest trudna?',
    answers: [
      { points: 3, text: 'Mówi wprost, gdy robisz coś głupiego, nawet jeśli jest to nieprzyjemne.' },
      { points: 2, text: 'Mówi prawdę, ale ostrożnie i wybiórczo.' },
      { points: 1, text: 'Mówi tylko to co chcesz usłyszeć.' },
      { points: -3, text: 'Nie jesteś w stanie dowiedzieć się od niej prawdy jaka jest.' },
      { points: 0, text: 'Jeszcze nie było sytuacji, by to ocenić.' }
    ]
  },
  {
    text: 'Jak ta osoba traktuje twój czas?',
    answers: [
      { points: 2, text: 'Nie spóźnia się, uprzedza jeśli coś się zmienia.' },
      { points: 1, text: 'Zdarza się, że czekasz lub coś odpada w ostatniej chwili.' },
      { points: -3, text: 'Regularnie zawodzi bez uprzedzenia.' },
      { points: 0, text: 'Jeszcze nie było sytuacji, by to ocenić.' }
    ]
  }
];

const GATE_QUESTION = {
  text: 'Jak często spotykasz się z tą osobą w prawdziwym życiu?',
  answers: [
    { penalty: 0, text: 'Co najmniej raz w tygodniu.' },
    { penalty: -4, text: 'Co najmniej raz w miesiącu.' },
    { penalty: -6, text: 'Co najmniej raz w roku.' },
    { penalty: -10, text: 'Brak kontaktu.' }
  ]
};

const SECRET_QUESTION = {
  text: 'Czy ta osoba dochowuje powierzonych jej sekretów?',
  answers: [
    { cap: 3, text: 'Zawsze dochowuje sekretów lub zdarzyło się, że powiedziała coś, czego nie powinna.' },
    { cap: 2, text: 'Często zdarza się, że mówi komuś Twoje sekrety.' },
    { cap: 1, text: 'Nie potrafi dochować sekretów.' }
  ]
};

// ═══════════════════════════════════════════
// PERSONALITY (DISC / 4 colors) MINI-SURVEY
// ═══════════════════════════════════════════
//
// A second, optional way to pick a planet's color, independent of the manual
// swatch picker below. Each answer carries a hidden `color` field used only
// for scoring — the visible `text` never names a color, a DISC letter, or
// otherwise hints which type it belongs to. The 4 answers per question are
// pre-shuffled once here (not reshuffled on every load) so a saved survey
// reopens looking exactly as it did when answered.
const PERSONALITY_QUESTIONS = [
  {
    text: 'Gdy zaskoczysz tę osobę trudnym pytaniem w rozmowie, zazwyczaj:',
    answers: [
      { color: 'green', text: 'Milknie na chwilę, chce dobrze przemyśleć odpowiedź.' },
      { color: 'red', text: 'Odpowiada od razu, wprost, bez owijania w bawełnę.' },
      { color: 'blue', text: 'Prosi o chwilę, żeby przeanalizować sprawę dokładnie.' },
      { color: 'yellow', text: 'Żartuje, rozładowuje napięcie, potem odpowiada.' }
    ]
  },
  {
    text: 'Jak osoba zachowuje się w sytuacji konfliktowej?',
    answers: [
      { color: 'blue', text: 'Analizuje fakty, chce dojść do logicznego rozwiązania.' },
      { color: 'yellow', text: 'Próbuje rozładować atmosferę żartem lub emocjami.' },
      { color: 'red', text: 'Konfrontuje się wprost, mówi co myśli.' },
      { color: 'green', text: 'Wycofuje się, unika eskalacji, szuka zgody.' }
    ]
  },
  {
    text: 'Jak ta osoba wchodzi w nowe towarzystwo?',
    answers: [
      { color: 'yellow', text: 'Łatwo nawiązuje kontakt, dużo mówi, otwiera się na innych.' },
      { color: 'green', text: 'Czeka, obserwuje, woli żeby ktoś zagaił pierwszy.' },
      { color: 'blue', text: 'Trzyma dystans, ocenia sytuację zanim się włączy.' },
      { color: 'red', text: 'Od razu przejmuje kontrolę nad sytuacją, wyznacza kierunek rozmowy.' }
    ]
  },
  {
    text: 'Jak Twoim zdaniem wygląda idealne wolne popołudnie tej osoby?',
    answers: [
      { color: 'red', text: 'Coś ambitnego, co daje poczucie osiągnięcia celu.' },
      { color: 'blue', text: 'Czas poświęcony na hobby wymagające skupienia i precyzji.' },
      { color: 'yellow', text: 'Spotkanie z ludźmi, dużo bodźców i rozmów.' },
      { color: 'green', text: 'Spokojny czas z bliską osobą lub w samotności.' }
    ]
  },
  {
    text: 'Co jest dla tej osoby priorytetem w rozmowie?',
    answers: [
      { color: 'green', text: 'Wzajemne zrozumienie i brak napięcia.' },
      { color: 'blue', text: 'Precyzja, fakty i logiczna spójność wypowiedzi.' },
      { color: 'red', text: 'Dojście do konkretu i podjęcie decyzji.' },
      { color: 'yellow', text: 'Dobra atmosfera i emocje rozmówcy.' }
    ]
  },
  {
    text: 'Jak ta osoba reaguje, gdy ktoś inny popełni błąd w grupie czy rodzinie?',
    answers: [
      { color: 'blue', text: 'Analizuje przyczynę błędu, żeby się nie powtórzył.' },
      { color: 'red', text: 'Mówi o tym wprost, żeby szybko to naprawić.' },
      { color: 'green', text: 'Wspiera, stara się nie robić z tego problemu.' },
      { color: 'yellow', text: 'Od razu obraca to w żart, żeby wszyscy poczuli się swobodnie i ruszyli dalej.' }
    ]
  },
  {
    text: 'Jak ta osoba podejmuje ważne decyzje?',
    answers: [
      { color: 'yellow', text: 'Szybko, kierując się tym, co czuje i jak zareagują inni.' },
      { color: 'blue', text: 'Na podstawie dokładnej analizy danych i faktów.' },
      { color: 'green', text: 'Powoli, chcąc uniknąć ryzyka i konfliktu.' },
      { color: 'red', text: 'Szybko, na podstawie własnej intuicji i celu.' }
    ]
  },
  {
    text: 'Jak wygląda typowy dzień tej osoby?',
    answers: [
      { color: 'green', text: 'Trzyma się stałego, przewidywalnego rytmu dnia.' },
      { color: 'red', text: 'Ma jasny cel, reszta ma się temu podporządkować.' },
      { color: 'yellow', text: 'Działa spontanicznie, plan bywa elastyczny.' },
      { color: 'blue', text: 'Trzyma się szczegółowego harmonogramu.' }
    ]
  }
];

const PERSONALITY_COLOR_LABELS = { red: 'Czerwony', yellow: 'Żółty', green: 'Zielony', blue: 'Niebieski' };

const PERSONALITY_PROFILES = {
  red: {
    name: 'Czerwony — Styl D (Choleryk)',
    color: '#E53935',
    traits: ['Pewny siebie', 'Zorientowany na cel', 'Konkretny', 'Rywalizacyjny', 'Zdecydowany'],
    howToTalk: [
      'Mów bezpośrednio i przechodź od razu do konkretów — nie owijaj w bawełnę.',
      'Skupiaj się na wynikach, celach i rozwiązaniach, nie na procesie czy problemach.',
      'Formułuj wypowiedzi zwięźle, unikaj długich dygresji, pogawędek i zbędnych szczegółów.',
      'Daj tej osobie przestrzeń do podejmowania decyzji i poczucia kontroli nad sytuacją.',
      'Nie traktuj jej bezpośredniości jako ataku — to jej naturalny sposób komunikacji.'
    ]
  },
  yellow: {
    name: 'Żółty — Styl I (Sangwinik)',
    color: '#FBC02D',
    traits: ['Entuzjastyczny', 'Towarzyski', 'Otwarty', 'Radosny', 'Gadatliwy'],
    howToTalk: [
      'Zostaw czas na luźną rozmowę przed przejściem do konkretów — to buduje relację.',
      'Okazuj entuzjazm i pozytywne nastawienie wobec jej pomysłów i historii.',
      'Słuchaj aktywnie, ale delikatnie pomagaj jej wracać do tematu, gdy dygresuje.',
      'Chwal ją i doceniaj publicznie — to dla niej ważne paliwo motywacyjne.',
      'Nie zasypuj jej suchymi danymi, tabelami i szczegółową analizą — to ją zniechęci.'
    ]
  },
  green: {
    name: 'Zielony — Styl S (Flegmatyk)',
    color: '#43A047',
    traits: ['Spokojny', 'Cierpliwy', 'Empatyczny', 'Unika konfliktów', 'Lojalny'],
    howToTalk: [
      'Mów spokojnym, łagodnym tonem — nie wywieraj presji czasu ani nagłych zmian.',
      'Buduj rozmowę na zaufaniu i bezpieczeństwie, okazuj, że Ci na niej zależy.',
      'Uprzedzaj ją z wyprzedzeniem o nadchodzących zmianach — niespodzianki ją stresują.',
      'Trzymaj emocje pod kontrolą w jej obecności, unikaj podniesionego głosu.',
      'Doceniaj jej lojalność i cierpliwość, nie wymuszaj szybkich decyzji.'
    ]
  },
  blue: {
    name: 'Niebieski — Styl C (Melancholik)',
    color: '#1E88E5',
    traits: ['Analityczny', 'Precyzyjny', 'Dba o szczegóły', 'Zdystansowany', 'Refleksyjny'],
    howToTalk: [
      'Opieraj argumenty na faktach, liczbach, logice i sprawdzonych dowodach.',
      'Przygotuj się dobrze i zachowaj precyzję oraz punktualność — chaos ją irytuje.',
      'Daj jej czas na samodzielne przeanalizowanie informacji przed podjęciem decyzji.',
      'Unikaj nadmiernej emocjonalności i powierzchownych, niczym niepopartych deklaracji.',
      'Szanuj jej potrzebę dystansu — nie traktuj tego jako chłodu czy braku zaangażowania.'
    ]
  }
};

// Tallies the 8 chosen colors and reports every color tied for the highest
// count — a genuine tie (2+ colors sharing the max) is a real result, not an
// error to break: it means the array comes back with more than one element.
// No tie-break rule on purpose — see the feature's spec for why.
function computePersonalityResult(answerColors) {
  const counts = { red: 0, yellow: 0, green: 0, blue: 0 };
  answerColors.forEach(c => { if (counts[c] !== undefined) counts[c]++; });
  const max = Math.max(...Object.values(counts));
  const personalityType = Object.keys(counts).filter(c => counts[c] === max);
  return { counts, personalityType };
}

const STORAGE_KEY = 'mentalmap_people';
const CORRUPT_BACKUP_KEY = 'mentalmap_people_corrupt_backup';
const SHOW_LEVEL_COLORS_KEY = 'mentalmap_show_level_colors';
const SHOW_TRAJECTORIES_KEY = 'mentalmap_show_trajectories';
const APP_VERSION = 'v0.9.91';
const ASSET_VERSION = APP_VERSION.slice(1); // 'v0.9.91' -> '0.9.91', matches the ?v= convention used elsewhere

// Whether the level zones (green/yellow/red, blurred at the edges — the one
// fixed look, no longer user-tunable) and their "Poziom N" labels render at
// all, and whether each planet's dashed orbit path renders. Both default on;
// persisted so the choice sticks.
let showLevelColors = true;
try {
  const saved = localStorage.getItem(SHOW_LEVEL_COLORS_KEY);
  if (saved !== null) showLevelColors = saved === '1';
} catch (_) { /* ignore — default true */ }

let showTrajectories = true;
try {
  const saved = localStorage.getItem(SHOW_TRAJECTORIES_KEY);
  if (saved !== null) showTrajectories = saved === '1';
} catch (_) { /* ignore — default true */ }

// Guards for the persistence layer (see loadPeople / savePeople).
let saveBlocked = false;
let saveErrorShown = false;

// Dynamic orbit configuration
const ORBIT_START = 60;      // px from center to first orbit
const ORBIT_SPACING = 40;    // px between unique-score orbits within a level
const LEVEL_GAP = 25;        // px gap between level bands

// Computed dynamic layout (recalculated when planets change)
let dynamicLayout = {}; // { level: { innerR, outerR, orbits: [{score, radius}] } }

// Planet gradient presets for visual variety
const PLANET_GRADIENTS = [
  ['#ff6b6b', '#ee5a24'],
  ['#a29bfe', '#6c5ce7'],
  ['#55efc4', '#00b894'],
  ['#fd79a8', '#e84393'],
  ['#74b9ff', '#0984e3'],
  ['#ffeaa7', '#fdcb6e'],
  ['#dfe6e9', '#b2bec3'],
  ['#ff9ff3', '#f368e0'],
  ['#48dbfb', '#0abde3'],
  ['#ff6348', '#ff4757'],
  ['#7bed9f', '#2ed573'],
  ['#70a1ff', '#1e90ff'],
  ['#ffa502', '#ff6348'],
  ['#5352ed', '#3742fa'],
  ['#ff4757', '#c44569']
];

// Indices into PLANET_GRADIENTS that read as a plain Red/Yellow/Green/Blue —
// now reserved for the personality-based color method (PERSONALITY_PROFILES)
// and hidden from the manual picker so the two methods never visually clash.
// Left in the array itself rather than removed, so anyone who already picked
// one of these before this change keeps rendering their original color.
const RESERVED_GRADIENT_INDICES = new Set([0, 5, 10, 11]);

function pickRandomGradientIndex() {
  const options = PLANET_GRADIENTS.map((_, i) => i).filter(i => !RESERVED_GRADIENT_INDICES.has(i));
  return options[Math.floor(Math.random() * options.length)];
}

// ═══════════════════════════════════════════
// DOM REFERENCES
// ═══════════════════════════════════════════

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const solarSystem = $('#solar-system');
const orbitLinesContainer = $('#orbit-lines-container');
const planetsContainer = $('#planets-container');
const labelsContainer = $('#labels-container');
const menuLayerContainer = $('#planet-menu-container');
const fabAdd = $('#fab-add');
const surveyModal = $('#survey-modal');
const surveyForm = $('#survey-form');
const personNameInput = $('#person-name');
const questionsContainer = $('#questions-container');
const btnSave = $('#btn-save');
const btnDelete = $('#btn-delete');
const btnCancel = $('#btn-cancel');
const modalTitle = $('#modal-title');
const scoreValue = $('#score-value');
const scoreLevel = $('#score-level');
const scorePreview = $('.score-preview');
const emptyState = $('#empty-state');
const btnToggleView = $('#btn-toggle-view');
const rankingView = $('#ranking-view');
const rankingList = $('#ranking-list');
const btnStats = $('#btn-stats');
const statsView = $('#stats-view');
const statsList = $('#stats-list');
const summaryContainer = $('#summary-container');
const appVersion = $('#app-version');
const iconMenu = $('#icon-menu');
const btnMenuToggle = $('#btn-menu-toggle');

// ═══════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════

let people = [];
let editingId = null;
let selectedPlanetId = null; // Currently selected planet (menu open)
let preSelectMapState = null; // Store map state before zooming to planet
let selectedGradientIndex = 0;
// Staged personality-survey result for the person currently open in the
// modal — null means "not using the personality method" (falls back to
// selectedGradientIndex, exactly like before this feature existed). Set from
// the person's own data on open, updated when the mini-survey is confirmed
// or cleared, and only written back onto the person in handleSubmit(), same
// lifecycle as selectedGradientIndex.
let selectedPersonalityType = null;
let selectedPersonalityAnswers = null;
// Remembers each person's scroll position in the survey form (id -> scrollTop) so
// reopening the same person resumes where you left off, without leaking that
// position onto a different (or brand new) person.
let surveyScrollPositions = {};

function updateColorPickerSelection(index) {
  selectedGradientIndex = index;
  document.querySelectorAll('.color-swatch').forEach(s => {
    s.classList.toggle('selected', parseInt(s.dataset.index) === index);
  });
}

// Reflects the current staged personality state in the color-group's trigger
// row (hint text + small color dots), and shows/hides the "back to manual"
// action inside the personality modal itself.
function updatePersonalityColorStatus() {
  const hint = $('#personality-color-hint');
  const dots = $('#personality-color-dots');
  const clearBtn = $('#btn-personality-clear');
  const active = Array.isArray(selectedPersonalityType) && selectedPersonalityType.length > 0;

  if (hint) {
    hint.textContent = active
      ? `Aktywny: ${selectedPersonalityType.map(c => PERSONALITY_COLOR_LABELS[c]).join(' + ')}`
      : 'Rozwiąż mini-ankietę (8 pytań)';
  }
  if (dots) {
    dots.innerHTML = '';
    if (active) {
      selectedPersonalityType.forEach(c => {
        const dot = document.createElement('span');
        dot.className = 'personality-color-dot';
        dot.style.background = PERSONALITY_PROFILES[c].color;
        dots.appendChild(dot);
      });
    }
  }
  if (clearBtn) clearBtn.style.display = active ? 'flex' : 'none';
}

// Resolves what a person's planet should look like: a completed personality
// survey takes over whenever it's active, otherwise this falls back to the
// manually picked gradient — that fallback path is entirely unchanged from
// before this feature existed.
function getPersonColors(person) {
  const types = Array.isArray(person.personalityType) ? person.personalityType : null;
  if (types && types.length > 0) {
    return { mode: 'personality', colors: types.map(c => PERSONALITY_PROFILES[c].color) };
  }
  return { mode: 'manual', colors: PLANET_GRADIENTS[person.gradientIndex % PLANET_GRADIENTS.length] };
}

// Lightens (positive percent) or darkens (negative) a #rrggbb color — used to
// turn a single personality color into a light-to-base pair so a one-color
// result still gets the same sphere-like gradient look as the manual swatches.
function shadeColor(hex, percent) {
  const num = parseInt(hex.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const r = Math.min(255, Math.max(0, (num >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amt));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amt));
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}

// CSS background (+ a base color for the glow) for a planet-shaped element,
// given a person. Three cases:
//  - manual color (personalityType null/empty): unchanged two-stop gradient.
//  - single personality winner: same two-stop gradient look, built from that
//    one color instead of a fixed pair.
//  - tie between 2+ colors: the disc is split into equal angular sectors, one
//    per tied color — the simplest way, in plain CSS, to show "all of these,
//    equally" without touching how planets are positioned or laid out.
function getPlanetBackground(person) {
  const { mode, colors } = getPersonColors(person);
  if (mode === 'manual') {
    return { background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`, glowBase: colors[0] };
  }
  if (colors.length === 1) {
    return { background: `linear-gradient(135deg, ${shadeColor(colors[0], 35)}, ${colors[0]})`, glowBase: colors[0] };
  }
  const step = 360 / colors.length;
  const stops = colors.map((c, i) => `${c} ${i * step}deg ${(i + 1) * step}deg`).join(', ');
  return { background: `conic-gradient(${stops})`, glowBase: colors[0] };
}
let animationFrameId = null;
let lastTimestamp = 0;

// Pan / Zoom / Tilt state
let mapScale = 0.55;
let mapPanX = 0;
let mapPanY = 0;
let mapTiltX = 0;
const MAP_SCALE_MIN = 0.25;
const MAP_SCALE_MAX = 3;
let isPanning = false;
let panStartX = 0, panStartY = 0;
let panStartMapX = 0, panStartMapY = 0;
let lastPinchDist = 0;
let pinchActive = false;

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (selectedPlanetId && !e.target.closest('.planet-group')) {
    closePlanetMenu();
  }
});

// ═══════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════

function init() {
  buildSurveyForm();
  loadPeople();
  bindEvents();
  bindAccountEvents();
  bindSettingsEvents();
  setAppVersion();
  if (orbitLinesContainer) orbitLinesContainer.style.display = showTrajectories ? '' : 'none';
  startAnimation();
  updateEmptyState();
  attemptSilentReconnect();
}

function setAppVersion() {
  if (appVersion) appVersion.textContent = APP_VERSION;
}

// ═══════════════════════════════════════════
// SURVEY FORM GENERATION
// ═══════════════════════════════════════════

function buildSurveyForm() {
  if (!questionsContainer) return;

  questionsContainer.innerHTML = '';


  const picker = document.getElementById('color-picker');
  if (picker) {
    picker.innerHTML = '';
    PLANET_GRADIENTS.forEach((grad, index) => {
      if (RESERVED_GRADIENT_INDICES.has(index)) return;
      const swatch = document.createElement('div');
      swatch.className = 'color-swatch';
      swatch.style.background = `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`;
      swatch.dataset.index = index;
      swatch.addEventListener('click', () => {
        updateColorPickerSelection(index);
        // Picking a manual color is a deliberate "use this instead" choice —
        // it wins over an active personality result, same way confirming the
        // personality survey wins over whatever manual swatch was selected.
        selectedPersonalityType = null;
        updatePersonalityColorStatus();
      });
      picker.appendChild(swatch);
    });
  }

  buildPersonalityForm();

  // ── Gate question (rendered first, stored separately) ──
  const gateCard = document.createElement('div');
  gateCard.className = 'question-card';
  gateCard.id = 'card-gate';

  const gateSummaryText = buildAnswerSummary(gateCard, `1. ${GATE_QUESTION.text}`);

  const gateOptions = document.createElement('div');
  gateOptions.className = 'options-container';

  GATE_QUESTION.answers.forEach((answer) => {
    const label = document.createElement('label');
    label.className = 'answer-option';

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'gate';
    radio.value = answer.penalty;
    radio.required = true;
    radio.addEventListener('change', () => {
      gateSummaryText.textContent = answer.text;
      gateCard.dataset.tier = rankAnswer(GATE_QUESTION, answer, 'penalty').tier;
      updateScorePreview();
    });

    const textSpan = document.createElement('span');
    textSpan.className = 'answer-text';
    textSpan.textContent = answer.text;

    label.appendChild(radio);
    label.appendChild(textSpan);
    gateOptions.appendChild(label);
  });

  gateCard.appendChild(gateOptions);
  questionsContainer.appendChild(gateCard);

  // ── Regular questions ──
  SURVEY_QUESTIONS.forEach((q, qIndex) => {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.id = `card-q${qIndex}`;

    const summaryText = buildAnswerSummary(card, `${qIndex + 2}. ${q.text}`);

    const optionsWrap = document.createElement('div');
    optionsWrap.className = 'options-container';

    q.answers.forEach((answer, aIndex) => {
      const label = document.createElement('label');
      label.className = 'answer-option';

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `q${qIndex}`;
      radio.value = answer.points;
      radio.dataset.optIndex = aIndex;
      radio.required = true;
      radio.addEventListener('change', () => {
        delete radio.dataset.legacyGuess;
        summaryText.textContent = answer.text;
        card.dataset.tier = rankAnswer(q, answer).tier;
        updateScorePreview();
      });

      const textSpan = document.createElement('span');
      textSpan.className = 'answer-text';
      textSpan.textContent = answer.text;

      label.appendChild(radio);
      label.appendChild(textSpan);
      optionsWrap.appendChild(label);
    });

    card.appendChild(optionsWrap);
    questionsContainer.appendChild(card);
  });

  // ── Secret/Cap question (rendered after regular questions) ──
  const secretCard = document.createElement('div');
  secretCard.className = 'question-card';
  secretCard.id = 'card-secret';

  const secretSummaryText = buildAnswerSummary(secretCard, `${SURVEY_QUESTIONS.length + 2}. ${SECRET_QUESTION.text}`);

  const secretOptions = document.createElement('div');
  secretOptions.className = 'options-container';

  SECRET_QUESTION.answers.forEach((answer) => {
    const label = document.createElement('label');
    label.className = 'answer-option';

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'secret';
    radio.value = answer.cap;
    radio.required = true;
    radio.addEventListener('change', () => {
      secretSummaryText.textContent = answer.text;
      secretCard.dataset.tier = rankAnswer(SECRET_QUESTION, answer, 'cap').tier;
      updateScorePreview();
    });

    const textSpan = document.createElement('span');
    textSpan.className = 'answer-text';
    textSpan.textContent = answer.text;

    label.appendChild(radio);
    label.appendChild(textSpan);
    secretOptions.appendChild(label);
  });

  secretCard.appendChild(secretOptions);
  questionsContainer.appendChild(secretCard);
}

// ═══════════════════════════════════════════
// PERSONALITY (DISC / 4 colors) MODAL
// ═══════════════════════════════════════════

const personalityModal = $('#personality-modal');
const personalityForm = $('#personality-form');
const personalityQuestionsContainer = $('#personality-questions-container');

// Built once at startup, like buildSurveyForm() — reused across every
// open/close of the personality modal.
function buildPersonalityForm() {
  if (!personalityQuestionsContainer) return;
  personalityQuestionsContainer.innerHTML = '';

  PERSONALITY_QUESTIONS.forEach((q, qIndex) => {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.id = `pcard-${qIndex}`;

    const header = document.createElement('div');
    header.className = 'question-card__header';
    const title = document.createElement('h3');
    title.textContent = `${qIndex + 1}. ${q.text}`;
    header.appendChild(title);
    card.appendChild(header);

    const optionsWrap = document.createElement('div');
    optionsWrap.className = 'options-container';

    q.answers.forEach((answer) => {
      const label = document.createElement('label');
      label.className = 'answer-option';

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `pq${qIndex}`;
      radio.value = answer.color; // hidden internal field — never shown to the user
      radio.required = true;

      const textSpan = document.createElement('span');
      textSpan.className = 'answer-text';
      textSpan.textContent = answer.text;

      label.appendChild(radio);
      label.appendChild(textSpan);
      optionsWrap.appendChild(label);
    });

    card.appendChild(optionsWrap);
    personalityQuestionsContainer.appendChild(card);
  });
}

// Re-checks the radios matching previously saved colors, so reopening an
// already-answered survey shows it exactly as it was left — matched by the
// hidden color value, not by position, so it's unaffected by answer order.
function fillPersonalityForm(answerColors) {
  if (!personalityForm) return;
  personalityForm.reset();
  if (!Array.isArray(answerColors)) return;
  answerColors.forEach((color, qIndex) => {
    const radio = personalityForm.querySelector(`input[name="pq${qIndex}"][value="${color}"]`);
    if (radio) radio.checked = true;
  });
}

function openPersonalityModal() {
  if (!personalityModal) return;
  fillPersonalityForm(selectedPersonalityAnswers);
  updatePersonalityColorStatus();
  personalityModal.setAttribute('aria-hidden', 'false');
  history.pushState({ personalityModalOpen: true }, '');
}

function closePersonalityModal(fromPopState = false) {
  if (!personalityModal) return;
  // Unlike every other modal in this app, this one can be open *on top of* the
  // still-open survey modal — the first case of two modals open at once. Hiding
  // eagerly here (like the others do) would make this function's own
  // history.back() call fall through the popstate chain below into closing the
  // survey modal too, since by the time that popstate fires this modal would
  // already read as closed. Deferring the hide to the fromPopState branch keeps
  // this modal matching first in that chain, so the survey modal is untouched.
  if (!fromPopState && history.state && history.state.personalityModalOpen) {
    history.back();
    return;
  }
  personalityModal.setAttribute('aria-hidden', 'true');
}

function handlePersonalitySubmit(e) {
  e.preventDefault();
  if (!personalityForm) return;

  const colors = [];
  for (let i = 0; i < PERSONALITY_QUESTIONS.length; i++) {
    const checked = personalityForm.querySelector(`input[name="pq${i}"]:checked`);
    if (!checked) {
      const card = document.getElementById(`pcard-${i}`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.style.outline = '2px solid #ef476f';
        card.style.outlineOffset = '4px';
        setTimeout(() => { card.style.outline = ''; card.style.outlineOffset = ''; }, 2000);
      }
      return;
    }
    colors.push(checked.value);
  }

  const { personalityType } = computePersonalityResult(colors);
  selectedPersonalityType = personalityType;
  selectedPersonalityAnswers = colors;
  updatePersonalityColorStatus();
  closePersonalityModal();
}

// Deactivates the personality result (falls back to the manual color) without
// discarding the answers themselves, so reopening the survey still shows them.
function handlePersonalityClear() {
  selectedPersonalityType = null;
  updatePersonalityColorStatus();
  closePersonalityModal();
}

// Builds a question card's title row (question text + a chevron toggle that
// stays put whether the card is collapsed or expanded, so you can freely
// collapse/expand while navigating) plus the collapsed "current answer" line
// shown only while collapsed. Appends both before the (later-appended) option
// list. Returns the summary text span so the per-answer 'change' listener can
// keep it live.
function buildAnswerSummary(card, titleText) {
  const header = document.createElement('div');
  header.className = 'question-card__header';

  const title = document.createElement('h3');
  title.textContent = titleText;
  header.appendChild(title);

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'answer-summary__toggle';
  toggle.setAttribute('aria-label', 'Zwiń lub rozwiń odpowiedzi');
  toggle.setAttribute('aria-expanded', 'true');
  toggle.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  toggle.addEventListener('click', () => setCardCollapsed(card, !card.classList.contains('is-collapsed')));
  header.appendChild(toggle);

  card.appendChild(header);

  const summary = document.createElement('div');
  summary.className = 'answer-summary';

  const summaryText = document.createElement('span');
  summaryText.className = 'answer-summary__text';
  summary.appendChild(summaryText);

  card.appendChild(summary);
  return summaryText;
}

// Single place that flips a question card between collapsed and expanded,
// keeping the toggle button's aria-expanded in sync either way.
function setCardCollapsed(card, collapsed) {
  if (!card) return;
  card.classList.toggle('is-collapsed', collapsed);
  const toggle = card.querySelector('.answer-summary__toggle');
  if (toggle) toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
}

// This exact answer means "no data yet" rather than a real judgement, on the
// questions that offer it — it always gets top priority and a neutral color,
// regardless of its raw points value (which is usually 0, tying it with a
// genuine middling answer).
const NO_SITUATION_TEXT = 'Jeszcze nie było sytuacji, by to ocenić.';

// Ranks one answer within its own question, for both the collapsed summary
// color and the reordering priority. Ranks the question's *judged* answers
// (everything except the "no situation" one) by their value field — 'points'
// for the 16 regular questions, 'penalty' for the gate question, 'cap' for
// the secret question, all "higher = better" — and reports where this answer
// falls: worst, second-worst, best, or "mid" for anything in between. Rank
// position is used rather than the raw value or a value-vs-max deficit
// because questions use different scales (points top out anywhere from 2 to
// 6; gate and secret use entirely different units), so comparing magnitudes
// across questions could still rank a mediocre answer on one question above
// another question's genuinely worst answer.
// Returns { tier, priority }: tier is 'none' | 'worst' | 'almostWorst' |
// 'mid' | 'best'; priority is the CSS `order` value to use (more negative /
// smaller = higher priority = shows up first) — comparable across every
// question, gate and secret included, so they all share one priority queue.
function rankAnswer(q, answer, valueKey = 'points') {
  if (!answer || answer.text === NO_SITUATION_TEXT) {
    return { tier: 'none', priority: -1000 };
  }

  const judged = q.answers.filter(a => a.text !== NO_SITUATION_TEXT);
  const ranked = [...judged].sort((a, b) => b[valueKey] - a[valueKey]); // best first
  const rank = ranked.indexOf(answer); // 0 = best
  const priority = ranked.length - rank; // 1 = worst .. N = best

  let tier;
  if (rank === 0) tier = 'best';
  else if (rank === ranked.length - 1) tier = 'worst';
  else if (rank === ranked.length - 2) tier = 'almostWorst';
  else tier = 'mid';

  return { tier, priority };
}

// Resolves which answer a person actually picked for SURVEY_QUESTIONS[i] and
// ranks it via rankAnswer(). Returns { tier, priority, answer } — answer is
// the matched answer object, or null if nothing could be resolved.
function getAnswerTier(q, person, i) {
  const idx = person.answerIndices?.[i];
  let chosen = typeof idx === 'number' ? q.answers[idx] : undefined;

  if (!chosen) {
    // Legacy entry with no confirmed index: only the raw points value is
    // known, which is ambiguous when a judged answer ties with the "no
    // situation" one (usually both 0) — prefer the judged reading since it's
    // the more common case.
    const pts = person.answers?.[i];
    if (typeof pts !== 'number') return { tier: 'none', priority: -1000, answer: null };
    const judged = q.answers.filter(a => a.text !== NO_SITUATION_TEXT);
    chosen = judged.find(a => a.points === pts) || q.answers.find(a => a.points === pts);
  }

  return { ...rankAnswer(q, chosen), answer: chosen || null };
}

// Same idea as getAnswerTier(), for the gate and secret questions: their
// chosen answer is looked up directly (both use point-like fields with no
// duplicate values, so there's no index ambiguity to resolve).
function getGateTier(person) {
  const answer = GATE_QUESTION.answers.find(a => a.penalty === person.gateAnswer);
  return { ...rankAnswer(GATE_QUESTION, answer, 'penalty'), answer: answer || null };
}

function getSecretTier(person) {
  const answer = SECRET_QUESTION.answers.find(a => a.cap === person.secretCap);
  return { ...rankAnswer(SECRET_QUESTION, answer, 'cap'), answer: answer || null };
}

// Visually reorders every question card (via CSS `order`, not DOM position),
// gate and secret included, so the answers most worth revisiting show up
// first — see rankAnswer() for how priority is ranked; all cards share one
// priority queue, so a bad gate/secret answer surfaces alongside a bad
// regular one instead of being pinned at a fixed spot. DOM order stays
// untouched on purpose — handleSubmit() and updateScorePreview() rely on
// SURVEY_QUESTIONS index order when walking `.question-card` elements.
function reorderQuestionsByCompletion(person) {
  if (!questionsContainer) return;
  const gateCard = document.getElementById('card-gate');
  const secretCard = document.getElementById('card-secret');
  if (gateCard) gateCard.style.order = String(getGateTier(person).priority);
  if (secretCard) secretCard.style.order = String(getSecretTier(person).priority);

  SURVEY_QUESTIONS.forEach((q, i) => {
    const card = document.getElementById(`card-q${i}`);
    if (!card) return;
    card.style.order = String(getAnswerTier(q, person, i).priority);
  });
}

// Restores the natural question order (used when starting a fresh survey).
function resetQuestionOrder() {
  if (!questionsContainer) return;
  questionsContainer.querySelectorAll('.question-card').forEach(card => {
    card.style.order = '';
  });
}

// Collapses every already-answered question down to "question + current
// answer" (chevron toggle) so a filled-out survey takes far less room to
// scan, and colors each one by rankAnswer()'s tier. Called when opening an
// existing person; the chevron toggles each card back to its full option
// list and back again, freely, so navigating the whole list stays easy.
function renderAnswerSummaries(person) {
  if (!questionsContainer) return;

  const applyCollapsedSummary = (card, tier, answer) => {
    if (!card) return;
    const summaryText = card.querySelector('.answer-summary__text');
    if (summaryText) summaryText.textContent = answer ? answer.text : 'Brak';
    card.dataset.tier = tier;
    const toggle = card.querySelector('.answer-summary__toggle');
    if (toggle) toggle.style.display = '';
    setCardCollapsed(card, true);
  };

  const gateResult = getGateTier(person);
  applyCollapsedSummary(document.getElementById('card-gate'), gateResult.tier, gateResult.answer);

  SURVEY_QUESTIONS.forEach((q, i) => {
    const result = getAnswerTier(q, person, i);
    applyCollapsedSummary(document.getElementById(`card-q${i}`), result.tier, result.answer);
  });

  const secretResult = getSecretTier(person);
  applyCollapsedSummary(document.getElementById('card-secret'), secretResult.tier, secretResult.answer);
}

// Expands every question back to its full option list with no answer
// highlighting (used when starting a fresh survey, which has no current
// answers to summarize).
function resetQuestionCollapse() {
  if (!questionsContainer) return;
  questionsContainer.querySelectorAll('.question-card').forEach(card => {
    setCardCollapsed(card, false);
    delete card.dataset.tier;
    // A brand-new survey has no current answers to summarize, so the
    // collapse toggle (only meaningful once there's something to collapse
    // to) has no reason to show — only openEditModal()/renderAnswerSummaries()
    // reveal it again for an existing person.
    const toggle = card.querySelector('.answer-summary__toggle');
    if (toggle) toggle.style.display = 'none';
  });
}

// ═══════════════════════════════════════════
// SCORE PREVIEW
// ═══════════════════════════════════════════

function updateScorePreview() {
  const gateChecked = surveyForm.querySelector('input[name="gate"]:checked');
  let total = 0;
  let allAnswered = !!gateChecked;

  for (let i = 0; i < SURVEY_QUESTIONS.length; i++) {
    const checked = surveyForm.querySelector(`input[name="q${i}"]:checked`);
    if (checked) {
      total += parseInt(checked.value, 10);
    } else {
      allAnswered = false;
    }
  }

  // Check secret cap question
  const secretChecked = surveyForm.querySelector('input[name="secret"]:checked');
  if (!secretChecked) allAnswered = false;

  if (!allAnswered) {
    if (scoreValue) scoreValue.textContent = '--';
    if (scoreLevel) {
      scoreLevel.textContent = 'Odpowiedz na wszystkie pytania';
      scoreLevel.className = 'score-preview__level';
    }
    if (scorePreview) scorePreview.style.setProperty('--score-pct', '0%');
    return;
  }

  // Apply gate penalty and clamp to 0
  const gatePenalty = parseInt(gateChecked.value, 10);
  total = Math.max(0, total + gatePenalty);

  const level = getLevel(total);
  const secretCap = secretChecked ? parseInt(secretChecked.value, 10) : 3;
  const cappedLevel = Math.min(level, secretCap);
  const maxScore = SURVEY_QUESTIONS.reduce((sum, q) => sum + Math.max(...q.answers.map(a => a.points)), 0);
  const pct = Math.round((total / maxScore) * 100);

  if (scoreValue) scoreValue.textContent = total;
  const maxScoreLabel = document.querySelector('.score-preview__max');
  if (maxScoreLabel) maxScoreLabel.textContent = `/${maxScore}`;
  if (scoreLevel) {
    scoreLevel.textContent = `Poziom ${cappedLevel}`;
    scoreLevel.className = `score-preview__level level-${cappedLevel}`;
  }
  if (scorePreview) {
    scorePreview.style.setProperty('--score-pct', `${pct}%`);
  }
}

// ═══════════════════════════════════════════
// DATA PERSISTENCE
// ═══════════════════════════════════════════

// Recompute totalScore/level from raw answers, exactly as a fresh load would.
// Shared by loadPeople() and cloud sync (ACCOUNT / CLOUD SYNC).
function recomputeDerived(p) {
  if (!p.answers) return;
  const rawScore = p.answers.reduce((sum, pts) => sum + pts, 0);
  p.totalScore = Math.max(0, rawScore + (p.gateAnswer || 0));
  p.level = Math.min(getLevel(p.totalScore), p.secretCap !== undefined ? p.secretCap : 3);
}

function loadPeople() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      people = JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load data:', e);
      people = [];
      // An unreadable payload is not the same as no payload. distributePlanets()
      // saves on the way out, so without this the next launch would overwrite the
      // damaged-but-possibly-recoverable data with an empty array and destroy it.
      // Preserve it verbatim first; only block saving if even that fails.
      try {
        if (!localStorage.getItem(CORRUPT_BACKUP_KEY)) {
          localStorage.setItem(CORRUPT_BACKUP_KEY, saved);
        }
      } catch (_) {
        saveBlocked = true;
      }
    }
  }
  // ── Migrate old 12-question data to new 11-question order ──
  // Old: [Q1,Q2,Q3,Q4,Q5,Q6,Q7,Q8,Q9,Q10,Q11,Q12] (indices 0-11)
  // New: [Q3,Q6,Q12,Q1,Q2,Q4,Q5,Q8,Q9,Q10,Q11]  (Q7 deleted)
  // Mapping: new[0]=old[2], new[1]=old[5], new[2]=old[11],
  //          new[3]=old[0], new[4]=old[1], new[5]=old[3],
  //          new[6]=old[4], new[7]=old[7], new[8]=old[8],
  //          new[9]=old[9], new[10]=old[10]
  const OLD_TO_NEW = [2, 5, 11, 0, 1, 3, 4, 7, 8, 9, 10];
  people.forEach(p => {
    if (p.answers && p.answers.length === 12 && !p._migrated) {
      const oldAnswers = [...p.answers];
      p.answers = OLD_TO_NEW.map(oldIdx => oldAnswers[oldIdx]);
      // Recalculate totalScore without deleted Q7
      const rawScore = p.answers.reduce((sum, pts) => sum + pts, 0);
      p.totalScore = Math.max(0, rawScore + (p.gateAnswer || 0));
      p._migrated = true;
    }
  });
  // ── Migrate 11-question data to 16-question format ──
  people.forEach(p => {
    if (p.answers && p.answers.length === 11 && !p._migrated16) {
      // Pad with 0s for 5 new questions
      p.answers = [...p.answers, 0, 0, 0, 0, 0];
      if (p.secretCap === undefined) p.secretCap = 3;
      p._migrated16 = true;
    }
    if (p.secretCap === undefined) p.secretCap = 3;
  });
  // ── Recalculate scores with current thresholds ──
  people.forEach(recomputeDerived);
  distributePlanets();
  renderPlanets();
}

function computeDynamicRadii(byLevel) {
  const layout = {};
  let currentRadius = ORBIT_START;

  // Process from innermost (level 3) to outermost (level 0)
  for (const level of [3, 2, 1, 0]) {
    const planets = byLevel[level];
    if (!planets || planets.length === 0) continue;

    // Get unique scores, sorted descending (highest score = closest to sun)
    const uniqueScores = [...new Set(planets.map(p => p.totalScore))].sort((a, b) => b - a);

    const innerR = currentRadius;
    const orbits = uniqueScores.map((score, i) => ({
      score,
      radius: currentRadius + i * ORBIT_SPACING + ORBIT_SPACING / 2
    }));

    currentRadius += uniqueScores.length * ORBIT_SPACING;
    const outerR = currentRadius;

    layout[level] = { innerR, outerR, orbits };
    currentRadius += LEVEL_GAP;
  }

  return layout;
}

function distributePlanets() {
  const byLevel = { 0: [], 1: [], 2: [], 3: [] };

  people.forEach((p) => {
    p.level = Math.min(getLevel(p.totalScore), p.secretCap !== undefined ? p.secretCap : 3);

    if (typeof p.gradientIndex !== 'number') {
      p.gradientIndex = pickRandomGradientIndex();
    }

    byLevel[p.level].push(p);
  });

  // Compute dynamic layout
  dynamicLayout = computeDynamicRadii(byLevel);

  // Assign orbit radii and angles per level
  Object.entries(byLevel).forEach(([lvl, list]) => {
    const level = Number(lvl);
    const count = list.length;
    if (!count || !dynamicLayout[level]) return;

    const levelData = dynamicLayout[level];

    list
      // (a.name || '') guards against a malformed record with no name at
      // all (e.g. a leftover pre-migration cloud document) — without it,
      // sorting alongside any other person in the same level throws and
      // takes down every other person's rendering with it, not just this
      // one's.
      .sort((a, b) => b.totalScore - a.totalScore || (a.name || '').localeCompare(b.name || '', 'pl'))
      .forEach((p, index) => {
        // Find the orbit for this planet's score
        const orbit = levelData.orbits.find(o => o.score === p.totalScore);
        p.orbitRadius = orbit ? orbit.radius : levelData.orbits[0].radius;

        const angleStep = (Math.PI * 2) / count;
        const phase = (level * Math.PI) / 9;

        p.angle = phase + index * angleStep;
        p.speed = getSpeedByScore(p.totalScore);
      });
  });

  savePeople();
}

function savePeople() {
  // Set only when unreadable existing data could not be backed up — overwriting
  // it would be the destructive move, so we keep it and stop writing instead.
  if (saveBlocked) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
  } catch (e) {
    // Quota exceeded or storage disabled. Silently losing edits is worse than
    // interrupting the user, so surface it once.
    console.error('Failed to save data:', e);
    if (!saveErrorShown) {
      saveErrorShown = true;
      alert('Nie udało się zapisać danych w tej przeglądarce (brak miejsca lub zapis zablokowany).\n\nZaloguj się, aby zabezpieczyć dane w chmurze, zanim zamkniesz aplikację — inaczej ostatnie zmiany mogą przepaść.');
    }
  }
}

// ═══════════════════════════════════════════
// ACCOUNT / CLOUD SYNC
// ═══════════════════════════════════════════
//
// Opt-in only: nothing below ever runs unless the user opens the Account
// button, or attemptSilentReconnect() finds evidence this device was already
// connected. Local storage stays the source of truth either way — cloud sync
// only ever mirrors it, never gates reading/writing it.
//
// Records sync as plain fields (see firebase-sync.js for why there's no
// client-side encryption) — Firestore's per-uid rules are the only
// protection.

const PENDING_SIGNIN_KEY = 'mentalmap_pending_redirect_signin';
const SYNCED_BEFORE_KEY = 'mentalmap_synced_before'; // set once sign-in succeeds, so a relaunch knows to check Firebase's auth state at all
const PRE_SIGNIN_SNAPSHOT_KEY = 'mentalmap_pre_signin_snapshot';
// Never cleared on sign-out (unlike SYNCED_BEFORE_KEY) — its whole job is to
// survive the sign-out so the *next* sign-in can tell whether it's the same
// account resuming versus a different one taking over. See completeSignIn().
const LAST_SYNCED_UID_KEY = 'mentalmap_last_synced_uid';
const SYNC_ERROR_KEY = 'mentalmap_last_sync_error';

let syncApi = null; // cached module namespace from the lazily-imported firebase-sync.js
// cloudCount: last known number of people docs found for this account, purely
// for display — refreshed on connect and after every full pull.
let syncState = { uid: null, email: null, verified: false, cloudCount: null, unsubscribePeople: null };

function isSyncActive() {
  return !!(syncState.uid && syncState.verified);
}

// A push/fetch failure (most often Firestore rejecting the write — e.g. the
// security rules deployed in the Firebase console don't match what the app
// actually sends) used to fail silently: "Synchronizacja aktywna" kept
// showing even though nothing ever reached the server. Persisted (not just
// in-memory) so it survives a reload — the next time the user opens Account
// or Settings, a stuck error is visible instead of invisible.
function recordSyncError(message) {
  try { localStorage.setItem(SYNC_ERROR_KEY, JSON.stringify({ message, at: Date.now() })); } catch (_) { /* ignore */ }
  refreshAccountSignedInScreen();
  refreshSettingsModal();
}

function clearSyncError() {
  try { localStorage.removeItem(SYNC_ERROR_KEY); } catch (_) { /* ignore */ }
}

function readSyncError() {
  try {
    const raw = localStorage.getItem(SYNC_ERROR_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
}

function pluralOsob(n) {
  if (n === 1) return `${n} osoba`;
  const lastDigit = n % 10;
  const lastTwo = n % 100;
  if (lastDigit >= 2 && lastDigit <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return `${n} osoby`;
  return `${n} osób`;
}

async function loadSyncModule() {
  if (syncApi) return syncApi;
  const mod = await import(`./firebase-sync.js?v=${ASSET_VERSION}`);
  syncApi = mod;
  window.MentalMapSync = mod; // debugging aid only, nothing reads this back
  return mod;
}

// The only fields that ever leave the device, in both directions: read a
// pushable record out of a person, and read a person's fields back out of
// whatever Firestore handed us. Same shape either way, so one function does
// both jobs.
function pickSyncFields(obj) {
  return {
    name: obj.name,
    answers: obj.answers,
    answerIndices: obj.answerIndices || null,
    // Legacy records from before the gate question existed have no
    // gateAnswer at all, and Firestore rejects an undefined field outright.
    gateAnswer: typeof obj.gateAnswer === 'number' ? obj.gateAnswer : null,
    secretCap: obj.secretCap,
    gradientIndex: obj.gradientIndex,
    personalityType: obj.personalityType || null,
    personalityAnswers: obj.personalityAnswers || null
  };
}

// Snapshot local data right before a genuinely different account's cloud
// data takes over this device, so a guest sign-in (e.g. showing someone
// your map on their device, or a demo) can be undone cleanly on sign-out.
// Only called when the signing-in uid differs from this device's last one
// (see completeSignIn()) — this internal guard just protects against being
// called twice for the same incoming session.
function captureLocalSnapshotIfNeeded() {
  let already;
  try { already = localStorage.getItem(PRE_SIGNIN_SNAPSHOT_KEY); } catch (_) { return; }
  if (already !== null) return;
  let raw = null;
  try { raw = localStorage.getItem(STORAGE_KEY); } catch (_) { /* ignore */ }
  try { localStorage.setItem(PRE_SIGNIN_SNAPSHOT_KEY, JSON.stringify({ raw })); } catch (_) { /* ignore */ }
}

// Undoes whatever a *different* account's cloud data replaced on this
// device, restoring exactly what was there before it signed in — a no-op
// when the account signing out is the same one that was already associated
// with this device (captureLocalSnapshotIfNeeded() never ran for it, so
// there's nothing recorded to restore). Nothing done while signed in is
// ever lost either way — every change was already pushed live to that
// account's own cloud copy.
function restoreLocalSnapshot() {
  let raw;
  try {
    const snap = localStorage.getItem(PRE_SIGNIN_SNAPSHOT_KEY);
    if (snap === null) return; // no foreign account ever took over this device
    raw = JSON.parse(snap).raw;
  } catch (_) { return; }
  try {
    if (raw === null) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, raw);
  } catch (_) { /* ignore */ }
  try { localStorage.removeItem(PRE_SIGNIN_SNAPSHOT_KEY); } catch (_) { /* ignore */ }
  loadPeople(); // re-parses STORAGE_KEY into `people` and re-renders
  updateEmptyState();
}

// Fire-and-forget: called once from init(), after the normal synchronous local
// load has already rendered. Costs nothing (no network, no import) for the
// large majority of users who have never touched sync.
async function attemptSilentReconnect() {
  let pendingRedirect = false;
  try { pendingRedirect = !!localStorage.getItem(PENDING_SIGNIN_KEY); } catch (_) { /* ignore */ }

  let syncedBefore = false;
  try { syncedBefore = !!localStorage.getItem(SYNCED_BEFORE_KEY); } catch (_) { /* ignore */ }

  if (!pendingRedirect && !syncedBefore) return; // never connected on this device — stay fully local

  try {
    const api = await loadSyncModule();
    let user = null;

    if (pendingRedirect) {
      try { localStorage.removeItem(PENDING_SIGNIN_KEY); } catch (_) { /* ignore */ }
      user = await api.checkRedirectResult();
    }
    if (!user) user = await api.getCurrentUser();
    if (!user) return; // no live Firebase session; Account modal will ask to sign in again

    await completeSignIn(user);
  } catch (e) {
    console.error('Silent reconnect failed:', e);
  }
}

function showAccountScreen(id) {
  ['entry', 'verify', 'signed-in'].forEach(name => {
    const el = $(`#account-screen-${name}`);
    if (el) el.hidden = name !== id;
  });
}

function showAccountStatus(message, kind = 'info') {
  const el = $('#account-status');
  if (!el) return;
  if (!message) { el.hidden = true; return; }
  el.textContent = message;
  el.className = `backup-status backup-status--${kind}`;
  el.hidden = false;
}

function refreshAccountSignedInScreen() {
  const emailEl = $('#account-signed-in-email');
  if (emailEl) emailEl.textContent = syncState.email || '';

  const err = readSyncError();

  const statusEl = $('#account-sync-status');
  if (statusEl) {
    if (err) {
      statusEl.textContent = err.message;
      statusEl.classList.add('sync-status--warn');
    } else {
      statusEl.textContent = typeof syncState.cloudCount === 'number'
        ? `Synchronizacja aktywna — ${pluralOsob(syncState.cloudCount)} w chmurze`
        : 'Synchronizacja aktywna';
      statusEl.classList.remove('sync-status--warn');
    }
  }

  // Surfaced only alongside an active sync error — a one-off safety net for
  // when the cloud copy can't be trusted, never a routine nag to back up.
  const backupBtn = $('#btn-download-backup');
  if (backupBtn) backupBtn.hidden = !err;
}

// One-way export, offered only when a sync error is active (see
// refreshAccountSignedInScreen) — not a return of the full backup/restore
// flow removed in #24, just a safety net so a broken cloud account can't
// also take the local map down with it.
function downloadLocalBackup() {
  const blob = new Blob([JSON.stringify(people, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mentalmap-kopia-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Emergency recovery counterpart to downloadLocalBackup() above — reads a
// previously-downloaded backup file back in, overwrites the local map with
// it, and (if signed in) pushes the result up to the account so it becomes
// the synced data going forward, everywhere. Always available on the
// signed-in screen: unlike the download button this requires the user to
// actively pick a file, so there's no passive-spam risk in leaving it up.
function restoreFromBackupFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    let parsed;
    try {
      parsed = JSON.parse(reader.result);
    } catch (e) {
      alert('Nie udało się odczytać pliku — to nie jest poprawny plik JSON.');
      return;
    }
    const rawList = Array.isArray(parsed) ? parsed : (Array.isArray(parsed?.people) ? parsed.people : null);
    if (!rawList) {
      alert('Ten plik nie wygląda na kopię zapasową MentalMap.');
      return;
    }
    // Same normalization + malformed-record guard as a cloud pull
    // (pullAndReconcile) — a backup file deserves exactly the same
    // protection against a record with no name crashing the whole import.
    const restored = rawList
      .map(rec => Object.assign({
        id: rec.id || `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        angle: Math.random() * Math.PI * 2,
        speed: 0.1
      }, pickSyncFields(rec)))
      .filter(p => {
        if (typeof p.name === 'string' && p.name.trim()) return true;
        console.warn('Skipping malformed backup record (no name).');
        return false;
      });
    if (!restored.length) {
      alert('Ten plik nie zawiera żadnych osób do przywrócenia.');
      return;
    }
    const cloudNote = isSyncActive() ? ' i w koncie w chmurze' : '';
    if (!confirm(`Wczytać ${pluralOsob(restored.length)} z pliku? Zastąpi to obecną mapę na tym urządzeniu${cloudNote}.`)) {
      return;
    }
    people = restored;
    people.forEach(recomputeDerived);
    distributePlanets();
    savePeople();
    renderPlanets();
    updateEmptyState();
    if (isSyncActive()) {
      queueSyncUpsertAll(people);
    }
  };
  reader.onerror = () => alert('Nie udało się odczytać pliku.');
  reader.readAsText(file);
}

function openAccountModal() {
  const modal = $('#account-modal');
  if (!modal) return;
  showAccountStatus('');
  if (isSyncActive()) {
    showAccountScreen('signed-in');
    refreshAccountSignedInScreen();
  } else {
    showAccountScreen('entry');
    // Warm the SDK now rather than inside the sign-in click: the first import
    // fetches Firebase from gstatic, and awaiting that in the click handler
    // outlives the transient user activation, so the browser would block the
    // popup signInWithGoogle() opens. Still opt-in — this only runs once the
    // user has actually opened the Account modal.
    loadSyncModule().catch(() => { /* surfaced when a sign-in is actually attempted */ });
  }
  modal.setAttribute('aria-hidden', 'false');
  history.pushState({ accountModalOpen: true }, '');
}

function closeAccountModal(fromPopState = false) {
  const modal = $('#account-modal');
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'true');
  if (!fromPopState && history.state && history.state.accountModalOpen) {
    history.back();
  }
}

// ═══════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════

function refreshSettingsModal() {
  const titleEl = $('#settings-account-title');
  const hintEl = $('#settings-account-hint');
  if (titleEl && hintEl) {
    if (isSyncActive()) {
      titleEl.textContent = syncState.email || 'Konto';
      const err = readSyncError();
      hintEl.textContent = err ? 'Błąd synchronizacji — sprawdź Konto' : 'Synchronizacja aktywna — zarządzaj kontem';
      hintEl.classList.toggle('settings-account-row__hint--warn', !!err);
    } else {
      titleEl.textContent = 'Zaloguj się';
      hintEl.textContent = 'Zapewni Ci to kopię zapasową na innych urządzeniach';
      hintEl.classList.remove('settings-account-row__hint--warn');
    }
  }

  const colorsChk = $('#chk-show-level-colors');
  if (colorsChk) colorsChk.checked = showLevelColors;
  const trajChk = $('#chk-show-trajectories');
  if (trajChk) trajChk.checked = showTrajectories;
}

function openSettingsModal() {
  const modal = $('#settings-modal');
  if (!modal) return;
  refreshSettingsModal();
  modal.setAttribute('aria-hidden', 'false');
  history.pushState({ settingsModalOpen: true }, '');
}

function closeSettingsModal(fromPopState = false) {
  const modal = $('#settings-modal');
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'true');
  if (!fromPopState && history.state && history.state.settingsModalOpen) {
    history.back();
  }
}

function setShowLevelColors(show) {
  showLevelColors = !!show;
  try { localStorage.setItem(SHOW_LEVEL_COLORS_KEY, showLevelColors ? '1' : '0'); } catch (_) { /* ignore */ }
  queueSyncSettings();
}

function setShowTrajectories(show) {
  showTrajectories = !!show;
  try { localStorage.setItem(SHOW_TRAJECTORIES_KEY, showTrajectories ? '1' : '0'); } catch (_) { /* ignore */ }
  if (orbitLinesContainer) orbitLinesContainer.style.display = showTrajectories ? '' : 'none';
  queueSyncSettings();
}

// No-op whenever sync isn't active, same convention as queueSyncUpsert for people.
function queueSyncSettings() {
  if (!isSyncActive()) return;
  syncApi.pushSettings(syncState.uid, { showLevelColors, showTrajectories })
    .then(clearSyncError)
    .catch(e => {
      console.error('Cloud sync of settings failed:', e);
      recordSyncError('Nie udało się zapisać ustawień w chmurze — sprawdź reguły Firestore.');
    });
}

// Called once per successful (re)connect — see completeSignIn(). Cloud wins
// when it already has a value (another device set it); otherwise this is the
// first device to connect this account, so it pushes its own local choice up.
async function pullAndApplySettings() {
  let remote = null;
  try {
    remote = await syncApi.fetchSettingsOnce(syncState.uid);
  } catch (e) {
    console.error('Failed to fetch cloud settings:', e);
    return;
  }

  if (!remote) {
    queueSyncSettings();
    return;
  }

  if (typeof remote.showLevelColors === 'boolean') {
    showLevelColors = remote.showLevelColors;
    try { localStorage.setItem(SHOW_LEVEL_COLORS_KEY, showLevelColors ? '1' : '0'); } catch (_) { /* ignore */ }
  }
  if (typeof remote.showTrajectories === 'boolean') {
    showTrajectories = remote.showTrajectories;
    try { localStorage.setItem(SHOW_TRAJECTORIES_KEY, showTrajectories ? '1' : '0'); } catch (_) { /* ignore */ }
    if (orbitLinesContainer) orbitLinesContainer.style.display = showTrajectories ? '' : 'none';
  }
  refreshSettingsModal();
}

function bindSettingsEvents() {
  $('#btn-settings')?.addEventListener('click', openSettingsModal);
  $('#btn-close-settings')?.addEventListener('click', () => closeSettingsModal());
  $('#settings-modal')?.addEventListener('click', (e) => {
    if (e.target === $('#settings-modal')) closeSettingsModal();
  });

  $('#btn-open-account')?.addEventListener('click', () => {
    // Plain close (skip the history.back() branch) — openAccountModal() pushes
    // its own history entry right after, and racing a pushState against an
    // in-flight history.back() would corrupt the navigation stack.
    closeSettingsModal(true);
    openAccountModal();
  });

  $('#chk-show-level-colors')?.addEventListener('change', (e) => setShowLevelColors(e.target.checked));
  $('#chk-show-trajectories')?.addEventListener('change', (e) => setShowTrajectories(e.target.checked));
}

async function handleGoogleSignIn() {
  showAccountStatus('Łączenie z Google…', 'info');
  try {
    const api = await loadSyncModule();
    // The flag is only for the redirect fallback's return leg, so it is set at
    // the moment we know we are actually navigating away — not before, or a
    // popup sign-in would leave it behind for the next page load to trip over.
    const user = await api.signInWithGoogle({
      onBeforeRedirect: () => {
        try { localStorage.setItem(PENDING_SIGNIN_KEY, '1'); } catch (_) { /* ignore */ }
      }
    });
    if (!user) return; // redirect fallback took over; resumes via attemptSilentReconnect()
    await completeSignIn(user);
  } catch (e) {
    try { localStorage.removeItem(PENDING_SIGNIN_KEY); } catch (_) { /* ignore */ }
    if (typeof syncApi?.isUserCancelledSignIn === 'function' && syncApi.isUserCancelledSignIn(e)) {
      showAccountStatus('');
      return;
    }
    console.error('Google sign-in failed:', e);
    showAccountStatus('Nie udało się zalogować przez Google.', 'warn');
  }
}

async function handleEmailSignIn(e) {
  e?.preventDefault();
  const email = $('#account-email')?.value.trim();
  const password = $('#account-password')?.value;
  if (!email || !password) return;
  showAccountStatus('Logowanie…', 'info');
  try {
    const api = await loadSyncModule();
    const user = await api.signInWithEmail(email, password);
    await completeSignIn(user);
  } catch (e2) {
    console.error('Email sign-in failed:', e2);
    showAccountStatus('Nie udało się zalogować. Sprawdź adres e-mail i hasło.', 'warn');
  }
}

async function handleEmailSignUp() {
  const email = $('#account-email')?.value.trim();
  const password = $('#account-password')?.value;
  if (!email || !password) {
    showAccountStatus('Podaj e-mail i hasło (min. 8 znaków).', 'warn');
    return;
  }
  showAccountStatus('Zakładanie konta…', 'info');
  try {
    const api = await loadSyncModule();
    const user = await api.signUpWithEmail(email, password);
    try { await api.sendVerificationEmail(user); } catch (e) { console.error('Failed to send verification email:', e); }
    await completeSignIn(user);
  } catch (e) {
    console.error('Email sign-up failed:', e);
    showAccountStatus('Nie udało się założyć konta. Może ten adres jest już zajęty?', 'warn');
  }
}

async function handleForgotPassword() {
  const email = $('#account-email')?.value.trim();
  if (!email) {
    showAccountStatus('Podaj najpierw swój adres e-mail powyżej.', 'warn');
    return;
  }
  showAccountStatus('Wysyłanie linku…', 'info');
  try {
    const api = await loadSyncModule();
    await api.sendPasswordReset(email);
    showAccountStatus(`Jeśli istnieje konto na ${email}, wysłaliśmy na nie link do ustawienia nowego hasła.`, 'ok');
  } catch (e) {
    // auth/user-not-found would otherwise reveal whether the address has an
    // account — show the same generic success message either way.
    if (e && e.code === 'auth/user-not-found') {
      showAccountStatus(`Jeśli istnieje konto na ${email}, wysłaliśmy na nie link do ustawienia nowego hasła.`, 'ok');
      return;
    }
    if (e && e.code === 'auth/invalid-email') {
      showAccountStatus('Podaj poprawny adres e-mail.', 'warn');
      return;
    }
    console.error('Password reset failed:', e);
    showAccountStatus('Nie udało się wysłać wiadomości. Spróbuj ponownie później.', 'warn');
  }
}

async function handleCheckVerified() {
  showAccountStatus('Sprawdzanie…', 'info');
  try {
    const api = syncApi || await loadSyncModule();
    const user = await api.getCurrentUser();
    if (!user) {
      showAccountStatus('Zaloguj się ponownie.', 'warn');
      return;
    }
    await completeSignIn(user);
    if (!syncState.verified) {
      showAccountStatus('Jeszcze nie kliknięto linku aktywacyjnego.', 'warn');
    }
  } catch (e) {
    console.error('Verification check failed:', e);
    showAccountStatus('Nie udało się sprawdzić. Spróbuj ponownie.', 'warn');
  }
}

async function handleResendVerification() {
  showAccountStatus('Wysyłanie…', 'info');
  try {
    const api = syncApi || await loadSyncModule();
    const user = await api.getCurrentUser();
    if (!user) {
      showAccountStatus('Zaloguj się ponownie.', 'warn');
      return;
    }
    await api.sendVerificationEmail(user);
    showAccountStatus('Wysłano ponownie. Sprawdź skrzynkę (także spam).', 'ok');
  } catch (e) {
    console.error('Resend verification failed:', e);
    showAccountStatus('Nie udało się wysłać wiadomości. Spróbuj później.', 'warn');
  }
}

// Shared continuation after ANY successful Firebase auth (Google or email),
// whether just completed or resumed on relaunch. Google verifies its own
// accounts, so this only ever gates email/password sign-ups that haven't
// clicked their activation link yet.
async function completeSignIn(user) {
  syncState.uid = user.uid;
  syncState.email = user.email || '';

  try {
    const api = syncApi || await loadSyncModule();
    // Refreshes in place: catches a verification link clicked in another tab
    // or on another device since this browser last saw this session.
    await api.refreshUser(user);
  } catch (e) {
    console.error('Failed to refresh auth state:', e);
  }
  syncState.verified = !!user.emailVerified;

  if (!syncState.verified) {
    const el = $('#account-verify-email');
    if (el) el.textContent = syncState.email;
    showAccountScreen('verify');
    showAccountStatus('');
    return;
  }

  pullAndApplySettings();

  // Distinguish a genuinely new sign-in from a routine resume of a session
  // already established on this device: once synced, local storage already
  // reflects the last known state, so re-running the one-time merge prompt
  // on every relaunch (local and cloud both non-empty, every single time)
  // would ask the same question forever. A resume just picks the realtime
  // listener back up; only a fresh connection gets the merge dance.
  let alreadySynced = false;
  try { alreadySynced = !!localStorage.getItem(SYNCED_BEFORE_KEY); } catch (_) { /* ignore */ }

  try { localStorage.setItem(SYNCED_BEFORE_KEY, '1'); } catch (_) { /* ignore */ }

  // Only protect local data as a "guest snapshot" when a *different* account
  // is taking over this device than last time (a genuine stranger, or a
  // friend demoing their own map) — never for the same account resuming
  // after an ordinary sign-out/sign-in cycle, which used to wipe the local
  // map down to whatever ancient (often empty) snapshot this device had
  // captured on its very first-ever sign-in, with no way back short of a
  // successful cloud re-pull. Signing out and back into your own account
  // should be a complete no-op for local data — there is no "original
  // owner" to protect it from, you.
  let lastSyncedUid = null;
  try { lastSyncedUid = localStorage.getItem(LAST_SYNCED_UID_KEY); } catch (_) { /* ignore */ }
  if (lastSyncedUid !== user.uid) {
    captureLocalSnapshotIfNeeded();
  }
  try { localStorage.setItem(LAST_SYNCED_UID_KEY, user.uid); } catch (_) { /* ignore */ }

  showAccountScreen('signed-in');
  refreshAccountSignedInScreen();
  showAccountStatus('');

  // Sign-in itself has already succeeded at this point (auth state is set,
  // the signed-in screen is showing) — an error past here is a data-sync
  // problem, not a login problem. Without this try/catch, a throw from
  // pullAndReconcile() would propagate all the way up through this awaited
  // call into handleGoogleSignIn's/handleEmailSignIn's own catch block,
  // which would then overwrite the (accurate) signed-in status with a
  // misleading "Nie udało się zalogować" — telling the user login failed
  // when it didn't; only fetching their data did.
  try {
    if (alreadySynced) {
      startPeopleListener();
      await refreshCloudCount();
    } else {
      await pullAndReconcile();
    }
  } catch (e) {
    console.error('Post-sign-in data sync failed:', e);
    recordSyncError('Zalogowano, ale nie udało się pobrać danych z chmury — spróbuj ponownie lub sprawdź reguły Firestore.');
  }
}

// Lightweight read-only check, used only on a routine resume (see
// alreadySynced above) where pullAndReconcile's full fetch-and-merge is
// skipped — keeps the "N osób w chmurze" status honest without re-running
// the merge dance on every relaunch.
async function refreshCloudCount() {
  try {
    const records = await syncApi.fetchAllPeopleOnce(syncState.uid);
    syncState.cloudCount = records.length;
    clearSyncError();
  } catch (e) {
    console.error('Failed to refresh cloud count:', e);
    recordSyncError('Nie udało się pobrać danych z chmury — sprawdź połączenie lub reguły Firestore.');
  }
  refreshAccountSignedInScreen();
  refreshSettingsModal();
}

// One-time reconciliation the first time a device connects a given account —
// see the alreadySynced check in completeSignIn() for why a routine relaunch
// skips this. Not used for ongoing sync — that's startPeopleListener() below.
//
// No merge prompt: the account's own cloud data always wins outright once it
// exists (e.g. a friend signing into their account on your device should see
// their map, not be asked whether to keep yours). The one case local data
// survives is a brand-new account with nothing in the cloud yet — then
// whatever's currently on the device becomes that account's first upload.
// Either way the device's pre-sign-in state was already snapshotted in
// completeSignIn() and comes back untouched on sign-out.
async function pullAndReconcile() {
  showAccountStatus('Pobieranie danych…', 'info');
  let records;
  try {
    records = await syncApi.fetchAllPeopleOnce(syncState.uid);
  } catch (e) {
    console.error('Failed to fetch cloud people:', e);
    showAccountStatus('Nie udało się pobrać danych z chmury.', 'warn');
    recordSyncError('Nie udało się pobrać danych z chmury — sprawdź połączenie lub reguły Firestore.');
    return;
  }
  clearSyncError();

  const pulled = records
    .map(rec => Object.assign({
      id: rec.id,
      angle: Math.random() * Math.PI * 2,
      speed: 0.1,
      syncUpdatedAt: rec.updatedAtMs || Date.now()
    }, pickSyncFields(rec)))
    // A doc with no name at all isn't a real person — almost certainly a
    // leftover from before the plain-fields migration (#24), when records
    // stored encrypted ciphertext under different field names entirely.
    // Dropping it here (never deleted from Firestore, just not displayed)
    // is what actually matters: rendering it would produce a nameless
    // planet, and worse, previously could crash the entire reconcile pass
    // for every other, perfectly valid person pulled alongside it.
    .filter(p => {
      if (typeof p.name === 'string' && p.name.trim()) return true;
      console.warn('Skipping malformed cloud person record (no name):', p.id);
      return false;
    });
  pulled.forEach(recomputeDerived);
  syncState.cloudCount = pulled.length;

  if (pulled.length > 0) {
    people = pulled;
    distributePlanets();
    savePeople();
    renderPlanets();
    updateEmptyState();
  } else if (people.length > 0) {
    queueSyncUpsertAll(people);
  }

  showAccountScreen('signed-in');
  refreshAccountSignedInScreen();
  showAccountStatus('');
  startPeopleListener();
}

function startPeopleListener() {
  if (syncState.unsubscribePeople) {
    syncState.unsubscribePeople();
    syncState.unsubscribePeople = null;
  }
  if (!isSyncActive()) return;
  syncState.unsubscribePeople = syncApi.subscribePeople(syncState.uid, handleRemoteChanges);
}

// Ongoing realtime sync. Equal-or-older incoming timestamps are dropped
// silently — that's expected on every change this same device just pushed
// itself (an echo of our own write), not a bug.
function handleRemoteChanges(changes) {
  if (!isSyncActive()) return;
  let touched = false;

  for (const change of changes) {
    const personId = change.id;

    if (change.type === 'removed') {
      const idx = people.findIndex(p => p.id === personId);
      if (idx !== -1) { people.splice(idx, 1); touched = true; }
      continue;
    }

    const rec = change.data;
    // Same malformed-record guard as pullAndReconcile() — the realtime
    // listener replays every existing document as an "added" change on its
    // first snapshot, so a leftover nameless doc would otherwise slip back
    // in here even after being filtered out of the initial pull.
    if (!(typeof rec.name === 'string' && rec.name.trim())) {
      console.warn('Skipping malformed cloud person record (no name):', personId);
      continue;
    }
    const incomingMs = rec.updatedAtMs || 0;
    const existing = people.find(p => p.id === personId);
    if (existing && (existing.syncUpdatedAt || 0) >= incomingMs) continue;

    const merged = Object.assign(existing || {
      id: personId,
      angle: Math.random() * Math.PI * 2,
      speed: 0.1
    }, pickSyncFields(rec), { syncUpdatedAt: incomingMs });
    recomputeDerived(merged);
    if (!existing) people.push(merged);
    touched = true;
  }

  if (touched) {
    distributePlanets();
    savePeople();
    renderPlanets();
    updateEmptyState();
  }
}

// No-ops whenever sync isn't active, so every existing local-mutation call
// site can call these unconditionally without an isSyncActive() check of
// its own.
function queueSyncUpsert(person) {
  if (!isSyncActive() || !person) return;
  person.syncUpdatedAt = Date.now();
  syncApi.pushPerson(syncState.uid, person.id, pickSyncFields(person), person.syncUpdatedAt)
    .then(clearSyncError)
    .catch(e => {
      console.error('Cloud sync push failed for', person.id, e);
      recordSyncError('Nie udało się zapisać zmian w chmurze — sprawdź reguły Firestore lub połączenie.');
    });
}

function queueSyncDelete(personId) {
  if (!isSyncActive() || !personId) return;
  syncApi.deletePerson(syncState.uid, personId)
    .then(clearSyncError)
    .catch(e => {
      console.error('Cloud sync delete failed for', personId, e);
      recordSyncError('Nie udało się usunąć wpisu w chmurze — sprawdź reguły Firestore lub połączenie.');
    });
}

function queueSyncUpsertAll(list) {
  if (!isSyncActive()) return;
  list.forEach(queueSyncUpsert);
}

function handleSignOut() {
  if (syncState.unsubscribePeople) {
    syncState.unsubscribePeople();
  }
  syncApi?.signOutUser().catch(e => console.error('Sign out failed:', e));
  syncState = { uid: null, email: null, verified: false, cloudCount: null, unsubscribePeople: null };
  try { localStorage.removeItem(SYNCED_BEFORE_KEY); } catch (_) { /* ignore */ }
  restoreLocalSnapshot();
  showAccountScreen('entry');
  showAccountStatus('Wylogowano.', 'ok');
}

function bindAccountEvents() {
  $('#btn-close-account')?.addEventListener('click', () => closeAccountModal());
  $('#account-modal')?.addEventListener('click', (e) => {
    if (e.target === $('#account-modal')) closeAccountModal();
  });

  $('#btn-google-signin')?.addEventListener('click', handleGoogleSignIn);
  $('#account-email-form')?.addEventListener('submit', handleEmailSignIn);
  $('#btn-email-signup')?.addEventListener('click', handleEmailSignUp);
  $('#btn-forgot-password')?.addEventListener('click', handleForgotPassword);

  $('#btn-check-verified')?.addEventListener('click', handleCheckVerified);
  $('#btn-resend-verification')?.addEventListener('click', handleResendVerification);
  $('#btn-verify-sign-out')?.addEventListener('click', handleSignOut);

  $('#btn-download-backup')?.addEventListener('click', downloadLocalBackup);
  $('#btn-restore-backup')?.addEventListener('click', () => $('#input-restore-backup')?.click());
  $('#input-restore-backup')?.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) restoreFromBackupFile(file);
    e.target.value = ''; // allow re-selecting the same file afterward
  });
  $('#btn-sign-out')?.addEventListener('click', handleSignOut);
}

// ═══════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.trim().substring(0, 2).toUpperCase();
}

function getLevel(score) {
  if (score >= 35) return 3;
  if (score >= 18) return 2;
  return 1;
}

function getPlanetGlowStyle(person) {
  let best = 0, worst = 0, medium = 0;
  const ans = person.answers || [];
  
  // Rule evaluates UI questions 2, 3, and 4 (SURVEY_QUESTIONS indices 0, 1, 2)
  [0, 1, 2].forEach(qi => {
    if (ans[qi] === undefined) return;
    const qAnswers = SURVEY_QUESTIONS[qi].answers;
    const maxPts = Math.max(...qAnswers.map(a => a.points));
    const minPts = Math.min(...qAnswers.map(a => a.points));
    
    if (ans[qi] === maxPts) best++;
    else if (ans[qi] === minPts) worst++;
    else medium++;
  });
  
  const score = best - worst;
  
  if (score === 3) return { glow: '0 0 12px 4px #16a34a', color: '#16a34a' }; // Ciemno zielony
  if (score === 2) return { glow: '0 0 12px 4px #86efac', color: '#86efac' }; // Jasno zielony (mocny)
  if (score === 1) return { glow: '0 0 8px 2px #86efac', color: '#86efac' }; // Jasno zielony (słabszy)
  if (score === -1) return { glow: '0 0 8px 2px #f97316', color: '#f97316' }; // Pomarańczowy
  if (score === -2) return { glow: '0 0 12px 4px #ef4444', color: '#ef4444' }; // Czerwony
  if (score === -3) return { glow: '0 0 12px 4px #000000', color: '#000000' }; // Czarny
  
  if (score === 0) {
    if (best === 1 && worst === 1 && medium === 1) {
      return { glow: '0 0 8px 2px #f97316', color: '#f97316' }; // Pomarańczowy
    }
    return { glow: null, color: null }; // 3x średnia (brak glow)
  }
  
  return { glow: null, color: null };
}

function getSpeedByScore(score) {
  const clamped = Math.min(Math.max(score, 0), 50);
  const minSpeed = 0.01; // extremely slow
  const maxSpeed = 0.25; // moderate, pleasant pace
  
  // Strict linear mapping so every single point translates directly to speed
  return minSpeed + (clamped / 50) * (maxSpeed - minSpeed);
}



// ═══════════════════════════════════════════
// EVENT BINDING
// ═══════════════════════════════════════════

function bindEvents() {
  fabAdd?.addEventListener('click', openAddModal);
  btnCancel?.addEventListener('click', closeModal);
  btnDelete?.addEventListener('click', handleDelete);
  surveyForm?.addEventListener('submit', handleSubmit);

  // Close modal on background click
  surveyModal?.addEventListener('click', e => {
    if (e.target === surveyModal) closeModal();
  });

  // Personality (DISC) mini-survey modal — opened from the color-group as an
  // alternative to the manual swatch picker.
  $('#btn-personality-color')?.addEventListener('click', openPersonalityModal);
  $('#btn-close-personality')?.addEventListener('click', () => closePersonalityModal());
  $('#btn-personality-clear')?.addEventListener('click', handlePersonalityClear);
  personalityForm?.addEventListener('submit', handlePersonalitySubmit);
  personalityModal?.addEventListener('click', e => {
    if (e.target === personalityModal) closePersonalityModal();
  });

  // Close modal on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (personalityModal?.getAttribute('aria-hidden') === 'false') closePersonalityModal();
      if (surveyModal?.getAttribute('aria-hidden') === 'false') closeModal();
      if (infoModal?.getAttribute('aria-hidden') === 'false') closeInfoModal();
      if ($('#account-modal')?.getAttribute('aria-hidden') === 'false') closeAccountModal();
      if ($('#settings-modal')?.getAttribute('aria-hidden') === 'false') closeSettingsModal();
    }
  });

  // Bind orbit ring clicks for level info
  $$('.orbit-ring').forEach(ring => {
    ring.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent outer rings from catching inner ring clicks
      if (e.target.closest('.planet-group')) return;
      
      // If a planet is selected, close the menu and zoom out instead of showing info
      if (selectedPlanetId) {
        closePlanetMenu();
        return;
      }

      const level = parseInt(ring.dataset.level, 10);
      if (level >= 1 && level <= 3) openInfoModal(level);
    });
  });

  // Setup map viewport pan/zoom/tilt
  setupMapNavigation();

  $('#btn-close-info')?.addEventListener('click', () => closeInfoModal());
  $('#info-modal')?.addEventListener('click', e => {
    if (e.target === $('#info-modal')) closeInfoModal();
  });

  // Icon menu: hamburger reveals ranking/stats/settings, collapses once one is picked.
  if (btnMenuToggle && iconMenu) {
    const collapseIconMenu = () => {
      iconMenu.classList.remove('expanded');
      btnMenuToggle.setAttribute('aria-expanded', 'false');
    };

    btnMenuToggle.addEventListener('click', () => {
      const expanded = iconMenu.classList.toggle('expanded');
      btnMenuToggle.setAttribute('aria-expanded', String(expanded));
    });

    iconMenu.querySelectorAll('.icon-menu-item').forEach(item => {
      item.addEventListener('click', collapseIconMenu);
    });

    document.addEventListener('click', (e) => {
      if (iconMenu.classList.contains('expanded') && !iconMenu.contains(e.target)) collapseIconMenu();
    });
  }
}

// ═══════════════════════════════════════════
// INFO MODAL
// ═══════════════════════════════════════════

const infoModal = $('#info-modal');
const infoTitle = $('#info-title');
const infoContentText = $('#info-content-text');

const LEVEL_DESCRIPTIONS = {
  1: `To ludzie, którzy powinni znać Cię jedynie powierzchownie — imię, zawód, ogólne fakty, nic ponad to.

❌ Nie mówisz, jakie masz plany, ani co naprawdę myślisz.

❌ Nie mówisz o tym, co czujesz, a ich słowa nie powinny wpływać na Twój stan emocjonalny.

❌ Nie dzielisz się swoimi przemyśleniami ani prywatnymi opiniami.

❌ Nie prosisz ich o rady i ignorujesz ich opinie na Twój temat.

❌ Nie bierzesz ich pod uwagę przy podejmowaniu jakichkolwiek decyzji.`,
  2: `To ludzie, którzy mogą wiedzieć, co się teraz u Ciebie dzieje i poznawać Twoją historię; to etap weryfikacji, dokąd zmierza ta znajomość.

✅ Możesz mówić, jakie masz bieżące plany i co myślisz, ale nie odsłaniasz swoich głębokich emocji.

✅ Możesz dzielić się opiniami i przemyśleniami, ale ostrożnie i bez podawania wrażliwych szczegółów.

❌ Nie zdradzasz swoich sekretów, słabości ani spraw, które mogłyby zostać użyte przeciwko Tobie.

✅ Możesz wysłuchać ich rad, ale traktujesz je jedynie jako niezobowiązujące sugestie.

✅ Możesz brać ich pod uwagę przy bieżących decyzjach, jeśli bezpośrednio ich dotyczą.

✅ Obserwujesz, jak reagują na Twoje granice i czy dochowują dyskrecji, zanim wpuścisz ich głębiej.`,
  3: `To najwyższy poziom relacji — przestrzeń pełnego zaufania, gdzie jesteś całkowicie sobą z ludźmi, którzy dobrze Cię poznali i sprawdzili się w czasie.

✅ Dzielisz się długoterminowymi planami, wizją przyszłości i celami.

✅ Mówisz otwarcie o swoich prawdziwych przemyśleniach, motywacjach i wątpliwościach.

✅ Mówisz wprost o tym, co czujesz — pokazujesz emocje, lęki i słabości.

✅ Nie ukrywasz przed nimi sekretów ani trudnych faktów ze swojej historii.

✅ Zawsze wysłuchujesz ich rad i analizujesz ich perspektywę przed podjęciem kluczowych kroków.

✅ Zawsze bierzesz ich pod uwagę przy podejmowaniu ważnych decyzji życiowych.

✅ Dajesz im prawo do szczerego feedbacku, zachowując jednak ostateczną odpowiedzialność za własne wybory.`
};

const LEVEL_COLORS = {
  1: 'var(--level-1-color)',
  2: 'var(--level-2-color)',
  3: 'var(--level-3-color)'
};

function openInfoModal(level) {
  if (!infoModal || !LEVEL_DESCRIPTIONS[level]) return;
  infoTitle.textContent = `Poziom ${level}`;
  infoTitle.style.color = LEVEL_COLORS[level];
  infoContentText.textContent = LEVEL_DESCRIPTIONS[level];
  infoModal.setAttribute('aria-hidden', 'false');
  history.pushState({ infoModalOpen: true }, '');
}

function closeInfoModal(fromPopState = false) {
  if (!infoModal) return;
  infoModal.setAttribute('aria-hidden', 'true');
  if (!fromPopState && history.state && history.state.infoModalOpen) {
    history.back();
  }
}

// ═══════════════════════════════════════════
// MODAL MANAGEMENT
// ═══════════════════════════════════════════

function openAddModal() {
  editingId = null;
  surveyForm.reset();
  resetQuestionOrder();
  resetQuestionCollapse();
  surveyForm.scrollTop = 0;
  updateColorPickerSelection(pickRandomGradientIndex());
  selectedPersonalityType = null;
  selectedPersonalityAnswers = null;
  updatePersonalityColorStatus();
  modalTitle.textContent = 'Nowa relacja';
  btnDelete.style.display = 'none';
  resetScorePreview();
  surveyModal.removeAttribute('data-mode');
  surveyModal.setAttribute('aria-hidden', 'false');
  history.pushState({ modalOpen: true }, '');
  // Focus name input after animation
  setTimeout(() => personNameInput?.focus(), 400);
}

function openEditModal(id, mode = 'survey') {
  const person = people.find(p => p.id === id);
  if (!person) return;

  editingId = id;
  surveyForm.reset();
  personNameInput.value = person.name;

  const colorIndex = person.gradientIndex !== undefined ? person.gradientIndex : pickRandomGradientIndex();
  updateColorPickerSelection(colorIndex);

  selectedPersonalityType = Array.isArray(person.personalityType) ? [...person.personalityType] : null;
  selectedPersonalityAnswers = Array.isArray(person.personalityAnswers) ? [...person.personalityAnswers] : null;
  updatePersonalityColorStatus();

  // Pre-fill gate
  if (typeof person.gateAnswer === 'number') {
    const gateRadio = surveyForm.querySelector(`input[name="gate"][value="${person.gateAnswer}"]`);
    if (gateRadio) gateRadio.checked = true;
  }

  // Pre-fill answers
  person.answers.forEach((pts, i) => {
    const idx = person.answerIndices?.[i];
    surveyForm.querySelectorAll(`input[name="q${i}"]`).forEach(r => delete r.dataset.legacyGuess);
    let radio;
    if (typeof idx === 'number') {
      radio = surveyForm.querySelector(`input[name="q${i}"][data-opt-index="${idx}"]`);
    } else {
      radio = surveyForm.querySelector(`input[name="q${i}"][value="${pts}"]`);
      // Legacy entry with no stored index: only flag as an unconfirmed guess when this
      // question actually has multiple tied answers for these points — otherwise the
      // match is already exact and safe to keep.
      const tieCount = SURVEY_QUESTIONS[i].answers.filter(a => a.points === pts).length;
      if (radio && tieCount > 1) radio.dataset.legacyGuess = 'true';
    }
    if (radio) radio.checked = true;
  });

  // Restore secret cap
  if (person.secretCap !== undefined) {
    const secretRadio = surveyForm.querySelector(`input[name="secret"][value="${person.secretCap}"]`);
    if (secretRadio) secretRadio.checked = true;
  }

  reorderQuestionsByCompletion(person);
  renderAnswerSummaries(person);
  surveyForm.scrollTop = surveyScrollPositions[id] || 0;

  modalTitle.textContent = mode === 'summary' ? `Podsumowanie: ${person.name}` : `Edytuj: ${person.name}`;
  btnDelete.style.display = 'flex';

  updateScorePreview();

  // Handle modal mode
  surveyModal.setAttribute('data-mode', mode);
  if (mode === 'summary') {
    generateSummary(person);
  } else if (summaryContainer) {
    summaryContainer.innerHTML = '';
  }

  surveyModal.setAttribute('aria-hidden', 'false');
  history.pushState({ modalOpen: true }, '');
}

// One-word profile name (drops the " — Styl X (Archetyp)" suffix) for the
// short "Typ mieszany: A + B" heading and the per-group labels in a tie.
function personalityShortName(color) {
  return PERSONALITY_PROFILES[color].name.split(' — ')[0];
}

const PERSONALITY_TIE_COUNT_WORDS = { 2: 'dwóch', 3: 'trzech', 4: 'czterech' };

// Renders the personality-survey result at the top of the summary — nothing
// at all when the mini-survey hasn't been completed for this person.
function buildPersonalitySummaryBlock(person) {
  const types = Array.isArray(person.personalityType) ? person.personalityType : null;
  if (!types || types.length === 0) return '';

  const profiles = types.map(c => PERSONALITY_PROFILES[c]);
  let html = '<div class="personality-summary">';
  html += '<p class="personality-summary__eyebrow">Typ osobowości (na podstawie mini-ankiety)</p>';

  if (types.length >= 2) {
    const countWord = PERSONALITY_TIE_COUNT_WORDS[types.length] || `${types.length}`;
    html += `<p class="personality-summary__note">Ta osoba wykazuje cechy ${countWord} typów osobowości w równym stopniu — w komunikacji warto brać pod uwagę wskazówki z obu profili, w zależności od sytuacji.</p>`;
    html += `<h3 class="personality-summary__title">Typ mieszany: ${types.map(personalityShortName).join(' + ')}</h3>`;
    html += '<div class="personality-summary__swatches">' + profiles.map(p => `<span class="personality-summary__swatch" style="background:${p.color}"></span>`).join('') + '</div>';

    const allTraits = [...new Set(profiles.flatMap(p => p.traits))];
    html += '<div class="personality-summary__traits">' + allTraits.map(t => `<span class="personality-summary__trait">${t}</span>`).join('') + '</div>';

    html += '<h4 class="personality-summary__subtitle">Jak z nią rozmawiać</h4>';
    types.forEach((color, i) => {
      const p = profiles[i];
      html += `<p class="personality-summary__group-label" style="color:${p.color}">${personalityShortName(color)}</p>`;
      html += '<ul class="personality-summary__list">' + p.howToTalk.map(t => `<li>${t}</li>`).join('') + '</ul>';
    });
  } else {
    const p = profiles[0];
    html += `<h3 class="personality-summary__title" style="color:${p.color}">${p.name}</h3>`;
    html += `<div class="personality-summary__swatches"><span class="personality-summary__swatch" style="background:${p.color}"></span></div>`;
    html += '<div class="personality-summary__traits">' + p.traits.map(t => `<span class="personality-summary__trait">${t}</span>`).join('') + '</div>';
    html += '<h4 class="personality-summary__subtitle">Jak z nią rozmawiać</h4>';
    html += '<ul class="personality-summary__list">' + p.howToTalk.map(t => `<li>${t}</li>`).join('') + '</ul>';
  }

  html += '</div>';
  return html;
}

function generateSummary(person) {
  if (!summaryContainer) return;
  summaryContainer.innerHTML = '';

  let relHtml = '';

  // Gate check
  if (typeof person.gateAnswer === 'number' && person.gateAnswer < 0) {
    const answerObj = GATE_QUESTION.answers.find(a => a.penalty === person.gateAnswer);
    if (answerObj) {
      relHtml += `
        <div class="summary-item" onclick="switchToSurveyAndScroll('card-gate')" style="cursor: pointer;" title="Kliknij, aby poprawić">
          <div class="summary-item__question">${GATE_QUESTION.text}</div>
          <div class="summary-item__answer">Twoja odpowiedź: ${answerObj.text}</div>
          <div class="summary-item__score">${person.gateAnswer} pkt</div>
        </div>
      `;
    }
  }

  // Regular questions check
  person.answers.forEach((pts, i) => {
    const q = SURVEY_QUESTIONS[i];
    if (!q) return;

    // Some questions might have 0 as max if they are all negative, but typically index 0 is max
    const maxPts = Math.max(...q.answers.map(a => a.points));
    if (pts < maxPts) {
      const idx = person.answerIndices?.[i];
      const answerObj = (typeof idx === 'number' && q.answers[idx]) ? q.answers[idx] : q.answers.find(a => a.points === pts);
      relHtml += `
        <div class="summary-item" onclick="switchToSurveyAndScroll('card-q${i}')" style="cursor: pointer;" title="Kliknij, aby poprawić">
          <div class="summary-item__question">${q.text}</div>
          <div class="summary-item__answer">Twoja odpowiedź: ${answerObj ? answerObj.text : '-'}</div>
          <div class="summary-item__score">${pts} / ${maxPts} pkt</div>
        </div>
      `;
    }
  });

  // Secret question check
  if (typeof person.secretCap === 'number' && person.secretCap < 3) {
    const answerObj = SECRET_QUESTION.answers.find(a => a.cap === person.secretCap);
    if (answerObj) {
      relHtml += `
        <div class="summary-item" onclick="switchToSurveyAndScroll('card-secret')" style="cursor: pointer;" title="Kliknij, aby poprawić">
          <div class="summary-item__question">${SECRET_QUESTION.text}</div>
          <div class="summary-item__answer">Twoja odpowiedź: ${answerObj.text}</div>
          <div class="summary-item__score">Limit poziomu: max ${person.secretCap}</div>
        </div>
      `;
    }
  }

  if (relHtml === '') {
    relHtml = '<div style="text-align:center; color:var(--text-muted); padding:20px;">Ta osoba uzyskała maksymalną liczbę punktów we wszystkich kategoriach!</div>';
  }

  summaryContainer.innerHTML = buildPersonalitySummaryBlock(person) + relHtml;
}

window.switchToSurveyAndScroll = function(cardId) {
  // Switch to survey mode
  const surveyModal = document.getElementById('survey-modal');
  if (surveyModal) {
    surveyModal.setAttribute('data-mode', 'survey');
  }

  // Find card and scroll
  const card = document.getElementById(cardId);
  if (card) {
    setCardCollapsed(card, false); // reveal the option list if it was collapsed
    setTimeout(() => {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.style.outline = '2px solid #ef476f';
      card.style.outlineOffset = '4px';
      card.style.borderRadius = '8px';
      card.style.transition = 'outline 0.2s';
      setTimeout(() => {
        card.style.outline = '2px solid transparent';
        card.style.outlineOffset = '0';
      }, 2000);
    }, 100); // small delay to let display:block apply
  }
}

function closeModal(fromPopState = false) {
  if (editingId) {
    surveyScrollPositions[editingId] = surveyForm.scrollTop;
  }
  surveyModal.setAttribute('aria-hidden', 'true');
  editingId = null;
  if (!fromPopState && history.state && history.state.modalOpen) {
    history.back();
  }
}

// Handle hardware back button
window.addEventListener('popstate', (e) => {
  if (personalityModal?.getAttribute('aria-hidden') === 'false') {
    closePersonalityModal(true);
  } else if (surveyModal.getAttribute('aria-hidden') === 'false') {
    closeModal(true);
  } else if (infoModal?.getAttribute('aria-hidden') === 'false') {
    closeInfoModal(true);
  } else if (!rankingView.classList.contains('hidden')) {
    toggleRankingView(true);
  } else if (statsView && !statsView.classList.contains('hidden')) {
    toggleStatsView(true);
  } else if ($('#account-modal')?.getAttribute('aria-hidden') === 'false') {
    closeAccountModal(true);
  } else if ($('#settings-modal')?.getAttribute('aria-hidden') === 'false') {
    closeSettingsModal(true);
  }
});
// Incognito toggle: hidden behind a long-press on the version label, no visible button.
if (appVersion) {
  const INCOGNITO_HOLD_MS = 650;
  let incognitoPressTimer = null;

  const startIncognitoHold = () => {
    clearTimeout(incognitoPressTimer);
    incognitoPressTimer = setTimeout(() => {
      document.body.classList.toggle('incognito-mode');
      if (navigator.vibrate) navigator.vibrate(30);
    }, INCOGNITO_HOLD_MS);
  };
  const cancelIncognitoHold = () => clearTimeout(incognitoPressTimer);

  appVersion.addEventListener('pointerdown', startIncognitoHold);
  appVersion.addEventListener('pointerup', cancelIncognitoHold);
  appVersion.addEventListener('pointerleave', cancelIncognitoHold);
  appVersion.addEventListener('pointercancel', cancelIncognitoHold);
}
function resetScorePreview() {
  if (scoreValue) scoreValue.textContent = '--';
  if (scoreLevel) {
    scoreLevel.textContent = 'Odpowiedz na wszystkie pytania';
    scoreLevel.className = 'score-preview__level';
  }
  if (scorePreview) scorePreview.style.setProperty('--score-pct', '0%');
}

// ═══════════════════════════════════════════
// FORM HANDLING
// ═══════════════════════════════════════════

function handleSubmit(e) {
  e.preventDefault();

  const name = personNameInput.value.trim();
  if (!name) return;

  // Check gate
  const gateChecked = surveyForm.querySelector('input[name="gate"]:checked');

  // Collect all answers
  const answers = [];
  const answerIndices = [];
  let totalScore = 0;
  let allAnswered = !!gateChecked;

  for (let i = 0; i < SURVEY_QUESTIONS.length; i++) {
    const checked = surveyForm.querySelector(`input[name="q${i}"]:checked`);
    if (checked) {
      const pts = parseInt(checked.value, 10);
      answers.push(pts);
      // An untouched legacy guess (tied answer, never confirmed by the user) stays
      // ambiguous rather than being saved as a false-confident index.
      answerIndices.push(checked.dataset.legacyGuess === 'true' ? null : parseInt(checked.dataset.optIndex, 10));
      totalScore += pts;
    } else {
      allAnswered = false;
      answers.push(0);
      answerIndices.push(null);
    }
  }

  // Check secret cap
  const secretChecked = surveyForm.querySelector('input[name="secret"]:checked');
  if (!secretChecked) allAnswered = false;
  const secretCap = secretChecked ? parseInt(secretChecked.value, 10) : 3;

  if (!allAnswered) {
    // Scroll to first unanswered question (gate is card[0], regular are card[1..N])
    const cards = questionsContainer.querySelectorAll('.question-card');

    if (!gateChecked) {
      if (cards[0]) {
        cards[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        cards[0].style.outline = '2px solid #ef476f';
        cards[0].style.outlineOffset = '4px';
        setTimeout(() => { cards[0].style.outline = ''; cards[0].style.outlineOffset = ''; }, 2000);
      }
      return;
    }

    for (let i = 0; i < SURVEY_QUESTIONS.length; i++) {
      const checked = surveyForm.querySelector(`input[name="q${i}"]:checked`);
      if (!checked) {
        const card = cards[i + 1]; // +1 because gate is cards[0]
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.style.outline = '2px solid #ef476f';
          card.style.outlineOffset = '4px';
          setTimeout(() => { card.style.outline = ''; card.style.outlineOffset = ''; }, 2000);
        }
        return;
      }
    }

    // Check secret question
    if (!secretChecked) {
      const secretCardEl = cards[SURVEY_QUESTIONS.length + 1]; // +1 for gate offset
      if (secretCardEl) {
        secretCardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        secretCardEl.style.outline = '2px solid #ef476f';
        secretCardEl.style.outlineOffset = '4px';
        setTimeout(() => { secretCardEl.style.outline = ''; secretCardEl.style.outlineOffset = ''; }, 2000);
      }
      return;
    }
  }

  // Apply gate penalty and clamp
  const gatePenalty = gateChecked ? parseInt(gateChecked.value, 10) : 0;
  totalScore = Math.max(0, totalScore + gatePenalty);

  const level = getLevel(totalScore);
  const cappedLevel = Math.min(level, secretCap);

  let savedPerson;
  if (editingId) {
    // Update existing
    const person = people.find(p => p.id === editingId);
    if (person) {
      person.name = name;
      person.answers = answers;
      person.answerIndices = answerIndices;
      person.gateAnswer = gatePenalty;
      person.totalScore = totalScore;
      person.gradientIndex = selectedGradientIndex;
      person.personalityType = selectedPersonalityType;
      person.personalityAnswers = selectedPersonalityAnswers;
      person.secretCap = secretCap;
      const oldLevel = person.level;
      person.level = cappedLevel;
      // Re-randomize speed if level changed
      if (oldLevel !== cappedLevel) person.speed = getSpeedByScore(person.totalScore);
      savedPerson = person;
    }
  } else {
    // Add new person
    savedPerson = {
      id: uuid(),
      name,
      answers,
      answerIndices,
      gateAnswer: gatePenalty,
      totalScore,
      level: cappedLevel,
      secretCap,
      angle: Math.random() * Math.PI * 2,
      speed: getSpeedByScore(totalScore),
      gradientIndex: selectedGradientIndex,
      personalityType: selectedPersonalityType,
      personalityAnswers: selectedPersonalityAnswers
    };
    people.push(savedPerson);
  }

  distributePlanets();
  savePeople();
  renderPlanets();
  updateEmptyState();
  if (savedPerson) queueSyncUpsert(savedPerson);
  closeModal();
}

function handleDelete(e) {
  e?.preventDefault();
  if (!editingId) return;

  const person = people.find(p => p.id === editingId);
  if (!person) return;

  if (confirm(`Czy na pewno chcesz usunąć ${person.name} z Twojej mapy?`)) {
    people = people.filter(p => p.id !== editingId);
    distributePlanets();
    savePeople();
    renderPlanets();
    updateEmptyState();
    queueSyncDelete(person.id);
    closeModal();
  }
}

// ═══════════════════════════════════════════
// EMPTY STATE
// ═══════════════════════════════════════════

function updateEmptyState() {
  if (emptyState) {
    emptyState.classList.toggle('hidden', people.length > 0);
  }
}

// ═══════════════════════════════════════════
// PLANET RENDERING
// ═══════════════════════════════════════════

function renderPlanets() {
  if (!planetsContainer || !labelsContainer) return;
  planetsContainer.innerHTML = '';
  labelsContainer.innerHTML = '';
  if (menuLayerContainer) menuLayerContainer.innerHTML = '';
  if (orbitLinesContainer) orbitLinesContainer.innerHTML = '';

  emptyState.style.display = people.length === 0 ? 'block' : 'none';

  people.forEach(person => {
    // Planet Group
    const group = document.createElement('div');
    group.className = 'planet-group';
    group.dataset.id = person.id;

    // The planet
    const planetEl = document.createElement('div');
    planetEl.className = 'planet';
    const { background: planetBg, glowBase } = getPlanetBackground(person);
    planetEl.style.background = planetBg;
    planetEl.style.setProperty('--planet-glow', `${glowBase}66`);

    // +/- indicators converted to background glow
    const { glow: customGlow, color: customGlowColor } = getPlanetGlowStyle(person);
    
    person.orbitLineColor = customGlowColor;

    if (customGlow) {
      planetEl.style.setProperty('--custom-glow', customGlow);
    }

    // Click to select planet
    group.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlanetMenu(person.id);
    });

    group.appendChild(planetEl);
    planetsContainer.appendChild(group);

    // Planet Menu — rendered on its own top layer (above the name labels) so it's
    // never covered, positioned in sync with the planet via the same orbit transform.
    const menuGroup = document.createElement('div');
    menuGroup.className = 'menu-group';
    menuGroup.dataset.id = person.id;

    const menu = document.createElement('div');
    menu.className = 'planet-menu';
    menu.innerHTML = `
      <div class="planet-menu-item action-color" data-action="color" data-tooltip="Wygląd planety" aria-label="Edycja wyglądu planety">
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 21a9 8 0 1 1 8-9c0 2-1.2 3-3 3h-1.3c-.7 0-1.2.6-1.2 1.2 0 .3.1.5.3.8.2.3.3.6.3 1 0 1.1-.9 2-2.1 2-.4 0-.7-.1-1-.3"/>
          <circle cx="7.5" cy="10.5" r="1.1"/>
          <circle cx="10" cy="7" r="1.1"/>
          <circle cx="15" cy="8" r="1.1"/>
        </svg>
      </div>
      <div class="planet-menu-item action-survey" data-action="survey" data-tooltip="Edycja ankiety" aria-label="Edycja ankiety">
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="6" y="4" width="12" height="17" rx="2"/>
          <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
      </div>
      <div class="planet-menu-item action-summary" data-action="summary" data-tooltip="Podsumowanie" aria-label="Podsumowanie">
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <line x1="6" y1="20" x2="6" y2="14"/>
          <line x1="12" y1="20" x2="12" y2="8"/>
          <line x1="18" y1="20" x2="18" y2="11"/>
        </svg>
      </div>
    `;

    menu.querySelectorAll('.planet-menu-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        handlePlanetAction(person.id, btn.dataset.action);
      });

      // Touch devices: press-and-hold reveals the caption instead of hover
      let tooltipTimer = null;
      let longPressShown = false;
      btn.addEventListener('touchstart', () => {
        longPressShown = false;
        tooltipTimer = setTimeout(() => {
          btn.classList.add('show-tooltip');
          longPressShown = true;
        }, 450);
      }, { passive: true });
      const clearTooltipHold = (e) => {
        clearTimeout(tooltipTimer);
        if (longPressShown) {
          e.preventDefault();
          setTimeout(() => btn.classList.remove('show-tooltip'), 1000);
          longPressShown = false;
        }
      };
      btn.addEventListener('touchend', clearTooltipHold);
      btn.addEventListener('touchcancel', clearTooltipHold);
    });

    menuGroup.appendChild(menu);
    if (menuLayerContainer) menuLayerContainer.appendChild(menuGroup);

    // Label Group
    const labelGroup = document.createElement('div');
    labelGroup.className = 'label-group';
    labelGroup.dataset.id = person.id;

    // Name label
    const label = document.createElement('div');
    label.className = 'planet-label';
    // Built as nodes rather than interpolated HTML: the name is user-supplied and,
    // once names sync through a server, an injected string would become stored XSS
    // affecting whoever views it.
    const nameParts = (person.name || '').trim().split(' ');
    const firstName = document.createElement('strong');
    firstName.textContent = nameParts[0];
    label.appendChild(firstName);
    if (nameParts.length > 1) {
      label.appendChild(document.createElement('br'));
      label.appendChild(document.createTextNode(nameParts.slice(1).join(' ')));
    }

    // Score indicator
    const scoreBadge = document.createElement('div');
    scoreBadge.className = 'planet-score';
    scoreBadge.textContent = `${person.totalScore}`;

    labelGroup.appendChild(label);
    labelGroup.appendChild(scoreBadge);
    labelsContainer.appendChild(labelGroup);
  });

  // Draw individual orbit lines
  if (orbitLinesContainer) {
    [3, 2, 1, 0].forEach(level => {
      const band = dynamicLayout[level];
      if (!band) return;
      
      band.orbits.forEach(orbit => {
        const line = document.createElement('div');
        line.className = `orbit-line orbit-line--${level}`;
        line.style.width = `${orbit.radius * 2}px`;
        line.style.height = `${orbit.radius * 2}px`;
        
        // Find planet to get its line color
        const planetWithScore = people.find(p => p.totalScore === orbit.score);
        if (planetWithScore && planetWithScore.orbitLineColor) {
          line.style.borderColor = planetWithScore.orbitLineColor;
          line.style.opacity = '0.6';
        } else {
          line.style.borderColor = 'rgba(255, 255, 255, 0.15)';
          line.style.opacity = '1';
        }

        orbitLinesContainer.appendChild(line);
      });
    });
  }
}

// ═══════════════════════════════════════════
// PLANET INTERACTION & MENU
// ═══════════════════════════════════════════

function togglePlanetMenu(id) {
  if (selectedPlanetId === id) {
    closePlanetMenu();
    return;
  }
  
  // Save state before centering if not already saved
  if (!preSelectMapState) {
    preSelectMapState = { x: mapPanX, y: mapPanY, scale: mapScale };
  }
  
  closePlanetMenu(false); // Pass false so it doesn't restore camera yet
  
  selectedPlanetId = id;
  const group = planetsContainer?.querySelector(`.planet-group[data-id="${id}"]`);
  if (group) {
    group.classList.add('is-active');
  }
  const menuGroup = menuLayerContainer?.querySelector(`.menu-group[data-id="${id}"]`);
  if (menuGroup) {
    menuGroup.classList.add('is-active');
  }

  centerCameraOnPlanet(id);
}

function closePlanetMenu(restoreCamera = true) {
  if (selectedPlanetId) {
    const group = planetsContainer?.querySelector(`.planet-group[data-id="${selectedPlanetId}"]`);
    if (group) {
      group.classList.remove('is-active');
    }
    const menuGroup = menuLayerContainer?.querySelector(`.menu-group[data-id="${selectedPlanetId}"]`);
    if (menuGroup) {
      menuGroup.classList.remove('is-active');
    }
    selectedPlanetId = null;
    
    // Restore camera
    if (restoreCamera && preSelectMapState) {
      mapPanX = preSelectMapState.x;
      mapPanY = preSelectMapState.y;
      mapScale = preSelectMapState.scale;
      preSelectMapState = null;
      
      const viewport = document.getElementById('map-viewport');
      if (viewport) {
        viewport.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        applyMapTransform();
        setTimeout(() => {
          if (viewport) viewport.style.transition = '';
        }, 500);
      }
    }
  }
}

function centerCameraOnPlanet(id) {
  const person = people.find(p => p.id === id);
  if (!person) return;

  const radius = person.orbitRadius || 100;
  const x = Math.cos(person.angle) * radius;
  const y = Math.sin(person.angle) * radius;

  // Center on planet
  if (mapScale < 1.5) mapScale = 1.5;
  mapPanX = -x * mapScale;
  mapPanY = -y * mapScale;

  const viewport = document.getElementById('map-viewport');
  if (viewport) {
    viewport.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
    applyMapTransform();
    
    // Remove transition after animation ends
    setTimeout(() => {
      if (viewport) viewport.style.transition = '';
    }, 500);
  }
}

function handlePlanetAction(id, action) {
  closePlanetMenu();
  openEditModal(id, action);
}

// ═══════════════════════════════════════════
// LEVEL ZONE RENDERING (orbit rings)
// ═══════════════════════════════════════════
//
// One fixed look — settled on after trying a user-tunable mode/opacity and
// finding this was preferred over every alternative: soft-edged (blurred)
// rings at 10% opacity (i.e. "90% transparent"). The only thing left
// user-controlled is whether these render at all — see showLevelColors.

const LEVEL_RGB = { 1: '239, 68, 68', 2: '245, 158, 11', 3: '34, 197, 94' };
const LEVEL_FIXED_OPACITY = 0.10;
// Feather radius, in px — enough to visibly melt one ring's edge into the
// next, scaled against typical ring sizes (tens to hundreds of px).
const LEVEL_BLUR_PX = 26;

function applyLevelRingStyle(ring, level) {
  if (!ring) return;
  if (level === 0 || !showLevelColors) {
    ring.style.background = '';
    ring.style.filter = '';
    if (level !== 0) ring.style.display = 'none';
    return;
  }
  ring.style.background = `rgba(${LEVEL_RGB[level]}, ${LEVEL_FIXED_OPACITY})`;
  ring.style.filter = `blur(${LEVEL_BLUR_PX}px)`;
}

// ═══════════════════════════════════════════
// ORBITAL ANIMATION
// ═══════════════════════════════════════════

function startAnimation() {
  lastTimestamp = performance.now();

  function animate(timestamp) {
    const dt = (timestamp - lastTimestamp) / 1000; // delta in seconds
    lastTimestamp = timestamp;

    // Don't process huge delta (e.g. tab was backgrounded)
    const safeDt = Math.min(dt, 0.1);

    const groups = planetsContainer?.querySelectorAll('.planet-group');
    if (groups) {
      groups.forEach(group => {
        const person = people.find(p => p.id === group.dataset.id);
        if (!person) return;

        // Advance angle only if no planet menu is open
        if (!selectedPlanetId) {
          person.angle += person.speed * safeDt;
          if (person.angle > Math.PI * 2) person.angle -= Math.PI * 2;
        }

        const radius = person.orbitRadius || 100;
        const x = Math.cos(person.angle) * radius;
        const y = Math.sin(person.angle) * radius;

        group.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;

        const labelGroup = labelsContainer.querySelector(`.label-group[data-id="${person.id}"]`);
        if (labelGroup) {
          labelGroup.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        }

        const menuGroup = menuLayerContainer?.querySelector(`.menu-group[data-id="${person.id}"]`);
        if (menuGroup) {
          menuGroup.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        }
      });

      // Draw orbital rings dynamically based on dynamicLayout
      [3, 2, 1, 0].forEach(level => {
        const ring = document.querySelector(`.orbit-ring[data-level="${level}"]`);
        const label = document.querySelector(`.level-label--${level}`);
        const band = dynamicLayout[level];

        if (!band) {
          // No planets on this level — hide ring and label
          if (ring) { ring.style.display = 'none'; }
          if (label) { label.style.display = 'none'; }
          return;
        }

        const r = band.outerR;
        if (ring) {
          ring.style.display = '';
          ring.style.width = `${r * 2}px`;
          ring.style.height = `${r * 2}px`;
          applyLevelRingStyle(ring, level);
        }

        if (label) {
          label.style.display = showLevelColors ? '' : 'none';
          label.style.top = `calc(50% - ${r}px)`;
          label.style.left = '50%';
          label.style.right = 'auto';
          label.style.transform = 'translate(-50%, -100%)';
        }
      });
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animationFrameId = requestAnimationFrame(animate);
}

// ═══════════════════════════════════════════
// RANKING VIEW
// ═══════════════════════════════════════════

function openPersonFromRanking(id) {
  toggleRankingView(true);
  requestAnimationFrame(() => openEditModal(id));
}

function toggleRankingView(forceClose = false) {
  const isHidden = rankingView.classList.contains('hidden');

  if (forceClose || !isHidden) {
    rankingView.classList.add('hidden');
    solarSystem.style.display = 'flex';
    labelsContainer.style.display = '';
    emptyState.style.display = people.length === 0 ? 'block' : 'none';
  } else {
    if (statsView && !statsView.classList.contains('hidden')) toggleStatsView(true);
    rankingView.classList.remove('hidden');
    solarSystem.style.display = 'none';
    labelsContainer.style.display = 'none';
    emptyState.style.display = 'none';
    renderRanking();
  }
  updateFullscreenViewBodyClass();
}

// A fullscreen view (ranking/stats) hides the icon menu in its favor — see
// #icon-menu's body.fullscreen-view-open rule.
function updateFullscreenViewBodyClass() {
  const anyOpen = !rankingView.classList.contains('hidden') || !(statsView?.classList.contains('hidden') ?? true);
  document.body.classList.toggle('fullscreen-view-open', anyOpen);
}

function renderRanking() {
  rankingList.innerHTML = '';
  
  // Sort descending by score
  const sortedPeople = [...people].sort((a, b) => b.totalScore - a.totalScore);
  
  if (sortedPeople.length === 0) {
    rankingList.innerHTML = '<div style="text-align: center; color: var(--text-muted); margin-top: 40px;">Brak osób w rankingu.</div>';
    return;
  }
  
  sortedPeople.forEach(person => {
    const item = document.createElement('div');
    item.className = 'ranking-item';
    
    // Planet colors (manual or personality-derived)
    const { background: avatarBg } = getPlanetBackground(person);

    // Initials
    const initials = (person.name || '').substring(0, 2).toUpperCase();
    
    // Level name
    let levelName = 'Poza orbitami';
    let levelColor = '#9ba1a6';
    if (person.level === 3) { levelName = 'Poziom 3'; levelColor = 'var(--level-3-color)'; }
    else if (person.level === 2) { levelName = 'Poziom 2'; levelColor = 'var(--level-2-color)'; }
    else if (person.level === 1) { levelName = 'Poziom 1'; levelColor = 'var(--level-1-color)'; }
    
    // Apply glow if any
    const { glow: customGlow } = getPlanetGlowStyle(person);
    if (customGlow) {
      item.style.boxShadow = customGlow;
      // Optional: slight border to match the glow aesthetic
      // item.style.border = '1px solid rgba(255, 255, 255, 0.1)';
    }
    
    // Same reasoning as the planet label: person.name is user-supplied, so it is
    // set as text rather than interpolated into markup.
    const avatarEl = document.createElement('div');
    avatarEl.className = 'ranking-avatar';
    avatarEl.style.background = avatarBg;

    const infoEl = document.createElement('div');
    infoEl.className = 'ranking-info';

    const nameEl = document.createElement('div');
    nameEl.className = 'ranking-name';
    nameEl.textContent = person.name;

    const pointsEl = document.createElement('div');
    pointsEl.className = 'ranking-points';
    pointsEl.style.color = levelColor;
    pointsEl.style.fontWeight = '600';
    pointsEl.textContent = levelName;

    infoEl.appendChild(nameEl);
    infoEl.appendChild(pointsEl);

    const scoreEl = document.createElement('div');
    scoreEl.className = 'ranking-score';
    scoreEl.textContent = `${person.totalScore} `;
    const unitEl = document.createElement('span');
    unitEl.style.cssText = 'font-size:12px; font-weight:400; color:var(--text-muted);';
    unitEl.textContent = 'pkt';
    scoreEl.appendChild(unitEl);

    item.appendChild(avatarEl);
    item.appendChild(infoEl);
    item.appendChild(scoreEl);

    item.setAttribute('role', 'button');
    item.tabIndex = 0;

    const openFromRanking = () => openPersonFromRanking(person.id);

    item.addEventListener('click', openFromRanking);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openFromRanking();
      }
    });
    
    rankingList.appendChild(item);
  });
}

btnToggleView.addEventListener('click', () => toggleRankingView());

// ═══════════════════════════════════════════
// STATS VIEW
// ═══════════════════════════════════════════

function getQuestionAnswerGroups(qIndex) {
  const q = SURVEY_QUESTIONS[qIndex];
  const groups = q.answers.map(() => []);

  people.forEach(person => {
    const idx = person.answerIndices ? person.answerIndices[qIndex] : null;
    if (typeof idx === 'number' && q.answers[idx]) {
      groups[idx].push(person);
      return;
    }
    // Legacy entries saved before answer indices existed: best-effort match by points.
    // Ties (two answers sharing the same points) resolve to the first matching option.
    const pts = person.answers ? person.answers[qIndex] : undefined;
    if (typeof pts !== 'number') return;
    const matchIdx = q.answers.findIndex(a => a.points === pts);
    if (matchIdx !== -1) groups[matchIdx].push(person);
  });

  return groups;
}

function renderStats() {
  if (!statsList) return;
  statsList.innerHTML = '';

  if (people.length === 0) {
    statsList.innerHTML = '<div style="text-align: center; color: var(--text-muted); margin-top: 40px;">Dodaj przynajmniej jedną osobę, aby zobaczyć statystyki.</div>';
    return;
  }

  SURVEY_QUESTIONS.forEach((q, qIndex) => {
    const groups = getQuestionAnswerGroups(qIndex);
    const total = groups.reduce((sum, g) => sum + g.length, 0);

    const card = document.createElement('div');
    card.className = 'stats-question';

    const title = document.createElement('h3');
    title.className = 'stats-question__title';
    title.textContent = `${qIndex + 2}. ${q.text}`;
    card.appendChild(title);

    q.answers.forEach((answer, aIndex) => {
      const answerPeople = groups[aIndex];
      const count = answerPeople.length;
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;

      const row = document.createElement('div');
      row.className = 'stats-answer-row';

      const textEl = document.createElement('div');
      textEl.className = 'stats-answer-row__text';
      textEl.textContent = answer.text;
      row.appendChild(textEl);

      const trackEl = document.createElement('div');
      trackEl.className = 'stats-bar-track';
      const fillEl = document.createElement('div');
      fillEl.className = 'stats-bar-fill';
      fillEl.style.width = `${pct}%`;
      trackEl.appendChild(fillEl);
      row.appendChild(trackEl);

      const countEl = document.createElement('div');
      countEl.className = 'stats-answer-row__count';
      countEl.textContent = `${count} `;
      const pctEl = document.createElement('span');
      pctEl.className = 'stats-answer-row__pct';
      pctEl.textContent = `(${pct}%)`;
      countEl.appendChild(pctEl);
      row.appendChild(countEl);

      if (count > 0) {
        const peopleEl = document.createElement('div');
        peopleEl.className = 'stats-people';
        answerPeople.forEach(person => {
          const { background: chipBg, glowBase: chipGlowBase } = getPlanetBackground(person);
          const chip = document.createElement('div');
          chip.className = 'stats-person-chip';
          chip.dataset.personId = person.id;
          chip.dataset.qIndex = qIndex;
          chip.setAttribute('role', 'button');
          chip.tabIndex = 0;
          chip.title = 'Kliknij, aby poprawić tę odpowiedź';

          const nameEl = document.createElement('span');
          nameEl.className = 'stats-person-chip__name';
          nameEl.textContent = person.name;
          chip.appendChild(nameEl);

          const planetEl = document.createElement('span');
          planetEl.className = 'stats-person-chip__planet';
          planetEl.style.background = chipBg;
          planetEl.style.setProperty('--planet-glow', `${chipGlowBase}66`);
          const { glow: customGlow } = getPlanetGlowStyle(person);
          if (customGlow) planetEl.style.setProperty('--custom-glow', customGlow);
          planetEl.textContent = `${person.totalScore}`;
          chip.appendChild(planetEl);

          peopleEl.appendChild(chip);
        });
        row.appendChild(peopleEl);
      }

      card.appendChild(row);
    });

    statsList.appendChild(card);
  });
}

window.openPersonFromStats = function(id, qIndex) {
  toggleStatsView(true);
  requestAnimationFrame(() => {
    openEditModal(id);
    switchToSurveyAndScroll(`card-q${qIndex}`);
  });
};

if (statsList) {
  const handlePersonChipActivate = (e) => {
    const chip = e.target.closest('.stats-person-chip');
    if (!chip) return;
    openPersonFromStats(chip.dataset.personId, parseInt(chip.dataset.qIndex, 10));
  };
  statsList.addEventListener('click', handlePersonChipActivate);
  statsList.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const chip = e.target.closest('.stats-person-chip');
      if (!chip) return;
      e.preventDefault();
      handlePersonChipActivate(e);
    }
  });
}

function toggleStatsView(forceClose = false) {
  if (!statsView) return;
  const isHidden = statsView.classList.contains('hidden');

  if (forceClose || !isHidden) {
    statsView.classList.add('hidden');
    solarSystem.style.display = 'flex';
    labelsContainer.style.display = '';
    emptyState.style.display = people.length === 0 ? 'block' : 'none';
  } else {
    if (!rankingView.classList.contains('hidden')) toggleRankingView(true);
    statsView.classList.remove('hidden');
    solarSystem.style.display = 'none';
    labelsContainer.style.display = 'none';
    emptyState.style.display = 'none';
    renderStats();
  }
  updateFullscreenViewBodyClass();
}

if (btnStats) btnStats.addEventListener('click', () => toggleStatsView());
$('#btn-close-ranking')?.addEventListener('click', () => toggleRankingView(true));
$('#btn-close-stats')?.addEventListener('click', () => toggleStatsView(true));

// ═══════════════════════════════════════════
// MAP NAVIGATION (Pan / Zoom / Tilt)
// ═══════════════════════════════════════════

function applyMapTransform() {
  const viewport = document.getElementById('map-viewport');
  if (!viewport) return;
  viewport.style.transform =
    `translate(${mapPanX}px, ${mapPanY}px) scale(${mapScale}) rotateX(${mapTiltX}deg)`;
}

function setupMapNavigation() {
  const viewport = document.getElementById('map-viewport');
  if (!viewport) return;

  // Apply initial transform
  applyMapTransform();

  const isInteractiveBlocked = () => {
    const ranking = document.getElementById('ranking-view');
    const stats = document.getElementById('stats-view');
    const survey = document.getElementById('survey-modal');
    const info = document.getElementById('info-modal');
    const account = document.getElementById('account-modal');
    const settings = document.getElementById('settings-modal');
    const personality = document.getElementById('personality-modal');
    if (ranking && !ranking.classList.contains('hidden')) return true;
    if (stats && !stats.classList.contains('hidden')) return true;
    if (survey && survey.getAttribute('aria-hidden') === 'false') return true;
    if (info && info.getAttribute('aria-hidden') === 'false') return true;
    if (account && account.getAttribute('aria-hidden') === 'false') return true;
    if (settings && settings.getAttribute('aria-hidden') === 'false') return true;
    if (personality && personality.getAttribute('aria-hidden') === 'false') return true;
    return false;
  };

  // ── Mouse wheel zoom ──
  document.addEventListener('wheel', (e) => {
    if (isInteractiveBlocked()) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.92 : 1.08;
    mapScale = Math.max(MAP_SCALE_MIN, Math.min(MAP_SCALE_MAX, mapScale * delta));
    applyMapTransform();
  }, { passive: false });

  // ── Mouse drag pan (left button) ──
  document.addEventListener('mousedown', (e) => {
    if (isInteractiveBlocked()) return;
    if (e.button !== 0) return;
    // Don't pan if clicking on interactive elements
    if (e.target.closest('.planet-group') || e.target.closest('#fab-add') || e.target.closest('.btn-top') || e.target.closest('#app-version')) return;
    isPanning = true;
    panStartX = e.clientX;
    panStartY = e.clientY;
    panStartMapX = mapPanX;
    panStartMapY = mapPanY;
    viewport.style.cursor = 'grabbing';
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isPanning) return;
    mapPanX = panStartMapX + (e.clientX - panStartX);
    mapPanY = panStartMapY + (e.clientY - panStartY);
    applyMapTransform();
  });

  window.addEventListener('mouseup', () => {
    if (isPanning) {
      isPanning = false;
      const vp = document.getElementById('map-viewport');
      if (vp) vp.style.cursor = '';
    }
  });

  // ── Touch: pan (1 finger) + pinch zoom (2 fingers) ──
  let touchStartTime = 0;
  let touchMoved = false;

  document.addEventListener('touchstart', (e) => {
    if (isInteractiveBlocked()) return;
    if (e.target.closest('.planet-group') || e.target.closest('#fab-add') || e.target.closest('.btn-toggle-view') || e.target.closest('.btn-top') || e.target.closest('#app-version')) return;

    if (e.touches.length === 1) {
      isPanning = true;
      pinchActive = false;
      panStartX = e.touches[0].clientX;
      panStartY = e.touches[0].clientY;
      panStartMapX = mapPanX;
      panStartMapY = mapPanY;
      touchStartTime = Date.now();
      touchMoved = false;
    } else if (e.touches.length === 2) {
      isPanning = false;
      pinchActive = true;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchDist = Math.sqrt(dx * dx + dy * dy);
    }
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (isInteractiveBlocked()) return;
    if (e.target.closest('.planet-group')) return;

    if (isPanning && e.touches.length === 1) {
      const dx = e.touches[0].clientX - panStartX;
      const dy = e.touches[0].clientY - panStartY;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) touchMoved = true;
      mapPanX = panStartMapX + dx;
      mapPanY = panStartMapY + dy;
      applyMapTransform();
      e.preventDefault();
    } else if (pinchActive && e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (lastPinchDist > 0) {
        const scaleDelta = dist / lastPinchDist;
        mapScale = Math.max(MAP_SCALE_MIN, Math.min(MAP_SCALE_MAX, mapScale * scaleDelta));
        applyMapTransform();
      }
      lastPinchDist = dist;
      e.preventDefault();
    }
  }, { passive: false });

  document.addEventListener('touchend', (e) => {
    if (e.touches.length < 2) pinchActive = false;
    if (e.touches.length === 0) {
      isPanning = false;
      // If it was a quick tap without dragging, let click events pass through
    }
  }, { passive: true });

  // ── Tilt with right-click drag (desktop) ──
  document.addEventListener('contextmenu', (e) => {
    if (!isInteractiveBlocked()) e.preventDefault();
  });

  let isTilting = false;
  let tiltStartY = 0;
  let tiltStartVal = 0;

  document.addEventListener('mousedown', (e) => {
    if (isInteractiveBlocked()) return;
    if (e.button === 2) { // right click
      isTilting = true;
      tiltStartY = e.clientY;
      tiltStartVal = mapTiltX;
      e.preventDefault();
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (!isTilting) return;
    const dy = e.clientY - tiltStartY;
    mapTiltX = Math.max(0, Math.min(60, tiltStartVal + dy * 0.3));
    applyMapTransform();
  });

  window.addEventListener('mouseup', (e) => {
    if (e.button === 2) isTilting = false;
  });
}

// ═══════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
