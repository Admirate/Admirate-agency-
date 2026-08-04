/**
 * Kept so nothing importing `EmailTemplate` breaks while the send routes move
 * to the registry. The creative itself now lives in
 * `templates/campaign-dubai.ts`. Delete this file once nothing imports it.
 */
export { renderCampaignDubai as EmailTemplate } from "./templates/campaign-dubai";
export type { EmailTemplateProps } from "./templates/campaign-dubai";
