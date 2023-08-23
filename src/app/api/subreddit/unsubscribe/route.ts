import { getAuthSession } from "@/lib/auth";
import { z } from "zod";
import { db } from "@/lib/db";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id)
      return new NextResponse("Unauthorized", { status: 401 });

    const body = await request.json();

    const { subredditId } = SubredditSubscriptionValidator.parse(body);

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExists) {
      return new NextResponse("You are not subscribed to this subreddit.", {
        status: 400,
      });
    }

    // check if user is the creator of the subreddit
    const subreddit = await db.subreddit.findFirst({
      where: {
        id: subredditId,
        creatorId: session.user.id,
      },
    });

    if (subreddit) {
      return new NextResponse("You cant unscribe from your own subreddit", {
        status: 400,
      });
    }

    await db.subscription.delete({
      where: {
        id: subscriptionExists.id,
      },
    });

    return new NextResponse(subredditId);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data passed.", { status: 422 });
    }
    return new NextResponse("Could not unsubscribe, please try again later!", {
      status: 500,
    });
  }
}
