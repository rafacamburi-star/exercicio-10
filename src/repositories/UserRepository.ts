import { promises as fs } from "fs";
import { join } from "path";
import { AppError } from "../errors/AppError";

export interface User {
  id: number;
  name: string;
  email: string;
}

export class UserRepository {
  private filePath = join(__dirname, "../../data/users.json");

  constructor() {
    this.ensureFile();
  }

  private async ensureFile() {
    try {
      await fs.access(this.filePath);
    } catch {
      await fs.writeFile(this.filePath, JSON.stringify([]));
    }
  }

  public async getAll(): Promise<User[]> {
    const data = await fs.readFile(this.filePath, "utf-8");
    return JSON.parse(data) as User[];
  }

  public async getById(id: number): Promise<User | null> {
    const users = await this.getAll();
    return users.find((u) => u.id === id) || null;
  }

  public async create(user: Omit<User, "id">): Promise<User> {
    const users = await this.getAll();
    const newUser: User = {
      id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
      ...user,
    };
    users.push(newUser);
    await fs.writeFile(this.filePath, JSON.stringify(users, null, 2));
    return newUser;
  }

  public async delete(id: number): Promise<void> {
    const users = await this.getAll();
    const filtered = users.filter((u) => u.id !== id);
    if (users.length === filtered.length) {
      throw new AppError(`Usuário com id ${id} não encontrado`, 404);
    }
    await fs.writeFile(this.filePath, JSON.stringify(filtered, null, 2));
  }
}
