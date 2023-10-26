class acceptanceService {
    async getAllKozlemenyWaitingForAcceptance(){
        const headers = {"Content-Type": "application/json", "Allow-Origin-Access-Control": "*"};
        const response = await fetch(`http://localhost:3001/acceptance`, {
            method: 'GET',
            headers: headers
        });
        return await response.json();
    }

    async acceptKozlemeny(kozlemenyId: string) {
        const headers = {"Content-Type": "application/json", "Allow-Origin-Access-Control": "*"};
        const response = await fetch(`http://localhost:3001/acceptance/?kozlemenyId=${encodeURIComponent(kozlemenyId)}`, {
            method: 'POST',
            headers: headers
        });
        return await response.json();
    }

    async rejectKozlemeny(kozlemenyId: string) {
        const headers = {"Content-Type": "application/json", "Allow-Origin-Access-Control": "*"};
        const response = await fetch(`http://localhost:3001/acceptance/?kozlemenyId=${encodeURIComponent(kozlemenyId)}`, {
            method: 'DELETE',
            headers: headers
        });
        return await response.json();
    }
}

export default acceptanceService;