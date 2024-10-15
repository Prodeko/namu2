"use client";

import { ComponentPropsWithRef, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiOutlinePlusCircle } from "react-icons/hi";

import AzureBlobService from "@/common/azureBlobService";
import { clientEnv } from "@/env/client.mjs";
import { uploadProductImageAction } from "@/server/actions/admin/uploadProductImage";

interface Props extends ComponentPropsWithRef<"input"> {
  defaultValue?: string;
}

export const ImageUpload = ({ defaultValue, ...props }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [blobName, setBlobName] = useState("");

  useEffect(() => {
    if (defaultValue) {
      updateImage(defaultValue);
    }
  }, [defaultValue]);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    if (e.target.files?.[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      const data = new FormData();
      data.append("file", file);
      const result = await uploadProductImageAction(data);
      if (result?.error) {
        toast.error(result.error);
      } else if (result?.blobName) {
        updateImage(result.blobName);
      }
      setIsUploading(false);
    }
  };

  const updateImage = async (blobName: string) => {
    setBlobName(blobName);
    const url = await getImageUrl(blobName);
    if (url) setImageUrl(url);
    else toast.error("Failed to get image url");
  };

  const getImageUrl = async (blobName: string) => {
    const sasUrl = clientEnv.NEXT_PUBLIC_CLIENT_AZURE_BLOB_SAS_URL || "";
    const containerName = clientEnv.NEXT_PUBLIC_AZURE_BLOB_CONTAINER_NAME || "";

    if (!sasUrl || !containerName) return "";
    const blobService = new AzureBlobService(sasUrl, containerName);
    const blob = await blobService.getBlob(blobName);
    if (blob) return URL.createObjectURL(blob);

    return "";
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
      <img src={imageUrl} alt="product img" className="w-64 rounded-3xl" />
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
      <input type="hidden" value={blobName} name={props.name} />

      {!isUploading && !imageUrl && defaultState}
      {isUploading && uploadingState}
      {!isUploading && imageUrl && uploadedState}
    </div>
  );
};
