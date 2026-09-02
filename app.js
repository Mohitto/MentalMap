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

const STORAGE_KEY = 'mentalmap_people';
const CORRUPT_BACKUP_KEY = 'mentalmap_people_corrupt_backup';
const UNDO_IMPORT_KEY = 'mentalmap_people_pre_import';
const APP_VERSION = 'v0.9.74';
const ASSET_VERSION = APP_VERSION.slice(1); // 'v0.9.74' -> '0.9.74', matches the ?v= convention used elsewhere

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

// ═══════════════════════════════════════════
// DOM REFERENCES
// ═══════════════════════════════════════════

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const solarSystem = $('#solar-system');
const orbitLinesContainer = $('#orbit-lines-container');
const planetsContainer = $('#planets-container');
const labelsContainer = $('#labels-container');
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

// ═══════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════

let people = [];
let editingId = null;
let selectedPlanetId = null; // Currently selected planet (menu open)
let preSelectMapState = null; // Store map state before zooming to planet
let selectedGradientIndex = 0;

function updateColorPickerSelection(index) {
  selectedGradientIndex = index;
  document.querySelectorAll('.color-swatch').forEach(s => {
    s.classList.toggle('selected', parseInt(s.dataset.index) === index);
  });
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
  bindBackupEvents();
  bindAccountEvents();
  setAppVersion();
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
      const swatch = document.createElement('div');
      swatch.className = 'color-swatch';
      swatch.style.background = `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`;
      swatch.dataset.index = index;
      swatch.addEventListener('click', () => updateColorPickerSelection(index));
      picker.appendChild(swatch);
    });
  }

  // ── Gate question (rendered first, stored separately) ──
  const gateCard = document.createElement('div');
  gateCard.className = 'question-card';

  gateCard.id = 'card-gate';

  const gateTitle = document.createElement('h3');
  gateTitle.textContent = `1. ${GATE_QUESTION.text}`;
  gateCard.appendChild(gateTitle);

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
    radio.addEventListener('change', updateScorePreview);

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

    const title = document.createElement('h3');
    title.textContent = `${qIndex + 2}. ${q.text}`;
    card.appendChild(title);

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

  const secretTitle = document.createElement('h3');
  secretTitle.textContent = `${SURVEY_QUESTIONS.length + 2}. ${SECRET_QUESTION.text}`;
  secretCard.appendChild(secretTitle);

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
    radio.addEventListener('change', updateScorePreview);

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

// Visually reorders the regular question cards (via CSS `order`, not DOM position)
// so the weakest answers (lowest points) show up first — the lower the answer,
// the higher its priority to appear at the top. Gate/secret cards keep their
// fixed spot at the very start/end. DOM order stays untouched on purpose —
// handleSubmit() and updateScorePreview() rely on SURVEY_QUESTIONS index order
// when walking `.question-card` elements.
function reorderQuestionsByCompletion(person) {
  if (!questionsContainer) return;
  const gateCard = document.getElementById('card-gate');
  const secretCard = document.getElementById('card-secret');
  if (gateCard) gateCard.style.order = '-1000';
  if (secretCard) secretCard.style.order = '1000';

  SURVEY_QUESTIONS.forEach((q, i) => {
    const card = document.getElementById(`card-q${i}`);
    if (!card) return;
    card.style.order = String(person.answers?.[i] ?? 0);
  });
}

// Restores the natural question order (used when starting a fresh survey).
function resetQuestionOrder() {
  if (!questionsContainer) return;
  questionsContainer.querySelectorAll('.question-card').forEach(card => {
    card.style.order = '';
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
// Shared by loadPeople(), applyImport(), and cloud-decrypt (ACCOUNT / CLOUD SYNC).
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
      p.gradientIndex = Math.floor(Math.random() * PLANET_GRADIENTS.length);
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
      .sort((a, b) => b.totalScore - a.totalScore || a.name.localeCompare(b.name, 'pl'))
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
      alert('Nie udało się zapisać danych w tej przeglądarce (brak miejsca lub zapis zablokowany).\n\nZrób kopię zapasową przyciskiem pobierania, zanim zamkniesz aplikację — inaczej ostatnie zmiany przepadną.');
    }
  }
}

// ═══════════════════════════════════════════
// BACKUP / RESTORE
// ═══════════════════════════════════════════

const BACKUP_FORMAT = 'mentalmap-backup';
const BACKUP_FORMAT_VERSION = 1;

// Which answer slots were padded with zeros by the 11->16 migration rather than
// actually answered. A padded 0 is indistinguishable from a real 0-point answer,
// and for some questions the first 0-point option is a harshly negative judgement
// the user never made — so mark them rather than exporting them as real answers.
function derivePaddedIndices(person) {
  if (!person._migrated16) return [];
  const padded = [];
  for (let i = 11; i < 16; i++) {
    if (!person.answerIndices || person.answerIndices[i] === null || person.answerIndices[i] === undefined) {
      padded.push(i);
    }
  }
  return padded;
}

function buildBackupPayload() {
  // Read the raw string, NOT JSON.stringify(people): by the time this runs,
  // loadPeople() has rewritten answers/totalScore/level and distributePlanets()
  // has overwritten angle/orbitRadius/speed. The raw string is the only record
  // of what was actually on disk before this session touched it.
  let raw = null;
  let corrupt = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
    corrupt = localStorage.getItem(CORRUPT_BACKUP_KEY);
  } catch (_) { /* storage unavailable; fall back to the in-memory array below */ }

  return {
    format: BACKUP_FORMAT,
    version: BACKUP_FORMAT_VERSION,
    appVersion: APP_VERSION,
    exportedAt: new Date().toISOString(),
    peopleCount: people.length,
    raw,
    corruptBackup: corrupt,
    people: people.map(p => ({
      id: p.id,
      name: p.name,
      answers: p.answers,
      answerIndices: p.answerIndices || null,
      gateAnswer: p.gateAnswer,
      gateAnswerPresent: typeof p.gateAnswer === 'number',
      secretCap: p.secretCap,
      gradientIndex: p.gradientIndex,
      paddedIndices: derivePaddedIndices(p),
      legacyMigrated12: !!p._migrated,
      legacyMigrated16: !!p._migrated16
    }))
  };
}

function backupFilename() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `mentalmap-kopia-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.json`;
}

function showBackupStatus(message, kind = 'info') {
  const el = $('#backup-status');
  if (!el) return;
  el.textContent = message;
  el.className = `backup-status backup-status--${kind}`;
  el.hidden = false;
}

function exportData() {
  const json = JSON.stringify(buildBackupPayload(), null, 2);

  // Always populate the textarea. The Android wrapper installs no DownloadListener,
  // so a Blob download there is a silent no-op — the visible text is the fallback
  // that keeps the export honest on every platform.
  const ta = $('#export-output');
  if (ta) {
    ta.value = json;
    const wrap = $('#export-output-wrap');
    if (wrap) wrap.hidden = false;
  }

  try {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = backupFilename();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showBackupStatus('Kopia pobrana. Jeśli nie widzisz pliku, skopiuj tekst poniżej i zapisz go samodzielnie.', 'ok');
  } catch (e) {
    console.error('Export download failed:', e);
    showBackupStatus('Nie udało się pobrać pliku. Skopiuj tekst poniżej i zapisz go samodzielnie.', 'warn');
  }
}

async function copyExportToClipboard() {
  const ta = $('#export-output');
  if (!ta || !ta.value) {
    showBackupStatus('Najpierw kliknij "Pobierz kopię danych".', 'warn');
    return;
  }
  try {
    await navigator.clipboard.writeText(ta.value);
    showBackupStatus('Skopiowano do schowka. Wklej do notatnika i zapisz.', 'ok');
  } catch (_) {
    ta.select();
    showBackupStatus('Zaznaczono tekst — skopiuj go ręcznie (Ctrl+C / przytrzymaj i wybierz Kopiuj).', 'warn');
  }
}

// Accepts our own backup envelope, a bare array, or the raw localStorage string.
// Be liberal here: a rejected import means a tester is stuck holding a file they
// cannot restore.
function parseBackupFile(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error('To nie jest poprawny plik JSON.');
  }

  let candidates = null;
  if (Array.isArray(data)) {
    candidates = data;
  } else if (data && Array.isArray(data.people)) {
    candidates = data.people;
  } else if (data && typeof data.raw === 'string') {
    try {
      const parsed = JSON.parse(data.raw);
      if (Array.isArray(parsed)) candidates = parsed;
    } catch (_) { /* fall through to the error below */ }
  }

  if (!candidates) throw new Error('Nie znalazłem listy osób w tym pliku.');

  const valid = candidates.filter(p => p && typeof p === 'object' && typeof p.name === 'string' && Array.isArray(p.answers));
  if (valid.length === 0) throw new Error('Plik nie zawiera żadnych czytelnych osób.');

  return { entries: valid, skipped: candidates.length - valid.length };
}

// Rebuild a person into the shape the app expects. Derived fields are omitted on
// purpose — loadPeople() and distributePlanets() recompute them.
function normalizeImportedPerson(p) {
  const answers = Array.isArray(p.answers) ? p.answers.slice(0, 16).map(n => (typeof n === 'number' ? n : 0)) : [];
  while (answers.length < 16) answers.push(0);

  let answerIndices = Array.isArray(p.answerIndices) ? p.answerIndices.slice(0, 16) : new Array(16).fill(null);
  while (answerIndices.length < 16) answerIndices.push(null);
  answerIndices = answerIndices.map(v => (typeof v === 'number' ? v : null));

  // Never resurrect migration padding as a real answer.
  if (Array.isArray(p.paddedIndices)) {
    p.paddedIndices.forEach(i => { if (i >= 0 && i < 16) answerIndices[i] = null; });
  }

  return {
    id: typeof p.id === 'string' && p.id ? p.id : uuid(),
    name: String(p.name),
    answers,
    answerIndices,
    gateAnswer: typeof p.gateAnswer === 'number' ? p.gateAnswer : 0,
    totalScore: 0,
    level: 1,
    secretCap: typeof p.secretCap === 'number' ? p.secretCap : 3,
    angle: Math.random() * Math.PI * 2,
    speed: 0.1,
    gradientIndex: typeof p.gradientIndex === 'number' ? p.gradientIndex : Math.floor(Math.random() * PLANET_GRADIENTS.length),
    _migrated: !!p.legacyMigrated12 || !!p._migrated,
    _migrated16: !!p.legacyMigrated16 || !!p._migrated16
  };
}

let pendingImport = null;

function applyImport(mode) {
  if (!pendingImport) return;

  // Snapshot before touching anything, so a wrong choice is recoverable.
  try {
    localStorage.setItem(UNDO_IMPORT_KEY, JSON.stringify(people));
  } catch (_) { /* non-fatal: the import itself is still safe to attempt */ }

  const incoming = pendingImport.entries.map(normalizeImportedPerson);

  if (mode === 'replace') {
    people = incoming;
  } else {
    // Upsert by id so re-importing the same file is idempotent rather than
    // duplicating everyone.
    const byId = new Map(people.map(p => [p.id, p]));
    incoming.forEach(p => byId.set(p.id, p));
    people = Array.from(byId.values());
  }

  // Recompute everything derived, exactly as a normal load would.
  people.forEach(recomputeDerived);

  distributePlanets();
  savePeople();
  renderPlanets();
  updateEmptyState();
  refreshBackupModal();
  queueSyncUpsertAll(incoming);

  showBackupStatus(`Wczytano ${incoming.length} os${incoming.length === 1 ? 'obę' : 'ób'}. Łącznie masz teraz ${people.length}.`, 'ok');
  pendingImport = null;
  const preview = $('#import-preview');
  if (preview) preview.hidden = true;
}

function undoImport() {
  let snapshot;
  try {
    snapshot = localStorage.getItem(UNDO_IMPORT_KEY);
  } catch (_) { snapshot = null; }
  if (!snapshot) return;

  try {
    people = JSON.parse(snapshot);
  } catch (e) {
    showBackupStatus('Nie udało się odtworzyć poprzedniego stanu.', 'warn');
    return;
  }

  try { localStorage.removeItem(UNDO_IMPORT_KEY); } catch (_) { /* cosmetic only */ }

  distributePlanets();
  savePeople();
  renderPlanets();
  updateEmptyState();
  refreshBackupModal();
  queueSyncUpsertAll(people);
  showBackupStatus('Cofnięto import — przywrócono poprzedni stan.', 'ok');
}

function refreshBackupModal() {
  const countEl = $('#backup-count');
  if (countEl) countEl.textContent = String(people.length);

  const undoWrap = $('#undo-wrap');
  if (undoWrap) {
    let hasSnapshot = false;
    try { hasSnapshot = !!localStorage.getItem(UNDO_IMPORT_KEY); } catch (_) { /* ignore */ }
    undoWrap.hidden = !hasSnapshot;
  }

  const corruptWarn = $('#corrupt-warning');
  if (corruptWarn) {
    let hasCorrupt = false;
    try { hasCorrupt = !!localStorage.getItem(CORRUPT_BACKUP_KEY); } catch (_) { /* ignore */ }
    corruptWarn.hidden = !hasCorrupt;
  }
}

function openBackupModal() {
  const modal = $('#backup-modal');
  if (!modal) return;
  if (!isSyncActive()) {
    // Backup is only available to signed-in users now — send them to sign in instead.
    openAccountModal();
    return;
  }
  refreshBackupModal();
  const status = $('#backup-status');
  if (status) status.hidden = true;
  modal.setAttribute('aria-hidden', 'false');
}

function closeBackupModal() {
  const modal = $('#backup-modal');
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'true');
  pendingImport = null;
  const preview = $('#import-preview');
  if (preview) preview.hidden = true;
}

function bindBackupEvents() {
  $('#btn-open-backup')?.addEventListener('click', () => {
    closeAccountModal();
    openBackupModal();
  });
  $('#btn-close-backup')?.addEventListener('click', closeBackupModal);
  $('#backup-modal')?.addEventListener('click', (e) => {
    if (e.target === $('#backup-modal')) closeBackupModal();
  });

  $('#btn-export')?.addEventListener('click', exportData);
  $('#btn-copy-export')?.addEventListener('click', copyExportToClipboard);

  $('#btn-import-pick')?.addEventListener('click', () => $('#import-file')?.click());

  $('#import-file')?.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        pendingImport = parseBackupFile(String(reader.result));
        const summary = $('#import-summary');
        if (summary) {
          summary.textContent = `Znaleziono ${pendingImport.entries.length} os${pendingImport.entries.length === 1 ? 'obę' : 'ób'} w pliku`
            + (pendingImport.skipped ? ` (pominięto ${pendingImport.skipped} nieczytelnych).` : '.');
        }
        const preview = $('#import-preview');
        if (preview) preview.hidden = false;
        showBackupStatus('Wybierz, czy dołączyć dane, czy zastąpić obecne.', 'info');
      } catch (err) {
        pendingImport = null;
        const preview = $('#import-preview');
        if (preview) preview.hidden = true;
        showBackupStatus(err.message || 'Nie udało się odczytać pliku.', 'warn');
      }
    };
    reader.onerror = () => showBackupStatus('Nie udało się odczytać pliku.', 'warn');
    reader.readAsText(file);
    e.target.value = '';
  });

  $('#btn-import-merge')?.addEventListener('click', () => applyImport('merge'));
  $('#btn-import-replace')?.addEventListener('click', () => {
    if (confirm('Zastąpić wszystkie obecne dane danymi z pliku?\n\nObecne dane zostaną zachowane do cofnięcia, ale najpierw upewnij się, że masz kopię.')) {
      applyImport('replace');
    }
  });

  $('#btn-undo-import')?.addEventListener('click', undoImport);
  $('#btn-download-corrupt')?.addEventListener('click', downloadCorruptBackup);
}

function downloadCorruptBackup() {
  let corrupt;
  try { corrupt = localStorage.getItem(CORRUPT_BACKUP_KEY); } catch (_) { corrupt = null; }
  if (!corrupt) return;

  const ta = $('#export-output');
  if (ta) {
    ta.value = corrupt;
    const wrap = $('#export-output-wrap');
    if (wrap) wrap.hidden = false;
  }

  try {
    const blob = new Blob([corrupt], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mentalmap-uszkodzone-dane.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (_) { /* the textarea above is the fallback */ }

  showBackupStatus('Pobrano uszkodzone dane. Zachowaj ten plik — może dać się z niego odzyskać relacje.', 'ok');
}

// ═══════════════════════════════════════════
// ACCOUNT / CLOUD SYNC
// ═══════════════════════════════════════════
//
// Opt-in only: nothing below ever runs unless the user opens the Account
// button, or attemptSilentReconnect() finds evidence this device was already
// connected. Local storage stays the source of truth either way — cloud sync
// only ever mirrors it, never gates reading/writing it.

const PENDING_SIGNIN_KEY = 'mentalmap_pending_redirect_signin';
const SYNC_MODE_KEY = 'mentalmap_sync_mode'; // 'e2e' (email/password) or 'plain' (Google) — set once sign-in succeeds, so a relaunch knows whether to even check Firebase's auth state

let syncApi = null; // cached module namespace from the lazily-imported firebase-sync.js
// mode: 'e2e' = email/password account, DEK derived from the password, dek is required for isSyncActive.
//       'plain' = Google account, no password to derive a key from, so records sync unencrypted (Firestore rules only).
let syncState = { uid: null, email: null, mode: null, dek: null, dekId: null, unsubscribePeople: null };
let pendingCloudPeople = null; // set only while #account-screen-merge is showing

function isSyncActive() {
  return !!(syncState.uid && (syncState.mode === 'plain' || syncState.dek));
}

async function loadSyncModule() {
  if (syncApi) return syncApi;
  const mod = await import(`./firebase-sync.js?v=${ASSET_VERSION}`);
  syncApi = mod;
  window.MentalMapSync = mod; // debugging aid only, nothing reads this back
  return mod;
}

// Fire-and-forget: called once from init(), after the normal synchronous local
// load has already rendered. Costs nothing (no network, no import) for the
// large majority of users who have never touched sync.
async function attemptSilentReconnect() {
  let pendingRedirect = false;
  try { pendingRedirect = !!localStorage.getItem(PENDING_SIGNIN_KEY); } catch (_) { /* ignore */ }

  let storedMode = null;
  try { storedMode = localStorage.getItem(SYNC_MODE_KEY); } catch (_) { /* ignore */ }

  let cached = null;
  try { cached = await MentalMapCrypto.loadCachedDEK(); } catch (_) { /* ignore */ }

  if (!pendingRedirect && !cached && !storedMode) return; // never connected on this device — stay fully local

  try {
    const api = await loadSyncModule();
    let user = null;

    if (pendingRedirect) {
      try { localStorage.removeItem(PENDING_SIGNIN_KEY); } catch (_) { /* ignore */ }
      user = await api.checkRedirectResult();
    }
    if (!user) user = await api.getCurrentUser();
    if (!user) return; // no live Firebase session; Account modal will ask to sign in again

    if (cached && cached.uid === user.uid) {
      syncState.uid = user.uid;
      syncState.email = user.email || '';
      syncState.mode = 'e2e';
      syncState.dek = cached.dek;
      syncState.dekId = cached.dekId;
      await pullAndReconcile();
    } else if (pendingRedirect || storedMode === 'plain') {
      // The redirect fallback is only ever taken for Google sign-in, so a
      // completed redirect is always a plain-mode account. No password to
      // ask for — Google's own session is the only credential needed.
      await completeSignIn(user, { mode: 'plain' });
    }
    // Otherwise: an e2e account whose DEK isn't cached on this device (e.g.
    // storage was cleared). There's no remembered password to re-derive it
    // from, so leave the app disconnected — opening the Account modal and
    // signing in again with the password picks it back up.
  } catch (e) {
    console.error('Silent reconnect failed:', e);
  }
}

function showAccountScreen(id) {
  ['entry', 'merge', 'signed-in'].forEach(name => {
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
    await completeSignIn(user, { mode: 'plain' });
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
    await completeSignIn(user, { mode: 'e2e', password });
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
    await completeSignIn(user, { mode: 'e2e', password });
  } catch (e) {
    console.error('Email sign-up failed:', e);
    showAccountStatus('Nie udało się założyć konta. Może ten adres jest już zajęty?', 'warn');
  }
}

// Shared continuation after ANY successful Firebase auth (Google or email),
// whether just completed or resumed on relaunch.
//
// Google accounts (mode 'plain') have no password to derive a key from, so
// they skip crypto.js entirely and sync in the clear. Email/password accounts
// (mode 'e2e') derive the DEK-wrapping key from the password right here —
// either unwrapping an existing keyring, or creating one on first sign-in —
// so unlocking never needs a separate code or screen.
async function completeSignIn(user, { mode, password } = {}) {
  syncState.uid = user.uid;
  syncState.email = user.email || '';
  syncState.mode = mode;

  if (mode === 'plain') {
    try { localStorage.setItem(SYNC_MODE_KEY, 'plain'); } catch (_) { /* ignore */ }
    showAccountScreen('signed-in');
    refreshAccountSignedInScreen();
    showAccountStatus('');
    await pullAndReconcile();
    return;
  }

  try {
    const api = syncApi || await loadSyncModule();
    const keyringDocs = await api.fetchKeyringDocs(user.uid);
    const passwordDoc = keyringDocs.find(d => d.kind === 'password');

    if (passwordDoc) {
      syncState.dek = await MentalMapCrypto.unlock(passwordDoc, password, { extractable: true });
      syncState.dekId = passwordDoc.dekId;
      await MentalMapCrypto.cacheDEK(syncState.dek, syncState.dekId, user.uid);
    } else {
      // First time this account has ever synced (or an account from before
      // this scheme, whose old wrappings we can no longer unlock): start a
      // fresh password-wrapped keyring. Local storage is always the source
      // of truth, so nothing on this device is lost either way.
      const setup = await runFirstTimeSetup(user.uid, password);
      syncState.dek = setup.dek;
      syncState.dekId = setup.dekId;
    }

    try { localStorage.setItem(SYNC_MODE_KEY, 'e2e'); } catch (_) { /* ignore */ }
    showAccountScreen('signed-in');
    refreshAccountSignedInScreen();
    showAccountStatus('');
    await pullAndReconcile();
  } catch (e) {
    console.error('Failed to complete sign-in:', e);
    const msg = e && e.code === 'BAD_SECRET'
      ? 'Nie udało się odblokować danych w chmurze tym hasłem.'
      : 'Nie udało się połączyć z kontem. Spróbuj ponownie.';
    showAccountStatus(msg, 'warn');
  }
}

async function runFirstTimeSetup(uid, password) {
  showAccountStatus('Przygotowywanie szyfrowania…', 'info');
  const { dek, dekId, docs } = await MentalMapCrypto.setupKeyring({ password });
  await syncApi.ensureUserDoc(uid, dekId);
  for (const doc of docs) await syncApi.pushKeyringDoc(uid, doc);
  await MentalMapCrypto.cacheDEK(dek, dekId, uid);
  return { dek, dekId };
}

// One-time reconciliation after a device first unlocks its DEK (either right
// after unlock, or during a silent reconnect that found a matching cached
// key). Not used for ongoing sync — that's startPeopleListener() below.
async function pullAndReconcile() {
  showAccountStatus('Pobieranie danych…', 'info');
  let records;
  try {
    records = await syncApi.fetchAllPeopleOnce(syncState.uid);
  } catch (e) {
    console.error('Failed to fetch cloud people:', e);
    showAccountStatus('Nie udało się pobrać danych z chmury.', 'warn');
    return;
  }

  const decrypted = [];
  for (const rec of records) {
    try {
      const payload = syncState.mode === 'e2e'
        ? await MentalMapCrypto.decryptRecord(rec, syncState.dek, syncState.uid, rec.id)
        : MentalMapCrypto.sensitivePayload(rec);
      decrypted.push(Object.assign({
        id: rec.id,
        angle: Math.random() * Math.PI * 2,
        speed: 0.1,
        syncUpdatedAt: rec.updatedAtMs || Date.now()
      }, payload));
    } catch (e) {
      console.error('Failed to decrypt a cloud record, skipping:', rec.id, e);
    }
  }
  decrypted.forEach(recomputeDerived);

  const localHasData = people.length > 0;
  const cloudHasData = decrypted.length > 0;

  if (localHasData && cloudHasData) {
    pendingCloudPeople = decrypted;
    showAccountScreen('merge');
    showAccountStatus('');
    return;
  }

  if (cloudHasData) {
    people = decrypted;
    distributePlanets();
    savePeople();
    renderPlanets();
    updateEmptyState();
  } else if (localHasData) {
    queueSyncUpsertAll(people);
  }

  showAccountScreen('signed-in');
  refreshAccountSignedInScreen();
  showAccountStatus('');
  startPeopleListener();
}

function applyMergeCombine() {
  if (!pendingCloudPeople) return;
  const byId = new Map(people.map(p => [p.id, p]));
  pendingCloudPeople.forEach(p => { if (!byId.has(p.id)) byId.set(p.id, p); });
  people = Array.from(byId.values());
  people.forEach(recomputeDerived);
  distributePlanets();
  savePeople();
  renderPlanets();
  updateEmptyState();
  queueSyncUpsertAll(people);
  finishMerge();
}

function applyMergeUseCloud() {
  if (!pendingCloudPeople) return;
  people = pendingCloudPeople;
  distributePlanets();
  savePeople();
  renderPlanets();
  updateEmptyState();
  finishMerge();
}

function applyMergeUseLocal() {
  const localIds = new Set(people.map(p => p.id));
  const cloudOnlyIds = (pendingCloudPeople || []).filter(p => !localIds.has(p.id)).map(p => p.id);
  distributePlanets();
  savePeople();
  renderPlanets();
  updateEmptyState();
  queueSyncUpsertAll(people);
  cloudOnlyIds.forEach(queueSyncDelete);
  finishMerge();
}

function finishMerge() {
  pendingCloudPeople = null;
  showAccountScreen('signed-in');
  refreshAccountSignedInScreen();
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
async function handleRemoteChanges(changes) {
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
    const incomingMs = rec.updatedAtMs || 0;
    const existing = people.find(p => p.id === personId);
    if (existing && (existing.syncUpdatedAt || 0) >= incomingMs) continue;

    try {
      const payload = syncState.mode === 'e2e'
        ? await MentalMapCrypto.decryptRecord(rec, syncState.dek, syncState.uid, personId)
        : MentalMapCrypto.sensitivePayload(rec);
      const merged = Object.assign(existing || {
        id: personId,
        angle: Math.random() * Math.PI * 2,
        speed: 0.1
      }, payload, { syncUpdatedAt: incomingMs });
      recomputeDerived(merged);
      if (!existing) people.push(merged);
      touched = true;
    } catch (e) {
      console.error('Failed to decrypt remote change, skipping:', personId, e);
    }
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
  (async () => {
    try {
      const rec = syncState.mode === 'e2e'
        ? await MentalMapCrypto.encryptRecord(person, syncState.dek, syncState.uid, person.id)
        : MentalMapCrypto.sensitivePayload(person);
      await syncApi.pushPerson(syncState.uid, person.id, rec, person.syncUpdatedAt);
    } catch (e) {
      console.error('Cloud sync push failed for', person.id, e);
    }
  })();
}

function queueSyncDelete(personId) {
  if (!isSyncActive() || !personId) return;
  syncApi.deletePerson(syncState.uid, personId).catch(e => console.error('Cloud sync delete failed for', personId, e));
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
  syncState = { uid: null, email: null, mode: null, dek: null, dekId: null, unsubscribePeople: null };
  try { localStorage.removeItem(SYNC_MODE_KEY); } catch (_) { /* ignore */ }
  showAccountScreen('entry');
  showAccountStatus('Wylogowano. Dane na tym urządzeniu zostają bez zmian.', 'ok');
}

function handleForgetDevice() {
  if (!confirm('Zapomnieć to urządzenie?\n\nPrzy następnym logowaniu trzeba będzie zalogować się ponownie (e-mail i hasło albo Google). Dane na tym urządzeniu zostaną bez zmian.')) return;
  MentalMapCrypto.forgetDevice().catch(() => { /* best effort */ });
  handleSignOut();
}

function bindAccountEvents() {
  $('#btn-account')?.addEventListener('click', openAccountModal);
  $('#btn-close-account')?.addEventListener('click', () => closeAccountModal());
  $('#account-modal')?.addEventListener('click', (e) => {
    if (e.target === $('#account-modal')) closeAccountModal();
  });

  $('#btn-google-signin')?.addEventListener('click', handleGoogleSignIn);
  $('#account-email-form')?.addEventListener('submit', handleEmailSignIn);
  $('#btn-email-signup')?.addEventListener('click', handleEmailSignUp);

  $('#btn-merge-combine')?.addEventListener('click', applyMergeCombine);
  $('#btn-merge-use-cloud')?.addEventListener('click', () => {
    if (confirm('Dane, które są tylko na tym urządzeniu, zostaną odrzucone na rzecz danych z chmury. Kontynuować?')) {
      applyMergeUseCloud();
    }
  });
  $('#btn-merge-use-local')?.addEventListener('click', () => {
    if (confirm('Dane w chmurze, których nie ma na tym urządzeniu, zostaną nadpisane danymi lokalnymi. Kontynuować?')) {
      applyMergeUseLocal();
    }
  });

  $('#btn-sign-out')?.addEventListener('click', handleSignOut);
  $('#btn-forget-device')?.addEventListener('click', handleForgetDevice);
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

  // Close modal on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (surveyModal?.getAttribute('aria-hidden') === 'false') closeModal();
      if (infoModal?.getAttribute('aria-hidden') === 'false') closeInfoModal();
      if ($('#backup-modal')?.getAttribute('aria-hidden') === 'false') closeBackupModal();
      if ($('#account-modal')?.getAttribute('aria-hidden') === 'false') closeAccountModal();
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
  updateColorPickerSelection(Math.floor(Math.random() * PLANET_GRADIENTS.length));
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

  const colorIndex = person.gradientIndex !== undefined ? person.gradientIndex : Math.floor(Math.random() * PLANET_GRADIENTS.length);
  updateColorPickerSelection(colorIndex);

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

  modalTitle.textContent = `Edytuj: ${person.name}`;
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

function generateSummary(person) {
  if (!summaryContainer) return;
  summaryContainer.innerHTML = '';

  let html = '';

  // Gate check
  if (typeof person.gateAnswer === 'number' && person.gateAnswer < 0) {
    const answerObj = GATE_QUESTION.answers.find(a => a.penalty === person.gateAnswer);
    if (answerObj) {
      html += `
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
      html += `
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
      html += `
        <div class="summary-item" onclick="switchToSurveyAndScroll('card-secret')" style="cursor: pointer;" title="Kliknij, aby poprawić">
          <div class="summary-item__question">${SECRET_QUESTION.text}</div>
          <div class="summary-item__answer">Twoja odpowiedź: ${answerObj.text}</div>
          <div class="summary-item__score">Limit poziomu: max ${person.secretCap}</div>
        </div>
      `;
    }
  }

  if (html === '') {
    html = '<div style="text-align:center; color:var(--text-muted); padding:20px;">Ta osoba uzyskała maksymalną liczbę punktów we wszystkich kategoriach!</div>';
  }

  summaryContainer.innerHTML = html;
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
  surveyModal.setAttribute('aria-hidden', 'true');
  editingId = null;
  if (!fromPopState && history.state && history.state.modalOpen) {
    history.back();
  }
}

// Handle hardware back button
window.addEventListener('popstate', (e) => {
  if (surveyModal.getAttribute('aria-hidden') === 'false') {
    closeModal(true);
  } else if (infoModal?.getAttribute('aria-hidden') === 'false') {
    closeInfoModal(true);
  } else if (!rankingView.classList.contains('hidden')) {
    toggleRankingView(true);
  } else if (statsView && !statsView.classList.contains('hidden')) {
    toggleStatsView(true);
  } else if ($('#account-modal')?.getAttribute('aria-hidden') === 'false') {
    closeAccountModal(true);
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
      gradientIndex: selectedGradientIndex
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
    const grad = PLANET_GRADIENTS[person.gradientIndex % PLANET_GRADIENTS.length];
    planetEl.style.background = `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`;
    planetEl.style.setProperty('--planet-glow', `${grad[0]}66`);

    // +/- indicators converted to background glow
    const { glow: customGlow, color: customGlowColor } = getPlanetGlowStyle(person);
    
    person.orbitLineColor = customGlowColor;

    if (customGlow) {
      planetEl.style.setProperty('--custom-glow', customGlow);
    }

    // Planet Menu
    const menu = document.createElement('div');
    menu.className = 'planet-menu';
    menu.innerHTML = `
      <div class="planet-menu-item action-color" data-action="color" title="Edycja wizualna">🖌️</div>
      <div class="planet-menu-item action-survey" data-action="survey" title="Edycja ankiety">✔️</div>
      <div class="planet-menu-item action-summary" data-action="summary" title="Podsumowanie">≡</div>
    `;

    menu.querySelectorAll('.planet-menu-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        handlePlanetAction(person.id, btn.dataset.action);
      });
    });

    group.appendChild(menu);

    // Click to select planet
    group.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlanetMenu(person.id);
    });

    group.appendChild(planetEl);
    planetsContainer.appendChild(group);

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
    const nameParts = person.name.trim().split(' ');
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

  centerCameraOnPlanet(id);
}

function closePlanetMenu(restoreCamera = true) {
  if (selectedPlanetId) {
    const group = planetsContainer?.querySelector(`.planet-group[data-id="${selectedPlanetId}"]`);
    if (group) {
      group.classList.remove('is-active');
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
        }

        if (label) {
          label.style.display = '';
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
    
    // Gradient colors
    const colors = PLANET_GRADIENTS[person.gradientIndex % PLANET_GRADIENTS.length];
    
    // Initials
    const initials = person.name.substring(0, 2).toUpperCase();
    
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
    avatarEl.style.background = `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;

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
          const colors = PLANET_GRADIENTS[person.gradientIndex % PLANET_GRADIENTS.length];
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
          planetEl.style.background = `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;
          planetEl.style.setProperty('--planet-glow', `${colors[0]}66`);
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
}

if (btnStats) btnStats.addEventListener('click', () => toggleStatsView());

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
    if (ranking && !ranking.classList.contains('hidden')) return true;
    if (stats && !stats.classList.contains('hidden')) return true;
    if (survey && survey.getAttribute('aria-hidden') === 'false') return true;
    if (info && info.getAttribute('aria-hidden') === 'false') return true;
    if (account && account.getAttribute('aria-hidden') === 'false') return true;
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
