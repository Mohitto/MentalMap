/**
 * MentalMap — Planetary Relationship Mapper
 * Maps your relationships as planets orbiting you (the Sun).
 * Scoring: 0-9 pts = Level 1 (farthest), 10-19 = Level 2, 20-30 = Level 3 (closest).
 */

// ═══════════════════════════════════════════
// SURVEY DATA
// ═══════════════════════════════════════════

const SURVEY_QUESTIONS = [
  // ── Indicator questions (2, 3, 4) ──
  {
    text: 'Jak ta osoba reaguje, gdy mówisz o swoim małym sukcesie lub czymś dla ciebie ważnym?',
    answers: [
      { points: 3, text: 'Aktywnie dopytuje o szczegóły i skupia się na tym, co mówisz.' },
      { points: 2, text: 'Reaguje krótko, ale pozytywnie (np. pisze "super", "gratulacje").' },
      { points: 1, text: 'Ignoruje wiadomość, nie czyta jej lub odhacza, zostawiając jedynie reakcję (np. lajka).' },
      { points: 0, text: 'Umniejsza znaczenie twojego sukcesu lub natychmiast przekierowuje rozmowę na siebie.' }
    ]
  },
  {
    text: 'Jak wygląda wsparcie w sytuacjach, gdy potrzebujesz pomocy?',
    answers: [
      { points: 3, text: 'Proponuje pomoc, zanim wprost o nią poprosisz.' },
      { points: 2, text: 'Pomaga, gdy jasno i bezpośrednio sformułujesz prośbę.' },
      { points: 1, text: 'Szuka wymówek, kalkuluje lub zgadza się, ale z widoczną niechęcią.' },
      { points: 0, text: 'Całkowicie odcina się od problemu, nie daje żadnego wsparcia.' }
    ]
  },
  {
    text: 'Czy ta osoba cię inspiruje?',
    answers: [
      { points: 6, text: 'Inspiruje mnie do samych dobrych rzeczy.' },
      { points: 4, text: 'Nie inspiruje mnie wcale.' },
      { points: 2, text: 'Inspiruje mnie zarówno do dobrych, jak i złych rzeczy.' },
      { points: 0, text: 'Inspiruje mnie do złych rzeczy.' }
    ]
  },
  // ── Remaining questions ──
  {
    text: 'Kto inicjuje kontakt (pisze pierwszy, proponuje spotkania)?',
    answers: [
      { points: 3, text: 'Inicjatywa jest rozłożona po równo.' },
      { points: 2, text: 'Zazwyczaj to ta druga osoba inicjuje kontakt.' },
      { points: 1, text: 'Zazwyczaj to ja inicjuję kontakt.' },
      { points: 0, text: 'Kontakt wychodzi wyłącznie z mojej inicjatywy.' }
    ]
  },
  {
    text: 'Jak się czujesz po spotkaniu lub rozmowie z tą osobą?',
    answers: [
      { points: 3, text: 'Mam więcej energii, czuję spokój i stabilność.' },
      { points: 2, text: 'Czuję się normalnie, rozmowa mnie nie męczy.' },
      { points: 1, text: 'Czuję lekkie zmęczenie, potrzebuję chwili dla siebie.' },
      { points: 0, text: 'Czuję się całkowicie pozbawiony energii, zirytowany lub niespokojny.' }
    ]
  },
  {
    text: 'Jak rozwiązujecie różnice zdań i konflikty?',
    answers: [
      { points: 3, text: 'Logicznie analizujecie problem i wspólnie dochodzicie do obiektywnej prawdy.' },
      { points: 2, text: 'Ktoś ustępuje, żeby nie podejmować trudnego tematu i uniknąć kłótni.' },
      { points: 1, text: 'Druga strona walczy o to, by mieć rację, bez względu na to, jaka ona jest.' },
      { points: 0, text: 'Pojawia się agresja słowna, wytykanie problemów lub "ciche dni".' }
    ]
  },
  {
    text: 'Jak wyglądają odpowiedzi na twoje wiadomości?',
    answers: [
      { points: 3, text: 'Rozmowa jest płynna, a jeśli nastąpiło opóźnienie, osoba odpowiada na każdą nadesłaną wcześniej wiadomość.' },
      { points: 2, text: 'Odpowiada z opóźnieniem, ale odnosi się do sedna sprawy.' },
      { points: 1, text: 'Odpisuje tylko czasem i nie zawsze odnosi się do sedna sprawy.' },
      { points: 0, text: 'Wiadomości są systematycznie ignorowane.' }
    ]
  },
  {
    text: 'Jak wygląda sposób umawiania się na spotkania?',
    answers: [
      { points: 3, text: 'Wspólnie dążycie do spotkań i szukacie na nie czasu.' },
      { points: 2, text: 'Druga osoba stara się spotkać, ale to ty nie masz dla niej czasu.' },
      { points: 1, text: 'To ty próbujesz się spotkać i ciągle jest problem z ustaleniem terminu.' },
      { points: 0, text: 'Spotkanie się na żywo jest niemożliwe.' }
    ]
  },
  {
    text: 'Czy ta osoba pamięta szczegóły z twojego życia?',
    answers: [
      { points: 3, text: 'Pamięta szczegóły, fakty z twojego życia i sama do nich wraca w kolejnych rozmowach.' },
      { points: 2, text: 'Pamięta najważniejsze rzeczy, ale zapomina o drobnostkach.' },
      { points: 1, text: 'Musisz powtarzać te same rzeczy wiele razy, mówisz jak "grochem o ścianę".' },
      { points: 0, text: 'Nie pamięta niczego, nie kojarzy podstawowych faktów na twój temat.' }
    ]
  },
  {
    text: 'Jak ta osoba reaguje, gdy stawiasz twardą granicę lub jej odmawiasz?',
    answers: [
      { points: 3, text: 'Od razu akceptuje twoją decyzję i nie próbuje jej zmieniać.' },
      { points: 2, text: 'Akceptuje to, ale widać, że na chwilę psuje jej się humor.' },
      { points: 1, text: 'Próbuje negocjować lub wymusza na tobie tłumaczenie się z podjętej decyzji.' },
      { points: 0, text: 'Nie szanuje twojej granicy, wywołuje poczucie winy lub zmusza cię do zmiany zdania.' }
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
  }
];

const GATE_QUESTION = {
  text: 'Jak często spotykasz się z tą osobą w prawdziwym życiu?',
  answers: [
    { penalty: 0, text: 'Codziennie lub kilka razy w tygodniu.' },
    { penalty: -4, text: 'Raz lub kilka razy w miesiącu.' },
    { penalty: -6, text: 'Raz lub kilka razy w roku.' },
    { penalty: -10, text: 'Brak kontaktu.' }
  ]
};

const STORAGE_KEY = 'mentalmap_people';
const APP_VERSION = 'v0.9.20';

// Orbit radii for each level (pixels from center)
const BASE_RADII = { 3: 100, 2: 160, 1: 220, 0: 280 };

const LEVEL_SPEEDS = { 3: 0.18, 2: 0.13, 1: 0.09, 0: 0.06 };

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
const appVersion = $('#app-version');

// ═══════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════

let people = [];
let editingId = null;
let selectedGradientIndex = 0;

function updateColorPickerSelection(index) {
  selectedGradientIndex = index;
  document.querySelectorAll('.color-swatch').forEach(s => {
    s.classList.toggle('selected', parseInt(s.dataset.index) === index);
  });
}
let animationFrameId = null;
let lastTimestamp = 0;

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
  const maxScore = SURVEY_QUESTIONS.reduce((sum, q) => sum + Math.max(...q.answers.map(a => a.points)), 0);
  const pct = Math.round((total / maxScore) * 100);

  if (scoreValue) scoreValue.textContent = total;
  const maxScoreLabel = document.querySelector('.score-preview__max');
  if (maxScoreLabel) maxScoreLabel.textContent = `/${maxScore}`;
  if (scoreLevel) {
    scoreLevel.textContent = `Poziom ${level}`;
    scoreLevel.className = `score-preview__level level-${level}`;
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
  distributePlanets();
  renderPlanets();
}

function distributePlanets() {
  const byLevel = { 0: [], 1: [], 2: [], 3: [] };

  people.forEach((p) => {
    p.level = getLevel(p.totalScore);

    if (typeof p.gradientIndex !== 'number') {
      p.gradientIndex = Math.floor(Math.random() * PLANET_GRADIENTS.length);
    }

    byLevel[p.level].push(p);
  });

  Object.entries(byLevel).forEach(([lvl, list]) => {
    const level = Number(lvl);
    const count = list.length;
    if (!count) return;

    list
      .sort((a, b) => b.totalScore - a.totalScore || a.name.localeCompare(b.name, 'pl'))
      .forEach((p, index) => {
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
  if (score >= 28) return 3;
  if (score >= 18) return 2;
  if (score >= 8) return 1;
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

function getOrbitalRadii() {
  const minDim = Math.min(window.innerWidth, window.innerHeight);
  const requiredDim = BASE_RADII[0] * 2 + 80;
  const scale = minDim < requiredDim ? (minDim / requiredDim) : 1;

  return {
    3: BASE_RADII[3] * scale,
    2: BASE_RADII[2] * scale,
    1: BASE_RADII[1] * scale,
    0: BASE_RADII[0] * scale
  };
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
      if (e.target.closest('.planet-group')) return;
      const level = parseInt(ring.dataset.level, 10);
      if (level >= 1 && level <= 3) openInfoModal(level);
    });
  });

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
  surveyModal.setAttribute('aria-hidden', 'false');
  history.pushState({ modalOpen: true }, '');
  // Focus name input after animation
  setTimeout(() => personNameInput?.focus(), 400);
}

function openEditModal(id) {
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

  modalTitle.textContent = `Edytuj: ${person.name}`;
  btnDelete.style.display = 'flex';

  updateScorePreview();
  surveyModal.setAttribute('aria-hidden', 'false');
  history.pushState({ modalOpen: true }, '');
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
  }

  // Apply gate penalty and clamp
  const gatePenalty = gateChecked ? parseInt(gateChecked.value, 10) : 0;
  totalScore = Math.max(0, totalScore + gatePenalty);

  const level = getLevel(totalScore);

  if (editingId) {
    // Update existing
    const person = people.find(p => p.id === editingId);
    if (person) {
      person.name = name;
      person.answers = answers;
      person.gateAnswer = gatePenalty;
      person.totalScore = totalScore;
      person.gradientIndex = selectedGradientIndex;
      const oldLevel = person.level;
      person.level = level;
      // Re-randomize speed if level changed
      if (oldLevel !== level) person.speed = getRandomSpeed(level);
    }
  } else {
    // Add new person
    people.push({
      id: uuid(),
      name,
      answers,
      gateAnswer: gatePenalty,
      totalScore,
      level,
      angle: Math.random() * Math.PI * 2,
      speed: getRandomSpeed(level),
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

    // +/- indicators from questions 3, 6, 12
    const { plusCount, minusCount } = getPlanetIndicators(person.answers);
    if (plusCount > 0 || minusCount > 0) {
      const totalIndicators = plusCount + minusCount;
      const indicatorWrap = document.createElement('div');
      indicatorWrap.className = 'planet-indicators' + (totalIndicators === 3 ? ' planet-indicators--pyramid' : '');
      for (let i = 0; i < plusCount; i++) {
        const s = document.createElement('span');
        s.className = 'planet-ind planet-ind--plus';
        s.textContent = '+';
        indicatorWrap.appendChild(s);
      }
      for (let i = 0; i < minusCount; i++) {
        const s = document.createElement('span');
        s.className = 'planet-ind planet-ind--minus';
        s.textContent = '−';
        indicatorWrap.appendChild(s);
      }
      planetEl.appendChild(indicatorWrap);
    }

    // Tap to edit
    group.addEventListener('click', () => openEditModal(person.id));

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

    // Calculate responsive scale
    const minDim = Math.min(window.innerWidth, window.innerHeight);
    const requiredDim = BASE_RADII[0] * 2 + 80;
    const scale = minDim < requiredDim ? (minDim / requiredDim) : 1;
    const outerRadius = BASE_RADII[0] * scale;  // radius for score 0
    const innerRadius = BASE_RADII[3] * scale;   // radius for max score

    // Max possible score from survey
    const maxPossibleScore = SURVEY_QUESTIONS.reduce((sum, q) => sum + Math.max(...q.answers.map(a => a.points)), 0);

    // Convert a score to a radius (higher score = closer to sun = smaller radius)
    const scoreToRadius = (score) => {
      const fraction = Math.max(0, Math.min(1, score / maxPossibleScore));
      return outerRadius - fraction * (outerRadius - innerRadius);
    };

    const groups = planetsContainer?.querySelectorAll('.planet-group');
    if (groups) {
      groups.forEach(group => {
        const person = people.find(p => p.id === group.dataset.id);
        if (!person) return;

        // Advance angle
        person.angle += person.speed * safeDt;
        if (person.angle > Math.PI * 2) person.angle -= Math.PI * 2;

        const radius = scoreToRadius(person.totalScore);
        const x = Math.cos(person.angle) * radius;
        const y = Math.sin(person.angle) * radius;

        group.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;

        const labelGroup = labelsContainer.querySelector(`.label-group[data-id="${person.id}"]`);
        if (labelGroup) {
          labelGroup.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        }
      });

      // Size orbit rings based on score thresholds
      // Level 3 ring: inner edge at score 28 (planets 28-36 inside)
      // Level 2 ring: inner edge at score 18 (planets 18-27 inside)
      // Level 1 ring: inner edge at score 8  (planets 8-17 inside)
      // Level 0 ring: outer boundary at score 0
      const ringThresholds = { 3: 28, 2: 18, 1: 8, 0: 0 };

      [3, 2, 1, 0].forEach(level => {
        const r = scoreToRadius(ringThresholds[level]);
        const ring = document.querySelector(`.orbit-ring[data-level="${level}"]`);
        if (ring) {
          ring.style.width = `${r * 2}px`;
          ring.style.height = `${r * 2}px`;
        }

        const label = document.querySelector(`.level-label--${level}`);
        if (label) {
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
        ${initials}
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
// BOOT
// ═══════════════════════════════════════════

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
