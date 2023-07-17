"use client";

import { Button } from "@/components/ui/button/button";
import { captureException } from "@sentry/nextjs";
import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage = (props: ErrorPageProps) => {
  useEffect(() => {
    captureException(props.error);
  }, [props.error]);
  return (
    <div className="h-screen mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            An unexpected error occurred
          </h1>
          <p className="text-md text-muted-foreground">
            An unexpected error has occurred while executing your request.
            Please try again later.
          </p>
        </div>
        <Button onClick={props.reset}>Retry</Button>
      </div>
    </div>
  );
};

export default ErrorPage;
