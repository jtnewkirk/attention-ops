import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Mission Templates
export const missionTemplates = pgTable("mission_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // Business, Fitness, Learning, Networking
  timeMinutes: integer("time_minutes").notNull(),
  platform: text("platform").notNull(), // LinkedIn, Instagram, Twitter, Email, Phone
  missionText: text("mission_text").notNull(),
});

export const insertMissionTemplateSchema = createInsertSchema(missionTemplates).omit({
  id: true,
});

export type InsertMissionTemplate = z.infer<typeof insertMissionTemplateSchema>;
export type MissionTemplate = typeof missionTemplates.$inferSelect;

// Generated Missions
export const generatedMissions = pgTable("generated_missions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  missionText: text("mission_text").notNull(),
  timeMinutes: integer("time_minutes").notNull(),
  goal: text("goal").notNull(),
  platform: text("platform").notNull(),
  topic: text("topic").notNull().default(""),
  missionNumber: integer("mission_number").notNull(),
  createdAt: text("created_at").notNull().default(""),
});

export const insertGeneratedMissionSchema = createInsertSchema(generatedMissions).omit({
  id: true,
});

export type InsertGeneratedMission = z.infer<typeof insertGeneratedMissionSchema>;
export type GeneratedMission = typeof generatedMissions.$inferSelect;

// Photo Gallery
export const photos = pgTable("photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  imageUrl: text("image_url").notNull(),
  veteranName: text("veteran_name").notNull(),
  missionAccomplished: text("mission_accomplished").notNull(),
  businessName: text("business_name"),
});

export const insertPhotoSchema = createInsertSchema(photos).omit({
  id: true,
});

export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type Photo = typeof photos.$inferSelect;

// Form schemas for mission generation
export const generateMissionSchema = z.object({
  platform: z.enum(["linkedin", "instagram", "twitter", "facebook", "email", "phone", "in_person"]),
  topic: z.string().min(1).max(100),
  style: z.enum(["direct", "motivational", "tactical", "storytelling"]),
});

export type GenerateMissionInput = z.infer<typeof generateMissionSchema>;

export const STYLE_OPTIONS = [
  { value: "direct", label: "Direct & No-Nonsense" },
  { value: "motivational", label: "Motivational" },
  { value: "tactical", label: "Tactical & Detailed" },
  { value: "storytelling", label: "Storytelling" },
] as const;

// Categories and options
export const GOAL_OPTIONS = [
  { value: "grow_audience", label: "Grow My Audience" },
  { value: "make_sales", label: "Make Sales" },
  { value: "build_network", label: "Build Network" },
  { value: "learn_skill", label: "Learn a Skill" },
  { value: "create_content", label: "Create Content" },
] as const;

export const PLATFORM_OPTIONS = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter/X" },
  { value: "facebook", label: "Facebook" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "in_person", label: "In Person" },
] as const;

export const TIME_OPTIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
] as const;

export const CATEGORY_OPTIONS = [
  { value: "business", label: "Business" },
  { value: "fitness", label: "Fitness" },
  { value: "learning", label: "Learning" },
  { value: "networking", label: "Networking" },
] as const;
