import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Who campaign mail comes from, and where replies land.
 *
 * One constant rather than a literal in each send route: the composer route and
 * the cron route both send the same campaign, and when the address lived in
 * both they could drift — a reply-to fixed in one and missed in the other is
 * silent, because the mail still sends.
 *
 * FROM must be on a domain verified in Resend. admirate.in is, so any mailbox
 * on it is accepted; an address on any other domain is rejected at send.
 */
export const MAIL_FROM = "ADMIRATE <info@admirate.in>";
export const MAIL_REPLY_TO = "start@admirate.in";

/**
 * The batch endpoint takes up to 100 separate emails per call, so a list longer
 * than that needs more than one call.
 */
export const RESEND_BATCH_LIMIT = 100;

type CampaignEmail = {
  from: string;
  replyTo: string;
  to: string[];
  subject: string;
  html: string;
};

/**
 * Turns the recipient list into the calls that deliver it: one email per
 * recipient, grouped into batches of at most RESEND_BATCH_LIMIT.
 *
 * One email each rather than one email to everybody — a shared `to` shows every
 * prospect who else is being pitched, and mail addressed to fifty strangers is
 * what spam filters are built to catch. It also sidesteps the 50-address cap on
 * a single send that this list had already outgrown.
 */
export const campaignBatches = ({
  to,
  subject,
  html,
}: {
  to: string[];
  subject: string;
  html: string;
}): CampaignEmail[][] => {
  const emails = to.map((address) => ({
    from: MAIL_FROM,
    replyTo: MAIL_REPLY_TO,
    to: [address],
    subject,
    html,
  }));

  const batches: CampaignEmail[][] = [];
  for (let i = 0; i < emails.length; i += RESEND_BATCH_LIMIT) {
    batches.push(emails.slice(i, i + RESEND_BATCH_LIMIT));
  }
  return batches;
};

/**
 * Sends one campaign to the whole list. Returns the first failure, or null —
 * the shape the routes branch on. A batch that fails after an earlier one went
 * out cannot be recalled, so the message says how far it got.
 */
export const sendCampaign = async ({
  to,
  subject,
  html,
}: {
  to: string[];
  subject: string;
  html: string;
}): Promise<{ error: string | null; sent: number }> => {
  let sent = 0;

  for (const batch of campaignBatches({ to, subject, html })) {
    const { error } = await resend.batch.send(batch);

    if (error) {
      console.error("Resend error:", error);
      return {
        error:
          sent === 0
            ? error.message
            : `${error.message} (${sent} of ${to.length} recipients had already been sent)`,
        sent,
      };
    }

    sent += batch.length;
  }

  return { error: null, sent };
};
