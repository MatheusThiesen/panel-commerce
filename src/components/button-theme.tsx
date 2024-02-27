"use client";

import { cn } from "@/lib/utils";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

interface ButtonThemeProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ButtonTheme({ className, ...props }: ButtonThemeProps) {
  const { setTheme, theme } = useTheme();

  function handleChangeTheme() {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }

  return (
    <div className={cn(className)} {...props}>
      <Button variant="ghost" size="icon" onClick={handleChangeTheme}>
        {theme === "dark" ? (
          <SunIcon className="h-[1.2rem] w-[1.2rem] " />
        ) : (
          <MoonIcon className="h-[1.2rem] w-[1.2rem] " />
        )}
      </Button>
    </div>
  );
}
