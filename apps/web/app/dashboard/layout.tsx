"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface navItem {
  name: string;
  link: string;
}

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const navItems: navItem[] = [
    { name: "Publisher", link: "/dashboard/publisher" },
    { name: "Trainer", link: "/dashboard/trainer" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  return (
    <>
      <div className="mx-auto h-screen md:w-[72vw] xl:w-[60vw] pt-4">
        <header className="flex items-center justify-between bg-background py-1 shadow-sm">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-display text-lg font-bold">AURA-FL</span>
            </Link>
            <nav className="hidden items-center gap-2 md:flex">
              {navItems.map((item, index) => (
                <Button
                  variant={activeIndex === index ? "linkActive" : "linkHover2"}
                  onClick={() => {
                    setActiveIndex(index);
                    router.push(item.link);
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </nav>
          </div>
          <Button size={"icon"} variant={"ghost"}>
            <UserCircle className="h-6 w-6" />
          </Button>
        </header>
        <div className="mt-8 flex w-full flex-col gap-8">{children}</div>
      </div>
    </>
  );
};

export default DashboardLayout;
