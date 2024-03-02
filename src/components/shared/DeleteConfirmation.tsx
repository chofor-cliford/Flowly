import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "../ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTransition } from "react";

export const DeleteConfirmation = ({ imageId }: { imageId: string }) => {
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();

  const handleDeleteImage = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //  @ts-expect-error
    // Ignore error since value might be undefined
    startTransition(async () => {
      const { data } = await axios.delete(
        `https://flowly.onrender.com/api/v1/deleteImage/:imageId?imageId=${imageId}`
      );

      if (data) {
        navigate("/");
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className="w-full rounded-full">
        <Button
          type="button"
          className="button h-[44px] w-full md:h-[54px]"
          variant="destructive"
        >
          Delete Image
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="flex flex-col gap-10">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this image?
          </AlertDialogTitle>
          <AlertDialogDescription className="p-16-regular">
            This will permanently delete this image
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="border bg-red-500 text-white hover:bg-red-600"
            onClick={handleDeleteImage}
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
