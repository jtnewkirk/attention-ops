import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateMissionSchema } from "@shared/schema";

function getPlatformTip(platform: string): string {
  const tips: Record<string, string> = {
    linkedin: "On LinkedIn, post the teaching response first and add the bullets as a comment to boost engagement.",
    instagram: "On Instagram, use short lines so this is easy to read on a phone. Add hashtags at the end.",
    twitter: "On Twitter, post the hook first. Use a thread for the bullets if needed.",
    facebook: "On Facebook, post the hook as the main post and add these bullets in the comments.",
    email: "In email, use the teaching response as your opener and bullets as the body.",
    phone: "On a call, use these bullets as talking points. Keep it conversational.",
    in_person: "In person, lead with the main idea and use bullets to guide the conversation.",
  };
  return tips[platform] || tips.in_person;
}

function getHashtags(platform: string): string {
  if (platform === "instagram") {
    return "\n\n#Vet2Ceo #VeteranEntrepreneur #MilitaryBusiness #VetBiz #VeteranOwned";
  }
  return "";
}

function generateMissionText(platform: string, topic: string, style: string): string {
  const teachingResponses: Record<string, string[]> = {
    direct: [
      `${topic} is not complicated. Most people overthink it. The goal is to understand the basics and take action today. Start with what you can control. Skills come from doing, not planning.`,
      `${topic} comes down to a few simple things. Learn them. Practice them. Stop looking for shortcuts. Consistency beats talent when talent does not show up.`,
      `${topic} is about execution, not theory. Know what matters. Ignore what does not. The people who win are the ones who keep moving forward.`,
    ],
    motivational: [
      `You can learn ${topic} starting today. Everyone begins somewhere. The goal is progress, not perfection. Focus on small wins. They add up faster than you think.`,
      `${topic} is something you can master with time and effort. Do not wait until you feel ready. Start now and adjust as you go. Confidence comes from action.`,
      `${topic} might feel overwhelming at first. That is normal. Break it into smaller pieces. Focus on one thing at a time. You are more capable than you realize.`,
    ],
    tactical: [
      `${topic} requires a clear process. Know what to do first. Know what to skip. Focus on high-value actions that move the needle. Everything else is noise.`,
      `${topic} works best when you follow a system. Identify the steps. Execute in order. Review your results. Adjust and repeat.`,
      `${topic} is about doing the right things in the right order. Most people waste time on low-priority tasks. Focus on what actually produces results.`,
    ],
    storytelling: [
      `When I first learned about ${topic}, I made every mistake possible. Then I figured out what actually worked. The lesson was simple: stop overcomplicating things and focus on the basics.`,
      `${topic} used to confuse me. Then I realized most advice out there is noise. Once I focused on the fundamentals, everything clicked. Here is what I learned.`,
      `I spent months struggling with ${topic} until someone broke it down for me. The truth was simpler than I expected. Now I want to share that with you.`,
    ],
  };

  const bulletSets: string[][] = [
    [
      `Focus on one area of ${topic} before expanding`,
      `Learn by doing, not just reading or watching`,
      `Track what works and do more of it`,
      `Ignore advice from people who have not done it`,
      `Start before you feel ready`,
      `Review your progress weekly and adjust`,
    ],
    [
      `Pick one method and stick with it for 30 days`,
      `Avoid switching strategies too early`,
      `Simple beats complicated every time`,
      `Ask for feedback from people ahead of you`,
      `Document what you learn as you go`,
      `Expect mistakes and learn from them fast`,
    ],
    [
      `Identify the one skill that matters most right now`,
      `Remove distractions that slow you down`,
      `Focus on progress over perfection`,
      `Teach what you learn to lock it in`,
      `Build habits that support your goal`,
      `Measure results, not effort`,
    ],
    [
      `Break ${topic} into smaller steps you can finish today`,
      `Do not wait for permission to start`,
      `Focus on action over planning`,
      `Find one person doing this well and study them`,
      `Accept that early work will be rough`,
      `Improve 1% each day and trust the process`,
    ],
  ];

  const ctas = [
    `Comment "VET" if you want more missions like this.`,
    `Comment "VET" and join the Vet2Ceo community for daily direction.`,
    `Comment "VET" if this helped you see ${topic} more clearly.`,
    `Comment "VET" to connect with veterans building their next chapter.`,
  ];

  const responseIndex = Math.floor(Math.random() * teachingResponses[style]?.length || 0);
  const bulletIndex = Math.floor(Math.random() * bulletSets.length);
  const ctaIndex = Math.floor(Math.random() * ctas.length);

  const teachingResponse = teachingResponses[style]?.[responseIndex] || teachingResponses.direct[0];
  const bullets = bulletSets[bulletIndex];
  const platformTip = getPlatformTip(platform);
  const cta = ctas[ctaIndex];
  const hashtags = getHashtags(platform);

  const formattedBullets = bullets.map(b => `• ${b}`).join('\n');

  const mission = `${teachingResponse}

${formattedBullets}

${platformTip}

${cta}${hashtags}`;

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
