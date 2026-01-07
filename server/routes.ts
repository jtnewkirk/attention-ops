import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateMissionSchema } from "@shared/schema";

// Platform-specific formatting
function getPlatformBehavior(platform: string): { tone: string; suffix: string } {
  const behaviors: Record<string, { tone: string; suffix: string }> = {
    linkedin: { tone: "professional", suffix: "" },
    instagram: { tone: "short", suffix: "\n\n#Vet2Ceo #VeteranEntrepreneur #MilitaryBusiness #VetBiz #EntrepreneurLife #VeteranOwned #MissionDriven #BusinessVeteran" },
    twitter: { tone: "short", suffix: "" },
    facebook: { tone: "text-first", suffix: "" },
    phone: { tone: "direct", suffix: "" },
    in_person: { tone: "direct", suffix: "" },
  };
  return behaviors[platform] || { tone: "direct", suffix: "" };
}

function generateMissionText(timeMinutes: number, goal: string, platform: string): string {
  const { suffix } = getPlatformBehavior(platform);
  const platformName = formatPlatform(platform);
  
  const missions: Record<string, { hook: string; opName: string; situation: string; mission: string; execution: string[]; roe: string; cta: string }[]> = {
    grow_audience: [
      {
        hook: "Most vets post and pray.\nTop 1% post with a plan.",
        opName: "OPERATION: AUDIENCE GROWTH",
        situation: `You have ${timeMinutes} minutes. Your audience is waiting. Time to show up.`,
        mission: "Grow your reach by 10 new engaged followers today.",
        execution: [
          "Find 5 accounts in your niche posting content you respect.",
          "Leave a real comment on each post. No 'great post' garbage.",
          "Follow 10 accounts that match your target customer.",
          "Reply to 3 comments on your own recent posts.",
          "Post one piece of value-driven content before you log off."
        ],
        roe: `${platformName} rewards engagement. Comment before you post. The algorithm notices.`,
        cta: "Comment 'VET' if you're ready to grow. Join the Vet2Ceo community."
      },
      {
        hook: "You served your country.\nNow serve your audience.",
        opName: "OPERATION: VISIBILITY",
        situation: `${timeMinutes} minutes on the clock. Every second counts.`,
        mission: "Get your content in front of 100 new eyeballs.",
        execution: [
          "Share one lesson from your military experience that applies to business.",
          "Tag 2 people who need to hear your message.",
          "Use 3-5 relevant hashtags or keywords for discoverability.",
          "Engage with trending posts in your industry.",
          "End your post with a question to drive comments."
        ],
        roe: `${platformName} boosts posts with early engagement. Reply to every comment in the first hour.`,
        cta: "Comment 'VET' below. Let's build this together."
      }
    ],
    make_sales: [
      {
        hook: "Likes don't pay bills.\nSales do.",
        opName: "OPERATION: REVENUE",
        situation: `You have ${timeMinutes} minutes to move the needle on revenue.`,
        mission: "Start 5 sales conversations today.",
        execution: [
          "Review your warm leads list. Pick 5 names.",
          "Send a personalized message to each. Reference something specific.",
          "Ask one qualifying question to understand their pain point.",
          "Follow up on any open proposals or past conversations.",
          "Log every interaction in your CRM or notes app."
        ],
        roe: `On ${platformName}, be direct but not pushy. Serve first, sell second.`,
        cta: "Comment 'VET' if you're closing deals this week."
      },
      {
        hook: "You didn't join the military to play small.\nDon't start now.",
        opName: "OPERATION: CLOSE",
        situation: `${timeMinutes} minutes. Time to turn prospects into paying clients.`,
        mission: "Book 2 discovery calls or close 1 sale.",
        execution: [
          "Identify your hottest lead. The one who's almost ready.",
          "Send them a message with a clear next step.",
          "Handle objections with facts, not feelings.",
          "Create urgency with a deadline or bonus.",
          "Confirm the call or payment before you log off."
        ],
        roe: `${platformName} is for building trust. Close in DMs or on a call, not in public.`,
        cta: "Comment 'VET' when you book that call. We celebrate wins here."
      }
    ],
    build_network: [
      {
        hook: "Your network is your net worth.\nTime to expand it.",
        opName: "OPERATION: CONNECT",
        situation: `${timeMinutes} minutes to build relationships that pay dividends.`,
        mission: "Add 5 high-value connections to your network.",
        execution: [
          "Search for 5 people you'd want to collaborate with.",
          "Send a personalized connection request. No templates.",
          "Mention something specific about their work.",
          "Engage with their recent content before reaching out.",
          "Schedule a follow-up reminder for next week."
        ],
        roe: `${platformName} connections grow cold fast. Follow up within 48 hours.`,
        cta: "Comment 'VET' if you're building your network. Join the Vet2Ceo community."
      },
      {
        hook: "In the military, you had a unit.\nIn business, you need a network.",
        opName: "OPERATION: ALLIANCE",
        situation: `You have ${timeMinutes} minutes to strengthen your professional circle.`,
        mission: "Reconnect with 3 existing contacts and meet 2 new ones.",
        execution: [
          "Message 3 people you haven't talked to in 30+ days.",
          "Congratulate someone on a recent win or milestone.",
          "Offer help or a resource without asking for anything.",
          "Find 2 new people in complementary industries.",
          "Set up one virtual coffee chat for this week."
        ],
        roe: `On ${platformName}, relationships beat transactions. Give before you ask.`,
        cta: "Comment 'VET' below. Let's grow together."
      }
    ],
    learn_skill: [
      {
        hook: "The best operators never stop training.\nNeither should you.",
        opName: "OPERATION: UPSKILL",
        situation: `${timeMinutes} minutes of focused learning. No distractions.`,
        mission: "Master one new concept and apply it immediately.",
        execution: [
          "Choose one skill critical to your next business goal.",
          "Find a free resource: YouTube, article, or course module.",
          "Take notes on 3 key takeaways.",
          "Apply one concept to your business today.",
          "Share what you learned with your audience."
        ],
        roe: `Learning without action is just entertainment. Apply it or lose it.`,
        cta: "Comment 'VET' if you're committed to growth."
      },
      {
        hook: "You trained for war.\nNow train for wealth.",
        opName: "OPERATION: KNOWLEDGE",
        situation: `${timeMinutes} minutes to level up your business IQ.`,
        mission: "Complete one learning block and document your insights.",
        execution: [
          "Block all notifications. This is focused time.",
          "Read 10 pages or watch 20 minutes of training.",
          "Write down one thing you can implement today.",
          "Teach the concept to someone else in your own words.",
          "Schedule your next learning block before you stop."
        ],
        roe: `Repetition builds retention. Review your notes tomorrow morning.`,
        cta: "Comment 'VET' if you're always learning. Join the Vet2Ceo community."
      }
    ],
    create_content: [
      {
        hook: "Content is your 24/7 salesperson.\nTime to put it to work.",
        opName: "OPERATION: CREATE",
        situation: `${timeMinutes} minutes to create content that builds trust and drives sales.`,
        mission: "Publish one piece of high-value content.",
        execution: [
          "Pick one topic you can speak on with authority.",
          "Outline 3 key points your audience needs to hear.",
          "Create the content: post, video, or article.",
          "Add a clear call-to-action at the end.",
          "Publish and engage with the first 5 commenters."
        ],
        roe: `${platformName} rewards consistency. Post at the same time each day.`,
        cta: "Comment 'VET' when you publish. We support our own."
      },
      {
        hook: "Your story is your superpower.\nTell it.",
        opName: "OPERATION: BROADCAST",
        situation: `${timeMinutes} minutes. One message. Maximum impact.`,
        mission: "Share one story that connects with your ideal customer.",
        execution: [
          "Think of a moment that shaped who you are today.",
          "Write it in 5 sentences or less. Keep it tight.",
          "Connect the story to a lesson your audience can use.",
          "End with a question to spark conversation.",
          "Post it and reply to every comment within the hour."
        ],
        roe: `Stories beat statistics on ${platformName}. Lead with emotion, follow with logic.`,
        cta: "Comment 'VET' if you're sharing your story. Join the Vet2Ceo community."
      }
    ],
  };

  const goalMissions = missions[goal] || missions.grow_audience;
  const selected = goalMissions[Math.floor(Math.random() * goalMissions.length)];

  const formattedMission = `${selected.hook}

${selected.opName}

SITUATION:
${selected.situation}

MISSION:
${selected.mission}

EXECUTION:
• ${selected.execution[0]}
• ${selected.execution[1]}
• ${selected.execution[2]}
• ${selected.execution[3]}
• ${selected.execution[4]}

RULES OF ENGAGEMENT:
${selected.roe}

${selected.cta}${suffix}`;

  return formattedMission;
}

function formatPlatform(platform: string): string {
  const platformNames: Record<string, string> = {
    linkedin: "LinkedIn",
    instagram: "Instagram",
    twitter: "Twitter/X",
    email: "Email",
    phone: "Phone",
    in_person: "In-Person",
    facebook: "Facebook",
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
      missionNumber: 0,
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
