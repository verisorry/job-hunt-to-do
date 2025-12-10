import React, { useState, useEffect, useRef } from 'react';
import { Task, TimeBlock } from '../types';
import { FaCalendarDays } from "react-icons/fa6";
import { BsLayoutSidebarInsetReverse } from "react-icons/bs";

const getCategoryColors = (category?: string) => {
  switch (category) {
    case 'applications':
      return { bg: 'bg-red-500', hover: 'hover:bg-red-600', light: 'bg-red-50' };
    case 'portfolio':
      return { bg: 'bg-green-500', hover: 'hover:bg-green-600', light: 'bg-green-50' };
    case 'projects':
      return { bg: 'bg-yellow-500', hover: 'hover:bg-yellow-600', light: 'bg-yellow-50' };
    case 'skills':
      return { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', light: 'bg-blue-50' };
    case 'custom':
      return { bg: 'bg-gray-500', hover: 'hover:bg-gray-600', light: 'bg-gray-50' };
    default:
      return { bg: 'bg-gray-500', hover: 'hover:bg-gray-600', light: 'bg-gray-50' };
  }
};


interface CalendarPanelProps {
  tasks: Task[];
  timeBlocks: TimeBlock[];
  onAddTimeBlock: (timeBlock: Omit<TimeBlock, 'id'>) => void;
  onDeleteTimeBlock: (id: string) => void;
  onClearTimeBlocks: () => void;
}

export const CalendarPanel: React.FC<CalendarPanelProps> = ({
  tasks,
  timeBlocks,
  onAddTimeBlock,
  onDeleteTimeBlock,
  onClearTimeBlocks,
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragEnd, setDragEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAgendaExpanded, setIsAgendaExpanded] = useState(true);
  const [width, setWidth] = useState<number>(window.innerWidth);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  function handleWindowSizeChange() {
      setWidth(window.innerWidth);
  }
  useEffect(() => {
      window.addEventListener('resize', handleWindowSizeChange);
      return () => {
          window.removeEventListener('resize', handleWindowSizeChange);
      }
  }, []);

  const isMobile = width <= 1024;

  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Get incomplete tasks (for display purposes)
  const incompleteTasks = tasks.filter(t => !t.completed && !t.oldDay);

  // Get tasks that are incomplete, not from old days, and not scheduled
  const scheduledTaskIds = new Set(timeBlocks.map(block => block.taskId));
  const unscheduledTasks = tasks.filter(t => !t.completed && !t.oldDay && !scheduledTaskIds.has(t.id));

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to current time on mount and when panel expands
  useEffect(() => {
    if (scrollContainerRef.current && isAgendaExpanded) {
      const currentTimePosition = getCurrentTimePosition();
      const scrollPosition = currentTimePosition * 48; // 3rem = 48px
      const containerHeight = scrollContainerRef.current.clientHeight;

      // Center the current time in the viewport
      scrollContainerRef.current.scrollTo({
        top: scrollPosition - containerHeight / 2,
        behavior: 'smooth'
      });
    }
  }, [isAgendaExpanded]);

  // Get current time in user's local timezone
  const getLocalTime = () => {
    return currentTime;
  };

  // Calculate position of current time indicator (0-24 as decimal)
  const getCurrentTimePosition = () => {
    const local = getLocalTime();
    const hours = local.getHours();
    const minutes = local.getMinutes();
    return hours + (minutes / 60);
  };

  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  const handleMouseDown = (hour: number) => {
    if (!selectedTask) return;
    setDragStart(hour);
    setDragEnd(hour);
    setIsDragging(true);
  };

  const handleMouseUp = (hour: number) => {
    if (!selectedTask || dragStart === null) return;

    const startHour = Math.min(dragStart, hour);
    const endHour = Math.max(dragStart, hour) + 1;

    onAddTimeBlock({
      taskId: selectedTask.id,
      taskText: selectedTask.text,
      startHour,
      endHour,
    });

    setDragStart(null);
    setDragEnd(null);
    setIsDragging(false);
    setSelectedTask(null);
  };

  const handleMouseEnter = (hour: number) => {
    if (isDragging) {
      setDragEnd(hour);
    }
  };

  const getBlocksForHour = (hour: number) => {
    return timeBlocks.filter(
      block => hour >= block.startHour && hour < block.endHour
    );
  };

  const isHourInDragRange = (hour: number) => {
    if (!isDragging || dragStart === null || dragEnd === null) return false;
    const min = Math.min(dragStart, dragEnd);
    const max = Math.max(dragStart, dragEnd);
    return hour >= min && hour <= max;
  };

  const todayDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div>
      {/* Toggle button - visible when collapsed */}
      {(!isAgendaExpanded && !isMobile) && (
        <button
          onClick={() => setIsAgendaExpanded(true)}
          className="absolute right-0 top-4 bg-white hover:bg-gray-50 text-gray-600 rounded-l-lg shadow-lg p-2 transition-colors z-10 border border-r-0 border-gray-200"
          aria-label="Expand agenda"
        >
          <FaCalendarDays />
        </button>
      )}

      {/* Main panel with slide animation */}
      <div
        className={`bg-white h-full flex flex-col rounded-2xl transition-all duration-300 ease-in-out ${
          isAgendaExpanded ? 'w-full lg:w-96 opacity-100' : 'w-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className={`p-6 ${incompleteTasks.length > 0 ? "pb-10" : "pb-6"} border-b border-gray-100 flex items-start justify-between`}>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Agenda</h2>
            <p className="text-sm text-gray-500 mt-1">{todayDate}</p>
          </div>
          <div className="flex items-center gap-2">
            {timeBlocks.length > 0 && (
              <button
                onClick={onClearTimeBlocks}
                className="text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors"
              >
                Reset
              </button>
            )}
            {!isMobile &&
              <button
                onClick={() => setIsAgendaExpanded(false)}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-2 transition-colors"
                aria-label="Collapse agenda"
              >
                <BsLayoutSidebarInsetReverse />
              </button>
            }
          </div>
        </div>

        {unscheduledTasks.length > 0 && (
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs text-gray-600 mb-2 font-medium">Select a task to schedule:</p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {unscheduledTasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => setSelectedTask(task.id === selectedTask?.id ? null : task)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedTask?.id === task.id
                      ? 'bg-green-100 text-green-800 border-2 border-green-400'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="font-medium truncate">{task.text}</div>
                  <div className="text-xs opacity-75">{task.time} min</div>
                </button>
              ))}
            </div>
            {selectedTask && (
              <p className="text-xs text-green-600 mt-2 font-medium">
                Click and drag on the calendar to block time
              </p>
            )}
          </div>
        )}

        <div ref={scrollContainerRef} className="flex-1 overflow-auto">
          <div className="relative">
            {hours.map(hour => {
              const blocks = getBlocksForHour(hour);
              const inDragRange = isHourInDragRange(hour);

              return (
                <div
                  key={hour}
                  className="border-b border-gray-100 "
                  onMouseDown={() => handleMouseDown(hour)}
                  onMouseUp={() => handleMouseUp(hour)}
                  onMouseEnter={() => handleMouseEnter(hour)}
                >
                  <div className="flex">
                    <div className="w-20 flex-shrink-0 p-2 text-xs text-gray-500 font-medium border-r border-gray-100 text-right">
                      {formatHour(hour)}
                    </div>
                    <div
                      className={`flex-1 min-h-[3rem] p-2 transition-colors ${
                        inDragRange && selectedTask
                          ? 'bg-green-100'
                          : blocks.length > 0
                          ? getCategoryColors(blocks[0]?.category).light
                          : selectedTask
                          ? 'hover:bg-gray-50 cursor-pointer'
                          : 'bg-white'
                      }`}
                    >
                      {blocks.map(block => {
                        const colors = getCategoryColors(block.category);
                        return (
                          <div
                            key={block.id}
                            className={`${colors.bg} text-white text-xs px-2 py-1 rounded mb-1 flex justify-between items-center group`}
                          >
                            <span className="truncate flex-1">{block.taskText}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteTimeBlock(block.id);
                              }}
                              className="ml-2 opacity-0 group-hover:opacity-100 hover:text-red-200 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Current time indicator */}
            <div
              className="absolute left-0 right-0 pointer-events-none z-10"
              style={{
                top: `${getCurrentTimePosition() * 3}rem`,
                transform: 'translateY(-50%)'
              }}
            >
              <div className="flex items-center">
                <div className="w-20 flex items-center justify-end pr-2">
                  <div className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded font-medium shadow-sm">
                    {getLocalTime().toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </div>
                </div>
                <div className="flex-1 h-0.5 bg-red-500 shadow-sm relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {incompleteTasks.length === 0 && (
          <div className="p-6 text-center text-gray-400 text-sm">
            Add tasks to start time blocking
          </div>
        )}
      </div>
    </div>
  );
};
