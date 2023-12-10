import { HiSparkles } from "react-icons/hi2";

import { FatButton } from "@/components/ui/Buttons/FatButton";
import { Input } from "@/components/ui/Input";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { TextArea } from "@/components/ui/TextArea";

const NewWish = () => {
  return (
    <div className="flex h-full flex-grow flex-col">
      <div className="inline-flex flex-col items-center justify-center gap-3 bg-blue-200 px-40 py-40">
        <SectionTitle
          title="Something missing from our catalog?"
          className="text-4xl font-bold text-primary-600"
        />
        <p className="inline-flex text-center text-2xl">
          Don&apos;t worry, Namu CEO is here for you! Just drop your wishes in
          the following form and you might find the product in our shelves in
          the upcoming weeks. 😎
        </p>
      </div>
      <div className="flex h-full flex-grow flex-col gap-8 bg-white px-12 py-8">
        <form className="flex grow flex-col gap-8">
          <div className="flex h-full grow flex-col gap-3">
            <Input
              placeholderText="Jaffakeksit"
              type="text"
              name="title"
              labelText="Title*"
            />
            <TextArea
              labelText="Detailed information*"
              placeholderText="Give Namu CEO all the relevant information about the product"
              name="details"
            />
            <Input
              labelText="Web URL (optional)"
              placeholderText="www.prisma.fi/jaffakeksit"
              type="url"
              name="url"
            />
          </div>
          <FatButton
            buttonType="a"
            href="/wish"
            text="Make a wish"
            intent="primary"
            RightIcon={HiSparkles}
            type="submit"
          />
        </form>
      </div>
    </div>
  );
};

export default NewWish;
