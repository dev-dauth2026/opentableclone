// Import required modules and dependencies
"use client";
import useAuth from "@/hooks/useAuth"; // Custom authentication hook
import axios from "axios"; // HTTP client library
import { getCookie } from "cookies-next"; // Library for managing cookies
import React, { useState, createContext, useEffect } from "react"; // React modules

// Interface defining the structure of a user
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  phone: string;
}

// Interface defining the common state properties
interface State {
  loading: boolean;
  error: string | null;
  data: User | null;
}

// Interface defining the extended authentication state properties
interface AuthState extends State {
  setAuthState: React.Dispatch<React.SetStateAction<State>>;
}

// Create an authentication context with default values
export const AuthenticationContext = createContext<AuthState>({
  loading: false,
  error: null,
  data: null,
  setAuthState: () => {},
});

// Component that provides authentication-related context to its children
export default function AuthContext({
  children,
}: {
  children: React.ReactNode;
}) {
  // State to manage authentication-related data
  const [authState, setAuthState] = useState<State>({
    loading: false,
    data: null,
    error: null,
  });

  // Function to fetch user data from the server
  const fetchUser = async () => {
    // Indicate loading state while fetching user data
    setAuthState({
      data: null,
      error: null,
      loading: true,
    });

    try {
      // Get JWT token from cookies
      const jwt = getCookie("jwt");

      // If no JWT token is present, update state and exit
      if (!jwt) {
        return setAuthState({
          data: null,
          error: null,
          loading: false,
        });
      }

      // Fetch user data using the JWT token in the header
      const response = await axios.get("http://localhost:3000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      // Set Authorization header for subsequent API calls
      axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

      // Update state with fetched user data
      setAuthState({
        data: response.data,
        error: null,
        loading: false,
      });
    } catch (error: any) {
      // Handle errors by updating state with error information
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      });
    }
  };

  // Fetch user data when the component mounts
  useEffect(() => {
    fetchUser();
  }, []);

  // Provide authentication-related context to children
  return (
    <AuthenticationContext.Provider
      value={{
        ...authState,
        setAuthState,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
