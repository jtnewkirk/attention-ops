import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateMissionSchema } from "@shared/schema";

function getPlatformTip(platform: string): string {
  const tips: Record<string, string> = {
    linkedin: "On LinkedIn, post the teaching response first and add the bullets as a comment to boost engagement.",
    instagram: "On Instagram, use short lines so this is easy to read on a phone.",
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
    viral: [
      `Most people talk about ${topic}. Very few actually do it well. That is why results stay small. The ones who win focus on skill, not noise. Stop scrolling. Start building.`,
      `Everyone wants to understand ${topic}. Almost no one puts in the work. That is the gap. The people ahead of you are not smarter. They just started sooner and stayed consistent.`,
      `${topic} is not complicated. It just requires doing what others skip. Most people chase trends. Winners build foundations. That is the difference.`,
    ],
    controversial: [
      `Most advice about ${topic} is wrong. People repeat what sounds good instead of what works. The truth is simpler. Focus on basics. Ignore the noise. Results follow action, not ideas.`,
      `More content about ${topic} is not the answer. Better thinking is. The problem is not effort. The problem is direction. Fix that first.`,
      `${topic} has been overcomplicated by people selling shortcuts. There are no shortcuts. There is only work done right. Stop looking for hacks. Start learning the fundamentals.`,
    ],
    educational: [
      `${topic} is about understanding how things work before trying to make them work for you. Start with the basics. Learn why, not just how. That knowledge lasts longer than any tactic.`,
      `Understanding ${topic} means breaking it into smaller pieces. Each piece matters. Learn one at a time. Connect them later. This is how real skill forms.`,
      `${topic} is not magic. It is a process. Learn the steps. Practice them. Adjust based on what you see. Improvement comes from repetition, not luck.`,
    ],
    professional: [
      `${topic} works when approached with consistency and measurement. Most people quit before seeing results. Data shows that 90 days of focused effort changes outcomes. Stay the course.`,
      `The difference in ${topic} comes down to process. Those who track progress outperform those who guess. Small improvements compound. Focus on what you can measure.`,
      `${topic} rewards patience and precision. Rushing leads to waste. Slow, steady action with regular review produces better results than bursts of unfocused energy.`,
    ],
    storytelling: [
      `When I first started learning ${topic}, I made every mistake. I chased shortcuts. I copied others. Nothing worked. Then I focused on one thing at a time. That changed everything.`,
      `I spent months confused about ${topic}. Everyone had different advice. Then I stopped listening and started doing. The lesson was clear: action teaches faster than theory.`,
      `${topic} seemed impossible at first. I almost gave up. Then someone told me to focus on progress, not perfection. That shift made all the difference.`,
    ],
    casual: [
      `You do not need to overthink ${topic}. Start simple. Stay consistent. Learn as you go. Most people make this harder than it needs to be. Keep it basic and keep moving.`,
      `${topic} is not as scary as it looks. Everyone starts at zero. Just pick one thing to focus on today. Do that. Tomorrow, do a little more. That is the whole game.`,
      `Here is the truth about ${topic}. You will not get it perfect. That is fine. The goal is progress. Do something small today. Build from there.`,
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

  const responseIndex = Math.floor(Math.random() * (teachingResponses[style]?.length || 1));
  const bulletIndex = Math.floor(Math.random() * bulletSets.length);
  const ctaIndex = Math.floor(Math.random() * ctas.length);

  const teachingResponse = teachingResponses[style]?.[responseIndex] || teachingResponses.educational[0];
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
