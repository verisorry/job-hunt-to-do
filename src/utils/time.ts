export const parseTimeToMinutes = (timeStr: string): number => {
  const trimmed = timeStr.trim().toLowerCase();

  // Match patterns like "30m", "1h", "1.5h", "30-45 min", "45-60 min"
  const rangeMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*(min|h|hour|minute)/);
  if (rangeMatch) {
    const [, min, max, unit] = rangeMatch;
    const avgValue = (parseFloat(min) + parseFloat(max)) / 2;
    if (unit.startsWith('h')) {
      return avgValue * 60;
    }
    return avgValue;
  }

  // Match single values like "30m", "1h", "1.5h"
  const singleMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*(m|h|min|hour|minute)/);
  if (singleMatch) {
    const [, value, unit] = singleMatch;
    const numValue = parseFloat(value);
    if (unit.startsWith('h')) {
      return numValue * 60;
    }
    return numValue;
  }

  return 0;
};

export const formatMinutes = (minutes: number): string => {
  if (minutes === 0) return '0m';

  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (hours === 0) {
    return `${mins}m`;
  }

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
};

export const getTimeOfDayGreeting = (): string => {
  const hour = new Date().getHours();

  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};
