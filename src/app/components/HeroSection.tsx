import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const HeroSection = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-primary rounded-3xl">
      <div className=" flex flex-col justify-center items-center gap-12 ">

        <div className="mx-auto  text-center">
          <h1 className="text-5xl sm:text-2xl lg:text-6xl font-extrabold">
            Stop Losing $50,000+
            <br />
           Monthly to Stupid Pricing
          </h1>
 
          <p className="mt-5 text-xl  md:text-2xl">
            Transform your business processes with AI-powered
            <br />
            automation. Streamline work, reduce errors, save time.
          </p>
        </div>

       <div className="flex items-center gap-5">
         <Button className="bg-black py-5.5 px-5">
            <Link href={"/"}>
                Get Starterd -no CC required 
            </Link>
         </Button>

         <Button className="bg-black py-5.5 px-5">
            <Link href={"/"}>
                Get Starterd -no CC required 
            </Link>
         </Button>
       </div>
      </div>
    </main>
  );
};

export default HeroSection;
