interface Props {
  yes: string;
  no: string;
}

export const ConfirmationButton = ({ yes, no }: Props) => {
  return (
    <div className="flex w-full basis-full flex-row space-x-1">
      <button
        type="button"
        className="basis-1/2 rounded-full border-4 border-primary-400 py-2 text-primary-400"
      >
        {no}
      </button>
      <button
        type="button"
        className="basis-1/2 rounded-full border-4 border-primary-400 bg-primary-400 py-2 text-white"
      >
        {yes}
      </button>
    </div>
  );
};
