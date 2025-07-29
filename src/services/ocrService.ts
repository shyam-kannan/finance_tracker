import { Transaction } from '../types';

// Simulate OCR processing with realistic extracted data
export const processReceipt = async (file: File): Promise<Partial<Transaction>> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock OCR results based on common receipt patterns
  const mockResults = [
    {
      vendor: 'Starbucks Coffee',
      amount: 12.45,
      category: 'Food & Drink',
      description: 'Grande Latte, Blueberry Muffin',
      paymentMethod: 'Credit Card'
    },
    {
      vendor: 'Amazon',
      amount: 89.99,
      category: 'Shopping',
      description: 'Wireless Headphones',
      paymentMethod: 'Credit Card'
    },
    {
      vendor: 'Shell Gas Station',
      amount: 45.30,
      category: 'Transportation',
      description: 'Fuel Purchase',
      paymentMethod: 'Debit Card'
    },
    {
      vendor: 'Whole Foods Market',
      amount: 67.83,
      category: 'Groceries',
      description: 'Weekly Grocery Shopping',
      paymentMethod: 'Credit Card'
    },
    {
      vendor: 'Netflix',
      amount: 15.99,
      category: 'Entertainment',
      description: 'Monthly Subscription',
      paymentMethod: 'Credit Card'
    }
  ];

  const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
  
  return {
    ...randomResult,
    date: new Date().toISOString().split('T')[0],
    receiptUrl: URL.createObjectURL(file)
  };
};

export const categorizeTransaction = (vendor: string, description: string): string => {
  const rules = {
    'Food & Drink': ['starbucks', 'mcdonald', 'subway', 'chipotle', 'dunkin', 'coffee', 'restaurant'],
    'Groceries': ['whole foods', 'kroger', 'safeway', 'walmart', 'target', 'costco', 'grocery'],
    'Transportation': ['shell', 'exxon', 'chevron', 'uber', 'lyft', 'gas', 'fuel', 'parking'],
    'Shopping': ['amazon', 'ebay', 'best buy', 'apple', 'nike', 'clothing', 'electronics'],
    'Entertainment': ['netflix', 'spotify', 'hulu', 'disney', 'movie', 'theater', 'gaming'],
    'Utilities': ['electric', 'water', 'internet', 'phone', 'cable', 'utility'],
    'Healthcare': ['pharmacy', 'doctor', 'hospital', 'medical', 'health', 'cvs', 'walgreens']
  };

  const searchText = `${vendor} ${description}`.toLowerCase();
  
  for (const [category, keywords] of Object.entries(rules)) {
    if (keywords.some(keyword => searchText.includes(keyword))) {
      return category;
    }
  }
  
  return 'Other';
};