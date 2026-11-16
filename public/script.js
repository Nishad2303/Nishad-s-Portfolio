(() => {
  document.querySelectorAll('.site-loader-mark img, .journey-loader-spinner img').forEach((image) => {
    image.addEventListener('error', () => { image.hidden = true; }, { once: true });
  });

  const loader = document.querySelector('.site-loader');
  if (!loader) return;

  const minimumVisibleMs = 520;
  const startedAt = performance.now();
  let dismissed = false;

  const dismissLoader = () => {
    if (dismissed) return;
    dismissed = true;
    window.setTimeout(() => {
      loader.classList.add('is-hidden');
      window.setTimeout(() => loader.remove(), 550);
    }, Math.max(0, minimumVisibleMs - (performance.now() - startedAt)));
  };

  if (document.readyState === 'complete') dismissLoader();
  else window.addEventListener('load', dismissLoader, { once: true });
  window.setTimeout(dismissLoader, 4500);
})();

const skillItems = [
  { word: 'PROTOTYPING', title: 'Prototyping', description: 'Turn an early concept into a form that can be examined and refined.', icon: '◇' },
  { word: 'DESIGN', title: 'Design', description: 'Balance purpose, form, and function in an engineering concept.', icon: '⌬' },
  { word: 'CREATIVITY', title: 'Creativity', description: 'Bring fresh ideas into the design and problem solving process.', icon: '✳' },
  { word: 'ANALYSIS', title: 'Analysis', description: 'Use engineering fundamentals to understand how a design behaves.', icon: '▦' },
  { word: 'SIMULATION', title: 'Simulation', description: 'Study how an engineering system behaves through simulation.', icon: '≈' },
  { word: 'CAD', title: 'CAD', description: 'Create precise computer aided designs for parts and assemblies.', icon: '⌖' },
  { word: 'METALS', title: 'Metals', description: 'Explore the properties and uses of metals in engineered products.', icon: '⚙' },
  { word: 'LEADERSHIP', title: 'Leadership', description: 'Guide collaboration and keep a team moving toward a shared goal.', icon: '✦' },
  { word: 'INNOVATIVE', title: 'Innovative thinking', description: 'Explore new ways to approach engineering challenges.', icon: '✧' },
];

const gridRows = [
  'PDCAB SCDMLIAE'.replaceAll(' ', ''),
  'RERNFIGHEENPI',
  'OSEAJMKLTANRM',
  'TIALNUCOADOEP',
  'OGTYQLARLEVES',
  "TNISHAD'SRAAY",
  'YTVIUTVWXSTIT',
  'PZISAIBDCHICU',
  'IETKLOHIJIVUR',
  'NPYFQNOM GPELB'.replaceAll(' ', ''),
  'GSWRPORTFOLIO',
].map((row) => Array.from(row));

const rows = gridRows.length;
const columns = gridRows[0].length;
const grid = document.querySelector('.letter-grid');
const starfield = document.querySelector('.starfield');
if (grid) {
const skillCells = new Map();
const highlightedCells = new Set();

[
  ["NISHAD'S", 5, 1],
  ['PORTFOLIO', 10, 4],
].forEach(([word, row, startColumn]) => {
  Array.from(word).forEach((letter, offset) => {
    const column = startColumn + offset;
    if (gridRows[row][column] !== letter) {
      throw new Error(`Title letters do not match at row ${row + 1}, column ${column + 1}`);
    }
    highlightedCells.add(`${row}:${column}`);
  });
});

[
  ['PROTOTYPING', 0, 0],
  ['DESIGN', 0, 1],
  ['CREATIVITY', 0, 2],
  ['ANALYSIS', 0, 3],
  ['SIMULATION', 0, 5],
  ['CAD', 3, 6],
  ['METALS', 0, 8],
  ['LEADERSHIP', 0, 9],
  ['INNOVATIVE', 0, 10],
].forEach(([word, startRow, column]) => {
  Array.from(word).forEach((letter, offset) => {
    const row = startRow + offset;
    if (gridRows[row]?.[column] !== letter) {
      throw new Error(`Skill letters do not match for ${word} at row ${row + 1}, column ${column + 1}`);
    }
    skillCells.set(`${row}:${column}`, word);
  });
});

gridRows.forEach((row, rowIndex) => {
  const rowEl = document.createElement('div');
  rowEl.className = 'grid-row';
  row.forEach((letter, colIndex) => {
    const cell = document.createElement('button');
    const key = `${rowIndex}:${colIndex}`;
    const word = skillCells.get(key);
    const highlighted = highlightedCells.has(key);
    const skill = skillItems.find((item) => item.word === word);
    cell.type = 'button';
    cell.className = 'skill-cell';
    cell.dataset.word = word || '';
    cell.textContent = letter;
    cell.setAttribute('aria-label', skill ? `Explore ${skill.title}` : highlighted ? 'Nishad portfolio title' : 'Letter grid decoration');
    if (highlighted) cell.classList.add('name-cell');
    if (word) {
      cell.classList.add('skill-word');
      cell.addEventListener('mouseenter', () => showSkill(word));
      cell.addEventListener('focus', () => showSkill(word));
      cell.addEventListener('click', () => showSkill(word));
      cell.addEventListener('keydown', (event) => moveFocus(event, rowIndex, colIndex));
    } else {
      cell.tabIndex = -1;
      cell.setAttribute('aria-hidden', 'true');
      if (!highlighted) cell.classList.add('no-skill');
    }
    rowEl.append(cell);
  });
  grid.append(rowEl);
});

function showSkill(word) {
  const skill = skillItems.find((item) => item.word === word);
  if (!skill) return;
  let revealPosition = 0;
  grid.querySelectorAll('.skill-cell').forEach((cell) => {
    const active = cell.dataset.word === word;
    cell.classList.toggle('skill-cell-active', active);
    cell.setAttribute('aria-pressed', String(active));
    if (active) {
      cell.style.setProperty('--letter-index', revealPosition);
      revealPosition += 1;
    }
  });
  document.querySelector('.skill-readout').classList.add('has-skill');
  document.querySelector('.readout-icon').textContent = skill.icon;
  document.querySelector('.readout-kicker').textContent = 'ENGINEERING INTEREST';
  document.querySelector('.readout-title').textContent = skill.title;
  document.querySelector('.readout-description').textContent = skill.description;
  document.querySelector('.readout-index').textContent = String(skillItems.indexOf(skill) + 1).padStart(2, '0');
  const copy = document.querySelector('.readout-copy');
  copy.classList.remove('is-revealing');
  requestAnimationFrame(() => copy.classList.add('is-revealing'));
}

function moveFocus(event, row, col) {
  const moves = { ArrowRight: [0, 1], ArrowLeft: [0, -1], ArrowDown: [1, 0], ArrowUp: [-1, 0] };
  const move = moves[event.key];
  if (!move) return;
  event.preventDefault();
  let nextRow = row;
  let nextCol = col;
  for (let count = 0; count < rows * columns; count += 1) {
    nextRow = (nextRow + move[0] + rows) % rows;
    nextCol = (nextCol + move[1] + columns) % columns;
    if (skillCells.has(`${nextRow}:${nextCol}`)) {
      grid.querySelectorAll('.skill-cell').item(nextRow * columns + nextCol)?.focus();
      return;
    }
  }
}
}

let seed = 7467;
function random() {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
}

for (let i = 0; i < 320; i += 1) {
  const star = document.createElement('span');
  star.className = 'star';
  star.style.left = `${random() * 100}%`;
  star.style.top = `${random() * 100}%`;
  star.style.width = `${random() > 0.88 ? 2 : 1}px`;
  star.style.height = star.style.width;
  star.style.setProperty('--star-opacity', `${0.16 + random() * 0.54}`);
  starfield.append(star);
}

const orbitLinks = [...document.querySelectorAll('.orbit-link')];
const journeySubLink = document.querySelector('.journey-sub-link');
const navItems = [...orbitLinks, journeySubLink];
const currentFile = location.pathname.split('/').pop() || 'index.html';

navItems.forEach((link) => {
  const isCurrentPage = new URL(link.href, location.href).pathname.split('/').pop() === currentFile;
  link.classList.toggle('is-active', isCurrentPage);
  link.tabIndex = 0;
  if (isCurrentPage) link.setAttribute('aria-current', 'page');
  else link.removeAttribute('aria-current');
});
