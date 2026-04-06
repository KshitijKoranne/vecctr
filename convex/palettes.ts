// @ts-nocheck
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getPalettes = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("palettes")
      .withIndex("by_user", q => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const savePalette = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    colors: v.array(v.string()),
    generatorSlug: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("palettes", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const deletePalette = mutation({
  args: { id: v.id("palettes") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
