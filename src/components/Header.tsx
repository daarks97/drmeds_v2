import React from 'react';
import { UserStats, StudyTopic, ReviewTopic } from '@/lib/types';
import { Bell, Book, RefreshCw, Flame, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface HeaderProps {
  userStats: UserStats;
  todayTopic?: StudyTopic;
  reviewTopic?: ReviewTopic;
  onMarkStudyCompleted?: (id: string) => void;
  onViewTopic?: (id: string) => void;
  onMarkReviewCompleted?: (id: string) => void;
  onRejectReview?: (id: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  userStats,
  todayTopic,
  reviewTopic,
  onMarkStudyCompleted,
  onViewTopic,
  onMarkReviewCompleted,
  onRejectReview,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const notificationCount = (todayTopic ? 1 : 0) + (reviewTopic ? 1 : 0);

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 py-4 gap-4 md:gap-0">
      <div>
        <h1 className="text-2xl font-semibold text-study-gray dark:text-white">
          {getGreeting()},{' '}
          <span className="text-study-blue">{userStats.userName}</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Confira seu panorama de estudos
        </p>

        <div className="flex gap-4 mt-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>{userStats?.xp ?? 0} XP</span>
          </div>
          <div className="flex items-center gap-1">
            <Flame className="h-4 w-4 text-red-500" />
            <span>{userStats?.streak ?? 0} dias seguidos</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notificações */}
        {(todayTopic || reviewTopic) && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative border-gray-200 dark:border-zinc-700 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
              >
                <Bell
                  className={cn(
                    'h-5 w-5 text-gray-600 dark:text-zinc-200',
                    notificationCount > 0 && 'animate-pulse'
                  )}
                />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-study-blue">
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-0 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xl"
              align="end"
            >
              <div className="p-3 bg-gray-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 rounded-t-xl">
                <h4 className="font-medium text-study-gray dark:text-white">Notificações</h4>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-zinc-700">
                {todayTopic && (
                  <div className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-50 text-study-blue p-2 rounded">
                        <Book className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-sm text-study-gray dark:text-white">Tema para hoje</h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{todayTopic.name}</p>
                        <div className="flex gap-2">
                          {onViewTopic && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs border-gray-200 dark:border-zinc-700"
                              onClick={() => onViewTopic(todayTopic.id)}
                            >
                              Ver detalhes
                            </Button>
                          )}
                          {!todayTopic.isCompleted && onMarkStudyCompleted && (
                            <Button
                              size="sm"
                              className="h-7 text-xs bg-study-green hover:bg-green-600"
                              onClick={() => onMarkStudyCompleted(todayTopic.id)}
                            >
                              Concluir
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {reviewTopic && ['pending', 'late'].includes(reviewTopic.status) && (
                  <div className="p-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'p-2 rounded',
                          reviewTopic.status === 'late'
                            ? 'bg-red-50 text-study-red'
                            : 'bg-blue-50 text-study-blue'
                        )}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-medium text-sm text-study-gray dark:text-white">Revisão pendente</h5>
                          {reviewTopic.status === 'late' && (
                            <Badge variant="destructive" className="text-[10px] px-1 py-0">
                              Atrasada
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{reviewTopic.name}</p>
                        <div className="flex gap-2">
                          {onMarkReviewCompleted && (
                            <Button
                              size="sm"
                              className="h-7 text-xs bg-study-green hover:bg-green-600"
                              onClick={() => onMarkReviewCompleted(reviewTopic.id)}
                            >
                              Concluir
                            </Button>
                          )}
                          {onRejectReview && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs border-gray-200 dark:border-zinc-700"
                              onClick={() => onRejectReview(reviewTopic.id)}
                            >
                              Recusar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {notificationCount === 0 && (
                  <div className="p-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Não há notificações no momento.
                    </p>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Perfil */}
        <Button
          variant="outline"
          className="gap-2 border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
          asChild
        >
          <Link to="/profile">
            <div className="h-6 w-6 rounded-full bg-study-blue text-white flex items-center justify-center text-xs font-medium">
              {userStats.userName.charAt(0)}
            </div>
            <span className="text-study-gray dark:text-white">
              {userStats.userName}
            </span>
          </Link>
        </Button>
      </div>
    </header>
  );
};

export default Header;
