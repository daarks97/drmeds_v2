// src/services/studyPlans_v2/index.ts

// Imports diretos — evite 'export *' em arquivos de serviço para clareza e controle
import { fetchStudyPlans, fetchStudyPlan } from "./fetchStudyPlans";
import { createStudyPlan } from "./createStudyPlan";
import { updateStudyPlan } from "./updateStudyPlan";
import { deleteStudyPlan } from "./deleteStudyPlan";
import { markStudyPlanAsCompleted } from "./completeStudyPlan";
import { toggleStudyPlanCompletion } from "./toggleStudyPlanCompletion";
import { toggleStudyPlanDifficulty } from "./toggleStudyPlanDifficulty";

// Exportação centralizada
export {
  fetchStudyPlans,
  fetchStudyPlan,
  createStudyPlan,
  updateStudyPlan,
  deleteStudyPlan,
  markStudyPlanAsCompleted,
  toggleStudyPlanCompletion,
  toggleStudyPlanDifficulty,
};
