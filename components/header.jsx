"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
} from "@nextui-org/react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  FaHome,
  FaHandsHelping,
  FaMotorcycle,
  FaUserCircle,
  FaCoins,
  FaUsers,
  FaEnvelope,
} from "react-icons/fa";
import { FaMoneyBillTrendUp } from "react-icons/fa6";

export default function App() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(); // State for tracking active menu item

  const menuItems = [
    { name: "Home", icon: <FaHome />, path: "/" },
    { name: "Donor", icon: <FaHandsHelping />, path: "/donor" },
    { name: "Rider", icon: <FaMotorcycle />, path: "/rider" },
    { name: "Requester", icon: <FaUserCircle />, path: "/requester" },
    { name: "Invester", icon: <FaMoneyBillTrendUp />, path: "/invester" },
    { name: "Humanity Coin", icon: <FaCoins />, path: "/humanity-coin" },
    { name: "Team Page", icon: <FaUsers />, path: "/team" },
    { name: "Contact Us", icon: <FaEnvelope />, path: "/contact_us" },
  ];

  const handleNavigation = (path, index) => {
    setActiveIndex(index); // Set the active index when a menu item is clicked
    router.push(path);
  };

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <img src="logo.png" alt="Logo" className="h-8 w-8" />
          <p className="font-bold text-inherit ml-1">Nourish Net</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="lg:flex">
          <SignedOut>
            <SignInButton mode="modal" />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              color={activeIndex === index ? "primary" : "foreground"} // Apply primary color to the active item
              className="w-full flex items-center cursor-pointer"
              onClick={() => handleNavigation(item.path, index)}
              size="lg"
            >
              {item.icon}
              <span className="ml-2">{item.name}</span>
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
