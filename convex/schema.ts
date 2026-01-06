import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  calculations: defineTable({
    clientId: v.string(),
    timestamp: v.number(),
    // Input values
    carbs: v.number(),
    mealCoefficient: v.number(),
    currentGlucose: v.number(),
    targetGlucose: v.number(),
    insulinSensitivity: v.number(),
    lastInjectionHours: v.number(),
    lastInjectionUnits: v.number(),
    // Results
    mealBolus: v.number(),
    correctionBolus: v.number(),
    totalBolus: v.number(),
  }).index("by_client", ["clientId"]),
});
