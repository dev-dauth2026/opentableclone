// Import required components and libraries
"use client";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useEffect, useState, useContext } from "react";
import AuthModalInputs from "./AuthModalInputs";
import useAuth from "@/hooks/useAuth";
import { AuthenticationContext } from "../context/AuthContext";
import { Alert, CircularProgress } from "@mui/material";

// Style configuration for the modal
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

// Main component for authentication modal
export default function AuthModal({ isSignin }: { isSignin: boolean }) {
  // Access authentication context using useContext
  const { error, loading, data, setAuthState } = useContext(
    AuthenticationContext
  );
  // State to manage modal open/close
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // Custom hook to handle authentication actions
  const { signin, signup } = useAuth();

  // Function to render appropriate content based on isSignin
  const renderContent = (signinContent: string, signupContent: string) => {
    return isSignin ? signinContent : signupContent;
  };

  // Function to handle changes in input fields
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };
  // State to manage input values
  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    password: "",
  });

  // State to manage the button's disabled state
  const [disabled, setDisabled] = useState(true);

  // Effect to determine whether the button should be enabled or disabled
  useEffect(() => {
    if (isSignin) {
      if (inputs.password && inputs.email) {
        return setDisabled(false);
      }
    } else {
      if (
        inputs.firstName &&
        inputs.lastName &&
        inputs.email &&
        inputs.password &&
        inputs.city &&
        inputs.phone
      ) {
        return setDisabled(false);
      }
    }
    return setDisabled(true);
  }, [inputs]);

  // Function to handle button click for authentication
  const handleClick = () => {
    if (isSignin) {
      signin({ email: inputs.email, password: inputs.password }, handleClose);
    } else {
      signup(inputs, handleClose);
    }
  };

  return (
    <div className="text-black">
      {/* Button to open the modal */}
      <button
        onClick={handleOpen}
        className={`${renderContent(
          "bg-blue-400 text-white",
          ""
        )} border p-1 px-4 rounded mr-3`}
      >
        {renderContent("Sign in", "Sign up")}
      </button>

      {/* Modal component */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* Styling and conditional content inside the modal */}
        <Box sx={style}>
          {loading ? (
            // Show loading spinner if loading is true
            <div className="px-5 py-25 h-[600px] flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            // Render content when loading is false
            <div className="p-2 h-[600px]">
              {error && (
                // Display error message if error exists
                <Alert severity="error" className="mb-4">
                  {error}
                </Alert>
              )}
              {/* Header section of the modal */}
              <div className="uppercase font-bold text-center pb-2 border-b mb-2">
                <p className="text-sm text-black">
                  {renderContent("Sign In", "Create Account")}
                </p>
              </div>
              {/* Form and input fields */}
              <div className=" m-auto ">
                <h2 className="text-2xl font-light text-black text-center">
                  {renderContent(
                    "Login Into Your Account",
                    "Create Your OpenTable Account"
                  )}
                </h2>
                <AuthModalInputs
                  inputs={inputs}
                  handleChangeInput={handleChangeInput}
                  isSignin={isSignin}
                />
                {/* Button for action */}
                <button
                  className="uppercase bg-red-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400"
                  disabled={disabled}
                  onClick={handleClick}
                >
                  {renderContent("Sign In", "Create Account")}
                </button>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
