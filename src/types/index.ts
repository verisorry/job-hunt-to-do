export interface Task {
  id: string;
  text: string;
  time: number;
  completed: boolean;
  createdAt: string;
  oldDay: boolean;
}

export interface Suggestion {
  text: string;
  time: string;
}

export interface Activity {
  title: string;
  emoji: string;
  suggestions: Suggestion[];
}

export interface Activities {
  [key: string]: Activity;
}

export interface CoachData {
  tasks: Task[];
  activities: Activities;
  lastActiveDate: string;
  weeklyActivityCount: number;
}
