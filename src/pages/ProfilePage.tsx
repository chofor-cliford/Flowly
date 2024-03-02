/* eslint-disable @typescript-eslint/no-explicit-any */

import { Collection } from "@/components/shared/Collection";
import Header from "@/components/shared/Header";
import { IUser } from "@/types";

import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Profile = () => {
  const [pathParams] = useSearchParams();
  const page = Number(pathParams.get("page")) || 1;
  // Extracting query parameters
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser>();
  const [images, setImages] = useState({}) as any;

  if (!userId) navigate("/sign-in");

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await axios.get(`
  https://flowly.onrender.com/api/v1/getUserById/:userId?userId=${userId}`);

      setUser(data);
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    const getAllImages = async () => {
      const params = { searchQuery: searchQuery, limit: 9, page: page };
      try {
        const { data } = await axios.get(
          `https://flowly.onrender.com/api/v1/getAllImages`,
          { params }
        );

        setImages(data);
      } catch (error) {
        console.error(error);
      }
    };

    getAllImages();
  }, [page, searchQuery]);

  return (
    <>
      <Header title="Profile" />

      <section className="profile">
        <div className="profile-balance">
          <p className="p-14-medium md:p-16-medium">CREDITS AVAILABLE</p>
          <div className="mt-4 flex items-center gap-4">
            <img
              src="/assets/icons/coins.svg"
              alt="coins"
              width={50}
              height={50}
              className="size-9 md:size-12"
            />
            <h2 className="h2-bold text-dark-600">{user?.creditBalance}</h2>
          </div>
        </div>

        <div className="profile-image-manipulation">
          <p className="p-14-medium md:p-16-medium">IMAGE MANIPULATION DONE</p>
          <div className="mt-4 flex items-center gap-4">
            <img
              src="/assets/icons/photo.svg"
              alt="coins"
              width={50}
              height={50}
              className="size-9 md:size-12"
            />
            <h2 className="h2-bold text-dark-600">{images?.data?.length}</h2>
          </div>
        </div>
      </section>

      <section className="mt-8 md:mt-14">
        <Collection
          images={images?.data}
          totalPages={images?.totalPages}
          page={page}
        />
      </section>
    </>
  );
};

export default Profile;
