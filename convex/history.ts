// @ts-nocheck
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getHistory = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("history")
      .withIndex("by_user", q => q.eq("userId", userId))
      .order("desc")
      .take(20);
  },
});

export const saveHistory = mutation({
  args: {
    userId: v.string(),
    generatorSlug: v.string(),
    seed: v.number(),
    params: v.string(),
    canvasW: v.number(),
    canvasH: v.number(),
  },
  handler: async (ctx, args) => {
    // Keep max 20 entries per user — delete oldest if over limit
    const existing = await ctx.db
      .query("history")
      .withIndex("by_user", q => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    if (existing.length >= 20) {
      const oldest = existing[existing.length - 1];
      await ctx.db.delete(oldest._id);
    }

    return await ctx.db.insert("history", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
