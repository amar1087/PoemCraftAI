import { users, poems, type User, type InsertUser, type Poem, type InsertPoem } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createPoem(poem: InsertPoem): Promise<Poem>;
  getRecentPoems(limit?: number): Promise<Poem[]>;
  getPoemById(id: number): Promise<Poem | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private poems: Map<number, Poem>;
  private currentUserId: number;
  private currentPoemId: number;

  constructor() {
    this.users = new Map();
    this.poems = new Map();
    this.currentUserId = 1;
    this.currentPoemId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createPoem(insertPoem: InsertPoem): Promise<Poem> {
    const id = this.currentPoemId++;
    const poem: Poem = {
      ...insertPoem,
      id,
      createdAt: new Date(),
      names: insertPoem.names || null,
      childrenTheme: insertPoem.childrenTheme || null,
      childrenOptions: insertPoem.childrenOptions || null,
      learningTopic: insertPoem.learningTopic || null,
    };
    this.poems.set(id, poem);
    return poem;
  }

  async getRecentPoems(limit: number = 10): Promise<Poem[]> {
    const allPoems = Array.from(this.poems.values());
    return allPoems
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getPoemById(id: number): Promise<Poem | undefined> {
    return this.poems.get(id);
  }
}

export const storage = new MemStorage();
