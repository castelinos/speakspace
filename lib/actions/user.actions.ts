"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDb } from "../mongoose";

interface Params {
    userId : string, 
    username : string, 
    name:string, 
    bio:string,
    image:string,
    path:string,
}

export async function updateUser({ 
    userId, 
    username, 
    name, 
    bio,
    image,
    path,
}:Params): Promise<void> {
    
    await connectToDb();

    try {
        await User.findOneAndUpdate({
            id: userId
        },{
            username:username.toLowerCase(),
            name,
            bio,
            image,
            onboarded:true
        },{
            upsert:true,
        })
    
        if( path === '/profile/edit' ){
            revalidatePath(path);
        }
        
    } catch ( error:any ) {
        console.log('Error creating/updating user', error.message);
    }
    
}

export async function fetchUser( userId:string ){
    try {
        connectToDb();
        return await User.findOne({ id:userId })

    } catch ( error:any ) {
        console.log('Failed to fetch user by ID',error.message);
    }

}