import { Error } from "../Models/Error";
import { User } from "../Models/User";

class UserService {
    async getUser(userName: string): Promise<User[] | Error> {
        const data = {felhasznalonev: userName};
        const headers = {'Content-Type': 'application/json', 'Allow-Origin-Access-Control': '*'};
        const response = await fetch(`http://localhost:3001/user/?felhasznalonev=${encodeURIComponent(data.felhasznalonev)}`, {
            method: 'GET',
            headers: headers,
        });
        return await response.json();
    }

    async registerUser(user: User): Promise<User[] | Error> {
        const headers = {'Content-Type': 'application/json', 'Allow-Origin-Access-Control': '*'};
        const response = await fetch(`http://localhost:3001/user/?user=${encodeURIComponent(JSON.stringify(user))}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(user)
        });
        return await response.json();
    }

    async deleteUser(user: User): Promise<User[] | Error> {
        const headers = {'Content-Type': 'application/json', 'Allow-Origin-Access-Control': '*'};
        const response = await fetch(`http://localhost:3001/user/?user=${encodeURIComponent(JSON.stringify(user))}`, {
            method: 'DELETE',
            headers: headers,
        });
        return await response.json();
    }

    async saveUser(user: User): Promise<User[] | Error> {
        const headers = {'Content-Type': 'application/json', 'Allow-Origin-Access-Control': '*'};
        const response = await fetch(`http://localhost:3001/user/?user=${encodeURIComponent(JSON.stringify(user))}`, {
            method: 'PUT',
            headers: headers,
        });
        return await response.json();
    }

    async getAllUser(): Promise<User[] | Error> {
        const headers = {'Content-Type': 'application/json', 'Allow-Origin-Access-Control': '*'};
        const response = await fetch(`http://localhost:3001/user/all`, {
            method: 'GET',
            headers: headers,
        });
        return await response.json();
    }
}

export default UserService;