import React from 'react';
import { TaskResponse, TaskStatus, TaskPriority } from '@task-manager/shared';
import { Card } from '../../../components/ui/Card';
import { formatDate, isOverdue, getStatusColor, getPriorityColor } from '../../../lib/utils';

interface TaskCardProps {
  task: TaskResponse;
  onEdit?: (task: TaskResponse) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate) && task.status !== TaskStatus.DONE;

  return (
    <Card hoverable className="group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium truncate">{task.title}</h3>
            {overdue && (
              <span className="text-xs text-red-500 font-medium flex-shrink-0">Overdue</span>
            )}
          </div>
          {task.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
              {task.status.replace('_', ' ')}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            {task.dueDate && (
              <span className={`text-xs ${overdue ? 'text-red-500' : 'text-gray-500'}`}>
                {formatDate(task.dueDate)}
              </span>
            )}
            {task.project && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: task.project.color || '#6b7280' }}
                />
                {task.project.name}
              </span>
            )}
          </div>
          {task.tags && task.tags.length > 0 && (
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              {task.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-xs"
                  style={{
                    backgroundColor: tag.color ? `${tag.color}20` : undefined,
                    color: tag.color || undefined,
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit?.(task); }}
            className="p-1 rounded text-gray-400 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(task.id); }}
            className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </Card>
  );
}
