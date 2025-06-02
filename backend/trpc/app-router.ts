import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import analyzeRoute from "./routes/beauty/analyze/route";
import roastRoute from "./routes/beauty/roast/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  beauty: createTRPCRouter({
    analyze: analyzeRoute,
    roast: roastRoute,
  }),
});

export type AppRouter = typeof appRouter;