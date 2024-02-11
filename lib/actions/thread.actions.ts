"use server"

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDb } from "../mongoose";

interface Params{
    text : string,
    author : string,
    communityId : string | null,
    path : string,
}

export async function createThread({ text, author, communityId, path } : Params ){
    connectToDb();

    try {
        const createdThread = await Thread.create({
            text,
            author,
            community:null,
        });
    
        await User.findByIdAndUpdate( author, { $push: { threads: createdThread._id} })
        
        revalidatePath(path);

    } catch ( error:any ) {
        console.log('Error creating thread', error.message );
    }

}

export async function fetchPosts( pageNumber = 1, pageSize = 20 ){
    connectToDb();

    try {
        const skipAmount = (pageNumber - 1) * pageSize;

        const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
          .sort({ createdAt: "desc" })
          .skip(skipAmount)
          .limit(pageSize)
          .populate({ path: "author", model: "User" })
          .populate({
            path: "children",
            populate: {
              path: "author",
              model: User,
              select: "_id name parentId image",
            },
          });

        const totalPostsCount = await Thread.countDocuments({
          parentId: { $in: [null, undefined] },
        });
        const posts = await postsQuery.exec();
        const isNext = totalPostsCount > skipAmount + posts.length;

        return { posts, isNext };
        
    } catch (error:any) {
        console.log(`Error fetching Posts ${error.message}`);
        return { posts:[], isNext:false };
    }
}

export async function fetchThreadById( id:string ){

    connectToDb();
    try {
        const thread = Thread.findById(id)
        .populate({
            path:'author', 
            model:User,
            select: "_id id name image"
        })
        .populate({
            path:'children',
            populate:[
                {
                    path:'author',
                    model: User,
                    select: "_id id name parent_id"
                },
                {
                    path:'children',
                    model: Thread,
                    populate: {
                        path: 'author',
                        model: User,
                        select: "_id id name parent_id"
                    }
                }
            ]
        }).exec();

        return thread;
        
    } catch (error: any) {
        console.log(`Error fetching threads: ${ error.message }`)
        return [];
    }
}