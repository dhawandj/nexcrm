import { MOCK_CONTACTS, MOCK_DEALS, MOCK_TASKS, MOCK_USER, MOCK_ORG, MOCK_TEAM, MOCK_NOTIFICATIONS } from './mockData';
import { Contact, Deal, Task, User, Organization, Notification } from '../types';

const KEYS = {
  CONTACTS: 'nexus_contacts',
  DEALS: 'nexus_deals',
  TASKS: 'nexus_tasks',
  USER: 'nexus_user',
  ORG: 'nexus_org',
  TEAM: 'nexus_team',
  NOTIFICATIONS: 'nexus_notifications'
};

function load<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error loading ${key} from storage`, e);
    return fallback;
  }
}

function save<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to storage`, e);
  }
}

export const storage = {
  getContacts: () => load<Contact[]>(KEYS.CONTACTS, MOCK_CONTACTS),
  saveContacts: (data: Contact[]) => save(KEYS.CONTACTS, data),

  getDeals: () => load<Deal[]>(KEYS.DEALS, MOCK_DEALS),
  saveDeals: (data: Deal[]) => save(KEYS.DEALS, data),

  getTasks: () => load<Task[]>(KEYS.TASKS, MOCK_TASKS),
  saveTasks: (data: Task[]) => save(KEYS.TASKS, data),

  getUser: () => load<User>(KEYS.USER, MOCK_USER),
  saveUser: (data: User) => save(KEYS.USER, data),

  getOrg: () => load<Organization>(KEYS.ORG, MOCK_ORG),
  saveOrg: (data: Organization) => save(KEYS.ORG, data),

  getTeam: () => load<any[]>(KEYS.TEAM, MOCK_TEAM),
  saveTeam: (data: any[]) => save(KEYS.TEAM, data),

  getNotifications: () => load<Notification[]>(KEYS.NOTIFICATIONS, MOCK_NOTIFICATIONS),
  saveNotifications: (data: Notification[]) => save(KEYS.NOTIFICATIONS, data),
};