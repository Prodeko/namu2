"use client";

import { ClientProduct } from "@/common/types";
import { EditProductForm } from "@/components/ui/EditProductForm";

import { Modal } from "../Modal";
import { createModalFlow } from "../modalSystem";

type EditProductProps = Record<string, unknown> & { product: ClientProduct };

export const EditProductFlow = createModalFlow<EditProductProps, void>(
  ({ product }) => (
    <Modal>
      <Modal.Page title="Edit product">
        <EditProductForm product={product} />
      </Modal.Page>
    </Modal>
  ),
);
