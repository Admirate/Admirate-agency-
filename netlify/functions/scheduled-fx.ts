import type { Config } from "@netlify/functions";

export default async () => {
  const siteUrl = process.env.URL || "https://admirate.in";
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error("CRON_SECRET not configured");
    return new Response("Configuration error", { status: 500 });
  }

  try {
    const response = await fetch(`${siteUrl}/api/cron/fx`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cronSecret}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("FX refresh result:", data);

    return new Response(JSON.stringify(data), { status: response.status });
  } catch (error) {
    console.error("Scheduled FX function error:", error);
    return new Response("Function error", { status: 500 });
  }
};

export const config: Config = {
  /* An hour after the ECB publishes, and well clear of the 04:30 mailer. The
     rates move once a day, so the exact minute does not matter — only that it
     is the same one each day and that a missed run leaves yesterday's rates
     serving rather than none. */
  schedule: "0 6 * * *",
};
