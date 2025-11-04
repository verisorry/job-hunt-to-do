import React from 'react';
import { Task } from '../types';
import { formatMinutes } from '../utils/time';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <div className="flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors group">
      <button
        onClick={() => onToggle(task.id)}
        className="flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center mt-0.5"
        style={{
          backgroundColor: task.completed ? '#3b82f6' : 'transparent',
          borderColor: task.completed ? '#3b82f6' : '#d1d5db',
        }}
      >
        {task.completed && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <span
          className={`text-sm block ${
            task.completed ? 'line-through text-gray-400' : 'text-gray-900'
          }`}
        >
          {task.text}
        </span>
        {task.time > 0 && (
          <span className="text-xs text-gray-500 mt-1 block">
            {formatMinutes(task.time)}
          </span>
        )}
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="text-gray-400 hover:text-red-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
      >
        ✕
      </button>
    </div>
  );
};
