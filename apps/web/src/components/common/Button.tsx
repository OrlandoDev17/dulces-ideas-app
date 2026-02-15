import Link from "next/link";

interface ButtonProps {
  style: "primary" | "secondary";
  href?: string;
  children: React.ReactNode;
  form?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function Button({
  style = "primary",
  href,
  children,
  form,
  onClick,
  disabled = false,
  className,
}: ButtonProps) {
  const commonClasses =
    "flex items-center justify-center gap-2 px-4 py-3 text-sm 2xl:text-base font-medium rounded-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const styleClasses =
    style === "primary"
      ? "border-2 border-primary text-primary shadow-lg shadow-primary/10 hover:bg-primary hover:text-white hover:shadow-primary/30"
      : "border-2 border-zinc-300 text-zinc-300 hover:bg-zinc-300 hover:text-white hover:shadow-zinc-300/30";

  return href ? (
    <Link
      className={`${commonClasses} ${className} ${styleClasses}`}
      href={href}
    >
      {children}
    </Link>
  ) : (
    <button
      className={`${commonClasses} ${className} ${styleClasses}`}
      onClick={onClick}
      disabled={disabled}
      form={form}
    >
      {children}
    </button>
  );
}
