
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code,
  User,
  LogOut,
  Settings,
  BookOpen,
  BarChart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { mockUsers } from '@/data/mockData';

// For demo purposes, we'll use the student user
const currentUser = mockUsers.find(user => user.role === 'student');

const Navbar = () => {
  const handleLogout = () => {
    console.log('User logged out');
    // In a real app, this would handle logout logic
  };

  return (
    <nav className="border-b bg-card">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <Code className="h-6 w-6 text-accent" />
            <span className="text-xl font-bold text-foreground">SyntaxSprint</span>
          </Link>
          
          <div className="hidden md:flex gap-6">
            <Link to="/problems" className="text-muted-foreground hover:text-foreground transition-colors">
              Problems
            </Link>
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            {currentUser?.role === 'admin' && (
              <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                Admin
              </Link>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarFallback className="bg-accent/10 text-accent">
                      {currentUser.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>My Problems</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BarChart className="mr-2 h-4 w-4" />
                  <span>Progress</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
