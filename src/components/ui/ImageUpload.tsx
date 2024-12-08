"use client";

import {
  ComponentPropsWithRef,
  useRef,
  useState,
} from "react";
import {
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

import { AnimatedPopup, PopupRefActions } from "./AnimatedPopup";
import { ThinButton } from "./Buttons/ThinButton";

//https://namukilke.blob.core.windows.net/staging/namu-default.jpg
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

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files ? e.target.files[0] : null;
    if (file) {
      await handleFileUpload(file);
      popupRef.current?.openContainer();
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
      popupRef.current?.closeContainer();
    }
  };

  const uploadedState = (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <img
      src={imageUrl}
      onClick={() => popupRef.current?.openContainer()}
      alt="product img"
      className="w-64 rounded-2xl"
    />
  );

  const popupRef = useRef<PopupRefActions>(null);
  const imageCropper = (
    <AnimatedPopup ref={popupRef} TriggerComponent={<span />}>
      <div className="flex h-fit w-full flex-col gap-6 px-6 py-8">
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
        <div className="flex w-full gap-4">
          <ThinButton
            buttonType="button"
            text="Change image"
            intent="secondary"
            onClick={handleClick}
          />
          <ThinButton
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
      {imageCropper}
    </div>
  );
};
