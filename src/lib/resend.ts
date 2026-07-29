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
