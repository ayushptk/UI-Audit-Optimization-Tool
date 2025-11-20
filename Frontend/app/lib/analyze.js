
const BASE_URL = "http://127.0.0.1:8000/api/ai-analysis";

export async function analyzeFile(filename) {
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filename }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Error analyzing file:', error);
        throw error;
    }
}
