import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function UserNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8  rounded-full">
          <Avatar className="size-10 ">
            <AvatarImage src="/avatars/01.png" alt="@shadcn" />
            <AvatarFallback>MT</AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1 text-start ml-3">
            <p className="text-sm font-medium leading-none">Matheus Thiesen</p>
            <p className="text-xs leading-none text-muted-foreground">
              matheus.reis@alpardobrasil.com.br
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuGroup>
          <DropdownMenuItem>Perfil</DropdownMenuItem>
          <DropdownMenuItem>Configurações</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
