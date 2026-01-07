import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateMissionSchema } from "@shared/schema";

function generateMissionText(platform: string, topic: string, style: string): string {
  const hooks: Record<string, string[]> = {
    viral: [
      `Why do veterans understand ${topic} faster than most?\nIt is not luck.`,
      `What if ${topic} was never the hard part?\nMost people are solving the wrong problem.`,
      `Ever wonder why some people get ${topic} instantly?\nThey were trained for it before they knew it.`,
    ],
    controversial: [
      `What if everything you learned about ${topic} was backwards?\nHere is what actually works.`,
      `Why does the common advice on ${topic} keep failing?\nBecause it was never built for people like you.`,
      `What if ${topic} does not need more effort?\nIt needs a different approach.`,
    ],
    educational: [
      `What makes ${topic} click for some and not others?\nIt comes down to a few things.`,
      `Why does ${topic} feel harder than it should?\nMost people skip the basics.`,
      `What separates people who get ${topic} from those who struggle?\nThe answer is simpler than you think.`,
    ],
    professional: [
      `What patterns show up in people who master ${topic}?\nThe data tells a clear story.`,
      `Why do some people see results in ${topic} faster?\nIt is not talent. It is process.`,
      `What do the top performers in ${topic} have in common?\nConsistency over intensity.`,
    ],
    storytelling: [
      `What changed when I stopped overcomplicating ${topic}?\nEverything.`,
      `Why did ${topic} finally click after years of struggle?\nI learned the hard way what actually matters.`,
      `What did I wish someone told me about ${topic} earlier?\nThis.`,
    ],
    casual: [
      `What if ${topic} is simpler than everyone says?\nIt usually is.`,
      `Why does ${topic} feel so overwhelming at first?\nYou are probably overthinking it.`,
      `What is the fastest way to get better at ${topic}?\nStart before you feel ready.`,
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
