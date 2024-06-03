import { deleteObject, ref } from "firebase/storage";
import { storage } from "../firebase/init"; // Adjust the path as necessary
import { throwServerError } from "../helpers";

export const deleteImage = async (imagePath: string) => {
  try {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
    console.log("Image deleted successfully");
  } catch (error: any) {
    if (typeof error === "string") throwServerError;
    if (error.message) throwServerError(error.message);
  }
};
