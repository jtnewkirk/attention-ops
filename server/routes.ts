import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateMissionSchema } from "@shared/schema";

function generateMissionText(platform: string, topic: string, style: string): string {
  const hooks: Record<string, string[]> = {
    viral: [
      `${topic} is not what most people think.\nThe real advantage comes from where you least expect it.`,
      `Everyone talks about ${topic}.\nFew understand why veterans already have the edge.`,
      `${topic} separates pretenders from performers.\nMilitary experience makes the difference clear.`,
    ],
    controversial: [
      `Most people will never understand ${topic}.\nThey were never trained for it.`,
      `${topic} is not taught in business school.\nIt is built under pressure.`,
      `The truth about ${topic} makes civilians uncomfortable.\nVeterans already know it.`,
    ],
    educational: [
      `${topic} works differently than most people assume.\nHere is what actually matters.`,
      `Understanding ${topic} comes down to a few key things.\nMost people miss them.`,
      `${topic} is simpler than experts make it sound.\nThe fundamentals never change.`,
    ],
    professional: [
      `${topic} follows patterns that most people ignore.\nThe data tells a clear story.`,
      `Success in ${topic} is not random.\nIt comes from repeatable actions.`,
      `${topic} rewards the prepared.\nConsistency outperforms talent.`,
    ],
    storytelling: [
      `I learned the truth about ${topic} the hard way.\nThe lesson stuck.`,
      `${topic} looked impossible until I saw it differently.\nExperience changed everything.`,
      `What I know about ${topic} came from doing, not reading.\nHere is what I found.`,
    ],
    casual: [
      `${topic} is not as complicated as people make it.\nHere is the simple version.`,
      `You do not need a degree to understand ${topic}.\nYou need the right mindset.`,
      `${topic} comes down to a few things that actually work.\nThe rest is noise.`,
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

  const mission = `${hook}

${formattedBullets}`;

  return mission;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Get all templates
  app.get("/api/templates", async (req, res) => {
    const templates = await storage.getTemplates();
    res.json(templates);
  });

  // Get templates by category
  app.get("/api/templates/category/:category", async (req, res) => {
    const templates = await storage.getTemplatesByCategory(req.params.category);
    res.json(templates);
  });

  // Get current mission
  app.get("/api/missions/current", async (req, res) => {
    const mission = await storage.getCurrentMission();
    res.json(mission);
  });

  // Get mission count
  app.get("/api/missions/count", async (req, res) => {
    const count = await storage.getMissionCount();
    res.json(count);
  });

  // Get mission history
  app.get("/api/missions/history", async (req, res) => {
    const missions = await storage.getMissionHistory();
    res.json(missions);
  });

  // Generate a new mission
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

  // Get all photos
  app.get("/api/photos", async (req, res) => {
    const photos = await storage.getPhotos();
    res.json(photos);
  });

  return httpServer;
}
