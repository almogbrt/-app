export type MemberColor =
  | "rose"
  | "amber"
  | "emerald"
  | "sky"
  | "violet"
  | "orange";

export interface FamilyMember {
  id: string;
  name: string;
  age?: number;
  color: MemberColor;
  avatar: string;
  photo?: string;
}

export type PetSpecies = "dog" | "turtle" | "bird";

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
}

export type TaskCategory =
  | "ניקיון"
  | "כביסה"
  | "מטבח"
  | "קניות"
  | "חיות מחמד"
  | "אחר";

export type Recurrence = "none" | "daily" | "weekly" | "monthly";

export interface HomeTask {
  id: string;
  title: string;
  notes?: string;
  category: TaskCategory;
  assigneeId: string | null;
  petId: string | null;
  dueDate: string | null;
  recurrence: Recurrence;
  points: number;
  done: boolean;
  completedAt: string | null;
  completedCount?: number;
  proofPhoto?: string | null;
  createdAt: string;
}

export interface TaskCompletion {
  id: string;
  taskId: string;
  memberId: string | null;
  points: number;
  photo: string;
  completedAt: string;
  paidOut: boolean;
}
