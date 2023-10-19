import { Kozlemeny } from "../Models/Kozlemeny";
import { Szerzo } from "../Models/Szerzo";

class SzerzoService {
    async addNewSzerzo(szerzo: any) {
        const headers = {"Content-Type": "application/json", "Allow-Origin-Access-Control": "*"};
        const response = await fetch(`http://localhost:3001/szerzo/?szerzo=${encodeURIComponent(JSON.stringify(szerzo))}`, {
            method: 'POST',
            headers: headers
        });
        return await response.json();
    }

    async getAllSzerzo() {
        const headers = {"Content-Type": "application/json", "Allow-Origin-Access-Control": "*"};
        const response = await fetch(`http://localhost:3001/szerzo`, {
            method: 'GET',
            headers: headers
        });
        return await response.json();
    }

    async getSzerzoByKozlemeny(kozlemeny: string): Promise<Szerzo[]> {
        const headers = {"Content-Type": "application/json", "Allow-Origin-Access-Control": "*"};
        const response = await fetch(`http://localhost:3001/szerzo/kozlemeny/?kozlemeny=${encodeURIComponent(kozlemeny)}`, {
            method: 'GET',
            headers: headers
        });
        return await response.json();
    }

    async deleteSzerzo(szerzo: any) {
        const headers = {"Content-Type": "application/json", "Allow-Origin-Access-Control": "*"};
        const response = await fetch(`http://localhost:3001/szerzo/?szerzo=${encodeURIComponent(JSON.stringify(szerzo))}`, {
            method: 'DELETE',
            headers: headers
        });
        return await response.json();
    }

    async saveSzerzo(szerzo: any) {
        const headers = {"Content-Type": "application/json", "Allow-Origin-Access-Control": "*"};
        const response = await fetch(`http://localhost:3001/szerzo/?szerzo=${encodeURIComponent(JSON.stringify(szerzo))}`, {
            method: 'PUT',
            headers: headers
        });
        return await response.json();
    }
}

export default SzerzoService;