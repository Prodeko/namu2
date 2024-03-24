import { AdminLoginForm } from "./AdminLoginForm";

const Home = () => {
  return (
    <div className="md:px-18 flex h-full w-full flex-1 items-center justify-center px-20 lg:px-36">
      <div className="flex w-full max-w-screen-md flex-col gap-8">
        <h2 className="text-4xl font-bold text-neutral-700">Admin login</h2>
        <AdminLoginForm />
      </div>
    </div>
  );
};

export default Home;
