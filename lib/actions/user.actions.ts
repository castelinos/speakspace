"use server";

import User from "../models/user.model";
import Thread from "../models/thread.model";
import { connectToDb } from "../mongoose";
import { revalidatePath } from "next/cache";
import { FilterQuery, SortOrder } from "mongoose";

interface updateUserParams {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

interface fetchUsersParams {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
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
    console.log("Failed to fetch user posts", error.message);
    return [];
  }
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: fetchUsersParams) {
  try {
    connectToDb();

    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");

    // Look for users which are not current user
    const query: FilterQuery<typeof User> = {
      id: {
        $ne: userId,
      },
    };

    // If searchTerm is defined, match for it
    if (searchString.trim() !== "") {
      query.$or = [
        {
          username: {
            $regex: regex,
          },
        },
        {
          name: {
            $regex: regex,
          },
        },
      ];
    }

    const sortOptions = {
      createdAt: sortBy,
    };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);
    const users = await usersQuery.exec();
    const isNext = totalUsersCount > skipAmount + users.length;
    
    return { users, isNext };
  } catch (error: any) {
    console.log("Error fetching User Search Query", error.message);
    return { users: [], isNext: false };
  }
}
