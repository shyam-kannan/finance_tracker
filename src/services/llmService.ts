import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export interface ReceiptAnalysis {
  vendor: string;
  amount: number;
  category: string;
  description: string;
  date?: string;
  paymentMethod?: string;
}

export const analyzeReceiptWithLLM = async (imageFile: File): Promise<ReceiptAnalysis> => {
  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Convert image to base64
    const base64Image = await fileToBase64(imageFile);
    
    const prompt = `Analyze this receipt image and extract the following information in JSON format:
    {
      "vendor": "store/restaurant name",
      "amount": total_amount_as_number,
      "category": "one of: Food & Drink, Transportation, Shopping, Entertainment, Groceries, Utilities, Healthcare, Gas & Fuel, Travel, Education, Personal Care, Other",
      "description": "brief description of items purchased",
      "date": "YYYY-MM-DD format if visible, otherwise null",
      "paymentMethod": "Credit Card, Debit Card, Cash, or null if not visible"
    }
    
    Rules:
    - Extract the exact vendor name as it appears
    - Use the total amount (including tax)
    - Choose the most appropriate category from the list
    - Keep description concise but informative
    - If date is not clearly visible, use null
    - If payment method is not visible, use null
    
    Return only valid JSON, no additional text.`;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: imageFile.type
      }
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Clean up the response to extract JSON
    let jsonText = text.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/, '').replace(/\n?```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    // Parse the JSON response
    const analysis = JSON.parse(jsonText) as ReceiptAnalysis;
    
    // Validate required fields
    if (!analysis.vendor || !analysis.amount || !analysis.category) {
      throw new Error('Missing required fields in LLM response');
    }

    // Ensure amount is a number
    if (typeof analysis.amount === 'string') {
      analysis.amount = parseFloat(analysis.amount);
    }

    return analysis;
  } catch (error) {
    console.error('Error analyzing receipt with Gemini:', error);
    throw new Error('Failed to analyze receipt. Please try again or enter details manually.');
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix to get just the base64 string
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

// Fallback function for when Gemini API is not available
export const analyzeReceiptFallback = async (file: File): Promise<ReceiptAnalysis> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return a template that user can fill in
  return {
    vendor: '',
    amount: 0,
    category: 'Other',
    description: 'Please fill in the details manually',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Credit Card'
  };
};