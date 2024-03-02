/* eslint-disable @typescript-eslint/no-explicit-any */
import Header from "@/components/shared/Header";
import TransformationForm from "@/components/shared/TransformationForm";
import { transformationTypes } from "@/constants";
import { IImage, IUser, TransformationTypeKey } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const TransformationPage = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState<IUser>();
  const [image, setImage] = useState<IImage>();

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
    const getImageById = async () => {
      try {
        const { data }: any = await axios.get(
          `https://flowly.onrender.com/api/v1/getImageById/:imageId?imageId=${id}`
        );

        setImage(data);
      } catch (error) {
        console.log(error);
      }
    };

    getImageById();
  }, [id]);
  if (!image) return null;

  const transformation =
    transformationTypes[image?.transformationType as TransformationTypeKey];

  return (
    <>
      <Header
        title={transformation?.title}
        subtitle={transformation?.subTitle}
      />

      <section className="mt-10">
        <TransformationForm
          action="Update"
          userId={user?._id}
          type={image?.transformationType as TransformationTypeKey}
          creditBalance={user?.creditBalance}
          config={image?.config}
          data={image}
        />
      </section>
    </>
  );
};

export default TransformationPage;
