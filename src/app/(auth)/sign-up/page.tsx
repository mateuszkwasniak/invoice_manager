import SignUpForm from "@/components/forms/SignUpForm";
import Link from "next/link";
import React from "react";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const session = await auth();

  if (session) {
    redirect("/");
  }
  return (
    <main>
      <section className="w-full md:w-3/4 xl:w-1/2 2xl:w-1/4">
        <h1 className="w-full text-center text-3xl font-semibold mb-8">
          Zarejestruj się
        </h1>
        <SignUpForm />
        <p className="mt-4 text-center text-sm">
          Posiadasz już konto?{" "}
          <Link
            className="font-semibold underline transition duration-300 hover:opacity-50"
            href="/sign-in"
          >
            Zaloguj się
          </Link>
        </p>
      </section>
    </main>
  );
}
