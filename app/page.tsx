import Header from './components/Header'
import RestaurantCard from './components/RestaurantCard'
import { Cuisine, Location, PRICE, PrismaClient } from '@prisma/client'

export interface RestaurantCardType{
  id:number;
  name:string;
  main_image:string;
  cuisine:Cuisine;
  location:Location;
  price:PRICE;
  slug:string;
}

const prisma =new PrismaClient();

const fetchRestaurants = async():Promise<RestaurantCardType[]>=>{
  const restaurants = await prisma.restaurant.findMany({
    select:{
      id:true,
      name:true,
      main_image:true,
      location:true,
      cuisine:true,
      price:true,
      slug:true,
    }
  })
  return restaurants
}
export default async function Home() {
const restaurants= await fetchRestaurants();

  return (
  
    <main>
      {/* HEADER */}
      <Header/>
      {/* HEADER */} {/* CARDS */}
      <div className="py-3 px-36 mt-10 flex flex-wrap justify-center">
       {
        restaurants.map((restaurant)=>{
          return    <RestaurantCard restaurant={restaurant}/>
        })
       }
    
     
      </div>
      {/* CARDS */}
    </main>

 
  )
}
