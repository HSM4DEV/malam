import { NextResponse } from "next/server";

import { getNewsletterSubscribers } from "@/lib/data/admin-subscribers";

// Protected by the same proxy.ts middleware guard as every /admin/* route
// (ADMIN role only) — no separate auth check needed here.
export async function GET() {
  const subscribers = await getNewsletterSubscribers();

  const rows = [
    ["email", "subscribed_at"],
    ...subscribers.map((s) => [s.email, s.createdAt.toISOString()]),
  ];
  const csv = rows.map((row) => row.map(escapeCsvField).join(",")).join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="malam-newsletter-subscribers.csv"`,
    },
  });
}

function escapeCsvField(value: string): string {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}
