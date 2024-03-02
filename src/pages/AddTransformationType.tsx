import Header from "@/components/shared/Header";
import TransformationForm from "@/components/shared/TransformationForm";
import { transformationTypes } from "@/constants";
import { IUser, TransformationTypeKey } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AddTransformationType = () => {
  const { type } = useParams();
  const { userId } = useAuth();
  // @ts-ignore: Ignore this specific error
  const transformation = transformationTypes[type];
  const [user, setUser] = useState<IUser>();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await axios.get(`
  http://localhost:8080/api/v1/getUserById/:userId?userId=${userId}`);

      setUser(data);
    };
    fetchUser();
  }, [userId]);
  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />

      <section className="mt-10">
        <TransformationForm
          action="Add"
          userId={user?._id}
          type={transformation.type as TransformationTypeKey}
          creditBalance={user?.creditBalance}
        />
      </section>
    </>
  );
};

export default AddTransformationType;
