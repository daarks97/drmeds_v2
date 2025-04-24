import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  BookText,
  RefreshCw,
  User,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      name: 'Planejamento',
      path: '/planner',
      icon: <CalendarDays className="h-5 w-5" />
    },
    {
      name: 'Temas',
      path: '/study-theme',
      icon: <BookText className="h-5 w-5" />
    },
    {
      name: 'Revisões',
      path: '/revisions',
      icon: <RefreshCw className="h-5 w-5" />
    },
    {
      name: 'Perfil',
      path: '/profile',
      icon: <User className="h-5 w-5" />
    }
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <aside className="h-screen w-60 fixed left-0 top-0 flex flex-col bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-700 z-30">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 dark:border-zinc-700">
        <h1 className="text-xl font-bold text-study-blue dark:text-blue-400">DrMeds</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Plataforma de Estudos</p>
      </div>

      {/* Navegação */}
      <nav className="flex-grow p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = isActivePath(item.path);
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 hover:scale-[1.01]",
                    active
                      ? "bg-study-blue text-white font-semibold ring-2 ring-study-blue/50"
                      : "text-study-gray dark:text-gray-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  )}
                >
                  {item.icon}
                  <span className="flex-1">{item.name}</span>
                  {active && <ChevronRight className="h-4 w-4 opacity-80" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Rodapé */}
      <div className="p-4 border-t border-gray-200 dark:border-zinc-700">
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-300">
          <div className="h-8 w-8 rounded-full bg-study-blue/10 dark:bg-blue-800/40 flex items-center justify-center text-study-blue dark:text-blue-300 font-medium">
            DM
          </div>
          <div>
            <p className="font-medium text-study-gray dark:text-white">DrMeds</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Versão 1.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
