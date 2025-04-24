
// --------------------- INTERFACES ---------------------

export interface StudyTopic {
  id: string;
  name: string;
  isCompleted: boolean;
  tema?: string; // Adicionado para compatibilidade
}

export type ReviewStatus = 'pending' | 'late' | 'completed' | 'rejected';

export interface ReviewTopic {
  id: string;
  name: string;
  status: ReviewStatus;
}

export interface WeeklySchedule {
  dayOfWeek: string;
  dayNumber: number;
  topic: string;
  isCompleted: boolean;
  planId: string; // Adicionado para correção do erro
}

export interface UserStats {
  topicsStudiedThisWeek: number;
  topicsCompleted: number;
  pendingReviews: number;
  pendingReviewsD1: number;
  pendingReviewsD7: number;
  pendingReviewsD30: number;
  rejectedReviews: number;
  userName: string;
  xp?: number; // Adicionado para correção do erro
  streak?: number; // Adicionado para correção do erro
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface StudyPlan {
  id: string;
  theme: string;
  discipline: string;
  planned_date: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  summary_link?: string;
  difficulty?: DifficultyLevel | string;
  completed_at?: string;
  study_time_minutes?: number;
  is_difficult?: boolean; // Adicionado para correção do erro
}

export interface StudyPlanFormData {
  theme: string;
  discipline: string;
  planned_date: Date;
}

export interface Revision {
  id: string;
  study_plan_id: string;
  revision_date: string;
  revision_stage: string; // "D1", "D7", "D30"
  is_completed: boolean;
  is_refused: boolean;
  created_at: string;
  study_plans?: {
    theme: string;
    discipline: string;
    difficulty?: DifficultyLevel | string;
  };
  // Propriedades adicionais para compatibilidade
  concluida?: boolean;
  recusada?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  course: string | null;
  level: string | null;
  specialty: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfileFormData {
  name: string;
  course: string | null;
  level: string | null;
  specialty: string | null;
}

// Adicionar novas interfaces para os componentes com erros

export interface RankingUser {
  userId: string;
  name: string;
  position: number;
  weeklyXp: number;
  level: number;
  isCurrentUser?: boolean;
  xp?: number; // Adicionado para correção
}

export interface Desempenho {
  id: string;
  user_id: string;
  prova: string;
  ano: number;
  acertos: number;
  total: number;
  data_tentativa: string;
  pontuacao?: number;
  percentual?: number; // Adicionado para correção
}

export interface DesempenhoPorTema {
  user_id: string;
  total_respostas: number;
  total_acertos: number;
  percentual_acerto: number;
  tema: string;
  ultimo_acesso: string;
  disciplina: string; // Adicionado para correção
}

export interface ConquistaUsuario {
  id: string;
  user_id: string;
  tipo: string;
  tema?: string;
  data_conquista: string;
  desbloqueada_em?: string; // Adicionado para correção
}

// Interface para sugestões de estudo
export interface Suggestion {
  type: 'revision' | 'study';
  item: Revision | StudyPlan;
  priority: number;
}

// Lista de disciplinas para o StudyPlanForm
export const DISCIPLINES = [
  'Anatomia',
  'Fisiologia',
  'Patologia',
  'Farmacologia',
  'Clínica Médica',
  'Cirurgia',
  'Pediatria',
  'Ginecologia',
  'Obstetrícia',
  'Neurologia',
  'Psiquiatria',
  'Saúde Pública',
  'Medicina Legal',
  'Ortopedia',
  'Dermatologia',
  'Oftalmologia',
  'Otorrinolaringologia',
  'Radiologia'
];

// Badge variants para o shadcn Badge component
export type BadgeVariants = 'default' | 'destructive' | 'outline' | 'secondary' | 'success' | 'warning';
