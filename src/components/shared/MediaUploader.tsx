import { cld, getImageSize } from "@/lib/utils";
import { useToast } from "../ui/use-toast";
import UploadWidget from "./UploadWidget";
import { AdvancedImage, placeholder, responsive } from "@cloudinary/react";

type MediaUploaderProps = {
  onValueChange: (value: string) => void;
  setImage: React.Dispatch<any>;
  publicId: string;
  image: any;
  type: string;
};

const MediaUploader = ({
  onValueChange,
  setImage,
  image,
  publicId,
  type,
}: MediaUploaderProps) => {
  const { toast } = useToast();

  const onUploadSuccessHandler = (result: any) => {
    setImage((prevState: any) => ({
      ...prevState,
      publicId: result?.info?.public_id,
      width: result?.info?.width,
      height: result?.info?.height,
      secureURL: result?.info?.secure_url,
    }));

    onValueChange(result?.info?.public_id);

    toast({
      title: "Image uploaded successfully",
      description: "1 credit was deducted from your account",
      duration: 5000,
      className: "success-toast",
    });
  };

  const onUploadErrorHandler = () => {
    toast({
      title: "Something went wrong while uploading",
      description: "Please try again",
      duration: 5000,
      className: "error-toast",
    });
  };

  const handleOnUpload = (error, result, widget) => {
    if (error) {
      onUploadErrorHandler();
      widget.close({
        quiet: true,
      });
      return;
    }
    onUploadSuccessHandler(result);
  };

  return (
    <UploadWidget onUpload={handleOnUpload}>
      {({ open }: any) => {
        function handleOnClick(e) {
          e.preventDefault();
          open();
        }
        return (
          <div className="flex flex-col gap-4">
            <h3 className="h3-bold text-dark-600">Original</h3>

            {publicId ? (
              <>
                <div className="cursor-pointer overflow-hidden rounded-[10px]">
                  <AdvancedImage
                    width={getImageSize(type, image, "width")}
                    height={getImageSize(type, image, "height")}
                    cldImg={cld.image(publicId)}
                    alt="image"
                    className="media-uploader_cldImage"
                    style={{ maxWidth: "100%"}}
                    plugins={[
                      placeholder({ mode: "blur" }),
                      responsive({ steps: [800, 1000, 1400] }),
                    ]}
                  />
                </div>
              </>
            ) : (
              <div className="media-uploader_cta" onClick={handleOnClick}>
                <div className="media-uploader_cta-image">
                  <img
                    src="/assets/icons/add.svg"
                    alt="Add Image"
                    width={24}
                    height={24}
                  />
                </div>
                <p className="p-14-medium">Click here to upload image</p>
              </div>
            )}
          </div>
        );
      }}
    </UploadWidget>
  );
};

export default MediaUploader;
