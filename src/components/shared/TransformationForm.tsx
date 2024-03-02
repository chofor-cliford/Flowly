import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  aspectRatioOptions,
  creditFee,
  defaultValues,
  formSchema,
  transformationTypes,
} from "@/constants";
import { TransformationFormProps, Transformations } from "@/types";
import { CustomField } from "./CustomField";
import { useEffect, useState, useTransition } from "react";
import {
  AspectRatioKey,
  applyBackgroundRemovalTransformation,
  applyFillTransformation,
  applyGenerativeRecolorTransformation,
  applyGenerativeRemoveTransformation,
  applyGenerativeRestoreTransformation,
  cld,
  debounce,
  deepMergeObjects,
} from "@/lib/utils";
import { Button } from "../ui/button";
import MediaUploader from "./MediaUploader";
import TransformedImage from "./TransformedImage";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { InsufficientCreditsModal } from "./InsufficientCreditsModal";

const TransformationForm = ({
  action,
  data = null,
  userId,
  type,
  creditBalance,
  config = null,
}: TransformationFormProps) => {
  const transformationType = transformationTypes[type];
  const [image, setImage] = useState(data);
  const [newTransformation, setNewTransformation] =
    useState<Transformations | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformationConfig, setTransformationConfig] = useState(config);
  const [myUrl, setMyUrl] = useState(data?.transformationUrl);
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();

  const initialValues =
    data && action === "Update"
      ? {
          title: data?.title,
          aspectRatio: data?.aspectRatio,
          color: data?.color,
          prompt: data?.prompt,
          publicId: data?.publicId,
        }
      : defaultValues;

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    if (data || image) {
      const transformationUrl = myUrl;

      const imageData = {
        title: values.title,
        publicId: image?.publicId,
        transformationType: type,
        width: image?.width,
        height: image?.height,
        config: transformationConfig,
        secureURL: image?.secureURL,
        transformationUrl,
        aspectRatio: values.aspectRatio,
        prompt: values.prompt,
        color: values.color,
      };

      if (action === "Add") {
        try {
          const { data: newImage } = await axios.post(
            `http://localhost:8080/api/v1/addImage/:userId?userId=${userId}`,
            { image: imageData }
          );

          if (newImage) {
            form.reset();
            setImage(data);

            navigate(`/transformations/${newImage._id}`);
          }
        } catch (error) {
          console.log(error);
        }
      }

      if (action === "Update") {
        try {
          const { data: updatedImage } = await axios.put(
            `http://localhost:8080/api/v1/updateImage/:userId?userId=${userId}`,
            { image: { ...imageData, _id: data?._id } }
          );

          if (updatedImage) {
            navigate(`/transformations/${updatedImage._id}`);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    setIsSubmitting(false);
  };

  const onSelectFieldHandler = (
    value: string,
    onChangeField: (value: string) => void
  ) => {
    const imageSize = aspectRatioOptions[value as AspectRatioKey];

    setImage((prevState: any) => ({
      ...prevState,
      aspectRatio: imageSize.aspectRatio,
      width: imageSize.width,
      height: imageSize.height,
    }));

    setNewTransformation(transformationType.config);

    return onChangeField(value);
  };

  const onInputChangeHandler = (
    fieldName: string,
    value: string,
    type: string,
    onChangeField: (value: string) => void
  ) => {
    debounce(() => {
      setNewTransformation((prevState: any) => ({
        ...prevState,
        [type]: {
          ...prevState?.[type],
        },
        [fieldName === "prompt" ? "prompt" : "to"]: value,
      }));
    }, 1000);

    return onChangeField(value);
  };

  // TODO: Return to update credits

  const onTransformHandler = async () => {
    setIsTransforming(true);
    setTransformationConfig(
      deepMergeObjects(newTransformation, transformationConfig)
    );
    const myImage = cld.image(image?.publicId);

    let url = null;

    switch (type) {
      case "fill":
        url = applyFillTransformation(myImage, image?.width, image?.height);
        break;
      case "removeBackground":
        url = applyBackgroundRemovalTransformation(myImage);
        break;
      case "restore":
        url = applyGenerativeRestoreTransformation(myImage);
        break;
      case "remove":
        url = applyGenerativeRemoveTransformation(
          myImage,
          transformationTypes[type].subTitle
        );
        break;
      case "recolor":
        url = applyGenerativeRecolorTransformation(
          myImage,
          transformationTypes[type].subTitle,
          ""
        );
        break;
      default:
        break;
    }

    if (url) {
      setMyUrl(url);

      // Make API call to update credits
      await axios.put(
        `http://localhost:8080/api/v1/updateCredits/:userId?userId=${userId}`,
        { creditFee }
      );
    }

    setNewTransformation(null);
    setIsTransforming(false);
  };

  useEffect(() => {
    if (image && (type === "restore" || type === "removeBackground")) {
      setNewTransformation(transformationType.config);
    }
  }, [image, transformationType.config, type]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal />}
        <CustomField
          control={form.control}
          name="title"
          formLabel="Image Title"
          className="w-full"
          render={({ field }) => <Input {...field} className="input-field" />}
        />

        {type === "fill" && (
          <CustomField
            control={form.control}
            name="aspectRatio"
            formLabel="Aspect Ratio"
            className="w-full"
            render={({ field }) => (
              <Select
                onValueChange={(value) =>
                  onSelectFieldHandler(value, field.onChange)
                }
                value={field.value}
              >
                <SelectTrigger className="select-field">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(aspectRatioOptions).map((key) => (
                    <SelectItem key={key} value={key} className="select-item">
                      {aspectRatioOptions[key as AspectRatioKey].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}

        {(type === "remove" || type === "recolor") && (
          <div className="prompt-field">
            <CustomField
              control={form.control}
              name="prompt"
              formLabel={
                type === "remove" ? "Object to remove" : "Object to recolor"
              }
              className="w-full"
              render={({ field }) => (
                <Input
                  value={field.value}
                  className="input-field"
                  onChange={(e) =>
                    onInputChangeHandler(
                      "prompt",
                      e.target.value,
                      type,
                      field.onChange
                    )
                  }
                />
              )}
            />

            {type === "recolor" && (
              <CustomField
                control={form.control}
                name="color"
                formLabel="Replacement Color"
                className="w-full"
                render={({ field }) => (
                  <Input
                    value={field.value}
                    className="input-field"
                    onChange={(e) =>
                      onInputChangeHandler(
                        "color",
                        e.target.value,
                        "recolor",
                        field.onChange
                      )
                    }
                  />
                )}
              />
            )}
          </div>
        )}

        <div className="media-uploader-field">
          <CustomField
            control={form.control}
            name="publicId"
            className="flex size-full flex-col"
            render={({ field }) => (
              <MediaUploader
                onValueChange={field.onChange}
                setImage={setImage}
                publicId={field.value}
                image={image}
                type={type}
              />
            )}
          />

          <TransformedImage
            image={image}
            type={type}
            title={form.getValues().title}
            isTransforming={isTransforming}
            setIsTransforming={setIsTransforming}
            transformationConfig={transformationConfig}
            url={myUrl}
          />
        </div>

        <div className="flex flex-col gap-4">
          <Button
            className="submit-button capitalize"
            type="button"
            disabled={isTransforming || newTransformation === null}
            onClick={onTransformHandler}
          >
            {isTransforming ? "Transforming..." : "Apply transformation"}
          </Button>
          <Button
            className="submit-button capitalize"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Save Image"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TransformationForm;
