# Weekly Study Board

## Outcome

Replace the full-width grammar topic list with a responsive two-column study board: a floppy-disk topic library and a weekly timetable with an upcoming-task summary and editable tasks.

## Constraints

- Preserve the existing pastel retro dashboard language and topic sheet behavior.
- Use real grammar topics and progress already loaded by the page.
- Persist weekly tasks in the browser for this single-user dashboard; do not add a separate task database or fake profile data.
- Stack the two panels cleanly below desktop widths and avoid horizontal scrolling.

## Non-goals

- Syncing with an external calendar.
- Changing the lesson, exercise, progress, or history sections.

## Implementation

1. Derive an automatic seven-day study plan from incomplete grammar topics.
2. Render topic buttons as colorful floppy disks with level and progress.
3. Render the next study session with date, time, remaining work, and topic summary.
4. Render the same sessions in day columns sorted from earliest to latest start time, plus a mobile day list; do not use a vertical time axis.
5. Keep every topic/task button connected to the existing topic detail sheet.
6. Let the learner add, edit, and delete tasks with a date, start/end time, explicit deadline, title, topic, details, and a selectable palette color.
7. Allow an optional task image from the file picker or clipboard paste, resize/compress it in the browser, and show it in the upcoming-task and timetable cards.
8. Persist task changes per study week and validate that end time and deadline follow the start time. Migrate older saved tasks to a default color without losing them.

## Acceptance criteria

- The new area is a 1:1 split at desktop widths and a single column on small screens.
- Vietnamese text renders correctly and no content overflows at 375px.
- The upcoming task and timetable are derived from actual topic/progress data.
- Keyboard focus, hover, and active states are visible.
- Add, edit, and delete controls work on desktop and mobile; destructive deletion requires confirmation.
- Every task exposes its scheduled time and explicit deadline.
- A selected task color is used consistently in every task view.
- An image can be selected or pasted with Ctrl+V/⌘V, previewed, removed, saved, and shown on its task card.
- Within each day, an earlier start time always places the task before later tasks.
- TypeScript, lint, and production build pass.
