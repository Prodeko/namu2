import { HiLogin, HiOutlineUserAdd } from "react-icons/hi";

import { BottomCard } from "@/components/ui/BottomCard";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { ThinButton } from "@/components/ui/Buttons/ThinButton";
import { Input } from "@/components/ui/Input";

const Home = () => {
  return (
    <div className="md:px-18 flex h-full w-full flex-1 items-center justify-center px-20 lg:px-36">
      <div className="flex w-full max-w-screen-md flex-col gap-8">
        <h2 className="text-4xl font-bold text-neutral-700">Admin login</h2>
        <div className="flex w-full flex-col gap-6">
          <Input placeholderText={"Namu ID"} />
          <Input type="number" placeholderText={"PIN"} />
          <FatButton
            buttonType="a"
            href="/admin/restock"
            text="Login"
            intent="primary"
            RightIcon={HiLogin}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
