export function Button({
  className = "",
  variant = "default",
  children,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "bg-cyan-600 text-white hover:bg-cyan-700",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      className={`${base} ${variants[variant] || variants.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
