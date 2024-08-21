"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
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
import { signUserIn, signUserUp } from "@/actions/actions";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { SignUpFormInput, SignUpFormSchema } from "@/schemas/SignUp";
import { Card, CardContent } from "../ui/card";

export default function SignUpForm() {
  const form = useForm<SignUpFormInput>({
    mode: "onBlur",
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: SignUpFormInput) => {
    setFormError("");
    setLoading(true);

    const response = await signUserUp(data);
    if (!response?.ok) {
      setFormError(response?.message || "Nie udało się zarejestrować");
      setLoading(false);
    } else {
      router.replace("/");
    }
  };

  return (
    <Card>
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-12">
            <div className="w-full flex flex-col space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwa użytkownika:</FormLabel>
                    <FormControl>
                      <Input placeholder="Jan Kowalski" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adres e-mail:</FormLabel>
                    <FormControl>
                      <Input placeholder="adres@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hasło:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Powtórz hasło:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4 w-full">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full dark:bg-zinc-300 dark:text-black dark:hover:bg-zinc-400"
                  >
                    {loading ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      "Zarejestruj się"
                    )}
                  </Button>
                </div>
                {formError && (
                  <p className="text-destructive text-sm text-center">
                    {formError}
                  </p>
                )}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
