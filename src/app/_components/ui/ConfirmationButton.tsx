interface Props {
  yes: string;
  no: string;
}

export const ConfirmationButton = ({ yes, no }: Props) => {
  return (
    <div className="flex w-full basis-full flex-row space-x-1">
      <button className="basis-1/2  rounded-full border-4 border-pink-400 py-2 text-pink-400">
        {no}
      </button>
      <button className="basis-1/2 rounded-full border-4 border-pink-400 bg-pink-400 py-2 text-white">
        {yes}
      </button>
    </div>
  );
};
