
export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
}

export interface ProjectFormData {
  name: string;
  description?: string;
}
