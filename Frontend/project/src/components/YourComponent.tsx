import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService, PredictionResult, symptoms } from '../config/api';

const YourComponent: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set());
    
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('File size too large');
                return;
            }
            setSelectedFile(file);
        }
    };

    const clearFile = () => {
        setSelectedFile(null);
        // Reset the input value if you keep a reference to it
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            if (selectedFile) {
                formData.append('image', selectedFile);
            }

            const selectedSymptomsList = Array.from(selectedSymptoms);
            formData.append('symptoms', JSON.stringify(selectedSymptomsList));

            const predictionResult: PredictionResult = await apiService.predict(formData);
            
            // Type-safe navigation state
            type ResultsState = { prediction: PredictionResult };
            navigate('/results', { 
                state: { prediction: predictionResult } satisfies ResultsState
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSymptomSelect = (symptomId: string) => {
        setSelectedSymptoms(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(symptomId)) {
                newSelected.delete(symptomId);
            } else {
                newSelected.add(symptomId);
            }
            return newSelected;
        });
    };

    return (
        <div className="container mx-auto p-4">
            {error && <div className="text-red-500">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                    />
                    {selectedFile && (
                        <button
                            type="button"
                            onClick={clearFile}
                            className="ml-2 text-red-500"
                        >
                            Remove file
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    {symptoms.map((symptom) => (
                        <button
                            key={symptom.id}
                            type="button"
                            onClick={() => handleSymptomSelect(symptom.id)}
                            className={`p-4 rounded-lg transition-colors ${
                                selectedSymptoms.has(symptom.id)
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                        >
                            {symptom.name}
                        </button>
                    ))}
                </div>

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {isLoading ? 'Processing...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default YourComponent;