import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generatePoemSchema, insertPoemSchema } from "@shared/schema";
import { aiAgent } from "./ai-agent";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate poem endpoint
  app.post("/api/poems/generate", async (req, res) => {
    try {
      const { eventType, names, style, childrenTheme, childrenOptions, learningTopic } = generatePoemSchema.parse(req.body);
      
      // Use AI agent to generate the poem
      const result = await aiAgent.generatePoem({ eventType, names, style, childrenTheme, childrenOptions, learningTopic });
      
      // Save the generated poem
      const savedPoem = await storage.createPoem({
        eventType,
        names: names || "",
        style,
        content: result.content,
        childrenTheme: childrenTheme || "",
        childrenOptions: childrenOptions || [],
        learningTopic: learningTopic || "",
      });
      
      res.json(savedPoem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: error.errors });
      } else {
        console.error("Poem generation error:", error);
        res.status(500).json({ message: "Failed to generate poem" });
      }
    }
  });

  // Get recent poems
  app.get("/api/poems/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const poems = await storage.getRecentPoems(limit);
      res.json(poems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent poems" });
    }
  });

  // Get specific poem
  app.get("/api/poems/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const poem = await storage.getPoemById(id);
      
      if (!poem) {
        return res.status(404).json({ message: "Poem not found" });
      }
      
      res.json(poem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch poem" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}


