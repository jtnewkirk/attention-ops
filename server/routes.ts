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

function getStyleModifier(style: string): { hookPrefix: string; executionStyle: string } {
  const modifiers: Record<string, { hookPrefix: string; executionStyle: string }> = {
    direct: { hookPrefix: "", executionStyle: "Action items. No fluff." },
    motivational: { hookPrefix: "You've got this.\n", executionStyle: "Steps to victory." },
    tactical: { hookPrefix: "", executionStyle: "Detailed tactical breakdown." },
    storytelling: { hookPrefix: "Picture this...\n", executionStyle: "Your path forward." },
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

function generateMissionText(timeMinutes: number, goal: string, platform: string, topic: string, style: string): string {
  const platformBehavior = getPlatformBehavior(platform);
  const styleModifier = getStyleModifier(style);
  const platformName = formatPlatform(platform);
  
  const goalData: Record<string, { opName: string; situation: string; mission: string; hooks: string[]; executions: string[][] }> = {
    grow_audience: {
      opName: "OPERATION: AUDIENCE GROWTH",
      situation: `You have ${timeMinutes} minutes. Topic: ${topic}. Platform: ${platformName}.`,
      mission: `Grow your reach with content about ${topic}. Help veterans take action and feel confident.`,
      hooks: [
        `Most vets post and pray.\nTop 1% post with a plan.`,
        `Your audience is waiting.\nStop making them wait.`,
        `You served your country.\nNow serve your audience.`,
      ],
      executions: [
        [
          `Create one post about ${topic} that provides real value.`,
          `Find 5 veterans or entrepreneurs posting similar content. Engage genuinely.`,
          `Follow 10 accounts in your target market.`,
          `Reply to 3 comments on your recent posts.`,
          `End your content with a question to drive engagement.`,
        ],
        [
          `Share a lesson from your military experience that connects to ${topic}.`,
          `Tag 2 people who need to hear your message.`,
          `Engage with 5 trending posts in your industry.`,
          `Use platform-specific features (stories, polls, threads).`,
          `Schedule your next piece of content before logging off.`,
        ],
      ],
    },
    make_sales: {
      opName: "OPERATION: REVENUE",
      situation: `${timeMinutes} minutes on the clock. Topic: ${topic}. Time to close.`,
      mission: `Start sales conversations around ${topic}. Help veterans take action today.`,
      hooks: [
        `Likes don't pay bills.\nSales do.`,
        `You didn't join the military to play small.\nDon't start now.`,
        `Stop waiting for permission.\nStart making money.`,
      ],
      executions: [
        [
          `Review your warm leads list. Pick 5 names interested in ${topic}.`,
          `Send personalized outreach referencing their specific situation.`,
          `Ask one qualifying question to understand their pain.`,
          `Follow up on any open conversations.`,
          `Log every interaction. Track what works.`,
        ],
        [
          `Identify your hottest lead interested in ${topic}.`,
          `Send them a message with a clear next step.`,
          `Handle objections with facts, not feelings.`,
          `Create urgency with a deadline or bonus.`,
          `Confirm the call or payment before you log off.`,
        ],
      ],
    },
    build_network: {
      opName: "OPERATION: CONNECT",
      situation: `${timeMinutes} minutes to build relationships. Topic: ${topic}.`,
      mission: `Expand your network with people who care about ${topic}. Build trust.`,
      hooks: [
        `Your network is your net worth.\nTime to expand it.`,
        `In the military, you had a unit.\nIn business, you need a network.`,
        `The right connection changes everything.\nGo find them.`,
      ],
      executions: [
        [
          `Search for 5 people discussing ${topic} that you'd want to know.`,
          `Send personalized connection requests. No templates.`,
          `Mention something specific about their work.`,
          `Engage with their recent content before reaching out.`,
          `Set a follow-up reminder for next week.`,
        ],
        [
          `Message 3 people you haven't talked to in 30+ days about ${topic}.`,
          `Congratulate someone on a recent win.`,
          `Offer help or a resource without asking for anything.`,
          `Find 2 new people in complementary industries.`,
          `Set up one virtual coffee chat for this week.`,
        ],
      ],
    },
    learn_skill: {
      opName: "OPERATION: UPSKILL",
      situation: `${timeMinutes} minutes of focused learning. Topic: ${topic}.`,
      mission: `Master one concept about ${topic} and apply it immediately.`,
      hooks: [
        `The best operators never stop training.\nNeither should you.`,
        `You trained for war.\nNow train for wealth.`,
        `Knowledge without action is just entertainment.\nTime to learn AND apply.`,
      ],
      executions: [
        [
          `Find the best free resource about ${topic} (YouTube, article, course).`,
          `Block all distractions. This is focused time.`,
          `Take notes on 3 key takeaways.`,
          `Apply one concept to your business today.`,
          `Share what you learned with your audience.`,
        ],
        [
          `Read or watch content about ${topic} for ${Math.floor(timeMinutes * 0.7)} minutes.`,
          `Write down one thing you can implement today.`,
          `Teach the concept to someone else in your own words.`,
          `Identify gaps in your knowledge for next time.`,
          `Schedule your next learning block before you stop.`,
        ],
      ],
    },
    create_content: {
      opName: "OPERATION: CREATE",
      situation: `${timeMinutes} minutes to create. Topic: ${topic}. Platform: ${platformName}.`,
      mission: `Publish one piece of high-value content about ${topic} that helps veterans take action.`,
      hooks: [
        `Content is your 24/7 salesperson.\nTime to put it to work.`,
        `Your story is your superpower.\nTell it.`,
        `Stop consuming. Start creating.\nYour audience needs you.`,
      ],
      executions: [
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
      ],
    },
  };

  const data = goalData[goal] || goalData.grow_audience;
  const hookIndex = Math.floor(Math.random() * data.hooks.length);
  const execIndex = Math.floor(Math.random() * data.executions.length);
  
  const hook = styleModifier.hookPrefix + data.hooks[hookIndex];
  const execution = data.executions[execIndex];
  
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

${data.opName}

SITUATION:
${data.situation}

MISSION:
${data.mission}

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

  // Generate a new mission
  app.post("/api/missions/generate", async (req, res) => {
    const parsed = generateMissionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid mission parameters", details: parsed.error.errors });
    }

    const { timeMinutes, goal, platform, topic, style } = parsed.data;
    const missionText = generateMissionText(timeMinutes, goal, platform, topic, style);

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
