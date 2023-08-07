// Import necessary modules and libraries
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

// Define the middleware function to be used in the API route
export async function middleware(req: NextRequest, res: NextResponse) {
  // Extract the JWT from the "Authorization" header
  const bearerToken = req.headers.get("authorization") as string;

  // If there is no JWT (bearer token) in the header, the request is unauthorized
  if (!bearerToken) {
    return new NextResponse(
      JSON.stringify({ errorMessage: "Unauthorized request" }),
      { status: 401 }
    );
  }

  // Extract the token from the bearer token
  const token = bearerToken.split(" ")[1];

  // If there is no token, the request is unauthorized
  if (!token) {
    return new NextResponse(
      JSON.stringify({ errorMessage: "Unauthorized request" }),
      { status: 401 }
    );
  }

  // Get the JWT secret key from the environment variables
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    // Verify the JWT using jose.jwtVerify with the secret key
    await jose.jwtVerify(token, secret);
  } catch (error) {
    // If verification fails (JWT is invalid or expired), the request is unauthorized
    return new NextResponse(
      JSON.stringify({ errorMessage: "Unauthorized request" }),
      { status: 401 }
    );
  }
}

// Export the middleware configuration with the "matcher" to specify the API route
export const config = {
  matcher: ["/api/auth/me"], // This middleware will be applied only to the "/api/auth/me" route
};
