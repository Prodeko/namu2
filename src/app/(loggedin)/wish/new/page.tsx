import { HiSparkles } from "react-icons/hi2";

import { FatButton } from "@/components/ui/Buttons/FatButton";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";

const NewWish = () => {
  return (
    <div className="flex min-h-0 w-full max-w-screen-lg flex-1 flex-col gap-4 bg-white px-12 py-8 pt-6">
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
  );
};

export default NewWish;
