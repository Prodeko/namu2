"use client";

import { useRef } from "react";
import { HiOutlinePhotograph } from "react-icons/hi";
import {
  FixedCropper,
  FixedCropperRef,
  ImageRestriction,
} from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import toast from "react-hot-toast";

import { getBlobUrlByName } from "@/common/blobServiceUtils";
import { uploadProductImageAction } from "@/server/actions/admin/uploadProductImage";

import { Modal } from "../Modal";
import { useModalNav } from "../ModalNavContext";
import { useEditProductImage } from "./editProductImageContext";

export const CropPage = () => {
  const nav = useModalNav();
  const { cropSrc, setImageUrl } = useEditProductImage();
  const cropperRef = useRef<FixedCropperRef>(null);

  if (!cropSrc) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <HiOutlinePhotograph className="text-7xl text-primary-400" />
          <p className="max-w-sm text-xl text-neutral-700">
            No image to crop. Go back and add an image first.
          </p>
        </div>
        <Modal.Actions>
          <Modal.ActionButton
            text="Back"
            intent="secondary"
            onClick={(nav) => nav.goTo("details")}
          />
        </Modal.Actions>
      </div>
    );
  }

  const handleAccept = async () => {
    const canvas = cropperRef.current?.getCanvas();
    if (!canvas) return;

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg"),
    );
    if (!blob) return;

    const data = new FormData();
    data.append("file", new File([blob], "namu-upload.jpg", { type: "image/jpeg" }));
    const result = await uploadProductImageAction(data);
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    if (result?.blobName) {
      setImageUrl(getBlobUrlByName(result.blobName));
    }
    nav.goTo("details");
  };

  return (
    <div className="flex flex-col gap-6">
      <FixedCropper
        className="rounded-2xl"
        src={cropSrc}
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
      <Modal.Actions>
        <Modal.ActionButton
          text="Cancel"
          intent="secondary"
          onClick={(nav) => nav.goTo("details")}
        />
        <Modal.ActionButton text="Accept" onClick={handleAccept} />
      </Modal.Actions>
    </div>
  );
};
