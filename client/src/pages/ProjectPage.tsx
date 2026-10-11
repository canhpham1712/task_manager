import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProjectResponse, CreateProjectInput, UpdateProjectInput } from '@task-manager/shared';
import { Modal } from '../components/ui/Modal';
import { ProjectForm } from '../features/projects/components/ProjectForm';
import { ProjectList } from '../features/projects/components/ProjectList';
import { apiGet, apiPost, apiPatch, apiDelete } from '../api/client';

export function ProjectPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectResponse | null>(null);

  const { data: projects, isLoading } = useQuery<ProjectResponse[]>({
    queryKey: ['projects'],
    queryFn: () => apiGet<ProjectResponse[]>('/projects'),
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateProjectInput) => apiPost<ProjectResponse>('/projects', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProjectInput }) =>
      apiPatch<ProjectResponse>(`/projects/${id}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setEditingProject(null);
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const handleSubmit = async (data: CreateProjectInput) => {
    if (editingProject) {
      await updateMutation.mutateAsync({ id: editingProject.id, input: data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleEdit = (project: ProjectResponse) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteMutation.mutate(projectId);
    }
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Organize tasks by project.</p>
          </div>
          <button className="btn-primary" onClick={openCreateModal}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </button>
        </div>
        <div className="text-center py-12 text-gray-500">Loading projects...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Organize tasks by project.</p>
        </div>
        <button className="btn-primary" onClick={openCreateModal}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Project
        </button>
      </div>

      <ProjectList
        projects={projects ?? []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreateNew={openCreateModal}
      />

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingProject ? 'Edit Project' : 'Create Project'}>
        <ProjectForm
          onSubmit={handleSubmit}
          initialData={
            editingProject
              ? {
                  name: editingProject.name,
                  description: editingProject.description ?? undefined,
                  color: editingProject.color ?? undefined,
                }
              : undefined
          }
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}
