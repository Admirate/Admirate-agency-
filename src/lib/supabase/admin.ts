import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * The privileged client, for writes that have already been authorised.
 *
 * WHY THIS EXISTS. Dashboard sign-in is a custom JWT — `requireAdmin()` checks
 * an `admin_token` cookie signed with `JWT_SECRET`. Postgres never learns about
 * it. Every call made through `./server.ts` therefore arrives as the `anon`
 * role no matter who is signed in, because `SB_KEY` is the anon key.
 *
 * That left one of two bad options. Either the tables carry write policies
 * granting `anon` full access — which is what `email_recipients`,
 * `email_drafts` and `portfolio_projects` used to do, and since the anon key is
 * served to the browser it meant anybody could rewrite them straight past the
 * route handlers — or the tables have no write policy and the dashboard cannot
 * save at all, which is what happened to the four `pricing_*` tables and why
 * editing a price returned "new row violates row-level security policy".
 *
 * The privilege now comes from the key rather than the policy. RLS keeps only
 * its public read policies, and the sole path to a write is a route that has
 * already proved the caller is the admin. Authorisation lives in one place, in
 * application code, where it can be read.
 *
 * RULES.
 * - Server only. This key bypasses row-level security entirely; if it ever
 *   reaches the browser the database is open to the world. It is read from a
 *   non-`NEXT_PUBLIC_` variable so Next cannot inline it into client bundles.
 * - Call it *after* `requireAdmin()` or the cron-secret check, never before.
 * - Public reads stay on `./server.ts`. They do not need this, and keeping them
 *   on the anon client means the read policies still apply as a second line.
 *
 * No cookie handling, deliberately: this client must not pick up a session and
 * act as somebody. It is one identity, the service role, and nothing else.
 */
export function createAdminClient() {
  const key = process.env.SB_SERVICE_KEY;

  // Loud rather than silent. Without the key Supabase would fall back to
  // rejecting every write with an RLS error, which reads as a policy problem
  // and sends the next person looking in the wrong place entirely.
  if (!key) {
    throw new Error(
      "SB_SERVICE_KEY is not set. Admin writes need the Supabase service_role key — add it to .env and to the deploy environment."
    );
  }

  return createClient<Database>(process.env.SB_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
