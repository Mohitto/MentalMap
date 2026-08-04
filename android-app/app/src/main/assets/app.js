/**
 * MentalMap — Planetary Relationship Mapper
 * Maps your relationships as planets orbiting you (the Sun).
 * Scoring: 0-9 pts = Level 1 (farthest), 10-19 = Level 2, 20-30 = Level 3 (closest).
 */

// ═══════════════════════════════════════════
// SURVEY DATA
// ═══════════════════════════════════════════

const SURVEY_QUESTIONS = [
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
    text: 'Jak ta osoba reaguje, gdy mówisz o swoim małym sukcesie lub czymś dla ciebie ważnym?',
    answers: [
      { points: 3, text: 'Aktywnie dopytuje o szczegóły i skupia się na tym, co mówisz.' },
      { points: 2, text: 'Reaguje krótko, ale pozytywnie (np. pisze "super", "gratulacje").' },
      { points: 1, text: 'Ignoruje wiadomość, nie czyta jej lub odhacza, zostawiając jedynie reakcję (np. lajka).' },
      { points: 0, text: 'Umniejsza znaczenie twojego sukcesu lub natychmiast przekierowuje rozmowę na siebie.' }
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
    text: 'Jak wygląda wsparcie w sytuacjach, gdy potrzebujesz pomocy?',
    answers: [
      { points: 3, text: 'Proponuje pomoc, zanim wprost o nią poprosisz.' },
      { points: 2, text: 'Pomaga, gdy jasno i bezpośrednio sformułujesz prośbę.' },
      { points: 1, text: 'Szuka wymówek, kalkuluje lub zgadza się, ale z widoczną niechęcią.' },
      { points: 0, text: 'Całkowicie odcina się od problemu, nie daje żadnego wsparcia.' }
    ]
  },
  {
    text: 'Jak głęboko możecie porozmawiać (osobiste przemyślenia, prywatne sprawy)?',
    answers: [
      { points: 3, text: 'Swobodnie wymieniacie się myślami, bez obawy o ocenę.' },
      { points: 2, text: 'Rozmawiacie ostrożnie, dawkując sobie prywatne informacje.' },
      { points: 1, text: 'Tematy zatrzymują się na płytkich sprawach (np. pogoda, codzienne obowiązki).' },
      { points: 0, text: 'Musisz ukrywać swoje poglądy i myśli z obawy przed atakiem lub krytyką.' }
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
  },
  {
    text: 'Czy ta osoba cię inspiruje?',
    answers: [
      { points: 6, text: 'Inspiruje mnie do samych dobrych rzeczy.' },
      { points: 4, text: 'Nie inspiruje mnie wcale.' },
      { points: 2, text: 'Inspiruje mnie zarówno do dobrych, jak i złych rzeczy.' },
      { points: 0, text: 'Inspiruje mnie do złych rzeczy.' }
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
const APP_VERSION = 'v0.9.4';

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
  gateTitle.textContent = `0. ${GATE_QUESTION.text}`;
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
    title.textContent = `${qIndex + 1}. ${q.text}`;
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
        p.orbitOffset = getOrbitOffsetForScore(p.totalScore, level);
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
  if (score >= 30) return 3;
  if (score >= 20) return 2;
  if (score >= 10) return 1;
  return 0;
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

function getOrbitOffsetForScore(score, level) {
  if (level === 3) return (34.5 - score) * 6;
  if (level === 2) return (24.5 - score) * 6;
  if (level === 1) return (14.5 - score) * 6;
  return (4.5 - score) * 6;
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
    if (e.key === 'Escape' && surveyModal?.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });
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
  } else if (!rankingView.classList.contains('hidden')) {
    toggleRankingView(true); // Close ranking view
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
    // No initials text — planets are clean colored circles

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
    const radii = getOrbitalRadii();

    const groups = planetsContainer?.querySelectorAll('.planet-group');
    if (groups) {
      groups.forEach(group => {
        const person = people.find(p => p.id === group.dataset.id);
        if (!person) return;

        // Advance angle
        person.angle += person.speed * safeDt;
        if (person.angle > Math.PI * 2) person.angle -= Math.PI * 2;

        const radius = (radii[person.level] ?? radii[0]) + (person.orbitOffset || 0);
        const x = Math.cos(person.angle) * radius;
        const y = Math.sin(person.angle) * radius;

        group.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;

        const labelGroup = labelsContainer.querySelector(`.label-group[data-id="${person.id}"]`);
        if (labelGroup) {
          const labelOffsetY = 0; // centered on the planet
          labelGroup.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y + labelOffsetY}px))`;
        }
      });

      // Update orbit rings sizes to match scale
      [3, 2, 1, 0].forEach(level => {
        const ring = document.querySelector(`.orbit-ring[data-level="${level}"]`);
        if (ring) {
          ring.style.width = `${radii[level] * 2}px`;
          ring.style.height = `${radii[level] * 2}px`;
        }
        
        const label = document.querySelector(`.level-label--${level}`);
        if (label) {
          label.style.top = `calc(50% - ${radii[level]}px)`;
          label.style.left = '50%';
          label.style.right = 'auto';
          label.style.transform = 'translate(-50%, -100%)'; // Center horizontally, sit perfectly above the line
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
