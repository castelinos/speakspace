"use client"

import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";

import { usePathname, useRouter } from "next/navigation";

import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";

function PostThread({ userId }:{ userId:string}){

    const pathname = usePathname();
    const router = useRouter();

    const form = useForm({
        defaultValues:{
            thread:'',
            accountId: userId,
        },
        resolver:zodResolver( ThreadValidation ),
    })

    const onSubmit = async( values: z.infer<typeof ThreadValidation> ) => {
        await createThread({
            text:values.thread,
            author:userId,
            communityId:null,
            path:pathname,
        });

        router.push('/');
    }

    return (
        <Form {...form} >
            <form className="mt-10 flex flex-col justify-start gap-10" onSubmit={ form.handleSubmit( onSubmit ) }>

                {/* Thread field */}
                <FormField name="thread" control={form.control} render={
                    ({ field }) => {
                        return(
                            <FormItem className="flex flex-col w-full gap-3">
                                <FormLabel className="text-base-semibold text-light-2">Content Label</FormLabel>
                                <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                                    <Textarea rows={15} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )
                    }
                } />

                <Button type="submit" className="bg-primary-500">Post Thread</Button>
            </form>
        </Form>
    )
}

export default PostThread;