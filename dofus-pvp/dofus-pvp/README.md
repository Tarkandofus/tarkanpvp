# ⚔ DOFUS PVP Academy — Documentation complète

> Site communautaire PvP DOFUS · Dark Gaming UI · Builds, Tier List, Meta

---

## 🗂 Structure du projet

```
dofus-pvp/
├── index.html               ← Page d'accueil
├── README.md                ← Cette documentation
│
├── pages/
│   ├── equipements.html     ← Builds & équipements (filtres, catégories)
│   ├── tierlist.html        ← Tier List PvP interactive
│   ├── meta.html            ← Analyse meta (graphiques, stats)
│   ├── youtube.html         ← Vidéos YouTube + embed
│   └── statzeum.html        ← Coming soon (structure prête)
│
├── components/
│   └── app.js               ← JS partagé : rendu, modals, filtres, utils
│
├── data/
│   ├── builds.json          ← Base de données builds PvP
│   ├── classes.json         ← Toutes les classes DOFUS + stats
│   └── meta.json            ← Données meta (popularité, win rates)
│
├── styles/
│   └── main.css             ← CSS complet (variables, composants, responsive)
│
└── assets/
    └── icons/               ← Icônes des classes (à ajouter)
```

---

## 🚀 Lancement rapide

**Option 1 — Via extension VS Code Live Server** (recommandé)
1. Ouvre le dossier `dofus-pvp/` dans VS Code
2. Click droit sur `index.html` → "Open with Live Server"

**Option 2 — Python (si installé)**
```bash
cd dofus-pvp
python -m http.server 8000
# Ouvrir : http://localhost:8000
```

**Option 3 — Node.js**
```bash
cd dofus-pvp
npx serve .
```

> ⚠️ Le site utilise `fetch()` pour charger les JSON. Il faut un serveur local (pas ouvrir directement en `file://`).

---

## ✏️ Personnaliser le site

### 1. Changer les liens Twitch / YouTube / Discord

Dans tous les fichiers HTML, chercher et remplacer :
```
VOTRE_PSEUDO_TWITCH  →  ton_pseudo_twitch
VOTRE_PSEUDO         →  ton_pseudo
VOTRE_CHAINE         →  ta_chaine_youtube
VOTRE_SERVER         →  ton_server_discord
```

### 2. Changer les vidéos YouTube

Dans `pages/youtube.html`, remplacer :
```html
<!-- Dernière vidéo vedette -->
src="https://www.youtube.com/embed/VIDEO_ID_PRINCIPAL"

<!-- Dans la grille -->
onclick="playVideo('VIDEO_ID_1')"
```

L'ID YouTube = la partie après `?v=` dans l'URL.
Exemple : `https://youtube.com/watch?v=dQw4w9WgXcQ` → ID = `dQw4w9WgXcQ`

---

## ➕ Ajouter un nouveau build

Édite `data/builds.json` et ajoute un objet avec cette structure :

```json
{
  "id": "classe-element-pvp-numero",
  "nom": "Nom du build",
  "classe": "Iop",
  "element": "Terre",
  "budget": "Élevé",
  "categorie": "top-ladder",
  "tier": "S",
  "description": "Description courte du build.",
  "points_forts": ["Force 1", "Force 2", "Force 3"],
  "points_faibles": ["Faiblesse 1", "Faiblesse 2"],
  "strategie": "Explication détaillée de la stratégie...",
  "equipements": [
    { "slot": "Chapeau", "nom": "Nom de l'item", "pa": 0, "pm": 0 },
    { "slot": "Cape", "nom": "Nom de l'item", "pa": 0, "pm": 0 }
  ],
  "stats": {
    "vita": 4000,
    "force": 800,
    "sagesse": 180,
    "pa": 11,
    "pm": 4,
    "ini": 9000,
    "res_neutre": 40,
    "res_terre": 50
  },
  "sorts_cles": ["Sort 1", "Sort 2", "Sort 3"],
  "variantes": [
    { "nom": "Nom variante", "description": "Description variante" }
  ],
  "date_ajout": "2025-03-01",
  "auteur": "TonPseudo",
  "vues": 0
}
```

**Valeurs `categorie` possibles :**
- `"mes-equipements"` → tes builds personnels
- `"top-ladder"` → builds top niveau
- `"low-budget"` → builds économiques

**Valeurs `tier` possibles :** `"S"`, `"A"`, `"B"`, `"C"`

---

## 🎨 Changer les couleurs

Dans `styles/main.css`, modifier les variables CSS :
```css
:root {
  --accent-gold: #d4a017;        /* Couleur principale */
  --accent-blue: #3b82f6;        /* Couleur secondaire */
  --bg-void: #070810;            /* Fond le plus sombre */
  --bg-card: #111320;            /* Fond des cartes */
  --text-primary: #e8eaf0;       /* Texte principal */
}
```

---

## 🔬 Ajouter une classe manquante

Dans `data/classes.json`, ajouter :
```json
{
  "id": "nom-classe-en-minuscules",
  "nom": "NomClasse",
  "couleur": "#couleur-hexa",
  "element_principal": "Feu",
  "role": "DPS / ...",
  "tier": "A",
  "tier_comment": "Commentaire sur la classe...",
  "description": "Description de la classe.",
  "forces": ["Force 1", "Force 2"],
  "faiblesses": ["Faiblesse 1", "Faiblesse 2"],
  "popularite": 60,
  "win_rate": 53,
  "icone": "assets/icons/nom-classe.png"
}
```

Dans `components/app.js`, ajouter l'emoji :
```js
const CLASS_EMOJIS = {
  // ...
  'NomClasse': '🎯',
};
```

---

## 🌐 Déploiement

### GitHub Pages (gratuit)
1. Crée un repo GitHub
2. Push le dossier `dofus-pvp/`
3. Settings → Pages → Source : main branch / root
4. URL : `https://TON_USERNAME.github.io/NOM_REPO/`

### Netlify (gratuit, recommandé)
1. Drag & drop le dossier sur netlify.com
2. URL automatique + nom de domaine personnalisé possible
3. Déploiements automatiques depuis GitHub

### Vercel (gratuit)
```bash
npm i -g vercel
cd dofus-pvp
vercel
```

---

## 🔍 SEO — Mots clés ciblés

Le site est optimisé pour :
- `build pvp dofus`
- `stuff pvp dofus`
- `dofus tier list pvp`
- `meta pvp dofus`
- `kolizéum dofus`
- `builds [classe] dofus pvp` (ex: `builds iop dofus pvp`)

Chaque page a ses propres `<title>`, `<meta description>` et `<link canonical>`.

---

## 📋 Todo / Évolutions futures

- [ ] Intégration API YouTube (remplace les vidéos statiques)
- [ ] Système d'authentification pour admin
- [ ] Page dédiée par build (URL propre `/builds/iop-force-pvp`)
- [ ] Comparateur de builds côte-à-côte
- [ ] Simulateur de combat basique
- [ ] Statzeum (stats live kolizéum)
- [ ] Système de votes/likes sur les builds
- [ ] Mode édition pour la tier list (drag & drop)

---

## 📝 Technologies utilisées

- **HTML5** + sémantique SEO
- **CSS3** : variables, grid, flexbox, animations, responsive
- **JavaScript** vanilla : fetch, modules, DOM
- **Fonts** : Rajdhani + Exo 2 + JetBrains Mono (Google Fonts)
- **Données** : JSON (facilement éditable)

Aucune dépendance externe · Aucun framework · Zéro build step.

---

*Site créé pour la communauté PvP DOFUS. Non affilié à Ankama Games.*
