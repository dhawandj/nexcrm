import { Contact, Deal, DealStage, Organization, Task, TaskStatus, User, Notification } from "../types";

export const MOCK_ORG: Organization = {
  id: 1,
  name: "Acme Corp",
  plan: "pro"
};

export const MOCK_USER: User = {
  id: 101,
  name: "Jane Doe",
  email: "jane@acme.test",
  avatar: "https://i.pravatar.cc/150?u=jane",
  role: "admin",
  organization_id: 1
};

export const MOCK_CONTACTS: Contact[] = [
  { id: 1, name: "Alice Smith", email: "alice@tech.com", phone: "+1-555-0101", company: "Tech Solutions", last_activity: "2h ago", tags: ["lead", "tech"] },
  { id: 2, name: "Bob Jones", email: "bob@construction.co", phone: "+1-555-0102", company: "BuildIt Inc", last_activity: "1d ago", tags: ["client"] },
  { id: 3, name: "Charlie Day", email: "charlie@finance.org", phone: "+1-555-0103", company: "Money Matters", last_activity: "3d ago", tags: ["cold"] },
  { id: 4, name: "Diana Prince", email: "diana@amazon.com", phone: "+1-555-0104", company: "Themyscira Ltd", last_activity: "5m ago", tags: ["vip", "referral"] },
  { id: 5, name: "Evan Wright", email: "evan@write.net", phone: "+1-555-0105", company: "Ink Press", last_activity: "1w ago", tags: [] },
];

export const MOCK_DEALS: Deal[] = [
  { id: 1, title: "Enterprise License", value: 50000, stage: DealStage.PROPOSAL, contact_id: 1, owner_id: 101, expected_close: "2023-12-01" },
  { id: 2, title: "Consulting Retainer", value: 12000, stage: DealStage.NEGOTIATION, contact_id: 2, owner_id: 101, expected_close: "2023-11-15" },
  { id: 3, title: "Small Widget Order", value: 500, stage: DealStage.WON, contact_id: 3, owner_id: 101, expected_close: "2023-10-20" },
  { id: 4, title: "Cloud Migration", value: 85000, stage: DealStage.NEW, contact_id: 4, owner_id: 101, expected_close: "2024-01-15" },
  { id: 5, title: "Website Redesign", value: 8000, stage: DealStage.QUALIFIED, contact_id: 5, owner_id: 101, expected_close: "2023-11-30" },
];

export const MOCK_TASKS: Task[] = [
  { id: 1, title: "Call Alice about proposal", due_date: "Today", status: TaskStatus.TODO, priority: "high", assigned_to: 101 },
  { id: 2, title: "Send invoice to Bob", due_date: "Tomorrow", status: TaskStatus.IN_PROGRESS, priority: "medium", assigned_to: 101 },
  { id: 3, title: "Update CRM records", due_date: "Next Week", status: TaskStatus.DONE, priority: "low", assigned_to: 101 },
];

export const MOCK_TEAM = [
  { id: 1, name: 'Jane Doe', email: 'jane@acme.test', role: 'Admin', status: 'Active' },
  { id: 2, name: 'John Smith', email: 'john@acme.test', role: 'User', status: 'Active' },
  { id: 3, name: 'Sarah Wilson', email: 'sarah@acme.test', role: 'User', status: 'Invited' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1, title: 'New Lead Assigned', message: 'You have been assigned a new lead: Sarah Connor.', time: '2 min ago', read: false, type: 'info' },
  { id: 2, title: 'Task Due Soon', message: 'Call Alice about proposal is due in 1 hour.', time: '1 hour ago', read: false, type: 'warning' },
  { id: 3, title: 'Deal Won', message: 'Congratulations! You closed the "Small Widget Order" deal.', time: 'Yesterday', read: true, type: 'success' },
];