import React from 'react';
import type { TaskStatus, TaskPriority } from '@task-manager/shared';

interface TaskFilterProps {
  status: string;
  priority: string;
  search: string;
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority: string) => void;
  onSearchChange: (search: string) => void;
}

export function TaskFilter({
  status,
  priority,
  search,
  onStatusChange,
  onPriorityChange,
  onSearchChange,
}: TaskFilterProps) {
  return (
    <div className="flex gap-3 flex-wrap">
      <select
        className="input w-auto"
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
      </select>

      <select
        className="input w-auto"
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value)}
      >
        <option value="">All Priority</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="URGENT">Urgent</option>
      </select>

      <input
        type="text"
        placeholder="Search tasks..."
        className="input w-auto flex-1 min-w-[200px]"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
