import { createElement } from './mini-react.js';
import { useState } from './reactive-engine.js';

let nextTaskId = 3;

export function TaskApp() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Review PR', completed: false },
    { id: 2, text: 'Verify AST', completed: false },
  ]);
  const [filter, setFilter] = useState('ALL');

  const addTask = (event) => {
    if (event?.type === 'keydown' && event.key !== 'Enter') return;
    if (event?.type === 'keydown') event.preventDefault();

    const input = document.getElementById('new-task');
    const text = input?.value.trim();
    if (!text) return;

    setTasks((currentTasks) => [
      ...currentTasks,
      { id: nextTaskId++, text, completed: false },
    ]);
  };

  const filters = [
    ['ALL', 'All'],
    ['ACTIVE', 'Active'],
    ['COMPLETED', 'Completed'],
  ];
  const visibleTasks = tasks.filter((task) => {
    if (filter === 'ACTIVE') return !task.completed;
    if (filter === 'COMPLETED') return task.completed;
    return true;
  });

  return createElement(
    'main',
    { className: 'task-manager' },
    createElement('h1', null, 'Task Manager'),
    createElement(
      'label',
      { 'for': 'new-task' },
      'New task',
    ),
    createElement('input', {
      id: 'new-task',
      type: 'text',
      onKeydown: addTask,
    }),
    createElement('button', { type: 'button', onClick: addTask }, 'Add task'),
    createElement(
      'fieldset',
      null,
      createElement('legend', null, 'Filter tasks'),
      filters.map(([value, label]) =>
        createElement(
          'button',
          {
            type: 'button',
            'aria-pressed': String(filter === value),
            onClick: () => setFilter(value),
          },
          label,
        ),
      ),
    ),
    visibleTasks.length
      ? createElement(
          'ul',
          null,
          visibleTasks.map((task) =>
            createElement(
              'li',
              { key: task.id },
              createElement(
                'span',
                null,
                `${task.text}${task.completed ? ' (completed)' : ''}`,
              ),
              createElement(
                'button',
                {
                  type: 'button',
                  onClick: () =>
                    setTasks((currentTasks) =>
                      currentTasks.map((currentTask) =>
                        currentTask.id === task.id
                          ? { ...currentTask, completed: !currentTask.completed }
                          : currentTask,
                      ),
                    ),
                },
                task.completed ? 'Mark active' : 'Complete',
              ),
            ),
          ),
        )
      : createElement('p', null, 'No tasks match this filter.'),
  );
}
