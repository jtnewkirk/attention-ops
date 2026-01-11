import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateMissionSchema } from "@shared/schema";
import { stripeService } from "./stripeService";
import { getStripePublishableKey } from "./stripeClient";
import { sql } from "drizzle-orm";
import { db } from "./db";

function generateMissionText(platform: string, topic: string, style: string): string {
  // Hook patterns that never restate the topic
  const hookPatterns: Record<string, string[]> = {
    viral: [
      // Pattern B: Identity Contrast
      `Most people need motivation.\nVeterans run on standards.`,
      // Pattern C: Pressure Advantage
      `Business pressure breaks most people.\nVeterans treat it like Tuesday.`,
      // Pattern E: Unfair Advantage
      `Some people learn leadership in books.\nVeterans learn it under fire.`,
    ],
    controversial: [
      // Pattern A: Hidden Truth
      `The reason most fail has nothing to do with skill.\nIt is discipline.`,
      // Pattern D: Cost of Comfort
      `Comfort creates hesitation.\nTraining creates action.`,
      // Pattern A: Hidden Truth
      `Success is not about working harder.\nIt is about thinking clearer.`,
    ],
    educational: [
      // Pattern F: Outcome First
      `The fastest path to results is not talent.\nIt is consistency.`,
      // Pattern A: Hidden Truth
      `Progress stalls when basics get skipped.\nFundamentals fix everything.`,
      // Pattern F: Outcome First
      `Mastery comes from repetition, not revelation.\nDo the work.`,
    ],
    professional: [
      // Pattern F: Outcome First
      `The fastest path to CEO-level results is not talent.\nIt is discipline.`,
      // Pattern A: Hidden Truth
      `High performers share one trait.\nThey measure what matters.`,
      // Pattern F: Outcome First
      `Consistency beats intensity every time.\nThe data proves it.`,
    ],
    storytelling: [
      // Pattern D: Cost of Comfort
      `Comfort kept me stuck for years.\nPressure forced the breakthrough.`,
      // Pattern A: Hidden Truth
      `The turning point was not a new strategy.\nIt was dropping the excuses.`,
      // Pattern E: Unfair Advantage
      `Experience taught what no book could.\nFailure was the real teacher.`,
    ],
    casual: [
      // Pattern D: Cost of Comfort
      `Overthinking is the enemy.\nAction is the cure.`,
      // Pattern B: Identity Contrast
      `Most people wait to feel ready.\nThe successful start anyway.`,
      // Pattern A: Hidden Truth
      `The secret is not complicated.\nIt is just not popular.`,
    ],
  };

  const bulletSets: string[][] = [
    [
      `Decisions get made with limited information`,
      `Stress sharpens focus instead of breaking it`,
      `Clear direction matters more than motivation`,
      `Responsibility is taken before credit is given`,
      `Team success comes before personal comfort`,
      `Adaptation happens without complaining`,
      `Failure becomes feedback instead of identity`,
    ],
    [
      `Discipline replaces the need for constant motivation`,
      `Pressure reveals character instead of building it`,
      `Planning ahead prevents problems later`,
      `Execution matters more than ideas`,
      `Accountability is assumed, not assigned`,
      `Standards stay high when no one is watching`,
    ],
    [
      `Action starts before conditions are perfect`,
      `Comfort is not a priority`,
      `Problems get solved instead of discussed`,
      `Complaints do not change outcomes`,
      `Mission focus overrides personal preference`,
      `Consistency beats intensity over time`,
      `Results speak louder than explanations`,
    ],
    [
      `Training prepares for situations that have not happened yet`,
      `Composure under fire is learned, not given`,
      `Small details prevent large failures`,
      `Ownership starts at the individual level`,
      `Trust is built through actions, not words`,
      `Preparation separates leaders from followers`,
    ],
    [
      `Experience with chaos creates calm in crisis`,
      `Structure brings clarity to confusion`,
      `Purpose drives performance better than incentives`,
      `Resilience is a skill that can be developed`,
      `Hard work is expected, not celebrated`,
      `Respect is earned through competence`,
      `Leadership is a responsibility, not a title`,
    ],
  ];

  const hookIndex = Math.floor(Math.random() * (hookPatterns[style]?.length || 1));
  const bulletIndex = Math.floor(Math.random() * bulletSets.length);

  const hook = hookPatterns[style]?.[hookIndex] || hookPatterns.educational[0];
  const bullets = bulletSets[bulletIndex];

  const formattedBullets = bullets.map(b => `• ${b}`).join('\n');

  return `${hook}

${formattedBullets}`;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/templates", async (req, res) => {
    const templates = await storage.getTemplates();
    res.json(templates);
  });

  app.get("/api/templates/category/:category", async (req, res) => {
    const templates = await storage.getTemplatesByCategory(req.params.category);
    res.json(templates);
  });

  app.get("/api/missions/current", async (req, res) => {
    const mission = await storage.getCurrentMission();
    res.json(mission);
  });

  app.get("/api/missions/count", async (req, res) => {
    const count = await storage.getMissionCount();
    res.json(count);
  });

  app.get("/api/missions/history", async (req, res) => {
    const missions = await storage.getMissionHistory();
    res.json(missions);
  });

  app.post("/api/missions/generate", async (req, res) => {
    const parsed = generateMissionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid mission parameters", details: parsed.error.errors });
    }

    const { platform, topic, style } = parsed.data;
    const missionText = generateMissionText(platform, topic, style);

    const mission = await storage.createMission({
      missionText,
      timeMinutes: 30,
      goal: "create_content",
      platform,
      topic,
      missionNumber: 0,
      createdAt: new Date().toISOString(),
    });

    res.json(mission);
  });

  app.get("/api/photos", async (req, res) => {
    const photos = await storage.getPhotos();
    res.json(photos);
  });

  app.get("/api/stripe/config", async (req, res) => {
    try {
      const publishableKey = await getStripePublishableKey();
      res.json({ publishableKey });
    } catch (error) {
      res.status(500).json({ error: "Stripe not configured" });
    }
  });

  app.get("/api/stripe/products", async (req, res) => {
    try {
      const result = await db.execute(
        sql`SELECT p.id, p.name, p.description, p.active, p.metadata,
            pr.id as price_id, pr.unit_amount, pr.currency, pr.recurring
            FROM stripe.products p
            LEFT JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true
            WHERE p.active = true
            ORDER BY p.name`
      );
      
      const productsMap = new Map();
      for (const row of result.rows as any[]) {
        if (!productsMap.has(row.id)) {
          productsMap.set(row.id, {
            id: row.id,
            name: row.name,
            description: row.description,
            prices: []
          });
        }
        if (row.price_id) {
          productsMap.get(row.id).prices.push({
            id: row.price_id,
            unit_amount: row.unit_amount,
            currency: row.currency,
            recurring: row.recurring,
          });
        }
      }
      
      res.json({ products: Array.from(productsMap.values()) });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.json({ products: [] });
    }
  });

  app.post("/api/stripe/checkout", async (req, res) => {
    try {
      const { priceId } = req.body;
      
      if (!priceId) {
        return res.status(400).json({ error: "Price ID required" });
      }

      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      const host = req.get('host');
      const baseUrl = `${protocol}://${host}`;

      const session = await stripeService.createCheckoutSession(
        priceId,
        `${baseUrl}/billing?success=true`,
        `${baseUrl}/billing?canceled=true`
      );

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Checkout error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  return httpServer;
}
