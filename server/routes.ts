import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateMissionSchema } from "@shared/schema";

// Platform-specific formatting
function getPlatformBehavior(platform: string): { tone: string; suffix: string; cta: string } {
  const behaviors: Record<string, { tone: string; suffix: string; cta: string }> = {
    linkedin: { 
      tone: "professional", 
      suffix: "",
      cta: "Comment 'VET' if this resonates. Join the Vet2Ceo community."
    },
    instagram: { 
      tone: "short", 
      suffix: "\n\n#Vet2Ceo #VeteranEntrepreneur #MilitaryBusiness #VetBiz #EntrepreneurLife #VeteranOwned #MissionDriven #BusinessVeteran",
      cta: "Comment 'VET' below. Join the Vet2Ceo community."
    },
    twitter: { 
      tone: "short", 
      suffix: "",
      cta: "Reply 'VET' if you're with us."
    },
    facebook: { 
      tone: "text-first", 
      suffix: "",
      cta: "Comment 'VET' to connect with other veterans building businesses."
    },
    email: { 
      tone: "direct", 
      suffix: "",
      cta: "Reply to this email with 'VET' to let us know you're taking action."
    },
    phone: { 
      tone: "direct", 
      suffix: "",
      cta: "Ready to execute? Join the Vet2Ceo community."
    },
    in_person: { 
      tone: "direct", 
      suffix: "",
      cta: "Take action today. Join the Vet2Ceo community."
    },
  };
  return behaviors[platform] || behaviors.in_person;
}

function getStyleModifier(style: string): { hookPrefix: string } {
  const modifiers: Record<string, { hookPrefix: string }> = {
    direct: { hookPrefix: "" },
    motivational: { hookPrefix: "You've got this.\n" },
    tactical: { hookPrefix: "" },
    storytelling: { hookPrefix: "Picture this...\n" },
  };
  return modifiers[style] || modifiers.direct;
}

function formatPlatform(platform: string): string {
  const platformNames: Record<string, string> = {
    linkedin: "LinkedIn",
    instagram: "Instagram",
    twitter: "Twitter/X",
    facebook: "Facebook",
    email: "Email",
    phone: "Phone",
    in_person: "In-Person",
  };
  return platformNames[platform] || platform;
}

function generateMissionText(platform: string, topic: string, style: string): string {
  const platformBehavior = getPlatformBehavior(platform);
  const styleModifier = getStyleModifier(style);
  const platformName = formatPlatform(platform);
  
  const hooks = [
    `Most vets post and pray.\nTop 1% post with a plan.`,
    `Your audience is waiting.\nStop making them wait.`,
    `You served your country.\nNow serve your audience.`,
    `Likes don't pay bills.\nSales do.`,
    `Your network is your net worth.\nTime to expand it.`,
    `Content is your 24/7 salesperson.\nTime to put it to work.`,
    `Your story is your superpower.\nTell it.`,
    `Stop consuming. Start creating.\nYour audience needs you.`,
  ];

  const executions = [
    [
      `Create one post about ${topic} that provides real value.`,
      `Find 5 veterans or entrepreneurs posting similar content. Engage genuinely.`,
      `Share a lesson from your military experience that connects to ${topic}.`,
      `End your content with a question to drive engagement.`,
      `Reply to every comment within the first hour.`,
    ],
    [
      `Write a hook that stops the scroll. Make it about ${topic}.`,
      `Share 3 actionable tips your audience can use today.`,
      `Tag 2 people who need to hear your message.`,
      `Use platform-specific features (stories, polls, threads).`,
      `Schedule your next piece of content before logging off.`,
    ],
    [
      `Pick one angle on ${topic} you can speak on with authority.`,
      `Outline 3 key points your audience needs to hear.`,
      `Create the content (post, video, or article).`,
      `Add a clear call-to-action at the end.`,
      `Publish and engage with the first 5 commenters.`,
    ],
    [
      `Think of a moment that shaped your perspective on ${topic}.`,
      `Write it in 5 sentences or less. Keep it tight.`,
      `Connect the story to a lesson your audience can use.`,
      `End with a question to spark conversation.`,
      `Post and reply to every comment within the hour.`,
    ],
  ];

  const hookIndex = Math.floor(Math.random() * hooks.length);
  const execIndex = Math.floor(Math.random() * executions.length);
  
  const hook = styleModifier.hookPrefix + hooks[hookIndex];
  const execution = executions[execIndex];
  
  const roe = platform === "instagram" 
    ? `${platformName} rewards engagement. Post at peak hours and reply to every comment fast.`
    : platform === "linkedin"
    ? `${platformName} is professional. Lead with value, build relationships before selling.`
    : platform === "facebook"
    ? `${platformName} loves comments. Ask questions and respond to build thread momentum.`
    : platform === "twitter"
    ? `${platformName} moves fast. Be concise and engage with trending conversations.`
    : `${platformName} is about personal connection. Be genuine and follow up promptly.`;

  const formattedMission = `${hook}

OPERATION: CONTENT DEPLOY

SITUATION:
Platform: ${platformName}. Topic: ${topic}.
Audience: U.S. military veterans transitioning into business and content.
Goal: Help them take action today and feel confident.

MISSION:
Create and publish one piece of high-value content about ${topic}.

EXECUTION:
• ${execution[0]}
• ${execution[1]}
• ${execution[2]}
• ${execution[3]}
• ${execution[4]}

RULES OF ENGAGEMENT:
${roe}

${platformBehavior.cta}${platformBehavior.suffix}`;

  return formattedMission;
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
