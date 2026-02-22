import { Link } from "react-router-dom";

export default function Button({
  to,
  children,
  className = "",
  variant = "primary",
  size = "md",
  ...props
}) {
  const resolved = `btn btn-${variant} btn-${size} ${className}`.trim();
  if (to) {
    return (
      <Link className={resolved} to={to} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button className={resolved} {...props}>
      {children}
    </button>
  );
}
