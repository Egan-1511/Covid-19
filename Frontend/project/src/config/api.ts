// Removed circular and unused import of apiService
export interface PredictionResult {
    "COVID-19 Likelihood": string;
    Recommendation: string;
}

export interface Symptom {
    id: string;
    name: string;
    followUpQuestion?: string;
    options?: string[];
}

export const symptoms: Symptom[] = [
    { 
        id: 'fever',
        name: 'Fever',
        followUpQuestion: 'What is your temperature?',
        options: ['37.5-38.0°C', '38.1-39.0°C', 'Above 39.0°C']
    },
    {
        id: 'cough',
        name: 'Dry Cough',
        followUpQuestion: 'How long have you had the cough?',
        options: ['Less than a week', '1-2 weeks', 'More than 2 weeks']
    }
];

export const apiService = {
    predict: async (formData: FormData): Promise<PredictionResult> => {
        const response = await fetch('http://localhost:5000/predict', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }
};

