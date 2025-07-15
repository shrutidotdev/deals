import { ReactNode } from "react"
import NavBar from "./_components/NavBar"

export default function HomeLayout({children}: {children: ReactNode}){
    return <div className="">
        <NavBar />
        
        {children}
    </div>
}