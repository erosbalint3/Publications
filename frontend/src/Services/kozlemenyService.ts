import { Kozlemeny } from "../Models/Kozlemeny";

class KozlemenyService {
    async addNewKozlemeny(kozlemeny: Kozlemeny) {
        const headers = {"Content-Type": "application/json", "Allow-Origin-Access-Control": "*"};
        const requestOption = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(kozlemeny)
        };
        const response = await fetch(`http://localhost:3001/kozlemeny/`, requestOption);
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
        const requestOption = {
            method: 'DELETE',
            headers: headers,
            body: JSON.stringify(kozlemeny)
        };
        const response = await fetch(`http://localhost:3001/kozlemeny/`, requestOption);
        return await response.json();
    };

    async saveKozlemeny(kozlemeny: Kozlemeny): Promise<Kozlemeny> {
        const headers = {"Content-Type": "application/json", "Allow-Origin-Access-Control": "*"};
        const response = await fetch(`http://localhost:3001/kozlemeny/`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(kozlemeny)
        });
        return await response.json();
    };

    async getKozlemenyByKiado(kiado: string) {
        const headers = {"Content-Type": "application/json", "Allow-Origin-Access-Control": "*"};
        const response = await fetch(`http://localhost:3001/kozlemeny/kiado/?kiado=${encodeURIComponent(kiado)}`, {
            method: 'GET',
            headers: headers
        });
        return await response.json();
    }

    async getKozlemenyByTipus(felhasznalonev: string, tipus: string) {
        const headers = {"Content-Type": "application/json", "Allow-Origin-Access-Control": "*"};
        const response = await fetch(`http://localhost:3001/kozlemeny/tipus/?tipus=${encodeURIComponent(JSON.stringify({felhasznalonev: felhasznalonev, tipus: tipus}))}`, {
            method: 'GET',
            headers: headers
        });
        return await response.json();
    }
}

export default KozlemenyService;