import { Button } from "@/components/ui/button/button";
import Link from "next/link";

interface HeaderProps {
  title: string;
  href?: string;
  ctaText?: string;
  children?: React.ReactNode;
}

export const Header = (props: HeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start md:items-center justify-between gap-2">
      <h2 className="text-3xl font-bold tracking-tight">{props.title}</h2>
      <div className="w-full sm:w-auto">
        {props.children ? (
          props.children
        ) : props.href && props.ctaText ? (
          <Link href={props.href} className="w-full sm:w-auto">
            <Button className="w-full">{props.ctaText}</Button>
          </Link>
        ) : null}
      </div>
    </div>
  );
};
