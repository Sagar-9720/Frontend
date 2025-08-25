// src/components/Navbar.tsx
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center px-8 py-4 shadow-md bg-white">
      <h1 className="text-2xl font-bold text-blue-700">TRAVEL</h1>
      <ul className="flex gap-6 text-gray-700">
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#">Destinations</a>
        </li>
        <li>
          <a href="#">Trips</a>
        </li>
        <li>
          <a href="#">Travel Journal</a>
        </li>
        <li>
          <a href="#">About</a>
        </li>

        {/* Profile with Dropdown */}
        <li className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1"
          >
            Profile <ChevronDown size={16} />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
              <a className="block px-4 py-2 hover:bg-gray-100" href="#">
                Profile Settings
              </a>
              <a className="block px-4 py-2 hover:bg-gray-100" href="#">
                Logout
              </a>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}
