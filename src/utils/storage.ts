import { CoachData, Activities } from '../types';

const STORAGE_KEY = 'jobHuntCoach';

export const getDefaultActivities = (): Activities => ({
  applications: {
    title: 'Applications',
    emoji: '📝',
    suggestions: [
      { text: 'Apply to 2-3 companies', time: '30 min' },
      { text: 'Tailor resume for target role', time: '20 min' },
      { text: 'Follow up on applications from last week', time: '15 min' },
      { text: 'Connect with recruiter on LinkedIn', time: '10 min' },
      { text: 'Check Simplify for new postings', time: '15 min' },
    ],
  },
  portfolio: {
    title: 'Portfolio',
    emoji: '💼',
    suggestions: [
      { text: 'Add case study', time: '60 min' },
      { text: 'Update project descriptions', time: '30 min' },
      { text: 'Write blog post about a project', time: '60 min' },
      { text: 'Polish homepage copy', time: '20 min' },
      { text: 'Add new project screenshots', time: '15 min' },
    ],
  },
  projects: {
    title: 'Projects',
    emoji: '🚀',
    suggestions: [
      { text: 'Code for 30 minutes on current project', time: '30 min' },
      { text: 'Deploy a new feature', time: '45 min' },
      { text: 'Start a Chrome extension idea', time: '60 min' },
      { text: 'Add tests to existing project', time: '30 min' },
      { text: 'Refactor messy code', time: '45 min' },
    ],
  },
  skills: {
    title: 'Skills',
    emoji: '📚',
    suggestions: [
      { text: 'Do 2 LeetCode problems', time: '30 min' },
      { text: 'Practice system design', time: '45 min' },
      { text: 'Learn new React pattern', time: '30 min' },
      { text: 'Read documentation', time: '20 min' },
    ],
  },
});

export const loadCoachData = (): CoachData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const data: CoachData = JSON.parse(stored);
    const today = new Date().toDateString();

    // Mark tasks from previous days as old
    const tasks = data.tasks.map(task => ({
      ...task,
      oldDay: new Date(task.createdAt).toDateString() !== today,
    }));

    // Clear completed tasks daily
    const filteredTasks = tasks.filter(task => !task.completed || !task.oldDay);

    return {
      ...data,
      tasks: filteredTasks,
      activities: data.activities || getDefaultActivities(),
    };
  }

  return {
    tasks: [],
    activities: getDefaultActivities(),
    lastActiveDate: new Date().toDateString(),
    weeklyActivityCount: 0,
  };
};

export const saveCoachData = (data: CoachData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
