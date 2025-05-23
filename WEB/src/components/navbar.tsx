'use client';

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";


interface NavbarProps {
  active: "Dashboard" | "Planos" | "Login";
}

export default function Navbar({ active }: NavbarProps) {
  const { isAuthenticated, logout } = useAuth();
  const activeClass = "border-b-2 border-green-600 pb-4";

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/plans", label: "Planos" },
  ];

  return (
    <nav className="flex px-6 pt-6 pb-4 justify-between items-center bg-slate-900">
      <h1 className="text-4xl font-bold text-white mb-4">Gyma</h1>

      <ul className="hidden md:flex gap-6 text-xl text-white">
        {links.map(({ href, label }) => (
          <li key={href} className={label === active ? activeClass : ""}>
            <Link href={href}>{label}</Link>
          </li>
        ))}
        {!isAuthenticated && (
          <li className={active === "Login" ? activeClass : ""}>
            <Link href="/login">Login</Link>
          </li>
        )}
        {isAuthenticated && (
          <li>
            <button onClick={logout} className="text-red-500 hover:underline">Logout</button>
          </li>
        )}
      </ul>

      <img className="size-12 rounded-full hover:scale-105 transition-transform duration-300" src="/imagens/user.png" alt="User Profile" />
    </nav>
  );
}
