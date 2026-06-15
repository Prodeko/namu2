"use client";

import { ComponentPropsWithRef, useRef } from "react";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiOutlinePlusCircle } from "react-icons/hi";

import { getBlobUrlByName } from "@/common/blobServiceUtils";
import { uploadProductImageAction } from "@/server/actions/admin/uploadProductImage";

import { useModalNav } from "./modal/ModalNavContext";
import { useEditProductImage } from "./modal/flows/editProductImageContext";

//https://namukilke.blob.core.windows.net/staging/namu-default.jpg
type Props = ComponentPropsWithRef<"input">;

export const ImageUpload = (props: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const nav = useModalNav();
  const { imageUrl, isUploading, setIsUploading, setCropSrc } =
    useEditProductImage();

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files ? e.target.files[0] : null;
    if (!file) return;

    setIsUploading(true);
    const data = new FormData();
    data.append("file", file);
    const result = await uploadProductImageAction(data);
    setIsUploading(false);
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    if (!result?.blobName) return;

    setCropSrc(getBlobUrlByName(result.blobName));
    nav.goTo("crop");
  };

  const openCropForCurrent = () => {
    if (!imageUrl) return;
    setCropSrc(imageUrl);
    nav.goTo("crop");
  };

  const defaultState = (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div className="flex flex-col items-center" onClick={handleClick}>
      <HiOutlinePlusCircle className="text-6xl text-primary-400" />
      <p className="text-2xl text-neutral-700 ">Add image</p>
    </div>
  );

  const uploadingState = (
    <>
      <span className="animate-spin">
        <AiOutlineLoading3Quarters className="text-6xl text-primary-400" />
      </span>
      <p className="text-2xl text-neutral-700 ">Uploading</p>
    </>
  );

  return (
    <div
      onChange={handleInputChange}
      className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl bg-white py-10 shadow-sm portrait:w-full landscape:max-w-[20rem] "
    >
      <input type="file" className="hidden" ref={inputRef} />
      <input type="hidden" value={imageUrl} name={props.name} />
      {!isUploading && !imageUrl && defaultState}
      {isUploading && uploadingState}
      {!isUploading && imageUrl && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <img
          src={imageUrl}
          onClick={openCropForCurrent}
          alt="product img"
          className="w-64 rounded-2xl"
        />
      )}
    </div>
  );
};
