"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/auth-context";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProfileEdit } from "./profile-edit";

export function UserProfileHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="absolute top-0 right-0 p-4 z-50">
      {user ? (
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="gap-2 bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm">
                <User className="h-4 w-4" />
                {user.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">{user.name} {user.surname}</p>
                <p>{user.email}</p>
                <p>{user.companyName}</p>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                 <ProfileEdit />
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Link href="/auth">
          <Button variant="secondary" className="gap-2 bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm">
            <User className="h-4 w-4" />
            Login / Sign Up
          </Button>
        </Link>
      )}
    </header>
  );
}


