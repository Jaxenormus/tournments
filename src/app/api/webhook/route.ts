import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/prisma";

const webhookSchema = z.object({
  action: z.union([
    z.literal("membership.went_valid"),
    z.literal("membership.went_invalid"),
    z.literal("payment.succeeded"),
  ]),
  data: z.object({
    id: z.string(),
    product: z.object({
      id: z.string(),
      name: z.string(),
      visibility: z.string(),
      created_at: z.number(),
      experiences: z.array(z.string()),
      plans: z.array(z.string()),
    }),
    user: z.object({
      id: z.string(),
      username: z.string(),
      email: z.string().email(),
      profile_pic_url: z.string().url(),
      social_accounts: z.array(
        z.object({
          service: z.string(),
          username: z.string(),
          id: z.string(),
        })
      ),
    }),
  }),
});

export const GET = async (req: NextRequest) => {
  const rawBody = await req.json();
  const body = webhookSchema.safeParse(rawBody);
  if (body.success && body.data) {
    const { data: payload } = body;
    try {
      switch (payload.action) {
        case "payment.succeeded": {
          const credit = await prisma.credit.create({
            data: {
              user: {
                connectOrCreate: {
                  where: { id: payload.data.user.id },
                  create: {
                    id: payload.data.user.id,
                    name: payload.data.user.username,
                  },
                },
              },
              experienceIds: payload.data.product.experiences,
            },
          });
          return NextResponse.json(
            { id: credit.id, handled: true },
            { status: 200 }
          );
        }
        case "membership.went_valid": {
          await prisma.$transaction(async (tx) => {
            payload.data.product.experiences.forEach(async (experienceId) => {
              await tx.membership.create({
                data: {
                  id: `${payload.data.user.id}-${experienceId}`,
                  user: {
                    connectOrCreate: {
                      where: { id: payload.data.user.id },
                      create: {
                        id: payload.data.user.id,
                        name: payload.data.user.username,
                      },
                    },
                  },
                  experienceId: experienceId,
                },
              });
            });
          });
          return NextResponse.json({ handled: true }, { status: 200 });
        }
        case "membership.went_invalid": {
          await prisma.$transaction(async (tx) => {
            payload.data.product.experiences.forEach(async (experienceId) => {
              await tx.membership.delete({
                where: {
                  id: `${payload.data.user.id}-${experienceId}`,
                },
              });
            });
          });
          return NextResponse.json({ handled: true }, { status: 200 });
        }
        default:
          return NextResponse.json(
            { error: `Unsupported Action: ${payload.action}` },
            { status: 400 }
          );
      }
    } catch (e) {
      return NextResponse.json({ error: e, credited: false }, { status: 500 });
    }
  }
  return NextResponse.json({ error: "Invalid Body" }, { status: 400 });
};
