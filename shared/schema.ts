import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const travelLogs = pgTable("travel_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  destination: text("destination").notNull(),
  date: text("date").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const travelImages = pgTable("travel_images", {
  id: serial("id").primaryKey(),
  travelLogId: integer("travel_log_id").notNull(),
  imageUrl: text("image_url").notNull(),
  story: text("story").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  travelLogs: many(travelLogs),
}));

export const travelLogsRelations = relations(travelLogs, ({ one, many }) => ({
  user: one(users, {
    fields: [travelLogs.userId],
    references: [users.id],
  }),
  images: many(travelImages),
}));

export const travelImagesRelations = relations(travelImages, ({ one }) => ({
  travelLog: one(travelLogs, {
    fields: [travelImages.travelLogId],
    references: [travelLogs.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTravelLogSchema = createInsertSchema(travelLogs).omit({
  id: true,
  createdAt: true,
});

export const insertTravelImageSchema = createInsertSchema(travelImages).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type TravelLog = typeof travelLogs.$inferSelect;
export type InsertTravelLog = z.infer<typeof insertTravelLogSchema>;
export type TravelImage = typeof travelImages.$inferSelect;
export type InsertTravelImage = z.infer<typeof insertTravelImageSchema>;
