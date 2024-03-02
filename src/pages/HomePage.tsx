/* eslint-disable @typescript-eslint/no-explicit-any */
import { Collection } from "@/components/shared/Collection";
import { navLinks } from "@/constants";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const HomePage = () => {
  // Extracting route parameters
  const [pathParams] = useSearchParams();
  const page = Number(pathParams.get("page")) || 1;

  // Extracting query parameters
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [images, setImages] = useState({}) as any;

  useEffect(() => {
    const getAllImages = async () => {
      const params = { searchQuery: searchQuery, limit: 9, page: page };
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/v1/getAllImages`,
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
      <section className="home">
        <h1 className="home-heading">
          Unleash Your Creative Vision with Flowly
        </h1>
        <ul className="flex-center w-full gap-20">
          {navLinks.slice(1, 5).map((link) => (
            <Link
              key={link.route}
              to={link.route}
              className="flex-center flex-col gap-2"
            >
              <li className="flex-center w-fit rounded-full bg-white p-4">
                <img src={link.icon} alt="image" width={24} height={24} />
              </li>
              <p className="p-14-medium text-center text-white">{link.label}</p>
            </Link>
          ))}
        </ul>
      </section>

      <section className="sm:mt-12">
        <Collection
          hasSearch={true}
          images={images?.data}
          totalPages={images?.totalPage}
          page={page}
        />
      </section>
    </>
  );
};

export default HomePage;
