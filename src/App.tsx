import { useState, useEffect } from 'react';
import { Task, Activities, CoachData } from './types';
import { Sidebar } from './components/Sidebar';
import { CoachPanel } from './components/CoachPanel';
import { loadCoachData, saveCoachData } from './utils/storage';
import { parseTimeToMinutes } from './utils/time';

function App() {
  const [data, setData] = useState<CoachData>(() => loadCoachData());

  useEffect(() => {
    saveCoachData(data);
  }, [data]);

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'oldDay'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      oldDay: false,
    };

    setData((prev) => {
      const today = new Date().toDateString();
      const isNewDay = prev.lastActiveDate !== today;

      return {
        ...prev,
        tasks: [...prev.tasks, newTask],
        lastActiveDate: today,
        weeklyActivityCount: isNewDay ? prev.weeklyActivityCount + 1 : prev.weeklyActivityCount,
      };
    });
  };

  const handleToggleTask = (id: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    }));
  };

  const handleDeleteTask = (id: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.id !== id),
    }));
  };

  const handleResetIncompleteTasks = () => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.completed || task.oldDay),
    }));
  };

  const handleAddTaskFromSuggestion = (text: string, time: string) => {
    const minutes = parseTimeToMinutes(time);
    handleAddTask({ text, time: minutes, completed: false });
  };

  const handleUpdateActivities = (activities: Activities) => {
    setData((prev) => ({
      ...prev,
      activities,
    }));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 p-4 gap-4 md:flex-row">
      <Sidebar
        tasks={data.tasks}
        onAddTask={handleAddTask}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
        onResetIncompleteTasks={handleResetIncompleteTasks}
      />
      <CoachPanel
        activities={data.activities}
        tasks={data.tasks}
        onAddTaskFromSuggestion={handleAddTaskFromSuggestion}
        onUpdateActivities={handleUpdateActivities}
      />
    </div>
  );
}

export default App;
