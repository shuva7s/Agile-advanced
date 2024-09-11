"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createProject } from "@/lib/actions/project.actions";

import { useRouter } from "next/navigation";

const formSchema = z.object({
  projectName: z.string().min(3).max(50),
  projectDescription: z.string().min(3).max(200),
});

export function CreateProjectForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      projectDescription: "",
    },
  });

  const { toast } = useToast();
  const router = useRouter();
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Prepare the data for creating the project
      const projectData: CreateProjectParams = {
        projectName: values.projectName,
        projectDescription: values.projectDescription,
        members: [],
        joinRequests: [],

        requirements: [],
        designing: [],
        pending_designing: [],
        development: [],
        pending_development: [],
        testing: [],
        pending_testing: [],
        deployment: [],
        pending_deployment: [],
        done: [],

        timeSlice: 0,
        hasStarted: false,
        hasCompleted: false,
        dayCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const newProject = await createProject(projectData);

      if (newProject.message === "success") {
        form.reset();

        const date = new Date(newProject.data.createdAt);
        const dateFormatter = new Intl.DateTimeFormat("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const timeFormatter = new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
        const formattedDate = dateFormatter.format(date);
        const formattedTime = timeFormatter.format(date);
        const formattedDateTime = `${formattedDate} at ${formattedTime}`;

        toast({
          title: "New Project Created",
          description: formattedDateTime,
        });

        router.push(`/project/${newProject.data._id}`);
        router.refresh();
      } else if (newProject.message === "invalid_ids") {
        toast({
          title: "Invalid user credential",
        });
      } else if (newProject.message === "user_not_found") {
        toast({
          title: "User not found",
        });
      } else if (newProject.message === "swr") {
        toast({
          title: "Something went wrong !",
        });
      }
    } catch (error) {}
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input required placeholder="Project Name" {...field} />
              </FormControl>
              <FormDescription>This is your project name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="projectDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Input placeholder="Project Description" {...field} />
              </FormControl>
              <FormDescription>This is project description.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
       
          <Button type="submit">Save</Button>
        {/* </DialogClose> */}
      </form>
    </Form>
  );
}
