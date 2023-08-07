// Import necessary modules and libraries
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import bcrypt from "bcrypt";
import * as jose from "jose";

// Create an instance of PrismaClient
const prisma = new PrismaClient();

// Define the handler function for the API route
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if the request method is POST
  if (req.method === "POST") {
    // Destructure the request body to get user information
    const { firstName, lastName, email, phone, city, password } = req.body;

    // Initialize an array to store validation errors
    const errors: string[] = [];

    // Define a validation schema for each user field
    const validationSchema = [
      {
        valid: validator.isLength(firstName, {
          min: 1,
          max: 20,
        }), // Check if the first name has a valid length
        errorMessage: "First Name is invalid",
      },
      {
        valid: validator.isLength(lastName, {
          min: 1,
          max: 20,
        }), // Check if the last name has a valid length
        errorMessage: "Last Name is invalid",
      },
      {
        valid: validator.isEmail(email), // Check if the email is valid
        errorMessage: "Email is invalid",
      },
      {
        valid: validator.isMobilePhone(phone), // Check if the phone number is valid
        errorMessage: "Phone Number is invalid",
      },
      {
        valid: validator.isLength(city, { min: 1 }), // Check if the city has a valid length
        errorMessage: "City is invalid",
      },
      {
        valid: validator.isStrongPassword(password), // Check if the password is strong enough
        errorMessage: "Password is not strong enough.",
      },
    ];

    // Loop through the validation schema and collect errors if any
    validationSchema.forEach((check) => {
      if (!check.valid) {
        errors.push(check.errorMessage);
      }
    });

    // If there are validation errors, return the first error message
    if (errors.length) {
      return res.status(400).json({ errorMessage: errors[0] });
    }

    // Check if the email is already associated with another account in the database
    const userWithEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // If the email is already in use, return an error
    if (userWithEmail) {
      return res
        .status(400)
        .json({ errorMessage: "Email is associated with another account." });
    }

    // Hash the user's password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database with the provided information
    const user = await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        password: hashedPassword,
        city,
        phone,
        email,
      },
    });

    // Create a JSON Web Token (JWT) for the newly registered user
    const alg = "HS256"; // Algorithm for the JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET); // JWT secret key

    // Sign the JWT with the user's email and set expiration time to 24 hours
    const token = await new jose.SignJWT({ email: user.email })
      .setProtectedHeader({ alg })
      .setExpirationTime("24h")
      .sign(secret);

    // Return the generated token in the response
    return res.status(200).json({
      token,
    });
  }

  // If the request method is not POST, return 404 error
  return res.status(404).json("Unknown endpoint");
}
