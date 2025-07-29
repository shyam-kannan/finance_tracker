import { Transaction } from '../types';
import { analyzeReceiptWithLLM, analyzeReceiptFallback } from './llmService';

export const processReceipt = async (file: File): Promise<Partial<Transaction>> => {
  try {
    // Use LLM to analyze the receipt
    const analysis = await analyzeReceiptWithLLM(file);
    
    return {
      vendor: analysis.vendor,
      amount: analysis.amount,
      category: analysis.category,
      description: analysis.description,
      date: analysis.date || new Date().toISOString().split('T')[0],
      paymentMethod: analysis.paymentMethod || 'Credit Card',
      receiptUrl: URL.createObjectURL(file)
    };
  } catch (error) {
    console.error('LLM analysis failed, using fallback:', error);
    
    // Use fallback method if LLM fails
    const fallbackAnalysis = await analyzeReceiptFallback(file);
    
    return {
      vendor: fallbackAnalysis.vendor,
      amount: fallbackAnalysis.amount,
      category: fallbackAnalysis.category,
      description: fallbackAnalysis.description,
      date: fallbackAnalysis.date || new Date().toISOString().split('T')[0],
      paymentMethod: fallbackAnalysis.paymentMethod || 'Credit Card',
      receiptUrl: URL.createObjectURL(file)
    };
  }
};

export const categorizeTransaction = (vendor: string, description: string): string => {
  const rules = {
    'Food & Drink': ['starbucks', 'mcdonald', 'subway', 'chipotle', 'dunkin', 'coffee', 'restaurant', 'cafe', 'bar', 'pub'],
    'Groceries': ['whole foods', 'kroger', 'safeway', 'walmart', 'target', 'costco', 'grocery', 'supermarket', 'market'],
    'Gas & Fuel': ['shell', 'exxon', 'chevron', 'bp', 'mobil', 'gas', 'fuel', 'petrol'],
    'Transportation': ['uber', 'lyft', 'taxi', 'bus', 'train', 'metro', 'parking', 'toll'],
    'Shopping': ['amazon', 'ebay', 'best buy', 'apple', 'nike', 'clothing', 'electronics', 'store'],
    'Entertainment': ['netflix', 'spotify', 'hulu', 'disney', 'movie', 'theater', 'gaming', 'cinema'],
    'Utilities': ['electric', 'water', 'internet', 'phone', 'cable', 'utility', 'power', 'gas company'],
    'Healthcare': ['pharmacy', 'doctor', 'hospital', 'medical', 'health', 'cvs', 'walgreens', 'clinic'],
    'Travel': ['hotel', 'airline', 'flight', 'booking', 'airbnb', 'travel', 'vacation'],
    'Education': ['school', 'university', 'college', 'course', 'book', 'education', 'tuition']
  };

  const searchText = `${vendor} ${description}`.toLowerCase();
  
  for (const [category, keywords] of Object.entries(rules)) {
    if (keywords.some(keyword => searchText.includes(keyword))) {
      return category;
    }
  }
  
  return 'Other';
};