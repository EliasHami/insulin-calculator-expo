import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const save = mutation({
  args: {
    clientId: v.string(),
    carbs: v.number(),
    mealCoefficient: v.number(),
    currentGlucose: v.number(),
    targetGlucose: v.number(),
    insulinSensitivity: v.number(),
    lastInjectionHours: v.number(),
    lastInjectionUnits: v.number(),
    mealBolus: v.number(),
    correctionBolus: v.number(),
    totalBolus: v.number(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("calculations", {
      ...args,
      timestamp: Date.now(),
    });
    return id;
  },
});

export const getByClient = query({
  args: { clientId: v.string() },
  handler: async (ctx, args) => {
    const calculations = await ctx.db
      .query("calculations")
      .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
      .order("desc")
      .collect();
    return calculations;
  },
});
