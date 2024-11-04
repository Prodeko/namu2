"use client";

import {
  Children,
  ComponentPropsWithRef,
  createRef,
  useRef,
  useState,
} from "react";
import {
  CropperRef,
  FixedCropper,
  FixedCropperRef,
  ImageRestriction,
} from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiOutlinePlusCircle } from "react-icons/hi";

import { getBlobUrlByName } from "@/common/blobServiceUtils";
import { uploadProductImageAction } from "@/server/actions/admin/uploadProductImage";

import { AnimatedPopup } from "./AnimatedPopup";
import { FatButton } from "./Buttons/FatButton";

interface Props extends ComponentPropsWithRef<"input"> {
  defaultValue?: string;
}

export const ImageUpload = ({ defaultValue, ...props }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    defaultValue ||
      "https://namukilke.blob.core.windows.net/staging/namu-default.jpg",
  );

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file) {
      setIsUploading(true);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files ? e.target.files[0] : null;
    if (file) {
      handleFileUpload(file);
    }
  };

  const defaultState = (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div onClick={handleClick}>
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

  const cropperRef = useRef<FixedCropperRef>(null);

  const onCropConfirm = () => {
    const cropper = cropperRef.current;
    if (cropper) {
      const canvas = cropper.getCanvas();
      if (!canvas) return;
      canvas.toBlob((blob) => {
        const file = new File([blob as Blob], "namu-upload.jpg", {
          type: "image/jpeg",
        });
        handleFileUpload(file);
      }, "image/jpeg");
    }
  };

  const uploadedState = (
    <AnimatedPopup
      TriggerComponent={
        <img src={imageUrl} alt="product img" className="w-64 rounded-2xl" />
      }
    >
      <div className="flex h-fit w-[50vw] flex-col gap-4 px-6 py-8">
        <FixedCropper
          className="rounded-2xl"
          src={imageUrl}
          ref={cropperRef}
          stencilProps={{
            handlers: false,
            lines: false,
            movable: false,
            resizable: false,
          }}
          stencilSize={{
            width: 450,
            height: 300,
          }}
          imageRestriction={ImageRestriction.stencil}
        />
        <div className="flex gap-4">
          <FatButton
            buttonType="button"
            text="Change image"
            intent="secondary"
            onClick={handleClick}
          />
          <FatButton
            buttonType="button"
            text="Crop"
            intent="primary"
            onClick={onCropConfirm}
          />
        </div>
      </div>
    </AnimatedPopup>
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
      {!isUploading && imageUrl && uploadedState}
    </div>
  );
};
