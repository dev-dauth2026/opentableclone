// Import necessary modules and libraries
import { NextApiRequest, NextApiResponse } from "next";
import * as jose from "jose";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

// Create an instance of PrismaClient
const prisma = new PrismaClient();

// Define the handler function for the API route
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Extract the JWT from the "Authorization" header
  const bearerToken = req.headers["authorization"] as string;
  const token = bearerToken.split(" ")[1];

  // Decode the JWT and extract the payload (in this case, the user's email)
  const payload = jwt.decode(token) as { email: string };

  // If the payload does not contain the user's email, the request is unauthorized
  if (!payload.email) {
    return res.status(401).json({
      errorMessage: "Unauthorized request",
    });
  }

  // Query the database to find the user with the provided email
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    // Select specific fields to include in the response (id, first_name, last_name, city, phone)
    select: {
      id: true,
      first_name: true,
      last_name: true,
      city: true,
      phone: true,
    },
  });

  // Return the user information in the response
  return res.json({ user });
}
