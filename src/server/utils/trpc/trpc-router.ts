import { AccountRoutes, ArticleRoutes } from "@/server/routes";
import { t } from "@/server/utils/trpc/init";

export const trpcServerRouter = t.router({
  account: t.router(AccountRoutes),
  article: t.router(ArticleRoutes),
});

export type TRPCServerRouterType = typeof trpcServerRouter;
