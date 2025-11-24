export enum DealStage {
  NEW = 'New',
  QUALIFIED = 'Qualified',
  PROPOSAL = 'Proposal',
  NEGOTIATION = 'Negotiation',
  WON = 'Won',
  LOST = 'Lost'
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done'
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'user';
  organization_id: number;
}

export interface Organization {
  id: number;
  name: string;
  plan: 'free' | 'pro';
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  last_activity: string;
  tags: string[];
}

export interface Deal {
  id: number;
  title: string;
  value: number;
  stage: DealStage;
  contact_id: number;
  owner_id: number;
  expected_close: string;
}

export interface Task {
  id: number;
  title: string;
  due_date: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  assigned_to: number;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'alert';
}