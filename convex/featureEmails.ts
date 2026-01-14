import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const save = mutation({
  args: {
    email: v.string(),
    clientId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if email already exists for this client
    const existing = await ctx.db
      .query("featureEmails")
      .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
      .first();

    if (existing) {
      // Update existing record
      await ctx.db.patch(existing._id, {
        email: args.email,
        timestamp: Date.now(),
      });
      return existing._id;
    }

    // Create new record
    const id = await ctx.db.insert("featureEmails", {
      email: args.email,
      clientId: args.clientId,
      timestamp: Date.now(),
    });
    return id;
  },
});

export const getByClient = query({
  args: { clientId: v.string() },
  handler: async (ctx, args) => {
    const email = await ctx.db
      .query("featureEmails")
      .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
      .first();
    return email;
  },
});
