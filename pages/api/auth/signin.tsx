// Import necessary modules and libraries
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import bcrypt from "bcrypt";
import * as jose from "jose";
import { setCookie } from "cookies-next";

// Create an instance of PrismaClient
const prisma = new PrismaClient();

// Define the handler function for the API route
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if the request method is POST
  if (req.method === "POST") {
    // Initialize an array to store validation errors
    const errors: string[] = [];
    // Get the email and password from the request body
    const { email, password } = req.body;

    // Define a validation schema for email and password
    const validationSchema = [
      {
        valid: validator.isEmail(email), // Check if the email is valid
        errorMessage: "Email is invalid",
      },
      {
        valid: validator.isLength(password, {
          min: 1,
        }), // Check if the password is not empty
        errorMessage: "Password is invalid",
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

    // Find the user with the provided email in the database
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // If the user with the email is not found, return an error
    if (!user) {
      return res
        .status(401)
        .json({ errorMessage: "Email or password is invalid" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    // If the passwords do not match, return an error
    if (!isMatch) {
      return res
        .status(401)
        .json({ errorMessage: "Email or password is invalid" });
    }

    // If everything is valid, create a JSON Web Token (JWT) for authentication
    const alg = "HS256"; // Algorithm for the JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET); // JWT secret key

    // Sign the JWT with the user's email and set expiration time to 24 hours
    const token = await new jose.SignJWT({ email: user.email })
      .setProtectedHeader({ alg })
      .setExpirationTime("24h")
      .sign(secret);
    // set the cookie
    setCookie("jwt", token, { req, res, maxAge: 60 * 6 * 24 });
    // Return the generated token in the response
    return res.status(200).json({
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone,
      city: user.city,
    });
  }

  // If the request method is not POST, return 404 error
  return res.status(404).json("Unknown endpoint");
}
