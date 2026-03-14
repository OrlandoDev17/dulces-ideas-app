import Link from "next/link";

interface ButtonProps {
  style: "primary" | "secondary" | "dashed";
  href?: string;
  children: React.ReactNode;
  form?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  size?: "default" | "small";
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
  size = "default",
}: ButtonProps) {
  const commonClasses =
    "flex items-center justify-center gap-2 px-4 py-3 text-base font-bold rounded-xl hover:-translate-y-1 active:scale-95 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

  const sizeClasses =
    size === "default"
      ? "px-4 py-3 text-base font-bold"
      : "px-2 py-1 text-sm font-bold";

  const styleClasses =
    style === "primary"
      ? "bg-primary-600 text-white shadow-lg shadow-primary/20 hover:bg-primary-700 hover:shadow-primary-200 border-2 border-transparent"
      : style === "secondary"
        ? "bg-white border-2 border-zinc-200 text-zinc-600 hover:border-primary hover:text-primary hover:shadow-premium"
        : "bg-primary-50 border-2 border-dashed border-primary-200 text-primary-600 hover:bg-primary-600 hover:text-white hover:border-primary-600 rounded-2xl";

  return href ? (
    <Link
      className={`${commonClasses} ${className} ${styleClasses} ${sizeClasses}`}
      href={href}
    >
      {children}
    </Link>
  ) : (
    <button
      className={`${commonClasses} ${className} ${styleClasses} ${sizeClasses}`}
      onClick={onClick}
      disabled={disabled}
      form={form}
      type={type}
    >
      {children}
    </button>
  );
}
