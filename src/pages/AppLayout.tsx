import { NavLink, Outlet } from "react-router-dom";

import { buttonVariants } from "@/features/shared/components/ui/button";
import { cn } from "@/features/shared/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Budget", end: true },
  { to: "/roadmap", label: "Feuille de route", end: false },
  { to: "/historique", label: "Historique", end: false },
  { to: "/profil", label: "Profil", end: false },
];

export function AppLayout() {
  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-4 p-4">
      <header className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            家計簿
          </p>

          <h1 className="text-xl font-bold">Kakeibo</h1>
        </div>

        <nav className="flex gap-1.5">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  buttonVariants({
                    variant: isActive ? "default" : "ghost",
                    size: "sm",
                  }),
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
