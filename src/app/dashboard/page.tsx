import { auth } from "@clerk/nextjs/server"
import { getProducts } from "../server/products"
import NoProductPage from "../components/NoProductPage"


export default async function DashBoardPage() {
    const { userId } =  auth()
    //console.log(userSession, "User session ")

    const products = await getProducts(userId, { limit : 6 })
    if( products.length === 0) return <NoProductPage/> 

    return(
    <main className="min-h-screen flex flex-col items-center justify-center rounded-3xl">
        <h2>Dashboard</h2>
       </main>
    )
}
