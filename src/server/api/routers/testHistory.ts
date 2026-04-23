import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const MessageInput = z.object({
  role: z.string(),
  text: z.string(),
});

const TestCaseInput = z.object({
  caseIndex: z.number(),
  problemText: z.string(),
  hasMismatch: z.boolean(),
  tp: z.number(),
  fp: z.number(),
  fn: z.number(),
  groundTruth: z.string(),
  predicted: z.string(),
  messages: z.array(MessageInput),
});

export const testHistoryRouter = createTRPCRouter({
  saveRun: publicProcedure
    .input(
      z.object({
        totalCases: z.number(),
        tp: z.number(),
        fp: z.number(),
        fn: z.number(),
        precision: z.number(),
        recall: z.number(),
        f1: z.number(),
        testCases: z.array(TestCaseInput),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.testRun.create({
        data: {
          totalCases: input.totalCases,
          tp: input.tp,
          fp: input.fp,
          fn: input.fn,
          precision: input.precision,
          recall: input.recall,
          f1: input.f1,
          testCases: {
            create: input.testCases.map((tc) => ({
              caseIndex: tc.caseIndex,
              problemText: tc.problemText,
              hasMismatch: tc.hasMismatch,
              tp: tc.tp,
              fp: tc.fp,
              fn: tc.fn,
              groundTruth: tc.groundTruth,
              predicted: tc.predicted,
              messages: {
                create: tc.messages.map((msg, idx) => ({
                  msgOrder: idx,
                  role: msg.role,
                  content: msg.text,
                })),
              },
            })),
          },
        },
        select: { id: true },
      });
    }),

  listRuns: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.testRun.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { testCases: true } },
      },
    });
  }),

  getRun: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.testRun.findUnique({
        where: { id: input.id },
        include: {
          testCases: {
            orderBy: { caseIndex: "asc" },
            include: {
              messages: { orderBy: { msgOrder: "asc" } },
            },
          },
        },
      });
    }),

  deleteRun: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.testRun.delete({ where: { id: input.id } });
    }),
});
