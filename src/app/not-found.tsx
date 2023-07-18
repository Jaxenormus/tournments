import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="h-screen mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Could not find requested resource
          </h1>
          <p className="text-md text-muted-foreground">
            The resource you have requested could not be found or your may not
            have access to it.
          </p>
        </div>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
