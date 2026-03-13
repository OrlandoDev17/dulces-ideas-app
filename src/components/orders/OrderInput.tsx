interface OrderInputProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ComponentType<{ className?: string; fill?: string }>;
  placeholder: string;
  fill?: string;
}

export function OrderInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  fill = "currentColor",
  icon: Icon,
}: OrderInputProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-bold text-primary-700 uppercase tracking-wide">
        {label}
      </span>
      <div className="relative w-full">
        <input
          className="w-full px-4 py-2.5 pl-10 border border-primary-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-gray-500"
          type={type}
          name={name}
          defaultValue={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        <Icon
          {...(fill && { fill })}
          className="size-5 text-primary-500 absolute top-1/2 -translate-y-1/2 left-3"
        />
      </div>
    </label>
  );
}
