import type { FamilyMember } from "../types";

interface Props {
  member: FamilyMember;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
  sm: "h-7 w-7 text-base",
  md: "h-10 w-10 text-xl",
  lg: "h-20 w-20 text-4xl",
};

export function Avatar({ member, size = "md" }: Props) {
  const sizeClass = SIZE_CLASSES[size];

  if (member.photo) {
    return (
      <img
        src={member.photo}
        alt={member.name}
        className={`${sizeClass} flex-shrink-0 rounded-full object-cover ring-2 ring-white dark:ring-slate-900`}
      />
    );
  }

  return (
    <span
      className={`${sizeClass} flex flex-shrink-0 items-center justify-center rounded-full bg-slate-100 leading-none dark:bg-slate-800`}
    >
      {member.avatar}
    </span>
  );
}
