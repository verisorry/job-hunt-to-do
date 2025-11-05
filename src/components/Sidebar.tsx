import React, { useState } from 'react';
import { Task } from '../types';
import { TaskItem } from './TaskItem';
import { formatMinutes } from '../utils/time';

interface SidebarProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'oldDay'>) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onResetIncompleteTasks: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onResetIncompleteTasks,
}) => {
  const [inputText, setInputText] = useState('');
  // default 30 minutes
  const [inputTime, setInputTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText.trim();
    const time = inputTime ? parseInt(inputTime, 10) : 30; // Use inputTime or default to 30

    onAddTask({
      text,
      time,
      completed: false,
    });

    setInputText('');
    setInputTime('');
  };

  const todayTasks = tasks.filter(t => !t.oldDay);
  const incompleteTasks = todayTasks.filter((t) => !t.completed);
  const totalTime = incompleteTasks.reduce((sum, task) => sum + task.time, 0);

  return (
    <div className="w-full lg:w-96 bg-white flex flex-col flex-shrink-0 rounded-2xl">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Inbox</h1>
            <p className="text-sm text-gray-500 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
          </div>
          {totalTime > 0 && (
            <div className="text-right">
              <div className="text-sm text-gray-500 flex items-center gap-2 justify-end">
                Total time
              </div>
              <div className="text-xl font-bold text-green-600">{formatMinutes(totalTime)}</div>
              <button
                  onClick={onResetIncompleteTasks}
                  className="text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 px-2 py-0.5 rounded transition-colors"
                >
                  Reset
                </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {todayTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">Add something or pick from suggestions →</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggleTask}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex gap-2 w-full">
          <div className="flex-1 flex gap-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="+ Add custom task"
              className="w-full flex-3 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 placeholder-gray-400"
            />
            <div className="relative flex-2">
              <input
                type="number"
                value={inputTime}
                onChange={(e) => setInputTime(e.target.value)}
                className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 placeholder-gray-400"
                placeholder="30"
                min="1"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">min</span>
            </div>
          </div>
          <button
            type="submit"
            className="px-4 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!inputText.trim()}>
            ↑
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-1 px-1">Add time: 30m, 1h, 45min</p>
      </div>
    </div>
  );
};
