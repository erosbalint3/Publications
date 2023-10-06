import { Kozlemeny } from "../Models/Kozlemeny";

class KozlemenyService {
    async addNewKozlemeny(kozlemeny: Kozlemeny) {
        const headers = {"Content-Type": "application/json", "Allow-Origin-Access-Control": "*"};
        const response = await fetch(`http://localhost:3001/kozlemeny/?kozlemeny=${encodeURIComponent(JSON.stringify(kozlemeny))}`, {
            method: 'POST',
            headers: headers
        });
        return await response.json();
    };

    async getAllKozlemeny() {
        const headers = {"Content-Type": "application/json", "Allow-Origin-Access-Control": "*"};
        const response = await fetch(`http://localhost:3001/kozlemeny`, {
            method: 'GET',
            headers: headers
        });
        return await response.json();
    };

    async deleteKozlemeny(kozlemeny: Kozlemeny) {
        const headers = {"Content-Type": "application/json", "Allow-Origin-Access-Control": "*"};
        const response = await fetch(`http://localhost:3001/kozlemeny/?kozlemeny=${encodeURIComponent(JSON.stringify(kozlemeny))}`, {
            method: 'DELETE',
            headers: headers
        });
        return await response.json();
    };

    async saveKozlemeny(kozlemeny: Kozlemeny) {
        const headers = {"Content-Type": "application/json", "Allow-Origin-Access-Control": "*"};
        const response = await fetch(`http://localhost:3001/kozlemeny/?kozlemeny=${encodeURIComponent(JSON.stringify(kozlemeny))}`, {
            method: 'PUT',
            headers: headers
        });
        return await response.json();
    };
}

export default KozlemenyService;