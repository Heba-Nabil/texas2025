import Image, { ImageProps } from "next/image";

export default function NextImage(props: any) {
  const { src , alt, ...rest } = props;

  return <img src={src} alt={alt} {...rest} />;
}
