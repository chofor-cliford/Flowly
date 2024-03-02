import MobileNav from "@/components/shared/MobileNav";
import Sidebar from "@/components/shared/Sidebar";
import { Route, Routes } from "react-router-dom";
import {
  AddTransformationType,
  Credit,
  HomePage,
  Profile,
  UpdateTransformations,
} from ".";
import { Toaster } from "@/components/ui/toaster";
import TransformationsPage from "./TransformationsPage";

const RootPage = () => {
  return (
    <main className="root">
      <Sidebar />
      <MobileNav />
      <div className="root-container">
        <div className="wrapper">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="profile" element={<Profile />} />
            <Route path="credits" element={<Credit />} />
            <Route
              path="transformations/:id"
              element={<TransformationsPage />}
            />
            <Route
              path="transformations/:id/update"
              element={<UpdateTransformations />}
            />
            <Route
              path="transformations/add/:type"
              element={<AddTransformationType />}
            />
          </Routes>
        </div>
      </div>
      <Toaster />
    </main>
  );
};

export default RootPage;
