import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <Image
        src="/assets/404.png"
        width={500}
        height={500}
        alt="404 not found"
      />

      <h2 className="mt-4 text-3xl font-semibold">
        Page Not Found
      </h2>

      <p className="mt-2 text-gray-500 max-w-md">
        Sorry, the page you are looking for does not exist.
      </p>

      <Link
        href="/"
        className="mt-6 px-5 py-3 rounded-lg bg-black text-white hover:opacity-90 transition"
      >
        <div className="flex items-center justify-center gap-3">
        <ArrowLeft className="w-5 h-5"/>
       <span>Back to Home</span>
       </div>
      </Link>
    </main>
  );
}