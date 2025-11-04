# Job Hunt Coach

A React TypeScript app to help you stay focused and productive during your job search journey.

## Features

- **Task Management**: Add tasks with time estimates (supports formats like 30m, 1h, 1.5h)
- **Smart Coach Messages**: Context-aware messages based on time of day and completion status
- **Reality Check**: Weekly activity tracking to keep you accountable
- **Editable Suggestions**: Four categories with customizable suggestions
  - Applications 📝
  - Portfolio 💼
  - Projects 🚀
  - Skills 📚
- **Local Storage**: All data persists in your browser
- **Soft, Focus Mode Design**: Beautiful glass morphism UI with gradient backgrounds

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

1. **Add Tasks**: Type a task name and optionally include time estimate in parentheses, e.g., "Apply to 5 companies (1h)"
2. **Quick Add from Suggestions**: Click any suggestion card to instantly add it to your task list
3. **Track Time**: The sidebar shows total time for incomplete tasks
4. **Complete Tasks**: Click the checkbox to mark tasks as done
5. **Delete Tasks**: Hover over a task and click the X button
6. **Edit Suggestions**: Click "Edit" on any category to customize, add, delete, or reset suggestions

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Local Storage API

## Design Philosophy

Soft, rounded focus mode aesthetic with:
- Glass morphism effects
- Gradient backgrounds (gray-50 via blue-50 to purple-50)
- Rounded corners throughout (rounded-2xl, rounded-3xl)
- Subtle shadows and borders
- Contained layout with no scrolling on main view (90vh height)
