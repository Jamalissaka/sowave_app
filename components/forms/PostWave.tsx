"use client";

import * as z from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { WaveValidation } from "@/lib/validations/wave";
import { createWave } from "@/lib/actions/wave.actions";
//import { updateUser } from "@/lib/actions/user.actions";

interface Props {
  user: {
    id: string;
    object: string;
    username: string;
    name: string;
    image: string;
    bio: string;
  };
  btnTitle: string;
}

function PostWave({ userId }: { userId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const form = useForm({
    resolver: zodResolver(WaveValidation),
    defaultValues: {
      wave: "",
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof WaveValidation>) => {
    await createWave({
      text: values.wave,
      author: userId,
      communityId: null,
      path: pathname,
    });

    router.push("/");
  };

  return (
    <Form {...form}>
      <form
        className="mt-10 flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="wave"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                What's on your mind...
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">
          Post Wave
        </Button>
      </form>
    </Form>
  );
}

export default PostWave;
