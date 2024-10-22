import Community from "../models/community.model";
import { connectToDb } from "../mongoose";

interface addCommunityParams {
  communityId: string;
  name: string;
  username: string;
  imageUrl: string;
  bio: string;
  createdBy: string;
}

export default async function addCommunity({
  communityId,
  name,
  username,
  imageUrl,
  bio,
  createdBy,
}: addCommunityParams) {
  await connectToDb();
  try {
    await Community.create({
      id: communityId,
      name: name,
      username: username,
      image: imageUrl,
      bio: bio,
      createdBy: createdBy,
    });
  } catch (error: any) {
    console.log('Failed to add community data', error.message);
    
  }
}
