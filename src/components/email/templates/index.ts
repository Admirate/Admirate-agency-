import type { EmailTemplateModule } from "./types";
import campaignDubai from "./campaign-dubai";

export type { EmailTemplateModule };

/**
 * Every template the composer can choose. Order is the order of the cards.
 *
 * Adding one is a file here, a line in this array, and nothing else — no
 * database write, no dashboard screen, no deploy configuration.
 */
export const TEMPLATES: EmailTemplateModule[] = [campaignDubai];

/** What a draft with no template_id sends. The first entry, by definition. */
export const DEFAULT_TEMPLATE_ID = TEMPLATES[0].id;

/**
 * Never throws and never returns undefined.
 *
 * A draft can be scheduled on Monday and sent on Thursday, and a template can
 * be renamed or removed in between. Falling back to the default means that send
 * goes out looking slightly wrong; throwing would mean it does not go out at
 * all, and nobody would find out until the campaign was over.
 */
export function getTemplate(
  id: string | null | undefined
): EmailTemplateModule {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}
