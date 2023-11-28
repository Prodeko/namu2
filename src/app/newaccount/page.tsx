import { HiLockClosed } from "react-icons/hi"
import { HiOutlineUserAdd } from "react-icons/hi"

import { BottomCard } from "@/app/_components/ui/BottomCard"
import { Button } from "@/app/_components/ui/Button"
import { Header } from "@/app/_components/ui/Header"
import { Input } from "@/app/_components/ui/Input"
import { Logo } from "@/app/_components/ui/Logo"

const Shop = () => {
  return (
    <main className="h-min-screen flex flex-col justify-between bg-pink-200">
      <Header
        LeftComponent={<Logo path="/" />}
        RightComponent={
          <Button text="Admin" intent="admin" Icon={HiLockClosed} />
        }
      />
      <BottomCard>
        <h2 className="text-4xl font-bold text-gray-700">
          Create a New Account
        </h2>
        <div className="flex w-full flex-col gap-5 py-1">
          <Input labelText="First name" placeholderText="Matti" />
          <Input labelText="Last name" placeholderText="Meikäläinen" />
          <Input labelText="Username" placeholderText="matti.meikäläinen" />
          <Input
            labelText="New PIN (minimum 4 digits)"
            placeholderText="1234"
          />
          <Input labelText="Retype the PIN" placeholderText="1234" />
        </div>
        <Button text="Create account" Icon={HiOutlineUserAdd} fullwidth />
      </BottomCard>
    </main>
  )
}

export default Shop
