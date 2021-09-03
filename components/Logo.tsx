import React from "react";
import Image from "next/image";

const Logo: React.FC = () => {
  return (
    <Image
      src="/capgemini_logo.png"
      layout="responsive"
      priority
      width="1600"
      height="1000"
      alt="Capgemini logo"
    />
  );
};

export default Logo;
