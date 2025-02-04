import { Menu, X, Bell } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { ThemeToggle } from '../theme/ThemeToggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: "/", label: "Dashboard" },
  { path: "/invoices", label: "Invoices" },
  { path: "/customers", label: "Customers" },
  { path: "/expenses", label: "Expenses" },
  { path: "/reports", label: "Reports" }
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getLinkClass = (isActive: boolean) => {
    return `transition-colors hover:text-primary ${
      isActive ? 'text-primary font-medium' : 'text-muted-foreground'
    }`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b glass-morphism">
      <div className="container flex h-16 items-center py-4">
        <div className="mr-4 flex">
          <NavLink 
            to="/" 
            className="mr-6 flex items-center space-x-2 font-bold hover:text-primary"
          >
            <span className="hidden font-bold sm:inline-block">InvoiceBolt</span>
          </NavLink>
        </div>

        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus:ring-0 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        <div className={`${isMenuOpen ? 'flex' : 'hidden'} absolute top-14 left-0 right-0 bg-background p-4 md:static md:flex md:p-0`}>
          <nav className="flex-1">
            <ul className="flex flex-col space-y-4 md:flex-row md:space-x-6 md:space-y-0">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => getLinkClass(isActive)}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuItem>
                New payment received from Acme Corp
              </DropdownMenuItem>
              <DropdownMenuItem>
                Invoice #123 is overdue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem>
                <NavLink to="/settings" className="w-full">Settings</NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}