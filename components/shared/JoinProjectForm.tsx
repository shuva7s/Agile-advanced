"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { checkProjectAccessAndReturnData } from "@/lib/actions/project.actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DialogClose } from "../ui/dialog";

const formSchema = z.object({
  searchingProjectId: z
    .string()
    .length(24, "project id must contain 16 characters"),
});

export function JoinProjectForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchingProjectId: "",
    },
  });

  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const project = await checkProjectAccessAndReturnData(
        values.searchingProjectId
      );
      if (project.message === "not_found") {
        toast({
          title: "No projects found",
          description: "Enter a valid project ID",
        });
        setIsLoading(false);
        form.reset();
      } else {
        router.push(`/project/${values.searchingProjectId}`);
      }
    } catch (error) {}
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="searchingProjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter a valid project ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter Project Id" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Searching..." : "Search Project"}
        </Button>
      </form>
    </Form>
  );
}
