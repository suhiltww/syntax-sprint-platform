
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="py-6 border-t">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} SyntaxSprint. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
