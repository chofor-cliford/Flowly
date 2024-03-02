import { dataUrl, download, getImageSize } from "@/lib/utils";
import { TransformedImageProps } from "@/types";
import { useEffect } from "react";

const TransformedImage = ({
  image,
  type,
  title,
  isTransforming,
  setIsTransforming,
  transformationConfig,
  hasDownload = false,
  url,
}: TransformedImageProps) => {
  const downloadHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    download(url, image?.title);
  };
  
  useEffect(() => {
    console.log("Hey!, Work still need to be done in TransformedImage and api from cloudinary");

  }, [url, isTransforming, image])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex-between">
        <h3 className="h3-bold text-dark-600">Transformed</h3>

        {hasDownload && (
          <button className="download-btn" onClick={downloadHandler}>
            <img
              src="/assets/icons/download.svg"
              alt="Download"
              width={24}
              height={24}
              className="pb-[6px]"
            />
          </button>
        )}
      </div>

      {image?.publicId && transformationConfig ? (
        <div className="relative">
          {isTransforming && (
            <div className="transforming-loader">
              <img
                src={dataUrl}
                width={50}
                height={200}
                alt="loader"
                className="transformed-image"
              />
            </div>
          )}
          <img
            width={getImageSize(type, image, "width")}
            height={getImageSize(type, image, "height")}
            src={url}
            alt={image.title || "transformed image"}
            className="transformed-image"
            style={{ maxWidth: "766px" }}
          />
        </div>
      ) : (
        <div className="transformed-placeholder">Transformed Image</div>
      )}
    </div>
  );
};

export default TransformedImage;
