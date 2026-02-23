import Link from "next/link";

interface ButtonProps {
  style: "primary" | "secondary";
  href?: string;
  children: React.ReactNode;
  form?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export function Button({
  style = "primary",
  href,
  children,
  form,
  onClick,
  disabled = false,
  className,
  type = "button",
}: ButtonProps) {
  const commonClasses =
    "flex items-center justify-center gap-2 px-4 py-3 text-sm 2xl:text-base font-bold rounded-xl hover:-translate-y-1 active:scale-95 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

  const styleClasses =
    style === "primary"
      ? "bg-primary-600 text-white shadow-lg shadow-primary/20 hover:bg-primary-700 hover:shadow-primary-200 border-2 border-transparent"
      : "bg-white border-2 border-zinc-200 text-zinc-600 hover:border-primary hover:text-primary hover:shadow-premium";

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
      type={type}
    >
      {children}
    </button>
  );
}
