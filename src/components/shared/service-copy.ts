/**
 * The written substance behind each of the six service pages.
 *
 * The pages were built as experiences first: each is a hand-authored set of
 * set-pieces with its own stylesheet and engine, and between them they carried
 * 118 to 300 words. That is thinner than any blog post on the site and thinner
 * than /pricing, which is the wrong way round — these are the pages an enquiry
 * actually lands on, and they were the ones saying least.
 *
 * This adds the missing half. It does not replace anything: the existing
 * sections stay exactly as they are, and the block rendered from this file sits
 * after them, before the closing section. See shared/service-prose.ts for the
 * renderer.
 *
 * Rules this copy is written under, and the reasons:
 *
 *   No invented numbers. Nothing here claims a percentage lift, a client count
 *   or a result the site cannot back up. Every project named in `proof` is one
 *   already published elsewhere on this site — the identity wall, the showcase
 *   rail, the creatives grid — described as what it had to do, not as a
 *   statistic nobody can check.
 *
 *   Prices are named as a shape, not a figure. The rate card lives in Supabase
 *   and is editable from the dashboard (see lib/pricing-data.ts); a number typed
 *   here would be a second source of truth, and the one that drifts is always
 *   the copy nobody reopens. The FAQs describe how a quote is arrived at and
 *   send the reader to /pricing, which reads the live card.
 *
 *   Deliverable counts are likewise stated as ranges where they come from the
 *   pricing feature matrix, for the same reason.
 *
 *   Timelines are stated as typical working ranges. They are the one class of
 *   claim here that is a studio decision rather than a fact already on the site
 *   — if the way projects actually run disagrees with a range, change the range.
 *
 * Every FAQ answer is plain prose with at most one link, because the answers are
 * also the FAQPage structured data (see `faqSchema` in lib/schema.ts) and what
 * an AI engine quotes back is the sentence, not the markup around it.
 */

export type Deliverable = { t: string; d: string };
export type Stage = { when: string; t: string; d: string };
export type Faq = { q: string; a: string };

export type ServiceCopy = {
  /** Eyebrow above the block. Short, mono, uppercase at render time. */
  eyebrow: string;
  /** Opening section — keyword-led, plain language, no jargon. */
  what: { h: string; p: string[] };
  deliverables: { h: string; intro: string; items: Deliverable[] };
  process: { h: string; intro: string; stages: Stage[] };
  who: { h: string; p: string[] };
  proof: { h: string; p: string[] };
  faq: { h: string; items: Faq[] };
};

export const SERVICE_COPY: Record<string, ServiceCopy> = {
  /* ------------------------------------------------------------ identity -- */
  identity: {
    eyebrow: "Identity, in full",
    what: {
      h: "What brand identity design actually is",
      p: [
        "Brand identity design is the work of making a business recognisable before it is read. The logo is part of it and not the whole of it: an identity is also the typography, the colour, the spacing, and the decisions about how all of that behaves on a signboard, an invoice, a phone screen and a forty-pixel favicon.",
        "Done properly, a customer knows it is you from across a road or halfway down a feed, without stopping to check. Done badly, you own a picture that looks correct on a white artboard at full zoom — the one place your business will almost never appear.",
      ],
    },
    deliverables: {
      h: "What you get",
      intro:
        "Identity work is quoted against a brief rather than sold as a fixed box, so this is the full range and yours is agreed in writing before anything is drawn. A mark on its own is a smaller piece of work than a mark plus the system that keeps it alive, and the two are priced differently for that reason.",
      items: [
        {
          t: "Primary logo",
          d: "The main mark, drawn once to hold up at signage size and at favicon size without being redrawn for either.",
        },
        {
          t: "Logo variants",
          d: "Horizontal, stacked, single-colour, reversed-out and icon-only versions, so there is a correct file for every place the mark has to go instead of one file being forced everywhere.",
        },
        {
          t: "Clear space and minimum size",
          d: "The rules that stop the mark from being crowded by other elements or shrunk past the point where it still reads.",
        },
        {
          t: "Colour system",
          d: "Brand colours specified for screen and for print, so what comes off a press matches what was approved on a monitor.",
        },
        {
          t: "Type system",
          d: "Display and text typefaces with weights, sizes and hierarchy, and the licence position stated plainly so you know what you are allowed to use and where.",
        },
        {
          t: "Application tests",
          d: "The mark tried on the things it will really live on — signage, a visiting card, packaging, a uniform, a social profile — while there is still time to change it.",
        },
        {
          t: "Brand guidelines",
          d: "A document your printer, your developer and your next hire can follow without having to ring you and ask what is allowed.",
        },
        {
          t: "Working files",
          d: "Editable vector artwork plus export-ready formats in the sizes you will actually be asked for, handed over at the end and yours.",
        },
      ],
    },
    process: {
      h: "How the work runs",
      intro:
        "Five stages. You see work at the end of each one, and nothing moves forward until the stage before it has been signed off — which is what keeps a late change from being an expensive one.",
      stages: [
        {
          when: "Week 1",
          t: "Brief",
          d: "We ask what the mark has to survive before we ask what it should look like: who it is for, what they currently believe, where it will appear, and which of those places is hardest. A week of questions removes a month of revisions.",
        },
        {
          when: "Weeks 2–3",
          t: "Territories",
          d: "Two or three genuinely different directions, each taken far enough to be judged fairly. Not one safe route dressed up three ways — three real answers to the same brief, so choosing between them is a decision rather than a preference.",
        },
        {
          when: "Weeks 3–4",
          t: "Refinement",
          d: "One direction is chosen and drawn properly: proportions, optical spacing, the weight of every curve, and the versions it needs to exist in. This is the stage where a mark stops being a sketch that reads well and becomes one that reproduces well.",
        },
        {
          when: "Weeks 4–6",
          t: "The system",
          d: "Colour, type, spacing and the application tests. The mark is put on a signboard, a card, a package and a screen to find the problems while they are still cheap to fix.",
        },
        {
          when: "Week 6",
          t: "Handover",
          d: "Files, guidelines and a walkthrough with whoever will be using them. You leave able to brief a printer or a developer without us in the room.",
        },
      ],
    },
    who: {
      h: "Who this is for",
      p: [
        "This is the right buy if you are starting something and the first impression has not been made yet, or if you already have customers and the mark is quietly making the business look smaller than it is. It is also the right buy when the logo has drifted — six versions in circulation, nobody sure which is current, every vendor sent a different file.",
        "It is not the right buy if the business is working and only the marketing is tired. That is a design or campaign problem, and rebranding to solve it is an expensive way to lose the recognition you already have.",
      ],
    },
    proof: {
      h: "Proof",
      p: [
        "South Glass is a premium glass and facades business — a technical product sold on trust, where the collateral has to feel as considered as the claim. The identity was built to carry that: a mark that holds at architectural scale and still reads on a quote document, with a colour and type system its website was then built on, so the brand a client meets online is the one they meet on site.",
        "Twelve marks now doing that job in the world are on the wall further up this page, across railway infrastructure, healthcare, expos, wellness and manufacturing.",
      ],
    },
    faq: {
      h: "Common questions",
      items: [
        {
          q: "How much does a logo cost in Hyderabad?",
          a: "There is no single figure, because the same brief can be a mark on its own or a full identity system, and those are different pieces of work. What moves the number is scope, how many directions are explored, how many applications are tested and what you own at the end. We quote against a written brief so you can see exactly what is in it before you commit — we have written up <a href=\"/blogs/what-a-logo-actually-costs\" data-h>what you are actually paying for when you buy a logo</a> if you want the long answer first.",
        },
        {
          q: "How long does a logo or brand identity take?",
          a: "A mark with a basic system typically runs three to four weeks. A full identity with a type and colour system, application tests and written guidelines typically runs five to seven. The variable is almost never the drawing — it is how quickly decisions come back, which is why the brief stage exists.",
        },
        {
          q: "Do I own the logo files at the end?",
          a: "Yes. You get the editable vector artwork and the export formats, and they are yours to hand to any printer, developer or studio afterwards without buying them again. Typeface licences are the one thing that is not ours to transfer, so we state which fonts are used and what your licence covers rather than leaving you to find out later.",
        },
        {
          q: "Can you design just a logo, without the rest?",
          a: "Yes, and sometimes that is the honest recommendation. But a mark with no rules around it tends to come apart within a year — the colour shifts between the printer and the website, someone stretches it to fit a banner, and the brand stops looking like one thing. If the budget only reaches the mark, we say so and scope the system for later rather than pretending it is optional.",
        },
        {
          q: "We already have a logo. Do we need a rebrand?",
          a: "Often not. A rebrand is worth it when the business has genuinely changed, when the mark actively works against you, or when the brand is what customers are confused by. If the business is fine and the marketing has simply gone stale, that is a cheaper problem to fix — <a href=\"/blogs/when-to-rebrand\" data-h>how to tell it is your brand and not your business</a> walks through the difference.",
        },
        {
          q: "Do you work with businesses outside Hyderabad?",
          a: "Yes. The studio operates from Banjara Hills, Hyderabad, and works with clients across India. Identity work is largely a conversation and a review cycle, so distance changes very little; where a project needs people in a room, we say so at the brief stage rather than at the invoice.",
        },
      ],
    },
  },

  /* -------------------------------------------------------------- design -- */
  design: {
    eyebrow: "Design, in full",
    what: {
      h: "What advertising and design work actually is",
      p: [
        "Advertising design is the work of arranging a message so the eye picks it up in the order you intended. A viewer does not read an advertisement — they scan it, in about a second, and they leave with whatever that second gave them. The job is to decide what that is.",
        "So the mark, the headline, the image and the action are not placed where they look balanced. They are placed on the path the eye actually travels, which is why a layout that looks busier can convert better than one that looks calm, and why the prettiest version of an ad is frequently not the one that works.",
      ],
    },
    deliverables: {
      h: "What you get",
      intro:
        "Campaign and advertising work is quoted per brief, because a single press ad and a launch running across print, outdoor, feed and email are not the same job. Most projects draw from the list below.",
      items: [
        {
          t: "Campaign key visual",
          d: "The one idea the campaign is built on, designed as a master layout every other piece is derived from rather than loosely resembles.",
        },
        {
          t: "Press and print advertisements",
          d: "Full-page, half-page and strip formats, built at the publication's specification and supplied print-ready.",
        },
        {
          t: "Outdoor and hoarding artwork",
          d: "Designed for the distance and the speed it will be read at, which usually means less on the board than the brief first asked for.",
        },
        {
          t: "Digital and display sets",
          d: "Banner and display sizes, feed and story formats, built as a set so the campaign stays recognisable as it changes shape.",
        },
        {
          t: "Launch and festive creatives",
          d: "The occasion-led work that carries the same identity as everything else instead of arriving looking like it came from another brand.",
        },
        {
          t: "Copywriting",
          d: "Headline and body copy written with the layout, not poured into it afterwards — the line and the space it sits in are one decision.",
        },
        {
          t: "Presentation and pitch decks",
          d: "The document version of the same argument, built to be read in a room where you may not be the one presenting it.",
        },
        {
          t: "Adaptations and artwork files",
          d: "Every size the campaign has to appear in, rebuilt rather than resized, plus the packaged artwork and fonts a printer or publisher needs.",
        },
      ],
    },
    process: {
      h: "How the work runs",
      intro:
        "One idea, then a rebuild for every place it has to live. A hoarding, a feed post and a printed page are three different problems, and treating them as one file at three sizes is where most campaigns quietly stop working.",
      stages: [
        {
          when: "Days 1–3",
          t: "Objective",
          d: "What has to change, for whom, and how you will know it worked. An ad meant to shift stock and an ad meant to build recognition look different, and agreeing which one this is prevents an argument at the review.",
        },
        {
          when: "Week 1",
          t: "Concept",
          d: "The idea, argued rather than decorated. One or two routes, each presented with the reasoning, so a choice can be made on merit instead of on which colour someone prefers.",
        },
        {
          when: "Week 2",
          t: "Layout and hierarchy",
          d: "The chosen route is built properly: what is seen first, second and last, and what is removed so the first thing stays first. This is the stage that decides whether the call to action is visible or merely present.",
        },
        {
          when: "Weeks 2–3",
          t: "Adaptation",
          d: "The idea is rebuilt for each medium at its real dimensions — the crop, the copy length and the emphasis change per format, because the reading distance does.",
        },
        {
          when: "Week 3",
          t: "Release",
          d: "Print-ready artwork to the publication's specification, digital sets exported to the platform's, and a proof check before anything is committed to a press run.",
        },
      ],
    },
    who: {
      h: "Who this is for",
      p: [
        "This is the right buy when you have a product, an offer or an event and a date it has to land by — a launch, a season, an expo, a sale. It is also the right buy when your advertising is going out consistently and not converting, which is usually a hierarchy problem rather than a spend problem.",
        "If the brand underneath is unresolved, campaign work will paper over it for one season and no longer. In that case the identity is the first spend, not the second.",
      ],
    },
    proof: {
      h: "Proof",
      p: [
        "The campaign work above is real client creative — Adivara Mangadi, the Handloom Expo, Vegan Market, Sastriya Yoga, Find Your Game and a Parkinson's awareness campaign among them. They are deliberately different from one another: a heritage market, a trade expo, a health awareness push and a sports campaign are not served by one house style, and treating them as if they were is how an agency's work starts to look like its own portfolio rather than the client's brand.",
        "What is consistent is the discipline underneath — one idea, placed on the path the eye takes, then rebuilt for every medium it has to appear in.",
      ],
    },
    faq: {
      h: "Common questions",
      items: [
        {
          q: "What does a campaign or advertisement design cost?",
          a: "It is quoted against the brief, because the number is driven by how many mediums the idea has to work across and how many formats each of those needs. A single press advertisement is a small job; a launch spanning outdoor, print, feed and email is a campaign. Tell us the mediums and the date and you get a real figure rather than a range.",
        },
        {
          q: "Do you write the copy as well as design it?",
          a: "Yes. Headline and body copy are written alongside the layout rather than dropped into it, because the length of a line and the space it sits in are the same decision. If you have an in-house writer, we work to their copy and tell them where it needs to be shorter.",
        },
        {
          q: "Can you work to our existing brand guidelines?",
          a: "Yes, and we would rather. Campaign work is stronger when it reinforces a brand people already half-recognise than when it introduces a new look every season — <a href=\"/blogs/consistency-is-the-strategy\" data-h>consistency is not a brand rule, it is the entire strategy</a>. Send the guidelines with the brief and the work is built inside them.",
        },
        {
          q: "How many rounds of revisions are included?",
          a: "Two rounds at concept and two at artwork, which is what a decision genuinely needs. Unlimited revisions sound generous and usually mean the brief was never agreed — we would rather spend that time at the start, where changes are free.",
        },
        {
          q: "Do you handle the printing and media booking?",
          a: "We supply print-ready artwork to the publication or printer's specification and check the proof before it runs. We are not a media buying agency, so we do not book the space — if you have an agency doing that, we work directly with them on specs and deadlines.",
        },
        {
          q: "Why does my call to action get ignored?",
          a: "Usually because it is competing with something louder rather than because it is too small. The eye lands where contrast and isolation put it, and a button surrounded by four other emphasised elements is invisible in the second you are given — <a href=\"/blogs/where-the-eye-actually-goes\" data-h>where the eye actually goes</a> covers the mechanics.",
        },
      ],
    },
  },

  /* -------------------------------------------------------- social-media -- */
  "social-media": {
    eyebrow: "Social media, in full",
    what: {
      h: "What social media management actually is",
      p: [
        "Social media management is the monthly job of planning, producing, publishing and reporting on the content a business puts out — posts, reels, campaign creatives and the copy that carries them. It is not the same as posting. Posting is the last twenty minutes of it.",
        "The measure that matters is not whether the calendar was filled. It is whether the attention went somewhere: a profile visit, a page, a message, an enquiry. Views with no route out of them are a number you cannot spend.",
      ],
    },
    deliverables: {
      h: "What you get",
      intro:
        "Social media runs as a monthly retainer, and the volume steps up by plan — broadly eight to sixteen posts and four to eight reels a month, with more of the campaign and print work included as you go up. The current counts and figures are on <a href=\"/pricing\" data-h>the pricing page</a>, which reads the live rate card; the list below is what the work is made of at every tier.",
      items: [
        {
          t: "Monthly content plan",
          d: "A calendar agreed before the month starts, built around what the business actually has on — a launch, a season, an event — rather than filled with generic days.",
        },
        {
          t: "Posts and creatives",
          d: "Static and carousel creatives designed in your identity, so the feed reads as one brand rather than as a stack of unrelated templates.",
        },
        {
          t: "Reels and shorts",
          d: "Short-form video written for the first two seconds, cut for retention, and ended somewhere — a profile, a page, a message.",
        },
        {
          t: "Copywriting",
          d: "Captions, hooks and calls to action written for the platform, not one caption reused across four of them.",
        },
        {
          t: "Publishing and scheduling",
          d: "Everything scheduled and posted for you, on the accounts you own, so nothing depends on somebody remembering at nine at night.",
        },
        {
          t: "Meta and Google ads support",
          d: "Creative and copy built for paid, and support on running it — so what you promote is designed to be promoted rather than boosted because it did well organically.",
        },
        {
          t: "Festive and campaign creatives",
          d: "The occasion work that carries the same identity as the rest, produced on the higher plans without a separate line on the invoice.",
        },
        {
          t: "Monthly report",
          d: "What went out, what it did, and what changes next month because of it. One page you can act on, not an export of every metric the platform offers.",
        },
      ],
    },
    process: {
      h: "How the month runs",
      intro:
        "A retainer is only worth what its rhythm is worth. This is the cycle each month follows, so you always know what is happening and when it needs you.",
      stages: [
        {
          when: "Onboarding",
          t: "Audit and direction",
          d: "We go through the accounts as they stand: what has worked, what the feed currently says about the business, and where the attention is leaking. That produces a direction rather than a list of complaints.",
        },
        {
          when: "Week 4, prior month",
          t: "The plan",
          d: "Next month's calendar — themes, formats, what each piece is for and where it sends people — sent for approval before the month begins, not during it.",
        },
        {
          when: "Weeks 1–2",
          t: "Production",
          d: "Creatives designed, reels edited, copy written. You review in one batch instead of piece by piece, which is faster for you and stops the calendar slipping.",
        },
        {
          when: "Ongoing",
          t: "Publishing and response",
          d: "Scheduled and posted on time, with the first-hours activity watched — comments and messages routed to you, and anything urgent flagged rather than sat on.",
        },
        {
          when: "Month end",
          t: "Report and adjust",
          d: "What performed, what did not, and the specific change being made next month. A month with no change in it is a month that learned nothing.",
        },
      ],
    },
    who: {
      h: "Who this is for",
      p: [
        "This is the right buy when the business needs to be visible continuously rather than in bursts, and when the posting has become somebody's fourth priority — a founder at eleven at night, an intern with no brief, a nephew with an eye. Consistency is the part that is hard to buy back later.",
        "It is not the right buy if what you actually need is one campaign for one launch. That is a design or video job with a defined end, and paying a monthly retainer for it is the expensive route to the same file.",
      ],
    },
    proof: {
      h: "Proof",
      p: [
        "Samyoga Studio is a Pilates and yoga studio, and its feed has a specific job: convert curiosity into a first class. The creatives are built around the questions that actually stop someone booking — when are the batches, what does an hour involve, is it too late to start — rather than around motivational quotes. Class timings, benefits and start-now pieces run as one recognisable set, so the account reads as a studio you could walk into on Monday.",
        "The wall above also carries campaign work for Hope Trust India, the Handloom Expo, Adivara Mangadi and Vegan Market — different audiences, the same rule about giving attention somewhere to go.",
      ],
    },
    faq: {
      h: "Common questions",
      items: [
        {
          q: "What does social media management include each month?",
          a: "Planning, design, copy, video editing, scheduling, publishing and a monthly report — and on the higher plans, ads creative and support, email creatives and print pieces. The volume of posts and reels steps up by plan; the working method does not change between them. <a href=\"/blogs/what-social-media-management-actually-is\" data-h>What a social media manager actually does all month</a> goes through it in detail.",
        },
        {
          q: "How many posts and reels do I get a month?",
          a: "Broadly eight to sixteen posts and four to eight reels depending on the plan, with the current counts published on the pricing page. We would rather agree the number than promise a vague one, because a volume you cannot see is a volume nobody can hold us to.",
        },
        {
          q: "Do you run the ads as well?",
          a: "We build the creative and copy for Meta and Google and support the running of them. Creative made for paid from the start outperforms an organic post promoted after the fact, because the two are being asked to do different jobs — one holds an audience that already follows you, the other has to earn a stranger's second.",
        },
        {
          q: "Do you shoot the content or do we send it?",
          a: "Either. We work from your footage and product images when you have them, and we shoot when the plan needs something that does not exist yet — <a href=\"/services/video-production\" data-h>video production</a> is in-house, so a shoot does not mean a second vendor and a second brief.",
        },
        {
          q: "Who owns the accounts and the content?",
          a: "You do, throughout. We work on accounts registered to you rather than moving you onto ours, and the creatives are yours. If the engagement ends, nothing has to be handed back because nothing was ever held.",
        },
        {
          q: "Why do my reels get views but no enquiries?",
          a: "Because reach and intent are different things, and a reel that ends without a route out converts the attention into nothing. The fix is structural — a reason to visit the profile, a profile that answers the next question, and a page that takes the enquiry. <a href=\"/blogs/reels-that-route\" data-h>Reels that get views are not reels that get leads</a> covers the route in full.",
        },
      ],
    },
  },

  /* ------------------------------------------------------------- digital -- */
  digital: {
    eyebrow: "Digital, in full",
    what: {
      h: "What website design and development actually is",
      p: [
        "A website is not a brochure that happens to be online. It is the one salesperson you have working every hour, and it is judged in about three seconds — how fast it loads, whether it looks like it belongs to a real business, and whether the next step is obvious.",
        "So the work is a journey, not a set of pages: from the first click to the enquiry landing somewhere you will actually see it. Design, copy, speed and the form at the end are one problem. Treating them as four is how a site ends up beautiful and empty.",
      ],
    },
    deliverables: {
      h: "What you get",
      intro:
        "Website builds are one-time projects at three levels — a fast credible site, a site with bookings and payments, and a custom build with a CMS and integrations. Current inclusions and figures are on <a href=\"/pricing\" data-h>the pricing page</a>; the list below is what the build itself is made of.",
      items: [
        {
          t: "Design and UI",
          d: "Interface designed for your brand rather than assembled from a theme, and laid out around what a visitor is trying to do on each page.",
        },
        {
          t: "Responsive build",
          d: "Designed and tested at phone, tablet and desktop widths. Most of your traffic is on a phone, so that is the width the layout is decided at, not the one it is squeezed into afterwards.",
        },
        {
          t: "Performance",
          d: "Built to load fast on an ordinary mobile connection — compressed and modern image formats, restrained scripts, and no plugin stack doing work nobody asked for.",
        },
        {
          t: "Enquiry routes",
          d: "Contact forms and WhatsApp integration wired so an enquiry reaches a person, with the path from any page to the enquiry kept short.",
        },
        {
          t: "Bookings and payments",
          d: "Appointment scheduling, calendar integration and a payment gateway where the business runs on them, so a customer can finish the transaction rather than start a conversation about it.",
        },
        {
          t: "Dashboards and lead management",
          d: "Admin and customer dashboards, and enquiries collected somewhere you can work through rather than an inbox nobody owns.",
        },
        {
          t: "Search and analytics groundwork",
          d: "Titles, descriptions, structured data, a sitemap and analytics configured at build, so the site is legible to search engines from day one instead of retrofitted later.",
        },
        {
          t: "Content and CMS",
          d: "Copywriting where you want it written, and a blog or CMS on the larger builds so pages can be added without a developer.",
        },
      ],
    },
    process: {
      h: "How the build runs",
      intro:
        "Five stages, each ending in something you can look at. Nothing is built twice because a decision was taken late, which is the single biggest cost in a website project.",
      stages: [
        {
          when: "Week 1",
          t: "Brief and sitemap",
          d: "Who the site is for, what they need to do on it, and the smallest set of pages that lets them. Most sites arrive over-planned — the page nobody visits still has to be designed, built and maintained.",
        },
        {
          when: "Week 2",
          t: "Journey and wireframe",
          d: "The route from landing to enquiry, drawn before anything is styled: what each page asks for, what it answers, and where the next step sits. Layout decisions made here are free.",
        },
        {
          when: "Weeks 3–4",
          t: "Design",
          d: "Full design in your brand, page by page, at real widths with real content. Placeholder text hides problems that only show up once the actual sentence is three lines long.",
        },
        {
          when: "Weeks 4–6",
          t: "Build and integrate",
          d: "Front-end build, forms, WhatsApp, bookings, payments and analytics wired up and tested on real devices rather than in one browser at one width.",
        },
        {
          when: "Week 6",
          t: "Launch and after",
          d: "Go live, submit to search, and hand over. From there a care plan keeps it updated, backed up, monitored and edited — a site left alone for a year is slower and less secure than the day it launched.",
        },
      ],
    },
    who: {
      h: "Who this is for",
      p: [
        "This is the right buy when the site is the first thing a customer meets and it is currently costing you the meeting — slow, dated, hard to use on a phone, or unclear about what you actually do. It is also the right buy when the business has outgrown its site: bookings taken over the phone that should be taken online, enquiries arriving somewhere nobody reads.",
        "If the site is sound and only tired in places, a care plan and a round of page work is the cheaper and more honest answer than a rebuild.",
      ],
    },
    proof: {
      h: "Proof",
      p: [
        "Every site in the showcase above is live and open to inspection. Sportex.in had to hold up under launch-week traffic for one of India's largest sports and fitness expos, with visitor registration and exhibitor enquiries on a single clean path. Patilgroup.com carries fifty years of railway infrastructure work without raising its voice. Hopetrustindia.com had to work for someone reaching out at their lowest — clear programmes, honest copy, and a therapist one click away.",
        "Oursacredspace.com is run by its calendar, so events, classes and bookings sit at the front. Southglass.in turns a technical product into a quote request that actually converts. Different jobs, one rule: the journey ends somewhere.",
      ],
    },
    faq: {
      h: "Common questions",
      items: [
        {
          q: "How much does a website cost in Hyderabad?",
          a: "Website builds are priced as one-time projects at three levels — a fast credible site, a site with bookings and payments, and a custom build with a CMS and integrations. The current figures for each are published on the pricing page rather than quoted on request, so you can size the project before you speak to anyone.",
        },
        {
          q: "How long does a website take to build?",
          a: "Around five to seven weeks for a standard build, and longer where bookings, payments or custom integrations are involved. The stage that decides the timeline is content: a site waiting on copy and images sits still, which is why we ask for both in week one.",
        },
        {
          q: "Do you write the website content?",
          a: "Yes, on the builds that include it, and we recommend it. Copy written to the layout reads better and converts better than copy poured into a design after the fact — and it removes the most common reason a launch date slips.",
        },
        {
          q: "What happens after the site goes live?",
          a: "A care plan keeps it updated, backed up, monitored and supported, with content and design edits included at the higher levels. It is the difference between a site that is still fast in a year and one that has quietly become a liability — the plans are listed on the pricing page.",
        },
        {
          q: "Do we own the website?",
          a: "Yes. The domain, the hosting and the site are registered in your name, and you can move them elsewhere whenever you want. We do not hold a site hostage as a retention strategy.",
        },
        {
          q: "Why is my current website slow, and does it matter?",
          a: "It matters more than almost anything else on the page, because a visitor who leaves before it renders never sees the design at all. The usual causes are uncompressed images, a stack of plugins and scripts loading before the content — <a href=\"/blogs/why-your-website-is-slow\" data-h>your website is slow, and it is costing you the enquiry</a> explains what to check first.",
        },
      ],
    },
  },

  /* ---------------------------------------------------- video-production -- */
  "video-production": {
    eyebrow: "Video production, in full",
    what: {
      h: "What video production actually is",
      p: [
        "Video production is everything between an idea and a finished film: the script, the plan, the shoot, the edit, the sound and the versions it has to exist in. Anything can be filmed. What gets watched is decided in the edit — the hook that stops the scroll, the pacing that holds it, the story that lands.",
        "Which is why the camera is the least interesting decision. A well-shot film with no argument in it is expensive wallpaper, and a modest one with a reason to keep watching outperforms it every time.",
      ],
    },
    deliverables: {
      h: "What you get",
      intro:
        "Film work is quoted per project, because a founder interview and a multi-day product shoot share almost nothing except the word video. Most projects are built from the pieces below.",
      items: [
        {
          t: "Brand films",
          d: "The two-to-three-minute film that says who you are and why it matters, built around one argument rather than a tour of the premises.",
        },
        {
          t: "Product and explainer films",
          d: "What it is, what it does, why it is better — in the order a buyer actually asks those questions.",
        },
        {
          t: "Advertisements and commercials",
          d: "Short-format film built for paid placement, cut to the durations the platform or the broadcast slot requires.",
        },
        {
          t: "Reels and shorts",
          d: "Vertical, sound-optional, written for the first two seconds and ending somewhere — the format that feeds the social calendar month to month.",
        },
        {
          t: "Testimonials and case films",
          d: "Customers and clients on camera, directed so they sound like themselves and edited so the point survives.",
        },
        {
          t: "Event and expo coverage",
          d: "Same-week highlight cuts and a longer film, shot to a brief so the footage has a purpose before the event begins.",
        },
        {
          t: "Script, storyboard and direction",
          d: "The film written and boarded before anyone is booked, so the shoot day is execution rather than exploration.",
        },
        {
          t: "Edit, colour, sound and versions",
          d: "Grading, sound design, subtitles, and the cutdowns and aspect ratios each placement needs — 16:9, 9:16, 1:1, and the shorter edits that go with them.",
        },
      ],
    },
    process: {
      h: "How the work runs",
      intro:
        "Most of a film is decided before the camera comes out. The shoot is the expensive day, so it is the one that is planned hardest.",
      stages: [
        {
          when: "Week 1",
          t: "Brief and idea",
          d: "Who is watching, where, and what they should do afterwards. A film for a trade stand and a film for a paid feed are different films even when the product is identical.",
        },
        {
          when: "Weeks 1–2",
          t: "Script and board",
          d: "The film written line by line and boarded shot by shot, then approved. Changes here cost a conversation; the same change on shoot day costs a day.",
        },
        {
          when: "Week 2",
          t: "Pre-production",
          d: "Locations, casting, props, permissions, schedule and shot list. The unglamorous stage that decides whether the shoot finishes on time.",
        },
        {
          when: "Week 3",
          t: "Shoot",
          d: "One or more days against the shot list, with sound recorded properly on the day rather than rescued afterwards — audio is the half of a film viewers will not forgive.",
        },
        {
          when: "Weeks 4–5",
          t: "Edit and delivery",
          d: "First cut, your notes, then grade, sound design, subtitles and every version and ratio the placement plan calls for, delivered in the formats you will actually upload.",
        },
      ],
    },
    who: {
      h: "Who this is for",
      p: [
        "This is the right buy when the thing you sell is hard to explain in a paragraph — a process, a facility, a service, a transformation — or when you need to be believed rather than merely understood, which is what a face on camera does that copy cannot.",
        "It is also the right buy ahead of a launch, an expo or a funding conversation, where one film does the work of a dozen meetings. If the need is a steady stream of short-form for the feed, that belongs in a monthly retainer rather than a project.",
      ],
    },
    proof: {
      h: "Proof",
      p: [
        "The showreel above is the studio's own cut, and it is the honest version of this section: work you can watch rather than adjectives about it. It runs across sectors we shoot in regularly — expos and events, wellness and studio work, corporate and industrial environments, and campaign shorts made for the feed.",
        "Event work is the clearest test of the process. At an expo there is no second take and no reshoot, so the shot list, the sound plan and the edit structure have to be settled before the doors open. That is why the planning stages above are weighted the way they are.",
      ],
    },
    faq: {
      h: "Common questions",
      items: [
        {
          q: "What does a brand film cost?",
          a: "It is quoted per project, and the number is driven by shoot days, crew size, locations, cast and how much has to be built rather than found. The camera is rarely the expensive part — <a href=\"/blogs/what-a-brand-film-costs\" data-h>what actually costs money in a brand film</a> breaks down where the budget really goes.",
        },
        {
          q: "How long does a video take from brief to delivery?",
          a: "Typically four to five weeks for a single-shoot film: a week on the brief and script, a week of pre-production, the shoot, then two weeks of edit and revisions. Multi-location or multi-day projects run longer, and an event film with a same-week highlight cut runs to its own schedule.",
        },
        {
          q: "Do you write the script?",
          a: "Yes. Script and storyboard are part of the work and are approved before anything is booked, because that is the last point at which a change is cheap. If you have a script already, we read it against the placement and tell you honestly whether it will hold attention where it is going.",
        },
        {
          q: "Do we get the raw footage?",
          a: "The delivered films, versions and ratios are yours as standard. Raw footage and project files can be handed over as well — ask at the brief stage rather than after delivery, because it changes how the shoot is organised and stored.",
        },
        {
          q: "Do you shoot outside Hyderabad?",
          a: "Yes. The studio is based in Hyderabad and travels for shoots across India. Travel, accommodation and any additional local crew are quoted as separate lines rather than folded into a day rate, so you can see what the location is costing you.",
        },
        {
          q: "Can one shoot produce both a long film and reels?",
          a: "Yes, and it should. Planning the vertical cutdowns into the shot list costs almost nothing on the day and produces months of short-form; deciding afterwards means recomposing footage that was never framed for it. We plan the versions before the shoot, not after.",
        },
      ],
    },
  },

  /* --------------------------------------------------- brand-collaterals -- */
  "brand-collaterals": {
    eyebrow: "Collaterals, in full",
    what: {
      h: "What brand collaterals actually are",
      p: [
        "Brand collaterals are everything your business hands over, puts up or leaves behind: brochures, company profiles, catalogues, visiting cards, packaging, signage, stationery, decks and event branding. They are the physical proof that the identity is real.",
        "They are also where most brands quietly come apart. The logo is agreed and then the printer picks a different red, the deck uses a different typeface, the packaging is set by whoever had the file. Each piece looks fine alone; together they say the business is not paying attention.",
      ],
    },
    deliverables: {
      h: "What you get",
      intro:
        "Collateral is quoted by piece and by range, and it is cheaper per item the more of it is designed at once — a shared type and grid system does not have to be solved five times. This is the range we produce.",
      items: [
        {
          t: "Brochures and company profiles",
          d: "The pitch in print: what the business does, at what scale, with what proof. Structured to be skimmed by someone who did not ask for it.",
        },
        {
          t: "Catalogues",
          d: "A full product range organised so a buyer can find one item and compare it to another without a search function to help them.",
        },
        {
          t: "Packaging",
          d: "The shelf moment. Designed to be recognised at arm's length among rivals, with the print specification and dielines supplied so the run comes back the way it was approved.",
        },
        {
          t: "Visiting cards and stationery",
          d: "Cards, letterheads and templates — the small pieces handed over most often, and the ones that most often go off-brand first.",
        },
        {
          t: "Signage and event branding",
          d: "Read at a glance and at distance: fascias, standees, backdrops, stall graphics, wayfinding. Sized for how far away the reader actually is.",
        },
        {
          t: "Posters, flyers and marketing material",
          d: "One message, large, or one offer in the hand — built at the format's real dimensions rather than scaled from something else.",
        },
        {
          t: "Presentation decks",
          d: "The document that wins the room, built as a template your team can extend without it falling apart by slide fifteen.",
        },
        {
          t: "Print-ready artwork and specification",
          d: "Bleed, trim, colour profiles, paper and finish specified, with packaged files a printer can run from without ringing to ask questions.",
        },
      ],
    },
    process: {
      h: "How the work runs",
      intro:
        "Collateral fails at the handover far more often than at the design, so the specification and the proof are treated as part of the work rather than as admin at the end.",
      stages: [
        {
          when: "Week 1",
          t: "Inventory",
          d: "What exists, what is out of date, and what a customer touches in what order. Most businesses are surprised by the list — the invoice and the quote document are collateral too, and they are seen more often than the brochure.",
        },
        {
          when: "Week 1",
          t: "System",
          d: "The grid, type scale and colour usage the whole set shares. Decided once here so twelve pieces look like one family instead of twelve solved problems.",
        },
        {
          when: "Weeks 2–3",
          t: "Design",
          d: "Each piece designed at its real size with real content, because a brochure spread and a visiting card fail in completely different ways and neither shows up on a screen at 60 per cent.",
        },
        {
          when: "Week 3",
          t: "Proof and specification",
          d: "Bleed, trim, colour profile, paper stock and finish agreed, then a proof checked before a run is committed. This is the stage that stops a press run coming back muddy.",
        },
        {
          when: "Week 4",
          t: "Handover",
          d: "Print-ready artwork, packaged fonts and links, and editable templates for the pieces your team will update themselves.",
        },
      ],
    },
    who: {
      h: "Who this is for",
      p: [
        "This is the right buy when the business meets people in the physical world — a stall, a showroom, a shelf, a site visit, a sales call with a folder in it. It is also the right buy immediately after an identity project, while the rules are fresh and every piece can be brought onto them at once.",
        "If you have no identity system yet, collateral will keep drifting no matter how well each piece is designed. Start there, then bring the range across.",
      ],
    },
    proof: {
      h: "Proof",
      p: [
        "South Glass sells a technical product on a premium claim, so the collateral had to feel as considered as the claim — printed material that holds up next to the product it describes. Hope Trust India needed the opposite register: printed matter that feels reassuring in the hand rather than clinical, because of who is reading it and when.",
        "Patil Group is the world's largest sleeper manufacturer, fifty years on the job, and its corporate documents carry that scale quietly. Three very different tones, one discipline — every piece built from the same system, specified properly, and checked before it went to press.",
      ],
    },
    faq: {
      h: "Common questions",
      items: [
        {
          q: "What counts as brand collateral?",
          a: "Anything carrying your brand that a customer receives, reads or stands in front of: brochures, company profiles, catalogues, visiting cards, packaging, signage, stationery, decks, flyers and event branding. If it is handed over or put up, it is collateral — including the quote document and the invoice, which are seen far more often than the brochure.",
        },
        {
          q: "Do you print as well as design, or only design?",
          a: "We design, specify and check the proof, and we work directly with your printer or ours through the run. Keeping print with a vendor you already trust is usually cheaper for you; what we will not do is hand over artwork without the specification and leave the press to guess.",
        },
        {
          q: "What files does my printer need?",
          a: "Print-ready artwork with bleed and trim marks, the correct colour profile for the process being used, and packaged fonts and linked images. We supply all of it together, so the printer can run the job without a chain of emails asking for missing pieces.",
        },
        {
          q: "Do we need brand guidelines before collateral work?",
          a: "Not strictly, but without them each piece is a fresh set of decisions and the range drifts. If there are no guidelines, we set the shared system as part of the first project so everything after it has something to be consistent with — <a href=\"/services/identity\" data-h>identity work</a> is the fuller version of that.",
        },
        {
          q: "How long does a set of collateral take?",
          a: "A single piece runs one to two weeks. A full range — profile, brochure, cards, stationery and stall graphics — typically runs three to four, because the shared system is built once and every piece after it is faster than the one before.",
        },
        {
          q: "Why does packaging need different thinking to a brochure?",
          a: "Because nobody reads packaging. It gets about three seconds on a shelf against dozens of rivals, so it is a recognition problem rather than a communication one — <a href=\"/blogs/packaging-gets-three-seconds\" data-h>your packaging gets three seconds, and forty rivals</a> covers what survives that.",
        },
      ],
    },
  },
};

/** The FAQs for a service, for the FAQPage schema on its route. */
export const serviceFaq = (slug: string): Faq[] =>
  SERVICE_COPY[slug]?.faq.items ?? [];
