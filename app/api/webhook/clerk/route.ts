import { Webhook, WebhookRequiredHeaders } from "svix";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { IncomingHttpHeaders } from "http";
import addCommunity from "@/lib/actions/community.actions";

type EventType =
  | "organization.created"
  | "organizationInvitation.created"
  | "organizationMembership.created"
  | "organizationMembership.deleted"
  | "organization.updated"
  | "organization.deleted";

type Event = {
  data: Record<string, string | number | Record<string, string>[]>;
  object: "event";
  type: EventType;
};

export const POST = async (request: NextRequest) => {
  const header = headers();

  const heads = {
    "svix-id": header.get("svix-id"),
    "svix-timestamp": header.get("svix-timestamp"),
    "svix-signature": header.get("svix-signature"),
  } as IncomingHttpHeaders & WebhookRequiredHeaders;

  const payload = await request.json();
  if( Object.keys(payload).length < 1 ) return NextResponse.json({ message: 'No data found' },{ status: 422 })

  if (!process.env.NEXT_CLERK_WEBHOOK_SECRET) return;
  const webhook = new Webhook(process.env.NEXT_CLERK_WEBHOOK_SECRET);

  let event: Event | null = null;

  try {
    event = webhook.verify(JSON.stringify(payload), heads) as Event;
    console.log("Event webhook verified:", event);
  } catch (error: any) {
    return NextResponse.json({ message: error.message },{ status: 400 });
  }

  const eventType = payload?.type;

  switch (eventType) {
    case "organization.created":

      let { id, name, slug, image_url, created_by } = payload.data;
      await addCommunity({
        "communityId": id,
        "name": name,
        "username": slug,
        "imageUrl": image_url,
        "bio": "abcdef",
        "createdBy": JSON.stringify(created_by),
      });

      console.log("A new community was created!", name);
      break;
    case "organizationMembership.created":
      console.log("A new membership was created!");
      break;
    case "organizationInvitation.created":
      console.log("A new invitation was created!");
      break;
    case "organization.updated":
      console.log("Organization was recently updated");
      break;
    case "organization.deleted":
      console.log("Organization was deleted");
      break;
    default:
      console.log("Some unknown activity on webhook was detected!");
  }

  return NextResponse.json({
    success: true,
  },{ status: 200 });
};
