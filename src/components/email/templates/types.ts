/**
 * The contract every template satisfies.
 *
 * Its own file rather than living in index.ts: a template imports the type and
 * index.ts imports the template, so putting the type in index would make that
 * a cycle.
 */
export type EmailTemplateModule = {
  /** Stable — this is the value stored on `email_drafts.template_id`. */
  id: string;
  /** Shown on the picker card. */
  name: string;
  /** One line, under the name. Say who it is for. */
  description: string;
  /** An image URL for the card. See campaign-dubai.ts for how it is derived. */
  thumbnail: string;
  /**
   * The whole message as an HTML string.
   *
   * A string, not JSX, because the Outlook fallbacks live inside `<!--[if mso]>`
   * conditional comments which JSX cannot emit. The send routes pass this to
   * Resend's `html:` option.
   */
  render: (props: { subject: string; body: string }) => string;
};
