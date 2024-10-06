import { CartProduct, ClientProduct, ReceiptProduct } from "@/common/types";

interface Props {
  show: boolean;
  items?: ReceiptProduct[];
}
export const Receipt = ({ show, items = [] }: Props) => {
  return (
    <div className=" fixed bottom-0 left-[5%] flex w-[90vw] max-w-screen-md flex-col items-center bg-neutral-50 px-24 py-24 font-mono text-3xl text-neutral-700 shadow-lg">
      <p>Namu Oy</p>
      <p>Maarintie 8</p>
      <p>02150 Otaniemi</p>
      <p>Asiakkaan kuitti</p>
      <div className="my-6 w-full border-b-2 border-dashed border-neutral-700" />
      <p>Ostokset</p>

      {items.map((item) => (
        <div className="flex w-full justify-between">
          <p>{item.name}</p>
          <p>
            {item.quantity} x {item.singleItemPrice}
          </p>
          <p>{item.totalPrice}</p>
        </div>
      ))}
      <div className="my-6 w-full border-b-2 border-dashed border-neutral-700" />

      <div className="flex w-full justify-between">
        <p>Yhteensä</p>
        <p>{items.reduce((acc, item) => acc + item.totalPrice, 0)}</p>
      </div>
      <div className="my-6 w-full border-b-2 border-dashed border-neutral-700" />
      <p>Ostettu {items[0]?.purchaseDate.toLocaleString()}</p>
      <p>KIITOS KÄYNNISTÄ</p>
      <p>TERVETULOA UUDELLEEN</p>
      <p>Myyjä: Risto</p>
    </div>
  );
};
