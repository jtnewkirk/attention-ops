import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateMissionSchema } from "@shared/schema";

// Mission generation logic based on parameters
function generateMissionText(timeMinutes: number, goal: string, platform: string): string {
  const goalMissions: Record<string, string[]> = {
    grow_audience: [
      `MISSION: Spend ${timeMinutes} minutes on ${formatPlatform(platform)} engaging with your target audience. Comment on 5 posts from industry leaders with valuable insights. Follow 10 accounts in your niche. Share one piece of content that provides real value to your followers.`,
      `MISSION: Use ${timeMinutes} minutes to create and share authentic content on ${formatPlatform(platform)}. Tell a story from your experience that your audience can learn from. End with a question to drive engagement. Respond to every comment within the first hour.`,
      `MISSION: Dedicate ${timeMinutes} minutes to community building on ${formatPlatform(platform)}. Find and join 3 relevant groups or conversations. Contribute meaningfully without selling. Build relationships first, business follows.`,
    ],
    make_sales: [
      `MISSION: Spend ${timeMinutes} minutes reaching out to warm leads via ${formatPlatform(platform)}. Contact 5 potential clients. Use the problem-agitation-solution framework. Follow up on any previous conversations. Track all activities.`,
      `MISSION: Use ${timeMinutes} minutes for direct outreach on ${formatPlatform(platform)}. Identify 3 prospects who have shown interest. Craft personalized messages addressing their specific pain points. Include a clear call-to-action. Set follow-up reminders.`,
      `MISSION: Dedicate ${timeMinutes} minutes to closing activities on ${formatPlatform(platform)}. Review your pipeline. Send proposals to qualified leads. Address objections with empathy and facts. Document everything in your CRM.`,
    ],
    build_network: [
      `MISSION: Invest ${timeMinutes} minutes networking on ${formatPlatform(platform)}. Reach out to 5 people you admire but haven't connected with. Lead with value - offer help before asking for anything. Be genuine and specific in your outreach.`,
      `MISSION: Spend ${timeMinutes} minutes strengthening existing relationships via ${formatPlatform(platform)}. Check in with 3 key contacts. Congratulate them on recent wins. Offer assistance or resources. Plant seeds for future collaboration.`,
      `MISSION: Use ${timeMinutes} minutes to expand your professional circle on ${formatPlatform(platform)}. Find and connect with 10 professionals in complementary industries. Send personalized connection requests that reference something specific about them.`,
    ],
    learn_skill: [
      `MISSION: Block ${timeMinutes} minutes for focused learning. Find the best resource for your chosen skill. Take detailed notes. Apply at least one concept immediately. Share what you learned with your network on ${formatPlatform(platform)}.`,
      `MISSION: Dedicate ${timeMinutes} minutes to skill development. Watch tutorials, read articles, or practice hands-on. Focus on one specific micro-skill. Track your progress. Identify next learning steps.`,
      `MISSION: Invest ${timeMinutes} minutes in professional growth via ${formatPlatform(platform)} resources. Find an expert in your field to learn from. Study their approach. Take notes on what you can adapt. Implement one new tactic today.`,
    ],
    create_content: [
      `MISSION: Use ${timeMinutes} minutes to create valuable content for ${formatPlatform(platform)}. Choose one topic you can speak on with authority. Outline 3 key points. Create your content (post, video, or article). Edit and publish. Engage with early responses.`,
      `MISSION: Spend ${timeMinutes} minutes on content creation for ${formatPlatform(platform)}. Repurpose something you've already created into a new format. Add fresh insights or updates. Optimize for the platform. Schedule or publish immediately.`,
      `MISSION: Dedicate ${timeMinutes} minutes to batch content creation for ${formatPlatform(platform)}. Brainstorm 5 content ideas. Create 2-3 pieces. Schedule them throughout the week. Prepare engagement prompts for each.`,
    ],
  };

  const missions = goalMissions[goal] || goalMissions.grow_audience;
  const randomIndex = Math.floor(Math.random() * missions.length);
  return missions[randomIndex];
}

function formatPlatform(platform: string): string {
  const platformNames: Record<string, string> = {
    linkedin: "LinkedIn",
    instagram: "Instagram",
    twitter: "Twitter/X",
    email: "Email",
    phone: "Phone",
    in_person: "In-Person",
  };
  return platformNames[platform] || platform;
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

  // Generate a new mission
  app.post("/api/missions/generate", async (req, res) => {
    const parsed = generateMissionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid mission parameters", details: parsed.error.errors });
    }

    const { timeMinutes, goal, platform } = parsed.data;
    const missionText = generateMissionText(timeMinutes, goal, platform);

    const mission = await storage.createMission({
      missionText,
      timeMinutes,
      goal,
      platform,
      missionNumber: 0, // Will be set by storage
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
