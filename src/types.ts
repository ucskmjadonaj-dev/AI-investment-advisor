export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsCapacity: number;
  investmentGoal: 'short-term' | 'long-term';
  preferredLanguage: 'hinglish' | 'english';
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface IndexFund {
  name: string;
  description: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
  expectedReturns: string;
  benchmark: string;
  whySuggest: string;
}

export interface InvestmentPlan {
  monthlyAmount: number;
  durationMonths: number;
  expectedValue: number;
  growthPercentage: number;
  summary: string;
}
