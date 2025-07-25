import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTravelLogSchema, insertTravelImageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Travel logs routes
  app.get("/api/travel-logs", async (req, res) => {
    try {
      const userId = 1; // For now, use a default user
      const travelLogs = await storage.getTravelLogsByUser(userId);
      res.json(travelLogs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch travel logs" });
    }
  });

  app.get("/api/travel-logs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const travelLog = await storage.getTravelLog(id);
      if (!travelLog) {
        return res.status(404).json({ error: "Travel log not found" });
      }
      res.json(travelLog);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch travel log" });
    }
  });

  app.post("/api/travel-logs", async (req, res) => {
    try {
      const validatedData = insertTravelLogSchema.parse(req.body);
      const travelLog = await storage.createTravelLog(validatedData);
      res.status(201).json(travelLog);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create travel log" });
    }
  });

  // Travel images routes
  app.get("/api/travel-logs/:id/images", async (req, res) => {
    try {
      const travelLogId = parseInt(req.params.id);
      const images = await storage.getTravelImagesByLogId(travelLogId);
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch travel images" });
    }
  });

  app.post("/api/travel-images", async (req, res) => {
    try {
      const validatedData = insertTravelImageSchema.parse(req.body);
      const travelImage = await storage.createTravelImage(validatedData);
      res.status(201).json(travelImage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create travel image" });
    }
  });

  // Seed data endpoint (for development)
  app.post("/api/seed", async (req, res) => {
    try {
      // Create default user if doesn't exist
      let user = await storage.getUserByUsername("traveler");
      if (!user) {
        user = await storage.createUser({
          username: "traveler",
          password: "password123" // In real app, this should be hashed
        });
      }

      // Create Philippines travel log
      const travelLog = await storage.createTravelLog({
        userId: user.id,
        title: "TRAVEL LOG",
        destination: "PHILIPPINES",
        date: "JUNE 2023",
        description: "Just got back from the Philippines, and wow—what a ride. The heat, the chaos, the food. I went with a plan, but the country had other ideas."
      });

      // Create travel images
      const images = [
        {
          travelLogId: travelLog.id,
          imageUrl: "/figmaAssets/image-9.png",
          story: "Arrived in Manila - the chaos begins! The heat hits you like a wall when you step off the plane.",
          orderIndex: 0
        },
        {
          travelLogId: travelLog.id,
          imageUrl: "/figmaAssets/image-9.png",
          story: "Exploring the bustling streets of Manila. Jeepneys everywhere and the energy is incredible.",
          orderIndex: 1
        },
        {
          travelLogId: travelLog.id,
          imageUrl: "/figmaAssets/image-9.png",
          story: "Made it to Palawan! Crystal clear waters and limestone cliffs that take your breath away.",
          orderIndex: 2
        },
        {
          travelLogId: travelLog.id,
          imageUrl: "/figmaAssets/image-9.png",
          story: "Island hopping day - discovered hidden lagoons and snorkeled with tropical fish.",
          orderIndex: 3
        }
      ];

      for (const image of images) {
        await storage.createTravelImage(image);
      }

      res.json({ message: "Database seeded successfully", travelLog });
    } catch (error) {
      res.status(500).json({ error: "Failed to seed database" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
