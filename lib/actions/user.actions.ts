"use server";

import User from "../models/user.model";
import Thread from "../models/thread.model";
import { connectToDb } from "../mongoose";
import { revalidatePath } from "next/cache";

interface updateUserParams {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: updateUserParams): Promise<void> {
  await connectToDb();

  try {
    await User.findOneAndUpdate(
      {
        id: userId,
      },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      {
        upsert: true,
      }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    console.log("Error creating/updating user", error.message);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDb();

    const user = await User.findOne({ id: userId });
    return user;

  } catch (error: any) {
    console.log("Failed to fetch user by ID", error.message);
    return [];
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDb();

    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      },
    });

    return threads;

  } catch (error: any) {
    console.log('Failed to fetch user posts', error.message);
    return [];
  }
}
