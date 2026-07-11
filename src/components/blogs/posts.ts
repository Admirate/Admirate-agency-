export type Block =
  | { t: "p"; c: string }
  | { t: "h2"; c: string }
  | { t: "quote"; c: string }
  | { t: "list"; c: string[] };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string; // ISO — rendered as en-IN
  read: number; // minutes
  v: "v1" | "v2" | "v3" | "v4"; // thumbnail treatment
  body: Block[];
};

export const POSTS: Post[] = [
  {
    slug: "your-logo-has-half-a-second",
    title: "Your logo has half a second. That's the whole brief.",
    excerpt:
      "A mark doesn't get studied — it gets glimpsed. Here's how we design for the half-second it actually gets, and why that changes every decision.",
    tag: "IDENTITY",
    date: "2026-06-24",
    read: 5,
    v: "v1",
    body: [
      {
        t: "p",
        c: "Nobody looks at your logo. They glance at it — on a signboard from a moving car, in a 40-pixel favicon, in the corner of a reel someone is already scrolling past. You get about half a second, and you get it while the viewer is thinking about something else entirely.",
      },
      {
        t: "p",
        c: "That single constraint decides almost everything about a good mark, and it's the reason so many logos that look beautiful in a presentation deck fall apart the moment they hit the real world.",
      },
      { t: "h2", c: "Design for the worst case, not the best one" },
      {
        t: "p",
        c: "The mistake is designing the logo at the size you're viewing it: full screen, on a clean white artboard, at 100% zoom. That's the one context it will almost never appear in. We work the other way around — the first test any mark has to survive is the smallest, ugliest place it will ever live.",
      },
      {
        t: "list",
        c: [
          "Shrink it to 16px. If it turns into a smudge, the detail is decoration, not identity.",
          "Flatten it to a single black. If it stops working without the gradient, the gradient was doing the work.",
          "Print it in one colour on a bad photocopy. This is a real thing that happens to real logos.",
          "Put it on a busy photograph. It has to hold its own against noise it didn't choose.",
        ],
      },
      {
        t: "quote",
        c: "If a mark only works at the size you designed it, you haven't designed a mark. You've designed an illustration.",
      },
      { t: "h2", c: "Recognition beats cleverness" },
      {
        t: "p",
        c: "There's a strong pull toward the clever solution — the hidden arrow, the negative-space animal, the letterform that's also a rocket. Sometimes that's genuinely great. But the cleverness has to survive the glance, and most cleverness doesn't. It rewards the person who stops and studies, and nobody stops and studies.",
      },
      {
        t: "p",
        c: "What survives the glance is silhouette. A distinct outline, a confident weight, one memorable move. If someone can sketch your logo badly from memory a week later, it's working. That's the actual test — not whether it wins a design award, but whether it survives being half-remembered.",
      },
      { t: "h2", c: "The half-second is a gift" },
      {
        t: "p",
        c: "It sounds like a limitation. It's really a filter. Once you accept that half a second is all you get, the hundred possible directions collapse into the two or three that could actually do the job — and the work gets faster, sharper, and much easier to defend.",
      },
    ],
  },
  {
    slug: "the-homepage-scavenger-hunt",
    title: "Stop making your homepage a scavenger hunt",
    excerpt:
      "Most homepages hide the two things a visitor came for. A simple structural fix — one promise, one next step — usually outperforms a redesign.",
    tag: "WEBSITES",
    date: "2026-06-10",
    read: 6,
    v: "v2",
    body: [
      {
        t: "p",
        c: "Someone lands on your site. They have two questions, and they will decide whether to stay based on how fast you answer them: what is this, and what do I do next. That's it. Everything else on the page is, at best, supporting material.",
      },
      {
        t: "p",
        c: "And yet most homepages answer neither. They open with a slogan that could belong to any company in any industry, then send the visitor hunting through a mega-menu for the thing they came for.",
      },
      { t: "h2", c: "One promise above the fold" },
      {
        t: "p",
        c: "The first screen should state, in plain language, what you do and who it's for. Not your mission. Not a mood. If a stranger read only your headline and nothing else, they should be able to describe your business to someone else correctly.",
      },
      {
        t: "quote",
        c: "If your headline would still make sense with a competitor's logo on it, it isn't a headline. It's wallpaper.",
      },
      { t: "h2", c: "One next step, repeated" },
      {
        t: "p",
        c: "The second failure is offering five equally-weighted actions. Book a call, download the brochure, read the blog, follow us, view pricing — all in the same size, same colour, same importance. Given five doors, most people take none.",
      },
      {
        t: "p",
        c: "Pick the single action that matters most to the business. Make it visually louder than everything else. Then repeat it down the page, so the visitor never has to scroll back up to act on a decision they made at the bottom.",
      },
      { t: "h2", c: "Structure before style" },
      {
        t: "p",
        c: "This is why we push back when a client opens with 'we need a redesign.' Often the visuals are fine. What's broken is the order of the argument — the site is making its case in the wrong sequence, and no amount of new typography fixes a bad sequence.",
      },
      {
        t: "list",
        c: [
          "What it is — the plain-language promise.",
          "Proof — the work, the numbers, the names.",
          "How it works — the shape of the engagement.",
          "The ask — one door, clearly marked.",
        ],
      },
      {
        t: "p",
        c: "Get that order right on a plain white page and it will beat a beautiful site that makes the visitor do the work.",
      },
    ],
  },
  {
    slug: "where-the-eye-actually-goes",
    title: "Where the eye actually goes (and why your CTA is invisible)",
    excerpt:
      "Reading an ad isn't a linear act. The eye lands, travels, and rests in a fairly predictable path — and most layouts fight that path instead of using it.",
    tag: "CREATIVE",
    date: "2026-05-28",
    read: 5,
    v: "v4",
    body: [
      {
        t: "p",
        c: "Put a poster in front of someone and their eye does not start at the top-left and read down like a document. It lands somewhere — usually the highest-contrast object or a human face — then jumps, then jumps again, and comes to rest. The whole journey takes a couple of seconds, and the viewer isn't aware of any of it.",
      },
      {
        t: "p",
        c: "Design that ignores this is design that hopes. Design that uses it is advertising.",
      },
      { t: "h2", c: "The layout is a route, not an arrangement" },
      {
        t: "p",
        c: "When we lay out a creative, we're not composing a pretty rectangle. We're plotting a route: the eye lands here, travels there, rests on the action. Every element earns its position by being on that route or getting out of its way.",
      },
      {
        t: "quote",
        c: "A call to action placed where the eye has already left is not a weak CTA. It's an absent one.",
      },
      { t: "h2", c: "Why the CTA disappears" },
      {
        t: "p",
        c: "The most common failure we see: a genuinely good creative with the action bolted onto the bottom-right corner, after the eye has already committed and moved on. It's technically present. Functionally, it doesn't exist.",
      },
      {
        t: "p",
        c: "The fix is rarely 'make the button bigger.' It's to place the action at the end of the path the layout has already established — so arriving at it feels like the natural conclusion of looking, not an interruption.",
      },
      { t: "h2", c: "Contrast is the steering wheel" },
      {
        t: "p",
        c: "You steer attention with contrast — of size, of colour, of weight, of empty space. Emptiness is the most underrated of these. A small element with room around it will out-pull a large element crowded by neighbours. If everything is loud, the viewer picks their own path, and it won't be yours.",
      },
    ],
  },
  {
    slug: "reels-that-route",
    title: "A reel that gets views isn't the same as a reel that gets leads",
    excerpt:
      "Views are a vanity metric until the video routes somebody somewhere. The difference is usually the last three seconds, not the first three.",
    tag: "SOCIAL",
    date: "2026-05-14",
    read: 4,
    v: "v3",
    body: [
      {
        t: "p",
        c: "Everyone obsesses over the hook. Fair enough — no hook, no view. But we see plenty of clients with reels doing genuinely good numbers and a pipeline that hasn't moved, and the problem is almost never the opening. It's that the video ends and the viewer has nowhere to go.",
      },
      { t: "h2", c: "Every reel needs an exit" },
      {
        t: "p",
        c: "A view is a moment of attention you have been loaned. If the video ends without telling the viewer what to do with that attention, it gets returned to the feed, and the next video takes it. The exit is the whole conversion.",
      },
      {
        t: "list",
        c: [
          "Profile — for reels building familiarity, send them to a bio that continues the argument.",
          "Page — for reels answering a specific problem, send them to the page that solves it.",
          "Enquiry — for reels aimed at the ready, ask directly and make it one tap.",
        ],
      },
      {
        t: "quote",
        c: "Views are borrowed attention. The last three seconds decide whether you get to keep any of it.",
      },
      { t: "h2", c: "Match the ask to the intent" },
      {
        t: "p",
        c: "The mismatch we see most: a top-of-funnel entertainment reel ending in 'book a consultation.' The viewer met you nine seconds ago. Asking for a calendar slot is asking for a second date at the end of a handshake. The ask has to be proportional to what the viewer has actually invested.",
      },
      {
        t: "p",
        c: "Route the cold ones to something free and useful. Route the warm ones to the enquiry. Views turn into leads at the point where the ask matches the temperature.",
      },
    ],
  },
  {
    slug: "consistency-is-the-strategy",
    title: "Consistency isn't a brand rule. It's the entire strategy.",
    excerpt:
      "Recognition compounds. Every time you look like yourself, you deposit; every time you don't, you spend. Most brands are quietly running a deficit.",
    tag: "BRANDING",
    date: "2026-04-30",
    read: 5,
    v: "v1",
    body: [
      {
        t: "p",
        c: "A brand guideline document is usually treated as a constraint — a list of things the team isn't allowed to do. That framing is why it gets ignored the first time someone is in a hurry. It's also completely backwards.",
      },
      {
        t: "p",
        c: "Consistency is not a rule you follow. It's the mechanism by which recognition accumulates at all.",
      },
      { t: "h2", c: "Recognition is a balance, not an event" },
      {
        t: "p",
        c: "Nobody recognises you from one exposure. They recognise you from the twentieth, and only if the twenty looked like each other. Every asset that looks like you is a deposit into that account. Every off-brand one-off — the festive post someone made in a rush, the deck with the wrong red, the sign that used a different typeface because it was cheaper — is a withdrawal.",
      },
      {
        t: "quote",
        c: "The brand that looks like itself everywhere is not being rigid. It's being remembered.",
      },
      { t: "h2", c: "The other half: looking unlike everyone else" },
      {
        t: "p",
        c: "Consistency alone isn't enough. You can be perfectly, rigorously consistent and still be invisible, because you look like every other business in your category. Consistent and generic just means you're reliably forgettable.",
      },
      {
        t: "p",
        c: "So the real target has two halves: the same as yourself, everywhere — and unmistakably not your competitors. Hit both and people know it's you before they've read your name. That's the whole game, and there is no shortcut through it.",
      },
    ],
  },
  {
    slug: "the-brief-is-the-work",
    title: "The brief is the work. The design is just what's left.",
    excerpt:
      "Almost every project that goes badly went badly at the start. Here are the questions we ask before anyone opens a design tool.",
    tag: "PROCESS",
    date: "2026-04-16",
    read: 6,
    v: "v2",
    body: [
      {
        t: "p",
        c: "When a project drifts — endless revisions, vague feedback, a final result nobody is quite happy with — it's tempting to blame the execution. In our experience it's almost always traceable to the first week, when everyone agreed on a goal that was never actually specific enough to agree on.",
      },
      { t: "h2", c: "The questions that do the heavy lifting" },
      {
        t: "list",
        c: [
          "Who is this for — not a demographic, a person with a problem and a moment.",
          "What do they currently believe, and what do we need them to believe instead?",
          "What is the single action that counts as success?",
          "Where will this actually be seen — the phone, the hoarding, the feed, the shelf?",
          "What would make us call this a failure in three months?",
        ],
      },
      {
        t: "p",
        c: "That last one is the most useful and the most avoided. A brief that can't be failed can't be judged, and a project that can't be judged will be revised forever on taste alone.",
      },
      {
        t: "quote",
        c: "'Make it pop' is not feedback. It's the sound of a brief that never got written.",
      },
      { t: "h2", c: "Vague feedback is a symptom, not the disease" },
      {
        t: "p",
        c: "When a client says 'I don't love it' and can't say why, they're usually not being difficult. They're measuring the work against a target that was never made explicit, so the only vocabulary available is preference.",
      },
      {
        t: "p",
        c: "Write the target down at the start and feedback changes character entirely. It stops being 'I'd have used blue' and becomes 'this doesn't get a first-time visitor to the enquiry form.' That's a note you can actually design against.",
      },
      { t: "h2", c: "Spend the time up front" },
      {
        t: "p",
        c: "A week spent getting the brief genuinely sharp will save a month of circling. It's the least glamorous part of the process and the only part that reliably determines the outcome.",
      },
    ],
  },
];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);
