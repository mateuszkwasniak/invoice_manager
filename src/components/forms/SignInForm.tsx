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
import { signUserIn } from "@/actions/actions";
import { Loader } from "lucide-react";
import { SignInFormInput, SignInFormSchema } from "@/schemas/SignIn";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "../ui/card";

export default function SignInForm() {
  const form = useForm<SignInFormInput>({
    mode: "onBlur",
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      name: "",
      password: "",
    },
  });
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: SignInFormInput) => {
    setFormError("");
    setLoading(true);

    const response = await signUserIn("credentials", data);
    if (!response?.ok) {
      setFormError(response?.message || "Nie udało się zalogować");
      setLoading(false);
    } else {
      router.replace("/");
    }
  };

  return (
    <Card>
      <CardContent className="p-8">
        <Form {...form}>
          <form
            data-testid="sign-in-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex gap-12"
          >
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
                    <FormMessage data-testid="login-error" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hasło: </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage data-testid="pwd-error" />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="dark:bg-zinc-300 dark:text-black dark:hover:bg-zinc-400 w-full"
                  >
                    {loading ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      "Zaloguj się"
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
