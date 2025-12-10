import React, { useState, useEffect, useRef } from 'react';
import { Suggestion } from '../types';

interface SuggestionCardProps {
  suggestion: Suggestion;
  isEditMode: boolean;
  onAddToTasks: (text: string, time: string, category: string) => void;
  onEdit: (oldText: string, newSuggestion: Suggestion) => void;
  onDelete: (text: string) => void;
  category: string;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({
  suggestion,
  isEditMode,
  onAddToTasks,
  onEdit,
  onDelete,
  category,
}) => {
  const [editText, setEditText] = useState(suggestion.text);
  // Extract numeric value from time string (e.g., "30 min" -> 30)
  const [editTimeMinutes, setEditTimeMinutes] = useState(() => {
    const match = suggestion.time.match(/\d+/);
    return match ? match[0] : '30';
  });
  const wasInEditMode = useRef(isEditMode);

  const handleSave = () => {
    if (editText.trim() && editTimeMinutes) {
      onEdit(suggestion.text, {
        text: editText.trim(),
        time: `${editTimeMinutes} min`
      });
    }
  };

  // Save changes when exiting edit mode
  useEffect(() => {
    if (wasInEditMode.current && !isEditMode) {
      handleSave();
    }
    wasInEditMode.current = isEditMode;
  }, [isEditMode]);

  if (isEditMode) {
    return (
      <div className="flex gap-1 items-center">
        <div className="flex-1 flex justify-between gap-1 align-middle">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="Task name"
          />
          <div className="relative w-full">
            <input
              type="number"
              value={editTimeMinutes}
              onChange={(e) => setEditTimeMinutes(e.target.value)}
              className="w-full px-3 py-2 pr-10 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="30"
              min="1"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">min</span>
          </div>
        </div>
        <button
          onClick={(e) => {
              e.stopPropagation();
              onDelete(suggestion.text);
            }}
          className="text-red-500 hover:text-red-700 text-xs px-1 flex-shrink-0"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className="relative group">
        <button
          onClick={() => onAddToTasks(suggestion.text, suggestion.time, category)}
          className="w-full flex justify-between align-middle text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <div className="text-xs text-gray-700">{suggestion.text}</div>
          <div className="text-xs text-gray-500 mt-1">{suggestion.time}</div>
        </button>
    </div>
  );
};
