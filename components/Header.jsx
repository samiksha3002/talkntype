"use client";

import React from "react";
import Image from "next/image";

const Header = () => {
  return (
    <header className="w-full py-4 bg-white shadow-md flex justify-center items-center">
      <div className="flex items-center gap-2">
        <Image src="/logop.png" width={70} height={60} />
        <h1 className="text-xl font-semibold text-gray-800"></h1>
      </div>
    </header>
  );
};

export default Header;
