import { IconType } from "react-icons";
export interface Task {
  id: string;
  text: string;
  time: number;
  completed: boolean;
  createdAt: string;
  oldDay: boolean;
  category?: 'applications' | 'portfolio' | 'projects' | 'skills' | 'custom';
}

export interface Suggestion {
  text: string;
  time: string;
}

export interface Activity {
  title: string;
  emoji: IconType;
  suggestions: Suggestion[];
}

export interface Activities {
  [key: string]: Activity;
}

export interface TimeBlock {
  id: string;
  taskId: string;
  taskText: string;
  startHour: number;
  endHour: number;
  category?: 'applications' | 'portfolio' | 'projects' | 'skills' | 'custom';
}

export interface CoachData {
  tasks: Task[];
  activities: Activities;
  timeBlocks: TimeBlock[];
  lastActiveDate: string;
  weeklyActivityCount: number;
}
