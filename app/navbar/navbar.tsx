import Link from "next/link";
import LogoutButton from "./components/logout";
import ThemeToggle from "./components/toggletheme";
import { usePathname } from "next/navigation";
import SheetBar from "./components/sheet";

import { Sheet, SheetTrigger } from "../_components/ui/sheet";
import { Button } from "../_components/ui/button";
import { MenuIcon } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const excludedRoutes = ["/login"];
  const isExcluded = excludedRoutes.includes(pathname);

  return (
    <div className="absolute flex w-full items-center justify-between border-b px-4 py-2 shadow-md">
      <div>
        <ThemeToggle />
      </div>

      {!isExcluded && (
        <Sheet>
          <SheetTrigger asChild className="sm:hidden">
            <Button size="icon" variant="outline">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetBar />
        </Sheet>
      )}

      {!isExcluded && (
        <nav className="hidden items-center gap-6 sm:flex">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <Link href="/addperson" className="hover:text-primary">
            Entregador
          </Link>
          <Link href="/delivery" className="hover:text-primary">
            Entregas
          </Link>
          <Link href="/summary" className="hover:text-primary">
            Sumário
          </Link>
          <LogoutButton />
        </nav>
      )}
    </div>
  );
};

export default Navbar;
