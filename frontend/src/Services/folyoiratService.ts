class FolyoiratService {
    async addNewFolyoirat(folyoirat: any) {
        const headers = {"Content-Type": "application/json", "Allow-Origin-Access-Control": "*"};
        const response = await fetch(`http://localhost:3001/folyoirat/?folyoirat=${encodeURIComponent(JSON.stringify(folyoirat))}`, {
            method: 'POST',
            headers: headers
        });
        return await response.json();
    }

    async getAllFolyoirat() {
        const headers = {"Content-Type": "application/json", "Allow-Origin-Access-Control": "*"};
        const response = await fetch(`http://localhost:3001/folyoirat`, {
            method: 'GET',
            headers: headers
        });
        return await response.json();
    }

    async deleteFolyoirat(folyoirat: any) {
        const headers = {"Content-Type": "application/json", "Allow-Origin-Access-Control": "*"};
        const response = await fetch(`http://localhost:3001/folyoirat/?folyoirat=${encodeURIComponent(JSON.stringify(folyoirat))}`, {
            method: 'DELETE',
            headers: headers
        });
        return await response.json();
    }

    async saveFolyoirat(folyoirat: any) {
        const headers = {"Content-Type": "application/json", "Allow-Origin-Access-Control": "*"};
        const response = await fetch(`http://localhost:3001/folyoirat/?folyoirat=${encodeURIComponent(JSON.stringify(folyoirat))}`, {
            method: 'PUT',
            headers: headers
        });
        return await response.json();
    }
}

export default FolyoiratService;