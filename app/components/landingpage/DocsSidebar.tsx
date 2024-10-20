import clsx from "clsx";
import { Link, useLocation } from "@remix-run/react";

type NavigationProps = {
  navigation: Array<{
    title: string;
    links: Array<{
      href: string;
      title: string;
    }>;
  }>;
  className?: string;
};

export function DocsSidebar({ navigation, className }: NavigationProps) {
  const location = useLocation();

  return (
    <nav className={clsx("text-base lg:text-sm", className)}>
      <ul role="list" className="space-y-8">
        {navigation.map(section => (
          <li key={section.title}>
            <h2 className="select-none font-display font-bold text-black">
              {section.title}
            </h2>
            <div
              role="list"
              className="mt-2 space-y-2 border-l border-gray-800/20 transition-colors duration-500 hover:border-blue-700 lg:mt-2 lg:space-y-2"
            >
              {section.links.map(link => (
                <div key={link.href} className="relative">
                  <Link
                    prefetch="intent"
                    to={link.href}
                    className={clsx(
                      "inline w-full select-none pl-3.5 font-display",
                      link.href === location.pathname
                        ? "font-semibold text-blue-700"
                        : "text-slate-700 transition hover:text-blue-700",
                    )}
                  >
                    {link.title}
                  </Link>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
}
