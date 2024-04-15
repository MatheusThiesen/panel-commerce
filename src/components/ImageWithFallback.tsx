"use client";

import { defaultNoImage } from "@/global/parameters";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface Props extends ImageProps {
  fallbackSrc?: string;
}

const ImageWithFallback = (props: Props) => {
  const {
    src,
    fallbackSrc = defaultNoImage,
    height = 80,
    width = 80,
    alt,
    ...rest
  } = props;
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      width={width}
      height={height}
      alt={alt}
      src={imgSrc}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
      {...rest}
    />
  );
};

export { ImageWithFallback };
