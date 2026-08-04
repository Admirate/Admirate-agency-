import { SITE } from "@/lib/seo";

/**
 * Everything every campaign email has in common: the document, the head, the
 * width wrapper and the legal footer.
 *
 * It exists because the client workarounds below took a long time to get right
 * and are not specific to any one creative. A template that re-derived them
 * would get one of them wrong, and the failure mode is invisible until it is in
 * somebody's inbox.
 */

export const INK = "#1a1a1a";
export const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";

/** Display width of the email body. Artwork is authored at 1200px — 2x. */
export const W = 600;

export const esc = (value: string) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Dashboard copy arrives as plain text over many lines. The preheader is a
 * single run of text, and clients cut it around 100-150 characters, so it is
 * flattened and trimmed rather than shown whole.
 */
export const preheader = (value: string) => {
  const flat = String(value ?? "").replace(/\s+/g, " ").trim();
  return esc(flat.length > 140 ? `${flat.slice(0, 139).trimEnd()}…` : flat);
};

export type ShellProps = {
  subject: string;
  /** Fills the inbox preview text. Does not appear in the message body. */
  body: string;
  /** The template's own rows, as `<tr>` markup, dropped into the wrapper. */
  content: string;
};

export function shell({ subject, body, content }: ShellProps): string {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>${esc(subject)}</title>
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings>
  <o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings></xml></noscript>
<![endif]-->
<style type="text/css">
  body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
  table,td{mso-table-lspace:0pt;mso-table-rspace:0pt}
  img{-ms-interpolation-mode:bicubic;border:0;height:auto;line-height:100%;outline:none;text-decoration:none;display:block}
  table{border-collapse:collapse !important}
  body{margin:0 !important;padding:0 !important;width:100% !important;height:100% !important}
  a{text-decoration:none}
  /* Stops iOS turning addresses and numbers into blue underlines the design
     never had. */
  a[x-apple-data-detectors]{color:inherit !important;text-decoration:none !important;font-size:inherit !important;font-family:inherit !important;font-weight:inherit !important;line-height:inherit !important}
  /* Honoured by Apple Mail and Outlook.com, which then leave the creative
     alone. The Gmail app honours none of it and inverts regardless — which is
     why the creative is artwork rather than text, and why only the footer
     below can change colour. */
  :root{color-scheme:light;supported-color-schemes:light}
  @media screen and (max-width:600px){
    .wrap{width:100% !important;max-width:100% !important}
    .fluid{width:100% !important;height:auto !important}
    .px{padding-left:24px !important;padding-right:24px !important}
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;">

<!-- Preheader. The dashboard's body text, and the only place it appears: it is
     what the inbox prints beside the subject. The zero-width joiners stop
     Gmail pulling the footer in behind it to pad the line. -->
<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;font-family:sans-serif;">
  ${preheader(body)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
</div>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ffffff;">
<tr><td align="center" style="padding:0;">
<!--[if mso]><table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0" width="${W}"><tr><td><![endif]-->
<table role="presentation" class="wrap" cellpadding="0" cellspacing="0" border="0" width="${W}" style="width:${W}px;max-width:${W}px;background-color:#ffffff;">

${content}

  <!-- 2 — LEGAL. Not in the artwork. It is here because a commercial bulk send
       without a postal address and an unsubscribe path breaches CAN-SPAM and
       most ESP terms, and both Gmail and Outlook weigh its absence when
       deciding the spam folder. Styled to stay quiet, and the only part of the
       message the Gmail app's dark mode can recolour. -->
  <tr><td align="center" class="px" style="padding:34px 40px 40px 40px;font-family:${FONT};font-size:11px;line-height:18px;color:#9a9a9e;">
    ${esc(SITE.name)} &mdash; ${esc(SITE.tagline)}<br />
    ${esc(SITE.area)}, ${esc(SITE.city)}, ${esc(SITE.region)}, ${esc(SITE.country)}<br />
    <a href="${SITE.url}" style="color:#9a9a9e;text-decoration:underline;">admirate.in</a>
    &nbsp;&middot;&nbsp;
    <a href="mailto:${esc(SITE.email)}?subject=Unsubscribe" style="color:#9a9a9e;text-decoration:underline;">Unsubscribe</a>
  </td></tr>

</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</body>
</html>`;
}
