import Image from "next/image";

export function PersonPhoto({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={1000}
      priority={priority}
      className="h-full w-full object-cover object-top"
    />
  );
}
