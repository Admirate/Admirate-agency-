// @ts-nocheck

/**
 * START A PROJECT — the wizard driver.
 *
 * Everything this file does is DOM work: toggle which step is `hidden`, move
 * focus, and swap pre-formatted strings. Every decision it makes — which step
 * comes next, whether a step is valid, what an inbound link preselects, what
 * the message body says — is delegated to `lib/brief.ts`, which is pure and
 * unit-tested. A wrong branch fails silently in the database; a wrong toggle
 * fails visibly on the page, and that is the split.
 *
 * The figures are never recalculated here. Every cycle's cell was formatted by
 * the server and embedded in #wizdata, so switching a cycle reads from that
 * payload — a client-side rounding difference could otherwise show a number
 * the server would never have rendered.
 */

import {
  TOTAL_STEPS,
  emptyBrief,
  step4Kind,
  validateStep,
  resolveEntry,
  submissionFrom,
  FAMILY_LABELS,
} from "@/lib/brief";

const STORE = "admirate_brief";

export default function initStart() {
let _dead = false, _curRaf = 0;
const _win = [], _els = [], _timers = [];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
requestAnimationFrame(() => { if (!_dead) document.body.classList.add('ready'); });

const $ = id => document.getElementById(id);
const on = (el, t, h, o) => { if (!el) return; el.addEventListener(t, h, o); _els.push([el, t, h]); };

/* ---------- custom cursor ---------- */
const dot = $('cdot'), ring = $('cring');
const finePointer = matchMedia('(pointer:fine)').matches;
function bindHover(scope) {
  (scope || document).querySelectorAll('[data-h]').forEach(el => {
    on(el, 'mouseenter', () => document.body.classList.add('hovering'));
    on(el, 'mouseleave', () => document.body.classList.remove('hovering'));
  });
}
if (dot && finePointer && !reduced) {
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  const move = e => { mx = e.clientX; my = e.clientY; dot.style.left = mx + 'px'; dot.style.top = my + 'px'; };
  addEventListener('mousemove', move); _win.push(['mousemove', move]);
  (function cur() { if (_dead) return; rx += (mx - rx) * .16; ry += (my - ry) * .16; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; _curRaf = requestAnimationFrame(cur); })();
  bindHover(document);
}

/* ---------- embedded plan payload ---------- */
let DATA = { active: '', cycleIds: [], cycleLabels: {}, families: {} };
try {
  const node = $('wizdata');
  if (node) DATA = JSON.parse(node.textContent || '{}');
} catch (e) {
  /* A malformed payload must not take the page down: the server-rendered
     figures are already in the DOM and stay correct. Only switching breaks. */
  console.error('Brief payload unreadable:', e);
}

/* ---------- state ---------- */
let S = emptyBrief();
let step = 1;
let context = '';

/* Restore, so seven steps do not die to an accidental refresh. sessionStorage
   rather than localStorage: a brief is a single sitting, and a half-finished
   enquiry resurfacing weeks later on a shared machine is worse than losing it. */
try {
  const raw = sessionStorage.getItem(STORE);
  if (raw) {
    const saved = JSON.parse(raw);
    if (saved && typeof saved === 'object') S = { ...S, ...saved.state };
  }
} catch (e) { /* unreadable — start clean */ }

/* A plan removed from pricing_plans since the state was written (0005 removed
   care/manage) would otherwise be submitted as a plan that no longer exists. */
if (S.plan && S.service && S.service !== 'other') {
  const fam = DATA.families[S.service];
  if (!fam || !fam.plans.some(p => p.slug === S.plan)) S.plan = '';
}

const save = () => {
  try { sessionStorage.setItem(STORE, JSON.stringify({ state: S })); } catch (e) {}
};

/* ---------- inbound links ---------- */
let preselected = false;
try {
  const { patch, context: ctx } = resolveEntry(location.search);
  if (Object.keys(patch).length) {
    S = { ...S, ...patch };
    context = ctx;
    preselected = true;
  }
} catch (e) { /* preselect nothing */ }

/* ---------- elements ---------- */
const wiz = $('wiz'), railBox = $('wrail'), countEl = $('wcount'), backBtn = $('wback'), ctxEl = $('wctx');
const steps = [...document.querySelectorAll('.wstep')];
const stepOf = n => steps.find(s => +s.dataset.step === n);
const statusOf = n => stepOf(n)?.querySelector('[data-status]');
const railBars = railBox ? [...railBox.children] : [];

/* ---------- chips ---------- */
/**
 * Wires one chip group. Single-select groups clear their siblings; the active
 * chip in a single-select group can be clicked again to clear it.
 */
function wireChips(id, onPick) {
  const box = $(id);
  if (!box) return;
  const single = box.hasAttribute('data-single');
  on(box, 'click', e => {
    const c = e.target.closest('.chip');
    if (!c) return;
    if (single) {
      const was = c.getAttribute('aria-pressed') === 'true';
      [...box.children].forEach(x => x.setAttribute('aria-pressed', String(x === c && !was)));
    } else {
      c.setAttribute('aria-pressed', String(c.getAttribute('aria-pressed') !== 'true'));
    }
    box.classList.remove('err');
    onPick(picked(id), box);
    save();
  });
}
const picked = id => [...($(id)?.querySelectorAll('.chip[aria-pressed="true"]') || [])].map(c => c.dataset.v);

/** Reflects state back onto a chip group, for restore and for back-navigation. */
function paintChips(id, values) {
  const box = $(id);
  if (!box) return;
  const want = [].concat(values || []);
  [...box.children].forEach(c => c.setAttribute('aria-pressed', String(want.includes(c.dataset.v))));
}

wireChips('windustry', v => {
  S.industry = v[0] || '';
  const wrap = $('otherwrap');
  if (wrap) wrap.hidden = S.industry !== 'Other';
  if (S.industry === 'Other') $('f-other')?.focus();
});
wireChips('wscope', v => { S.scope = v; });
wireChips('wbudget', v => { S.budget = v[0] || ''; });
wireChips('wtime', v => { S.timeline = v[0] || ''; });
wireChips('wcycle', v => {
  const label = v[0] || '';
  const id = DATA.cycleIds.find(c => DATA.cycleLabels[c] === label);
  S.cycle = id || '';
  paintPlanFigures();
});

/* ---------- plan figures ---------- */
/** The cycle actually in force: what was chosen, else monthly. */
const activeCycle = () => (S.cycle && S.cycle !== '' ? S.cycle : 'monthly');

/**
 * Repaints every visible plan card from the embedded payload. String swaps
 * only — see the note at the top of this file.
 */
function paintPlanFigures() {
  const fam = DATA.families[S.service];
  if (!fam) return;
  const cyc = activeCycle();
  fam.plans.forEach(p => {
    const card = document.querySelector(`.card[data-family="${CSS.escape(S.service)}"][data-plan="${CSS.escape(p.slug)}"]`);
    if (!card) return;
    const cell = p.cells[p.oneTime ? 'monthly' : cyc] || p.cells.monthly;
    if (!cell) return;
    const fig = card.querySelector('[data-fig]'), per = card.querySelector('[data-per]'), bill = card.querySelector('[data-bill]');
    /* textContent, never innerHTML: these strings are built from an
       administrator-editable currency symbol. */
    if (fig && per) { fig.childNodes[0].nodeValue = cell.fig; per.textContent = cell.per; }
    if (bill) bill.textContent = [cell.billTotal, cell.billSaving].filter(Boolean).join(' · ');
  });
}

/** Shows only the chosen family's plans, and the cycle control if it has one. */
function paintStep4() {
  const scoped = step4Kind(S) === 'scope';
  $('planpane').hidden = scoped;
  $('scopepane').hidden = !scoped;
  stepOf(4).querySelector('.q').textContent = scoped ? 'What do you need?' : 'Choose your plan.';
  $('planhint').textContent = scoped
    ? 'Tap everything that applies — we quote these per project.'
    : 'Every tier includes the one below it. Prices are what you would actually be invoiced.';

  if (scoped) {
    paintChips('wscope', S.scope);
    paintChips('wbudget', S.budget);
    return;
  }

  document.querySelectorAll('[data-plans]').forEach(g => { g.hidden = g.dataset.plans !== S.service; });
  const fam = DATA.families[S.service];
  $('cyclewrap').hidden = !fam || !fam.cycles;
  if (fam && fam.cycles) {
    if (!S.cycle) S.cycle = 'monthly';
    paintChips('wcycle', DATA.cycleLabels[activeCycle()]);
  } else {
    S.cycle = '';
  }
  document.querySelectorAll('.card[data-plan]').forEach(c => {
    c.dataset.on = c.dataset.family === S.service && c.dataset.plan === S.plan ? '1' : '0';
  });
  paintPlanFigures();
}

/* ---------- labels for the message and the review ---------- */
function labels() {
  if (S.service === 'other') {
    return { serviceLabel: FAMILY_LABELS.other, planLabel: '', priceLabel: '', cycleLabel: '' };
  }
  const fam = DATA.families[S.service];
  const plan = fam?.plans.find(p => p.slug === S.plan);
  const cell = plan ? (plan.cells[plan.oneTime ? 'monthly' : activeCycle()] || plan.cells.monthly) : null;
  return {
    serviceLabel: fam ? fam.label : '',
    planLabel: plan ? plan.name : '',
    priceLabel: cell ? `${cell.fig}${cell.per}` : '',
    cycleLabel: cell ? cell.billTotal : '',
  };
}

/* ---------- review ---------- */
const REVIEW_ROWS = [
  { label: 'BRAND', step: 1, value: () => S.brand },
  { label: 'INDUSTRY', step: 2, value: () => (S.industry === 'Other' ? S.industryOther : S.industry) },
  { label: 'SERVICE', step: 3, value: () => labels().serviceLabel },
  {
    label: 'PLAN', step: 4,
    value: () => {
      if (S.service === 'other') return S.scope.join(', ') + (S.budget ? ` · ${S.budget}` : '');
      const l = labels();
      return l.planLabel ? `${l.planLabel} — ${l.priceLabel}${l.cycleLabel ? ` (${l.cycleLabel})` : ''}` : '';
    },
  },
  { label: 'TIMELINE', step: 5, value: () => S.timeline },
  { label: 'REMARKS', step: 5, value: () => S.notes },
  { label: 'CONTACT', step: 6, value: () => [S.name, S.email, S.phone].filter(Boolean).join('\n') },
];

function paintReview() {
  const box = $('wrev');
  box.textContent = '';
  REVIEW_ROWS.forEach(row => {
    const v = (row.value() || '').trim();
    if (!v) return;
    const wrap = document.createElement('div');
    wrap.className = 'revrow';
    const dt = document.createElement('dt'); dt.textContent = row.label;
    const dd = document.createElement('dd'); dd.textContent = v;
    const ed = document.createElement('button');
    ed.type = 'button'; ed.className = 'edit'; ed.dataset.h = '';
    ed.textContent = 'EDIT';
    ed.setAttribute('aria-label', `Edit ${row.label.toLowerCase()}`);
    on(ed, 'click', () => go(row.step, true));
    wrap.append(dt, dd, ed);
    box.appendChild(wrap);
  });
  bindHover(box);
}

/* ---------- navigation ---------- */
function paintChrome() {
  railBars.forEach((b, i) => {
    b.className = i + 1 < step ? 'done' : i + 1 === step ? 'now' : '';
  });
  railBox.setAttribute('aria-valuenow', String(step));
  countEl.textContent = `STEP ${String(step).padStart(2, '0')} / ${TOTAL_STEPS}`;
  backBtn.hidden = step === 1;
}

/** Moves to a step. `back` only changes which direction the slide comes from. */
function go(n, back) {
  step = Math.min(TOTAL_STEPS, Math.max(1, n));
  document.body.classList.toggle('goback', !!back);
  steps.forEach(s => { s.hidden = +s.dataset.step !== step; });
  if (step === 4) paintStep4();
  if (step === 7) paintReview();
  paintChrome();
  const status = statusOf(step);
  if (status) { status.className = 'wstatus'; status.textContent = ''; }
  /* Focus the heading, not the first input: the question is announced before
     the control that answers it. */
  const q = stepOf(step)?.querySelector('.q');
  if (q) q.focus({ preventScroll: true });
  $('wiz').querySelector('.wbody').scrollTop = 0;
  save();
}

/** Reads the DOM back into state, so a Next always validates what is on screen. */
function sync() {
  S.brand = $('f-brand').value;
  S.industryOther = $('f-other').value;
  S.notes = $('f-notes').value;
  S.name = $('f-name').value;
  S.email = $('f-email').value;
  S.phone = $('f-phone').value;
}

const FIELD_EL = {
  brand: 'f-brand', industryOther: 'f-other', notes: 'f-notes',
  name: 'f-name', email: 'f-email', phone: 'f-phone',
};
const FIELD_BOX = { industry: 'windustry', scope: 'wscope', budget: 'wbudget' };

function fail(problem) {
  const status = statusOf(step);
  if (status) { status.className = 'wstatus bad'; status.textContent = '// ' + problem.message; }

  const inputId = FIELD_EL[problem.field];
  if (inputId) {
    const el = $(inputId);
    el.classList.add('err');
    el.setAttribute('aria-invalid', 'true');
    el.focus();
    return;
  }
  const boxId = FIELD_BOX[problem.field];
  if (boxId) { $(boxId).classList.add('err'); return; }
  if (problem.field === 'service' || problem.field === 'plan') {
    const box = problem.field === 'service' ? $('wsvc') : document.querySelector(`[data-plans="${CSS.escape(S.service)}"]`);
    if (box) box.classList.add('err');
  }
}

function clearErrors() {
  Object.values(FIELD_EL).forEach(id => {
    const el = $(id);
    if (el) { el.classList.remove('err'); el.removeAttribute('aria-invalid'); }
  });
  document.querySelectorAll('.chipset.err,.cards.err').forEach(el => el.classList.remove('err'));
}

/** Validate the current step and advance, or mark the first problem. */
function advance() {
  sync();
  clearErrors();
  const problem = validateStep(step, S);
  if (problem) { fail(problem); return; }
  save();
  go(step + 1, false);
}

document.querySelectorAll('[data-next]').forEach(b => on(b, 'click', advance));
on(backBtn, 'click', () => go(step - 1, true));

/* Enter advances from a single-line input, the way a one-question screen
   implies. The textarea is exempt — a brief needs its line breaks. */
document.querySelectorAll('.fin').forEach(el => {
  if (el.tagName === 'TEXTAREA') return;
  on(el, 'keydown', e => { if (e.key === 'Enter') { e.preventDefault(); advance(); } });
  on(el, 'input', () => { el.classList.remove('err'); el.removeAttribute('aria-invalid'); });
});

/* ---------- cards ---------- */
on($('wsvc'), 'click', e => {
  const b = e.target.closest('[data-svc]');
  if (!b) return;
  const next = b.dataset.svc;
  /* Switching family invalidates a plan chosen under the old one. */
  if (next !== S.service) { S.service = next; S.plan = ''; S.cycle = ''; }
  document.querySelectorAll('#wsvc .card').forEach(c => { c.dataset.on = c.dataset.service === next ? '1' : '0'; });
  clearErrors();
  save();
  go(4, false);
});

on($('planpane'), 'click', e => {
  const b = e.target.closest('[data-pick]');
  if (!b) return;
  S.plan = b.dataset.pick;
  document.querySelectorAll('.card[data-plan]').forEach(c => {
    c.dataset.on = c.dataset.family === S.service && c.dataset.plan === S.plan ? '1' : '0';
  });
  clearErrors();
  save();
  go(5, false);
});

/* ---------- know more ---------- */
const sheet = $('sheet');
let lastTrigger = null;

function openSheet(key) {
  const [family, slug] = key.split(':');
  const fam = DATA.families[family];
  if (!fam) return;
  const plan = slug ? fam.plans.find(p => p.slug === slug) : null;

  $('sheetTitle').textContent = plan ? `${fam.label} — ${plan.name}` : fam.label;
  $('sheetLead').textContent = plan ? plan.blurb : fam.lead;

  const body = $('sheetBody');
  body.textContent = '';

  const group = (title, build) => {
    const g = document.createElement('div'); g.className = 'sgroup';
    const t = document.createElement('div'); t.className = 'sgt'; t.textContent = title;
    g.appendChild(t); build(g); body.appendChild(g);
  };

  if (plan) {
    const cell = plan.cells[plan.oneTime ? 'monthly' : activeCycle()] || plan.cells.monthly;
    if (cell) {
      const fig = document.createElement('div'); fig.className = 'sfig'; fig.textContent = cell.fig;
      const per = document.createElement('span'); per.textContent = cell.per; fig.appendChild(per);
      body.appendChild(fig);
      const bill = [cell.billTotal, cell.billSaving, cell.tax].filter(Boolean).join(' · ');
      if (bill) { const b = document.createElement('div'); b.className = 'sbill'; b.textContent = bill; body.appendChild(b); }
    }
    group(plan.inheritsFrom ? `EVERYTHING IN ${plan.inheritsFrom.toUpperCase()}, PLUS` : "WHAT'S INCLUDED", g => {
      const ul = document.createElement('ul');
      plan.includes.forEach(it => {
        const li = document.createElement('li');
        li.append(document.createTextNode(it.label));
        if (it.note) { const b = document.createElement('b'); b.textContent = ` ${it.note}`; li.appendChild(b); }
        ul.appendChild(li);
      });
      g.appendChild(ul);
    });
    group('ENGAGEMENT', g => {
      const p = document.createElement('p');
      p.style.cssText = 'font-size:14.5px;line-height:1.55';
      p.textContent = plan.oneTime ? 'One-time build.' : 'Ongoing, cancel or change cycle at renewal.';
      g.appendChild(p);
    });
  } else {
    group('PLANS', g => {
      const ul = document.createElement('ul');
      fam.plans.forEach(p => {
        const cell = p.cells[p.oneTime ? 'monthly' : 'monthly'];
        const li = document.createElement('li');
        li.append(document.createTextNode(p.name));
        const b = document.createElement('b');
        b.textContent = cell ? ` ${cell.fig}${cell.per} — ${p.blurb}` : ` ${p.blurb}`;
        li.appendChild(b);
        ul.appendChild(li);
      });
      g.appendChild(ul);
    });
  }

  const act = $('sheetAct');
  act.textContent = '';
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'pick'; btn.dataset.h = '';
  btn.textContent = plan ? `Choose ${plan.name}` : `Select ${fam.label}`;
  on(btn, 'click', () => {
    if (plan) {
      S.service = family; S.plan = plan.slug;
      closeSheet();
      save();
      go(5, false);
    } else {
      if (family !== S.service) { S.service = family; S.plan = ''; S.cycle = ''; }
      document.querySelectorAll('#wsvc .card').forEach(c => { c.dataset.on = c.dataset.service === family ? '1' : '0'; });
      closeSheet();
      save();
      go(4, false);
    }
  });
  act.appendChild(btn);
  bindHover(sheet);

  lastTrigger = document.activeElement;
  sheet.classList.add('on');
  document.body.classList.add('wizopen');
  $('sheetTitle').setAttribute('tabindex', '-1');
  $('sheetTitle').focus({ preventScroll: true });
}

function closeSheet() {
  sheet.classList.remove('on');
  if (lastTrigger && lastTrigger.focus) lastTrigger.focus({ preventScroll: true });
  lastTrigger = null;
}

on(document, 'click', e => {
  const k = e.target.closest('[data-know]');
  if (k) { openSheet(k.dataset.know); return; }
  if (e.target.closest('[data-close]')) closeSheet();
});

/* Escape closes the sheet; focus is trapped inside it while it is open. */
on(document, 'keydown', e => {
  if (!sheet.classList.contains('on')) return;
  if (e.key === 'Escape') { closeSheet(); return; }
  if (e.key !== 'Tab') return;
  const f = [...sheet.querySelectorAll('button,a[href],input,textarea,[tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

/* ---------- entering the wizard ---------- */
function openWizard(atStep) {
  document.body.classList.add('paper');
  /* One frame of paper before the wizard mounts, so the morph reads as a
     transition into the brief rather than as a cut. */
  _timers.push(setTimeout(() => {
    if (_dead) return;
    document.body.classList.add('wizopen');
    go(atStep || 1, false);
  }, reduced ? 0 : 380));
}

on($('startbtn'), 'click', () => openWizard(1));

/* ---------- restore what was already answered ---------- */
$('f-brand').value = S.brand || '';
$('f-other').value = S.industryOther || '';
$('f-notes').value = S.notes || '';
$('f-name').value = S.name || '';
$('f-email').value = S.email || '';
$('f-phone').value = S.phone || '';
paintChips('windustry', S.industry);
paintChips('wtime', S.timeline);
if (S.industry === 'Other') $('otherwrap').hidden = false;
if (S.service) {
  document.querySelectorAll('#wsvc .card').forEach(c => { c.dataset.on = c.dataset.service === S.service ? '1' : '0'; });
}
if (context && ctxEl) { ctxEl.textContent = `Enquiring about: ${context}`; ctxEl.hidden = false; }

/* A visitor who arrived from a pricing tier or a service page has already made
   a choice, so the wizard opens rather than waiting behind the CTA — otherwise
   the preselection is invisible and the landing screen reads as though nothing
   came across. They still start at step 1: dropping someone into the middle of
   a wizard they have not started reads as broken.
   Keyed on the preselection itself, not on the context sentence, so a link
   that preselects without producing one still opens. */
if (preselected) { save(); openWizard(1); }

bindHover(document);

/* ---------- submit ---------- */
on($('wsubmit'), 'click', async () => {
  const btn = $('wsubmit');
  const status = statusOf(7);
  sync();

  /* Re-check every step, not just this one: a visitor can reach the review by
     editing backwards and leaving something blank behind them. */
  for (let n = 1; n <= 6; n += 1) {
    const problem = validateStep(n, S);
    if (problem) {
      go(n, true);
      fail(problem);
      return;
    }
  }

  btn.disabled = true;
  status.className = 'wstatus';
  status.textContent = '// SENDING…';

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissionFrom(S, labels())),
    });
    if (_dead) return;
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      btn.disabled = false;
      status.className = 'wstatus bad';
      status.textContent = '// ' + String(data.error || 'COULD NOT SEND. TRY WHATSAPP BELOW.').toUpperCase();
      return;
    }
  } catch (e) {
    if (_dead) return;
    btn.disabled = false;
    status.className = 'wstatus bad';
    status.textContent = '// NETWORK ERROR. TRY WHATSAPP BELOW.';
    return;
  }

  /* Only now — a failed save must never show the success screen. */
  status.textContent = '';
  btn.disabled = false;
  try { sessionStorage.removeItem(STORE); } catch (e) {}
  $('done').classList.add('on');
});

function cleanup() {
  _dead = true;
  cancelAnimationFrame(_curRaf);
  _timers.forEach(clearTimeout);
  _win.forEach(([t, h]) => removeEventListener(t, h));
  _els.forEach(([el, t, h]) => el.removeEventListener(t, h));
  document.body.classList.remove('ready', 'hovering', 'wizopen', 'paper', 'goback');
}
return cleanup;
}
