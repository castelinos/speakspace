"use client"

import * as z from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { CommentValidation } from "@/lib/validations/thread";

import { usePathname,useRouter } from "next/navigation";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.actions";

interface Props{
    threadId:string;
    currentUserImg:string;
    currentUserId:string;
}

function Comment({ threadId, currentUserImg, currentUserId }:Props) {

    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues:{
            thread:''
        }
    })

    async function onSubmit( values: z.infer<typeof CommentValidation>){
        await addCommentToThread(threadId, values.thread, currentUserId.toString(), pathname);

        form.reset();
    }

    return (
        <Form {...form}>
            <form className="comment-form" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField 
                 name="thread" 
                 control={form.control} 
                 render={({ field }) => {
                    
                    return(
                        <FormItem className="flex items-center w-full gap-3">
                            <FormLabel> 
                                <Image 
                                    src={currentUserImg}
                                    alt="Profile image"
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover"
                                />
                            </FormLabel>
                            <FormControl className="border-none bg-transparent" >
                                <Input 
                                    type="text" 
                                    placeholder="Comment..." 
                                    className="no-focus text-light-1 outline-none"
                                    {...field} 
                                />
                            </FormControl>
                        </FormItem>
                    )}
                } />

                <Button type="submit" className="comment-form_btn">
                    Reply
                </Button>
            </form>
        </Form>
    );
}

export default Comment;