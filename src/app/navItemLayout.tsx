import Link from "next/link";

type NavItemProps = {
  href: string;
  label: string;
  Icon: React.ComponentType<any>;
  isOpen: boolean;
  pathname: string | null;
  title?: string;
  requiredRoles?: string[]; // si lo usás para condicionar visibilidad
  className?: string;
};
export function NavItem({
  href,
  label,
  Icon,
  isOpen,
  pathname,
  title,
  requiredRoles,
  className = "",
}: NavItemProps) {
  const active = isActivePath(pathname, href);
  const base = "flex items-center p-2 rounded transition";
  const activeClasses = "bg-gray-700 font-semibold";
  const inactiveClasses = "hover:bg-gray-500";
  return (
    <Link
      href={href}
      className={`
        ${base} ${active ? activeClasses : inactiveClasses} ${className}
      `}
      title={!isOpen ? title || label : ""}
      aria-current={active ? "page" : undefined}
    >
      <Icon className="text-lg" />
      {isOpen && <span className="ml-2">{label}</span>}
    </Link>
  );
}


function isActivePath(pathname: string | null, target: string) {
  if (!pathname) return false;
  return pathname === target || pathname.startsWith(target + "/");
}