/* ---------------------------------------------------------------
   Orzax Outreach Studio — static, no-API-key version.
   Generates a copy-paste-ready prompt for a normal Claude.ai chat,
   then parses whatever you paste back in. No backend, no billing.
---------------------------------------------------------------- */

const ORZAX_FACTS = `Brand: Orzax (Orzax USA storefront)
Tagline: "Gift to Health"
Origin: Founded in Turkey, expanding into the US market
Founder background: pharmacist-led, strong R&D and clinically-informed formulation focus
Catalog: nearly 150 food supplements
Certifications: ISO 9001, ISO 22000, GMP-certified, FDA-registered manufacturing facility
Ingredient standards: clean-label, sustainably sourced, non-GMO ingredients, lab-tested for purity and potency
Customer trust: 4.8/5 average rating across 5,000+ customers
Hero / flagship product: Black Seed Oil (softgels and liquid) — immune, skin, joint, digestive support
Other notable products: Magnesium Triple Complex, Collagen Peptides, Oregano Oil, Milk Thistle Plus, Liposomal Iron, Premium Ginseng, Saw Palmetto, Black Seed Oil Hair/Skin/Nail Gummies
Social presence: @orzaxusa on Instagram and TikTok
Existing infrastructure: Orzax already runs a formal Partnership Program`;

const NICHES = [
  { key: "pharmacist", tr: "Eczacı", en: "Pharmacist",
    angle: "The recipient is a licensed pharmacist. Lean on clinical credibility: the pharmacist-founder connection, GMP/ISO/FDA-registered manufacturing, ingredient sourcing and lab testing. Invite them to evaluate the formulations professionally, peer to peer — not as a generic influencer pitch." },
  { key: "health_creator", tr: "Sağlık İçerik Üreticisi", en: "Health Content Creator",
    angle: "The recipient is a general health & wellness content creator. Lean on lifestyle, authenticity, and how the products fit a natural, holistic routine their audience already trusts them on." },
  { key: "fitness", tr: "Sporcu / Fitness", en: "Athlete / Fitness Creator",
    angle: "The recipient is an athlete or fitness creator. Lean on recovery, joint support, and muscle fatigue relevance (magnesium, collagen) rather than generic wellness language." },
  { key: "nutritionist", tr: "Beslenme Uzmanı / Diyetisyen", en: "Nutritionist / Dietitian",
    angle: "The recipient is a nutritionist or dietitian. Lean on ingredient transparency, dosage rationale, and formulation evidence rather than lifestyle framing." },
  { key: "family", tr: "Anne / Aile İçerikleri", en: "Mom / Family Content",
    angle: "The recipient creates family/parenting content. Lean on trust, gentle framing, and everyday family wellness routines." },
  { key: "other", tr: "Diğer", en: "Other",
    angle: "Keep the framing on natural wellness and manufacturing credibility without over-specializing." },
];

const PLATFORMS = [
  { key: "instagram", tr: "Instagram", en: "Instagram" },
  { key: "tiktok", tr: "TikTok", en: "TikTok" },
  { key: "youtube", tr: "YouTube", en: "YouTube" },
  { key: "other", tr: "Diğer", en: "Other" },
];

const COLLAB_TYPES = [
  { key: "partnership", tr: "Sponsorlu İş Birliği", en: "Paid Partnership",
    angle: "This is a straightforward paid sponsored-content deal — one or more posts in exchange for a flat fee. Keep the ask concrete but flexible on deliverables." },
  { key: "whitelisting", tr: "Whitelisting (Reklam Kullanımı)", en: "Whitelisting (Paid Ads Usage)",
    angle: "Orzax wants to run paid ads through the creator's handle (whitelisting/spark ads). Be explicit that this is a distinct, separately-compensated usage-rights arrangement, not just a normal sponsored post." },
  { key: "barter", tr: "Barter / Ürün Karşılığı", en: "Barter / Product Seeding",
    angle: "This is a lower-commitment product-for-content exchange, positioned as a first step toward a paid relationship if the fit is good. Keep tone low-pressure." },
  { key: "ambassador", tr: "Uzun Vadeli Ambassador", en: "Long-term Ambassador",
    angle: "Orzax wants a recurring, multi-month ambassador relationship, not a one-off post. Emphasize ongoing collaboration, consistency, and deeper brand integration." },
  { key: "affiliate", tr: "Affiliate / Komisyonlu", en: "Affiliate / Commission-based",
    angle: "This is a trackable-link, commission-based arrangement. Emphasize easy setup and that earnings scale with their own audience's trust in them." },
  { key: "ugc", tr: "UGC / İçerik Üretimi", en: "UGC / Content Creation",
    angle: "Orzax wants raw user-generated-style content (e.g. unboxing, routine, honest review clips) primarily for Orzax's own ads and channels, not necessarily posted on the creator's own page. Emphasize that this is a content-for-fee deal focused on authentic, unpolished footage rather than a polished sponsored post." },
];

const LANGUAGES = [
  { key: "EN", tr: "EN", en: "EN" },
  { key: "TR", tr: "TR", en: "TR" },
];

const MARKETS = [
  { key: "usa", tr: "ABD", en: "USA",
    angle: "This outreach targets the US market. Use American English spelling and conventions (e.g. \"color\", \"favorite\") and USD ($) for any pricing/commission figures. Lean on the FDA-registered manufacturing facility as a primary trust signal alongside GMP/ISO certifications — US audiences recognize FDA registration specifically." },
  { key: "uk", tr: "İngiltere", en: "UK",
    angle: "This outreach targets the UK market. Use British English spelling and conventions (e.g. \"colour\", \"favourite\") and GBP (£) for any pricing/commission figures. Do not lean on FDA-registered as the main trust signal since it's a US-specific regulator and may read as irrelevant or confusing to a UK recipient — instead emphasize the ISO 9001/22000 and GMP certifications, which are recognized international quality marks in the UK." },
];

const STORAGE_KEY = "orzax_outreach_drafts";

const state = {
  platform: "instagram",
  market: "usa",
  niche: "",
  collabTypes: [],
  language: "EN",
};

/* ---------- chip rendering ---------- */
function renderChips(containerId, options, stateKey) {
  const el = document.getElementById(containerId);
  el.innerHTML = "";
  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip" + (state[stateKey] === opt.key ? " active" : "");
    btn.textContent = state.language === "TR" ? opt.tr : opt.en;
    btn.addEventListener("click", () => {
      state[stateKey] = opt.key;
      renderChips(containerId, options, stateKey);
      if (stateKey === "language") {
        renderChips("chips-platform", PLATFORMS, "platform");
        renderChips("chips-market", MARKETS, "market");
        renderChips("chips-niche", NICHES, "niche");
        renderChipsMulti("chips-collab", COLLAB_TYPES, "collabTypes");
      }
    });
    el.appendChild(btn);
  });
}

/* ---------- multi-select chip rendering (collaboration types) ---------- */
function renderChipsMulti(containerId, options, stateKey) {
  const el = document.getElementById(containerId);
  el.innerHTML = "";
  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.type = "button";
    const isActive = state[stateKey].includes(opt.key);
    btn.className = "chip" + (isActive ? " active" : "");
    const label = state.language === "TR" ? opt.tr : opt.en;
    btn.textContent = isActive ? `✓ ${label}` : label;
    btn.addEventListener("click", () => {
      const list = state[stateKey];
      const idx = list.indexOf(opt.key);
      if (idx === -1) list.push(opt.key);
      else list.splice(idx, 1);
      renderChipsMulti(containerId, options, stateKey);
    });
    el.appendChild(btn);
  });
}

renderChips("chips-platform", PLATFORMS, "platform");
renderChips("chips-market", MARKETS, "market");
renderChips("chips-niche", NICHES, "niche");
renderChipsMulti("chips-collab", COLLAB_TYPES, "collabTypes");
renderChips("chips-language", LANGUAGES, "language");

/* ---------- prompt builder ---------- */
function buildPrompt() {
  const name = document.getElementById("f-name").value.trim();
  const handle = document.getElementById("f-handle").value.trim();
  const notes = document.getElementById("f-notes").value.trim();
  const award = document.getElementById("f-award").value.trim();

  const niche = NICHES.find((n) => n.key === state.niche);
  const collabs = COLLAB_TYPES.filter((c) => state.collabTypes.includes(c.key));
  const platformLabel = PLATFORMS.find((p) => p.key === state.platform);
  const market = MARKETS.find((m) => m.key === state.market);

  const langWord = state.language === "TR" ? "Turkish" : "English";

  let collabGuidance;
  if (collabs.length === 0) {
    collabGuidance = "Open to discussing format.";
  } else if (collabs.length === 1) {
    collabGuidance = collabs[0].angle;
  } else {
    collabGuidance = `This is a combined/hybrid offer covering ${collabs.length} collaboration types at once — mention all of them briefly rather than picking just one:\n`
      + collabs.map((c) => `- ${c.en}: ${c.angle}`).join("\n");
  }

  let p = `You are a partnerships specialist writing a single cold outreach email on behalf of Orzax, a pharmacist-founded natural supplement brand, to one specific influencer/creator.\n\n`;
  p += `ORZAX BRAND FACTS (use only what's relevant, do not list everything):\n${ORZAX_FACTS}\n\n`;
  p += `TARGET MARKET GUIDANCE:\n${market ? market.angle : "No specific market — use neutral international English."}\n\n`;
  p += `RECIPIENT NICHE GUIDANCE:\n${niche ? niche.angle : "General wellness audience."}\n\n`;
  p += `COLLABORATION TYPE GUIDANCE:\n${collabGuidance}\n\n`;
  p += `RULES:\n`;
  p += `- Write ONE short, warm, non-generic cold email. 120-180 words for the body.\n`;
  p += `- Reference the recipient's platform/niche naturally, and their name if given — do not use bracket placeholders like [First Name].\n`;
  p += `- Use the recipient notes below for genuine personalization — don't invent facts you weren't given.\n`;
  p += `- If a trust/award note is provided, work it in briefly, in ONE sentence at most. If none is provided, do not invent or mention any award.\n`;
  p += `- Do not oversell or use hype words like "amazing", "incredible", "revolutionary".\n`;
  p += `- Voice: write like a real brand manager personally emailing someone they respect — not like AI-generated marketing copy. This is the most important rule, follow it strictly:\n`;
  p += `  - Do NOT use em dashes or en dashes (— or –) anywhere in the email. Not one. Use a period, comma, or "and"/"but" instead of a dash to join clauses.\n`;
  p += `  - Do not use these AI-cliche phrases or anything equivalent to them: "I hope this email finds you well", "I wanted to reach out", "in today's fast-paced world", "synergy", "leverage", "elevate", "unlock", "seamless", "resonate".\n`;
  p += `  - Do not use a listy "Firstly/Secondly/Lastly" structure, do not stack exclamation marks, and do not give every sentence the same length or the same rhythm — write the way a busy person actually types, with some short sentences and some longer ones.\n`;
  p += `  - It should read like it was dashed off in one sitting by someone who actually looked at the recipient's content, not templated.\n`;
  p += `- Close by explicitly asking the recipient to reply with their rate / price quote for this collaboration (their standard fee, packages, or pricing structure) as the one clear next step — this is the primary goal of the email, so make the ask specific and easy to answer, not vague.\n`;
  p += `- Sign off as "The Orzax Partnerships Team".\n`;
  p += `- Write the entire email in ${langWord}.\n`;
  p += `- Output in EXACTLY this format, nothing before or after:\n===SUBJECT===\n<subject line, under 60 characters>\n===BODY===\n<email body, plain text, no markdown>\n\n`;
  p += `--- RECIPIENT ---\n`;
  p += `Handle/link: ${handle || "(not given)"}\n`;
  if (name) p += `Name: ${name}\n`;
  p += `Platform: ${platformLabel ? platformLabel.en : state.platform}\n`;
  p += `Market: ${market ? market.en : state.market}\n`;
  if (notes) p += `Notes: ${notes}\n`;
  if (award) p += `Trust/award note to optionally include: ${award}\n`;
  p += `\nWrite the cold email now.`;
  return p;
}

/* ---------- generate button ---------- */
document.getElementById("btn-generate").addEventListener("click", () => {
  const handle = document.getElementById("f-handle").value.trim();
  const valid = handle && state.niche && state.collabTypes.length > 0;
  const msg = document.getElementById("validation-msg");
  if (!valid) {
    msg.textContent = "Hesap, niş ve en az bir iş birliği türü zorunlu alanlar.";
    msg.style.color = "var(--clay)";
    return;
  }
  msg.textContent = "";
  const prompt = buildPrompt();
  document.getElementById("prompt-output").value = prompt;
  document.getElementById("prompt-empty").classList.add("hidden");
  document.getElementById("prompt-result").classList.remove("hidden");
});

/* ---------- copy helpers ---------- */
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch (e2) {
      return false;
    }
  }
}

document.getElementById("btn-copy-prompt").addEventListener("click", async (e) => {
  const ok = await copyText(document.getElementById("prompt-output").value);
  e.target.textContent = ok ? "Kopyalandı ✓" : "Kopyalanamadı";
  setTimeout(() => (e.target.textContent = "Promptu Kopyala"), 1500);
});

/* ---------- parse pasted response ---------- */
function parseEmail(raw) {
  if (!raw || !raw.includes("===BODY===")) {
    return { subject: "Orzax x Partnership", body: (raw || "").trim() };
  }
  const [head, tail] = raw.split("===BODY===");
  const subject = head.replace("===SUBJECT===", "").trim();
  return { subject, body: tail.trim() };
}

document.getElementById("btn-save").addEventListener("click", () => {
  const raw = document.getElementById("f-response").value.trim();
  if (!raw) return;
  const parsed = parseEmail(raw);

  document.getElementById("parsed-subject").value = parsed.subject;
  document.getElementById("parsed-body").value = parsed.body;
  document.getElementById("parsed-result").classList.remove("hidden");

  const drafts = loadDrafts();
  const draft = {
    id: Date.now().toString(36),
    createdAt: new Date().toISOString(),
    name: document.getElementById("f-name").value.trim(),
    handle: document.getElementById("f-handle").value.trim(),
    platform: state.platform,
    market: state.market,
    niche: state.niche,
    collabTypes: state.collabTypes.slice(),
    language: state.language,
    subject: parsed.subject,
    body: parsed.body,
    quote: "",
  };
  drafts.unshift(draft);
  saveDrafts(drafts.slice(0, 50));
  renderDrafts();
});

document.querySelectorAll(".btn-icon[data-copy-target]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const target = document.getElementById(btn.dataset.copyTarget);
    const ok = await copyText(target.value);
    btn.textContent = ok ? "✓" : "!";
    setTimeout(() => (btn.textContent = "📋"), 1200);
  });
});

/* ---------- localStorage drafts ---------- */
function loadDrafts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveDrafts(drafts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  } catch (e) {
    /* storage unavailable — ignore */
  }
}

function renderDrafts() {
  const drafts = loadDrafts();
  const list = document.getElementById("drafts-list");
  const empty = document.getElementById("drafts-empty");
  list.innerHTML = "";

  if (drafts.length === 0) {
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");

  drafts.forEach((d) => {
    const niche = NICHES.find((n) => n.key === d.niche);
    const market = MARKETS.find((m) => m.key === d.market);
    const collabKeys = d.collabTypes || (d.collabType ? [d.collabType] : []);
    const collabLabel = COLLAB_TYPES.filter((c) => collabKeys.includes(c.key))
      .map((c) => (d.language === "TR" ? c.tr : c.en))
      .join(" + ");
    const card = document.createElement("div");
    card.className = "draft-card";
    card.innerHTML = `
      <div class="top-row">
        <p class="name">${escapeHtml(d.name || d.handle)}</p>
        <button class="delete-btn" title="Sil">🗑</button>
      </div>
      <p class="meta">${escapeHtml(d.handle)} · ${market ? escapeHtml(market.en) : ""} · ${niche ? escapeHtml(d.language === "TR" ? niche.tr : niche.en) : ""} · ${escapeHtml(collabLabel)}</p>
      <p class="subject">${escapeHtml(d.subject)}</p>
      <label class="mini-label">FİYAT TEKLİFİ</label>
      <input type="text" class="quote-input" placeholder="ör. $300 / post" value="${escapeHtml(d.quote || "")}" />
      <button class="copy-btn">📋 Kopyala</button>
    `;
    card.querySelector(".delete-btn").addEventListener("click", () => {
      const updated = loadDrafts().filter((x) => x.id !== d.id);
      saveDrafts(updated);
      renderDrafts();
    });
    card.querySelector(".quote-input").addEventListener("change", (e) => {
      const updated = loadDrafts();
      const target = updated.find((x) => x.id === d.id);
      if (target) {
        target.quote = e.target.value.trim();
        saveDrafts(updated);
      }
    });
    card.querySelector(".copy-btn").addEventListener("click", async (e) => {
      const ok = await copyText(`Subject: ${d.subject}\n\n${d.body}`);
      e.target.textContent = ok ? "✓ Kopyalandı" : "Hata";
      setTimeout(() => (e.target.textContent = "📋 Kopyala"), 1200);
    });
    list.appendChild(card);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

renderDrafts();
