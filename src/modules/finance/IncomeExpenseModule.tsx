import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Search, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Printer, 
  Share2, 
  Calendar, 
  Clock, 
  BookOpen, 
  GraduationCap, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  X,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Coins,
  Receipt,
  FileOutput,
  MessageCircle,
  UserPlus,
  Eye,
  FileEdit,
  ClipboardList,
  Trophy,
  Star,
  Bell,
  Laptop,
  Bed,
  DoorOpen,
  UserCircle,
  Home,
  HeartPulse
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';

export const IncomeExpenseModule = () => {
  const [activeTab, setActiveTab] = useState<'income' | 'expense' | 'summary'>('income');
  const [showAddModal, setShowAddModal] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');

  const transactions = [
    { id: '1', title: 'Tuition Fees', category: 'Fees', amount: 45000, type: 'income', date: '2024-03-25', status: 'Received' },
    { id: '2', title: 'Electricity Bill', category: 'Utility', amount: 12500, type: 'expense', date: '2024-03-24', status: 'Paid' },
    { id: '3', title: 'Staff Salary', category: 'Payroll', amount: 250000, type: 'expense', date: '2024-03-01', status: 'Paid' },
    { id: '4', title: 'Donation', category: 'Other', amount: 10000, type: 'income', date: '2024-03-20', status: 'Received' },
  ];

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-heading tracking-tight uppercase">Income & Expense Management</h1>
          <p className="text-text-sub font-medium">Track school finances, manage expenses, and generate reports.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setTransactionType('income'); setShowAddModal(true); }} className="btn-primary flex items-center gap-2"><Plus size={20} /> Add Income</button>
          <button onClick={() => { setTransactionType('expense'); setShowAddModal(true); }} className="btn-secondary flex items-center gap-2"><Plus size={20} /> Add Expense</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-8 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-black text-text-sub uppercase tracking-widest">Total Income</p>
            <div className="p-2 bg-green-100 rounded-lg text-green-600"><TrendingUp size={20} /></div>
          </div>
          <p className="text-3xl font-black text-text-heading">₹{totalIncome.toLocaleString()}</p>
          <p className="text-[10px] font-bold text-green-600 mt-1">+12% from last month</p>
        </Card>
        <Card className="p-8 border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-black text-text-sub uppercase tracking-widest">Total Expense</p>
            <div className="p-2 bg-red-100 rounded-lg text-red-600"><TrendingDown size={20} /></div>
          </div>
          <p className="text-3xl font-black text-text-heading">₹{totalExpense.toLocaleString()}</p>
          <p className="text-[10px] font-bold text-red-600 mt-1">+5% from last month</p>
        </Card>
        <Card className="p-8 border-l-4 border-primary">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-black text-text-sub uppercase tracking-widest">Net Profit</p>
            <div className="p-2 bg-primary/10 rounded-lg text-primary"><Wallet size={20} /></div>
          </div>
          <p className="text-3xl font-black text-text-heading">₹{(totalIncome - totalExpense).toLocaleString()}</p>
          <p className="text-[10px] font-bold text-primary mt-1">Healthy Cash Flow</p>
        </Card>
      </div>

      <div className="flex gap-4 border-b border-slate-200 overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveTab('income')} className={`px-6 py-3 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${activeTab === 'income' ? 'border-primary text-primary' : 'border-transparent text-text-sub'}`}>Income Logs</button>
        <button onClick={() => setActiveTab('expense')} className={`px-6 py-3 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${activeTab === 'expense' ? 'border-primary text-primary' : 'border-transparent text-text-sub'}`}>Expense Logs</button>
        <button onClick={() => setActiveTab('summary')} className={`px-6 py-3 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${activeTab === 'summary' ? 'border-primary text-primary' : 'border-transparent text-text-sub'}`}>Financial Summary</button>
      </div>

      <Card className="p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-sub" size={20} />
            <input type="text" placeholder="Search transactions..." className="input-field pl-12" />
          </div>
          <div className="flex gap-3">
            <button className="p-3 bg-slate-100 text-text-sub rounded-xl hover:bg-slate-200 transition-all"><FileSpreadsheet size={20} /></button>
            <button className="p-3 bg-slate-100 text-text-sub rounded-xl hover:bg-slate-200 transition-all"><Printer size={20} /></button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Transaction</th>
                <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Category</th>
                <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Amount</th>
                <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Date</th>
                <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Status</th>
                <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.filter(t => t.type === activeTab || activeTab === 'summary').map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4">
                    <p className="font-bold text-sm text-text-heading">{t.title}</p>
                    <p className="text-[10px] text-text-sub font-bold uppercase">{t.id}</p>
                  </td>
                  <td className="py-4 text-sm text-text-sub">{t.category}</td>
                  <td className={`py-4 text-sm font-black ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'income' ? '+' : '-'} ₹{t.amount.toLocaleString()}
                  </td>
                  <td className="py-4 text-sm text-text-sub">{t.date}</td>
                  <td className="py-4">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                      t.status === 'Received' || t.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-text-sub"><Edit2 size={18} /></button>
                      <button className="p-2 hover:bg-red-50 rounded-lg text-red-600"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-text-heading uppercase">Add {transactionType === 'income' ? 'Income' : 'Expense'}</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
              </div>
              <div className="space-y-4">
                <Input label="Title" placeholder="e.g., Monthly Electricity Bill" />
                <Select label="Category" options={transactionType === 'income' ? ['Fees', 'Donation', 'Grant', 'Other'] : ['Utility', 'Payroll', 'Maintenance', 'Supplies', 'Other']} value="" onChange={() => {}} />
                <Input label="Amount" type="number" />
                <Input label="Date" type="date" />
                <button onClick={() => setShowAddModal(false)} className="btn-primary w-full py-4 mt-6">Save Transaction</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
