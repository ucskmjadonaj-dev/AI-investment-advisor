import { useEffect, useState } from 'react';
import { UserProfile, IndexFund, InvestmentPlan } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { getInvestmentAdvice } from '../services/geminiService';
import { TrendingUp, ArrowUpRight, ShieldCheck, Info, IndianRupee } from 'lucide-react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  profile: UserProfile;
}

export default function Dashboard({ profile }: DashboardProps) {
  const [advice, setAdvice] = useState<{ recommendations: IndexFund[], plan: InvestmentPlan } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdvice() {
      try {
        const result = await getInvestmentAdvice(profile);
        setAdvice(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchAdvice();
  }, [profile]);

  const chartData = [
    { month: 'Month 1', value: profile.savingsCapacity },
    { month: 'Month 3', value: profile.savingsCapacity * 3.1 },
    { month: 'Month 6', value: profile.savingsCapacity * 6.5 },
    { month: 'Month 9', value: profile.savingsCapacity * 10.2 },
    { month: 'Month 12', value: advice?.plan.expectedValue || profile.savingsCapacity * 14 },
  ];

  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900">Namaste, {profile.displayName}!</h2>
        <p className="text-slate-500">Aapka financial summary yahan hai.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none shadow-sm bg-blue-600 text-white rounded-3xl">
          <CardContent className="p-4 space-y-1">
            <p className="text-xs font-bold uppercase opacity-80">Monthly Income</p>
            <p className="text-xl font-bold">₹{profile.monthlyIncome.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-green-600 text-white rounded-3xl">
          <CardContent className="p-4 space-y-1">
            <p className="text-xs font-bold uppercase opacity-80">Savings</p>
            <p className="text-xl font-bold">₹{profile.savingsCapacity.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Expected Growth
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Value']}
                />
                <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="p-4 bg-slate-50 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Target (12 Months)</p>
              <p className="text-xl font-bold text-slate-900">₹{advice?.plan.expectedValue.toLocaleString() || '...'}</p>
            </div>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-3 py-1 rounded-full">
              +{advice?.plan.growthPercentage || '12'}% Growth
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          Recommended Index Funds
        </h3>
        
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : (
          advice?.recommendations.map((fund, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="border-none shadow-sm rounded-3xl bg-white hover:shadow-md transition-all">
                <CardContent className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900">{fund.name}</h4>
                      <p className="text-xs text-slate-500">{fund.benchmark}</p>
                    </div>
                    <Badge variant="outline" className="rounded-full text-[10px] uppercase tracking-wider">
                      {fund.riskLevel} Risk
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {fund.whySuggest}
                  </p>
                  <div className="flex items-center gap-1 text-blue-600 font-bold text-sm">
                    <ArrowUpRight className="w-4 h-4" />
                    Expected: {fund.expectedReturns}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <Card className="border-none shadow-sm rounded-3xl bg-amber-50 border-amber-100">
        <CardContent className="p-4 flex gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 text-amber-600" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-amber-900">Pro Tip</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Market stable hai, apni SIP continue rakhein. Har mahine ₹500 extra invest karne se aapka goal jaldi poora hoga!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
