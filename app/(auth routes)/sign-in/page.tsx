"use client";

import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { login } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./SignInPage.module.css";

interface AuthErrorResponse {
  response?: {
    message?: string;
  };
}

function SignIn() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const user = await login({
        email: String(formData.get("email")),
        password: String(formData.get("password")),
      });
      setUser(user);
      router.push("/profile");
      router.refresh();
    } catch (requestError) {
      if (isAxiosError<AuthErrorResponse>(requestError)) {
        setError(
          requestError.response?.data?.response?.message ??
            "Login failed. Check your email and password.",
        );
      } else {
        setError("Login failed. Check your email and password.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isSubmitting}
          >
            Log in
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}

export default SignIn;
