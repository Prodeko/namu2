"use client";

import { useEffect, useState } from "react";

import { Header } from "@/app/_components/ui/Header";
import { Logo } from "@/app/_components/ui/Logo";
import { NavBar } from "@/app/_components/ui/Navbar";
import { ProductCategory } from "@/app/_components/ui/ProductCategory";
import { ShoppingCart } from "@/app/_components/ui/ShoppingCart";
import Slider from "@/app/_components/ui/Slider";
import { type CartProduct, ProductParser } from "@/common/types";
import { useQuery } from "@tanstack/react-query";

import { FeaturedSection } from "./FeaturedSection";
import { ShopNav } from "./ShopNav";

const data: CartProduct[] = [
	{
		id: 1,
		name: "test",
		description: "test_desc",
		category: "drink",
		price: 1,
		stock: 1,
		amount: 1,
	},
	{
		id: 2,
		name: "test2",
		description: "test_desc",
		category: "drink",
		price: 2,
		stock: 2,
		amount: 2,
	},
	{
		id: 3,
		name: "test3",
		description: "test_desc",
		category: "drink",
		price: 3,
		stock: 3,
		amount: 3,
	},
	{
		id: 4,
		name: "test4",
		description: "test_desc",
		category: "drink",
		price: 4,
		stock: 4,
		amount: 4,
	},
	{
		id: 5,
		name: "test5",
		description: "test_desc",
		category: "drink",
		price: 5,
		stock: 5,
		amount: 5,
	},
];

const Shop = () => {
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
		<main className="min-h-screen flex flex-col bg-pink-200">
			<Header
				LeftComponent={<Logo />}
				RightComponent={<NavBar text="Stats" initials="AH" />}
			/>
			<ShopNav />
			<div className="relative flex flex-grow flex-col bg-gray-50 px-12 pt-10 gap-10">
				<FeaturedSection />
				{/* <ShoppingCart cartItems={cartItems} setCartItems={setCartItems} /> */}
				<ProductCategory categoryName="Drinks" items={data} />
				<Slider />
			</div>
		</main>
	);
};

export default Shop;
