// src/services/studyPlans_v2/index.ts

// Imports individuais para evitar erros de referência
import { fetchStudyPlans } from "./fetchStudyPlans";
import { fetchStudyPlan } from "./fetchStudyPlans";
import { createStudyPlan } from "./createStudyPlan";
import { updateStudyPlan } from "./updateStudyPlan";
import { deleteStudyPlan } from "./deleteStudyPlan";
import { markStudyPlanAsCompleted } from "./completeStudyPlan";
import { toggleStudyPlanCompletion } from "./toggleStudyPlanCompletion";
import { toggleStudyPlanDifficulty } from "./toggleStudyPlanDifficulty";
import { generateStudyPlan } from "./generateStudyPlan";

// Exportação centralizada (ideal pra evitar quebras)
export {
  fetchStudyPlans,
  fetchStudyPlan,
  createStudyPlan,
  updateStudyPlan,
  deleteStudyPlan,
  markStudyPlanAsCompleted,
  toggleStudyPlanCompletion,
  toggleStudyPlanDifficulty,
  generateStudyPlan,
};
