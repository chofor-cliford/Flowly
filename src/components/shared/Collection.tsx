import { Link, useNavigate, useSearchParams } from "react-router-dom";

import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { cld } from "@/lib/utils";

import { Button } from "../ui/button";

import { AdvancedImage, lazyload, placeholder } from "@cloudinary/react";
import { IImage, TransformationTypeKey } from "@/types";
import { transformationTypes } from "@/constants";
import { Search } from "./Search";

export const Collection = ({
  hasSearch = false,
  images,
  totalPages = 1,
  page,
}: {
  images: IImage[];
  totalPages?: number;
  page: number;
  hasSearch?: boolean;
}) => {
 const navigate = useNavigate();
 const [, setSearchParams] = useSearchParams();

 // PAGINATION HANDLER
 const onPageChange = (action: string) => {
   const pageValue = action === "next" ? Number(page) + 1 : Number(page) - 1;

   const search = new URLSearchParams();
   search.set("page", pageValue.toString());
   setSearchParams(search);

   navigate(`?page=${pageValue}`);
 };


  return (
    <>
      <div className="collection-heading">
        <h2 className="h2-bold text-dark-600">Recent Edits</h2>
        {hasSearch && <Search />}
      </div>

      {images?.length > 0 ? (
        <ul className="collection-list">
          {images.map((image) => (
            <Card image={image} key={image._id} />
          ))}
        </ul>
      ) : (
        <div className="collection-empty">
          <p className="p-20-semibold">Empty List</p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-10">
          <PaginationContent className="flex w-full">
            <Button
              disabled={Number(page) <= 1}
              className="collection-btn"
              onClick={() => onPageChange("prev")}
            >
              <PaginationPrevious className="hover:bg-transparent hover:text-white" />
            </Button>

            <p className="flex-center p-16-medium w-fit flex-1">
              {page} / {totalPages}
            </p>

            <Button
              className="button w-32 bg-purple-gradient bg-cover text-white"
              onClick={() => onPageChange("next")}
              disabled={Number(page) >= totalPages}
            >
              <PaginationNext className="hover:bg-transparent hover:text-white" />
            </Button>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};

const Card = ({ image }: { image: IImage }) => {
  return (
    <li>
      <Link to={`/transformations/${image._id}`} className="collection-card">
        <AdvancedImage
          cldImg={cld.image(image.publicId)}
          alt={image.title}
          width={image.width}
          height={image.height}
          {...image.config}
          plugins={[lazyload(), placeholder({ mode: "blur" })]}
          className="h-52 w-full rounded-[10px] object-cover"
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
        />
        <div className="flex-between">
          <p className="p-20-semibold mr-3 line-clamp-1 text-dark-600">
            {image.title}
          </p>
          <img
            src={`/assets/icons/${
              transformationTypes[
                image?.transformationType as TransformationTypeKey
              ].icon
            }`}
            alt={image.title}
            width={24}
            height={24}
          />
        </div>
      </Link>
    </li>
  );
};
