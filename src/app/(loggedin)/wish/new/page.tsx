"use client";

import { useState } from "react";
import { HiSparkles } from "react-icons/hi2";

import { FatButton } from "@/components/ui/Buttons/FatButton";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { createWish } from "@/server/db/utils/wish";

const NewWish = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [webUrl, setWebUrl] = useState("");

  const handleSubmit = () => {
    const url = webUrl === "" ? undefined : webUrl;
    // Url buginen, pitää lisätä https:// eteen jos ei ole
    createWish(title, description, url);
  };
  return (
    <div className="flex min-h-0 w-full max-w-screen-lg flex-1 flex-col gap-4 bg-white p-12">
      <form className="flex grow flex-col gap-8">
        <div className="flex h-full grow flex-col gap-3">
          <Input
            placeholderText="Jaffakeksit"
            type="text"
            name="title"
            labelText="Title*"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextArea
            labelText="Detailed information*"
            placeholderText="Give Namu CEO all the relevant information about the product"
            name="details"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            labelText="Web URL (optional)"
            placeholderText="www.prisma.fi/jaffakeksit"
            type="url"
            name="url"
            value={webUrl}
            onChange={(e) => setWebUrl(e.target.value)}
          />
        </div>
        <div className="flex justify-between gap-4">
          <FatButton
            buttonType="a"
            href="/wish"
            text="Cancel"
            intent="tertiary"
            type="submit"
            fullwidth
          />
          <FatButton
            buttonType="a"
            href="/wish"
            text="Make a wish"
            intent="primary"
            RightIcon={HiSparkles}
            type="submit"
            fullwidth
            onClick={handleSubmit}
          />
        </div>
      </form>
    </div>
  );
};

export default NewWish;
