export interface Exercise {
  id: number;
  name: string;
}

export interface Plano {
  id: number;
  name: string;
  planType: {
    id: number;
    name: string;
  };
  exercises: Exercise[];
}


export interface PlanoCreate {
  name: string;
  planType: {
    id: number;
  };
  exercises: { id: number }[];
}
