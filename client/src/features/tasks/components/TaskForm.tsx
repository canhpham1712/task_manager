import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTaskSchema, type CreateTaskInput, TaskStatus, TaskPriority } from '@task-manager/shared';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

interface TaskFormProps {
  onSubmit: (data: CreateTaskInput) => Promise<void>;
  initialData?: Partial<CreateTaskInput>;
  onCancel?: () => void;
}

export function TaskForm({ onSubmit, initialData, onCancel }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      ...initialData,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Title"
        placeholder="Task title"
        error={errors.title?.message}
        {...register('title')}
      />

      <div>
        <label className="label">Description</label>
        <textarea
          className="input min-h-[80px] resize-y"
          placeholder="Optional description"
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Status</label>
          <select className="input" {...register('status')}>
            <option value={TaskStatus.TODO}>To Do</option>
            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
            <option value={TaskStatus.DONE}>Done</option>
          </select>
        </div>
        <div>
          <label className="label">Priority</label>
          <select className="input" {...register('priority')}>
            <option value={TaskPriority.LOW}>Low</option>
            <option value={TaskPriority.MEDIUM}>Medium</option>
            <option value={TaskPriority.HIGH}>High</option>
            <option value={TaskPriority.URGENT}>Urgent</option>
          </select>
        </div>
      </div>

      <Input
        label="Due Date"
        type="datetime-local"
        {...register('dueDate')}
      />

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          {initialData?.title ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
