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
  }
];

const STORAGE_KEY = 'mentalmap_people';

// Orbit radii for each level (pixels from center)
const BASE_RADII = { 3: 100, 2: 170, 1: 240 };

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

// ═══════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════

let people = [];
let editingId = null;
let animationFrameId = null;
let lastTimestamp = 0;

// ═══════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════

function init() {
  buildSurveyForm();
  loadPeople();
  bindEvents();
  startAnimation();
  updateEmptyState();
}

// ═══════════════════════════════════════════
// SURVEY FORM GENERATION
// ═══════════════════════════════════════════

function buildSurveyForm() {
  if (!questionsContainer) return;

  questionsContainer.innerHTML = '';

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

      // Update score preview on selection
      radio.addEventListener('change', updateScorePreview);

      const textSpan = document.createElement('span');
      textSpan.className = 'answer-text';
      textSpan.textContent = answer.text;

      const pointsBadge = document.createElement('span');
      pointsBadge.className = 'answer-points';
      pointsBadge.textContent = `${answer.points} pkt`;

      label.appendChild(radio);
      label.appendChild(textSpan);
      label.appendChild(pointsBadge);
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
  let total = 0;
  for (let i = 0; i < SURVEY_QUESTIONS.length; i++) {
    const checked = surveyForm.querySelector(`input[name="q${i}"]:checked`);
    if (checked) total += parseInt(checked.value, 10);
  }

  const level = getLevel(total);
  const pct = Math.round((total / 30) * 100);

  if (scoreValue) scoreValue.textContent = total;
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
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      people = JSON.parse(raw);
      // Backfill missing properties for backwards compat
      people.forEach(p => {
        if (typeof p.angle !== 'number') p.angle = Math.random() * Math.PI * 2;
        if (typeof p.speed !== 'number') p.speed = getRandomSpeed(p.level);
        if (typeof p.gradientIndex !== 'number') p.gradientIndex = Math.floor(Math.random() * PLANET_GRADIENTS.length);
      });
    }
  } catch (e) {
    console.error('Failed to load data:', e);
    people = [];
  }
  renderPlanets();
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
  if (score >= 20) return 3;
  if (score >= 10) return 2;
  return 1;
}

function getRandomSpeed(level) {
  // Closer planets orbit slightly faster
  const baseSpeed = 0.15 + (level * 0.05); // radians per second
  return baseSpeed + (Math.random() * 0.1 - 0.05);
}

function getOrbitalRadii() {
  const minDim = Math.min(window.innerWidth, window.innerHeight);
  const scale = minDim < 600 ? (minDim / 600) : 1;
  return {
    3: BASE_RADII[3] * scale,
    2: BASE_RADII[2] * scale,
    1: BASE_RADII[1] * scale
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
  modalTitle.textContent = 'Nowa relacja';
  btnDelete.style.display = 'none';
  resetScorePreview();
  surveyModal.setAttribute('aria-hidden', 'false');
  // Focus name input after animation
  setTimeout(() => personNameInput?.focus(), 400);
}

function openEditModal(id) {
  const person = people.find(p => p.id === id);
  if (!person) return;

  editingId = id;
  surveyForm.reset();
  personNameInput.value = person.name;

  // Pre-fill answers
  person.answers.forEach((pts, i) => {
    const radio = surveyForm.querySelector(`input[name="q${i}"][value="${pts}"]`);
    if (radio) radio.checked = true;
  });

  modalTitle.textContent = `Edytuj: ${person.name}`;
  btnDelete.style.display = 'flex';

  updateScorePreview();
  surveyModal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  surveyModal.setAttribute('aria-hidden', 'true');
  editingId = null;
}

function resetScorePreview() {
  if (scoreValue) scoreValue.textContent = '0';
  if (scoreLevel) {
    scoreLevel.textContent = 'Poziom 1';
    scoreLevel.className = 'score-preview__level level-1';
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

  // Collect all answers
  const answers = [];
  let totalScore = 0;
  let allAnswered = true;

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
    // Scroll to first unanswered question
    for (let i = 0; i < SURVEY_QUESTIONS.length; i++) {
      const checked = surveyForm.querySelector(`input[name="q${i}"]:checked`);
      if (!checked) {
        const cards = questionsContainer.querySelectorAll('.question-card');
        if (cards[i]) {
          cards[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
          cards[i].style.outline = '2px solid #ef476f';
          cards[i].style.outlineOffset = '4px';
          setTimeout(() => {
            cards[i].style.outline = '';
            cards[i].style.outlineOffset = '';
          }, 2000);
        }
        return;
      }
    }
  }

  const level = getLevel(totalScore);

  if (editingId) {
    // Update existing
    const person = people.find(p => p.id === editingId);
    if (person) {
      person.name = name;
      person.answers = answers;
      person.totalScore = totalScore;
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
      totalScore,
      level,
      angle: Math.random() * Math.PI * 2,
      speed: getRandomSpeed(level),
      gradientIndex: Math.floor(Math.random() * PLANET_GRADIENTS.length)
    });
  }

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
  if (!planetsContainer) return;

  // Remove old planets
  planetsContainer.innerHTML = '';

  people.forEach(person => {
    const group = document.createElement('div');
    group.className = 'planet-group';
    group.dataset.id = person.id;

    // Planet sphere
    const planetEl = document.createElement('div');
    planetEl.className = 'planet';
    const grad = PLANET_GRADIENTS[person.gradientIndex % PLANET_GRADIENTS.length];
    planetEl.style.background = `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`;
    planetEl.style.setProperty('--planet-glow', `${grad[0]}66`);
    planetEl.textContent = getInitials(person.name);

    // Name label
    const label = document.createElement('div');
    label.className = 'planet-label';
    label.textContent = person.name;

    // Score indicator
    const scoreBadge = document.createElement('div');
    scoreBadge.className = 'planet-score';
    scoreBadge.textContent = `${person.totalScore} pkt`;

    // Tap to edit
    group.addEventListener('click', () => openEditModal(person.id));

    group.appendChild(planetEl);
    group.appendChild(label);
    group.appendChild(scoreBadge);
    planetsContainer.appendChild(group);
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

        const radius = radii[person.level] || 170;
        const x = Math.cos(person.angle) * radius;
        const y = Math.sin(person.angle) * radius;

        group.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
      });
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animationFrameId = requestAnimationFrame(animate);
}

// ═══════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
