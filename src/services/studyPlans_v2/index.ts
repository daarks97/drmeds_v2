// src/services/studyPlans_v2/index.ts

import { fetchStudyPlans } from "./fetchStudyPlans";
import { fetchStudyPlan } from "./fetchStudyPlans";
import { createStudyPlan } from "./createStudyPlan";
import { updateStudyPlan } from "./updateStudyPlan";
import { deleteStudyPlan } from "./deleteStudyPlan";
import { completeStudyPlanById } from "./completeStudyPlan"; // ✅ Corrigido aqui
import { toggleStudyPlanCompletion } from "./toggleStudyPlanCompletion";
import { toggleStudyPlanDifficulty } from "./toggleStudyPlanDifficulty";
// Remova a linha abaixo se ainda existir erro:
// import { generateStudyPlan } from "./generateStudyPlan";

export {
  fetchStudyPlans,
  fetchStudyPlan,
  createStudyPlan,
  updateStudyPlan,
  deleteStudyPlan,
  completeStudyPlanById, // ✅ Corrigido aqui também
  toggleStudyPlanCompletion,
  toggleStudyPlanDifficulty,
  // generateStudyPlan,
};
