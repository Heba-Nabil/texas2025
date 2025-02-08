import Image, { ImageProps } from "next/image";

export default function NextImage(props: ImageProps) {
  const { src, alt, ...rest } = props;

  return <Image src={src} alt={alt} {...rest} />;
}
