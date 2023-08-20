// Import required modules and dependencies
import { AuthenticationContext } from "@/app/context/AuthContext"; // Import the AuthenticationContext from a specific location
import axios from "axios"; // Import axios for making HTTP requests
import { deleteCookie, getCookie, removeCookies } from "cookies-next";
import { useContext } from "react"; // Import useContext for accessing context in functional components

// Custom hook for authentication actions
const useAuth = () => {
  // Destructure data, error, loading, and setAuthState from the AuthenticationContext
  const { data, error, loading, setAuthState } = useContext(
    AuthenticationContext
  );

  // Function to perform user sign-in
  const signin = async (
    {
      email,
      password,
    }: {
      email: String;
      password: String;
    },
    handleClose: () => void
  ) => {
    // Update authentication state to indicate loading
    setAuthState({
      data: null,
      error: null,
      loading: true,
    });

    try {
      // Send POST request to sign-in endpoint
      const response = await axios.post(
        "http://localhost:3000/api/auth/signin",
        {
          email,
          password,
        }
      );

      // Update authentication state with successful response
      setAuthState({
        data: response.data,
        error: null,
        loading: false,
      });

      // Close the modal
      handleClose();
    } catch (error: any) {
      // Update authentication state with error response
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      });
    }
  };

  // Function to perform user sign-up
  const signup = async (
    {
      email,
      password,
      firstName,
      lastName,
      city,
      phone,
    }: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      city: string;
      phone: string;
    },
    handleClose: () => void
  ) => {
    // Update authentication state to indicate loading
    setAuthState({
      data: null,
      error: null,
      loading: true,
    });

    try {
      // Send POST request to sign-up endpoint
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
        {
          email,
          password,
          firstName,
          lastName,
          city,
          phone,
        }
      );
      console.log(response);

      // Update authentication state with successful response
      setAuthState({
        data: response.data,
        error: null,
        loading: false,
      });

      // Close the modal
      handleClose();
    } catch (error: any) {
      // Update authentication state with error response
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      });
    }
  };

  const signout = () => {
    deleteCookie("jwt");
    setAuthState({
      data: null,
      error: null,
      loading: false,
    });
  };
  // Return the signin and signup functions as part of the hook's API
  return {
    signin,
    signup,
    signout,
  };
};

// Export the custom hook for authentication actions
export default useAuth;
