import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { BookOpen, HelpCircle, Shield, Zap, TrendingUp } from 'lucide-react';

export default function Education() {
  const topics = [
    {
      id: 'item-1',
      title: 'Index Fund kya hota hai?',
      icon: <TrendingUp className="w-5 h-5 text-blue-500" />,
      content: 'Index fund ek aisa investment hai jo market ke top companies (jaise Nifty 50) ko track karta hai. Isme aapka paisa India ki top 50 companies mein divide ho jata hai.'
    },
    {
      id: 'item-2',
      title: 'Ye Stocks se safe kyun hai?',
      icon: <Shield className="w-5 h-5 text-green-500" />,
      content: 'Single stock mein risk zyada hota hai. Index fund mein 50 companies hoti hain, agar 1-2 kharab karein toh bhi baaki 48 aapka paisa sambhaal leti hain.'
    },
    {
      id: 'item-3',
      title: 'SIP (Systematic Investment Plan) kya hai?',
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      content: 'SIP ka matlab hai har mahine ek chota amount (jaise ₹500 ya ₹1000) fix date par invest karna. Isse aapko market ki chinta nahi karni padti.'
    },
    {
      id: 'item-4',
      title: 'Kitna return mil sakta hai?',
      icon: <HelpCircle className="w-5 h-5 text-purple-500" />,
      content: 'Index funds mein long term (5-10 saal) mein approx 12-15% return mil sakta hai. Ye bank FD se kaafi behtar hai.'
    }
  ];

  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900">Learn Basics</h2>
        <p className="text-slate-500">Investment ko aasaan bhasha mein samjhein.</p>
      </div>

      <div className="grid gap-4">
        {topics.map((topic) => (
          <Card key={topic.id} className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="p-5 pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-xl">
                  {topic.icon}
                </div>
                <CardTitle className="text-base font-bold">{topic.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-2">
              <p className="text-sm text-slate-600 leading-relaxed">
                {topic.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-md rounded-3xl bg-blue-600 text-white p-6 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <BookOpen className="w-10 h-10 opacity-50" />
          <h3 className="text-xl font-bold">Golden Rule</h3>
          <p className="text-blue-100 text-sm leading-relaxed">
            "Investment jaldi shuru karein, chahe amount chota ho. Time hi aapka sabse bada dost hai."
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500 rounded-full opacity-20" />
      </Card>
    </div>
  );
}
