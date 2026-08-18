"use client";

import { useState } from "react";

import { ClientProduct } from "@/common/types";
import { EditProductForm } from "@/components/ui/EditProductForm";

import { Modal } from "../Modal";
import { createModalFlow } from "../modalSystem";
import { CropPage } from "./CropPage";
import { EditProductImageContext } from "./editProductImageContext";

type EditProductProps = Record<string, unknown> & { product?: ClientProduct };

export const EditProductFlow = createModalFlow<EditProductProps, void>(
  ({ product }) => {
    const [imageUrl, setImageUrl] = useState(product?.imageFilePath ?? "");
    const [cropSrc, setCropSrc] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    return (
      <EditProductImageContext.Provider
        value={{
          imageUrl,
          setImageUrl,
          cropSrc,
          setCropSrc,
          isUploading,
          setIsUploading,
        }}
      >
        <Modal>
          <Modal.Page
            id="details"
            title={product ? "Edit product" : "New product"}
          >
            <EditProductForm product={product} />
          </Modal.Page>
          <Modal.Page id="crop" title="Crop image">
            <CropPage />
          </Modal.Page>
        </Modal>
      </EditProductImageContext.Provider>
    );
  },
);
