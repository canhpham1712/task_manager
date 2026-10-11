import React from 'react';
import { TaskCard } from './TaskCard';
import type { TaskResponse } from '@task-manager/shared';

interface TaskListProps {
  tasks: TaskResponse[];
  onEdit?: (task: TaskResponse) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-4 text-lg font-medium">No tasks found</h3>
        <p className="mt-1 text-sm text-gray-500">Create a new task or adjust your filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
