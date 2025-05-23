export interface Exercise {
  id: number;
  name: string;
  muscleGroup: string;
  repetitions: number;
  series: number;
  restSec: number;
}

export interface Plano {
  id: number;
  name: string;
  type?: string;
  exercises: Exercise[];
}
