/**
 * TARKAN PVP — Colosseum Animated Background
 * Inspired by duffus.fr particle style, Roman Colosseum theme
 * Embers, torch lights, stone pillars, volumetric atmosphere
 */

(function() {
  // =================== CANVAS SETUP ===================
  const canvas = document.createElement('canvas');
  canvas.id = 'colosseum-bg';
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // =================== COLORS ===================
  const PALETTE = {
    bg1:      '#0e0b08',
    bg2:      '#130f0a',
    stone1:   '#2a1f14',
    stone2:   '#1a1208',
    torchOrange: 'rgba(255, 140, 30',
    torchYellow: 'rgba(255, 200, 60',
    ember1:   '#ff8c1a',
    ember2:   '#ffb830',
    ember3:   '#ff5500',
    smoke:    'rgba(80, 60, 40',
    gold:     'rgba(201, 146, 42',
  };

  // =================== ARCHES / COLONNES ===================
  const ARCHES = [];
  const NUM_ARCHES = 7;

  for (let i = 0; i < NUM_ARCHES; i++) {
    ARCHES.push({
      x: (i / (NUM_ARCHES - 1)) * 1.1 - 0.05, // 0..1 normalized
      width: 0.10 + Math.random() * 0.04,
      height: 0.55 + Math.random() * 0.2,
      depth: 0.3 + Math.random() * 0.7, // perspective depth
    });
  }

  // Sort by depth (back to front)
  ARCHES.sort((a, b) => a.depth - b.depth);

  // =================== TORCHES ===================
  const TORCHES = [];
  const TORCH_POSITIONS = [0.05, 0.22, 0.38, 0.5, 0.62, 0.78, 0.95];

  TORCH_POSITIONS.forEach(xNorm => {
    TORCHES.push({
      x: xNorm,
      y: 0.38 + Math.random() * 0.12,
      flicker: Math.random() * Math.PI * 2,
      flickerSpeed: 0.04 + Math.random() * 0.04,
      intensity: 0.7 + Math.random() * 0.3,
      radius: 0.12 + Math.random() * 0.08,
    });
  });

  // =================== EMBERS ===================
  const EMBERS = [];
  const NUM_EMBERS = 120;

  function createEmber(forceBottom = false) {
    // Spawn near torch positions or random
    const torch = TORCHES[Math.floor(Math.random() * TORCHES.length)];
    return {
      x: (torch ? torch.x : Math.random()) * W + (Math.random() - 0.5) * 80,
      y: forceBottom ? H + 10 : (torch ? torch.y * H : H * 0.6) + Math.random() * 60,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -(0.4 + Math.random() * 1.2),
      size: 1 + Math.random() * 2.5,
      life: 0,
      maxLife: 120 + Math.random() * 180,
      color: Math.random() > 0.5 ? PALETTE.ember1 : (Math.random() > 0.5 ? PALETTE.ember2 : PALETTE.ember3),
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.02 + Math.random() * 0.03,
      bright: Math.random() > 0.7,
    };
  }

  for (let i = 0; i < NUM_EMBERS; i++) {
    const e = createEmber(false);
    e.life = Math.random() * e.maxLife; // stagger start
    EMBERS.push(e);
  }

  // =================== SMOKE PARTICLES ===================
  const SMOKE = [];
  const NUM_SMOKE = 30;

  function createSmoke() {
    const torch = TORCHES[Math.floor(Math.random() * TORCHES.length)];
    return {
      x: (torch ? torch.x : Math.random()) * W,
      y: torch ? torch.y * H - 20 : H * 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(0.15 + Math.random() * 0.3),
      size: 8 + Math.random() * 20,
      life: 0,
      maxLife: 200 + Math.random() * 200,
      opacity: 0.02 + Math.random() * 0.04,
    };
  }

  for (let i = 0; i < NUM_SMOKE; i++) {
    const s = createSmoke();
    s.life = Math.random() * s.maxLife;
    SMOKE.push(s);
  }

  // =================== FLOATING DUST PARTICLES ===================
  const DUST = [];
  const NUM_DUST = 60;

  for (let i = 0; i < NUM_DUST; i++) {
    DUST.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -(0.05 + Math.random() * 0.15),
      size: 0.5 + Math.random() * 1.5,
      opacity: 0.1 + Math.random() * 0.3,
      life: Math.random() * 300,
      maxLife: 300 + Math.random() * 300,
    });
  }

  let frame = 0;

  // =================== DRAW FUNCTIONS ===================

  function drawBackground() {
    // Deep dark background — warm stone
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#0a0806');
    grad.addColorStop(0.4, '#0e0b08');
    grad.addColorStop(0.7, '#130e09');
    grad.addColorStop(1, '#0a0705');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Subtle stone texture vignette lines (horizontal mortar joints)
    ctx.save();
    ctx.globalAlpha = 0.015;
    ctx.strokeStyle = '#c9922a';
    ctx.lineWidth = 1;
    const rowH = H / 18;
    for (let row = 0; row < 18; row++) {
      const y = row * rowH;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawArena() {
    // Arena floor — sand-colored ground at bottom
    const floorY = H * 0.72;
    const floorGrad = ctx.createLinearGradient(0, floorY, 0, H);
    floorGrad.addColorStop(0, 'rgba(80, 55, 20, 0.0)');
    floorGrad.addColorStop(0.15, 'rgba(90, 62, 22, 0.25)');
    floorGrad.addColorStop(0.5, 'rgba(70, 48, 15, 0.4)');
    floorGrad.addColorStop(1, 'rgba(30, 20, 8, 0.8)');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, floorY, W, H - floorY);

    // Floor line / horizon
    ctx.save();
    ctx.globalAlpha = 0.15;
    const horizGrad = ctx.createLinearGradient(0, 0, W, 0);
    horizGrad.addColorStop(0, 'transparent');
    horizGrad.addColorStop(0.2, '#c9922a');
    horizGrad.addColorStop(0.5, '#e8b84b');
    horizGrad.addColorStop(0.8, '#c9922a');
    horizGrad.addColorStop(1, 'transparent');
    ctx.strokeStyle = horizGrad;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, floorY);
    ctx.lineTo(W, floorY);
    ctx.stroke();
    ctx.restore();
  }

  function drawArches() {
    ARCHES.forEach(arch => {
      const ax = arch.x * W;
      const aw = arch.width * W;
      const ah = arch.height * H;
      const ay = H * 0.72 - ah; // sits on arena floor
      const alpha = 0.08 + arch.depth * 0.18;
      const brightness = 0.3 + arch.depth * 0.4;

      ctx.save();
      ctx.globalAlpha = alpha;

      // Pillar left
      const pillarW = aw * 0.18;
      const pillarGrad = ctx.createLinearGradient(ax - aw/2, 0, ax - aw/2 + pillarW, 0);
      pillarGrad.addColorStop(0, `rgba(${Math.round(30*brightness)}, ${Math.round(22*brightness)}, ${Math.round(12*brightness)}, 1)`);
      pillarGrad.addColorStop(0.4, `rgba(${Math.round(60*brightness)}, ${Math.round(44*brightness)}, ${Math.round(24*brightness)}, 1)`);
      pillarGrad.addColorStop(1, `rgba(${Math.round(20*brightness)}, ${Math.round(15*brightness)}, ${Math.round(8*brightness)}, 1)`);
      ctx.fillStyle = pillarGrad;
      ctx.fillRect(ax - aw/2, ay, pillarW, ah);

      // Pillar right
      const pillarGrad2 = ctx.createLinearGradient(ax + aw/2 - pillarW, 0, ax + aw/2, 0);
      pillarGrad2.addColorStop(0, `rgba(${Math.round(20*brightness)}, ${Math.round(15*brightness)}, ${Math.round(8*brightness)}, 1)`);
      pillarGrad2.addColorStop(0.6, `rgba(${Math.round(55*brightness)}, ${Math.round(40*brightness)}, ${Math.round(22*brightness)}, 1)`);
      pillarGrad2.addColorStop(1, `rgba(${Math.round(25*brightness)}, ${Math.round(18*brightness)}, ${Math.round(10*brightness)}, 1)`);
      ctx.fillStyle = pillarGrad2;
      ctx.fillRect(ax + aw/2 - pillarW, ay, pillarW, ah);

      // Arch / opening — dark void inside
      const archInnerW = aw - pillarW * 2;
      const archInnerX = ax - aw/2 + pillarW;
      const archRadius = archInnerW / 2;
      const archTopY = ay + archRadius * 0.6;

      ctx.beginPath();
      ctx.moveTo(archInnerX, ay + ah);
      ctx.lineTo(archInnerX, archTopY);
      ctx.arc(archInnerX + archInnerW/2, archTopY, archRadius, Math.PI, 0, false);
      ctx.lineTo(archInnerX + archInnerW, ay + ah);
      ctx.closePath();

      const voidGrad = ctx.createRadialGradient(
        archInnerX + archInnerW/2, archTopY + archRadius, 0,
        archInnerX + archInnerW/2, archTopY + archRadius, archRadius * 1.5
      );
      voidGrad.addColorStop(0, 'rgba(5, 3, 1, 0.95)');
      voidGrad.addColorStop(1, 'rgba(10, 7, 4, 0.7)');
      ctx.fillStyle = voidGrad;
      ctx.globalAlpha = alpha * 2.5;
      ctx.fill();

      ctx.restore();
    });
  }

  function drawTorchLight(torch, t) {
    const tx = torch.x * W;
    const ty = torch.y * H;
    const flicker = Math.sin(t * torch.flickerSpeed + torch.flicker) * 0.15
                  + Math.sin(t * torch.flickerSpeed * 2.3 + torch.flicker) * 0.08;
    const intensity = (torch.intensity + flicker) * 0.9;
    const r = torch.radius * Math.min(W, H) * (1 + flicker * 0.3);

    // Outer halo (warm orange glow)
    const halo = ctx.createRadialGradient(tx, ty, 0, tx, ty, r);
    halo.addColorStop(0,   `${PALETTE.torchYellow}, ${0.18 * intensity})`);
    halo.addColorStop(0.3, `${PALETTE.torchOrange}, ${0.12 * intensity})`);
    halo.addColorStop(0.6, `${PALETTE.torchOrange}, ${0.05 * intensity})`);
    halo.addColorStop(1,   `${PALETTE.torchOrange}, 0)`);
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(tx, ty, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Inner bright core
    const core = ctx.createRadialGradient(tx, ty, 0, tx, ty, r * 0.15);
    core.addColorStop(0,   `${PALETTE.torchYellow}, ${0.5 * intensity})`);
    core.addColorStop(0.5, `${PALETTE.torchOrange}, ${0.2 * intensity})`);
    core.addColorStop(1,   `${PALETTE.torchOrange}, 0)`);
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(tx, ty, r * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Torch flame shape
    ctx.save();
    ctx.globalAlpha = 0.6 * intensity;
    ctx.globalCompositeOperation = 'screen';
    const fh = 14 + flicker * 8;
    const fw = 5;
    const flameGrad = ctx.createRadialGradient(tx, ty - fh/2, 0, tx, ty, fh);
    flameGrad.addColorStop(0,   'rgba(255,220,100,0.9)');
    flameGrad.addColorStop(0.4, 'rgba(255,140,20,0.6)');
    flameGrad.addColorStop(1,   'rgba(255,60,0,0)');
    ctx.fillStyle = flameGrad;
    ctx.beginPath();
    ctx.ellipse(tx, ty - fh/3, fw, fh, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  function drawEmbers() {
    EMBERS.forEach(e => {
      const progress = e.life / e.maxLife;
      const alpha = progress < 0.2
        ? (progress / 0.2)
        : progress > 0.8
          ? (1 - (progress - 0.8) / 0.2)
          : 1;

      const wobbleX = Math.sin(e.wobble + frame * e.wobbleSpeed) * 2;

      ctx.save();
      ctx.globalCompositeOperation = e.bright ? 'screen' : 'lighter';
      ctx.globalAlpha = alpha * (e.bright ? 0.9 : 0.6);

      // Glow around ember
      const glowSize = e.size * 3;
      const glow = ctx.createRadialGradient(
        e.x + wobbleX, e.y, 0,
        e.x + wobbleX, e.y, glowSize
      );
      glow.addColorStop(0, e.color);
      glow.addColorStop(1, 'rgba(255,80,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(e.x + wobbleX, e.y, glowSize, 0, Math.PI * 2);
      ctx.fill();

      // Ember core
      ctx.globalAlpha = alpha * (e.bright ? 1 : 0.8);
      ctx.fillStyle = e.bright ? '#fff8e0' : e.color;
      ctx.beginPath();
      ctx.arc(e.x + wobbleX, e.y, e.size * (1 - progress * 0.5), 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }

  function drawSmoke() {
    SMOKE.forEach(s => {
      const progress = s.life / s.maxLife;
      const alpha = progress < 0.15
        ? (progress / 0.15) * s.opacity
        : progress > 0.7
          ? (1 - (progress - 0.7) / 0.3) * s.opacity
          : s.opacity;

      ctx.save();
      ctx.globalAlpha = alpha;
      const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * (1 + progress));
      grad.addColorStop(0, `${PALETTE.smoke}, 0.8)`);
      grad.addColorStop(1, `${PALETTE.smoke}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * (1 + progress * 1.5), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function drawDust() {
    DUST.forEach(d => {
      const progress = d.life / d.maxLife;
      const alpha = progress < 0.2
        ? progress / 0.2
        : progress > 0.8
          ? (1 - (progress - 0.8) / 0.2)
          : 1;

      ctx.save();
      ctx.globalAlpha = alpha * d.opacity * 0.5;
      ctx.fillStyle = '#c9922a';
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function drawTopVignette() {
    // Top dark vignette
    const topGrad = ctx.createLinearGradient(0, 0, 0, H * 0.35);
    topGrad.addColorStop(0, 'rgba(10,8,5,0.85)');
    topGrad.addColorStop(1, 'rgba(10,8,5,0)');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, W, H * 0.35);

    // Bottom vignette
    const botGrad = ctx.createLinearGradient(0, H * 0.75, 0, H);
    botGrad.addColorStop(0, 'rgba(8,5,2,0)');
    botGrad.addColorStop(1, 'rgba(8,5,2,0.9)');
    ctx.fillStyle = botGrad;
    ctx.fillRect(0, H * 0.75, W, H * 0.25);

    // Side vignettes
    const leftGrad = ctx.createLinearGradient(0, 0, W * 0.15, 0);
    leftGrad.addColorStop(0, 'rgba(8,5,2,0.7)');
    leftGrad.addColorStop(1, 'rgba(8,5,2,0)');
    ctx.fillStyle = leftGrad;
    ctx.fillRect(0, 0, W * 0.15, H);

    const rightGrad = ctx.createLinearGradient(W * 0.85, 0, W, 0);
    rightGrad.addColorStop(0, 'rgba(8,5,2,0)');
    rightGrad.addColorStop(1, 'rgba(8,5,2,0.7)');
    ctx.fillStyle = rightGrad;
    ctx.fillRect(W * 0.85, 0, W * 0.15, H);
  }

  // =================== UPDATE FUNCTIONS ===================

  function updateEmbers() {
    EMBERS.forEach(e => {
      e.life++;
      e.x += e.vx;
      e.y += e.vy;
      e.wobble += e.wobbleSpeed;
      e.vx += (Math.random() - 0.5) * 0.05;
      e.vy *= 0.998;

      if (e.life >= e.maxLife) {
        const ne = createEmber(false);
        Object.assign(e, ne);
        e.life = 0;
      }
    });
  }

  function updateSmoke() {
    SMOKE.forEach(s => {
      s.life++;
      s.x += s.vx;
      s.y += s.vy;
      s.vx += (Math.random() - 0.5) * 0.02;
      if (s.life >= s.maxLife) {
        const ns = createSmoke();
        Object.assign(s, ns);
        s.life = 0;
      }
    });
  }

  function updateDust() {
    DUST.forEach(d => {
      d.life++;
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0) d.x = W;
      if (d.x > W) d.x = 0;
      if (d.life >= d.maxLife) {
        d.x = Math.random() * W;
        d.y = Math.random() * H;
        d.life = 0;
        d.maxLife = 300 + Math.random() * 300;
      }
    });
  }

  // =================== MAIN LOOP ===================
  function animate() {
    ctx.clearRect(0, 0, W, H);

    drawBackground();
    drawArena();
    drawArches();

    // Draw torch lights (multiple passes for glow)
    TORCHES.forEach(t => drawTorchLight(t, frame));

    drawSmoke();
    drawEmbers();
    drawDust();
    drawTopVignette();

    updateEmbers();
    updateSmoke();
    updateDust();

    frame++;
    requestAnimationFrame(animate);
  }

  animate();

  console.log('🏟 Colosseum background initialized');
})();
