import { 
  users, 
  travelLogs, 
  travelImages,
  type User, 
  type InsertUser,
  type TravelLog,
  type InsertTravelLog,
  type TravelImage,
  type InsertTravelImage
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Travel log methods
  getTravelLog(id: number): Promise<TravelLog | undefined>;
  getTravelLogsByUser(userId: number): Promise<TravelLog[]>;
  createTravelLog(travelLog: InsertTravelLog): Promise<TravelLog>;
  
  // Travel image methods
  getTravelImagesByLogId(travelLogId: number): Promise<TravelImage[]>;
  createTravelImage(travelImage: InsertTravelImage): Promise<TravelImage>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getTravelLog(id: number): Promise<TravelLog | undefined> {
    const [travelLog] = await db.select().from(travelLogs).where(eq(travelLogs.id, id));
    return travelLog || undefined;
  }

  async getTravelLogsByUser(userId: number): Promise<TravelLog[]> {
    return await db.select().from(travelLogs).where(eq(travelLogs.userId, userId));
  }

  async createTravelLog(insertTravelLog: InsertTravelLog): Promise<TravelLog> {
    const [travelLog] = await db
      .insert(travelLogs)
      .values(insertTravelLog)
      .returning();
    return travelLog;
  }

  async getTravelImagesByLogId(travelLogId: number): Promise<TravelImage[]> {
    return await db.select().from(travelImages).where(eq(travelImages.travelLogId, travelLogId));
  }

  async createTravelImage(insertTravelImage: InsertTravelImage): Promise<TravelImage> {
    const [travelImage] = await db
      .insert(travelImages)
      .values(insertTravelImage)
      .returning();
    return travelImage;
  }
}

export const storage = new DatabaseStorage();
