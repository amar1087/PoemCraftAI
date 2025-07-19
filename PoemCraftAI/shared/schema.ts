import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const poems = pgTable("poems", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  names: text("names"),
  style: text("style").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPoemSchema = createInsertSchema(poems).pick({
  eventType: true,
  names: true,
  style: true,
  content: true,
});

export const generatePoemSchema = z.object({
  eventType: z.string().min(1, "Event type is required"),
  names: z.string().optional(),
  style: z.enum(["heartfelt", "playful", "elegant", "humorous"]),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPoem = z.infer<typeof insertPoemSchema>;
export type Poem = typeof poems.$inferSelect;
export type GeneratePoemRequest = z.infer<typeof generatePoemSchema>;
