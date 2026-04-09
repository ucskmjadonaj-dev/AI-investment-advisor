import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, Wallet, PiggyBank, Target, TrendingUp, Languages } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: Partial<UserProfile>) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<UserProfile>>({
    monthlyIncome: 15000,
    monthlyExpenses: 12000,
    savingsCapacity: 3000,
    investmentGoal: 'long-term',
    preferredLanguage: 'hinglish',
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const steps = [
    {
      title: "Preferred Language",
      description: "Aap kis bhasha mein baat karna chahenge?",
      icon: <Languages className="w-12 h-12 text-purple-500" />,
      field: "preferredLanguage",
      options: [
        { label: "Hinglish (Hindi + English)", value: "hinglish" },
        { label: "English Only", value: "english" },
      ],
    },
    {
      title: "Monthly Income",
      description: "Aap mahine mein kitna kamaate hain?",
      icon: <Wallet className="w-12 h-12 text-blue-500" />,
      field: "monthlyIncome",
      type: "number",
      prefix: "₹",
    },
    {
      title: "Monthly Expenses",
      description: "Aapka mahine ka kharcha kitna hai?",
      icon: <PiggyBank className="w-12 h-12 text-orange-500" />,
      field: "monthlyExpenses",
      type: "number",
      prefix: "₹",
    },
    {
      title: "Investment Goal",
      description: "Aapka goal kya hai?",
      icon: <Target className="w-12 h-12 text-green-500" />,
      field: "investmentGoal",
      options: [
        { label: "Short Term (1-3 years)", value: "short-term" },
        { label: "Long Term (5+ years)", value: "long-term" },
      ],
    }
  ];

  const currentStep = steps[step - 1];

  const handleFinish = () => {
    const savings = (data.monthlyIncome || 0) - (data.monthlyExpenses || 0);
    onComplete({ ...data, savingsCapacity: Math.max(0, savings) });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 max-w-md mx-auto">
      <div className="w-full mb-8">
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4].map(i => (
            <div 
              key={i} 
              className={`h-1.5 flex-1 rounded-full transition-all ${i <= step ? 'bg-blue-600' : 'bg-slate-200'}`} 
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="w-full"
        >
          <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 p-4 bg-slate-50 rounded-2xl inline-block">
                {currentStep.icon}
              </div>
              <CardTitle className="text-2xl font-bold">{currentStep.title}</CardTitle>
              <CardDescription className="text-slate-500">{currentStep.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {currentStep.options ? (
                <div className="space-y-3">
                  {currentStep.options.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setData({ ...data, investmentGoal: opt.value as any })}
                      className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                        data.investmentGoal === opt.value 
                        ? 'border-blue-600 bg-blue-50 text-blue-700' 
                        : 'border-slate-100 hover:border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="font-bold">{opt.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">
                    {currentStep.prefix}
                  </span>
                  <Input
                    type="number"
                    value={data[currentStep.field as keyof typeof data] as number}
                    onChange={(e) => setData({ ...data, [currentStep.field!]: parseInt(e.target.value) || 0 })}
                    className="h-16 pl-10 text-2xl font-bold rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all"
                  />
                </div>
              )}

              <div className="flex gap-3 mt-8">
                {step > 1 && (
                  <Button variant="outline" onClick={prevStep} className="h-14 px-6 rounded-2xl border-slate-200">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                )}
                <Button 
                  onClick={step === steps.length ? handleFinish : nextStep}
                  className="flex-1 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg"
                >
                  {step === steps.length ? "Get Started" : "Next"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
