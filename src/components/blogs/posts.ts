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
  /**
   * ISO date of the last genuine revision. Omit until there is one.
   *
   * It exists so `dateModified` can stop being a copy of `datePublished`.
   * Publishing the two as equal on every post tells Google the archive has
   * never been touched, which is the opposite of the freshness signal the field
   * is there to carry. Set this only when the copy actually changed — bumping
   * it on a typo fix, or on every deploy, is the kind of claim Google learns to
   * discount, and then the field is worth nothing when a post is really
   * rewritten.
   */
  updated?: string;
  /**
   * Thumbnail treatment. Still meaningful with artwork in place: it picks the
   * gradient scrim laid over the image, so the tag chip stays legible whether
   * the art underneath is a white-background vector or a dark photo.
   */
  v: "v1" | "v2" | "v3" | "v4";
  /** Object name in the "blogs images" bucket — see lib/cdn.ts `blogImage`. */
  img: string;
  /**
   * Optional distinct artwork for the article hero. Only the two posts that
   * were shot with a second frame set this; everything else reuses `img` in
   * both places, which is why the renderer falls back rather than requiring it.
   */
  imgHero?: string;
  body: Block[];
};

/**
 * Read time is measured, not declared.
 *
 * It used to be an authored `read` field, and every post disagreed with itself:
 * a 223-word post claimed a five-minute read. That is a small lie to a reader,
 * but the article schema publishes `wordCount` and `timeRequired` side by side,
 * so it was also a contradiction shipped straight to Google. Deriving it from
 * the body means the badge, the schema and the actual text can never drift.
 */
const WPM = 200;

export const wordCount = (p: Post) =>
  p.body
    .flatMap((b) => (b.t === "list" ? b.c : [b.c]))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

export const readingMinutes = (p: Post) =>
  Math.max(1, Math.round(wordCount(p) / WPM));

/**
 * Newest first — the listing, the sitemap and the "next up" link all read this
 * order. Body copy may contain internal links as `[text](/path)`; only
 * root-relative paths are rendered as anchors (see `inline` in content.ts).
 */
export const POSTS: Post[] = [
  {
    slug: "why-your-website-is-slow",
    title: "Your website is slow, and it is costing you the enquiry.",
    excerpt:
      "Website speed is not a developer problem you fix at the end. It is a design decision you make at the start — and Google now measures it on your behalf.",
    tag: "WEBSITES",
    date: "2026-07-14",
    v: "v3",
    img: "Your website is slow, and it is costing you the enquiry..jpg",
    body: [
      {
        t: "p",
        c: "Your website looks fine. It looks fine because you are looking at it on a fast laptop, on office wifi, with every asset already sitting in your browser cache from the last time you checked. Almost nobody else sees that website.",
      },
      {
        t: "p",
        c: "The person you actually built it for is on a mid-range Android phone, on patchy 4G, standing somewhere. They tapped your link from a search result or an Instagram bio, and they are giving you a couple of seconds before they go back and tap the next one. That is the real test, and it is the one most sites quietly fail.",
      },
      {
        t: "h2",
        c: "Slow is a design decision, not a bug",
      },
      {
        t: "p",
        c: "Speed gets treated as something a developer optimises at the end, once the design is signed off. By then it is too late, because the expensive decisions were already made in the design file: the full-bleed hero photograph, the four font weights, the embedded map, the chat widget, the analytics tag, the second analytics tag nobody remembers adding.",
      },
      {
        t: "p",
        c: "Every one of those is a request. Every request is time. A page is not slow because someone wrote bad code — it is slow because someone said yes to twelve things and nobody counted what they cost.",
      },
      {
        t: "quote",
        c: "A page that takes six seconds to load has already lost the person it was built for. They did not read your headline. They never saw it.",
      },
      {
        t: "h2",
        c: "The three culprits, in order",
      },
      {
        t: "list",
        c: [
          "Images. Almost always the biggest single problem. A print-resolution photograph dropped straight into a web page can be five megabytes on its own, displayed in a slot 400 pixels wide. It is the same picture either way — the visitor just paid for the version they cannot see.",
          "Fonts. Every weight and every style is a separate file. Four weights of a display face, plus a body face, plus a mono face for good measure, and the text on the page cannot render until they arrive.",
          "Third-party scripts. Chat widgets, tag managers, heatmaps, embedded videos, social feeds. Each one is a script from someone else's server, running at a speed you do not control, on a page you are judged for.",
        ],
      },
      {
        t: "p",
        c: "None of these require a rebuild to fix. They require someone to sit down and account for them, which is a less exciting job than redesigning the homepage, which is why it rarely happens.",
      },
      {
        t: "h2",
        c: "What Google is now measuring",
      },
      {
        t: "p",
        c: "Search engines stopped taking your word for it some time ago. Page experience is measured from real visits by real people, and it feeds into where you rank. Three numbers carry most of the weight, and they are worth understanding in plain language:",
      },
      {
        t: "list",
        c: [
          "Largest Contentful Paint — how long until the biggest thing on screen actually appears. Usually your hero image or your headline. This is the one images ruin.",
          "Interaction to Next Paint — how long the page takes to respond when someone taps. This is the one heavy scripts ruin.",
          "Cumulative Layout Shift — how much the page jumps around while it loads. This is what happens when an image has no dimensions set and the text below it lurches down the moment it arrives.",
        ],
      },
      {
        t: "p",
        c: "These are not abstractions. They are a description of what it feels like to use your site on a bad connection — written down as numbers, and then used to rank you against the competitor whose site does not do that.",
      },
      {
        t: "h2",
        c: "The fix is boring, and it works",
      },
      {
        t: "p",
        c: "Serve images at the size they are displayed and in a modern format. Set width and height on every one so nothing jumps. Ship the font weights you actually use and no more. Audit the third-party scripts and delete the ones nobody has opened a report from in six months — there are always some.",
      },
      {
        t: "p",
        c: "Then test on a real phone, on mobile data, with the cache cleared. Not on your laptop. The gap between those two experiences is the gap between the site you think you have and the site your customers actually get.",
      },
      {
        t: "p",
        c: "This is the standard we build every site to — see [how we approach websites](/services#web) and the [client sites we have shipped](/services#clients). If yours is slow and you are not sure why, [send us the link](/start-project) and we will tell you what is eating it.",
      },
    ],
  },
  {
    slug: "what-a-logo-actually-costs",
    title: "What you are actually paying for when you buy a logo.",
    excerpt:
      "The same brief comes back at wildly different prices, and the difference is almost never the drawing. Here is what moves the number, and what you get for it.",
    tag: "BRANDING",
    date: "2026-07-10",
    v: "v1",
    img: "What you are actually paying for when you buy a logo.1.jpg",
    imgHero: "What you are actually paying for when you buy a logo.2.jpg",
    body: [
      {
        t: "p",
        c: "Ask three studios to design a logo and you will get three prices that look like they came from different industries. It is a reasonable thing to find annoying. It also has a real explanation, and it is not that the expensive one draws better.",
      },
      {
        t: "p",
        c: "The drawing is the smallest part of the job. What you are paying for is everything that has to be true before the drawing can be right, and everything that has to exist afterwards for it to survive contact with the real world.",
      },
      {
        t: "h2",
        c: "You are paying for the decisions made before anyone opens a design tool",
      },
      {
        t: "p",
        c: "A mark cannot be judged in isolation. It can only be judged against a job. Who is this for, what do they currently believe, what does it need to survive — a signboard seen from a moving car, a forty-pixel favicon, an embroidered polo, a reel someone is already scrolling past?",
      },
      {
        t: "p",
        c: "A cheap logo skips that conversation and gives you something that looks good on a white artboard at full zoom. That is the one context it will almost never appear in. We have written about that specific failure in more detail — [a mark gets half a second, and that is the whole brief](/blogs/your-logo-has-half-a-second).",
      },
      {
        t: "quote",
        c: "You are not buying a picture. You are buying every decision that made that picture the correct one, and the proof that it holds up everywhere you will have to use it.",
      },
      {
        t: "h2",
        c: "What actually moves the price",
      },
      {
        t: "list",
        c: [
          "Scope. A mark on its own is one thing. A mark plus the type system, the colour system, the rules for how it behaves on a photograph, on black, at 20 pixels, in a single colour — that is a different piece of work with a different price.",
          "Rounds. Exploration costs time. Three genuinely different territories, each taken far enough to be judged fairly, costs more than one safe route dressed up as three.",
          "Applications. A logo that has been tested on the signage, the packaging, the invoice and the uniform is a logo that will work. Someone has to build all of those to find out.",
          "Ownership. Whether you get the working files, whether the type licence covers your use, whether you can hand it to another studio in three years without buying it again.",
        ],
      },
      {
        t: "p",
        c: "Notice that none of those are aesthetic. They are all questions about how much of the real problem is being solved, and by whom, and who owns the answer at the end.",
      },
      {
        t: "h2",
        c: "The cheap logo is rarely the cheap one",
      },
      {
        t: "p",
        c: "The bill you can see is the design fee. The bill you cannot see arrives later: the sign that had to be remade because the mark was unreadable at the size the shopfront allowed, the packaging run that came back muddy because nobody specified how the colour behaves in print, the pitch deck where the logo sat on a dark slide and simply vanished.",
      },
      {
        t: "p",
        c: "Every one of those is someone paying twice for a decision that was skipped once. That is the actual cost of the cheap logo, and it is paid by whoever inherits it.",
      },
      {
        t: "h2",
        c: "What a fair answer looks like",
      },
      {
        t: "p",
        c: "A studio should be able to tell you, before you commit, exactly what you get: how many directions, how many rounds, which applications are tested, what files you own, and what happens if you need something new in a year. If they cannot, the number is a guess, and a guess is what you will get.",
      },
      {
        t: "p",
        c: "That is how we quote [identity work](/services#logos), and it is why the first thing we ask for is not a mood board but a brief — [the brief is the work](/blogs/the-brief-is-the-work). If you want a real number for a real scope, [tell us what you are building](/start-project) and we will show you what is in it.",
      },
    ],
  },
  {
    slug: "packaging-gets-three-seconds",
    title: "Your packaging gets three seconds, and forty rivals.",
    excerpt:
      "A shelf is the most competitive media your brand will ever buy. Packaging that works is designed for the glance, the grab and the rival beside it.",
    tag: "BRANDING",
    date: "2026-07-07",
    v: "v2",
    img: "Your packaging gets three seconds, and forty rivals.1.jpg",
    imgHero: "Your packaging gets three seconds, and forty rivals.2.jpg",
    body: [
      {
        t: "p",
        c: "A shelf is not a gallery. It is the most hostile piece of media your brand will ever appear in — forty competitors at the same eye height, under the same flat light, in front of someone who is holding a phone, pushing a trolley and thinking about dinner.",
      },
      {
        t: "p",
        c: "Your pack gets about three seconds in that environment, and it does not get them alone. It gets them next to everything else, which is the part most packaging design quietly forgets.",
      },
      {
        t: "h2",
        c: "Design for the shelf, not for the artboard",
      },
      {
        t: "p",
        c: "Packaging is almost always approved as a flat file on a screen, one design at a time, blown up large. Then it is printed, and it goes and stands in a row of rivals at actual size, under lights that were not in the file.",
      },
      {
        t: "p",
        c: "The only honest test is a mock shelf. Print it, put it between the two brands it will actually sit beside, stand back three metres and look. Most designs that die on the shelf died right there, and could have been saved for the cost of a print-out.",
      },
      {
        t: "quote",
        c: "Nobody compares your pack to the version in your presentation. They compare it to the one next to it.",
      },
      {
        t: "h2",
        c: "The four questions a pack has to answer, in order",
      },
      {
        t: "list",
        c: [
          "What is it? If someone cannot name the category in a glance, nothing else on the pack matters. This is where clever kills.",
          "Whose is it? The brand block has to survive at three metres, upside down, half-obscured by the pack in front of it.",
          "Why this one? One reason, stated once. Not seven claims competing for the same square inch.",
          "How do I use it? The information people actually reach for, on the back, where they can find it without turning the pack four times.",
        ],
      },
      {
        t: "p",
        c: "Almost every failed pack fails by answering these in the wrong order — leading with the poetry and burying the category, so the shopper never gets far enough to hear the poetry.",
      },
      {
        t: "h2",
        c: "The things that only go wrong in production",
      },
      {
        t: "p",
        c: "Screen colour is light. Print colour is ink on a substrate, and the substrate fights back. A rich matte black on your monitor can arrive as a scuffed grey on kraft board. A fine hairline rule can disappear entirely at press. A gradient that reads as premium on a laptop can band visibly across a real print run.",
      },
      {
        t: "p",
        c: "This is why packaging is not a graphic design job with a different canvas size. It is a manufacturing job with a design brief attached, and the studio doing it has to have stood next to a press.",
      },
      {
        t: "h2",
        c: "The pack is the rest of your brand, in the one place it gets touched",
      },
      {
        t: "p",
        c: "It is the only piece of your identity a customer will ever hold in their hands, keep on a counter for a month, and photograph without being asked. Whatever the pack says about you is what you are — and it has to agree with everything else, which is a discipline problem before it is a design one. We have made the wider argument here: [consistency is the strategy](/blogs/consistency-is-the-strategy).",
      },
      {
        t: "p",
        c: "Packaging sits inside our [identity work](/services#logos) and our [brand collaterals](/services#collat), because it is genuinely both. If you have a product going to shelf, [show us the category](/start-project) — the competitors tell us more than the brief does.",
      },
    ],
  },
  {
    slug: "what-social-media-management-actually-is",
    title: "What a social media manager actually does all month.",
    excerpt:
      "Not posting. Posting is the last twenty minutes of a long process — and the reason most brand accounts stall is that everything before it was skipped.",
    tag: "SOCIAL",
    date: "2026-07-03",
    v: "v4",
    img: "What a social media manager actually does all month..jpg",
    body: [
      {
        t: "p",
        c: "Most brands think they are buying posts. They count them, too — twelve a month, sixteen a month, as though the number were the product. It is a reasonable misunderstanding, and it is why so many brand accounts are busy and going nowhere.",
      },
      {
        t: "p",
        c: "Posting is the last twenty minutes. If the twenty minutes is all you are buying, you are paying someone to fill a calendar, and a full calendar is not a result.",
      },
      {
        t: "h2",
        c: "The work happens before anything is published",
      },
      {
        t: "list",
        c: [
          "Deciding what the account is for. Awareness, enquiries, recruitment, credibility with a buyer who will check you before a meeting — these need different content, and an account trying to do all four does none.",
          "Working out what the audience already believes, and what would have to change for them to act.",
          "Writing hooks. The first line and the first frame are most of the job, because they decide whether the rest is ever seen.",
          "Making the thing. Shooting, editing, designing, writing — the part everyone pictures, and the smallest slice of the month.",
          "Reading what happened, honestly, and letting it change next month rather than filing it in a report nobody opens.",
        ],
      },
      {
        t: "p",
        c: "A good month is mostly the first three and the last one. The making is the visible part, so it is the part that gets priced — which is precisely why so much social media is well-produced and completely inert.",
      },
      {
        t: "quote",
        c: "Reach that goes nowhere is not marketing. It is a receipt for attention you did not convert.",
      },
      {
        t: "h2",
        c: "Vanity numbers, and the ones that pay",
      },
      {
        t: "p",
        c: "Followers, likes and impressions are easy to grow and easy to report, which is why they dominate every deck you have ever been sent. They tell you almost nothing about whether the account is working.",
      },
      {
        t: "p",
        c: "Watch instead: saves and shares, which mean the content was worth keeping or worth being seen endorsing. Profile visits, which mean somebody wanted to know who made it. And the only one that pays the bill — enquiries that can be traced back to it.",
      },
      {
        t: "h2",
        c: "Every post needs somewhere to go",
      },
      {
        t: "p",
        c: "The most common failure is not bad content. It is good content with no exit. A reel does its job, someone is interested, they tap the profile, and the path ends: a dead bio link, a page that takes eight seconds to load, no obvious next step.",
      },
      {
        t: "p",
        c: "You spent the money on attention and then failed to build the corridor. We have written about the fix — [reels that route](/blogs/reels-that-route) — and it is why the social work and the [website work](/services#web) are the same conversation for us, not two line items.",
      },
      {
        t: "h2",
        c: "What good looks like",
      },
      {
        t: "p",
        c: "Fewer posts, each with a reason to exist. A hook written before the shoot, not captioned on afterwards. A clear next step in every piece. And a monthly review that is allowed to say something did not work, because an agency that reports only good news is not reporting.",
      },
      {
        t: "p",
        c: "That is how we run [social media](/services#reels) — the creatives, the reels and the route out of them. If your account is busy but quiet, [tell us what it is meant to be doing](/start-project) and we will tell you why it is not.",
      },
    ],
  },
  {
    slug: "when-to-rebrand",
    title: "How to tell it is your brand, and not your business.",
    excerpt:
      "A rebrand fixes a perception problem, not a product, price or process problem. Knowing which one you have will save you a great deal of money.",
    tag: "IDENTITY",
    date: "2026-06-30",
    v: "v1",
    img: "How to tell it is your brand, and not your business..png",
    body: [
      {
        t: "p",
        c: "Sales are flat. The website feels tired. The logo suddenly looks dated in a way it did not last year. Somebody says the word rebrand in a meeting and everyone nods, because it is the most satisfying thing you can spend money on: visible, decisive, and it produces something to look at.",
      },
      {
        t: "p",
        c: "It is also, quite often, the wrong purchase. A rebrand solves exactly one class of problem — a perception problem. If what you have is a product problem, a price problem or a process problem, a new logo will simply describe it more beautifully.",
      },
      {
        t: "h2",
        c: "Signs it really is the brand",
      },
      {
        t: "list",
        c: [
          "People consistently misunderstand what you sell. They think you are smaller, cheaper, older or narrower than you are — and they think it before speaking to you.",
          "You have outgrown the name or the mark. The business does three things now and the identity only says one.",
          "You cannot use your own identity. The logo does not work on the app icon, the packaging or the uniform, so every team has quietly made their own version.",
          "You look like your competitors, and buyers cannot tell you apart in a line-up. That is a distinctiveness failure, and it is fixable by design.",
        ],
      },
      {
        t: "h2",
        c: "Signs it is not the brand",
      },
      {
        t: "list",
        c: [
          "People understand you perfectly and choose someone else. That is a proposition problem, and a new colour palette will not touch it.",
          "Enquiries arrive and go cold. That is a sales and follow-up problem, and it lives in a process, not a typeface.",
          "The team hates the logo. Internal fatigue is real, and it is not the same as market fatigue. You look at your logo a thousand times more than your customers do.",
        ],
      },
      {
        t: "quote",
        c: "A rebrand changes what people think you are. It cannot change what you are. Be very clear which one is broken.",
      },
      {
        t: "h2",
        c: "The half-rebrand is the most expensive option",
      },
      {
        t: "p",
        c: "Worse than not rebranding is rebranding halfway: the new mark goes on the website and the social profiles, while the old one stays on the signage, the invoices, the vans and the deck the sales team actually sends. Now you have two brands, and no one is quite sure which is you.",
      },
      {
        t: "p",
        c: "The cost of a rebrand is never the design fee. It is the rollout — every surface, every template, every printed thing, all of it changed inside a window short enough that nobody gets confused. Budget for that or do not start.",
      },
      {
        t: "h2",
        c: "If you do it, change what people can actually see",
      },
      {
        t: "p",
        c: "Rebrands fail quietly when they change things only the studio can perceive: the logo is subtly refined, the grey is warmer, the spacing is better. Genuine improvements, all invisible from a moving car. If the market cannot tell anything happened, nothing did.",
      },
      {
        t: "p",
        c: "The point of an identity is to be recognised in half a second and to hold that recognition everywhere — which is a system, not a picture. We do this as [identity work](/services#logos) and roll it across [every collateral](/services#collat) in one window. If you are not sure which problem you have, [describe the symptom](/start-project) — we would rather talk you out of a rebrand than sell you one that cannot work.",
      },
    ],
  },
  {
    slug: "what-a-brand-film-costs",
    title: "What actually costs money in a brand film.",
    excerpt:
      "Not the camera. The budget for a video is decided by decisions made weeks before anyone shoots — and by how many times you change your mind afterwards.",
    tag: "CREATIVE",
    date: "2026-06-27",
    v: "v3",
    img: "What actually costs money in a brand film..jpg",
    body: [
      {
        t: "p",
        c: "Everyone assumes the money is in the camera. It is not. Cameras are the most commoditised part of the entire process — the phone in your pocket shoots footage that would have needed a broadcast van twenty years ago.",
      },
      {
        t: "p",
        c: "The money is in time, people and decisions. Mostly decisions, and mostly the ones made long before anyone turns up on the day.",
      },
      {
        t: "h2",
        c: "What you are actually paying for",
      },
      {
        t: "list",
        c: [
          "The script. The cheapest thing to change and the most expensive thing to get wrong. A weak idea shot beautifully is an expensive weak idea.",
          "The day. A crew, a location, a permit, a light, and everybody standing around while one thing is fixed. Shoot days are the unit of cost, which is why an extra location can cost more than an extra camera.",
          "The people in front of the lens. A real customer, a hired actor or your own MD each carry different costs, and different amounts of risk.",
          "The edit. Where the film is actually made. And where the budget goes to die, because it is the only stage where the client can keep changing their mind for free.",
        ],
      },
      {
        t: "quote",
        c: "Nobody has ever saved money by shortening the script conversation. They have only moved the cost into the edit, where it is three times more expensive.",
      },
      {
        t: "h2",
        c: "The version problem",
      },
      {
        t: "p",
        c: "Most video budgets are blown after the shoot, not during it. The film is delivered, and then it needs a sixteen-by-nine cut for the website, a vertical cut for reels, a six-second version for pre-roll, a silent version with subtitles for feeds, and a fifteen-second version because someone in the meeting said fifteen felt right.",
      },
      {
        t: "p",
        c: "Each of those is a real edit with real hours in it. Decide the cut list before the shoot, and you will shoot for it — vertical safe areas framed on the day, cutaways captured while the light is right. Decide it afterwards and you will pay to reframe every shot, badly.",
      },
      {
        t: "h2",
        c: "Where the money is genuinely wasted",
      },
      {
        t: "p",
        c: "On production value nobody notices. Drone shots of a building. Slow-motion of a handshake. A sweeping crane move over a factory floor. They are lovely and they are invisible, because the viewer decided in the first two seconds whether to keep watching, and a crane move is not a reason to keep watching.",
      },
      {
        t: "p",
        c: "Spend the money on the first two seconds, on a real idea, and on sound — which is half the experience and the first thing cut when the budget tightens.",
      },
      {
        t: "h2",
        c: "A film has to land somewhere",
      },
      {
        t: "p",
        c: "The most common way to waste an entire video budget is to make something good and then post it into a void: no route to a page, no next step, no way for the person who just watched ninety seconds of your best work to do anything about it.",
      },
      {
        t: "p",
        c: "We script, shoot and cut in-house — see [video production](/services#tv) — and we treat the route out of the film as part of the film, the same way we treat [reels that route](/blogs/reels-that-route). If you have a film in mind, [tell us what it is for](/start-project) before you tell us what it should look like. That is the conversation that decides the budget.",
      },
    ],
  },
  {
    slug: "your-logo-has-half-a-second",
    title: "Your logo has half a second. That's the whole brief.",
    excerpt:
      "A mark doesn't get studied — it gets glimpsed. Here's how we design for the half-second it actually gets, and why that changes every decision.",
    tag: "IDENTITY",
    date: "2026-06-24",
    v: "v1",
    img: "Your logo has half a second. That's the whole brief.jpg",
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
    v: "v2",
    img: "Stop making your homepage a scavenger hunt.jpg",
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
    v: "v4",
    img: "Where the eye actually goes (and why your CTA is invisible).jpg",
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
    /* Shortened from "A reel that gets views isn't the same as a reel that
       gets leads" — 63 characters, the one post still past the ~60 Google
       renders even with the brand suffix dropped. Same claim, keyword first.
       `img` keeps the old wording: it is the object name in the bucket. */
    title: "Reels that get views aren't reels that get leads.",
    excerpt:
      "Views are a vanity metric until the video routes somebody somewhere. The difference is usually the last three seconds, not the first three.",
    tag: "SOCIAL",
    date: "2026-05-14",
    v: "v3",
    img: "A reel that gets views isn't the same as a reel that gets leads.jpg",
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
    v: "v1",
    img: "Consistency isn't a brand rule. It's the entire strategy.png",
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
    v: "v2",
    img: "The brief is the work. The design is just what's left.png",
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
