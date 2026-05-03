/**
 * Frontend-only mocks for analytics endpoints.
 */
import { fakeLatency } from "./_mock";

export async function trackEvent(_args: {
  data: {
    event?: string;
    eventName?: string;
    properties?: Record<string, unknown>;
    sessionId?: string | null;
    userAgent?: string | null;
  };
}) {
  // No-op in frontend mode
  return { ok: true as const };
}

export async function getPublicStats() {
  await fakeLatency(250);
  return {
    heroClicks: 1240,
    signups: 318,
    applications: 22,
  };
}

export type AdminAnalyticsResp = {
  from: string;
  to: string;
  summary: {
    heroClicks: number;
    waitlistSubmits: number;
    waitlistRows: number;
    applications: number;
  };
  series: Array<{ date: string; hero: number; waitlist: number; apps: number }>;
  events: Array<{ event_name: string; created_at: string; properties: unknown }>;
  applications: Array<{ id: string; project_name: string; status: string; created_at: string }>;
  waitlist: Array<{ id: string; email: string; role: string | null; created_at: string }>;
};

export async function getAdminAnalytics(_args?: {
  data?: { from?: string; to?: string };
}): Promise<AdminAnalyticsResp> {
  await fakeLatency(400);
  const to = new Date();
  const from = new Date(to.getTime() - 30 * 86400_000);
  const series: AdminAnalyticsResp["series"] = [];
  for (let d = new Date(from); d <= to; d.setUTCDate(d.getUTCDate() + 1)) {
    series.push({
      date: d.toISOString().slice(0, 10),
      hero: Math.floor(20 + Math.random() * 60),
      waitlist: Math.floor(2 + Math.random() * 12),
      apps: Math.floor(Math.random() * 3),
    });
  }
  return {
    from: from.toISOString(),
    to: to.toISOString(),
    summary: {
      heroClicks: series.reduce((a, b) => a + b.hero, 0),
      waitlistSubmits: series.reduce((a, b) => a + b.waitlist, 0),
      waitlistRows: 318,
      applications: series.reduce((a, b) => a + b.apps, 0),
    },
    series,
    events: [],
    applications: [],
    waitlist: [],
  };
}
