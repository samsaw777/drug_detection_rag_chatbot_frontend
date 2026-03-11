import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 px-6 py-4 flex items-center justify-between shadow-md">
        {/* Left - Logo and App Name */}
        <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs">
                DR
            </div>
            <span className="text-white text-xl font-bold tracking-tight">DrugRAG</span>
        </Link>

        {/* Right - Nav Links */}
        <div className="flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
            Home
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
            About Us
            </Link>
        </div>
    </nav>
  );
}