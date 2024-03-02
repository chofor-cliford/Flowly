import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import {
  RootPage,
  SignInPage,
  SignOutPage,
} from "./pages";
import { useAuth } from "@clerk/clerk-react";
import Loader from "./components/shared/Loader";

const App = () => {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId && isLoaded) {
      navigate(`${import.meta.env.VITE_CLERK_SIGN_UP_URL}`);
    }
  }, [userId, isLoaded, navigate]);

  if (!isLoaded) return <Loader text="Please wait..." />;
  return (
    <Routes>
      <Route path="/*" element={<RootPage />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignOutPage />} />
    </Routes>
  );
};

export default App;
