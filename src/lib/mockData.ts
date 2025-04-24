import { StudyTopic, ReviewTopic, UserStats } from './types';

// --------------------- MOCK DATA ---------------------

export const DISCIPLINES = [
  "Clínica Médica",
  "Cirurgia",
  "Pediatria",
  "Ginecologia e Obstetrícia",
  "Medicina Preventiva",
  "Neurologia",
  "Cardiologia",
  "Ortopedia",
  "Psiquiatria",
  "Dermatologia",
  "Endocrinologia",
  "Radiologia",
  "Infectologia",
  "Oncologia",
  "Outras"
];

export const todayStudy: StudyTopic = {
  id: '1',
  name: 'Fisiologia Renal',
  isCompleted: false,
};

export const todayReview: ReviewTopic = {
  id: '101',
  name: 'Anatomia do Coração',
  status: 'pending',
};

export const userData: UserStats = {
  topicsStudiedThisWeek: 5,
  topicsCompleted: 12,
  pendingReviews: 5,
  pendingReviewsD1: 1,
  pendingReviewsD7: 2,
  pendingReviewsD30: 2,
  rejectedReviews: 1,
  userName: "Estudante"
};
