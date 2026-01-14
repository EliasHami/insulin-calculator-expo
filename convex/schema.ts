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

  settings: defineTable({
    clientId: v.string(),
    targetGlucose: v.string(),
    insulinSensitivity: v.string(),
    mealCoefficients: v.object({
      breakfast: v.string(),
      lunch: v.string(),
      dinner: v.string(),
      snack: v.string(),
    }),
    updatedAt: v.number(),
  }).index("by_client", ["clientId"]),

  featureEmails: defineTable({
    email: v.string(),
    clientId: v.string(),
    timestamp: v.number(),
  }).index("by_email", ["email"])
    .index("by_client", ["clientId"]),
});
