
import React from 'react';
import { WeeklySchedule } from '@/lib/types';
import { Check, X, Book, RefreshCw } from 'lucide-react';

interface WeeklyCalendarProps {
  schedule: WeeklySchedule[];
  onMarkCompleted: (dayNumber: number, planId: string) => void;
  onUnmarkCompleted: (dayNumber: number, planId: string) => void;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ 
  schedule,
  onMarkCompleted,
  onUnmarkCompleted
}) => {
  const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    const day = new Date(d.setDate(d.getDate() - d.getDay() + i));
    return {
      name: days[i],
      date: day.getDate(),
      isToday: day.toDateString() === new Date().toDateString()
    };
  });

  const getTopicsForDay = (dayNumber: number) => {
    return schedule.filter(item => item.dayNumber === dayNumber);
  };

  // Function to determine if a topic is a revision based on naming pattern
  const isRevision = (topicName: string) => {
    return topicName.toLowerCase().includes('revisão') || 
           topicName.toLowerCase().includes('revisao') ||
           topicName.toLowerCase().includes('d+') || 
           topicName.toLowerCase().includes('d1') || 
           topicName.toLowerCase().includes('d7') || 
           topicName.toLowerCase().includes('d30');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-medium text-gray-900">Calendário da Semana</h3>
      </div>
      
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
        {daysOfWeek.map((day) => (
          <div 
            key={day.name} 
            className={`py-2 px-3 text-center ${
              day.isToday ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600'
            }`}
          >
            <div className="text-sm">{day.name}</div>
            <div className={`text-lg ${day.isToday ? 'font-semibold text-blue-800' : 'font-medium'}`}>
              {day.date}
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 min-h-[300px] bg-white">
        {daysOfWeek.map((day) => {
          const topics = getTopicsForDay(day.date);
          
          return (
            <div 
              key={day.name} 
              className={`p-3 border-r border-gray-100 last:border-r-0 ${
                day.isToday ? 'bg-blue-50/30' : ''
              }`}
            >
              {topics.length === 0 ? (
                <div className="text-center py-2 text-sm text-gray-400">-</div>
              ) : (
                <div className="space-y-2">
                  {topics.map((topic) => {
                    const topicIsRevision = isRevision(topic.topic);
                    
                    return (
                      <div 
                        key={topic.planId} 
                        className={`
                          p-2 rounded-md text-sm flex items-start justify-between gap-1
                          ${topic.isCompleted 
                            ? 'bg-green-50 text-green-700 border border-green-100' 
                            : topicIsRevision
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                              : 'bg-blue-50 text-blue-700 border border-blue-100'
                          }
                        `}
                      >
                        <div className="flex items-start gap-1.5 flex-1 min-w-0">
                          {topicIsRevision ? (
                            <RefreshCw className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          ) : (
                            <Book className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          )}
                          <span className="line-clamp-2">{topic.topic}</span>
                        </div>
                        
                        <div className="flex-shrink-0">
                          {topic.isCompleted ? (
                            <button 
                              onClick={() => onUnmarkCompleted(day.date, topic.planId)}
                              className="p-1 rounded-full hover:bg-green-100"
                              title="Marcar como não concluído"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          ) : (
                            <button 
                              onClick={() => onMarkCompleted(day.date, topic.planId)}
                              className="p-1 rounded-full hover:bg-white"
                              title="Marcar como concluído"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyCalendar;
