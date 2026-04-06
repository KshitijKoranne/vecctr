// @ts-nocheck
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Saved color palettes per user
  palettes: defineTable({
    userId: v.string(),
    name: v.string(),
    colors: v.array(v.string()),
    generatorSlug: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Generation history per user (last 20)
  history: defineTable({
    userId: v.string(),
    generatorSlug: v.string(),
    seed: v.number(),
    params: v.string(), // JSON stringified
    canvasW: v.number(),
    canvasH: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
