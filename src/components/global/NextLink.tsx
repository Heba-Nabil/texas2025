import { Link } from "@/navigation";

export default function NextLink(props: React.ComponentProps<typeof Link>) {
  return (
    <Link
      // scroll={false}
      prefetch={false}
      {...props}
    />
  );
}
