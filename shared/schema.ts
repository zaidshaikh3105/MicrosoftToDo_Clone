import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  quadrant: integer("quadrant").notNull(), // 1: Important/Urgent, 2: Important/Not Urgent, 3: Not Important/Urgent, 4: Not Important/Not Urgent
  priority: text("priority").notNull(), // 'high', 'medium', 'low'
  dueDate: text("due_date"),
  completed: boolean("completed").notNull().default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  userId: true,
  title: true,
  description: true,
  quadrant: true,
  priority: true,
  dueDate: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export const taskValidationSchema = insertTaskSchema.extend({
  title: z.string().min(1, "Title is required"),
  quadrant: z.number().min(1).max(4),
  priority: z.enum(["high", "medium", "low"]),
});

export const userValidationSchema = insertUserSchema.extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
