import Header from "./components/Header";
import Form from "./components/Form";
import type { Metadata } from "next";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
export const metadata: Metadata = {
  title: "Reserve at Milestone-Grill | OpenTables ",
  description: "Generated by create next app",
};

const prisma = new PrismaClient();

const fetchRestaurantBySlug = async (slug: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
  });

  if (!restaurant) {
    notFound();
  }

  return restaurant;
};

const Reserve = async ({ params }: { params: { slug: string } }) => {
  const restaurant = await fetchRestaurantBySlug(params.slug);
  return (
    <div className="border-t h-screen">
      <div className="py-9 w-3/5 m-auto">
        <Header image={restaurant.main_image} name={restaurant.name} />
        {/* FORM */}
        <Form />
      </div>
    </div>
  );
};
export default Reserve;
