"use client";

import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
} from "react";

/**
 * Shared image state for the edit-product flow. Lives in the flow body so that
 * the details page and the crop page (sibling `Modal.Page`s) can read and
 * update the same image. Provided above `<Modal>`, so it reaches the page
 * contents through React context.
 */
export interface EditProductImage {
  /** Committed product image — fed to the form's hidden `imageFilePath` input. */
  imageUrl: string;
  setImageUrl: Dispatch<SetStateAction<string>>;
  /** Raw uploaded image awaiting crop on the crop page. */
  cropSrc: string;
  setCropSrc: Dispatch<SetStateAction<string>>;
  isUploading: boolean;
  setIsUploading: Dispatch<SetStateAction<boolean>>;
}

export const EditProductImageContext = createContext<EditProductImage | null>(
  null,
);

export const useEditProductImage = (): EditProductImage => {
  const ctx = useContext(EditProductImageContext);
  if (!ctx) {
    throw new Error(
      "useEditProductImage must be used within an EditProductFlow",
    );
  }
  return ctx;
};
