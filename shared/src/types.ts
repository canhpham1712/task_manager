export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

// --- User ---
export interface UserResponse {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// --- Task ---
export interface TaskResponse {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  projectId: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  project?: ProjectResponse | null;
  tags?: TagResponse[];
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  projectId?: string;
  tagIds?: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  projectId?: string;
  tagIds?: string[];
}

export interface TaskQueryParams {
  page?: number;
  limit?: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'dueDate' | 'title' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

// --- Project ---
export interface ProjectResponse {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    tasks: number;
  };
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  color?: string;
}

// --- Tag ---
export interface TagResponse {
  id: string;
  name: string;
  color: string | null;
  userId: string;
  createdAt: string;
}

export interface CreateTagInput {
  name: string;
  color?: string;
}

// --- Generic ---
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

// --- Auth tokens ---
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
