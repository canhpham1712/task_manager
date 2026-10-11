import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { TaskResponse, CreateTaskInput, UpdateTaskInput, PaginatedResponse } from '@task-manager/shared';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { TaskForm } from '../features/tasks/components/TaskForm';
import { TaskList } from '../features/tasks/components/TaskList';
import { TaskFilter } from '../features/tasks/components/TaskFilter';
import { apiGet, apiPost, apiPatch, apiDelete } from '../api/client';

export function TaskListPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskResponse | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useQuery<PaginatedResponse<TaskResponse>>({
    queryKey: ['tasks', statusFilter, priorityFilter, searchQuery],
    queryFn: () =>
      apiGet<PaginatedResponse<TaskResponse>>('/tasks', {
        ...(statusFilter && { status: statusFilter }),
        ...(priorityFilter && { priority: priorityFilter }),
        ...(searchQuery && { search: searchQuery }),
      }),
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateTaskInput) => apiPost<TaskResponse>('/tasks', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      apiPatch<TaskResponse>(`/tasks/${id}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setEditingTask(null);
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleSubmit = async (data: CreateTaskInput) => {
    if (editingTask) {
      await updateMutation.mutateAsync({ id: editingTask.id, input: data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleEdit = (task: TaskResponse) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteMutation.mutate(taskId);
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and organize your tasks.</p>
        </div>
        <button className="btn-primary" onClick={openCreateModal}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <TaskFilter
          status={statusFilter}
          priority={priorityFilter}
          search={searchQuery}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Task List */}
      {isLoading ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">Loading tasks...</p>
          </div>
        </Card>
      ) : (
        <TaskList
          tasks={data?.items ?? []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingTask ? 'Edit Task' : 'Create Task'}>
        <TaskForm
          onSubmit={handleSubmit}
          initialData={
            editingTask
              ? {
                  title: editingTask.title,
                  description: editingTask.description ?? undefined,
                  status: editingTask.status,
                  priority: editingTask.priority,
                  dueDate: editingTask.dueDate ?? undefined,
                  projectId: editingTask.projectId ?? undefined,
                }
              : undefined
          }
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}
