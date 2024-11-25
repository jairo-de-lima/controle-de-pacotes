import { Button } from "@/app/_components/ui/button";
import {
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@/app/_components/ui/sheet";
import {
  BookUser,
  ChartNoAxesCombined,
  FileStackIcon,
  PackageCheck,
} from "lucide-react";
import Link from "next/link";
import LogoutButton from "./logout";

const SheetBar = () => {
  return (
    <SheetContent className="flex flex-col overflow-y-auto">
      <SheetTitle>Menu</SheetTitle>

      <div className="flex flex-col gap-4 border-b border-solid py-5">
        <SheetClose asChild>
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/">
              <ChartNoAxesCombined size={20} />
              Inicio
            </Link>
          </Button>
        </SheetClose>

        <SheetClose asChild>
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/addperson">
              <BookUser size={20} />
              Entregador
            </Link>
          </Button>
        </SheetClose>

        <SheetClose asChild>
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/delivery">
              <PackageCheck size={20} />
              Entregas
            </Link>
          </Button>
        </SheetClose>

        <SheetClose asChild>
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/summary">
              <FileStackIcon size={20} />
              Sumario
            </Link>
          </Button>
        </SheetClose>
      </div>

      <SheetClose asChild>
        <Button className="justify-start gap-2" variant="ghost" asChild>
          <LogoutButton />
        </Button>
      </SheetClose>
    </SheetContent>
  );
};

export default SheetBar;
