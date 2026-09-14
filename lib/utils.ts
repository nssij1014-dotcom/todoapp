export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  d.setHours(0, 0, 0, 0);
  d.setDate(diff);
  return d;
}

export const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatWeekRange(weekStart: string | Date): string {
  const start = new Date(weekStart);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = (d: Date) => `${d.getMonth() + 1}월 ${d.getDate()}일`;
  return `${fmt(start)} - ${fmt(end)}`;
}

export function calcGoalsProgress(goals: { done: boolean }[]): number {
  if (goals.length === 0) return 0;
  const done = goals.filter((g) => g.done).length;
  return Math.round((done / goals.length) * 100);
}
