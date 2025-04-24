// src/services/studyPlans_v2/index.ts

import { fetchStudyPlans } from "./fetchStudyPlans";
import { fetchStudyPlan } from "./fetchStudyPlans";
import { createStudyPlan } from "./createStudyPlan";
import { updateStudyPlan } from "./updateStudyPlan";
import { deleteStudyPlan } from "./deleteStudyPlan";
import { toggleStudyPlanCompletion } from "./toggleStudyPlanCompletion";
import { toggleStudyPlanDifficulty } from "./toggleStudyPlanDifficulty";
import { completeStudyPlanById } from "@/lib/services/studyPlans_v2/completeStudyPlan";

export { completeStudyPlanById as markStudyPlanAsCompleted };
export {
  fetchStudyPlans,
  fetchStudyPlan,
  createStudyPlan,
  updateStudyPlan,
  deleteStudyPlan,
  completeStudyPlanById,
  toggleStudyPlanCompletion,
  toggleStudyPlanDifficulty,
};