import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Calendar, BookOpen, RefreshCw, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
  currentPage: string;
  onNavigate?: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ currentPage, onNavigate }) => {
  const handleClick = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const navItems = [
    { label: 'Home', icon: Home, route: '/', id: 'home' },
    { label: 'Planner', icon: Calendar, route: '/planner', id: 'planner' },
    { label: 'Temas', icon: BookOpen, route: '/study-theme', id: 'topics' },
    { label: 'Revisões', icon: RefreshCw, route: '/revisions', id: 'revisions' },
    { label: 'Perfil', icon: User, route: '/profile', id: 'profile' },
  ];

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-700 py-2 px-4 z-20">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center">
          {navItems.map(({ label, icon: Icon, route, id }) => (
            <Link
              key={id}
              to={route}
              onClick={() => handleClick(id)}
              className={cn(
                "flex flex-col items-center p-2 rounded-lg transition-all duration-200",
                currentPage === id
                  ? "text-yellow-400 bg-zinc-100 dark:bg-zinc-800 scale-[1.05] font-semibold"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-yellow-300"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[11px] mt-1">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
