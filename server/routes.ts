import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateMissionSchema } from "@shared/schema";

function generateMissionText(platform: string, topic: string, style: string): string {
  const hooks: Record<string, string[]> = {
    viral: [
      `Veterans already understand ${topic}.\nCivilians are still catching up.`,
      `${topic} looks different when pressure is not new to you.`,
      `${topic} rewards those who were trained to perform under stress.`,
    ],
    controversial: [
      `Most advice about ${topic} is wrong.\nHere is what actually works.`,
      `${topic} does not need more motivation.\nIt needs better execution.`,
      `Stop overcomplicating ${topic}.\nThe basics still win.`,
    ],
    educational: [
      `${topic} comes down to a few things that actually matter.`,
      `${topic} works when you stop skipping the fundamentals.`,
      `${topic} gets easier once you understand the process.`,
    ],
    professional: [
      `${topic} favors discipline over talent.`,
      `${topic} rewards consistency, not intensity.`,
      `${topic} follows patterns the unprepared never see.`,
    ],
    storytelling: [
      `${topic} clicked once I stopped overthinking it.`,
      `${topic} made sense after I learned from doing, not reading.`,
      `${topic} changed when I focused on one thing at a time.`,
    ],
    casual: [
      `${topic} is simpler than people make it.`,
      `${topic} does not require a perfect plan.`,
      `${topic} starts with one step, not ten.`,
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

  const hookIndex = Math.floor(Math.random() * (hooks[style]?.length || 1));
  const bulletIndex = Math.floor(Math.random() * bulletSets.length);

  const hook = hooks[style]?.[hookIndex] || hooks.educational[0];
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

  return httpServer;
}
