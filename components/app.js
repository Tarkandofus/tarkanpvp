/**
 * DOFUS PVP ACADEMY - Application Core
 * Fonctions partagées entre toutes les pages
 */

// =================== IMAGES OFFICIELLES DES CLASSES ===================
const CLASS_IMAGES = {
  'Feca':         'assets/classes/feca.jpg',
  'Osamodas':     'assets/classes/osamodas.jpg',
  'Enutrof':      'assets/classes/enutrof.jpg',
  'Sram':         'assets/classes/sram.jpg',
  'Xelor':        'assets/classes/xelor.jpg',
  'Ecaflip':      'assets/classes/ecaflip.jpg',
  'Eniripsa':     'assets/classes/eniripsa.jpg',
  'Iop':          'assets/classes/iop.jpg',
  'Cra':          'assets/classes/cra.jpg',
  'Sadida':       'assets/classes/sadida.jpg',
  'Sacrieur':     'assets/classes/sacrieur.jpg',
  'Pandawa':      'assets/classes/pandawa.jpg',
  'Roublard':     'assets/classes/roublard.jpg',
  'Forgelance':   'assets/classes/forgelance.jpg',
  'Zobal':        'assets/classes/zobal.jpg',
  'Steamer':      'assets/classes/steamer.jpg',
  'Eliotrope':    'assets/classes/eliotrope.jpg',
  'Huppermage':   'assets/classes/huppermage.jpg',
  'Ouginak':      'assets/classes/ouginak.jpg',
  'Forgelance':   'assets/classes/forgelance.jpg',
};

// Fallback emoji si image pas dispo
const CLASS_EMOJIS = {
  'Feca':'🛡️','Osamodas':'🐉','Enutrof':'💰','Sram':'💀','Xelor':'⏰',
  'Ecaflip':'🎲','Eniripsa':'💊','Iop':'⚔️','Cra':'🏹','Sadida':'🌿',
  'Sacrieur':'🩸','Pandawa':'🍶','Roublard':'💣',
  'Zobal':'🤹','Steamer':'⚙️','Eliotrope':'🌀','Huppermage':'✨','Ouginak':'🐺','Forgelance':'⚒️',
};

// Helper : renvoie un <img> ou un emoji selon dispo
function classAvatar(nom, size = 52) {
  const rawPath = CLASS_IMAGES[nom];
  if (!rawPath) {
    return `<span style="display:flex;width:${size}px;height:${size}px;align-items:center;justify-content:center;font-size:${Math.round(size*0.55)}px;background:var(--bg-surface);border-radius:6px">${CLASS_EMOJIS[nom]||'❓'}</span>`;
  }
  // Détecter si on est dans /pages/ ou à la racine
  const isSubPage = window.location.pathname.includes('/pages/');
  const prefix = isSubPage ? '../' : '';
  const url = prefix + rawPath;
  return `<img src="${url}" alt="${nom}" style="width:${size}px;height:${size}px;object-fit:cover;border-radius:6px;display:block;" loading="lazy" onerror="this.outerHTML='<span style=\\'display:flex;width:${size}px;height:${size}px;align-items:center;justify-content:center;font-size:${Math.round(size*0.55)}px;background:var(--bg-surface);border-radius:6px\\'>${CLASS_EMOJIS[nom]||'❓'}</span>'">`; 
}

const ELEMENT_COLORS = {
  'Feu': 'feu',
  'Air': 'air',
  'Terre': 'terre',
  'Eau': 'eau',
  'Multi': 'multi',
  'Multi-éléments': 'multi',
  'Neutre / Feu': 'feu',
  'Air / Feu': 'feu',
  'Feu / Eau': 'feu',
  'Feu / Air': 'feu',
  'Feu / Terre': 'feu',
  'Terre / Air': 'terre',
  'Eau / Air': 'eau',
  'Air / Eau': 'air'
};

const BUDGET_COLORS = {
  'Élevé': 'eleve',
  'Moyen': 'moyen',
  'Faible': 'faible'
};

// =================== DATA LOADING ===================
async function loadJSON(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (e) {
    console.error(`Erreur chargement ${path}:`, e);
    return null;
  }
}

// Détecter le bon chemin selon la page courante
function getDataPath(filename) {
  const depth = window.location.pathname.includes('/pages/') ? '../' : '';
  return `${depth}data/${filename}`;
}

// =================== RENDER FUNCTIONS ===================

/**
 * Render une carte de build
 */
function renderBuildCard(build, onclick = '') {
  const elClass = ELEMENT_COLORS[build.element] || 'feu';
  const budgetClass = BUDGET_COLORS[build.budget] || 'moyen';
  const clickHandler = onclick || `openBuildModal('${build.id}')`;

  return `
    <div class="build-card" onclick="${clickHandler}" role="button" tabindex="0" aria-label="Build ${build.nom}">
      <div class="build-card-header">
        <div class="build-class-icon" style="overflow:hidden;padding:0;">
          ${classAvatar(build.classe, 52)}
        </div>
        <div class="build-card-info">
          <div class="build-card-name">${build.nom}</div>
          <div class="build-card-meta">
            <span class="tag tag-element-${elClass}">${build.element}</span>
            <span class="tag tag-budget-${budgetClass}">${build.budget}</span>
            <span class="tier-badge tier-${build.tier}">${build.tier}</span>
          </div>
        </div>
      </div>
      <div class="build-card-body">
        <p class="build-desc">${build.description}</p>
      </div>
      <div class="build-card-footer">
        <div class="build-stats-mini">
          <div class="stat-mini">
            <span class="stat-mini-label">PA</span>
            <span class="stat-mini-value">${build.stats.pa}</span>
          </div>
          <div class="stat-mini">
            <span class="stat-mini-label">PM</span>
            <span class="stat-mini-value">${build.stats.pm}</span>
          </div>
          <div class="stat-mini">
            <span class="stat-mini-label">Vita</span>
            <span class="stat-mini-value">${(build.stats.vita / 1000).toFixed(1)}k</span>
          </div>
        </div>
        <span>👁 ${build.vues.toLocaleString()}</span>
      </div>
    </div>
  `;
}

/**
 * Render une ligne de tier list
 */
function renderTierRow(tier, classes) {
  const chips = classes.map(c => `
    <div class="tier-class-chip" onclick="openClassModal('${c.id}')" title="${c.nom} — ${c.role}">
      <div style="width:28px;height:28px;border-radius:4px;overflow:hidden;flex-shrink:0">
        ${classAvatar(c.nom, 28)}
      </div>
      <span>${c.nom}</span>
    </div>
  `).join('');

  return `
    <div class="tier-row">
      <div class="tier-label tier-label-${tier}">${tier}</div>
      <div class="tier-classes">${chips || '<span style="color:var(--text-muted);font-size:13px">Aucune classe</span>'}</div>
    </div>
  `;
}

/**
 * Render une carte classe (grille de sélection)
 */
function renderClassCard(cls, active = false) {
  return `
    <div class="class-card ${active ? 'active-class' : ''}"
         data-class="${cls.nom}"
         onclick="filterByClass('${cls.nom}')"
         role="button" tabindex="0" aria-label="${cls.nom}">
      <span class="class-card-tier"><span class="tier-badge tier-${cls.tier}">${cls.tier}</span></span>
      <div class="class-card-img" style="width:64px;height:64px;border-radius:8px;overflow:hidden;margin:0 auto 6px;">
        ${classAvatar(cls.nom, 64)}
      </div>
      <div class="class-card-name">${cls.nom}</div>
      <div class="class-card-element">${cls.element_principal}</div>
    </div>
  `;
}

/**
 * Render contenu complet d'un build (modal / page dédiée)
 */
function renderBuildDetail(build) {
  const elClass = ELEMENT_COLORS[build.element] || 'feu';
  const budgetClass = BUDGET_COLORS[build.budget] || 'moyen';

  const statLabels = {
    vita: 'Vitalité', force: 'Force', intelligence: 'Intelligence',
    agilite: 'Agilité', chance: 'Chance', sagesse: 'Sagesse',
    pa: 'PA', pm: 'PM', ini: 'Initiative', res_neutre: 'Rés Neutre',
    res_feu: 'Rés Feu', res_air: 'Rés Air', res_terre: 'Rés Terre', res_eau: 'Rés Eau'
  };

  const statsHTML = Object.entries(build.stats).map(([key, val]) => `
    <div class="stat-box">
      <span class="stat-box-value">${val.toLocaleString()}</span>
      <span class="stat-box-label">${statLabels[key] || key}</span>
    </div>
  `).join('');

  const equipHTML = build.equipements.map(e => `
    <div class="equip-item">
      <span class="equip-slot">${e.slot}</span>
      <span class="equip-name">${e.nom}</span>
      <span class="equip-bonus">${e.pa ? `+${e.pa}PA` : ''}${e.pm ? ` +${e.pm}PM` : ''}</span>
    </div>
  `).join('');

  const sortsHTML = build.sorts_cles.map(s => `<span class="sort-chip">✦ ${s}</span>`).join('');

  const variHTML = build.variantes.length > 0
    ? build.variantes.map(v => `
        <div style="padding:12px;background:var(--bg-surface);border-radius:var(--radius-sm);border:1px solid var(--border-subtle);margin-bottom:8px;">
          <strong style="font-family:var(--font-display);color:var(--accent-gold)">${v.nom}</strong>
          <p style="font-size:13px;color:var(--text-secondary);margin-top:4px">${v.description}</p>
        </div>
      `).join('')
    : '<p style="color:var(--text-muted);font-size:13px">Aucune variante disponible.</p>';

  return `
    <div class="build-detail-hero">
      <div class="build-detail-icon" style="overflow:hidden;padding:0;">
        ${classAvatar(build.classe, 100)}
      </div>
      <div>
        <h1 class="build-detail-name">${build.nom}</h1>
        <div class="build-detail-tags">
          <span class="tag tag-element-${elClass}">${build.element}</span>
          <span class="tag tag-budget-${budgetClass}">Budget ${build.budget}</span>
          <span class="tier-badge tier-${build.tier}">Tier ${build.tier}</span>
          <span style="font-size:12px;color:var(--text-muted);font-family:var(--font-mono)">${build.classe}</span>
        </div>
        <p class="build-description">${build.description}</p>
      </div>
    </div>

    <div class="build-section">
      <div class="build-section-title">📋 Stratégie</div>
      <p style="color:var(--text-secondary);line-height:1.7;font-size:14px">${build.strategie}</p>
    </div>

    <div class="build-section">
      <div class="build-section-title">⚖ Points forts & faibles</div>
      <div class="points-grid">
        <div class="points-col points-forts">
          <h4>Points forts</h4>
          <ul class="points-list">${build.points_forts.map(p => `<li>${p}</li>`).join('')}</ul>
        </div>
        <div class="points-col points-faibles">
          <h4>Points faibles</h4>
          <ul class="points-list">${build.points_faibles.map(p => `<li>${p}</li>`).join('')}</ul>
        </div>
      </div>
    </div>

    <div class="build-section">
      <div class="build-section-title">🗡 Sorts clés</div>
      <div class="sorts-list">${sortsHTML}</div>
    </div>

    <div class="build-section">
      <div class="build-section-title">📊 Statistiques cibles</div>
      <div class="stats-display">${statsHTML}</div>
    </div>

    <div class="build-section">
      <div class="build-section-title">🎽 Équipements</div>
      <div class="equip-list">${equipHTML}</div>
    </div>

    ${build.variantes.length > 0 ? `
    <div class="build-section">
      <div class="build-section-title">🔄 Variantes</div>
      ${variHTML}
    </div>` : ''}

    <div style="display:flex;gap:12px;justify-content:flex-end;padding-top:8px;flex-wrap:wrap">
      <span style="font-size:12px;color:var(--text-muted);font-family:var(--font-mono);align-self:center">
        👤 ${build.auteur} · 📅 ${new Date(build.date_ajout).toLocaleDateString('fr-FR')} · 👁 ${build.vues.toLocaleString()} vues
      </span>
    </div>
  `;
}

// =================== MODAL SYSTEM ===================
let _allBuilds = null;
let _allClasses = null;

async function ensureData() {
  if (!_allBuilds) _allBuilds = await loadJSON(getDataPath('builds.json'));
  if (!_allClasses) _allClasses = await loadJSON(getDataPath('classes.json'));
}

async function openBuildModal(buildId) {
  await ensureData();
  const build = _allBuilds.find(b => b.id === buildId);
  if (!build) return;

  let modal = document.getElementById('globalModal');
  if (!modal) {
    modal = createModal();
    document.body.appendChild(modal);
  }

  const titleEl = modal.querySelector('#modalTitle');
  const bodyEl = modal.querySelector('#modalBody');

  titleEl.innerHTML = `${CLASS_EMOJIS[build.classe] || '⚔'} ${build.nom}`;
  bodyEl.innerHTML = renderBuildDetail(build);

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

async function openClassModal(classId) {
  await ensureData();
  const cls = _allClasses.find(c => c.id === classId);
  if (!cls) return;

  const buildsForClass = _allBuilds.filter(b => b.classe === cls.nom);
  const emoji = CLASS_EMOJIS[cls.nom] || '❓';

  let modal = document.getElementById('globalModal');
  if (!modal) {
    modal = createModal();
    document.body.appendChild(modal);
  }

  modal.querySelector('#modalTitle').innerHTML = `<div style="width:32px;height:32px;border-radius:6px;overflow:hidden;display:inline-flex;vertical-align:middle;margin-right:8px">${classAvatar(cls.nom, 32)}</div>${cls.nom} — ${cls.role}`;

  const buildsHTML = buildsForClass.length > 0
    ? `<div class="builds-grid">${buildsForClass.map(b => renderBuildCard(b)).join('')}</div>`
    : '<p style="color:var(--text-muted);padding:20px;text-align:center">Aucun build disponible pour cette classe.</p>';

  modal.querySelector('#modalBody').innerHTML = `
    <div style="display:flex;gap:20px;align-items:start;margin-bottom:24px;flex-wrap:wrap">
      <div style="width:80px;height:80px;border-radius:10px;overflow:hidden;flex-shrink:0">${classAvatar(cls.nom, 80)}</div>
      <div style="flex:1">
        <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap">
          <span class="tier-badge tier-${cls.tier}">Tier ${cls.tier}</span>
          <span class="tag tag-element-${ELEMENT_COLORS[cls.element_principal] || 'feu'}">${cls.element_principal}</span>
          <span style="font-size:12px;color:var(--text-muted);align-self:center">${cls.role}</span>
        </div>
        <p style="color:var(--text-secondary);font-size:14px;line-height:1.6;margin-bottom:12px">${cls.description}</p>
        <p style="color:var(--text-secondary);font-size:13px;font-style:italic;border-left:2px solid var(--border-gold);padding-left:12px">${cls.tier_comment}</p>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px">
      <div style="background:var(--bg-surface);padding:16px;border-radius:var(--radius-sm);border:1px solid var(--border-subtle)">
        <div style="font-size:11px;color:var(--text-muted);font-family:var(--font-mono);text-transform:uppercase;margin-bottom:8px">Popularité</div>
        <div style="font-size:28px;font-weight:700;color:var(--accent-gold);font-family:var(--font-display)">${cls.popularite}%</div>
      </div>
      <div style="background:var(--bg-surface);padding:16px;border-radius:var(--radius-sm);border:1px solid var(--border-subtle)">
        <div style="font-size:11px;color:var(--text-muted);font-family:var(--font-mono);text-transform:uppercase;margin-bottom:8px">Win Rate</div>
        <div style="font-size:28px;font-weight:700;color:var(--accent-gold);font-family:var(--font-display)">${cls.win_rate}%</div>
      </div>
    </div>

    <h3 style="font-family:var(--font-display);font-size:16px;margin-bottom:16px;color:var(--accent-gold);text-transform:uppercase;letter-spacing:0.1em">
      Builds disponibles (${buildsForClass.length})
    </h3>
    ${buildsHTML}
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function createModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'globalModal';
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <h2 class="section-title" id="modalTitle" style="font-size:20px;margin:0"></h2>
        <button class="modal-close" onclick="closeModal()" aria-label="Fermer">✕</button>
      </div>
      <div class="modal-body" id="modalBody"></div>
    </div>
  `;

  // Close on overlay click
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });

  return overlay;
}

function closeModal() {
  const modal = document.getElementById('globalModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// =================== NAVIGATION ===================
function setActiveNav(page) {
  document.querySelectorAll('.nav-menu a').forEach(a => {
    a.classList.remove('active');
    if (a.dataset.page === page) a.classList.add('active');
  });
}

// Hamburger menu
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });
  }
});

// =================== BAR CHART ANIMATION ===================
function animateBarCharts() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.bar-fill').forEach(bar => {
          const target = bar.dataset.value;
          bar.style.width = target + '%';
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.bar-chart').forEach(chart => {
    observer.observe(chart);
    // Set initial width to 0
    chart.querySelectorAll('.bar-fill').forEach(bar => {
      bar.style.transition = 'width 0.8s ease';
      bar.style.width = '0';
    });
  });
}

// =================== FILTER SYSTEM ===================
let currentClassFilter = 'all';
let currentElementFilter = 'all';
let currentBudgetFilter = 'all';
let currentSearch = '';
let currentCategory = 'all';

function filterBuilds(builds) {
  return builds.filter(b => {
    const matchClass = currentClassFilter === 'all' || b.classe === currentClassFilter;
    const matchElement = currentElementFilter === 'all' || b.element.includes(currentElementFilter);
    const matchBudget = currentBudgetFilter === 'all' || b.budget === currentBudgetFilter;
    const matchCategory = currentCategory === 'all' || b.categorie === currentCategory;
    const matchSearch = currentSearch === '' ||
      b.nom.toLowerCase().includes(currentSearch.toLowerCase()) ||
      b.classe.toLowerCase().includes(currentSearch.toLowerCase()) ||
      b.description.toLowerCase().includes(currentSearch.toLowerCase());
    return matchClass && matchElement && matchBudget && matchCategory && matchSearch;
  });
}

function filterByClass(className) {
  currentClassFilter = currentClassFilter === className ? 'all' : className;
  if (typeof renderBuildsPage === 'function') renderBuildsPage();

  document.querySelectorAll('.class-card').forEach(card => {
    card.classList.toggle('active', card.dataset.class === currentClassFilter);
    card.style.borderColor = card.dataset.class === currentClassFilter ? 'var(--accent-gold)' : '';
    card.style.background = card.dataset.class === currentClassFilter ? 'var(--accent-gold-dim)' : '';
  });
}

// =================== ELEMENT FILTER COLORS ===================
function getElementTag(element) {
  const el = element.split('/')[0].trim();
  const colorMap = {
    'Feu': 'feu', 'Air': 'air', 'Terre': 'terre', 'Eau': 'eau',
    'Multi': 'multi', 'Neutre': 'feu'
  };
  return colorMap[el] || 'feu';
}

console.log('🎮 Tarkan PvP — App Core chargée');

// =================== CODE CREATEUR COPY ===================
function copyCreatorCode(el) {
  navigator.clipboard.writeText('TARKAN').then(() => {
    el.classList.add('copied');
    const name = el.querySelector('.creator-name');
    const orig = name.textContent;
    name.textContent = '✓ Copié !';
    setTimeout(() => {
      el.classList.remove('copied');
      name.textContent = orig;
    }, 2000);
  }).catch(() => {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = 'TARKAN';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    const name = el.querySelector('.creator-name');
    const orig = name.textContent;
    name.textContent = '✓ Copié !';
    setTimeout(() => { name.textContent = orig; }, 2000);
  });
}
