/**
 * Every decision the /start-project wizard makes.
 *
 * Deliberately pure: no DOM, no `next/*` import, no network. That is what lets
 * `tests/brief-flow.test.mjs` import this file directly under Node and assert
 * the branching, rather than asserting it through a rendered page where a
 * wrong path is invisible until a malformed lead arrives in the database.
 *
 * The split is the same one `lib/pricing.ts` draws against the pricing page:
 * what the driver in `components/start/init.ts` does — toggling `hidden`,
 * moving focus, swapping pre-formatted strings — fails visibly on the page.
 * What lives here fails silently, so this is the half that is tested.
 */

export const TOTAL_STEPS = 7;

/** "" is the unanswered state, not a family. */
export type ServiceId = "" | "retainer" | "website" | "care" | "other";
export type CycleId = "" | "monthly" | "quarterly" | "biannual" | "annual";

export type BriefState = {
  brand: string;
  industry: string;
  /** Only read when `industry` is "Other". */
  industryOther: string;
  service: ServiceId;
  /** Plan slug on the packaged path; "" on the Something Else path. */
  plan: string;
  cycle: CycleId;
  /** Service chips, Something Else path only. */
  scope: string[];
  /** Budget band, Something Else path only. The packaged path has a price. */
  budget: string;
  notes: string;
  timeline: string;
  name: string;
  email: string;
  phone: string;
};

/**
 * The strings the caller resolves out of the rendered view.
 *
 * Passed in rather than looked up here so this module never has to know the
 * `PricingView` shape — which would drag the whole pricing payload into every
 * test that wanted to check a validation bound.
 */
export type BriefLabels = {
  serviceLabel: string;
  planLabel: string;
  /** The formatted figure, e.g. "₹1,50,000/month". Packaged path only. */
  priceLabel: string;
  /** e.g. "billed annually". Empty on monthly and on one-time plans. */
  cycleLabel: string;
};

export type Problem = { field: string; message: string };

export const emptyBrief = (): BriefState => ({
  brand: "",
  industry: "",
  industryOther: "",
  service: "",
  plan: "",
  cycle: "",
  scope: [],
  budget: "",
  notes: "",
  timeline: "",
  name: "",
  email: "",
  phone: "",
});

/* ------------------------------------------------------------- vocabulary -- */

export const FAMILY_LABELS: Record<string, string> = {
  retainer: "Digital Retainer",
  website: "Website Development",
  care: "Website Care",
  other: "Something else",
};

export const INDUSTRIES = [
  "Real Estate",
  "Healthcare",
  "Events",
  "Hospitality",
  "Retail",
  "Education",
  "Manufacturing",
  "Technology",
  "Other",
];

/**
 * The one-off pieces of work that do not belong to a package.
 *
 * The three packaged services are cards on step 3, so they are absent here —
 * this is the Something Else path's inventory, not the old form's full chip
 * set.
 */
export const SCOPE_CHIPS = [
  "Branding",
  "Logo design",
  "Packaging",
  "Social media",
  "Video production",
  "Print ads",
  "Brand collaterals",
  "Booking systems",
  "Campaigns",
  "Reels & shorts",
];

/** Bracketed around the published rate card rather than round numbers. */
export const BUDGETS = [
  "UNDER ₹50K",
  "₹50K–1.5L",
  "₹1.5L–3L",
  "₹3L–5L",
  "₹5L+",
  "NOT SURE YET",
];

export const TIMELINES = ["ASAP", "THIS MONTH", "THIS QUARTER", "FLEXIBLE"];

/* ------------------------------------------------------------- step shape -- */

/**
 * Step 4 changes shape rather than disappearing, so the progress rail never
 * renumbers between the two paths.
 */
export const step4Kind = (state: BriefState): "plan" | "scope" =>
  state.service === "other" ? "scope" : "plan";

/* ------------------------------------------------------------- validation -- */

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PHONE = /^\+?[\d\s()-]{7,}$/;

/**
 * The first problem on a step, or null.
 *
 * Every rule mirrors one the zod schema on /api/contact enforces, so nothing
 * round-trips only to come back as a generic failure. Each carries its own
 * message: "fill the marked fields" does not tell anyone what was wrong with
 * what they typed.
 */
export function validateStep(step: number, state: BriefState): Problem | null {
  const brand = state.brand.trim();
  const name = state.name.trim();
  const email = state.email.trim();
  const phone = state.phone.trim();
  const notes = state.notes.trim();

  switch (step) {
    case 1:
      if (brand.length < 2)
        return { field: "brand", message: "YOUR BRAND NAME NEEDS AT LEAST 2 CHARACTERS." };
      if (brand.length > 120)
        return { field: "brand", message: "THAT BRAND NAME IS OVER 120 CHARACTERS." };
      return null;

    case 2:
      if (!state.industry)
        return { field: "industry", message: "PICK THE INDUSTRY YOU WORK IN." };
      if (state.industry === "Other") {
        const other = state.industryOther.trim();
        if (!other)
          return { field: "industryOther", message: "TELL US WHICH INDUSTRY." };
        if (other.length > 60)
          return { field: "industryOther", message: "THAT IS OVER 60 CHARACTERS." };
      }
      return null;

    case 3:
      if (!state.service)
        return { field: "service", message: "PICK A SERVICE TO CONTINUE." };
      return null;

    case 4:
      if (step4Kind(state) === "scope") {
        if (!state.scope.length)
          return { field: "scope", message: "PICK AT LEAST ONE THING YOU NEED." };
        if (!state.budget)
          return { field: "budget", message: "PICK A BUDGET RANGE — AN ESTIMATE IS FINE." };
        return null;
      }
      if (!state.plan)
        return { field: "plan", message: "PICK A PLAN, OR GO BACK AND CHOOSE SOMETHING ELSE." };
      return null;

    case 5:
      /* Optional by design. The composed message is built from the structured
         answers, so the API's min(10) is satisfied even on an empty box. */
      if (notes.length > 2000)
        return {
          field: "notes",
          message: "THE BRIEF IS OVER 2000 CHARACTERS. TRIM IT AND WE WILL ASK THE REST.",
        };
      return null;

    case 6:
      if (name.length < 2)
        return { field: "name", message: "YOUR NAME NEEDS AT LEAST 2 CHARACTERS." };
      if (name.length > 100)
        return { field: "name", message: "YOUR NAME IS OVER 100 CHARACTERS." };
      if (!EMAIL.test(email))
        return { field: "email", message: "THAT EMAIL DOES NOT LOOK RIGHT." };
      /* Optional, but validated when filled — the server only checks its
         length, so "asdf" would otherwise be stored as a phone number. */
      if (phone) {
        if (phone.length > 20)
          return { field: "phone", message: "THAT PHONE NUMBER IS TOO LONG." };
        if (!PHONE.test(phone))
          return { field: "phone", message: "THAT PHONE NUMBER DOES NOT LOOK RIGHT." };
      }
      return null;

    default:
      return null;
  }
}

/* ------------------------------------------------------------- deep links -- */

/** Which family a /pricing `?service=` value names. */
const FAMILY_BY_SERVICE: Record<string, ServiceId> = {
  "social media": "retainer",
  digital: "website",
};

/** Slugs that only exist in the care family, whatever `service` claims. */
const CARE_SLUGS = ["care", "grow"];

const PLAN_NAMES: Record<string, string> = {
  launch: "Launch",
  growth: "Growth",
  scale: "Scale",
  enterprise: "Enterprise",
  care: "Care",
  grow: "Grow",
};

/** Which slugs actually belong to each family, so a mismatch selects nothing. */
const FAMILY_SLUGS: Record<string, string[]> = {
  retainer: ["launch", "growth", "scale"],
  website: ["launch", "growth", "enterprise"],
  care: ["care", "grow"],
};

const CYCLE_NAMES: Record<string, string> = {
  monthly: "monthly",
  quarterly: "quarterly",
  biannual: "every 6 months",
  annual: "annually",
};

/**
 * The six /services/<slug> pages send the visitor here as ?service=<Label>.
 * Those labels are nav service names, which are not chip labels, so the map is
 * written out rather than guessed at with a fuzzy comparison.
 */
const SERVICE_CHIPS: Record<string, string[]> = {
  identity: ["Branding", "Logo design"],
  design: ["Campaigns", "Print ads"],
  "video production": ["Video production"],
  "brand collaterals": ["Brand collaterals"],
};

/**
 * What an inbound link preselects, and the sentence that says so.
 *
 * `plan` alone is ambiguous — "launch" and "growth" are slugs in two different
 * families — so the pair resolves together. A care slug beats `service`,
 * because /pricing sends "Digital" for both the build and the care plans and
 * mapping it blindly ticked Website Build on a care enquiry: the visitor
 * arrived asking for a site they already have.
 *
 * Anything unrecognised selects nothing rather than throwing.
 */
export function resolveEntry(search: string): {
  patch: Partial<BriefState>;
  context: string;
} {
  const patch: Partial<BriefState> = {};
  let context = "";

  try {
    const q = new URLSearchParams(search);
    const want = (q.get("service") || "").trim().toLowerCase();
    const planSlug = (q.get("plan") || "").trim().toLowerCase();
    const cycle = (q.get("cycle") || "").trim().toLowerCase();

    const isCare = CARE_SLUGS.includes(planSlug);
    const family: ServiceId | undefined = isCare
      ? "care"
      : FAMILY_BY_SERVICE[want];

    if (family) {
      patch.service = family;

      if (planSlug && FAMILY_SLUGS[family]?.includes(planSlug)) {
        patch.plan = planSlug;
        if (CYCLE_NAMES[cycle]) patch.cycle = cycle as CycleId;

        const cycleName = CYCLE_NAMES[cycle];
        context = `${PLAN_NAMES[planSlug]} — ${FAMILY_LABELS[family]}${
          cycleName ? `, billed ${cycleName}` : ""
        }`;
      }
    } else if (SERVICE_CHIPS[want]) {
      /* A service page, not a pricing tier. There is no plan to carry, but the
         selection is still said back — otherwise the preselection is silent
         and the visitor cannot tell anything came across with them. */
      patch.service = "other";
      patch.scope = [...SERVICE_CHIPS[want]];
      context = SERVICE_CHIPS[want].join(", ");
    }
  } catch {
    /* malformed query string — preselect nothing */
  }

  return { patch, context };
}

/* --------------------------------------------------------------- outgoing -- */

/** The industry as submitted: the free text when the chip was "Other". */
const industryOf = (state: BriefState) =>
  state.industry === "Other" ? state.industryOther.trim() : state.industry;

/**
 * The message body.
 *
 * An operator reading the dashboard sees the same summary the visitor
 * confirmed on step 7. The header alone always exceeds ten characters, which
 * is what lets step 5 be optional.
 */
export function composeMessage(state: BriefState, labels: BriefLabels): string {
  const lines = [`Industry: ${industryOf(state)}`, `Service: ${labels.serviceLabel}`];

  if (step4Kind(state) === "scope") {
    lines.push(`Needs: ${state.scope.join(", ")}`);
    if (state.budget) lines.push(`Budget: ${state.budget}`);
  } else if (labels.planLabel) {
    const price = [labels.priceLabel, labels.cycleLabel].filter(Boolean).join(", ");
    lines.push(`Plan: ${labels.planLabel}${price ? ` — ${price}` : ""}`);
  }

  if (state.timeline) lines.push(`Timeline: ${state.timeline}`);

  const notes = state.notes.trim();
  /* The separator is only drawn when there is something below it. */
  return notes ? `${lines.join("\n")}\n———\n${notes}` : lines.join("\n");
}

/** The body posted to /api/contact. */
export function submissionFrom(state: BriefState, labels: BriefLabels) {
  const scoped = step4Kind(state) === "scope";

  return {
    name: state.name.trim(),
    email: state.email.trim(),
    phone: state.phone.trim(),
    company: state.brand.trim(),
    message: composeMessage(state, labels),
    industry: industryOf(state),
    services: scoped ? [...state.scope] : [labels.serviceLabel],
    plan: scoped ? "" : labels.planLabel,
    billing_cycle: scoped ? "" : state.cycle,
    /* The packaged path has a real figure; the other path has a band. */
    budget: scoped ? state.budget : labels.priceLabel,
    timeline: state.timeline,
  };
}
