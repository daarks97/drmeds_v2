
interface DisciplineData {
  name: string;
  value: number;
}

interface DifficultyData {
  name: string;
  value: number;
}

interface RecentStudy {
  id: string;
  theme: string;
  discipline: string;
  updated_at: string;
  completed_at: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export const fetchStudiesByDiscipline = async (): Promise<DisciplineData[]> => {
  try {
    // Simulate API call to fetch study distribution by discipline
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock data for demonstration
    const mockData: DisciplineData[] = [
      { name: "Clínica Médica", value: 30 },
      { name: "Cirurgia", value: 20 },
      { name: "Pediatria", value: 25 },
      { name: "Ginecologia", value: 15 },
      { name: "Outras", value: 10 },
    ];

    return mockData;
  } catch (error) {
    console.error('Error fetching studies by discipline:', error);
    throw error;
  }
};

export const fetchStudiesByDifficulty = async (): Promise<DifficultyData[]> => {
  try {
    // Simulate API call to fetch study distribution by difficulty
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock data for demonstration
    const mockData: DifficultyData[] = [
      { name: "easy", value: 40 },
      { name: "medium", value: 35 },
      { name: "hard", value: 20 },
      { name: "não definido", value: 5 },
    ];

    return mockData;
  } catch (error) {
    console.error('Error fetching studies by difficulty:', error);
    throw error;
  }
};

export const fetchRecentCompletedStudies = async (limit: number): Promise<RecentStudy[]> => {
  try {
    // Simulate API call to fetch recent completed studies
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock data for demonstration
    const mockData: RecentStudy[] = [
      {
        id: "1",
        theme: "Diabetes Mellitus Tipo 2",
        discipline: "Endocrinologia",
        updated_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        difficulty: "medium"
      },
      {
        id: "2",
        theme: "Hipertensão Arterial Sistêmica",
        discipline: "Cardiologia",
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        completed_at: new Date(Date.now() - 86400000).toISOString(),
        difficulty: "easy"
      },
      {
        id: "3",
        theme: "Pneumonia Adquirida na Comunidade",
        discipline: "Clínica Médica",
        updated_at: new Date(Date.now() - 172800000).toISOString(),
        completed_at: new Date(Date.now() - 172800000).toISOString(),
        difficulty: "hard"
      },
    ];

    return mockData.slice(0, limit);
  } catch (error) {
    console.error('Error fetching recent completed studies:', error);
    throw error;
  }
};

