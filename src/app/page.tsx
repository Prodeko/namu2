import { HiLockClosed, HiLogin } from "react-icons/hi"

import { BottomCard } from "@/app/_components/ui/BottomCard"
import { Button } from "@/app/_components/ui/Button"
import { Header } from "@/app/_components/ui/Header"
import { Input } from "@/app/_components/ui/Input"

import { HeroSection } from "./HeroSection"

const Home = () => {
  return (
    <main className="min-h-screen flex flex-col bg-pink-200">
      <Header
        RightComponent={
          <Button text="Admin" Icon={HiLockClosed} intent="admin" />
        }
      />
      <HeroSection />
      <BottomCard>
        <h2 className="text-4xl font-bold text-gray-700">
          Login to Your Account
        </h2>
        <div className="flex w-full flex-col gap-6">
          <Input placeholderText={"Namu ID"} />
          <Input type="number" placeholderText={"PIN"} />
          <Button text="Login" Icon={HiLogin} />
        </div>
        <div className="flex w-full gap-2 ">
          <span className="text-gray-500">{"Don't have an account?"}</span>
          <a href="new-account" className="text-pink-300">
            Sign up
          </a>
        </div>
      </BottomCard>
    </main>
  )
}

export default Home
