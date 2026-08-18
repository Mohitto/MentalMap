/**
 * MentalMap — Planetary Relationship Mapper
 * Maps your relationships as planets orbiting you (the Sun).
 * Scoring: 0-11 = Level 0, 12-24 = Level 1, 25-37 = Level 2, 38-50 = Level 3 (closest).
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
    { penalty: 0, text: 'Codziennie lub kilka razy w tygodniu.' },
    { penalty: -4, text: 'Raz lub kilka razy w miesiącu.' },
    { penalty: -6, text: 'Raz lub kilka razy w roku.' },
    { penalty: -10, text: 'Brak kontaktu.' },
    { penalty: 0, text: 'Jeszcze nie było sytuacji, by to ocenić.' }
  ]
};

const SECRET_QUESTION = {
  text: 'Czy ta osoba dochowuje powierzonych jej sekretów?',
  answers: [
    { cap: 3, text: 'Zawsze dochowuje sekretów.' },
    { cap: 2, text: 'Zdarzyło się, że powiedziała coś, czego nie powinna.' },
    { cap: 1, text: 'Nie potrafi dochować sekretów.' },
    { cap: 0, text: 'Bez przerwy obgaduje za plecami.' },
    { cap: 3, text: 'Jeszcze nie było sytuacji, by to ocenić.' }
  ]
};

const STORAGE_KEY = 'mentalmap_people';
const APP_VERSION = 'v0.9.44';

// Dynamic orbit configuration
const ORBIT_START = 60;      // px from center to first orbit
const ORBIT_SPACING = 40;    // px between unique-score orbits within a level
const LEVEL_GAP = 25;        // px gap between level bands
const LEVEL_SPEEDS = { 3: 0.18, 2: 0.13, 1: 0.09, 0: 0.06 };

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
  setAppVersion();
  startAnimation();
  updateEmptyState();
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

    const title = document.createElement('h3');
    title.textContent = `${qIndex + 2}. ${q.text}`;
    card.appendChild(title);

    const optionsWrap = document.createElement('div');
    optionsWrap.className = 'options-container';

    q.answers.forEach((answer) => {
      const label = document.createElement('label');
      label.className = 'answer-option';

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `q${qIndex}`;
      radio.value = answer.points;
      radio.required = true;
      radio.addEventListener('change', updateScorePreview);

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

function loadPeople() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      people = JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load data:', e);
      people = [];
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
  people.forEach(p => {
    if (p.answers) {
      const rawScore = p.answers.reduce((sum, pts) => sum + pts, 0);
      p.totalScore = Math.max(0, rawScore + (p.gateAnswer || 0));
      p.level = Math.min(getLevel(p.totalScore), p.secretCap !== undefined ? p.secretCap : 3);
    }
  });
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
        p.speed = getRandomSpeed(level);
      });
  });

  savePeople();
}

function savePeople() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
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
  if (score >= 38) return 3;
  if (score >= 25) return 2;
  if (score >= 12) return 1;
  return 0;
}

// Indicator questions: indices 0, 1, 2 (first three survey questions)
const INDICATOR_QUESTION_INDICES = [0, 1, 2];

function getPlanetIndicators(answers) {
  let plusCount = 0;
  let minusCount = 0;

  INDICATOR_QUESTION_INDICES.forEach(qi => {
    if (!answers || answers[qi] === undefined) return;
    const maxPts = Math.max(...SURVEY_QUESTIONS[qi].answers.map(a => a.points));
    if (answers[qi] === maxPts) plusCount++;
    else if (answers[qi] === 0) minusCount++;
  });

  return { plusCount, minusCount };
}

function getRandomSpeed(level) {
  const baseSpeed = LEVEL_SPEEDS[level] ?? LEVEL_SPEEDS[0];
  return baseSpeed + (Math.random() * 0.03 - 0.015);
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
    }
  });

  // Bind orbit ring clicks for level info
  $$('.orbit-ring').forEach(ring => {
    ring.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent outer rings from catching inner ring clicks
      if (e.target.closest('.planet-group')) return;
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
  1: 'To ludzie, którzy widzą Cię z zewnątrz — znają Twoje imię, wiedzą czym się zajmujesz, mają ogólny obraz tego, jaki jesteś. I to jest w porządku, że na tym się kończy. Nie muszą wiedzieć więcej, a Ty nie musisz im nic tłumaczyć — nie mają wpływu na to, co czujesz, ani na Twoje decyzje. To zdrowa, naturalna granica, nie chłód czy dystans z premedytacją.',
  2: 'Tu wpuszczasz kogoś odrobinę głębiej — mówisz o tym, co dzieje się teraz w Twoim życiu, jakie masz plany, co myślisz o różnych sprawach. Ci ludzie mogą Cię wspierać, dawać szczerą informację zwrotną, czasem nawet delikatnie negocjować z Tobą granice — bo jest między Wami wzajemność, zbudowana na wspólnych chwilach i sprawdzonym w praktyce zaufaniu. Ale wciąż nie mają wglądu w to, co dzieje się głębiej w Tobie.',
  3: 'Z tymi osobami możesz być całkowicie sobą — bez masek, bez skracania, bez tłumaczenia się. Dzielisz się tym, co Cię boli, czego się boisz, jaka jest Twoja historia i co Cię naprawdę porusza od wewnątrz. Ci ludzie mają realny wpływ na to, jak myślisz o samym sobie — mogą coś w Tobie poruszyć, uleczyć, albo pomóc Ci zobaczyć siebie w nowym świetle. To najbardziej wrażliwa przestrzeń Twojego życia.'
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
    const radio = surveyForm.querySelector(`input[name="q${i}"][value="${pts}"]`);
    if (radio) radio.checked = true;
  });

  // Restore secret cap
  if (person.secretCap !== undefined) {
    const secretRadio = surveyForm.querySelector(`input[name="secret"][value="${person.secretCap}"]`);
    if (secretRadio) secretRadio.checked = true;
  }

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
        <div class="summary-item">
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
      const answerObj = q.answers.find(a => a.points === pts);
      html += `
        <div class="summary-item">
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
        <div class="summary-item">
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
  }
});
  const btnIncognito = document.getElementById('btn-incognito');
  if (btnIncognito) {
    btnIncognito.addEventListener('click', () => {
      document.body.classList.toggle('incognito-mode');
      btnIncognito.classList.toggle('active-mode');
    });
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
  let totalScore = 0;
  let allAnswered = !!gateChecked;

  for (let i = 0; i < SURVEY_QUESTIONS.length; i++) {
    const checked = surveyForm.querySelector(`input[name="q${i}"]:checked`);
    if (checked) {
      const pts = parseInt(checked.value, 10);
      answers.push(pts);
      totalScore += pts;
    } else {
      allAnswered = false;
      answers.push(0);
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

  if (editingId) {
    // Update existing
    const person = people.find(p => p.id === editingId);
    if (person) {
      person.name = name;
      person.answers = answers;
      person.gateAnswer = gatePenalty;
      person.totalScore = totalScore;
      person.gradientIndex = selectedGradientIndex;
      person.secretCap = secretCap;
      const oldLevel = person.level;
      person.level = cappedLevel;
      // Re-randomize speed if level changed
      if (oldLevel !== cappedLevel) person.speed = getRandomSpeed(cappedLevel);
    }
  } else {
    // Add new person
    people.push({
      id: uuid(),
      name,
      answers,
      gateAnswer: gatePenalty,
      totalScore,
      level: cappedLevel,
      secretCap,
      angle: Math.random() * Math.PI * 2,
      speed: getRandomSpeed(cappedLevel),
      gradientIndex: selectedGradientIndex
    });
  }

  distributePlanets();
  savePeople();
  renderPlanets();
  updateEmptyState();
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
    const { plusCount, minusCount } = getPlanetIndicators(person.answers);
    let customGlow = null;
    
    if (plusCount === 1 && minusCount === 0) customGlow = '0 0 8px 2px #86efac'; // +
    else if (plusCount === 2 && minusCount === 0) customGlow = '0 0 12px 4px #86efac'; // ++
    else if (plusCount === 3 && minusCount === 0) customGlow = '0 0 12px 4px #16a34a'; // +++
    else if (plusCount === 0 && minusCount === 1) customGlow = '0 0 8px 2px #ef4444'; // -
    else if (plusCount === 0 && minusCount === 2) customGlow = '0 0 8px 2px #000000'; // --
    else if (plusCount === 0 && minusCount === 3) customGlow = '0 0 12px 4px #000000'; // ---
    else if (plusCount === 1 && minusCount === 1) customGlow = '0 0 8px 2px #f97316'; // +-
    else if (plusCount === 2 && minusCount === 1) customGlow = '0 0 8px 2px #166534'; // ++-
    else if (plusCount === 1 && minusCount === 2) customGlow = '0 0 12px 4px #f97316'; // --+ (user wrote --+, which implies 2 minus 1 plus)
    
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
    const nameParts = person.name.trim().split(' ');
    if (nameParts.length > 1) {
      label.innerHTML = `<strong>${nameParts[0]}</strong><br>${nameParts.slice(1).join(' ')}`;
    } else {
      label.innerHTML = `<strong>${person.name}</strong>`;
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
  mapPanX = -x * mapScale;
  mapPanY = -y * mapScale;
  if (mapScale < 1.5) mapScale = 1.5;

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
    
    item.innerHTML = `
      <div class="ranking-avatar" style="background: linear-gradient(135deg, ${colors[0]}, ${colors[1]});">
      </div>
      <div class="ranking-info">
        <div class="ranking-name">${person.name}</div>
        <div class="ranking-points" style="color: ${levelColor}; font-weight: 600;">${levelName}</div>
      </div>
      <div class="ranking-score">${person.totalScore} <span style="font-size:12px; font-weight:400; color:var(--text-muted);">pkt</span></div>
    `;

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
    const survey = document.getElementById('survey-modal');
    const info = document.getElementById('info-modal');
    if (ranking && !ranking.classList.contains('hidden')) return true;
    if (survey && survey.getAttribute('aria-hidden') === 'false') return true;
    if (info && info.getAttribute('aria-hidden') === 'false') return true;
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
    if (e.target.closest('.planet-group') || e.target.closest('#fab-add') || e.target.closest('.btn-top')) return;
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
    if (e.target.closest('.planet-group') || e.target.closest('#fab-add') || e.target.closest('.btn-toggle-view') || e.target.closest('.btn-top')) return;

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
