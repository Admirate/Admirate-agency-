import type { Config } from "@netlify/functions";

export default async () => {
  const siteUrl = process.env.URL || "https://admirate.in";
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error("CRON_SECRET not configured");
    return new Response("Configuration error", { status: 500 });
  }

  try {
    const response = await fetch(`${siteUrl}/api/cron/send-email`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cronSecret}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Cron email result:", data);

    return new Response(JSON.stringify(data), { status: response.status });
  } catch (error) {
    console.error("Scheduled email function error:", error);
    return new Response("Function error", { status: 500 });
  }
};

export const config: Config = {
  schedule: "30 4 * * *", // 4:30 AM UTC = 10:00 AM IST
};
