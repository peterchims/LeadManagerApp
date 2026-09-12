import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-mesh flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="brand-gradient mb-5 flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-sm">
        <Compass className="h-6 w-6" />
      </div>
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="brand-gradient mt-7 inline-flex h-10 items-center gap-1.5 rounded-lg px-5 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
      >
        <ArrowLeft className="h-4 w-4" />
        Back home
      </Link>
    </div>
  );
}
