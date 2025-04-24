// src/services/studyPlans_v2/index.ts

import { fetchStudyPlans } from "./fetchStudyPlans";
import { fetchStudyPlan } from "./fetchStudyPlans";
import { createStudyPlan } from "./createStudyPlan";
import { updateStudyPlan } from "./updateStudyPlan";
import { deleteStudyPlan } from "./deleteStudyPlan";
import { completeStudyPlanById } from "@/lib/studyPlans_v2/completeStudyPlan";
import { toggleStudyPlanCompletion } from "./toggleStudyPlanCompletion";
import { toggleStudyPlanDifficulty } from "./toggleStudyPlanDifficulty";

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
