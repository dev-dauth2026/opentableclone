import Link from "next/link"
import { RestaurantCardType } from "@/app/page"
import Price from "./Price";

interface Props{
    restaurant:RestaurantCardType;
}
const   RestaurantCard=({restaurant}:Props)=>{
    return(
        <div
        className="w-64 h-72 m-3 rounded overflow-hidden border cursor-pointer text-black" key={restaurant.id}
      >
      <Link href={`/restaurant/${restaurant.slug}`}>
        <img
          src={restaurant.main_image}
          alt={restaurant.slug}
          className="w-full h-36"
        />
        <div className="p-1">
          <h3 className="font-bold text-2xl mb-2">{restaurant.name}</h3>
          <div className="flex items-start">
            <div className="flex mb-2">*****</div>
            <p className="ml-2">{restaurant.reviews.length} review{ (restaurant.reviews.length > 1)?"s":null}</p>
          </div>
          <div className="flex text-reg font-light capitalize">
            <p className=" mr-3">{restaurant.cuisine.name}</p>
            <Price price={restaurant.price}/>
            <p>{restaurant.location.name}</p>
          </div>
          <p className="text-sm mt-1 font-bold">Booked 3 times today</p>
        </div>
        </Link>
      </div>
    )
}
export default RestaurantCard;