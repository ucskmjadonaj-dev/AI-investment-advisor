import { useEffect, useState } from 'react';
import { auth, db, signInWithGoogle, logout, handleFirestoreError, OperationType } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { UserProfile } from './types';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import Education from './components/Education';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { LayoutDashboard, MessageCircle, BookOpen, LogOut, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        
        // Real-time profile listener
        const unsubProfile = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            setProfile(null);
          }
          setLoading(false);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
        });

        return () => unsubProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleOnboardingComplete = async (data: Partial<UserProfile>) => {
    if (!user) return;
    
    const now = new Date().toISOString();
    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'User',
      photoURL: user.photoURL || '',
      monthlyIncome: data.monthlyIncome || 0,
      monthlyExpenses: data.monthlyExpenses || 0,
      savingsCapacity: data.savingsCapacity || 0,
      investmentGoal: data.investmentGoal || 'long-term',
      preferredLanguage: data.preferredLanguage || 'hinglish',
      onboardingCompleted: true,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await setDoc(doc(db, 'users', user.uid), newProfile);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="space-y-4">
            <div className="mx-auto w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">AI Investment Advisor</h1>
            <p className="text-lg text-slate-600">
              Grow your money simply with safe index funds. 
              Designed for everyone.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Welcome Back!</h2>
              <p className="text-slate-500 text-sm">Sign in to manage your investments and chat with your AI advisor.</p>
            </div>
            <Button 
              onClick={signInWithGoogle}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all"
            >
              Sign in with Google
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="p-4 bg-white rounded-2xl border border-slate-100">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Safe</p>
              <p className="text-sm text-slate-600">Only Index Funds</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-100">
              <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Simple</p>
              <p className="text-sm text-slate-600">Hinglish Support</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!profile || !profile.onboardingCompleted) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 max-w-md mx-auto relative shadow-2xl">
      <header className="bg-white border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-slate-900">AI Advisor</span>
        </div>
        <Button variant="ghost" size="icon" onClick={logout} className="text-slate-500">
          <LogOut className="w-5 h-5" />
        </Button>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 overflow-y-auto"
            >
              <Dashboard profile={profile} />
            </motion.div>
          )}
          {activeTab === 'chat' && (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <Chat profile={profile} />
            </motion.div>
          )}
          {activeTab === 'education' && (
            <motion.div 
              key="education"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 overflow-y-auto"
            >
              <Education />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <nav className="bg-white border-t border-slate-100 p-2 flex justify-around items-center sticky bottom-0 z-10">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'dashboard' ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}
        >
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'chat' ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}
        >
          <MessageCircle className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Chat</span>
        </button>
        <button 
          onClick={() => setActiveTab('education')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'education' ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}
        >
          <BookOpen className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Learn</span>
        </button>
      </nav>
    </div>
  );
}
