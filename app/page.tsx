import Header from './components/Header'
import RestaurantCard from './components/RestaurantCard'
import { Cuisine, Location, PRICE, PrismaClient, Review } from '@prisma/client'
import { CalculateReviewsRatingAverage } from './utils/calculateRatingReviewsAverage';

export interface RestaurantCardType{
  id:number;
  name:string;
  main_image:string;
  cuisine:Cuisine;
  location:Location;
  price:PRICE;
  slug:string;
  reviews:Review[];
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
      reviews:true,
    }
  })
  return restaurants
}

const fetchReviews= async()=>{
  const reviews =await prisma.review.findMany()
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
          return <RestaurantCard restaurant={restaurant}  />
        })
       }
    
      </div>
      {/* CARDS */}
    </main>

 
  )
}
