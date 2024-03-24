import { Toast } from "react-hot-toast";
import { HiX } from "react-icons/hi";

interface Props {
  t: Toast;
}
export const ErrorToast = ({ t }: Props) => {
  return (
    <div className="pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
      <div className="w-0 flex-1 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 pt-0.5">
            <HiX size={50} className="text-red-400" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-3xl font-medium text-gray-900">Emilia Gates</p>
            <p className="mt-1 text-3xl text-gray-500">
              Sure! 8:30pm works great!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
