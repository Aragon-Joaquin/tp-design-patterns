import { User } from "../../models/userModel";

interface IUserRepository {
    getByUserId(id: string): User | undefined
    update(user: User): void
    getByApiKey(apiKey: string): User | undefined
}


export class UserRepository implements IUserRepository {
    constructor(private data: Map<string, User> = new Map()) { }

    getByUserId(id: string): User | undefined {
        return this.data.get(id);
    }

    update(user: User): void {
        this.data.set(user.id, user);
    }

    getByApiKey(apiKey: string): User | undefined {
        return Array.from(this.data.values()).find(
            (user) => user.apiKey === apiKey
        );
    }
}

