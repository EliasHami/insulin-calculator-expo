import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: { clientId: v.string() },
  handler: async (ctx, args) => {
    const settings = await ctx.db
      .query("settings")
      .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
      .first();
    return settings;
  },
});

export const upsert = mutation({
  args: {
    clientId: v.string(),
    targetGlucose: v.string(),
    insulinSensitivity: v.string(),
    mealCoefficients: v.object({
      breakfast: v.string(),
      lunch: v.string(),
      dinner: v.string(),
      snack: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        targetGlucose: args.targetGlucose,
        insulinSensitivity: args.insulinSensitivity,
        mealCoefficients: args.mealCoefficients,
        updatedAt: Date.now(),
      });
      return existing._id;
    } else {
      const id = await ctx.db.insert("settings", {
        clientId: args.clientId,
        targetGlucose: args.targetGlucose,
        insulinSensitivity: args.insulinSensitivity,
        mealCoefficients: args.mealCoefficients,
        updatedAt: Date.now(),
      });
      return id;
    }
  },
});
