import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <section>
      <div className="relative flex flex-col justify-center items-center min-h-screen bg-primary overflow-hidden py-10 mx-auto">
        <div className="max-w-5xl w-full text-center text-card">
          <h1 className="font-extrabold text-9xl md:text-[20rem] lg:text-[38rem] ">
            404
          </h1>
          <div className="absolute top-10 transform left-[10%] translate-y-1/2">
            <h2>Not Found</h2>
            <Button asChild className="bg-black">
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
