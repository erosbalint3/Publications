import { Kiado } from "../Models/Kiado";

class KiadoService {
    async addNewKiado(kiado: Kiado) {
        const headers = {"Content-Type": "application/json", "Allow-Origin-Access-Control": "*"};
        const response = await fetch(`http://localhost:3001/kiado/?kiado=${encodeURIComponent(JSON.stringify(kiado))}`, {
            method: 'POST',
            headers: headers
        });
        return await response.json();
    }

    async getAllKiado() {
        const headers = {"Content-Type": "application/json", "Allow-Origin-Access-Control": "*"};
        const response = await fetch(`http://localhost:3001/kiado`, {
            method: 'GET',
            headers: headers
        });
        return await response.json();
    }

    async deleteKiado(kiado: any): Promise<Error | Kiado> {
        const headers = {"Content-Type": "application/json", "Allow-Origin-Access-Control": "*"};
        const response = await fetch(`http://localhost:3001/kiado/?kiado=${encodeURIComponent(JSON.stringify(kiado))}`, {
            method: 'DELETE',
            headers: headers
        });
        return await response.json();
    }

    async saveKiado(kiado: any) {
        const headers = {"Content-Type": "application/json", "Allow-Origin-Access-Control": "*"};
        const response = await fetch(`http://localhost:3001/kiado/?kiado=${encodeURIComponent(JSON.stringify(kiado))}`, {
            method: 'PUT',
            headers: headers
        });
        return await response.json();
    }
}

export default KiadoService;