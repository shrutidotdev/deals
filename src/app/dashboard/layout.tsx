import React from "react";
import NavBar from "./_component/Navbar";

export default function DashBoardLayOutPage({
  children,
}: {
  children: React.ReactNode;
}) {
    return <div>
        <NavBar/>
         {children}
    </div>
}
