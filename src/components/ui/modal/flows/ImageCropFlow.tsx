"use client";

import { useRef } from "react";
import {
  FixedCropper,
  FixedCropperRef,
  ImageRestriction,
} from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";

import { Modal } from "../Modal";
import { useModalNav } from "../ModalNavContext";
import { createModalFlow } from "../modalSystem";

type ImageCropProps = Record<string, unknown> & {
  imageUrl: string;
  onChangeImage: () => void;
};

const CropContent = ({ imageUrl, onChangeImage }: ImageCropProps) => {
  const nav = useModalNav<Blob>();
  const cropperRef = useRef<FixedCropperRef>(null);

  const handleCrop = (): Promise<void> =>
    new Promise((resolve) => {
      const canvas = cropperRef.current?.getCanvas();
      if (!canvas) {
        resolve();
        return;
      }
      canvas.toBlob((blob) => {
        if (blob) nav.resolve(blob);
        resolve();
      }, "image/jpeg");
    });

  return (
    <div className="flex flex-col gap-6">
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
      <Modal.Actions>
        <Modal.ActionButton
          text="Change image"
          intent="secondary"
          onClick={(nav) => {
            onChangeImage();
            nav.close();
          }}
        />
        <Modal.ActionButton text="Crop" onClick={handleCrop} />
      </Modal.Actions>
    </div>
  );
};

export const ImageCropFlow = createModalFlow<ImageCropProps, Blob>(
  ({ imageUrl, onChangeImage }) => (
    <Modal>
      <Modal.Page title="Crop image">
        <CropContent imageUrl={imageUrl} onChangeImage={onChangeImage} />
      </Modal.Page>
    </Modal>
  ),
);
