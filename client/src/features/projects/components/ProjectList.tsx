import React from 'react';
import type { ProjectResponse } from '@task-manager/shared';
import { Card } from '../../../components/ui/Card';

interface ProjectListProps {
  projects: ProjectResponse[];
  onSelect?: (project: ProjectResponse) => void;
  onEdit?: (project: ProjectResponse) => void;
  onDelete?: (projectId: string) => void;
  onCreateNew?: () => void;
}

export function ProjectList({ projects, onSelect, onEdit, onDelete, onCreateNew }: ProjectListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card
          key={project.id}
          hoverable
          onClick={() => onSelect?.(project)}
          className="relative group"
        >
          <div className="flex items-start gap-3">
            <div
              className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
              style={{ backgroundColor: project.color || '#6b7280' }}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{project.name}</h3>
              {project.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {project.description}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                {project._count?.tasks ?? 0} tasks
              </p>
            </div>
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit?.(project); }}
              className="p-1 rounded text-gray-400 hover:text-primary-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete?.(project.id); }}
              className="p-1 rounded text-gray-400 hover:text-red-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </Card>
      ))}

      {/* Create new card */}
      <Card
        hoverable
        onClick={onCreateNew}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500 transition-colors cursor-pointer"
      >
        <div className="text-center py-8">
          <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <p className="mt-3 text-sm font-medium text-gray-500">Create Project</p>
        </div>
      </Card>
    </div>
  );
}
