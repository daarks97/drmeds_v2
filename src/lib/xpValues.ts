
// Valores de XP para diversas ações
export const XP_VALUES = {
  STUDY_COMPLETED: 10,
  REVISION_COMPLETED: 5,
  QUESTION_CORRECT: 2,
  STREAK_DAY: 3,
  WEEKLY_GOAL_MET: 15,
  FOCUS_MODE: {
    SHORT: 1,    // Less than 5 minutes
    MEDIUM: 3,   // 5-15 minutes
    LONG: 5      // More than 15 minutes
  }
};

// Pontos necessários para cada nível
export const LEVEL_THRESHOLDS = [
  0,       // Nível 0 (não utilizado)
  100,     // Nível 1
  250,     // Nível 2
  450,     // Nível 3
  700,     // Nível 4
  1000,    // Nível 5
  1350,    // Nível 6
  1750,    // Nível 7
  2200,    // Nível 8
  2700,    // Nível 9
  3250,    // Nível 10
  3850,    // Nível 11
  4500,    // Nível 12
  5200,    // Nível 13
  6000,    // Nível 14
  7000,    // Nível 15
];

// Tipo para conquistas e seus ícones
export const ACHIEVEMENT_ICONS: Record<string, { title: string, description: string, icon: string }> = {
  STREAK: {
    title: '🔥 Sequência de Fogo',
    description: 'Estudar por vários dias consecutivos',
    icon: '🔥'
  },
  VOLUME: {
    title: '📚 Volume de Estudos',
    description: 'Completar muitos temas de estudo',
    icon: '📚'
  },
  MARATHON: {
    title: '🏃 Maratonista',
    description: 'Estudar muitos temas em uma semana',
    icon: '🏃'
  },
  FOCUS: {
    title: '🎯 Foco Total',
    description: 'Manter alto tempo de foco nos estudos',
    icon: '🎯'
  },
  REVISION: {
    title: '🔄 Mestre das Revisões',
    description: 'Completar muitas revisões programadas',
    icon: '🔄'
  },
  ACCURACY: {
    title: '🎯 Precisão nas Respostas',
    description: 'Alta taxa de acerto nas questões',
    icon: '🎯'
  }
};

// Dados de mascote por nível
export interface MascotData {
  name: string;
  icon: string;
  title: string;
  color: string;
}

export const MASCOT_LEVELS: Record<number, { title: string, icon: string, requiredXP: number }> = {
  1: { title: 'Estudante', icon: '👨‍🎓', requiredXP: 0 },
  2: { title: 'Calouro Dedicado', icon: '📝', requiredXP: 100 },
  3: { title: 'Explorador Médico', icon: '🔍', requiredXP: 250 },
  4: { title: 'Aprendiz Focado', icon: '🧠', requiredXP: 450 },
  5: { title: 'Residente Júnior', icon: '👨‍⚕️', requiredXP: 700 },
  6: { title: 'Pesquisador Curioso', icon: '🔬', requiredXP: 1000 },
  7: { title: 'Residente Sênior', icon: '👨‍⚕️', requiredXP: 1350 },
  8: { title: 'Especialista Iniciante', icon: '🩺', requiredXP: 1750 },
  9: { title: 'Cientista Médico', icon: '🧪', requiredXP: 2200 },
  10: { title: 'Especialista', icon: '👨‍⚕️', requiredXP: 2700 },
  11: { title: 'Doutor Master', icon: '⚕️', requiredXP: 3250 },
  12: { title: 'Consultor Médico', icon: '📊', requiredXP: 3850 },
  13: { title: 'Autoridade Clínica', icon: '👑', requiredXP: 4500 },
  14: { title: 'Professor Associado', icon: '👨‍🏫', requiredXP: 5200 },
  15: { title: 'Professor Titular', icon: '🎓', requiredXP: 6000 }
};

export function getMascotByLevel(level: number): MascotData {
  if (level >= 15) {
    return {
      name: 'professor',
      icon: '👨‍🏫',
      title: 'Professor(a)',
      color: 'purple'
    };
  } else if (level >= 10) {
    return {
      name: 'specialist',
      icon: '👨‍⚕️',
      title: 'Especialista',
      color: 'blue'
    };
  } else if (level >= 5) {
    return {
      name: 'resident',
      icon: '👨‍🔬',
      title: 'Residente',
      color: 'green'
    };
  } else {
    return {
      name: 'student',
      icon: '👨‍🎓',
      title: 'Estudante',
      color: 'yellow'
    };
  }
}

export function getMascotByXP(xp: number): {
  level: number;
  mascot: MascotData;
  nextLevel: number | null;
  xpForNextLevel: number;
} {
  // Calculate level based on XP
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i;
    } else {
      break;
    }
  }
  
  const mascot = getMascotByLevel(level);
  const nextLevel = level < LEVEL_THRESHOLDS.length - 1 ? level + 1 : null;
  const xpForNextLevel = nextLevel ? LEVEL_THRESHOLDS[nextLevel] - xp : 0;
  
  return { level, mascot, nextLevel, xpForNextLevel };
}
