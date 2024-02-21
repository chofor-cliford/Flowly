import MobileNav from "@/components/shared/MobileNav";
import Sidebar from "@/components/shared/Sidebar";
import { Route, Routes } from "react-router-dom";
import { AddTransformationType, Credit, Profile, UpdateTransformations } from ".";

const Home = () => {
  return (
    <main className="root">
      <Sidebar />
      <MobileNav />
      <div className="root-container">
        <div className="wrapper">
          <Routes>

          <Route path="profile" element={<Profile />} />
          <Route path="credits" element={<Credit />} />
          <Route
            path="transformations/:id/update"
            element={<AddTransformationType />}
            />
          <Route
            path="transformations/add/:type"
            element={<UpdateTransformations />}
            />
            </Routes>
        </div>
      </div>
    </main>
  );
};

export default Home;
