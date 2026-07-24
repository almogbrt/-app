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
  color: MemberColor;
  avatar: string;
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
  dueDate: string | null;
  recurrence: Recurrence;
  points: number;
  done: boolean;
  completedAt: string | null;
  createdAt: string;
}
