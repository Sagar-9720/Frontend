// src/components/Banner.tsx
import React from "react";

type BannerProps = {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  backgroundImageUrl: string;
  filters: Array<{
    label: string;
    options: string[];
  }>;
};

export default function Banner({
  title,
  subtitle,
  searchPlaceholder,
  backgroundImageUrl,
  filters,
}: BannerProps) {
  return (
    <section
      className="relative h-[60vh] bg-cover bg-center flex flex-col items-center justify-center text-white"
      style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
    >
      <div className="bg-black/40 w-full h-full absolute top-0 left-0"></div>

      <div className="relative text-center z-10">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="mt-2">{subtitle}</p>

        {/* Search Bar */}
        <div className="flex justify-center mt-6">
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="px-4 py-2 w-96 rounded-l-lg border outline-none text-black"
          />
          <button className="px-4 py-2 bg-blue-600 rounded-r-lg text-white">
            🔍
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mt-4 justify-center">
          {filters.map((filter, idx) => (
            <select
              key={filter.label + idx}
              className="px-4 py-2 rounded-lg text-black"
            >
              <option>{filter.label}</option>
              {filter.options.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          ))}
        </div>
      </div>
    </section>
  );
}
