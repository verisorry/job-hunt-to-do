import React, { useState } from 'react';
import { Activities, Suggestion, Task } from '../types';
import { SuggestionCard } from './SuggestionCard';
import { getDefaultActivities } from '../utils/storage';

interface CoachPanelProps {
  activities: Activities;
  tasks: Task[];
  onAddTaskFromSuggestion: (text: string, time: string, category: string) => void;
  onUpdateActivities: (activities: Activities) => void;
}

export const CoachPanel: React.FC<CoachPanelProps> = ({
  activities,
  tasks,
  onAddTaskFromSuggestion,
  onUpdateActivities,
}) => {
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});

  const getCoachMessage = () => {
    const hour = new Date().getHours();
    const incompleteTasks = tasks.filter(t => !t.completed && !t.oldDay).length;
    const completedTasks = tasks.filter(t => t.completed && !t.oldDay).length;
    const totalTasks = tasks.filter(t => !t.oldDay).length;

    // No tasks yet
    if (totalTasks === 0) {
      if (hour < 12) return "Morning. What's one thing you can do today to get closer to landing a job?";
      if (hour < 17) return "Still got time today. Pick something small and do it.";
      return "Evening check-in. What can you knock out before bed?";
    }

    // All done
    if (incompleteTasks === 0 && totalTasks > 0) {
      return "Done for the day. You actually did the work. Go relax.";
    }

    // Procrastinating
    if (completedTasks === 0 && totalTasks >= 3) {
      return "You made the list but haven't started. That's the hardest part done—just pick one and go.";
    }

    // Making progress
    if (completedTasks > 0 && incompleteTasks > 0) {
      return `${completedTasks} done, ${incompleteTasks} to go. Keep going.`;
    }

    // Default time-based
    if (hour < 12) return "Start with the easiest thing. Build momentum.";
    if (hour < 17) return "Halfway through the day. What still needs your attention?";
    return "What can you realistically finish tonight?";
  };

  const getRealityCheck = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentTasks = tasks.filter(t => new Date(t.createdAt) > weekAgo);

    if (recentTasks.length < 5) {
      return "Real talk: You've been quiet this week. The job won't find you.";
    }
    if (recentTasks.length < 10) {
      return "You're doing okay, but you could be doing more. Senioritis isn't an excuse.";
    }
    return `${recentTasks.length} tasks this week. This is how you land a job.`;
  };

  const toggleEditMode = (key: string) => {
    setEditMode((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleEditSuggestion = (
    activityKey: string,
    oldText: string,
    newSuggestion: Suggestion
  ) => {
    const updatedActivities = { ...activities };
    const activity = updatedActivities[activityKey];
    const index = activity.suggestions.findIndex((s) => s.text === oldText);
    if (index !== -1) {
      activity.suggestions[index] = newSuggestion;
      onUpdateActivities(updatedActivities);
    }
  };

  const handleDeleteSuggestion = (activityKey: string, text: string) => {
    const updatedActivities = { ...activities };
    const activity = updatedActivities[activityKey];
    activity.suggestions = activity.suggestions.filter((s) => s.text !== text);
    onUpdateActivities(updatedActivities);
  };

  const handleAddSuggestion = (activityKey: string) => {
    const updatedActivities = { ...activities };
    const activity = updatedActivities[activityKey];
    activity.suggestions.push({ text: 'New suggestion', time: '30 min' });
    onUpdateActivities(updatedActivities);
  };

  const handleResetActivity = (activityKey: string) => {
    const defaultActivities = getDefaultActivities();
    const updatedActivities = { ...activities };
    updatedActivities[activityKey] = defaultActivities[activityKey];
    onUpdateActivities(updatedActivities);
    setEditMode((prev) => ({ ...prev, [activityKey]: false }));
  };

  const activityKeys = Object.keys(activities);

  const completedTasksToday = tasks.filter(t => t.completed && !t.oldDay).length;

  return (
    <div className="flex-1 flex flex-col bg-white rounded-2xl">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Suggestions</h2>
            <p className="text-sm text-gray-500 mt-1">Some ideas to get you started</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Done today</div>
            {
            (completedTasksToday > 0)
              ? <div className="text-3xl font-bold text-green-600">{completedTasksToday}</div>
              : <div className="text-3xl font-bold text-gray-600">{completedTasksToday}</div>
            }

            {
              (tasks.length > 0)
              ? <div className='mb-4' />
              : <div />
            }
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-6 lg:p-8 flex flex-col">
        {/* Coach Message */}
        <div className="gradient-bg frosted-backdrop rounded-lg p-5 text-gray-900 mb-2 flex-shrink-0">
          <div className="text-lg font-medium leading-relaxed">{getCoachMessage()}</div>
          <p className="text-xs opacity-90">{getRealityCheck()}</p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4 flex-shrink-0 rounded-lg">
          <p className="text-xs text-yellow-800 font-medium mb-1">Remember:</p>
          <p className="text-xs text-yellow-700">
            You need to apply to 100-200 companies to land a good offer. Senioritis is real, but so is not having a job lined up. Pick 2-3 things and do them today.
          </p>
        </div>

        {/* Activities Grid */}
        <div className="flex-1">
          <div className="grid lg:grid-cols-2 gap-4 h-full">
            {activityKeys.map((key) => {
              const activity = activities[key];
              const isEditMode = editMode[key] || false;

              return (
                <div key={key} className="flex flex-col">
                  <h3 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2 flex-shrink-0">
                    <activity.emoji className="text-lg" color='gray' />
                    {activity.title}
                    {isEditMode && (
                      <button
                        onClick={() => handleResetActivity(key)}
                        className="ml-auto text-gray-500 hover:text-gray-700 hover:bg-gray-50 px-2 py-1 text-xs"
                      >
                        Reset
                      </button>
                    )}
                    <button
                      onClick={() => toggleEditMode(key)}
                      className={`text-green-600 hover:text-green-700 hover:bg-green-50 hover:bg-opacity-50 px-2 py-1 text-xs ${!isEditMode ? 'ml-auto' : ''}`}
                    >
                      {isEditMode ? 'Done' : 'Edit'}
                    </button>
                  </h3>
                  <div className="flex-1 space-y-2 overflow-y-auto">
                    {activity.suggestions.map((suggestion, idx) => (
                      <SuggestionCard
                        key={`${suggestion.text}-${idx}`}
                        suggestion={suggestion}
                        isEditMode={isEditMode}
                        onAddToTasks={onAddTaskFromSuggestion}
                        onEdit={(oldText, newSuggestion) =>
                          handleEditSuggestion(key, oldText, newSuggestion)
                        }
                        onDelete={(text) => handleDeleteSuggestion(key, text)}
                        category={key}
                      />
                    ))}
                    {isEditMode && (
                      <button
                        onClick={() => handleAddSuggestion(key)}
                        className="w-full py-2 px-3 text-xs text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg border border-dashed border-green-300 hover:border-green-400 transition-colors"
                      >
                        + Add New Entry
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
