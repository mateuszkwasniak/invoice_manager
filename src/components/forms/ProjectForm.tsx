"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";

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

import { useProjectStore } from "@/store/project_store";
import { DialogClose } from "../ui/dialog";
import { Loader } from "lucide-react";
import { ProjectFormInput, ProjectFormSchema } from "@/schemas/Project";

export default function ProjectForm({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm<ProjectFormInput>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: {
      projectName: "",
    },
  });
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const createProject = useProjectStore((store) => store.createProject);

  const onSubmit = async (data: ProjectFormInput) => {
    setFormError("");
    setLoading(true);

    try {
      await createProject(data);
      setOpen(false);
    } catch (error: any) {
      setFormError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-12">
        <div className="w-full flex flex-col space-y-8">
          <FormField
            control={form.control}
            name="projectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwa projektu:</FormLabel>
                <FormControl>
                  <Input placeholder="Kwiatowa" {...field} />
                </FormControl>
                <FormDescription>Nazwa nowego projektu</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <DialogClose asChild>
                <Button type="button" variant={"outline"} disabled={loading}>
                  Anuluj
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={loading}
                className="w-20 dark:bg-zinc-300 dark:text-black dark:hover:bg-zinc-400"
              >
                {loading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  "Dodaj"
                )}
              </Button>
            </div>
            {formError && <p className="text-destructive">{formError}</p>}
          </div>
        </div>
      </form>
    </Form>
  );
}
