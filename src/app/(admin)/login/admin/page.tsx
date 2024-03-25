import { AdminLoginForm } from "./AdminLoginForm";

const Home = () => {
  return (
    <div className="mx-auto flex h-screen w-full max-w-sm flex-col justify-center gap-6 p-16 sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
      <h2 className="text-4xl font-bold text-neutral-700">Admin login</h2>
      <AdminLoginForm />
    </div>
  );
};

export default Home;
