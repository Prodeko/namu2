"use client";

import { ComponentPropsWithRef, useRef, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiOutlinePlusCircle } from "react-icons/hi";

import { getBlobUrlByName } from "@/common/blobServiceUtils";
import { uploadProductImageAction } from "@/server/actions/admin/uploadProductImage";

interface Props extends ComponentPropsWithRef<"input"> {
  defaultValue?: string;
}

export const ImageUpload = ({ defaultValue, ...props }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(defaultValue || "");

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      const data = new FormData();
      data.append("file", file);
      const result = await uploadProductImageAction(data);
      if (result?.error) {
        toast.error(result.error);
      } else if (result?.blobName) {
        const blobUrl = getBlobUrlByName(result.blobName);
        setImageUrl(blobUrl);
      }
      setIsUploading(false);
    }
  };

  const defaultState = (
    <>
      <HiOutlinePlusCircle className="text-6xl text-primary-400" />
      <p className="text-2xl text-neutral-700 ">Add image</p>
    </>
  );

  const uploadingState = (
    <>
      <span className="animate-spin">
        <AiOutlineLoading3Quarters className="text-6xl text-primary-400" />
      </span>
      <p className="text-2xl text-neutral-700 ">Uploading</p>
    </>
  );

  const uploadedState = (
    <>
      <img src={imageUrl} alt="product img" className="w-64 rounded-2xl" />
    </>
  );

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      onClick={handleClick}
      onChange={handleFileUpload}
      className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl bg-white py-10 shadow-sm portrait:w-full landscape:max-w-[20rem] "
    >
      <input type="file" className="hidden" ref={inputRef} />
      <input type="hidden" value={imageUrl} name={props.name} />
      {!isUploading && !imageUrl && defaultState}
      {isUploading && uploadingState}
      {!isUploading && imageUrl && uploadedState}
    </div>
  );
};
