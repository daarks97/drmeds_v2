import { fetchStudyPlans } from "@/lib/services/studyPlans_v2/fetchStudyPlans";
import { fetchStudyPlan } from "@/lib/services/studyPlans_v2/fetchStudyPlan";
import { createStudyPlan } from "@/lib/services/studyPlans_v2/createStudyPlan";
import { updateStudyPlan } from "@/lib/services/studyPlans_v2/updateStudyPlan";
import { deleteStudyPlan } from "@/lib/services/studyPlans_v2/deleteStudyPlan";
import { toggleStudyPlanCompletion } from "@/lib/services/studyPlans_v2/toggleStudyPlanCompletion";
import { toggleStudyPlanDifficulty } from "@/lib/services/studyPlans_v2/toggleStudyPlanDifficulty";
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
