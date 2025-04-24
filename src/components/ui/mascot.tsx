
import React from 'react';
import { cn } from '@/lib/utils';

export type MascotName = 
  | 'doctor'
  | 'nurse'
  | 'scientist'
  | 'student';

export type MascotEmotion =
  | 'happy'
  | 'sad'
  | 'excited'
  | 'thinking'
  | 'normal';

interface MascotProps {
  name?: MascotName;
  emotion?: MascotEmotion;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const MedicalIcon = ({
  name = 'doctor',
  emotion = 'normal',
  size = 'md',
  className
}: MascotProps) => {
  // Mapeamento de mascotes para emojis
  const mascotEmojis: Record<MascotName, Record<MascotEmotion, string>> = {
    doctor: {
      happy: '👨‍⚕️',
      sad: '😔',
      excited: '😃',
      thinking: '🤔',
      normal: '👨‍⚕️'
    },
    nurse: {
      happy: '👩‍⚕️',
      sad: '😔',
      excited: '😃',
      thinking: '🤔',
      normal: '👩‍⚕️'
    },
    scientist: {
      happy: '👨‍🔬',
      sad: '😔',
      excited: '😃',
      thinking: '🤔',
      normal: '👨‍🔬'
    },
    student: {
      happy: '👨‍🎓',
      sad: '😔',
      excited: '😃',
      thinking: '🤔',
      normal: '👨‍🎓'
    }
  };

  // Tamanhos
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl'
  };

  const emoji = mascotEmojis[name][emotion];
  
  return (
    <span 
      className={cn(
        sizeClasses[size],
        "inline-block transition-transform hover:scale-110",
        className
      )}
      role="img"
      aria-label={`${name} ${emotion}`}
    >
      {emoji}
    </span>
  );
};

export default MedicalIcon;
