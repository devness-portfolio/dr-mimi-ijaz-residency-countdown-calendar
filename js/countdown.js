/* Both milestones are midnight in the visitor's local timezone. Months are zero-based. */
const RESIDENCY_START = new Date(2022, 6, 1, 0, 0, 0);
const RESIDENCY_END = new Date(2027, 6, 1, 0, 0, 0);
// One-off seasons in the device's local calendar; end dates are exclusive.
function seasonForDate(now) {
  // Expected civil dates; Ramadan takes precedence during Carnival overlap.
  if (now >= new Date(2027, 4, 1) && now < new Date(2027, 6, 1)) return 'dmv';
  if (now >= new Date(2027, 3, 1) && now < new Date(2027, 4, 1)) return 'beach';
  if (now >= new Date(2027, 1, 8) && now < new Date(2027, 2, 9)) return 'ramadan';
  if (now >= new Date(2027, 0, 6) && now < new Date(2027, 1, 10)) return 'mardi';
  if (now >= new Date(2026, 11, 25) && now < new Date(2027, 0, 1)) return 'nye';
  if (now >= new Date(2027, 0, 1) && now < new Date(2027, 0, 2)) return 'newyear';
  if (now.getFullYear() !== 2026) return '';
  if (now.getMonth() === 9) return 'halloween';
  return now.getMonth() === 10 && now.getDate() <= 26 ? 'fall' : '';
}
function isHalloween(now) { return seasonForDate(now) === 'halloween'; }
const NEW_YEAR_SCENES = [
  { activity: 'fireworks', pun: 'You’re the spark of my year.', affirmation: 'You make the future look bright, meri jaan.' },
  { activity: 'ringBell', pun: 'Ring in the year. You’ve already won my heart.', affirmation: 'Every little victory deserves to be celebrated.' },
  { activity: 'wishCard', pun: 'My New Year’s resolution? More you.', affirmation: 'Your next chapter is worth believing in, Dr. Mimi.' }
];
function isNewYear(season) { return season === 'nye' || season === 'newyear'; }
const MARDI_SCENES = [
  { activity: 'crawfish', pun: 'You’re craw-some, Dr. Mimi.', affirmation: 'Even on the hard days, you bring so much heart.' },
  { activity: 'catchBeads', pun: 'I bead-lieve in you, meri jaan.', affirmation: 'Every small win belongs in your parade.' },
  { activity: 'kingCake', pun: 'You take the cake, my queen.', affirmation: 'You deserve a little sweetness between rounds.' }
];
const DMV_SCENES = [
  { activity: 'museum', pun: 'You’re a national treasure, Dr. Mimi.', affirmation: 'Your curiosity and care make the world a brighter place.' },
  { activity: 'blueCrab', pun: 'You’re claw-some, hon.', affirmation: 'Even when the day gets crabby, your kindness shines through.' },
  { activity: 'trailWalk', pun: 'Virginia is for lovers. I’m here for you.', affirmation: 'One step at a time, meri jaan. You are so close to your next adventure.' }
];
const BEACH_SCENES = [
  { activity: 'sandcastle', pun: 'You’re sand-sational, Dr. Mimi.', affirmation: 'Every small step is building your beautiful next chapter.' },
  { activity: 'seashell', pun: 'Shell yeah, I believe in you.', affirmation: 'Your kindness leaves something lovely wherever you go.' },
  { activity: 'beachRead', pun: 'You deserve a shore break, meri jaan.', affirmation: 'Rest belongs in your story, too. Take a little time for yourself.' }
];
const RAMADAN_SCENES = [
  { activity: 'prayer', pun: 'You’re my favorite prayer-tner.', affirmation: 'May your quiet moments bring peace to your busy days.' },
  { activity: 'iftarDate', pun: 'My favorite date is iftar with you.', affirmation: 'You deserve sweetness, nourishment, and a gentle evening.' },
  { activity: 'fasting', pun: 'Running on empty, still full of heart.', affirmation: 'Take it one moment at a time, meri jaan. Your effort matters.' }
];
function seasonalPun(season, index) {
  if (season === 'dmv') return DMV_SCENES[((index % 3) + 3) % 3].pun;
  if (season === 'beach') return BEACH_SCENES[((index % 3) + 3) % 3].pun;
  if (season === 'ramadan') return RAMADAN_SCENES[((index % 3) + 3) % 3].pun;
  if (season === 'mardi') return MARDI_SCENES[((index % 3) + 3) % 3].pun;
  if (isNewYear(season)) return NEW_YEAR_SCENES[((index % 3) + 3) % 3].pun;
  const puns = ["You’re un-be-leaf-able, Dr. Mimi.", "I love you a latte, meri jaan.",
    "You autumn know how proud I am.", "You’re brew-tiful.", "Falling for you, one day at a time."];
  if (season === 'halloween') puns.push("You’re doing fang-tastic.", "A little boo, a lot of love.");
  return puns[((index % puns.length) + puns.length) % puns.length];
}
const DAY = 86400000;

// Clamp month-end dates: January 31 + one month becomes February 28/29.
function addMonths(date, months) {
  const result = new Date(date);
  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(date.getDate(), lastDay));
  return result;
}

function calculateCountdown(now, start = RESIDENCY_START, end = RESIDENCY_END) {
  const remaining = Math.max(0, end - now);
  const progress = Math.max(0, Math.min(100, ((now - start) / (end - start)) * 100));
  if (!remaining) return { complete: true, totalDays: 0, progress, months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  let months = Math.max(0, (end.getFullYear() - now.getFullYear()) * 12 + end.getMonth() - now.getMonth());
  if (addMonths(now, months) > end) months--;
  let rest = Math.max(0, Math.floor((end - addMonths(now, months)) / 1000));
  const weeks = Math.floor(rest / 604800); rest %= 604800;
  const days = Math.floor(rest / 86400); rest %= 86400;
  const hours = Math.floor(rest / 3600); rest %= 3600;
  const minutes = Math.floor(rest / 60);
  return { complete: false, totalDays: Math.ceil(remaining / DAY), progress, months, weeks, days, hours, minutes, seconds: rest % 60 };
}

function startPage() {
  const countdown = document.getElementById('countdown');
  const celebration = document.getElementById('celebration');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let celebrated = false;
  let timer;
  // Local review links never alter production dates or affect hosted/native apps.
  const preview = ['localhost', '127.0.0.1'].includes(window.location?.hostname)
    ? new URLSearchParams(window.location.search).get('preview') : null;
  const previewStart = { nye: new Date(2026, 11, 31, 23, 59, 50), newyear: new Date(2027, 0, 1, 12), mardi: new Date(2027, 1, 6, 12), dmv: new Date(2027, 4, 15, 12), beach: new Date(2027, 3, 15, 12), ramadan: new Date(2027, 1, 15, 12) }[preview];
  const openedAt = Date.now();
  const formatDate = date => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  document.getElementById('start-label').textContent = formatDate(RESIDENCY_START);
  document.getElementById('end-label').textContent = formatDate(RESIDENCY_END);

  function confetti() {
    const container = document.getElementById('confetti');
    container.replaceChildren();
    if (motion.matches || !celebrated) return;
    const colors = ['#d6b6df', '#edb3c8', '#dac28e', '#b9d5cd'];
    for (let i = 0; i < 24; i++) {
      const piece = document.createElement('i');
      piece.style.left = `${i * 4.2}%`;
      piece.style.background = colors[i % colors.length];
      piece.style.animationDelay = `${-(i % 9) * 0.6}s`;
      piece.style.animationDuration = `${4 + (i % 4)}s`;
      container.append(piece);
    }
  }

  function update() {
    const now = previewStart ? new Date(+previewStart + Date.now() - openedAt) : new Date();
    const result = calculateCountdown(now);
    const season = result.complete ? '' : seasonForDate(now);
    const halloween = season === 'halloween';
    document.documentElement.classList.toggle('fall', season === 'fall');
    document.documentElement.dataset.season = season;
    document.documentElement.classList.toggle('new-year', isNewYear(season));
    document.documentElement.classList.toggle('dmv', season === 'dmv');
    document.documentElement.classList.toggle('beach', season === 'beach');
    document.documentElement.classList.toggle('ramadan', season === 'ramadan');
    document.documentElement.classList.toggle('mardi', season === 'mardi');
    document.documentElement.classList.toggle('halloween', halloween);
    document.getElementById('seasonal-note').hidden = !season;
    document.querySelector('#seasonal-note span').textContent = season ? seasonalPun(season, Math.floor(now.getTime() / 14000)) : '';
    document.getElementById('seasonal-note').setAttribute('aria-label', season === 'dmv' ? 'DC, Maryland and Virginia encouragement' : season === 'beach' ? 'Beach encouragement' : season === 'ramadan' ? 'Ramadan encouragement' : season === 'mardi' ? 'Mardi Gras encouragement' : isNewYear(season) ? 'New Year encouragement' : halloween ? 'Halloween encouragement' : 'Fall encouragement');
    const newYearNote = document.getElementById('new-year-note');
    if (newYearNote) {
      newYearNote.hidden = !isNewYear(season) && season !== 'ramadan' && season !== 'beach' && season !== 'dmv';
      newYearNote.querySelector('span').textContent = season === 'dmv' ? 'DC · MARYLAND · VIRGINIA' : season === 'beach' ? 'A LITTLE SUNSHINE BETWEEN ROUNDS' : season === 'ramadan' ? 'A MONTH OF MERCY, A HEART FULL OF LOVE' : 'WITH LOVE, INTO 2027';
      newYearNote.querySelector('h2').textContent = season === 'dmv' ? 'All roads lead to you.' : season === 'beach' ? 'Shore looks good on you.' : season === 'ramadan' ? 'Ramadan Mubarak, meri jaan.' : season === 'newyear' ? 'Hello, 2027.' : 'The best is yet to come.';
      newYearNote.querySelector('p').textContent = season === 'dmv' ? 'Capital adventures. Chesapeake charm. A little Virginia love.' : season === 'beach' ? 'Soft sand. Salt air. One day closer.' : season === 'ramadan' ? 'A little patience. A little peace. So much love.' : season === 'newyear' ? 'Your graduation year is here, meri jaan.' : 'A little sparkle. A fresh chapter. Still falling for you.';
    }
    document.querySelector('meta[name="theme-color"]').content = season === 'dmv' ? '#edf0f7' : season === 'beach' ? '#e5f2ee' : season === 'ramadan' ? '#e9eef6' : season === 'mardi' ? '#f1edf8' : isNewYear(season) ? '#f3effa' : halloween ? '#f8edff' : season ? '#fff0df' : '#fff8f3';
    if (result.complete) {
      countdown.hidden = true;
      celebration.hidden = false;
      if (!celebrated) {
        celebrated = true;
        document.title = 'YOU DID IT! — Dr. Mimi Ijaz';
        confetti();
      }
      clearInterval(timer);
      return;
    }
    countdown.hidden = false;
    document.getElementById('total-days').textContent = result.totalDays;
    for (const unit of ['months', 'weeks', 'days', 'hours', 'minutes', 'seconds']) {
      document.getElementById(unit).textContent = String(result[unit]).padStart(2, '0');
    }
    const percent = Math.floor(result.progress * 10) / 10;
    document.getElementById('percentage').textContent = `${percent.toFixed(1)}% complete`;
    document.getElementById('progress').setAttribute('aria-valuenow', percent);
    document.getElementById('progress-fill').style.width = `${result.progress}%`;
  }
  timer = setInterval(update, 1000);
  update();
  document.addEventListener('visibilitychange', () => { if (!document.hidden) update(); });
  motion.addEventListener('change', confetti);
}
if (typeof document !== 'undefined') startPage();
if (typeof module !== 'undefined') module.exports = { seasonForDate, seasonalPun, isHalloween, isNewYear, NEW_YEAR_SCENES, MARDI_SCENES, RAMADAN_SCENES, BEACH_SCENES, DMV_SCENES, calculateCountdown, addMonths, RESIDENCY_START, RESIDENCY_END };
