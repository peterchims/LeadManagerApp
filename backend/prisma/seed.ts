/**
 * Seeds a reviewer-facing demo account with a realistic set of sample leads.
 *
 * Safe to re-run: the user and every lead are upserted by their unique email,
 * so running this twice updates in place instead of erroring or duplicating.
 *
 * Usage:
 *   npm run prisma:seed              (local dev DB, from backend/.env)
 *   DATABASE_URL="<prod url>" npm run prisma:seed   (run once against production before handing off)
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

export const DEMO_ACCOUNT = {
  name: "Demo Reviewer",
  email: "demo@example.com",
  password: "Demo1234!",
};

const DEMO_LEADS: { name: string; email: string; status: string }[] = [
  { name: "Amara Okafor", email: "amara.okafor@northwind.io", status: "New" },
  { name: "Daniel Kim", email: "daniel.kim@brightpath.co", status: "New" },
  { name: "Sofia Rossi", email: "sofia.rossi@lumen.dev", status: "Engaged" },
  { name: "Marcus Webb", email: "marcus.webb@fernhill.com", status: "Engaged" },
  { name: "Priya Nair", email: "priya.nair@orbitalstudio.com", status: "Proposal Sent" },
  { name: "Liam O'Connor", email: "liam.oconnor@haventech.io", status: "Closed-Won" },
  { name: "Grace Chen", email: "grace.chen@summitworks.co", status: "Closed-Won" },
  { name: "Tomás Alvarez", email: "tomas.alvarez@driftlabs.com", status: "Closed-Lost" },
];

async function main() {
  const passwordHash = await hashPassword(DEMO_ACCOUNT.password);

  const user = await prisma.user.upsert({
    where: { email: DEMO_ACCOUNT.email },
    update: { name: DEMO_ACCOUNT.name, passwordHash },
    create: { name: DEMO_ACCOUNT.name, email: DEMO_ACCOUNT.email, passwordHash },
  });

  for (const lead of DEMO_LEADS) {
    await prisma.lead.upsert({
      where: { email: lead.email },
      update: { name: lead.name, status: lead.status },
      create: { ...lead, createdById: user.id },
    });
  }

  console.log(`Seeded demo account: ${DEMO_ACCOUNT.email} / ${DEMO_ACCOUNT.password}`);
  console.log(`Seeded ${DEMO_LEADS.length} sample leads.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
