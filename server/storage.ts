import {
  type User,
  type InsertUser,
  type MissionTemplate,
  type InsertMissionTemplate,
  type GeneratedMission,
  type InsertGeneratedMission,
  type Photo,
  type InsertPhoto,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Templates
  getTemplates(): Promise<MissionTemplate[]>;
  getTemplatesByCategory(category: string): Promise<MissionTemplate[]>;
  createTemplate(template: InsertMissionTemplate): Promise<MissionTemplate>;
  
  // Missions
  getCurrentMission(): Promise<GeneratedMission | null>;
  getMissionCount(): Promise<number>;
  createMission(mission: InsertGeneratedMission): Promise<GeneratedMission>;
  
  // Photos
  getPhotos(): Promise<Photo[]>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private templates: Map<string, MissionTemplate>;
  private missions: Map<string, GeneratedMission>;
  private photos: Map<string, Photo>;
  private currentMission: GeneratedMission | null = null;
  private missionCount: number = 0;

  constructor() {
    this.users = new Map();
    this.templates = new Map();
    this.missions = new Map();
    this.photos = new Map();
    
    this.seedData();
  }

  private seedData() {
    // Seed mission templates
    const templateData: InsertMissionTemplate[] = [
      {
        title: "LinkedIn Connection Blitz",
        description: "Connect with 10 potential clients or partners in your industry.",
        category: "networking",
        timeMinutes: 30,
        platform: "linkedin",
        missionText: "MISSION: Open LinkedIn. Search for 10 people in your target market. Send each a personalized connection request mentioning something specific about their profile. Log each connection attempt. Report back when complete.",
      },
      {
        title: "Content Creation Sprint",
        description: "Write and publish a value-packed post about your expertise.",
        category: "business",
        timeMinutes: 45,
        platform: "linkedin",
        missionText: "MISSION: Write one LinkedIn post sharing a lesson from your military service that applies to business. Include a clear takeaway. Add a question at the end to drive engagement. Publish and engage with the first 5 comments.",
      },
      {
        title: "Cold Email Outreach",
        description: "Send 5 personalized emails to potential clients or partners.",
        category: "business",
        timeMinutes: 60,
        platform: "email",
        missionText: "MISSION: Research 5 potential clients. Write personalized emails to each, mentioning a specific problem you can solve for them. Include a clear call-to-action. Send all 5 emails. Track responses in your CRM.",
      },
      {
        title: "Instagram Story Series",
        description: "Create a 5-part story series showcasing your day or expertise.",
        category: "business",
        timeMinutes: 30,
        platform: "instagram",
        missionText: "MISSION: Plan a 5-story series showing behind-the-scenes of your business. Record each story with clear audio. Add text overlays for key points. Include a poll or question sticker in the last slide. Post all stories.",
      },
      {
        title: "Skill Development Block",
        description: "Dedicate focused time to learning a new business skill.",
        category: "learning",
        timeMinutes: 60,
        platform: "email",
        missionText: "MISSION: Choose one skill critical to your business growth. Find a free resource (YouTube, article, course). Set a timer for 60 minutes. Take notes on 3 actionable insights. Apply one insight immediately.",
      },
      {
        title: "Morning Workout Protocol",
        description: "Complete a structured morning fitness routine.",
        category: "fitness",
        timeMinutes: 45,
        platform: "in_person",
        missionText: "MISSION: Complete this circuit: 20 push-ups, 30 squats, 20 lunges, 1-minute plank. Rest 60 seconds. Repeat 3 times. Finish with 5-minute stretch. Log your time and reps. Stay hydrated.",
      },
      {
        title: "Phone Sales Calls",
        description: "Make direct phone calls to warm leads or past clients.",
        category: "business",
        timeMinutes: 60,
        platform: "phone",
        missionText: "MISSION: Review your lead list. Select 10 warm leads. Call each one. Use this framework: Build rapport (2 min), Identify needs (3 min), Present solution (3 min), Close or schedule follow-up. Log all outcomes.",
      },
      {
        title: "Twitter/X Engagement Run",
        description: "Build presence by engaging with industry leaders and hashtags.",
        category: "networking",
        timeMinutes: 30,
        platform: "twitter",
        missionText: "MISSION: Find 5 posts from industry leaders in your niche. Leave thoughtful comments that add value (not just 'Great post!'). Quote-tweet one with your own insight. Follow 10 relevant accounts.",
      },
      {
        title: "In-Person Networking Event",
        description: "Prepare for and attend a local business networking event.",
        category: "networking",
        timeMinutes: 120,
        platform: "in_person",
        missionText: "MISSION: Review the event attendee list if available. Set a goal to have 5 meaningful conversations. Prepare your 30-second intro. Bring business cards. After each conversation, take notes on follow-up actions. Send follow-up emails within 24 hours.",
      },
      {
        title: "Book Reading Block",
        description: "Read and take notes on a business or personal development book.",
        category: "learning",
        timeMinutes: 45,
        platform: "in_person",
        missionText: "MISSION: Select a business or self-improvement book. Read for 45 minutes with no distractions. Take notes on key concepts. Identify one idea to implement this week. Share your top insight on social media.",
      },
      {
        title: "Customer Follow-Up Calls",
        description: "Check in with existing customers to build relationships and get referrals.",
        category: "business",
        timeMinutes: 45,
        platform: "phone",
        missionText: "MISSION: List 5 past customers. Call each to check on their satisfaction. Ask for feedback. Request a referral or testimonial from satisfied customers. Update your CRM with notes.",
      },
      {
        title: "Video Content Creation",
        description: "Record and post a short-form video for social media.",
        category: "business",
        timeMinutes: 30,
        platform: "instagram",
        missionText: "MISSION: Choose one topic you can teach in under 60 seconds. Write a quick script (3 key points). Record 3 takes. Edit the best one with captions. Post to Instagram Reels and TikTok.",
      },
    ];

    templateData.forEach((t) => {
      const id = randomUUID();
      this.templates.set(id, { ...t, id });
    });

    // Seed photos
    const photoData: InsertPhoto[] = [
      {
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        veteranName: "Marcus Johnson",
        missionAccomplished: "Launched a successful consulting firm helping other veterans transition to civilian careers.",
        businessName: "Veteran Career Solutions",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
        veteranName: "Sarah Chen",
        missionAccomplished: "Built a fitness coaching business with over 500 clients nationwide.",
        businessName: "Military Fit Coaching",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
        veteranName: "David Williams",
        missionAccomplished: "Created a tech startup that provides cybersecurity training to small businesses.",
        businessName: "SecureVet Technologies",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
        veteranName: "Emily Rodriguez",
        missionAccomplished: "Opened three successful coffee shops employing fellow veterans.",
        businessName: "Brew & Serve Coffee Co.",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
        veteranName: "James Thompson",
        missionAccomplished: "Founded a construction company specializing in sustainable building practices.",
        businessName: "Green Build Contractors",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
        veteranName: "Michelle Adams",
        missionAccomplished: "Developed a mental health app specifically designed for veterans and their families.",
        businessName: "MindStrong Wellness",
      },
    ];

    photoData.forEach((p) => {
      const id = randomUUID();
      const photo: Photo = { ...p, id, businessName: p.businessName ?? null };
      this.photos.set(id, photo);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getTemplates(): Promise<MissionTemplate[]> {
    return Array.from(this.templates.values());
  }

  async getTemplatesByCategory(category: string): Promise<MissionTemplate[]> {
    return Array.from(this.templates.values()).filter(
      (t) => t.category === category
    );
  }

  async createTemplate(template: InsertMissionTemplate): Promise<MissionTemplate> {
    const id = randomUUID();
    const newTemplate: MissionTemplate = { ...template, id };
    this.templates.set(id, newTemplate);
    return newTemplate;
  }

  async getCurrentMission(): Promise<GeneratedMission | null> {
    return this.currentMission;
  }

  async getMissionCount(): Promise<number> {
    return this.missionCount;
  }

  async createMission(mission: InsertGeneratedMission): Promise<GeneratedMission> {
    const id = randomUUID();
    this.missionCount++;
    const newMission: GeneratedMission = { ...mission, id, missionNumber: this.missionCount };
    this.missions.set(id, newMission);
    this.currentMission = newMission;
    return newMission;
  }

  async getPhotos(): Promise<Photo[]> {
    return Array.from(this.photos.values());
  }

  async createPhoto(photo: InsertPhoto): Promise<Photo> {
    const id = randomUUID();
    const newPhoto: Photo = { ...photo, id, businessName: photo.businessName ?? null };
    this.photos.set(id, newPhoto);
    return newPhoto;
  }
}

export const storage = new MemStorage();
