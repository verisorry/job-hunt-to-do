# Job Hunt Coach

A React TypeScript app to help you stay focused and productive during your job search journey.

Motivation: I created this when I was feeling overwhelmed and distracted during my job search process. I grew up with my mother always telling me to write a list of what I need to accomplish today down and then blocking out times on a daily agenda for each item. It must've worked because even now, 20 years later, whenever I feel overwhelmed, I still look to pen and paper and a daily agenda to help me get my shit together. This is an attempt at making that exact process digital to save trees.

*Disclaimer: the following README was written by AI*

## Features

### Task Management
- **Smart Inbox**: Add tasks with time estimates (supports formats like 30m, 1h, 1.5h)
- **Collapsible Sidebar**: Toggle the task inbox on mobile and desktop for more screen space
- **Time Tracking**: Automatic calculation of total time for incomplete tasks
- **Quick Actions**: Complete, delete, or reset tasks with intuitive controls
- **Daily Reset**: Automatically separates old tasks from today's list

### Time Blocking Calendar
- **Collapsible Agenda Panel**: Expandable 24-hour calendar grid with smooth animations
- **Drag-to-Schedule**: Click and drag across hours to schedule task time blocks
- **Visual Time Blocks**: Color-coded blocks show your scheduled tasks
- **Live Time Indicator**: Red line shows current time (Central Time Zone)
- **Unscheduled Tasks**: See which tasks still need time slots

### Smart Coach
- **Context-Aware Messages**: Dynamic coaching based on time of day and completion status
- **Reality Check**: Weekly activity tracking to keep you accountable
- **Editable Suggestions**: Four categories with customizable suggestions
  - Applications 📝
  - Portfolio 💼
  - Projects 🚀
  - Skills 📚
- **One-Click Add**: Click any suggestion card to instantly add it to your task list

### Responsive Design
- **Mobile-First**: Fully responsive layout that adapts to any screen size
- **Collapsible Panels**: Save screen space on mobile devices
- **Touch-Friendly**: Optimized for both desktop and mobile interactions

### Data Persistence
- **Local Storage**: All data persists in your browser (tasks, time blocks, and suggestions)

*Human disclaimer: I just didn't want to deal with a db so decided to use local storage*

## Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Usage

### Task Management
1. **Add Tasks**: Type a task name and optionally include time estimate in parentheses, e.g., "Apply to 5 companies (1h)"
2. **Quick Add from Suggestions**: Click any suggestion card to instantly add it to your task list
3. **Track Time**: The sidebar shows total time for incomplete tasks in a green badge
4. **Complete Tasks**: Click the checkbox to mark tasks as done
5. **Delete Tasks**: Hover over a task and click the X button
6. **Reset Tasks**: Click "Reset" to clear all incomplete tasks

### Time Blocking
1. **Open Calendar**: Click the calendar icon to expand the agenda panel
2. **Schedule Tasks**: Select an unscheduled task, then click and drag across hours to create a time block
3. **View Schedule**: See all your scheduled time blocks with color coding
4. **Remove Blocks**: Hover over a time block and click the X to delete it
5. **Collapse Panel**: Click the collapse icon to hide the calendar and maximize your workspace

### Customization
1. **Edit Suggestions**: Click "Edit" on any category to customize, add, delete, or reset suggestions
2. **Toggle Panels**: Use collapse buttons to show/hide the sidebar and calendar as needed

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- React Icons
- Vite
- Local Storage API
