import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProjectSchema, type CreateProjectInput } from '@task-manager/shared';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

interface ProjectFormProps {
  onSubmit: (data: CreateProjectInput) => Promise<void>;
  initialData?: Partial<CreateProjectInput>;
  onCancel?: () => void;
}

const PRESET_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
];

export function ProjectForm({ onSubmit, initialData, onCancel }: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      color: PRESET_COLORS[0],
      ...initialData,
    },
  });

  const selectedColor = watch('color');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Project Name"
        placeholder="Enter project name"
        error={errors.name?.message}
        {...register('name')}
      />

      <div>
        <label className="label">Description</label>
        <textarea
          className="input min-h-[60px] resize-y"
          placeholder="Optional description"
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="label">Color</label>
        <div className="flex gap-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setValue('color', color)}
              className={`w-8 h-8 rounded-full transition-transform ${
                selectedColor === color ? 'ring-2 ring-offset-2 ring-primary-500 scale-110' : ''
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          {initialData?.name ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}
