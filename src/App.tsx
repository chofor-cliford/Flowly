import { Route, Routes, useNavigate } from "react-router-dom";
import {
  Credit,
  Home,
  Profile,
  UpdateTransformations,
  AddTransformationType,
  SignInPage,
  SignOutPage,
} from "./pages";
import { useAuth } from "@clerk/clerk-react";

const App = () => {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();
  
  if (!userId) {
    navigate(`${import.meta.env.VITE_CLERK_SIGN_UP_URL}`);
  }

  if (!isLoaded) return "Loading...";
  return (
    <Routes>
      <Route path="/*" element={<Home />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignOutPage />} />
    </Routes>
  );
};

export default App;
