import { fetchStudyPlans, fetchStudyPlan } from "@/lib/services/studyPlans_v2/fetchStudyPlans";
import { createStudyPlan } from "./createStudyPlan";
import { updateStudyPlan } from "./updateStudyPlan";
import { deleteStudyPlan } from "./deleteStudyPlan";
import { toggleStudyPlanCompletion } from "./toggleStudyPlanCompletion";
import { toggleStudyPlanDifficulty } from "./toggleStudyPlanDifficulty";
import { completeStudyPlanById } from "@/lib/services/studyPlans_v2/completeStudyPlan";

// Exportação de alias legada
export { completeStudyPlanById as markStudyPlanAsCompleted };

// Exportações organizadas
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
