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
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-line px-2 text-center text-sm font-medium text-muted">
        Photo coming
      </div>
    );
  }

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
