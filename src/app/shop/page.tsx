"use client";

import { type CartProduct } from "@/common/types";
import { type Section } from "@/common/types";
import { Footer } from "@/components/ui/Footer";
import { Header } from "@/components/ui/Header";
import { Logo } from "@/components/ui/Logo";
import { NavBar } from "@/components/ui/Navbar";
import { ProductCategory } from "@/components/ui/ProductCategory";

import { FeaturedSection } from "./FeaturedSection";
import { ShopNav } from "./ShopNav";

const data: CartProduct[] = [
  {
    id: 1,
    name: "test",
    description:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum  asasasasa",
    category: "drink",
    price: 1,
    stock: 1,
    amount: 1,
  },
  {
    id: 2,
    name: "test2",
    description:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum  asasasasa",
    category: "drink",
    price: 2,
    stock: 2,
    amount: 2,
  },
  {
    id: 3,
    name: "test3",
    description:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum  asasasasa",
    category: "drink",
    price: 3,
    stock: 3,
    amount: 3,
  },
  {
    id: 4,
    name: "test4",
    description:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum  asasasasa",
    category: "drink",
    price: 4,
    stock: 4,
    amount: 4,
  },
  {
    id: 5,
    name: "test5",
    description:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum  asasasasa",
    category: "drink",
    price: 5,
    stock: 5,
    amount: 5,
  },
];

const Shop = () => {
  const featuredSection: Section = {
    id: "section-featured",
    name: "Featured",
  };
  const drinksSection: Section = {
    id: "section-drinks",
    name: "Drinks",
  };
  const snacksSection: Section = {
    id: "section-snacks",
    name: "Snacks",
  };
  const foodSection: Section = {
    id: "section-food",
    name: "Food",
  };
  const sections: Section[] = [
    featuredSection,
    drinksSection,
    snacksSection,
    foodSection,
  ];

  // const { isLoading, isError, error, data } = useQuery({
  //   queryKey: ["getProducts"],
  //   queryFn: () =>
  //     fetch("http://localhost:3000/api/products?populate=image", {
  //       method: "GET",
  //     })
  //       .then((res) => res.json())
  //       .then((res) => ProductParser.parse(res)),
  // })

  // const [cartItems, setCartItems] = useState<CartProduct[]>([])

  // useEffect(() => {
  //   const storedCartItems = localStorage.getItem("cartItems")
  //   if (storedCartItems) {
  //     // Save only ID and amount to local storage and populate the other information later to avoid memory leaks
  //     const parsedItems = JSON.parse(storedCartItems)
  //     const filledCartItems = parsedItems.map((item) => {
  //       if (data) {
  //         const matchingItem = data.data.find(
  //           (product) => product.id === item.id,
  //         )
  //         return {
  //           ...matchingItem.attributes,
  //           id: item.id,
  //           amount: item.amount,
  //           stock: 10, // Arbitrary value for now
  //         }
  //       } else {
  //         return {}
  //       }
  //     })
  //     setCartItems(filledCartItems)
  //   }

  //   //dev setup:

  // setCartItems(data)
  // }, [])

  // useEffect(() => {
  //   if (cartItems.length > 0) {
  //     const storedCartItems = cartItems.map((item) => ({
  //       id: item.id,
  //       amount: item.amount,
  //     }))
  //     localStorage.setItem("cartItems", JSON.stringify(storedCartItems))
  //   } else {
  //     localStorage.removeItem("cartItems")
  //   }
  // }, [cartItems])

  // if (isLoading) return <div>Loading...</div>

  // if (isError && error instanceof Error)
  //   return <div>An error has occurred: {error.message}</div>
  // if (isError) return <div>An unknown error occurred</div>

  return (
    <main className="mh-screen bg-primary-200 relative flex flex-col">
      <Header LeftComponent={<Logo />} RightComponent={<NavBar />} />
      <ShopNav sections={sections} />
      <div className="flex flex-grow flex-col gap-10 bg-neutral-50 pt-10">
        <FeaturedSection section={featuredSection} />
        <ProductCategory section={drinksSection} items={data} />
        <ProductCategory section={snacksSection} items={data} />
        <ProductCategory section={foodSection} items={data} />
      </div>
      <Footer />
    </main>
  );
};

export default Shop;
