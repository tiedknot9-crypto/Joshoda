import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  UserPlus, 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  Upload,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  School,
  Laptop,
  Phone,
  Mail,
  MapPin,
  HeartPulse,
  FileText,
  Signature,
  Lock,
  Plus,
  Trash2,
  Edit2,
  Image as ImageIcon,
  Stamp,
  CreditCard,
  Percent,
  UserCheck,
  BookOpenCheck,
  Hash,
  Tag as TagIcon,
  Receipt,
  Wallet,
  QrCode,
  Printer,
  Download,
  Share2,
  MessageCircle,
  FileSpreadsheet,
  Calendar,
  Filter,
  Coins,
  ArrowRightLeft,
  X,
  Clock,
  ArrowUpCircle,
  FileEdit,
  ClipboardList,
  Eye,
  FileDown,
  Sparkles,
  UserCircle,
  Home,
  FileOutput,
  Trophy,
  Briefcase,
  Star,
  BarChart3,
  Bed,
  DoorOpen,
  UserCog,
  ScanLine,
  Building2,
  ShieldCheck,
  UserCheck2,
  Camera,
  Video,
  User,
  CalendarRange,
  XCircle,
  PieChart as PieChartIcon,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

// --- Types ---

type View = 'login' | 'dashboard' | 'register-student' | 'student-list' | 'settings' | 'fee-management' | 'academics' | 'attendance' | 'examination' | 'id-cards' | 'hostel' | 'live-camera' | 'admin-360' | 'class-360' | 'due-fees' | 'teacher-panel' | 'parent-panel' | 'leave-management' | 'reports' | 'calendar' | 'role-assign' | 'human-resource' | 'communicate' | 'front-office' | 'income-expense' | 'profile-settings' | 'user-logs' | 'super-admin-panel';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'teacher' | 'student' | 'parent' | 'warden' | 'super-admin';
  permissions: string[];
  studentId?: string;
  password?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'event' | 'holiday' | 'examination' | 'ptm' | 'festival';
  icon?: string;
  color?: string;
}

interface HostelRoom {
  id: string;
  roomNumber: string;
  floor: string;
  capacity: number;
  type: 'AC' | 'Non-AC';
  gender: 'Male' | 'Female';
  category: string;
  price: number;
}

interface HostelBed {
  id: string;
  roomId: string;
  bedNumber: string;
  status: 'Available' | 'Occupied' | 'Maintenance';
  studentId?: string;
}

interface HostelStaff {
  id: string;
  name: string;
  role: 'Warden' | 'Assistant Warden' | 'Security' | 'Cleaning Staff';
  mobile: string;
  email: string;
  shift: 'Day' | 'Night';
}

interface HostelAttendance {
  id: string;
  studentId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Leave';
  time: string;
  remarks?: string;
}

interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  status: 'Present' | 'Absent' | 'Late' | 'Leave' | 'Holiday';
  date: string;
  time: string;
  markedBy: string;
  period?: 'Morning' | 'Last Period';
}

interface TimeTableEntry {
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
}

interface ClassTimeTable {
  id: string;
  class: string;
  section: string;
  entries: TimeTableEntry[];
}

interface Syllabus {
  id: string;
  class: string;
  subject: string;
  title: string;
  description: string;
  fileUrl?: string;
  date: string;
  status: 'Not Started' | 'Started' | 'Completed';
}

interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
  approvedBy?: string;
  type?: 'Leave' | 'Early Leave' | 'Parent Pickup';
  pickupTime?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'Info' | 'Warning' | 'Success' | 'Fee';
  targetRoles: ('admin' | 'teacher' | 'student' | 'parent')[];
  targetStudentId?: string;
}

interface Exam {
  id: string;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
}

interface ExamSchedule {
  id: string;
  examId: string;
  class: string;
  section: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  questionPaper?: string;
  answerSheet?: string;
}

interface ExamResult {
  id: string;
  examScheduleId: string;
  studentId: string;
  studentName: string;
  marks: number;
  maxMarks: number;
  grade: string;
  status: 'Pass' | 'Fail';
  feedback: string;
  teacherId: string;
}

interface HomeworkSubmission {
  studentId: string;
  studentName: string;
  file: string; // base64 or mock URL
  date: string;
}

interface Homework {
  id: string;
  class: string;
  section: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  teacherName: string;
  date: string;
  file?: string;
  submissions: HomeworkSubmission[];
}

interface ClassAssignment {
  id: string;
  class: string;
  section: string;
  classTeacher: string;
  subjectTeachers: { subject: string; teacher: string }[];
  session: string;
}

interface Activity {
  id: string;
  class: string;
  section: string;
  subject: string;
  title: string;
  description: string;
  date: string;
  teacherName: string;
  fileUrl?: string;
}

interface FeeType {
  id: string;
  name: string;
  description: string;
}

interface FeeMaster {
  id: string;
  class: string;
  feeType: string;
  amount: number;
  frequency: 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Yearly';
}

interface FeeTransaction {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  feeType: string;
  amount: number;
  discount: number;
  discountReason: string;
  scholarship: number;
  totalPaid: number;
  paymentMode: 'Cash' | 'UPI' | 'Bank Transfer';
  transactionId?: string;
  date: string;
  dueDate: string;
  status: 'Paid' | 'Partial' | 'Due';
}

interface Staff {
  id: string;
  name: string;
  surname: string;
  email: string;
  mobile: string;
  role: string;
  department: string;
  designation: string;
  photo?: string;
  joiningDate: string;
  status: 'Active' | 'Inactive';
}

interface Department {
  id: string;
  name: string;
}

interface Designation {
  id: string;
  name: string;
}

interface AdmissionEnquiry {
  id: string;
  name: string;
  surname: string;
  mobile: string;
  email: string;
  class: string;
  date: string;
  source: string;
  status: 'Pending' | 'Follow-up' | 'Closed' | 'Approved';
  fatherName?: string;
  motherName?: string;
  address?: string;
  gender?: string;
}

interface Visitor {
  id: string;
  name: string;
  mobile: string;
  purpose: string;
  date: string;
  inTime: string;
  outTime?: string;
  idCard?: string;
}

interface Complaint {
  id: string;
  type: string;
  source: string;
  name: string;
  mobile: string;
  date: string;
  description: string;
  actionTaken?: string;
  status: 'Pending' | 'Resolved';
}

interface CommunicationTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'Email' | 'WhatsApp';
}

interface Income {
  id: string;
  name: string;
  incomeHead: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  description: string;
  file?: string;
}

interface Expense {
  id: string;
  name: string;
  expenseHead: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  description: string;
  file?: string;
}

interface IncomeHead {
  id: string;
  name: string;
  description: string;
}

interface ExpenseHead {
  id: string;
  name: string;
  description: string;
}

interface Student {
  id: string;
  name: string;
  surname: string;
  class: string;
  section: string;
  studentId: string;
  caste: string;
  category: string;
  fatherName: string;
  motherName: string;
  fatherMobile: string;
  motherMobile: string;
  bloodGroup: string;
  emergencyContact: string;
  localGuardianContact: string;
  email: string;
  address: string;
  allergy: string;
  religion: string;
  gender: string;
  hasDisability: boolean;
  disabilityDetails: string;
  photo?: string;
  relationInSchool: {
    name: string;
    class: string;
    section: string;
  };
}

// --- Components ---

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
        : 'text-text-sub hover:bg-slate-100'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const Card = ({ children, className = "", ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) => (
  <div className={`glass-panel rounded-2xl p-8 ${className}`} {...props}>
    {children}
  </div>
);

const Input = ({ label, type = "text", placeholder, required = false, ...props }: any) => (
  <div className="w-full">
    <label className="label-text">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="input-field"
      {...props}
    />
  </div>
);

const Select = ({ label, options, required = false, ...props }: any) => (
  <div className="w-full">
    <label className="label-text">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select className="input-field" {...props}>
      <option value="">Select {label}</option>
      {options.map((opt: string) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const FileUpload = ({ label, icon: Icon = Upload, required = false, onChange, preview }: any) => (
  <div className="w-full">
    <label className="label-text">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative group">
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        onChange={onChange}
      />
      <div className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 rounded-xl group-hover:border-primary group-hover:bg-primary/5 transition-all overflow-hidden min-h-[120px]">
        {preview ? (
          <img src={preview} alt="Preview" className="max-h-20 w-auto object-contain rounded-lg" referrerPolicy="no-referrer" />
        ) : (
          <>
            <Icon className="text-slate-400 group-hover:text-primary" size={24} />
            <span className="text-xs text-text-secondary group-hover:text-primary">Click or drag to upload</span>
          </>
        )}
      </div>
    </div>
  </div>
);

const Attendance = ({ students, attendance, setAttendance, masterData, currentUser }: any) => {
  const [activeTab, setActiveTab] = useState<'scan' | 'manual' | 'history' | 'my-attendance'>(
    (currentUser?.role === 'student' || currentUser?.role === 'parent') ? 'my-attendance' : 'scan'
  );
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [manualForm, setManualForm] = useState({
    class: '',
    section: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present' as Attendance['status'],
    period: 'Morning' as 'Morning' | 'Last Period'
  });
  const [historyFilters, setHistoryFilters] = useState({
    date: new Date().toISOString().split('T')[0],
    class: '',
    section: ''
  });

  const [scanFilters, setScanFilters] = useState({
    class: '',
    section: ''
  });

  const [scanning, setScanning] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;

    const startScanner = async () => {
      if (scanning && activeTab === 'scan' && (currentUser?.role === 'admin' || currentUser?.role === 'teacher')) {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const element = document.getElementById("reader");
          if (!element) return;

          html5QrCode = new Html5Qrcode("reader");
          await html5QrCode.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            (decodedText: string) => {
              onScanSuccess(decodedText);
            },
            (errorMessage: string) => {}
          ).catch((err: any) => {
            console.error("Scanner start error:", err);
          });
        } catch (err) {
          console.error("Scanner initialization error:", err);
        }
      }
    };

    startScanner();

    return () => {
      if (html5QrCode) {
        if (html5QrCode.isScanning) {
          html5QrCode.stop().then(() => {
            html5QrCode?.clear();
          }).catch((err: any) => console.error("Scanner stop error:", err));
        } else {
          try {
            html5QrCode.clear();
          } catch (e) {}
        }
      }
    };
  }, [activeTab, currentUser, scanning]);

  const takePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();
      
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      
      const photo = canvas.toDataURL('image/jpeg');
      setCapturedPhoto(photo);
      
      stream.getTracks().forEach(track => track.stop());
      return photo;
    } catch (err) {
      console.error("Camera error:", err);
      alert("Could not access camera for photo capture");
      return null;
    }
  };

  function onScanSuccess(decodedText: string) {
    const student = students.find((s: any) => s.studentId === decodedText);
    if (student) {
      markAttendance(student, 'Present');
      setScanResult(`Attendance marked for ${student.name} ${student.surname}`);
      setTimeout(() => setScanResult(null), 3000);
    } else {
      setScanResult("Invalid Student QR Code");
      setTimeout(() => setScanResult(null), 3000);
    }
  }

  function onScanFailure(error: any) {
    // console.warn(`Code scan error = ${error}`);
  }

  const markAttendance = (student: any, status: Attendance['status']) => {
    const today = new Date().toLocaleDateString();
    
    setAttendance((prev: Attendance[]) => {
      const existing = prev.find((a: any) => a.studentId === student.studentId && a.date === today);
      
      if (existing) {
        return prev.map((a: any) => 
          (a.studentId === student.studentId && a.date === today) ? { ...a, status, time: new Date().toLocaleTimeString() } : a
        );
      } else {
        const newEntry: Attendance = {
          id: Date.now().toString(),
          studentId: student.studentId,
          studentName: `${student.name} ${student.surname}`,
          class: student.class,
          section: student.section,
          status,
          date: today,
          time: new Date().toLocaleTimeString(),
          markedBy: currentUser?.role === 'admin' ? 'Admin' : 'Teacher',
          period: 'Morning'
        };
        return [...prev, newEntry];
      }
    });
  };

  const handleManualMark = () => {
    if (selectedStudents.length === 0) {
      alert("Please select at least one student");
      return;
    }

    const studentsToMark = students.filter((s: any) => selectedStudents.includes(s.studentId));
    
    const newEntries = studentsToMark.map((s: any) => {
      const existing = attendance.find((a: any) => 
        a.studentId === s.studentId && 
        a.date === new Date(manualForm.date).toLocaleDateString() &&
        a.period === manualForm.period
      );
      if (existing) return null;

      return {
        id: Math.random().toString(36).substr(2, 9),
        studentId: s.studentId,
        studentName: `${s.name} ${s.surname}`,
        class: s.class,
        section: s.section,
        status: manualForm.status,
        date: new Date(manualForm.date).toLocaleDateString(),
        time: '--',
        markedBy: currentUser?.role === 'admin' ? 'Admin' : 'Teacher',
        period: manualForm.period
      };
    }).filter(Boolean);

    setAttendance([...attendance, ...newEntries]);
    setSelectedStudents([]);
    alert(`Attendance marked for ${newEntries.length} students`);
  };

  const scanFilteredStudents = students.filter((s: any) => {
    const matchesClass = !scanFilters.class || s.class === scanFilters.class;
    const matchesSection = !scanFilters.section || s.section === scanFilters.section;
    return matchesClass && matchesSection;
  });

  const manualFilteredStudents = students.filter((s: any) => {
    const matchesClass = !manualForm.class || s.class === manualForm.class;
    const matchesSection = !manualForm.section || s.section === manualForm.section;
    const matchesSearch = !studentSearch || 
      `${s.name} ${s.surname}`.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.studentId.toLowerCase().includes(studentSearch.toLowerCase());
    return matchesClass && matchesSection && matchesSearch;
  });

  const toggleSelectAll = () => {
    if (selectedStudents.length === manualFilteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(manualFilteredStudents.map((s: any) => s.studentId));
    }
  };

  const toggleStudentSelection = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const filteredHistory = attendance.filter((a: any) => {
    return (!historyFilters.date || a.date === new Date(historyFilters.date).toLocaleDateString()) &&
           (!historyFilters.class || a.class === historyFilters.class) &&
           (!historyFilters.section || a.section === historyFilters.section);
  });

  const myAttendance = attendance.filter((a: any) => a.studentId === currentUser?.studentId);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Attendance Management 📅</h1>
          <p className="text-text-secondary">Track student attendance via QR code or manual entry.</p>
        </div>
      </div>

      <div className="flex gap-4 p-1 bg-slate-100 rounded-2xl w-fit">
        {(currentUser?.role === 'admin' || currentUser?.role === 'teacher') ? (
          [
            { id: 'scan', label: 'QR Scan', icon: QrCode },
            { id: 'manual', label: 'Manual Entry', icon: UserCheck },
            { id: 'history', label: 'History', icon: Clock }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-text-sub hover:bg-white/50'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))
        ) : (
          <button
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-white text-primary shadow-sm"
          >
            <Clock size={18} />
            {currentUser?.role === 'parent' ? 'Child Attendance' : 'My Attendance'}
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'scan' && (currentUser?.role === 'admin' || currentUser?.role === 'teacher') && (
          <motion.div key="scan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                    <Filter size={20} /> Scan Filters
                  </h3>
                  <div className="space-y-4">
                    <Select 
                      label="Class" 
                      options={masterData.classes} 
                      value={scanFilters.class} 
                      onChange={(e: any) => setScanFilters({...scanFilters, class: e.target.value})} 
                    />
                    <Select 
                      label="Section" 
                      options={masterData.sections} 
                      value={scanFilters.section} 
                      onChange={(e: any) => setScanFilters({...scanFilters, section: e.target.value})} 
                    />
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-bold mb-6 flex items-center justify-between gap-2 text-primary">
                    <div className="flex items-center gap-2">
                      <QrCode size={20} /> QR Scanner
                    </div>
                    {!scanning && (
                      <button 
                        onClick={() => setScanning(true)}
                        className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                      >
                        Start Camera
                      </button>
                    )}
                    {scanning && (
                      <div className="flex flex-col gap-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={async () => {
                              const photo = await takePhoto();
                              if (photo) {
                                setScanResult("Photo captured for verification");
                                setTimeout(() => setScanResult(null), 3000);
                              }
                            }}
                            className="flex-1 px-4 py-2 bg-secondary text-white rounded-xl text-xs font-bold shadow-lg shadow-secondary/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
                          >
                            <Camera size={14} /> Capture
                          </button>
                          <button 
                            onClick={() => setScanning(false)}
                            className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-500/20 hover:scale-105 transition-all"
                          >
                            Stop Camera
                          </button>
                        </div>
                        {capturedPhoto && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative rounded-xl overflow-hidden border-2 border-secondary/30"
                          >
                            <img src={capturedPhoto} alt="Captured" className="w-full h-auto" />
                            <div className="absolute top-2 right-2 bg-secondary text-white px-2 py-1 rounded-lg text-[10px] font-bold">
                              CAPTURED
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </h3>
                  <div id="reader" className="w-full overflow-hidden rounded-2xl border-2 border-slate-200 min-h-[250px] bg-slate-50 flex items-center justify-center relative">
                    {!scanning && (
                      <div className="text-center p-8">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                          <Camera size={24} />
                        </div>
                        <p className="text-sm text-text-sub font-medium">Camera is off</p>
                      </div>
                    )}
                  </div>
                  {scanResult && (
                    <div className={`mt-4 p-4 rounded-xl text-center font-bold ${scanResult.includes('Invalid') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {scanResult}
                    </div>
                  )}
                </Card>
              </div>

              <Card className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
                    <Users size={20} /> Student List ({scanFilteredStudents.length})
                  </h3>
                  <div className="text-xs font-bold text-text-sub bg-slate-100 px-3 py-1 rounded-full">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-100">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="p-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Student</th>
                        <th className="p-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Class/Section</th>
                        <th className="p-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Status</th>
                        <th className="p-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {scanFilteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-12 text-center text-text-sub italic">
                            Select class and section to view students.
                          </td>
                        </tr>
                      ) : (
                        scanFilteredStudents.map((s: any) => {
                          const record = attendance.find((a: any) => a.studentId === s.studentId && a.date === new Date().toLocaleDateString());
                          return (
                            <tr key={s.studentId} className={`transition-colors ${record ? 'bg-green-50/30' : 'hover:bg-slate-50'}`}>
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${record ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-primary'}`}>
                                    {s.name[0]}{s.surname[0]}
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-text-heading">{s.name} {s.surname}</p>
                                    <p className="text-[10px] text-text-sub uppercase">{s.studentId}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-sm text-text-sub">
                                {s.class} - {s.section}
                              </td>
                              <td className="p-4">
                                {record ? (
                                  <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                                    record.status === 'Present' ? 'bg-green-100 text-green-700' : 
                                    record.status === 'Late' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                  }`}>
                                    {record.status}
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-slate-400 uppercase">Pending</span>
                                )}
                              </td>
                              <td className="p-4 text-xs text-text-sub font-medium">
                                {record?.time || '--:--'}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'manual' && (currentUser?.role === 'admin' || currentUser?.role === 'teacher') && (
          <motion.div key="manual" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-1 h-fit">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                  <UserCheck size={20} /> Attendance Settings
                </h3>
                <div className="space-y-6">
                  <Select label="Class" options={masterData.classes} value={manualForm.class} onChange={(e: any) => setManualForm({...manualForm, class: e.target.value})} />
                  <Select label="Section" options={masterData.sections} value={manualForm.section} onChange={(e: any) => setManualForm({...manualForm, section: e.target.value})} />
                  <Input label="Date" type="date" value={manualForm.date} onChange={(e: any) => setManualForm({...manualForm, date: e.target.value})} />
                  <Select label="Mark As" options={['Present', 'Absent', 'Late', 'Leave', 'Holiday']} value={manualForm.status} onChange={(e: any) => setManualForm({...manualForm, status: e.target.value as any})} />
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Period</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Morning', 'Last Period'].map((p) => (
                        <button
                          key={p}
                          onClick={() => setManualForm({...manualForm, period: p as any})}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                            manualForm.period === p 
                              ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                              : 'bg-slate-50 text-text-secondary border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <button 
                      onClick={handleManualMark} 
                      disabled={selectedStudents.length === 0}
                      className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle2 size={20} />
                      Mark Attendance ({selectedStudents.length})
                    </button>
                    <p className="mt-4 text-[10px] text-center text-text-sub italic leading-relaxed">
                      Select students from the list and click the button to mark their attendance for the selected date.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="lg:col-span-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
                    <Users size={20} /> Student List
                  </h3>
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search student..." 
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-primary outline-none text-sm transition-all"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-100">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="p-4 w-12">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                            checked={manualFilteredStudents.length > 0 && selectedStudents.length === manualFilteredStudents.length}
                            onChange={toggleSelectAll}
                          />
                        </th>
                        <th className="p-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Student Info</th>
                        <th className="p-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Class/Section</th>
                        <th className="p-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {manualFilteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-12 text-center text-text-sub italic">
                            No students found matching the criteria.
                          </td>
                        </tr>
                      ) : (
                        manualFilteredStudents.map((s: any) => {
                          const isMarked = attendance.find((a: any) => a.studentId === s.studentId && a.date === new Date(manualForm.date).toLocaleDateString());
                          return (
                            <tr 
                              key={s.studentId} 
                              className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedStudents.includes(s.studentId) ? 'bg-primary/5' : ''}`}
                              onClick={() => toggleStudentSelection(s.studentId)}
                            >
                              <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                <input 
                                  type="checkbox" 
                                  className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                                  checked={selectedStudents.includes(s.studentId)}
                                  onChange={() => toggleStudentSelection(s.studentId)}
                                />
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-primary font-bold text-xs">
                                    {s.name[0]}{s.surname[0]}
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-text-heading">{s.name} {s.surname}</p>
                                    <p className="text-[10px] text-text-sub uppercase">{s.studentId}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-sm font-medium text-text-sub">
                                {s.class} - {s.section}
                              </td>
                              <td className="p-4">
                                {isMarked ? (
                                  <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                                    isMarked.status === 'Present' ? 'bg-green-100 text-green-700' : 
                                    isMarked.status === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                  }`}>
                                    {isMarked.status}
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-slate-400 uppercase">Not Marked</span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {(activeTab === 'history' || activeTab === 'my-attendance') && (
          <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card>
              {(currentUser?.role === 'admin' || currentUser?.role === 'teacher') && (
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
                      <Calendar size={16} className="text-text-secondary" />
                      <input 
                        type="date" 
                        className="bg-transparent outline-none text-sm font-medium"
                        value={historyFilters.date}
                        onChange={(e) => setHistoryFilters({...historyFilters, date: e.target.value})}
                      />
                    </div>
                    <select 
                      className="bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 outline-none text-sm font-medium"
                      value={historyFilters.class}
                      onChange={(e) => setHistoryFilters({...historyFilters, class: e.target.value})}
                    >
                      <option value="">All Classes</option>
                      {masterData.classes.map((c: string) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select 
                      className="bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 outline-none text-sm font-medium"
                      value={historyFilters.section}
                      onChange={(e) => setHistoryFilters({...historyFilters, section: e.target.value})}
                    >
                      <option value="">All Sections</option>
                      {masterData.sections.map((s: string) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Date</th>
                      {(currentUser?.role === 'admin' || currentUser?.role === 'teacher') && <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Student</th>}
                      <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Class</th>
                      <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Status</th>
                      <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {((currentUser?.role === 'admin' || currentUser?.role === 'teacher') ? filteredHistory : myAttendance).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-text-sub italic">No attendance records found.</td>
                      </tr>
                    ) : (
                      ((currentUser?.role === 'admin' || currentUser?.role === 'teacher') ? filteredHistory : myAttendance).map((a: any) => (
                        <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 text-sm font-medium text-text-sub">
                            {a.date}
                            <span className="ml-2 text-[10px] font-bold text-primary/60 uppercase">({a.period || 'Morning'})</span>
                          </td>
                          {(currentUser?.role === 'admin' || currentUser?.role === 'teacher') && (
                            <td className="py-4">
                              <p className="text-sm font-bold text-text-heading">{a.studentName}</p>
                              <p className="text-[10px] text-text-sub uppercase">{a.studentId}</p>
                            </td>
                          )}
                          <td className="py-4 text-sm font-medium text-text-sub">{a.class} - {a.section}</td>
                          <td className="py-4">
                            <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                              a.status === 'Present' ? 'bg-green-100 text-green-700' : 
                              a.status === 'Absent' ? 'bg-red-100 text-red-700' : 
                              a.status === 'Late' ? 'bg-amber-100 text-amber-700' : 
                              a.status === 'Leave' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {a.status}
                            </span>
                          </td>
                          <td className="py-4 text-sm font-medium text-text-sub">{a.time}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Academics = ({
  students,
  setStudents,
  masterData,
  timeTables,
  setTimeTables,
  syllabuses,
  setSyllabuses,
  homeworks,
  setHomeworks,
  teacherAssignments,
  setTeacherAssignments,
  currentUser
}: any) => {
  const [activeTab, setActiveTab] = useState<'timetable' | 'assignments' | 'promotion' | 'syllabus' | 'homework' | 'planner'>('timetable');
  
  // Filter data based on user role
  const filteredTimeTables = (currentUser?.role === 'admin' || currentUser?.role === 'teacher')
    ? timeTables 
    : timeTables.filter((t: any) => t.class === currentUser?.class && t.section === currentUser?.section);
    
  const filteredSyllabuses = (currentUser?.role === 'admin' || currentUser?.role === 'teacher')
    ? syllabuses
    : syllabuses.filter((s: any) => s.class === currentUser?.class);
    
  const filteredHomeworks = (currentUser?.role === 'admin' || currentUser?.role === 'teacher')
    ? homeworks
    : homeworks.filter((h: any) => h.class === currentUser?.class && h.section === currentUser?.section);

  const filteredAssignments = (currentUser?.role === 'admin')
    ? teacherAssignments
    : (currentUser?.role === 'teacher')
      ? teacherAssignments.filter((a: any) => a.classTeacher === currentUser.name || a.subjectTeachers.some((st: any) => st.teacher === currentUser.name))
      : teacherAssignments.filter((a: any) => a.class === currentUser?.class && a.section === currentUser?.section);
    
  // Time Table Form
  const [ttForm, setTtForm] = useState({
    class: '',
    section: '',
    day: 'Monday',
    startTime: '',
    endTime: '',
    subject: '',
    teacher: ''
  });

  // Assignment Form
  const [assignForm, setAssignForm] = useState({
    class: '',
    section: '',
    classTeacher: '',
    subject: '',
    teacher: '',
    session: '2024-25'
  });

  // Syllabus Form
  const [syllabusForm, setSyllabusForm] = useState({
    class: '',
    subject: '',
    title: '',
    description: ''
  });

  // Homework Form
  const [homeworkForm, setHomeworkForm] = useState({
    class: '',
    section: '',
    subject: '',
    title: '',
    description: '',
    dueDate: ''
  });

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [homeworkFile, setHomeworkFile] = useState<File | null>(null);

  const generateAITimeTable = async () => {
    if (!ttForm.class || !ttForm.section) {
      alert('Please select Class and Section first');
      return;
    }
    
    setIsGeneratingAI(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const prompt = `Generate a weekly school time table for Class ${ttForm.class} Section ${ttForm.section}. 
      Available Subjects: ${masterData.subjects.join(', ')}. 
      Available Teachers: ${masterData.teachers.join(', ')}. 
      Format: JSON array of objects with fields: day (Monday-Friday), startTime, endTime, subject, teacher. 
      Ensure no teacher is double booked. Return ONLY the JSON array.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      
      const result = JSON.parse(response.text);
      const newEntries = result.map((entry: any) => ({
        ...entry,
        id: Math.random().toString(36).substr(2, 9),
        class: ttForm.class,
        section: ttForm.section
      }));
      
      setTimeTables([...timeTables, ...newEntries]);
      alert('AI Time Table generated successfully!');
    } catch (error) {
      console.error('AI Generation error:', error);
      alert('Failed to generate AI Time Table');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleAddTimeTable = () => {
    if (!ttForm.class || !ttForm.section || !ttForm.subject) return;
    
    const existing = timeTables.find((t: any) => t.class === ttForm.class && t.section === ttForm.section);
    if (existing) {
      const updated = timeTables.map((t: any) => {
        if (t.class === ttForm.class && t.section === ttForm.section) {
          return { ...t, entries: [...t.entries, { day: ttForm.day, startTime: ttForm.startTime, endTime: ttForm.endTime, subject: ttForm.subject, teacher: ttForm.teacher }] };
        }
        return t;
      });
      setTimeTables(updated);
    } else {
      setTimeTables([...timeTables, {
        id: Date.now().toString(),
        class: ttForm.class,
        section: ttForm.section,
        entries: [{ day: ttForm.day, startTime: ttForm.startTime, endTime: ttForm.endTime, subject: ttForm.subject, teacher: ttForm.teacher }]
      }]);
    }
    alert('Time table entry added!');
  };

  const handleAssignTeacher = () => {
    if (!assignForm.class || !assignForm.section) return;
    
    const existing = teacherAssignments.find((a: any) => a.class === assignForm.class && a.section === assignForm.section && a.session === assignForm.session);
    if (existing) {
      const updated = teacherAssignments.map((a: any) => {
        if (a.class === assignForm.class && a.section === assignForm.section && a.session === assignForm.session) {
          const newSubjectTeachers = [...a.subjectTeachers];
          if (assignForm.subject && assignForm.teacher) {
            // Check if subject already assigned
            const subIdx = newSubjectTeachers.findIndex(st => st.subject === assignForm.subject);
            if (subIdx > -1) {
              newSubjectTeachers[subIdx].teacher = assignForm.teacher;
            } else {
              newSubjectTeachers.push({ subject: assignForm.subject, teacher: assignForm.teacher });
            }
          }
          return { ...a, classTeacher: assignForm.classTeacher || a.classTeacher, subjectTeachers: newSubjectTeachers };
        }
        return a;
      });
      setTeacherAssignments(updated);
    } else {
      setTeacherAssignments([...teacherAssignments, {
        id: Date.now().toString(),
        class: assignForm.class,
        section: assignForm.section,
        classTeacher: assignForm.classTeacher,
        session: assignForm.session,
        subjectTeachers: assignForm.subject && assignForm.teacher ? [{ subject: assignForm.subject, teacher: assignForm.teacher }] : []
      }]);
    }
    alert('Teacher assigned!');
  };

  const handleAddSyllabus = () => {
    if (!syllabusForm.class || !syllabusForm.subject || !syllabusForm.title) return;
    setSyllabuses([...syllabuses, {
      ...syllabusForm,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString()
    }]);
    alert('Syllabus added!');
  };

  const handleAddHomework = () => {
    if (!homeworkForm.class || !homeworkForm.section || !homeworkForm.subject) return;
    setHomeworks([...homeworks, {
      ...homeworkForm,
      id: Date.now().toString(),
      teacherName: currentUser?.role === 'teacher' ? currentUser.name : 'Admin',
      date: new Date().toLocaleDateString(),
      submissions: [],
      file: homeworkFile ? URL.createObjectURL(homeworkFile) : undefined
    }]);
    setHomeworkForm({ class: '', section: '', subject: '', title: '', description: '', dueDate: '' });
    setHomeworkFile(null);
    alert('Homework uploaded!');
  };

  const handleStudentSubmit = (homeworkId: string, file: File) => {
    const updatedHomeworks = homeworks.map((h: any) => {
      if (h.id === homeworkId) {
        return {
          ...h,
          submissions: [
            ...(h.submissions || []),
            {
              studentId: currentUser.id,
              studentName: currentUser.name,
              file: URL.createObjectURL(file),
              date: new Date().toLocaleString()
            }
          ]
        };
      }
      return h;
    });
    setHomeworks(updatedHomeworks);
    alert('Homework submitted successfully!');
  };

  const [promotionFrom, setPromotionFrom] = useState('');
  const [promotionTo, setPromotionTo] = useState('');
  const [promotionDecisions, setPromotionDecisions] = useState<Record<string, 'promote' | 'detain'>>({});

  const handlePromoteStudents = (fromClass: string, toClass: string) => {
    if (!fromClass || !toClass) {
      alert('Please select both current and next class');
      return;
    }
    const studentsInClass = students.filter((s: any) => s.class === fromClass);
    if (studentsInClass.length === 0) {
      alert(`No students found in ${fromClass}`);
      return;
    }

    const updated = students.map((s: any) => {
      if (s.class === fromClass) {
        const decision = promotionDecisions[s.id] || 'promote';
        if (decision === 'promote') {
          return { ...s, class: toClass };
        }
      }
      return s;
    });

    setStudents(updated);
    const promotedCount = studentsInClass.filter(s => (promotionDecisions[s.id] || 'promote') === 'promote').length;
    const detainedCount = studentsInClass.length - promotedCount;
    
    alert(`Promotion completed! ${promotedCount} students promoted to ${toClass}, ${detainedCount} students detained in ${fromClass}.`);
    
    setPromotionFrom('');
    setPromotionTo('');
    setPromotionDecisions({});
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Academics Module 🎓</h1>
          <p className="text-text-secondary">Manage time tables, teacher assignments, syllabus, and student promotions.</p>
        </div>
      </div>

      <div className="flex gap-4 p-1 bg-slate-100 rounded-2xl w-fit">
        {[
          { id: 'timetable', label: 'Time Table', icon: Clock },
          { id: 'assignments', label: 'Teacher Assignments', icon: UserCheck },
          { id: 'promotion', label: 'Promotion', icon: ArrowUpCircle, adminOnly: true },
          { id: 'syllabus', label: 'Syllabus', icon: BookOpen },
          { 
            id: 'homework', 
            label: 'Homework', 
            icon: () => (
              <img 
                src="https://storage.googleapis.com/cortex-dev-cortex-build-public-assets/ais-dev-qwpf4dfgd7b2nhd2genpku-212916940376/nehatripathifreelance%40gmail.com/1742561480073-image-2.png" 
                alt="HW" 
                className="w-5 h-5 object-contain"
                referrerPolicy="no-referrer"
              />
            ) 
          },
          { id: 'planner', label: 'Academic Planner', icon: Calendar }
        ].filter(tab => !tab.adminOnly || currentUser?.role === 'admin').map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-text-sub hover:bg-white/50'
            }`}
          >
            {(() => {
              const TabIcon = tab.icon as React.ElementType;
              return typeof tab.icon === 'function' ? <TabIcon /> : <TabIcon size={18} />;
            })()}
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'timetable' && (
          <motion.div key="timetable" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {(currentUser?.role === 'admin' || currentUser?.role === 'teacher') && (
                <Card className="lg:col-span-1">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                    <Plus size={20} /> Add Time Table Entry
                  </h3>
                  <div className="space-y-4">
                    <Select label="Class" options={masterData.classes} value={ttForm.class} onChange={(e: any) => setTtForm({...ttForm, class: e.target.value})} />
                    <Select label="Section" options={masterData.sections} value={ttForm.section} onChange={(e: any) => setTtForm({...ttForm, section: e.target.value})} />
                    <Select label="Day" options={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']} value={ttForm.day} onChange={(e: any) => setTtForm({...ttForm, day: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Start Time" type="time" value={ttForm.startTime} onChange={(e: any) => setTtForm({...ttForm, startTime: e.target.value})} />
                      <Input label="End Time" type="time" value={ttForm.endTime} onChange={(e: any) => setTtForm({...ttForm, endTime: e.target.value})} />
                    </div>
                    <Select label="Subject" options={masterData.subjects} value={ttForm.subject} onChange={(e: any) => setTtForm({...ttForm, subject: e.target.value})} />
                    <Input label="Teacher Name" value={ttForm.teacher} onChange={(e: any) => setTtForm({...ttForm, teacher: e.target.value})} />
                    <button onClick={handleAddTimeTable} className="btn-primary w-full py-3 mt-4">Add Entry</button>
                    <div className="relative py-4">
                      <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
                      <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">Or use AI</span></div>
                    </div>
                    <button 
                      onClick={generateAITimeTable} 
                      disabled={isGeneratingAI}
                      className="w-full py-3 rounded-xl font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all flex items-center justify-center gap-2 border border-indigo-100"
                    >
                      {isGeneratingAI ? <Clock className="animate-spin" size={18} /> : <Sparkles size={18} />}
                      {isGeneratingAI ? 'Generating...' : 'AI Generate Time Table'}
                    </button>
                  </div>
                </Card>
              )}

              <Card className={(currentUser?.role === 'admin' || currentUser?.role === 'teacher') ? "lg:col-span-2" : "lg:col-span-3"}>
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                  <Clock size={20} /> {(currentUser?.role === 'admin' || currentUser?.role === 'teacher') ? 'Class Time Tables' : 'My Time Table'}
                </h3>
                <div className="space-y-6">
                  {filteredTimeTables.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-text-sub">No time tables set yet.</p>
                    </div>
                  ) : (
                    filteredTimeTables.map((tt: any) => (
                      <div key={tt.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-lg">{tt.class} - Section {tt.section}</h4>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-slate-200">
                                <th className="pb-3">Day</th>
                                <th className="pb-3">Time</th>
                                <th className="pb-3">Subject</th>
                                <th className="pb-3">Teacher</th>
                              </tr>
                            </thead>
                            <tbody className="text-sm">
                              {tt.entries.map((entry: any, idx: number) => (
                                <tr key={idx} className="border-b border-slate-100 last:border-0">
                                  <td className="py-3 font-medium">{entry.day}</td>
                                  <td className="py-3">{entry.startTime} - {entry.endTime}</td>
                                  <td className="py-3">{entry.subject}</td>
                                  <td className="py-3">{entry.teacher}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'assignments' && (
          <motion.div key="assignments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {currentUser?.role === 'admin' && (
                <Card className="lg:col-span-1">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                    <UserCheck size={20} /> Assign Teacher
                  </h3>
                  <div className="space-y-4">
                    <Select label="Session" options={masterData.sessions} value={assignForm.session} onChange={(e: any) => setAssignForm({...assignForm, session: e.target.value})} />
                    <Select label="Class" options={masterData.classes} value={assignForm.class} onChange={(e: any) => setAssignForm({...assignForm, class: e.target.value})} />
                    <Select label="Section" options={masterData.sections} value={assignForm.section} onChange={(e: any) => setAssignForm({...assignForm, section: e.target.value})} />
                    <Input label="Class Teacher Name" value={assignForm.classTeacher} onChange={(e: any) => setAssignForm({...assignForm, classTeacher: e.target.value})} />
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                      <p className="text-xs font-bold text-text-sub uppercase">Subject Teacher Assignment</p>
                      <Select label="Subject" options={masterData.subjects} value={assignForm.subject} onChange={(e: any) => setAssignForm({...assignForm, subject: e.target.value})} />
                      <Select label="Teacher" options={masterData.teachers} value={assignForm.teacher} onChange={(e: any) => setAssignForm({...assignForm, teacher: e.target.value})} />
                    </div>
                    <button onClick={handleAssignTeacher} className="btn-primary w-full py-3 mt-4">Assign</button>
                  </div>
                </Card>
              )}

              <Card className={(currentUser?.role === 'admin' || currentUser?.role === 'teacher') ? "lg:col-span-2" : "lg:col-span-3"}>
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                  <ClipboardList size={20} /> {(currentUser?.role === 'admin' || currentUser?.role === 'teacher') ? 'Class Assignments' : 'My Teachers'}
                </h3>
                <div className="space-y-6">
                  {filteredAssignments.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-text-sub">No teachers assigned yet.</p>
                    </div>
                  ) : (
                    filteredAssignments.map((ca: any) => (
                      <div key={ca.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-all group">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-lg">{ca.class} - Section {ca.section}</h4>
                              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-black uppercase tracking-wider">{ca.session}</span>
                            </div>
                            <span className="text-sm text-text-sub font-bold">Class Teacher: {ca.classTeacher}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {ca.subjectTeachers.map((st: any, idx: number) => (
                            <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                              <span className="text-sm font-bold">{st.subject}</span>
                              <span className="text-sm text-text-sub">{st.teacher}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'promotion' && (
          <motion.div key="promotion" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                <ArrowUpCircle size={20} /> Promote / Detain Students
              </h3>
              <p className="text-text-sub mb-8">Select the current class and the class to promote students to. You can individually decide to promote or detain each student.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end mb-12">
                <Select 
                  label="Current Class" 
                  options={masterData.classes} 
                  value={promotionFrom}
                  onChange={(e: any) => {
                    const from = e.target.value;
                    setPromotionFrom(from);
                    // Reset decisions when class changes
                    setPromotionDecisions({});
                    // Suggest next class
                    const nextIdx = masterData.classes.indexOf(from) + 1;
                    if (nextIdx < masterData.classes.length) {
                      setPromotionTo(masterData.classes[nextIdx]);
                    } else {
                      setPromotionTo('');
                    }
                  }}
                />
                <div className="flex justify-center pb-4">
                  <ArrowRightLeft className="text-slate-300" size={32} />
                </div>
                <Select 
                  label="Next Class" 
                  options={masterData.classes} 
                  value={promotionTo}
                  onChange={(e: any) => setPromotionTo(e.target.value)}
                />
              </div>

              {promotionFrom && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-700">Student List - {promotionFrom}</h4>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          const decisions: any = {};
                          students.filter((s: any) => s.class === promotionFrom).forEach((s: any) => {
                            decisions[s.id] = 'promote';
                          });
                          setPromotionDecisions(decisions);
                        }}
                        className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
                      >
                        Promote All
                      </button>
                      <button 
                        onClick={() => {
                          const decisions: any = {};
                          students.filter((s: any) => s.class === promotionFrom).forEach((s: any) => {
                            decisions[s.id] = 'detain';
                          });
                          setPromotionDecisions(decisions);
                        }}
                        className="text-xs px-3 py-1 bg-amber-50 text-amber-600 rounded-full hover:bg-amber-100"
                      >
                        Detain All
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4 font-semibold">Student</th>
                          <th className="px-6 py-4 font-semibold">Roll No</th>
                          <th className="px-6 py-4 font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {students.filter((s: any) => s.class === promotionFrom).map((s: any) => (
                          <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold">
                                  {s.name[0]}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900">{s.name} {s.surname}</div>
                                  <div className="text-xs text-slate-500">{s.studentId}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">{s.rollNo}</td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => setPromotionDecisions(prev => ({ ...prev, [s.id]: 'promote' }))}
                                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                                    (promotionDecisions[s.id] || 'promote') === 'promote' 
                                      ? 'bg-green-100 text-green-700 border border-green-200' 
                                      : 'bg-slate-100 text-slate-500 border border-transparent hover:bg-slate-200'
                                  }`}
                                >
                                  Promote
                                </button>
                                <button 
                                  onClick={() => setPromotionDecisions(prev => ({ ...prev, [s.id]: 'detain' }))}
                                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                                    promotionDecisions[s.id] === 'detain' 
                                      ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                                      : 'bg-slate-100 text-slate-500 border border-transparent hover:bg-slate-200'
                                  }`}
                                >
                                  Detain
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                    <AlertCircle className="text-amber-500 shrink-0" size={24} />
                    <div>
                      <h4 className="font-bold text-amber-900">Important Note</h4>
                      <p className="text-sm text-amber-800">Student promotion is a bulk action. Ensure you have finalized all results before proceeding. This action will update the class for all students marked as "Promote". Students marked as "Detain" will remain in their current class.</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handlePromoteStudents(promotionFrom, promotionTo)}
                    className="btn-primary px-12 py-4 mt-4"
                  >
                    Execute Promotion / Detention
                  </button>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {activeTab === 'syllabus' && (
          <motion.div key="syllabus" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {(currentUser?.role === 'admin' || currentUser?.role === 'teacher') && (
                <Card className="lg:col-span-1">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                    <Plus size={20} /> Prepare Syllabus
                  </h3>
                  <div className="space-y-4">
                    <Select label="Class" options={masterData.classes} value={syllabusForm.class} onChange={(e: any) => setSyllabusForm({...syllabusForm, class: e.target.value})} />
                    <Select label="Subject" options={masterData.subjects} value={syllabusForm.subject} onChange={(e: any) => setSyllabusForm({...syllabusForm, subject: e.target.value})} />
                    <Input label="Syllabus Title" value={syllabusForm.title} onChange={(e: any) => setSyllabusForm({...syllabusForm, title: e.target.value})} />
                    <div className="space-y-2">
                      <label className="label-text">Description / Topics</label>
                      <textarea 
                        className="input-field min-h-[150px]" 
                        value={syllabusForm.description}
                        onChange={(e: any) => setSyllabusForm({...syllabusForm, description: e.target.value})}
                      ></textarea>
                    </div>
                    <FileUpload label="Upload Syllabus PDF (Optional)" />
                    <button onClick={handleAddSyllabus} className="btn-primary w-full py-3 mt-4">Save Syllabus</button>
                  </div>
                </Card>
              )}

              <Card className={(currentUser?.role === 'admin' || currentUser?.role === 'teacher') ? "lg:col-span-2" : "lg:col-span-3"}>
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                  <BookOpen size={20} /> {(currentUser?.role === 'admin' || currentUser?.role === 'teacher') ? 'Published Syllabus' : 'My Syllabus'}
                </h3>
                <div className="space-y-6">
                  {filteredSyllabuses.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-text-sub">No syllabus prepared yet.</p>
                    </div>
                  ) : (
                    filteredSyllabuses.map((s: any) => (
                      <div key={s.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-bold text-lg">{s.title}</h4>
                            <p className="text-sm text-text-sub">{s.class} | {s.subject}</p>
                          </div>
                          <span className="text-xs text-text-sub">{s.date}</span>
                        </div>
                        <p className="text-sm text-text-secondary whitespace-pre-wrap">{s.description}</p>
                        <button className="mt-4 flex items-center gap-2 text-primary text-sm font-bold hover:underline">
                          <Download size={16} /> Download PDF
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'homework' && (
          <motion.div key="homework" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {(currentUser?.role === 'admin' || currentUser?.role === 'teacher') && (
                <Card className="lg:col-span-1">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                    <Upload size={20} /> Upload Homework
                  </h3>
                  <div className="space-y-4">
                    <Select label="Class" options={masterData.classes} value={homeworkForm.class} onChange={(e: any) => setHomeworkForm({...homeworkForm, class: e.target.value})} />
                    <Select label="Section" options={masterData.sections} value={homeworkForm.section} onChange={(e: any) => setHomeworkForm({...homeworkForm, section: e.target.value})} />
                    <Select label="Subject" options={masterData.subjects} value={homeworkForm.subject} onChange={(e: any) => setHomeworkForm({...homeworkForm, subject: e.target.value})} />
                    <Input label="Homework Title" value={homeworkForm.title} onChange={(e: any) => setHomeworkForm({...homeworkForm, title: e.target.value})} />
                    <div className="space-y-2">
                      <label className="label-text">Instructions</label>
                      <textarea 
                        className="input-field min-h-[150px]" 
                        value={homeworkForm.description}
                        onChange={(e: any) => setHomeworkForm({...homeworkForm, description: e.target.value})}
                      ></textarea>
                    </div>
                    <Input label="Due Date" type="date" value={homeworkForm.dueDate} onChange={(e: any) => setHomeworkForm({...homeworkForm, dueDate: e.target.value})} />
                    <div className="space-y-2">
                      <label className="label-text">Homework PDF (Optional)</label>
                      <input 
                        type="file" 
                        accept=".pdf"
                        onChange={(e) => setHomeworkFile(e.target.files?.[0] || null)}
                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                    </div>
                    <button onClick={handleAddHomework} className="btn-primary w-full py-3 mt-4">Upload Homework</button>
                  </div>
                </Card>
              )}

              <Card className={(currentUser?.role === 'admin' || currentUser?.role === 'teacher') ? "lg:col-span-2" : "lg:col-span-3"}>
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                  <FileEdit size={20} /> {(currentUser?.role === 'admin' || currentUser?.role === 'teacher') ? 'Homework List' : 'My Homework'}
                </h3>
                <div className="space-y-6">
                  {filteredHomeworks.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-text-sub">No homework uploaded yet.</p>
                    </div>
                  ) : (
                    filteredHomeworks.map((h: any) => (
                      <div key={h.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-bold text-lg">{h.title}</h4>
                            <p className="text-sm text-text-sub">{h.class} - {h.section} | {h.subject}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-red-500 block">Due: {h.dueDate}</span>
                            <span className="text-[10px] text-text-sub">By {h.teacherName}</span>
                          </div>
                        </div>
                        <p className="text-sm text-text-secondary whitespace-pre-wrap">{h.description}</p>
                        
                        {h.file && (
                          <a href={h.file} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-primary text-sm font-bold hover:underline">
                            <FileDown size={16} /> Download Assignment PDF
                          </a>
                        )}

                        {/* Student Submission Section */}
                        {currentUser?.role === 'student' && (
                          <div className="mt-6 pt-6 border-t border-slate-100">
                            <h5 className="text-sm font-bold mb-3 flex items-center gap-2">
                              <Upload size={16} /> Submit Your Work
                            </h5>
                            <div className="flex items-center gap-4">
                              <input 
                                type="file" 
                                accept=".pdf"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleStudentSubmit(h.id, file);
                                }}
                                className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                              />
                            </div>
                          </div>
                        )}

                        {/* Admin/Teacher View Submissions */}
                        {(currentUser?.role === 'admin' || currentUser?.role === 'teacher') && h.submissions?.length > 0 && (
                          <div className="mt-6 pt-6 border-t border-slate-100">
                            <h5 className="text-sm font-bold mb-3 flex items-center gap-2">
                              <ClipboardList size={16} /> Submissions ({h.submissions.length})
                            </h5>
                            <div className="space-y-2">
                              {h.submissions.map((sub: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                                  <div>
                                    <p className="text-sm font-bold">{sub.studentName}</p>
                                    <p className="text-[10px] text-text-sub">{sub.date}</p>
                                  </div>
                                  <a href={sub.file} target="_blank" rel="noreferrer" className="text-primary hover:text-primary-dark">
                                    <Eye size={18} />
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'planner' && (
          <motion.div key="planner" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <AcademicPlanner currentUser={currentUser} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AcademicPlanner = ({ currentUser }: any) => {
  const [holidays, setHolidays] = useState<any[]>([
    { date: '2026-01-26', title: 'Republic Day', type: 'National', icon: '🇮🇳' },
    { date: '2026-08-15', title: 'Independence Day', type: 'National', icon: '🇮🇳' },
    { date: '2026-10-02', title: 'Gandhi Jayanti', type: 'National', icon: '👓' },
    { date: '2026-12-25', title: 'Christmas', type: 'Festival', icon: '🎄' },
    { date: '2026-03-04', title: 'Holi', type: 'Festival', icon: '🎨' },
    { date: '2026-11-08', title: 'Diwali', type: 'Festival', icon: '🪔' },
    { date: '2026-03-20', title: 'Eid al-Fitr', type: 'Festival', icon: '🌙' },
  ]);

  const months = [
    { name: 'APRIL', days: 30, year: 2026, monthIdx: 3 },
    { name: 'MAY', days: 31, year: 2026, monthIdx: 4 },
    { name: 'JUNE', days: 30, year: 2026, monthIdx: 5 },
    { name: 'JULY', days: 31, year: 2026, monthIdx: 6 },
    { name: 'AUGUST', days: 31, year: 2026, monthIdx: 7 },
    { name: 'SEPTEMBER', days: 30, year: 2026, monthIdx: 8 },
    { name: 'OCTOBER', days: 31, year: 2026, monthIdx: 9 },
    { name: 'NOVEMBER', days: 30, year: 2026, monthIdx: 10 },
    { name: 'DECEMBER', days: 31, year: 2026, monthIdx: 11 },
    { name: 'JANUARY', days: 31, year: 2027, monthIdx: 0 },
    { name: 'FEBRUARY', days: 28, year: 2027, monthIdx: 1 },
    { name: 'MARCH', days: 31, year: 2027, monthIdx: 2 },
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const getHoliday = (day: number, month: any) => {
    const dateStr = `${month.year}-${String(month.monthIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return holidays.find(h => h.date === dateStr);
  };

  const isSunday = (day: number, month: any) => {
    const date = new Date(month.year, month.monthIdx, day);
    return date.getDay() === 0;
  };

  const getDayName = (day: number, month: any) => {
    const date = new Date(month.year, month.monthIdx, day);
    return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  };

  const handleGoogleCalendarSync = async () => {
    try {
      const response = await fetch('/api/auth/google/url');
      if (!response.ok) throw new Error('Failed to get auth URL');
      const { url } = await response.json();
      
      const authWindow = window.open(url, 'google_oauth', 'width=600,height=700');
      if (!authWindow) {
        alert('Please allow popups to sync with Google Calendar');
      }
    } catch (error) {
      console.error('Sync error:', error);
      alert('Failed to initiate Google Calendar sync');
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        alert('Successfully synced with Google Calendar!');
        // In a real app, we would fetch the events here
        setHolidays(prev => [
          ...prev,
          { date: '2026-09-13', title: 'Grandparents Day', type: 'Other', icon: '👴' },
          { date: '2026-08-28', title: 'Raksha Bandhan', type: 'Festival', icon: '🪢' },
        ]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <Card className="overflow-hidden p-0 border-none shadow-2xl bg-slate-900">
      <div className="p-6 flex items-center justify-between bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Academic Planner 2026-27</h2>
          <p className="text-slate-400 text-sm font-medium">Annual Academic Calendar & Holiday List</p>
        </div>
        {currentUser?.role === 'admin' && (
          <button 
            onClick={handleGoogleCalendarSync}
            className="flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-sm hover:bg-slate-100 transition-all shadow-lg"
          >
            <Calendar size={18} />
            Sync Google Calendar
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1200px]">
          {/* Header Row */}
          <div className="grid grid-cols-[80px_repeat(12,1fr)] bg-slate-800 border-b border-slate-700">
            <div className="p-4 flex flex-col items-center justify-center border-r border-slate-700">
              <span className="text-white font-black text-xl italic leading-none">D/</span>
              <span className="text-white font-black text-xl italic leading-none">M</span>
            </div>
            {months.map((m, idx) => (
              <div key={idx} className="p-4 text-center border-r border-slate-700 last:border-0 bg-gradient-to-b from-indigo-600/20 to-transparent">
                <span className="text-indigo-400 font-black text-sm tracking-widest">{m.name}</span>
              </div>
            ))}
          </div>

          {/* Days Rows */}
          {days.map((day) => (
            <div key={day} className="grid grid-cols-[80px_repeat(12,1fr)] border-b border-slate-800 last:border-0">
              <div className="p-4 flex items-center justify-center bg-slate-800/50 border-r border-slate-700">
                <span className="text-white font-black text-2xl italic">{day}</span>
              </div>
              {months.map((m, idx) => {
                const holiday = getHoliday(day, m);
                const sunday = isSunday(day, m);
                const dayName = getDayName(day, m);
                const isInvalidDate = day > m.days;

                return (
                  <div 
                    key={idx} 
                    className={`p-2 min-h-[100px] border-r border-slate-800 last:border-0 transition-all relative group
                      ${isInvalidDate ? 'bg-slate-900/50' : 'bg-slate-900 hover:bg-slate-800/50'}
                      ${holiday ? 'ring-1 ring-inset ring-indigo-500/50' : ''}
                    `}
                  >
                    {!isInvalidDate && (
                      <>
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-[10px] font-bold tracking-tighter ${sunday ? 'text-rose-500' : 'text-slate-600'}`}>
                            {dayName}
                          </span>
                          {currentUser?.role === 'admin' && !holiday && (
                            <button className="opacity-0 group-hover:opacity-100 text-indigo-500 hover:text-indigo-400 transition-opacity">
                              <Plus size={12} />
                            </button>
                          )}
                        </div>
                        
                        {holiday && (
                          <div className="flex flex-col items-center justify-center h-full pb-4">
                            <span className="text-3xl mb-1 drop-shadow-lg">{holiday.icon}</span>
                            <span className={`text-[9px] font-black text-center leading-tight uppercase px-1 py-0.5 rounded
                              ${holiday.type === 'National' ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300'}
                            `}>
                              {holiday.title}
                            </span>
                          </div>
                        )}

                        {sunday && !holiday && (
                          <div className="flex items-center justify-center h-full pb-4">
                            <span className="text-rose-900/30 font-black text-xs tracking-widest uppercase rotate-45">Sunday</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

const FeeManagement = ({ 
  students, 
  feeTypes, 
  setFeeTypes, 
  feeMaster, 
  setFeeMaster, 
  feeTransactions, 
  setFeeTransactions,
  schoolProfile,
  masterData,
  showModal,
  leaveRequests,
  getStudentDueFees
}: any) => {
  const [activeTab, setActiveTab] = useState<'collect' | 'master' | 'reports'>('collect');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedFeeType, setSelectedFeeType] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    mode: 'Cash' as 'Cash' | 'UPI' | 'Bank Transfer',
    transactionId: '',
    discount: 0,
    discountReason: '',
    scholarship: 0,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  const [showReceipt, setShowReceipt] = useState<FeeTransaction | null>(null);
  const [filters, setFilters] = useState({
    date: '',
    class: '',
    section: ''
  });

  const handleCollectFee = () => {
    if (!selectedStudent || !selectedFeeType) {
      alert('Please select student and fee type');
      return;
    }

    const feeInfo = feeMaster.find((f: any) => f.class === selectedStudent.class && f.feeType === selectedFeeType);
    if (!feeInfo) {
      alert('Fee not configured for this class and type in Fee Master');
      return;
    }

    // Duplicate Transaction ID check
    if (paymentDetails.mode !== 'Cash' && paymentDetails.transactionId) {
      const duplicate = feeTransactions.find((t: any) => t.transactionId === paymentDetails.transactionId);
      if (duplicate) {
        alert('Duplicate Transaction ID detected!');
        return;
      }
    }

    const totalPaid = feeInfo.amount - paymentDetails.discount - paymentDetails.scholarship;
    
    const newTransaction: FeeTransaction = {
      id: `FT${Date.now()}`,
      studentId: selectedStudent.studentId,
      studentName: `${selectedStudent.name} ${selectedStudent.surname}`,
      class: selectedStudent.class,
      section: selectedStudent.section,
      feeType: selectedFeeType,
      amount: feeInfo.amount,
      discount: paymentDetails.discount,
      discountReason: paymentDetails.discountReason,
      scholarship: paymentDetails.scholarship,
      totalPaid,
      paymentMode: paymentDetails.mode,
      transactionId: paymentDetails.transactionId,
      date: new Date().toLocaleDateString(),
      dueDate: paymentDetails.dueDate,
      status: 'Paid'
    };

    setFeeTransactions([newTransaction, ...feeTransactions]);
    setShowReceipt(newTransaction);
    
    // Alert success
    alert(`Fee of ₹${totalPaid} collected for ${selectedStudent.name}`);
    
    // Reset form
    setSelectedStudent(null);
    setSelectedFeeType('');
    setPaymentDetails({
      mode: 'Cash',
      transactionId: '',
      discount: 0,
      discountReason: '',
      scholarship: 0,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(feeTransactions);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, "Fee_Report.xlsx");
  };

  const filteredTransactions = feeTransactions.filter(t => {
    return (!filters.date || t.date === new Date(filters.date).toLocaleDateString()) &&
           (!filters.class || t.class === filters.class) &&
           (!filters.section || t.section === filters.section);
  });

  const [masterClass, setMasterClass] = useState('');
  const [masterSelections, setMasterSelections] = useState<{[key: string]: { selected: boolean, amount: number, frequency: string }}>({});

  useEffect(() => {
    const initialSelections: any = {};
    feeTypes.forEach(ft => {
      initialSelections[ft.name] = { selected: false, amount: 0, frequency: 'Monthly' };
    });
    setMasterSelections(initialSelections);
  }, [feeTypes]);

  const handleAssignFees = () => {
    if (!masterClass) {
      alert('Please select a class');
      return;
    }

    const newEntries: FeeMaster[] = [];
    Object.entries(masterSelections).forEach(([feeType, data]: [string, any]) => {
      if (data.selected && data.amount > 0) {
        // Check if already exists for this class and type
        const exists = feeMaster.find((f: any) => f.class === masterClass && f.feeType === feeType);
        if (!exists) {
          newEntries.push({
            id: `FM${Date.now()}${Math.random().toString(36).substr(2, 5)}`,
            class: masterClass,
            feeType,
            amount: data.amount,
            frequency: data.frequency as any
          });
        }
      }
    });

    if (newEntries.length > 0) {
      setFeeMaster([...feeMaster, ...newEntries]);
      alert(`${newEntries.length} fees assigned to ${masterClass}`);
    } else {
      alert('No new fees to assign. Check if they are already assigned or amounts are zero.');
    }
  };

  const [editingFee, setEditingFee] = useState<FeeMaster | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-text-heading uppercase tracking-tighter">Fee Management</h1>
          <p className="text-text-secondary text-sm">Configure, collect and report school fees</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => setActiveTab('collect')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'collect' ? 'bg-primary text-white shadow-md' : 'text-text-sub hover:bg-slate-50'}`}
          >
            Collect Fee
          </button>
          <button 
            onClick={() => setActiveTab('master')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'master' ? 'bg-primary text-white shadow-md' : 'text-text-sub hover:bg-slate-50'}`}
          >
            Fee Master
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'reports' ? 'bg-primary text-white shadow-md' : 'text-text-sub hover:bg-slate-50'}`}
          >
            Reports
          </button>
        </div>
      </div>

      {activeTab === 'collect' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                <UserPlus size={20} />
                Select Student & Fee
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="label-text">Search Student</label>
                  <select 
                    className="input-field"
                    value={selectedStudent?.studentId || ''}
                    onChange={(e) => {
                      const student = students.find((s: any) => s.studentId === e.target.value);
                      setSelectedStudent(student || null);
                      setSelectedFeeType('');
                    }}
                  >
                    <option value="">Select Student</option>
                    {students.map((s: any) => (
                      <option key={s.studentId} value={s.studentId}>
                        {s.name} {s.surname} ({s.class}-{s.section}) - {s.studentId}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="label-text">Fee Type</label>
                  <select 
                    className="input-field"
                    value={selectedFeeType}
                    onChange={(e) => setSelectedFeeType(e.target.value)}
                  >
                    <option value="">Select Fee Type</option>
                    {feeMaster
                      .filter(fm => fm.class === selectedStudent?.class)
                      .map(fm => (
                        <option key={fm.id} value={fm.feeType}>
                          {fm.feeType} (₹{fm.amount})
                        </option>
                      ))
                    }
                  </select>
                  {selectedStudent && feeMaster.filter(fm => fm.class === selectedStudent.class).length === 0 && (
                    <p className="text-[10px] text-red-500 italic">No fees assigned to Class {selectedStudent.class} in Fee Master.</p>
                  )}
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                <Wallet size={20} />
                Payment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Select 
                  label="Payment Mode" 
                  options={['Cash', 'UPI', 'Bank Transfer']} 
                  value={paymentDetails.mode}
                  onChange={(e: any) => setPaymentDetails({...paymentDetails, mode: e.target.value})}
                />
                {paymentDetails.mode !== 'Cash' && (
                  <Input 
                    label="Transaction ID" 
                    placeholder="Enter ID..." 
                    value={paymentDetails.transactionId}
                    onChange={(e: any) => setPaymentDetails({...paymentDetails, transactionId: e.target.value})}
                  />
                )}
                <Input 
                  label="Due Date" 
                  type="date" 
                  value={paymentDetails.dueDate}
                  onChange={(e: any) => setPaymentDetails({...paymentDetails, dueDate: e.target.value})}
                />
                <Input 
                  label="Discount Amount" 
                  type="number" 
                  value={paymentDetails.discount}
                  onChange={(e: any) => setPaymentDetails({...paymentDetails, discount: parseFloat(e.target.value) || 0})}
                />
                <Input 
                  label="Discount Reason" 
                  placeholder="e.g. Sibling discount" 
                  value={paymentDetails.discountReason}
                  onChange={(e: any) => setPaymentDetails({...paymentDetails, discountReason: e.target.value})}
                />
                <Input 
                  label="Scholarship" 
                  type="number" 
                  value={paymentDetails.scholarship}
                  onChange={(e: any) => setPaymentDetails({...paymentDetails, scholarship: parseFloat(e.target.value) || 0})}
                />
              </div>
              
              <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-primary uppercase tracking-wider">Total Payable</p>
                  <p className="text-3xl font-black text-primary">
                    ₹{(() => {
                      if (!selectedStudent || !selectedFeeType) return 0;
                      const fee = feeMaster.find((f: any) => f.class === selectedStudent.class && f.feeType === selectedFeeType);
                      return fee ? (fee.amount - paymentDetails.discount - paymentDetails.scholarship) : 0;
                    })()}
                  </p>
                  {selectedStudent && (
                    <p className="text-xs text-red-500 font-bold mt-1">
                      Total Outstanding Due: ₹{getStudentDueFees(selectedStudent).toLocaleString()}
                    </p>
                  )}
                </div>
                <button 
                  onClick={handleCollectFee}
                  className="btn-primary px-8 py-3 flex items-center gap-2"
                >
                  <Coins size={20} />
                  Collect & Print
                </button>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="text-center">
              <h3 className="text-lg font-bold mb-4">Scan to Pay</h3>
              <div className="aspect-square bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200 mb-4">
                <QrCode size={120} className="text-slate-400" />
              </div>
              <p className="text-xs text-text-secondary">Accept payments via UPI QR Code</p>
            </Card>

            <Card>
              <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-text-secondary">Recent Payments</h3>
              <div className="space-y-3">
                {feeTransactions.slice(0, 5).map(t => (
                  <div key={t.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold">{t.studentName}</p>
                      <p className="text-[10px] text-text-sub uppercase">{t.feeType}</p>
                    </div>
                    <p className="text-sm font-black text-primary">₹{t.totalPaid}</p>
                  </div>
                ))}
              </div>
            </Card>

            {selectedStudent && (
              <Card className="bg-rose-50 border-rose-100">
                <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-rose-700 flex items-center gap-2">
                  <AlertCircle size={16} />
                  Student Alerts
                </h3>
                <div className="space-y-3">
                  {leaveRequests
                    .filter((l: any) => l.studentId === selectedStudent.studentId && l.status === 'Approved' && (l.type === 'Early Leave' || l.type === 'Parent Pickup'))
                    .map((l: any) => (
                      <div key={l.id} className="p-3 bg-white rounded-xl border border-rose-200 shadow-sm">
                        <p className="text-xs font-bold text-rose-600 uppercase mb-1">{l.type}</p>
                        <p className="text-sm font-medium text-text-heading">Pickup Time: {l.pickupTime || 'N/A'}</p>
                        <p className="text-[10px] text-text-sub mt-1">Check if any special fees apply.</p>
                      </div>
                    ))}
                  {leaveRequests.filter((l: any) => l.studentId === selectedStudent.studentId && l.status === 'Approved' && (l.type === 'Early Leave' || l.type === 'Parent Pickup')).length === 0 && (
                    <p className="text-xs text-rose-500 italic">No active leave/pickup alerts for today.</p>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {activeTab === 'master' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                <TagIcon size={20} />
                Fee Types
              </h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="New Fee Type" id="newFeeType" />
                  <button 
                    onClick={() => {
                      const input = document.getElementById('newFeeType') as HTMLInputElement;
                      if (input.value) {
                        setFeeTypes([...feeTypes, { id: Date.now().toString(), name: input.value, description: '' }]);
                        input.value = '';
                      }
                    }}
                    className="btn-primary px-4"
                  >
                    Add
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {feeTypes.map(f => (
                    <div key={f.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="font-medium">{f.name}</span>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => {
                            const newName = prompt('Edit Fee Type Name:', f.name);
                            if (newName && newName !== f.name) {
                              setFeeTypes(feeTypes.map(t => t.id === f.id ? { ...t, name: newName } : t));
                            }
                          }}
                          className="text-blue-500 hover:bg-blue-50 p-1 rounded-lg"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => setFeeTypes(feeTypes.filter(t => t.id !== f.id))} className="text-red-500 hover:bg-red-50 p-1 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="lg:col-span-2">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                <ArrowRightLeft size={20} />
                Fee Master (Setup)
              </h3>
              <div className="space-y-6">
                <div className="max-w-xs">
                  <Select 
                    label="Select Class" 
                    options={masterData.classes} 
                    value={masterClass}
                    onChange={(e: any) => setMasterClass(e.target.value)}
                  />
                </div>

                {masterClass && (
                  <div className="space-y-4">
                    <p className="text-sm font-bold text-text-secondary uppercase tracking-wider">Assign Fees for {masterClass}</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="pb-2 font-bold text-xs uppercase text-text-sub">Select</th>
                            <th className="pb-2 font-bold text-xs uppercase text-text-sub">Fee Type</th>
                            <th className="pb-2 font-bold text-xs uppercase text-text-sub">Amount</th>
                            <th className="pb-2 font-bold text-xs uppercase text-text-sub">Frequency</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {feeTypes.map(ft => (
                            <tr key={ft.id}>
                              <td className="py-3">
                                <input 
                                  type="checkbox" 
                                  checked={(masterSelections as any)[ft.name]?.selected || false}
                                  onChange={(e) => setMasterSelections({
                                    ...masterSelections,
                                    [ft.name]: { ...(masterSelections as any)[ft.name], selected: e.target.checked }
                                  })}
                                  className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                                />
                              </td>
                              <td className="py-3 font-medium text-sm">{ft.name}</td>
                              <td className="py-3">
                                <input 
                                  type="number"
                                  placeholder="Amount"
                                  value={(masterSelections as any)[ft.name]?.amount || ''}
                                  onChange={(e) => setMasterSelections({
                                    ...masterSelections,
                                    [ft.name]: { ...(masterSelections as any)[ft.name], amount: parseFloat(e.target.value) || 0 }
                                  })}
                                  className="w-24 px-2 py-1 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                              </td>
                              <td className="py-3">
                                <select 
                                  value={(masterSelections as any)[ft.name]?.frequency || 'Monthly'}
                                  onChange={(e) => setMasterSelections({
                                    ...masterSelections,
                                    [ft.name]: { ...(masterSelections as any)[ft.name], frequency: e.target.value }
                                  })}
                                  className="px-2 py-1 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                  {['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'].map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button 
                      onClick={handleAssignFees}
                      className="btn-primary px-8 py-3"
                    >
                      Assign Selected Fees
                    </button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <Card>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
              <ClipboardList size={20} />
              Assigned Fees List
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Class</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Fee Type</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Amount</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Frequency</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {feeMaster.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-text-sub">No fees assigned yet.</td>
                    </tr>
                  ) : (
                    feeMaster.map(m => (
                      <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 text-sm font-bold">{m.class}</td>
                        <td className="py-4 text-sm font-medium">{m.feeType}</td>
                        <td className="py-4 text-sm font-black text-primary">₹{m.amount}</td>
                        <td className="py-4 text-sm text-text-sub">{m.frequency}</td>
                        <td className="py-4 text-right space-x-2">
                          <button 
                            onClick={() => setEditingFee(m)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => {
                              showModal(
                                'Confirm Delete',
                                'Are you sure you want to delete this fee assignment?',
                                () => setFeeMaster(feeMaster.filter(f => f.id !== m.id))
                              );
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {editingFee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Edit Fee Master</h3>
              <button onClick={() => setEditingFee(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <Input label="Class" value={editingFee.class} disabled />
              <Input label="Fee Type" value={editingFee.feeType} disabled />
              <Input 
                label="Amount" 
                type="number" 
                value={editingFee.amount} 
                onChange={(e: any) => setEditingFee({...editingFee, amount: parseFloat(e.target.value) || 0})} 
              />
              <Select 
                label="Frequency" 
                options={['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly']} 
                value={editingFee.frequency} 
                onChange={(e: any) => setEditingFee({...editingFee, frequency: e.target.value as any})} 
              />
              <button 
                onClick={() => {
                  setFeeMaster(feeMaster.map(f => f.id === editingFee.id ? editingFee : f));
                  setEditingFee(null);
                  alert('Fee updated successfully!');
                }}
                className="w-full btn-primary py-3"
              >
                Update Fee
              </button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'reports' && (
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
                <Calendar size={16} className="text-text-secondary" />
                <input 
                  type="date" 
                  className="bg-transparent outline-none text-sm font-medium"
                  onChange={(e) => setFilters({...filters, date: e.target.value})}
                />
              </div>
              <select 
                className="bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 outline-none text-sm font-medium"
                onChange={(e) => setFilters({...filters, class: e.target.value})}
              >
                <option value="">All Classes</option>
                {masterData.classes.map((c: string) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select 
                className="bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 outline-none text-sm font-medium"
                onChange={(e) => setFilters({...filters, section: e.target.value})}
              >
                <option value="">All Sections</option>
                {masterData.sections.map((s: string) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button 
              onClick={exportToExcel}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-700 transition-all"
            >
              <FileSpreadsheet size={18} />
              Export Excel
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-slate-200">
                  <th className="pb-4 font-bold text-text-secondary text-xs uppercase tracking-wider">Date</th>
                  <th className="pb-4 font-bold text-text-secondary text-xs uppercase tracking-wider">Student</th>
                  <th className="pb-4 font-bold text-text-secondary text-xs uppercase tracking-wider">Class</th>
                  <th className="pb-4 font-bold text-text-secondary text-xs uppercase tracking-wider">Fee Type</th>
                  <th className="pb-4 font-bold text-text-secondary text-xs uppercase tracking-wider">Mode</th>
                  <th className="pb-4 font-bold text-text-secondary text-xs uppercase tracking-wider text-right">Amount</th>
                  <th className="pb-4 font-bold text-text-secondary text-xs uppercase tracking-wider text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 text-sm font-medium text-text-sub">{t.date}</td>
                    <td className="py-4">
                      <p className="text-sm font-bold text-text-heading">{t.studentName}</p>
                      <p className="text-[10px] text-text-sub uppercase">{t.studentId}</p>
                    </td>
                    <td className="py-4 text-sm font-medium text-text-sub">{t.class}-{t.section}</td>
                    <td className="py-4 text-sm font-medium text-text-sub">{t.feeType}</td>
                    <td className="py-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                        t.paymentMode === 'Cash' ? 'bg-green-100 text-green-700' : 
                        t.paymentMode === 'UPI' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {t.paymentMode}
                      </span>
                    </td>
                    <td className="py-4 text-right font-black text-primary">₹{t.totalPaid}</td>
                    <td className="py-4 text-center">
                      <button 
                        onClick={() => setShowReceipt(t)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all"
                      >
                        <Printer size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-secondary font-medium">No transactions found matching your filters.</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {showReceipt && (
        <ReceiptModal 
          transaction={showReceipt} 
          schoolProfile={schoolProfile} 
          onClose={() => setShowReceipt(null)} 
        />
      )}
    </div>
  );
};

// --- Fee Management Sub-components ---

const ReceiptModal = ({ transaction, schoolProfile, onClose }: { transaction: FeeTransaction, schoolProfile: any, onClose: () => void }) => {
  const receiptRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (receiptRef.current) {
      const canvas = await html2canvas(receiptRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Receipt_${transaction.id}.pdf`);
    }
  };

  const shareOnWhatsApp = () => {
    const text = `*Fee Receipt - ${schoolProfile.name}*\n\nStudent: ${transaction.studentName}\nClass: ${transaction.class}-${transaction.section}\nFee Type: ${transaction.feeType}\nAmount Paid: ₹${transaction.totalPaid}\nDate: ${transaction.date}\nTransaction ID: ${transaction.transactionId || 'N/A'}\nStatus: ${transaction.status}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-primary text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Receipt size={24} />
            Fee Receipt
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto max-h-[70vh]" ref={receiptRef}>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-primary uppercase tracking-tighter">{schoolProfile.name}</h1>
            <p className="text-sm text-text-secondary">{schoolProfile.address}</p>
            <p className="text-sm text-text-secondary">Contact: {schoolProfile.contact} | Reg No: {schoolProfile.regNo}</p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="space-y-2">
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Student Details</p>
              <p className="font-bold text-lg">{transaction.studentName}</p>
              <p className="text-sm text-text-sub">Class: {transaction.class} | Section: {transaction.section}</p>
              <p className="text-sm text-text-sub">ID: {transaction.studentId}</p>
            </div>
            <div className="space-y-2 text-right">
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Receipt Info</p>
              <p className="font-bold text-lg">#{transaction.id}</p>
              <p className="text-sm text-text-sub">Date: {transaction.date}</p>
              <p className="text-sm text-text-sub">Mode: {transaction.paymentMode}</p>
            </div>
          </div>

          <table className="w-full mb-8">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 font-bold text-text-heading">Description</th>
                <th className="text-right py-3 font-bold text-text-heading">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-4 text-text-sub">{transaction.feeType}</td>
                <td className="py-4 text-right font-medium">₹{transaction.amount}</td>
              </tr>
              {transaction.discount > 0 && (
                <tr className="border-b border-slate-100 text-green-600">
                  <td className="py-4 italic">Discount ({transaction.discountReason})</td>
                  <td className="py-4 text-right font-medium">-₹{transaction.discount}</td>
                </tr>
              )}
              {transaction.scholarship > 0 && (
                <tr className="border-b border-slate-100 text-blue-600">
                  <td className="py-4 italic">Scholarship</td>
                  <td className="py-4 text-right font-medium">-₹{transaction.scholarship}</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td className="py-6 text-xl font-black text-text-heading uppercase">Total Paid</td>
                <td className="py-6 text-right text-2xl font-black text-primary">₹{transaction.totalPaid}</td>
              </tr>
            </tfoot>
          </table>

          <div className="flex justify-between items-end pt-8 border-t border-dashed border-slate-200">
            <div className="text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-lg mb-2 flex items-center justify-center border border-slate-200">
                <QrCode size={48} className="text-slate-400" />
              </div>
              <p className="text-[10px] font-bold text-text-secondary uppercase">Scan to Verify</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-12 border-b border-slate-400 mb-2"></div>
              <p className="text-[10px] font-bold text-text-secondary uppercase">Authorized Signatory</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-3 justify-center">
          <button onClick={handlePrint} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all">
            <Printer size={16} /> Print
          </button>
          <button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all">
            <Download size={16} /> PDF
          </button>
          <button onClick={shareOnWhatsApp} className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-600 transition-all">
            <MessageCircle size={16} /> WhatsApp
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const TeacherPanel = ({ syllabuses, setSyllabuses, leaveRequests, setLeaveRequests, notifications, currentUser, teacherAssignments, activities, setActivities, masterData }: any) => {
  const assignedClasses = teacherAssignments.filter((a: any) => 
    a.classTeacher === currentUser.name || a.subjectTeachers.some((st: any) => st.teacher === currentUser.name)
  );
  
  const filteredSyllabuses = syllabuses.filter((s: Syllabus) => 
    assignedClasses.some(ac => ac.class === s.class)
  );

  const filteredLeaveRequests = leaveRequests.filter((l: LeaveRequest) => 
    assignedClasses.some(ac => ac.class === l.class && ac.section === l.section)
  );

  const filteredActivities = activities.filter((a: Activity) => 
    a.teacherName === currentUser.name || assignedClasses.some(ac => ac.class === a.class && ac.section === a.section)
  );

  const [activeTab, setActiveTab] = useState<'syllabus' | 'attendance' | 'leaves' | 'activities' | 'notifications' | 'progress' | 'fees' | 'hostel' | 'tools'>('syllabus');
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [attendanceForm, setAttendanceForm] = useState({
    class: '',
    section: '',
    date: new Date().toISOString().split('T')[0],
    period: 'Morning' as 'Morning' | 'Last Period'
  });
  const [selectedAttendanceStudents, setSelectedAttendanceStudents] = useState<string[]>([]);
  const [activityForm, setActivityForm] = useState({
    class: '',
    section: '',
    subject: '',
    title: '',
    description: ''
  });

  const handleAddActivity = () => {
    if (!activityForm.class || !activityForm.title) return;
    const newActivity: Activity = {
      id: Date.now().toString(),
      ...activityForm,
      date: new Date().toLocaleDateString(),
      teacherName: currentUser.name
    };
    setActivities([...activities, newActivity]);
    setShowActivityModal(false);
    setActivityForm({ class: '', section: '', subject: '', title: '', description: '' });
  };

  const handleUpdateSyllabusStatus = (id: string, status: Syllabus['status']) => {
    setSyllabuses(syllabuses.map((s: Syllabus) => s.id === id ? { ...s, status } : s));
  };

  const handleLeaveAction = (id: string, status: 'Approved' | 'Rejected') => {
    setLeaveRequests(leaveRequests.map((l: LeaveRequest) => 
      l.id === id ? { ...l, status, approvedBy: currentUser.name } : l
    ));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-heading tracking-tight">Teacher Dashboard</h1>
          <p className="text-text-sub font-medium">Manage your assigned classes: {assignedClasses.map(ac => `${ac.class}-${ac.section}`).join(', ')}</p>
        </div>
        {activeTab === 'activities' && (
          <button 
            onClick={() => setShowActivityModal(true)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            <Plus size={20} /> Upload Activity
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200">
        {[
          { id: 'syllabus', label: 'Syllabus', icon: BookOpen, permission: 'Syllabus' },
          { id: 'attendance', label: 'Attendance', icon: UserCheck, permission: 'QR Attendance' },
          { id: 'leaves', label: 'Leaves', icon: CalendarRange, permission: 'Leave Application' },
          { id: 'activities', label: 'Homework', icon: ClipboardList, permission: 'Home Work Assign' },
          { id: 'progress', label: 'Progress', icon: GraduationCap, permission: 'Progress Report' },
          { id: 'fees', label: 'Fees', icon: Wallet, permission: 'Fee Structure' },
          { id: 'hostel', label: 'Hostel', icon: Bed, permission: 'Hostel' },
          { id: 'tools', label: 'Tools', icon: Settings, permission: 'all' },
          { id: 'notifications', label: 'Notifications', icon: Bell, permission: 'all' },
        ].filter(tab => currentUser.permissions.includes('all') || currentUser.permissions.includes(tab.permission) || tab.permission === 'all').map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-primary'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'syllabus' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Subject</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Class</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Topic</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Status</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSyllabuses.map((s: Syllabus) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 text-sm font-bold">{s.subject}</td>
                    <td className="py-4 text-sm font-medium text-text-sub">{s.class}</td>
                    <td className="py-4">
                      <p className="text-sm font-bold">{s.title}</p>
                      <p className="text-[10px] text-text-sub">{s.description}</p>
                    </td>
                    <td className="py-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                        s.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                        s.status === 'Started' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <select 
                        value={s.status}
                        onChange={(e) => handleUpdateSyllabusStatus(s.id, e.target.value as any)}
                        className="text-xs font-bold bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="Started">Started</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'attendance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 h-fit">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
              <UserCheck size={20} /> Mark Attendance
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Select 
                  label="Class" 
                  options={assignedClasses.map(ac => ac.class)} 
                  value={attendanceForm.class} 
                  onChange={(e: any) => setAttendanceForm({...attendanceForm, class: e.target.value})} 
                />
                <Select 
                  label="Section" 
                  options={assignedClasses.filter(ac => ac.class === attendanceForm.class).map(ac => ac.section)} 
                  value={attendanceForm.section} 
                  onChange={(e: any) => setAttendanceForm({...attendanceForm, section: e.target.value})} 
                />
              </div>
              <Input 
                label="Date" 
                type="date" 
                value={attendanceForm.date} 
                onChange={(e: any) => setAttendanceForm({...attendanceForm, date: e.target.value})} 
              />
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Period</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Morning', 'Last Period'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setAttendanceForm({...attendanceForm, period: p as any})}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                        attendanceForm.period === p 
                          ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                          : 'bg-slate-50 text-text-secondary border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <button 
                  onClick={() => {
                    if (!attendanceForm.class || selectedAttendanceStudents.length === 0) return;
                    // Mock marking attendance
                    alert(`Marked ${attendanceForm.period} attendance for ${selectedAttendanceStudents.length} students`);
                    setSelectedAttendanceStudents([]);
                  }} 
                  disabled={selectedAttendanceStudents.length === 0}
                  className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 size={20} />
                  Mark {attendanceForm.period} ({selectedAttendanceStudents.length})
                </button>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
                <Users size={20} /> Student List
              </h3>
              <button 
                onClick={() => {
                  const classStudents = masterData.students.filter((s: any) => s.class === attendanceForm.class && s.section === attendanceForm.section);
                  if (selectedAttendanceStudents.length === classStudents.length) {
                    setSelectedAttendanceStudents([]);
                  } else {
                    setSelectedAttendanceStudents(classStudents.map((s: any) => s.studentId));
                  }
                }}
                className="text-xs font-bold text-primary hover:underline"
              >
                {attendanceForm.class ? 'Select All' : ''}
              </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-100">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-4 w-12"></th>
                    <th className="p-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Student</th>
                    <th className="p-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {masterData.students
                    .filter((s: any) => s.class === attendanceForm.class && s.section === attendanceForm.section)
                    .map((s: any) => (
                      <tr 
                        key={s.studentId} 
                        className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedAttendanceStudents.includes(s.studentId) ? 'bg-primary/5' : ''}`}
                        onClick={() => {
                          if (selectedAttendanceStudents.includes(s.studentId)) {
                            setSelectedAttendanceStudents(selectedAttendanceStudents.filter(id => id !== s.studentId));
                          } else {
                            setSelectedAttendanceStudents([...selectedAttendanceStudents, s.studentId]);
                          }
                        }}
                      >
                        <td className="p-4">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                            checked={selectedAttendanceStudents.includes(s.studentId)}
                            readOnly
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-primary font-bold text-xs overflow-hidden border border-slate-200">
                              {s.photo ? (
                                <img src={s.photo} alt={s.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <span>{s.name[0]}{s.surname[0]}</span>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-text-heading">{s.name} {s.surname}</p>
                              <p className="text-[10px] text-text-sub uppercase">{s.studentId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Not Marked</span>
                        </td>
                      </tr>
                    ))}
                  {(!attendanceForm.class || masterData.students.filter((s: any) => s.class === attendanceForm.class && s.section === attendanceForm.section).length === 0) && (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-text-sub italic">
                        {attendanceForm.class ? 'No students found for this class/section.' : 'Please select a class and section.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'leaves' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Student</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Type</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Duration/Time</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Reason</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Status</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeaveRequests.map((l: LeaveRequest) => (
                  <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4">
                      <p className="text-sm font-bold">{l.studentName}</p>
                      <p className="text-[10px] text-text-sub uppercase">{l.studentId} | {l.class}-{l.section}</p>
                    </td>
                    <td className="py-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                        l.type === 'Early Leave' ? 'bg-purple-100 text-purple-700' :
                        l.type === 'Parent Pickup' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {l.type || 'Leave'}
                      </span>
                    </td>
                    <td className="py-4">
                      <p className="text-sm font-bold">{l.type === 'Leave' ? `${l.duration} Days` : l.pickupTime}</p>
                      <p className="text-[10px] text-text-sub">{l.startDate} {l.type === 'Leave' ? `to ${l.endDate}` : ''}</p>
                    </td>
                    <td className="py-4 text-sm text-text-sub max-w-xs truncate">{l.reason}</td>
                    <td className="py-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                        l.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                        l.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="py-4 text-right space-x-2">
                      {l.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleLeaveAction(l.id, 'Approved')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                            title="Approve"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleLeaveAction(l.id, 'Rejected')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Reject"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'activities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((a: Activity) => (
            <Card key={a.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black px-2 py-1 bg-primary/10 text-primary rounded-full uppercase">
                  {a.class}-{a.section} | {a.subject}
                </span>
                <span className="text-[10px] font-bold text-text-sub uppercase">{a.date}</span>
              </div>
              <h3 className="text-lg font-bold text-text-heading mb-2">{a.title}</h3>
              <p className="text-sm text-text-sub mb-4 line-clamp-3">{a.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-text-secondary">By {a.teacherName}</span>
                <button className="text-primary hover:underline text-xs font-bold">View Details</button>
              </div>
            </Card>
          ))}
          {filteredActivities.length === 0 && (
            <div className="col-span-full text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <ClipboardList className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-text-sub font-medium">No activities uploaded yet for your assigned classes.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'progress' && (
        <Card>
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
            <GraduationCap size={20} /> Enter Progress Report
          </h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select label="Class" options={assignedClasses.map(ac => ac.class)} />
              <Select label="Section" options={assignedClasses.map(ac => ac.section)} />
              <Select label="Subject" options={masterData.subjects} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Student</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Marks</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {masterData.students.slice(0, 5).map((s: any) => (
                    <tr key={s.studentId}>
                      <td className="py-4 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-primary font-bold text-xs overflow-hidden border border-slate-200">
                          {s.photo ? (
                            <img src={s.photo} alt={s.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <span>{s.name[0]}</span>
                          )}
                        </div>
                        <span className="text-sm font-bold">{s.name} {s.surname}</span>
                      </td>
                      <td className="py-4"><input type="number" className="w-20 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm" placeholder="Marks" /></td>
                      <td className="py-4"><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm" placeholder="Remarks" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="btn-primary w-full py-4">Save Progress Report</button>
          </div>
        </Card>
      )}

      {activeTab === 'fees' && (
        <Card>
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
            <Wallet size={20} /> Fee Structure & Collection
          </h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="font-bold mb-4">Payment QR Code</h4>
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-white p-4 rounded-2xl border-2 border-primary/20 mb-4">
                    <QrCode size={160} className="text-primary" />
                  </div>
                  <p className="text-xs text-text-sub font-medium">Scan to pay school fees</p>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold">Recent Fee Alerts</h4>
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-4 bg-white rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold">Student {i}</p>
                      <p className="text-[10px] text-text-sub uppercase">Pending: ₹2,500</p>
                    </div>
                    <button className="text-primary text-xs font-bold hover:underline">Notify Parent</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'hostel' && (
        <Card>
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
            <Bed size={20} /> Hostel Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 text-center">
              <p className="text-xs font-bold text-blue-600 uppercase mb-1">Total Beds</p>
              <p className="text-3xl font-black text-blue-700">120</p>
            </div>
            <div className="p-6 bg-green-50 rounded-2xl border border-green-100 text-center">
              <p className="text-xs font-bold text-green-600 uppercase mb-1">Occupied</p>
              <p className="text-3xl font-black text-green-700">98</p>
            </div>
            <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 text-center">
              <p className="text-xs font-bold text-orange-600 uppercase mb-1">Available</p>
              <p className="text-3xl font-black text-orange-700">22</p>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'tools' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Admission', icon: UserPlus, desc: 'Register student' },
            { label: 'QR Attendance', icon: QrCode, desc: 'Scan for attendance' },
            { label: 'WhatsApp', icon: MessageCircle, desc: 'Bulk notifications' },
            { label: 'ID Cards', icon: UserPlus, desc: 'Generate ID Card' },
            { label: 'Certificates', icon: FileText, desc: 'TC/Appreciation' },
            { label: 'Birthday', icon: Sparkles, desc: 'Wishes list' },
            { label: 'Cash Mgmt', icon: Coins, desc: 'Daily accounts' },
            { label: 'Settings', icon: Settings, desc: 'Panel settings' },
          ].map((tool, i) => (
            <Card key={i} className="p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 cursor-pointer transition-all group">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <tool.icon size={24} />
              </div>
              <h4 className="font-bold text-sm">{tool.label}</h4>
              <p className="text-[10px] text-text-sub mt-1">{tool.desc}</p>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="space-y-4">
          {notifications.filter((n: Notification) => n.targetRoles.includes('teacher')).map((n: Notification) => (
            <Card key={n.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  n.type === 'Info' ? 'bg-blue-100 text-blue-600' :
                  n.type === 'Warning' ? 'bg-orange-100 text-orange-600' :
                  n.type === 'Success' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                }`}>
                  <Bell size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-text-heading">{n.title}</h3>
                    <span className="text-[10px] font-bold text-text-sub uppercase">{n.date}</span>
                  </div>
                  <p className="text-sm text-text-sub">{n.message}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Activity Upload Modal */}
      <AnimatePresence>
        {showActivityModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowActivityModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[24px] p-8 shadow-2xl relative z-10 w-full max-w-lg"
            >
              <h3 className="text-2xl font-black text-text-heading mb-6">Upload Class Activity</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Select 
                    label="Class" 
                    options={assignedClasses.map(ac => ac.class)} 
                    value={activityForm.class} 
                    onChange={(e: any) => setActivityForm({...activityForm, class: e.target.value})} 
                  />
                  <Select 
                    label="Section" 
                    options={assignedClasses.filter(ac => ac.class === activityForm.class).map(ac => ac.section)} 
                    value={activityForm.section} 
                    onChange={(e: any) => setActivityForm({...activityForm, section: e.target.value})} 
                  />
                </div>
                <Select 
                  label="Subject" 
                  options={assignedClasses.filter(ac => ac.class === activityForm.class && ac.section === activityForm.section).map(ac => ac.subject)} 
                  value={activityForm.subject} 
                  onChange={(e: any) => setActivityForm({...activityForm, subject: e.target.value})} 
                />
                <Input 
                  label="Activity Title" 
                  placeholder="e.g., Science Project, Math Quiz" 
                  value={activityForm.title} 
                  onChange={(e: any) => setActivityForm({...activityForm, title: e.target.value})} 
                />
                <div className="space-y-1">
                  <label className="label-text">Description</label>
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none min-h-[100px]"
                    placeholder="Describe the activity details..."
                    value={activityForm.description}
                    onChange={(e) => setActivityForm({...activityForm, description: e.target.value})}
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    onClick={() => setShowActivityModal(false)}
                    className="flex-1 py-4 rounded-xl font-bold text-text-secondary hover:bg-slate-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddActivity}
                    className="flex-1 py-4 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                  >
                    Upload Activity
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ParentPanel = ({ students, examResults, homeworks, syllabuses, leaveRequests, setLeaveRequests, notifications, feeTransactions, feeMaster, currentUser }: any) => {
  const [activeTab, setActiveTab] = useState<'progress' | 'homework' | 'syllabus' | 'leave' | 'fees' | 'notifications' | 'documents' | 'profile'>('progress');
  const [leaveForm, setLeaveForm] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    type: 'Leave' as 'Leave' | 'Early Leave' | 'Parent Pickup',
    pickupTime: ''
  });

  const myStudent = students.find((s: any) => s.studentId === currentUser.studentId) || students[0]; // Mocking for now

  const handleApplyLeave = () => {
    if (!leaveForm.startDate || !leaveForm.reason) return;
    if (leaveForm.type === 'Leave' && !leaveForm.endDate) return;
    if ((leaveForm.type === 'Early Leave' || leaveForm.type === 'Parent Pickup') && !leaveForm.pickupTime) return;
    
    const start = new Date(leaveForm.startDate);
    const end = leaveForm.type === 'Leave' ? new Date(leaveForm.endDate) : start;
    const duration = leaveForm.type === 'Leave' 
      ? Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
      : 0.5;

    const newRequest: LeaveRequest = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: myStudent.studentId,
      studentName: `${myStudent.name} ${myStudent.surname}`,
      class: myStudent.class,
      section: myStudent.section,
      startDate: leaveForm.startDate,
      endDate: leaveForm.type === 'Leave' ? leaveForm.endDate : leaveForm.startDate,
      duration,
      reason: leaveForm.reason,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0],
      type: leaveForm.type,
      pickupTime: leaveForm.pickupTime
    };

    setLeaveRequests([...leaveRequests, newRequest]);
    setLeaveForm({ startDate: '', endDate: '', reason: '', type: 'Leave', pickupTime: '' });
    alert(`${leaveForm.type} application submitted successfully!`);
  };

  const getDueFees = () => {
    const classFee = feeMaster.find((f: any) => f.class === myStudent.class);
    if (!classFee) return 0;
    const paid = feeTransactions
      .filter((t: any) => t.studentId === myStudent.studentId)
      .reduce((sum: number, t: any) => sum + t.totalPaid, 0);
    const total = classFee.frequency === 'Monthly' ? classFee.amount * 12 : classFee.amount;
    return Math.max(0, total - paid);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-heading tracking-tight">Parent Portal</h1>
          <p className="text-text-sub font-medium">Tracking progress for {myStudent.name} {myStudent.surname}</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary overflow-hidden">
            {myStudent.photo ? (
              <img src={myStudent.photo} alt={myStudent.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              myStudent.name[0]
            )}
          </div>
          <div className="pr-4">
            <p className="text-sm font-bold">{myStudent.name}</p>
            <p className="text-[10px] text-text-sub uppercase font-bold tracking-widest">Class {myStudent.class}-{myStudent.section}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200">
        {[
          { id: 'progress', label: 'Progress', icon: GraduationCap, permission: 'Progress Report' },
          { id: 'profile', label: 'Profile', icon: UserCircle, permission: 'all' },
          { id: 'homework', label: 'Homework', icon: BookOpen, permission: 'Home Work Assign' },
          { id: 'syllabus', label: 'Syllabus', icon: ClipboardList, permission: 'Syllabus' },
          { id: 'leave', label: 'Leave', icon: CalendarRange, permission: 'Leave Application' },
          { id: 'fees', label: 'Fees', icon: Wallet, permission: 'Fee Structure' },
          { id: 'documents', label: 'Documents', icon: FileText, permission: 'Transfer Certificate' },
          { id: 'notifications', label: 'Notifications', icon: Bell, permission: 'all' },
        ].filter(tab => currentUser.permissions.includes('all') || currentUser.permissions.includes(tab.permission) || tab.permission === 'all').map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-primary'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-32 h-32 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-primary overflow-hidden mb-6">
                {myStudent.photo ? (
                  <img src={myStudent.photo} alt={myStudent.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-4xl">{myStudent.name[0]}</span>
                )}
              </div>
              <h2 className="text-2xl font-black text-text-heading">{myStudent.name} {myStudent.surname}</h2>
              <p className="text-sm font-bold text-primary uppercase tracking-widest mt-1">ID: {myStudent.studentId}</p>
              <div className="mt-6 w-full space-y-3">
                <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold text-text-sub uppercase">Class</span>
                  <span className="text-sm font-bold">{myStudent.class}</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold text-text-sub uppercase">Section</span>
                  <span className="text-sm font-bold">{myStudent.section}</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold text-text-sub uppercase">Gender</span>
                  <span className="text-sm font-bold">{myStudent.gender}</span>
                </div>
              </div>
            </div>
          </Card>
          <Card className="lg:col-span-2">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
              <Users size={20} /> Family Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-text-sub uppercase tracking-wider mb-1">Father's Name</p>
                <p className="font-bold">{myStudent.fatherName}</p>
                <p className="text-xs text-text-sub mt-2 flex items-center gap-1">
                  <Phone size={12} /> {myStudent.fatherMobile}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-text-sub uppercase tracking-wider mb-1">Mother's Name</p>
                <p className="font-bold">{myStudent.motherName}</p>
                <p className="text-xs text-text-sub mt-2 flex items-center gap-1">
                  <Phone size={12} /> {myStudent.motherMobile}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-text-sub uppercase tracking-wider mb-1">Address</p>
                <p className="font-bold">{myStudent.address}</p>
                <p className="text-xs text-text-sub mt-2 flex items-center gap-1">
                  <MapPin size={12} /> {myStudent.religion} / {myStudent.caste}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-text-sub uppercase tracking-wider mb-1">Emergency Contact</p>
                <p className="font-bold">{myStudent.emergencyContact}</p>
                <p className="text-xs text-text-sub mt-2 flex items-center gap-1">
                  <HeartPulse size={12} /> Blood Group: {myStudent.bloodGroup}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <h3 className="text-lg font-bold mb-6">Recent Exam Results</h3>
            <div className="space-y-4">
              {examResults.filter((r: any) => r.studentId === myStudent.studentId).map((r: any) => (
                <div key={r.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <p className="font-bold">{r.subject}</p>
                    <p className="text-xs text-text-sub">{r.examName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-primary">{r.marks}/{r.totalMarks}</p>
                    <p className="text-[10px] font-bold uppercase text-text-sub">{((r.marks/r.totalMarks)*100).toFixed(1)}%</p>
                  </div>
                </div>
              ))}
              {examResults.filter((r: any) => r.studentId === myStudent.studentId).length === 0 && (
                <p className="text-center py-8 text-text-sub">No exam results available yet.</p>
              )}
            </div>
          </Card>
          <Card>
            <h3 className="text-lg font-bold mb-6">Attendance Overview</h3>
            <div className="text-center space-y-4">
              <div className="w-32 h-32 rounded-full border-8 border-primary border-t-slate-100 flex items-center justify-center mx-auto">
                <span className="text-2xl font-black text-primary">94%</span>
              </div>
              <p className="text-sm font-medium text-text-sub">Overall attendance for this term</p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-3 bg-green-50 rounded-xl">
                  <p className="text-xs font-bold text-green-600 uppercase">Present</p>
                  <p className="text-xl font-black text-green-700">142</p>
                </div>
                <div className="p-3 bg-red-50 rounded-xl">
                  <p className="text-xs font-bold text-red-600 uppercase">Absent</p>
                  <p className="text-xl font-black text-red-700">8</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'homework' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {homeworks.filter((h: any) => h.class === myStudent.class).map((h: any) => (
            <Card key={h.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-black px-2 py-1 bg-primary/10 text-primary rounded-full uppercase mb-2 inline-block">
                    {h.subject}
                  </span>
                  <h3 className="font-bold text-text-heading">{h.title}</h3>
                </div>
                <span className="text-[10px] font-bold text-red-500 uppercase">Due: {h.dueDate}</span>
              </div>
              <p className="text-sm text-text-sub mb-6 line-clamp-2">{h.description}</p>
              <button className="w-full py-2 bg-slate-100 text-text-heading font-bold rounded-xl text-xs hover:bg-slate-200 transition-all">
                View Details
              </button>
            </Card>
          ))}
          {homeworks.filter((h: any) => h.class === myStudent.class).length === 0 && (
            <div className="col-span-2 text-center py-12">
              <p className="text-text-sub">No homework assigned for this class.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'syllabus' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Subject</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Topic</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Status</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {syllabuses.filter((s: any) => s.class === myStudent.class).map((s: any) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 text-sm font-bold">{s.subject}</td>
                    <td className="py-4">
                      <p className="text-sm font-bold">{s.title}</p>
                      <p className="text-[10px] text-text-sub">{s.description}</p>
                    </td>
                    <td className="py-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                        s.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                        s.status === 'Started' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-4 w-48">
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${s.status === 'Completed' ? 'bg-green-500' : s.status === 'Started' ? 'bg-blue-500' : 'bg-slate-300'}`} 
                             style={{ width: s.status === 'Completed' ? '100%' : s.status === 'Started' ? '45%' : '0%' }}></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'leave' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <h3 className="text-lg font-bold mb-6">Apply for Leave / Pickup</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Request Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Leave', 'Early Leave', 'Parent Pickup'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setLeaveForm({...leaveForm, type: type as any})}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                        leaveForm.type === type 
                          ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                          : 'bg-slate-50 text-text-secondary border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label={leaveForm.type === 'Leave' ? "Start Date" : "Date"} 
                  type="date" 
                  value={leaveForm.startDate} 
                  onChange={(e: any) => setLeaveForm({...leaveForm, startDate: e.target.value})} 
                />
                {leaveForm.type === 'Leave' ? (
                  <Input 
                    label="End Date" 
                    type="date" 
                    value={leaveForm.endDate} 
                    onChange={(e: any) => setLeaveForm({...leaveForm, endDate: e.target.value})} 
                  />
                ) : (
                  <Input 
                    label="Pickup Time" 
                    type="time" 
                    value={leaveForm.pickupTime} 
                    onChange={(e: any) => setLeaveForm({...leaveForm, pickupTime: e.target.value})} 
                  />
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Reason</label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none h-32"
                  placeholder="Explain the reason..."
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({...leaveForm, reason: e.target.value})}
                ></textarea>
              </div>
              <button 
                onClick={handleApplyLeave}
                className="w-full btn-primary py-4"
              >
                Submit Request
              </button>
            </div>
          </Card>
          <Card>
            <h3 className="text-lg font-bold mb-6">Request History</h3>
            <div className="space-y-4">
              {leaveRequests.filter((l: any) => l.studentId === myStudent.studentId).map((l: any) => (
                <div key={l.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                          l.type === 'Early Leave' ? 'bg-purple-100 text-purple-700' :
                          l.type === 'Parent Pickup' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {l.type || 'Leave'}
                        </span>
                        <p className="font-bold">{l.type === 'Leave' ? `${l.duration} Days` : l.pickupTime}</p>
                      </div>
                      <p className="text-xs text-text-sub">{l.startDate} {l.type === 'Leave' ? `to ${l.endDate}` : ''}</p>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                      l.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                      l.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {l.status}
                    </span>
                  </div>
                  <p className="text-xs text-text-sub italic line-clamp-1">"{l.reason}"</p>
                </div>
              ))}
              {leaveRequests.filter((l: any) => l.studentId === myStudent.studentId).length === 0 && (
                <div className="text-center py-12 text-text-sub italic">No requests found.</div>
              )}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'fees' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="flex flex-col items-center justify-center p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              <Wallet size={40} />
            </div>
            <div>
              <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Total Due Fees</p>
              <h2 className="text-4xl font-black text-text-heading">₹{getDueFees().toLocaleString()}</h2>
            </div>
            <div className="w-full pt-6 border-t border-slate-100">
              <p className="text-sm font-bold text-text-heading mb-4">Scan QR to Pay via UPI</p>
              <div className="bg-white p-4 rounded-2xl border-2 border-primary/20 inline-block">
                <QrCode size={160} className="text-primary" />
              </div>
              <p className="text-[10px] text-text-sub mt-4 font-medium italic">Supports all UPI apps (GPay, PhonePe, Paytm)</p>
            </div>
          </Card>
          <Card>
            <h3 className="text-lg font-bold mb-6">Transaction History</h3>
            <div className="space-y-4">
              {feeTransactions.filter((t: any) => t.studentId === myStudent.studentId).map((t: any) => (
                <div key={t.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                      <Receipt size={20} />
                    </div>
                    <div>
                      <p className="font-bold">{t.feeType}</p>
                      <p className="text-xs text-text-sub">{t.date} • {t.paymentMode}</p>
                    </div>
                  </div>
                  <p className="font-black text-primary">₹{t.totalPaid}</p>
                </div>
              ))}
              {feeTransactions.filter((t: any) => t.studentId === myStudent.studentId).length === 0 && (
                <p className="text-center py-8 text-text-sub">No transaction history found.</p>
              )}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Transfer Certificate', icon: FileText, desc: 'Request or view TC' },
            { title: 'Appreciation Certificate', icon: Trophy, desc: 'View achievements' },
            { title: 'Birthday Wishes', icon: Sparkles, desc: 'School greetings' },
            { title: 'ID Card', icon: UserPlus, desc: 'Digital ID Card' },
          ].map((doc, i) => (
            <Card key={i} className="p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 cursor-pointer transition-all group">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <doc.icon size={24} />
              </div>
              <h4 className="font-bold text-sm">{doc.title}</h4>
              <p className="text-[10px] text-text-sub mt-1">{doc.desc}</p>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="space-y-4">
          {notifications.filter((n: Notification) => n.targetRoles.includes('parent') && (!n.targetStudentId || n.targetStudentId === myStudent.studentId)).map((n: Notification) => (
            <Card key={n.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  n.type === 'Info' ? 'bg-blue-100 text-blue-600' :
                  n.type === 'Warning' ? 'bg-orange-100 text-orange-600' :
                  n.type === 'Success' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                }`}>
                  <Bell size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-text-heading">{n.title}</h3>
                    <span className="text-[10px] font-bold text-text-sub uppercase">{n.date}</span>
                  </div>
                  <p className="text-sm text-text-sub">{n.message}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main App ---

const LiveCamera = ({ cameraUrls }: { cameraUrls: { id: string, name: string, url: string }[] }) => {
  const [activeCamera, setActiveCamera] = useState(0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-heading tracking-tight">Live Campus Monitoring</h1>
          <p className="text-text-sub font-medium">Real-time surveillance of school campus and classrooms.</p>
        </div>
        <div className="flex gap-3">
          <span className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-xl font-bold text-xs animate-pulse">
            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            LIVE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Card className="p-0 overflow-hidden bg-black aspect-video relative group">
            <div className="absolute inset-0 flex items-center justify-center">
              <Video size={64} className="text-white/20" />
              <p className="absolute bottom-10 text-white/40 font-bold uppercase tracking-widest text-xs">
                Connecting to Camera {activeCamera + 1}...
              </p>
            </div>
            {/* Mock Video Stream */}
            <img 
              src={cameraUrls[activeCamera]?.url || `https://picsum.photos/seed/camera${activeCamera}/1280/720`} 
              alt="Live Stream" 
              className="w-full h-full object-cover opacity-60"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white text-xs font-bold uppercase tracking-widest">CAM-0{activeCamera + 1} - {cameraUrls[activeCamera]?.name || 'Campus'}</span>
            </div>
            <div className="absolute bottom-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
              <button className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 border border-white/10">
                <ScanLine size={20} />
              </button>
              <button className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 border border-white/10">
                <Camera size={20} />
              </button>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-text-heading px-2">Available Feeds</h3>
          {cameraUrls.map((cam, i) => (
            <button 
              key={cam.id}
              onClick={() => setActiveCamera(i)}
              className={`w-full p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                activeCamera === i 
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-white border-slate-100 text-text-heading hover:bg-slate-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeCamera === i ? 'bg-white/20' : 'bg-slate-100'}`}>
                <Video size={18} />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">{cam.name}</p>
                <p className={`text-[10px] uppercase font-bold tracking-widest ${activeCamera === i ? 'text-white/60' : 'text-text-secondary'}`}>Online</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const DueFeesModule = ({ students, feeMaster, feeTransactions, currentUser, getStudentDueFees }: any) => {
  const isAdmin = currentUser?.role === 'admin';
  
  const dueStudents = students.map((s: any) => ({
    ...s,
    dueAmount: getStudentDueFees(s)
  })).filter((s: any) => s.dueAmount > 0);

  if (!isAdmin) {
    const myDue = getStudentDueFees(currentUser);
    return (
      <div className="space-y-8 max-w-4xl mx-auto pb-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-text-heading tracking-tight">My Due Fees</h1>
            <p className="text-text-sub font-medium">View and manage your pending fee payments.</p>
          </div>
        </div>

        <Card className="p-12 text-center space-y-6">
          <div className="w-24 h-24 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto">
            <Wallet size={48} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-text-heading">₹{myDue.toLocaleString()}</h2>
            <p className="text-text-sub font-bold uppercase tracking-widest text-xs mt-2">Total Pending Amount</p>
          </div>
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <button className="btn-primary py-4">Pay Now</button>
            <button className="text-primary font-bold text-sm hover:underline">View Payment History</button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-text-heading mb-6">Fee Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="font-bold">Tuition Fee</p>
                <p className="text-xs text-text-sub">Academic Year 2024-25</p>
              </div>
              <p className="font-black text-primary">₹{myDue.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-heading tracking-tight">Due Fees Management</h1>
          <p className="text-text-sub font-medium">Monitor and manage pending fees across all classes.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
            <Bell size={20} /> Send Reminders
          </button>
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all">
            <FileSpreadsheet size={20} /> Export List
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-red-50 border-red-100">
          <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">Total Due Amount</p>
          <p className="text-3xl font-black text-red-700">₹{dueStudents.reduce((sum: number, s: any) => sum + s.dueAmount, 0).toLocaleString()}</p>
        </Card>
        <Card className="p-6 bg-orange-50 border-orange-100">
          <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">Students with Dues</p>
          <p className="text-3xl font-black text-orange-700">{dueStudents.length}</p>
        </Card>
        <Card className="p-6 bg-emerald-50 border-emerald-100">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Collection Rate</p>
          <p className="text-3xl font-black text-emerald-700">84%</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-text-heading">Pending Fee List</h3>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Search student..." className="input-field pl-10 py-2 text-sm w-64" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-text-secondary uppercase tracking-wider border-b border-slate-200">
                <th className="pb-4 px-4">Student</th>
                <th className="pb-4 px-4">Class/Sec</th>
                <th className="pb-4 px-4">Due Amount</th>
                <th className="pb-4 px-4">Last Payment</th>
                <th className="pb-4 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {dueStudents.map((s: any) => (
                <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition-all">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-primary">
                        {s.name[0]}
                      </div>
                      <div>
                        <p className="font-bold">{s.name} {s.surname}</p>
                        <p className="text-[10px] text-text-secondary">{s.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium">{s.class} - {s.section}</td>
                  <td className="py-4 px-4 font-black text-red-600">₹{s.dueAmount.toLocaleString()}</td>
                  <td className="py-4 px-4 text-text-sub">
                    {feeTransactions.find((t: any) => t.studentId === s.studentId)?.date || 'No payments'}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="text-primary font-bold text-xs hover:underline">Send Reminder</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const Admin360View = ({ students, masterData, feeTransactions, attendance }: any) => {
  const revenueData = [
    { month: 'Jan', amount: 450000 },
    { month: 'Feb', amount: 520000 },
    { month: 'Mar', amount: 480000 },
    { month: 'Apr', amount: 610000 },
    { month: 'May', amount: 550000 },
    { month: 'Jun', amount: 670000 },
  ];

  const attendanceData = [
    { day: 'Mon', rate: 92 },
    { day: 'Tue', rate: 94 },
    { day: 'Wed', rate: 89 },
    { day: 'Thu', rate: 95 },
    { day: 'Fri', rate: 91 },
    { day: 'Sat', rate: 85 },
  ];

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-heading tracking-tight">Admin 360° View</h1>
          <p className="text-text-sub font-medium">Comprehensive overview of school operations and performance.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all">
            <Printer size={20} /> Print Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-lg">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Total Students</p>
              <p className="text-2xl font-black text-text-heading">{students.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg">
              <UserCog size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Total Staff</p>
              <p className="text-2xl font-black text-text-heading">{masterData.teachers.length + 12}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 text-white rounded-xl flex items-center justify-center shadow-lg">
              <Receipt size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Fees Collected</p>
              <p className="text-2xl font-black text-text-heading">₹{feeTransactions.reduce((sum: number, t: any) => sum + t.totalPaid, 0).toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500 text-white rounded-xl flex items-center justify-center shadow-lg">
              <UserCheck size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Avg Attendance</p>
              <p className="text-2xl font-black text-text-heading">92%</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="font-bold text-text-heading mb-6 flex items-center gap-2">
            <BarChart3 size={18} className="text-primary" />
            Fee Collection Trend
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#4F46E5', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-text-heading mb-6 flex items-center gap-2">
            <UserCheck size={18} className="text-primary" />
            Weekly Attendance Rate (%)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} domain={[0, 100]} />
                <Tooltip 
                  cursor={{ fill: '#F1F5F9' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="rate" fill="#10B981" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="font-bold text-text-heading mb-6 flex items-center gap-2">
            <BarChart3 size={18} className="text-primary" />
            Class-wise Performance
          </h3>
          <div className="space-y-4">
            {masterData.classes.slice(0, 6).map((c: string) => (
              <div key={c} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold">{c}</span>
                  <span className="text-text-secondary">88% Avg Score</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '88%' }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-text-heading mb-6 flex items-center gap-2">
            <Clock size={18} className="text-primary" />
            Recent Activities
          </h3>
          <div className="space-y-4">
            {[
              { text: 'New student registered in Class 5', time: '2 mins ago', icon: UserPlus, color: 'text-blue-500' },
              { text: 'Fee payment received from DS-102938', time: '15 mins ago', icon: Receipt, color: 'text-emerald-500' },
              { text: 'Attendance marked for Class 10-A', time: '1 hour ago', icon: UserCheck, color: 'text-orange-500' },
              { text: 'New exam schedule published', time: '3 hours ago', icon: ClipboardList, color: 'text-purple-500' }
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-xl transition-all">
                <div className={`w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center ${activity.color}`}>
                  <activity.icon size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-heading">{activity.text}</p>
                  <p className="text-[10px] text-text-secondary uppercase font-bold">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const Class360View = ({ students, masterData, attendance, feeTransactions }: any) => {
  const [selectedClass, setSelectedClass] = useState(masterData.classes[0]);
  const [selectedSection, setSelectedSection] = useState(masterData.sections[0]);

  const classStudents = students.filter((s: any) => s.class === selectedClass && s.section === selectedSection);
  
  const performanceData = [
    { subject: 'Math', avg: 82, top: 98 },
    { subject: 'Science', avg: 78, top: 95 },
    { subject: 'English', avg: 85, top: 97 },
    { subject: 'History', avg: 72, top: 90 },
    { subject: 'Geography', avg: 75, top: 92 },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-heading tracking-tight">Class 360° View</h1>
          <p className="text-text-sub font-medium">Deep dive into specific class performance and metrics.</p>
        </div>
        <div className="flex gap-4">
          <div className="w-48">
            <label className="label-text">Select Class</label>
            <select className="input-field" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
              {masterData.classes.map((c: string) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="w-32">
            <label className="label-text">Section</label>
            <select className="input-field" value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
              {masterData.sections.map((s: string) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Total Students</p>
          <p className="text-3xl font-black text-text-heading">{classStudents.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Class Teacher</p>
          <p className="text-xl font-black text-primary">{masterData.teachers[Math.floor(Math.random() * masterData.teachers.length)]}</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Attendance</p>
          <p className="text-3xl font-black text-emerald-600">94%</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Fee Clearance</p>
          <p className="text-3xl font-black text-orange-600">78%</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-bold text-text-heading mb-6">Subject Performance Analysis</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} domain={[0, 100]} />
                <Tooltip 
                  cursor={{ fill: '#F1F5F9' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="avg" name="Average Score" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="top" name="Top Score" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-text-heading mb-6">Top Performers</h3>
          <div className="space-y-6">
            {classStudents.slice(0, 3).map((s: any, i: number) => (
              <div key={s.id} className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-xl font-black">
                    {s.name[0]}
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white">
                    {i + 1}
                  </div>
                </div>
                <div>
                  <p className="font-bold text-sm">{s.name} {s.surname}</p>
                  <p className="text-[10px] text-text-secondary uppercase font-bold">Score: {98 - i * 2}%</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-slate-100">
            <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-4">Subject Averages</h4>
            <div className="space-y-3">
              {['Math', 'Science', 'English'].map(sub => (
                <div key={sub} className="flex justify-between items-center text-xs">
                  <span className="font-medium">{sub}</span>
                  <span className="font-bold text-primary">82%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-bold text-text-heading mb-6">Student Roster</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-text-secondary uppercase tracking-wider border-b border-slate-200">
                <th className="pb-4 px-4">Student</th>
                <th className="pb-4 px-4">Roll No</th>
                <th className="pb-4 px-4">Attendance</th>
                <th className="pb-4 px-4">Performance</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {classStudents.map((s: any, i: number) => (
                <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition-all">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-primary">
                        {s.name[0]}
                      </div>
                      <div>
                        <p className="font-bold">{s.name} {s.surname}</p>
                        <p className="text-[10px] text-text-secondary">{s.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium">{i + 1}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-600 rounded text-[10px] font-bold">96%</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '85%' }}></div>
                      </div>
                      <span className="text-[10px] font-bold">A</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const CalendarView = ({ calendarEvents, setCalendarEvents, currentUser }: any) => {
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventForm, setEventForm] = useState<Partial<CalendarEvent>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    type: 'event',
    icon: '',
    color: 'bg-blue-50 text-blue-700 border-blue-200'
  });

  // Academic year starts in April
  const academicMonths = [3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2]; // April (3) to March (2)
  const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];

  const currentYear = new Date().getFullYear();
  const startYear = new Date().getMonth() < 3 ? currentYear - 1 : currentYear;
  const endYear = startYear + 1;

  const handleAddEvent = () => {
    if (!eventForm.title || !eventForm.date) return;
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: eventForm.title!,
      date: eventForm.date!,
      type: eventForm.type as any,
      icon: eventForm.icon,
      color: eventForm.color || 'bg-blue-50 text-blue-700 border-blue-200'
    };
    setCalendarEvents([...calendarEvents, newEvent]);
    setShowEventModal(false);
    setEventForm({ title: '', date: new Date().toISOString().split('T')[0], type: 'event', icon: '', color: 'bg-blue-50 text-blue-700 border-blue-200' });
  };

  const getEventsForDate = (year: number, month: number, day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return calendarEvents.filter((e: CalendarEvent) => e.date === dateStr);
  };

  const isSunday = (year: number, month: number, day: number) => {
    return new Date(year, month, day).getDay() === 0;
  };

  const getDayName = (year: number, month: number, day: number) => {
    const d = new Date(year, month, day);
    if (d.getMonth() !== month) return null;
    return d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  };

  const festivalIcons = [
    { name: 'Holi', icon: '🎨' },
    { name: 'Eid', icon: '🌙' },
    { name: 'Christmas', icon: '🎅' },
    { name: 'Navratri', icon: '🕉️' },
    { name: 'Ram Navmi', icon: '🏹' },
    { name: 'Sikh Festival', icon: '☬' },
  ];

  return (
    <div className="space-y-6 max-w-[95vw] mx-auto pb-20">
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Academic Planner {startYear}-{String(endYear).slice(-2)}</h1>
          <p className="text-slate-500 font-bold text-sm">Annual Academic Calendar & Holiday List</p>
        </div>
        <div className="flex gap-3">
          {(currentUser?.role === 'admin' || currentUser?.role === 'teacher') && (
            <button 
              onClick={() => setShowEventModal(true)}
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all active:scale-95"
            >
              <Plus size={20} /> Add Event
            </button>
          )}
          <button className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all">
            <Calendar size={20} /> Sync Google Calendar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-fixed min-w-[1200px]">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="w-16 p-4 border-r border-slate-700 font-black text-xl italic">D/M</th>
                {academicMonths.map(m => (
                  <th key={m} className="p-4 border-r border-slate-700 font-black text-sm tracking-widest uppercase">
                    {monthNames[m]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 31 }).map((_, dayIdx) => {
                const day = dayIdx + 1;
                return (
                  <tr key={day} className="border-b border-slate-100 group">
                    <td className="p-4 bg-slate-50 border-r border-slate-200 text-center font-black text-xl text-slate-400 italic group-hover:text-primary transition-colors">
                      {day}
                    </td>
                    {academicMonths.map(m => {
                      const year = m < 3 ? endYear : startYear;
                      const date = new Date(year, m, day);
                      const isValidDate = date.getMonth() === m && date.getDate() === day;
                      const sunday = isValidDate && isSunday(year, m, day);
                      const dayName = isValidDate ? getDayName(year, m, day) : null;
                      const events = isValidDate ? getEventsForDate(year, m, day) : [];

                      return (
                        <td 
                          key={m} 
                          className={`p-2 border-r border-slate-100 h-24 relative transition-all hover:bg-slate-50/50 ${!isValidDate ? 'bg-slate-50/30' : ''}`}
                        >
                          {isValidDate && (
                            <>
                              <div className="flex justify-between items-start mb-1">
                                <span className={`text-[9px] font-black tracking-tighter ${sunday ? 'text-red-500' : 'text-slate-400'}`}>
                                  {dayName}
                                </span>
                                {sunday && (
                                  <span className="text-[8px] font-black text-red-500/20 rotate-45 absolute top-4 right-2 pointer-events-none uppercase">
                                    Sunday
                                  </span>
                                )}
                              </div>
                              <div className="space-y-1">
                                {events.map(event => (
                                  <div 
                                    key={event.id} 
                                    className={`text-[9px] font-bold p-1.5 rounded-lg border flex flex-col items-center justify-center text-center shadow-sm leading-tight ${event.color}`}
                                  >
                                    {event.icon && <span className="text-lg mb-0.5">{event.icon}</span>}
                                    <span className="uppercase tracking-tighter">{event.title}</span>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showEventModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-slate-100"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Add New Event</h3>
              <button onClick={() => setShowEventModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                <X size={24} className="text-slate-400" />
              </button>
            </div>
            
            <div className="space-y-5">
              <Input 
                label="Event Title" 
                placeholder="e.g. Annual Sports Day"
                value={eventForm.title} 
                onChange={(e: any) => setEventForm({...eventForm, title: e.target.value})} 
              />
              <Input 
                label="Date" 
                type="date" 
                value={eventForm.date} 
                onChange={(e: any) => setEventForm({...eventForm, date: e.target.value})} 
              />
              <Select 
                label="Event Type" 
                options={['event', 'holiday', 'examination', 'ptm', 'festival']} 
                value={eventForm.type} 
                onChange={(e: any) => {
                  const type = e.target.value;
                  let color = 'bg-blue-50 text-blue-700 border-blue-200';
                  if (type === 'holiday') color = 'bg-red-50 text-red-700 border-red-200';
                  if (type === 'examination') color = 'bg-purple-50 text-purple-700 border-purple-200';
                  if (type === 'ptm') color = 'bg-indigo-50 text-indigo-700 border-indigo-200';
                  if (type === 'festival') color = 'bg-orange-50 text-orange-700 border-orange-200';
                  setEventForm({...eventForm, type, color});
                }} 
              />
              
              {eventForm.type === 'festival' && (
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Festival Icon</label>
                  <div className="grid grid-cols-6 gap-2">
                    {festivalIcons.map(f => (
                      <button 
                        key={f.name}
                        onClick={() => setEventForm({...eventForm, icon: f.icon})}
                        className={`text-2xl p-3 rounded-2xl border-2 transition-all ${eventForm.icon === f.icon ? 'border-primary bg-primary/5 scale-110' : 'border-slate-50 hover:border-slate-200'}`}
                        title={f.name}
                      >
                        {f.icon}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-8">
                <button 
                  onClick={() => setShowEventModal(false)} 
                  className="flex-1 py-4 font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddEvent} 
                  className="flex-1 py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                >
                  Save Event
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const ReportsView = ({ students, feeTransactions, attendance, homeworks, hostelAttendance, masterData, leaveRequests, userLogs }: any) => {
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    class: '',
    section: '',
    date: new Date().toISOString().split('T')[0]
  });

  const reports = [
    { id: 'students', title: 'STUDENTS INFORMATION', icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { id: 'finance', title: 'FINANCE', icon: Receipt, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
    { id: 'attendance', title: 'ATTENDANCE', icon: UserCheck, color: 'text-orange-500', bgColor: 'bg-orange-50' },
    { id: 'leave', title: 'LEAVE & PICKUP', icon: Clock, color: 'text-rose-500', bgColor: 'bg-rose-50' },
    { id: 'homework', title: 'HOME WORK', icon: BookOpen, color: 'text-purple-500', bgColor: 'bg-purple-50' },
    { id: 'hostel', title: 'HOSTEL', icon: Home, color: 'text-pink-500', bgColor: 'bg-pink-50' },
    { id: 'userlog', title: 'USER LOG', icon: ShieldCheck, color: 'text-slate-500', bgColor: 'bg-slate-50' },
  ];

  const filteredStudents = students.filter((s: any) => 
    (!filters.class || s.class === filters.class) && 
    (!filters.section || s.section === filters.section)
  );

  const filteredFinance = feeTransactions.filter((t: any) => 
    (!filters.class || t.class === filters.class) && 
    (!filters.section || t.section === filters.section) &&
    (!filters.date || t.date === new Date(filters.date).toLocaleDateString())
  );

  const filteredAttendance = attendance.filter((a: any) => 
    (!filters.class || a.class === filters.class) && 
    (!filters.section || a.section === filters.section) &&
    (!filters.date || a.date === new Date(filters.date).toLocaleDateString())
  );

  const filteredHomework = homeworks.filter((h: any) => 
    (!filters.class || h.class === filters.class) && 
    (!filters.section || h.section === filters.section) &&
    (!filters.date || h.date === new Date(filters.date).toLocaleDateString())
  );

  const filteredHostel = hostelAttendance.filter((a: any) => 
    (!filters.date || a.date === new Date(filters.date).toLocaleDateString())
  );

  const filteredLeave = leaveRequests.filter((l: any) => 
    (!filters.date || l.startDate === new Date(filters.date).toLocaleDateString())
  );

  const exportToExcel = (data: any[], fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-heading tracking-tight">Reports Center 📊</h1>
          <p className="text-text-sub font-medium">Generate and filter comprehensive school reports.</p>
        </div>
        {activeReport && (
          <button 
            onClick={() => setActiveReport(null)}
            className="flex items-center gap-2 text-text-sub hover:text-primary font-bold transition-all"
          >
            <ArrowRightLeft size={18} className="rotate-180" /> Back to Reports
          </button>
        )}
      </div>

      {!activeReport ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <button
              key={report.id}
              onClick={() => setActiveReport(report.id)}
              className="group p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all text-left"
            >
              <div className={`w-14 h-14 ${report.bgColor} ${report.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all shadow-sm`}>
                <report.icon size={28} />
              </div>
              <h3 className="text-lg font-black text-text-heading mb-2">{report.title}</h3>
              <p className="text-sm text-text-sub font-medium">View and filter {report.title.toLowerCase()} data.</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
                  <Calendar size={16} className="text-text-secondary" />
                  <input 
                    type="date" 
                    className="bg-transparent outline-none text-sm font-medium"
                    value={filters.date}
                    onChange={(e) => setFilters({...filters, date: e.target.value})}
                  />
                </div>
                <select 
                  className="bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 outline-none text-sm font-medium"
                  value={filters.class}
                  onChange={(e) => setFilters({...filters, class: e.target.value})}
                >
                  <option value="">All Classes</option>
                  {masterData.classes.map((c: string) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select 
                  className="bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 outline-none text-sm font-medium"
                  value={filters.section}
                  onChange={(e) => setFilters({...filters, section: e.target.value})}
                >
                  <option value="">All Sections</option>
                  {masterData.sections.map((s: string) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <button 
                onClick={() => exportToExcel(
                  activeReport === 'students' ? filteredStudents :
                  activeReport === 'finance' ? filteredFinance :
                  activeReport === 'attendance' ? filteredAttendance :
                  activeReport === 'leave' ? filteredLeave :
                  activeReport === 'homework' ? filteredHomework :
                  activeReport === 'hostel' ? filteredHostel : [],
                  `${activeReport}_report`
                )}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-600/20"
              >
                <FileSpreadsheet size={18} />
                Export Excel
              </button>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  {activeReport === 'students' && (
                    <tr>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">ID</th>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Name</th>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Class</th>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Father Name</th>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Mobile</th>
                    </tr>
                  )}
                  {activeReport === 'finance' && (
                    <tr>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Date</th>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Student</th>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Fee Type</th>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Amount</th>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Status</th>
                    </tr>
                  )}
                  {activeReport === 'attendance' && (
                    <tr>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Date</th>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Student</th>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Class</th>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Status</th>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Period</th>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Time</th>
                    </tr>
                  )}
                  {activeReport === 'leave' && (
                    <tr>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Date</th>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Student</th>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Type</th>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Pickup Time</th>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Status</th>
                    </tr>
                  )}
                  {activeReport === 'homework' && (
                    <tr>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Date</th>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Subject</th>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Title</th>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Due Date</th>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Submissions</th>
                    </tr>
                  )}
                  {activeReport === 'hostel' && (
                    <tr>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Date</th>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Student ID</th>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Status</th>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Time</th>
                    </tr>
                  )}
                  {activeReport === 'userlog' && (
                    <tr>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Time</th>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">User</th>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">Action</th>
                      <th className="p-4 font-bold text-xs uppercase text-text-secondary">IP Address</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeReport === 'students' && filteredStudents.map((s: any) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="p-4 text-sm font-bold text-primary">{s.studentId}</td>
                      <td className="p-4 text-sm font-bold">{s.name} {s.surname}</td>
                      <td className="p-4 text-sm font-medium">{s.class} - {s.section}</td>
                      <td className="p-4 text-sm font-medium">{s.fatherName}</td>
                      <td className="p-4 text-sm font-medium">{s.fatherMobile}</td>
                    </tr>
                  ))}
                  {activeReport === 'finance' && filteredFinance.map((t: any) => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="p-4 text-sm font-medium">{t.date}</td>
                      <td className="p-4 text-sm font-bold">{t.studentName}</td>
                      <td className="p-4 text-sm font-medium">{t.feeType}</td>
                      <td className="p-4 text-sm font-black text-emerald-600">₹{t.totalPaid}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${t.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {activeReport === 'attendance' && filteredAttendance.map((a: any) => (
                    <tr key={a.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="p-4 text-sm font-medium">{a.date}</td>
                      <td className="p-4 text-sm font-bold">{a.studentName}</td>
                      <td className="p-4 text-sm font-medium">{a.class} - {a.section}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${a.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-bold text-primary">{a.period || 'Morning'}</td>
                      <td className="p-4 text-sm font-medium">{a.time}</td>
                    </tr>
                  ))}
                  {activeReport === 'leave' && filteredLeave.map((l: any) => (
                    <tr key={l.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="p-4 text-sm font-medium">{l.startDate}</td>
                      <td className="p-4 text-sm font-bold">{l.studentName}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                          l.type === 'Early Leave' ? 'bg-orange-100 text-orange-700' : 
                          l.type === 'Parent Pickup' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {l.type}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-medium">{l.pickupTime || 'N/A'}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                          l.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                          l.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {activeReport === 'homework' && filteredHomework.map((h: any) => (
                    <tr key={h.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="p-4 text-sm font-medium">{h.date}</td>
                      <td className="p-4 text-sm font-bold text-primary">{h.subject}</td>
                      <td className="p-4 text-sm font-bold">{h.title}</td>
                      <td className="p-4 text-sm font-medium text-red-500">{h.dueDate}</td>
                      <td className="p-4 text-sm font-bold">{h.submissions.length} Students</td>
                    </tr>
                  ))}
                  {activeReport === 'hostel' && filteredHostel.map((a: any) => (
                    <tr key={a.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="p-4 text-sm font-medium">{a.date}</td>
                      <td className="p-4 text-sm font-bold">{a.studentId}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${a.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-medium">{a.time}</td>
                    </tr>
                  ))}
                  {activeReport === 'userlog' && userLogs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="p-4 text-sm font-medium">{log.timestamp}</td>
                      <td className="p-4 text-sm font-bold">{log.user}</td>
                      <td className="p-4 text-sm font-medium">{log.action}</td>
                      <td className="p-4 text-sm font-medium text-text-sub">{log.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(
                (activeReport === 'students' && filteredStudents.length === 0) ||
                (activeReport === 'finance' && filteredFinance.length === 0) ||
                (activeReport === 'attendance' && filteredAttendance.length === 0) ||
                (activeReport === 'leave' && filteredLeave.length === 0) ||
                (activeReport === 'homework' && filteredHomework.length === 0) ||
                (activeReport === 'hostel' && filteredHostel.length === 0) ||
                (activeReport === 'userlog' && userLogs.length === 0)
              ) && (
                <div className="text-center py-20">
                  <p className="text-text-sub font-medium italic">No records found for the selected filters.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

const HumanResourcePanel = ({ staff, setStaff, departments, setDepartments, designations, setDesignations, leaveRequests, setLeaveRequests }: any) => {
  const [activeTab, setActiveTab] = useState('staff-list');
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [newStaff, setNewStaff] = useState<Partial<Staff>>({
    status: 'Active',
    joiningDate: new Date().toISOString().split('T')[0]
  });
  const [newDepartment, setNewDepartment] = useState('');
  const [newDesignation, setNewDesignation] = useState('');
  const [newLeave, setNewLeave] = useState<any>({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: '',
    status: 'Pending'
  });

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.surname || !newStaff.role) return;
    const staffMember: Staff = {
      ...newStaff as Staff,
      id: `STF-${Math.floor(100000 + Math.random() * 900000)}`
    };
    setStaff([...staff, staffMember]);
    setShowAddStaff(false);
    setNewStaff({ status: 'Active', joiningDate: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-text-heading">Human Resource</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddStaff(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} /> Add Staff
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        {[
          { id: 'staff-list', label: 'Staff Details', icon: Users },
          { id: 'leave', label: 'Apply Leave', icon: CalendarRange },
          { id: 'approve-leave', label: 'Approve Leave', icon: CheckCircle2 },
          { id: 'departments', label: 'Department', icon: Building2 },
          { id: 'designations', label: 'Designation', icon: UserCog }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-primary'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'staff-list' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Staff ID</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Name</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Role</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Department</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Designation</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Mobile</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {staff.map((s: Staff) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 text-sm font-bold text-primary">{s.id}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs overflow-hidden">
                          {s.photo ? <img src={s.photo} alt="" className="w-full h-full object-cover" /> : s.name[0]}
                        </div>
                        <span className="font-bold text-text-heading">{s.name} {s.surname}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-text-sub">{s.role}</td>
                    <td className="py-4 text-sm text-text-sub">{s.department}</td>
                    <td className="py-4 text-sm text-text-sub">{s.designation}</td>
                    <td className="py-4 text-sm text-text-sub">{s.mobile}</td>
                    <td className="py-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                        s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'leave' && (
        <Card className="max-w-xl mx-auto p-8">
          <h3 className="text-xl font-black text-text-heading mb-6 uppercase tracking-tight">Apply Leave</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Start Date" type="date" value={newLeave.startDate} onChange={(e: any) => setNewLeave({...newLeave, startDate: e.target.value})} />
              <Input label="End Date" type="date" value={newLeave.endDate} onChange={(e: any) => setNewLeave({...newLeave, endDate: e.target.value})} />
            </div>
            <div className="w-full">
              <label className="label-text">Reason</label>
              <textarea 
                className="input-field min-h-[120px]" 
                value={newLeave.reason}
                onChange={(e: any) => setNewLeave({...newLeave, reason: e.target.value})}
              />
            </div>
            <button 
              onClick={() => {
                if (!newLeave.reason) return;
                setLeaveRequests([{...newLeave, id: Date.now().toString(), staffName: 'Current User', staffId: 'STF-001'}, ...leaveRequests]);
                setNewLeave({
                  startDate: new Date().toISOString().split('T')[0],
                  endDate: new Date().toISOString().split('T')[0],
                  reason: '',
                  status: 'Pending'
                });
              }}
              className="btn-primary w-full py-4"
            >
              Submit Leave Request
            </button>
          </div>
        </Card>
      )}

      {activeTab === 'approve-leave' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 px-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Staff</th>
                  <th className="pb-4 px-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Duration</th>
                  <th className="pb-4 px-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Reason</th>
                  <th className="pb-4 px-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Status</th>
                  <th className="pb-4 px-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {leaveRequests.map((l: any) => (
                  <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <p className="text-sm font-bold text-text-heading">{l.staffName}</p>
                      <p className="text-[10px] text-text-sub uppercase">{l.staffId}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm font-bold text-text-heading">{l.startDate} to {l.endDate}</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-text-sub max-w-xs truncate">{l.reason}</td>
                    <td className="py-4 px-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                        l.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                        l.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {l.status === 'Pending' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setLeaveRequests(leaveRequests.map((r: any) => r.id === l.id ? {...r, status: 'Approved'} : r))}
                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                          <button 
                            onClick={() => setLeaveRequests(leaveRequests.map((r: any) => r.id === l.id ? {...r, status: 'Rejected'} : r))}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {leaveRequests.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-text-sub font-medium italic">No leave requests found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-1 p-6">
            <h3 className="text-lg font-bold mb-6">Add Department</h3>
            <div className="space-y-4">
              <Input label="Department Name" value={newDepartment} onChange={(e: any) => setNewDepartment(e.target.value)} />
              <button 
                onClick={() => {
                  if (!newDepartment) return;
                  setDepartments([...departments, { id: Date.now().toString(), name: newDepartment }]);
                  setNewDepartment('');
                }}
                className="btn-primary w-full py-3"
              >
                Save Department
              </button>
            </div>
          </Card>
          <Card className="md:col-span-2 p-6">
            <h3 className="text-lg font-bold mb-6">Department List</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Name</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {departments.map((d: any) => (
                    <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 text-sm font-bold text-text-heading">{d.name}</td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => setDepartments(departments.filter((dep: any) => dep.id !== d.id))}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'designations' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-1 p-6">
            <h3 className="text-lg font-bold mb-6">Add Designation</h3>
            <div className="space-y-4">
              <Input label="Designation Name" value={newDesignation} onChange={(e: any) => setNewDesignation(e.target.value)} />
              <button 
                onClick={() => {
                  if (!newDesignation) return;
                  setDesignations([...designations, { id: Date.now().toString(), name: newDesignation }]);
                  setNewDesignation('');
                }}
                className="btn-primary w-full py-3"
              >
                Save Designation
              </button>
            </div>
          </Card>
          <Card className="md:col-span-2 p-6">
            <h3 className="text-lg font-bold mb-6">Designation List</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Name</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {designations.map((d: any) => (
                    <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 text-sm font-bold text-text-heading">{d.name}</td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => setDesignations(designations.filter((des: any) => des.id !== d.id))}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Add Staff Modal */}
      <AnimatePresence>
        {showAddStaff && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-text-heading">Add New Staff</h3>
                <button onClick={() => setShowAddStaff(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="First Name" required value={newStaff.name} onChange={(e: any) => setNewStaff({...newStaff, name: e.target.value})} />
                <Input label="Last Name" required value={newStaff.surname} onChange={(e: any) => setNewStaff({...newStaff, surname: e.target.value})} />
                <Input label="Email" type="email" value={newStaff.email} onChange={(e: any) => setNewStaff({...newStaff, email: e.target.value})} />
                <Input label="Mobile" value={newStaff.mobile} onChange={(e: any) => setNewStaff({...newStaff, mobile: e.target.value})} />
                
                <div className="w-full">
                  <label className="label-text">Role <span className="text-red-500">*</span></label>
                  <select 
                    className="input-field"
                    value={newStaff.role}
                    onChange={(e: any) => setNewStaff({...newStaff, role: e.target.value})}
                  >
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Librarian">Librarian</option>
                    <option value="Warden">Warden</option>
                  </select>
                </div>

                <div className="w-full">
                  <label className="label-text">Department</label>
                  <select 
                    className="input-field"
                    value={newStaff.department}
                    onChange={(e: any) => setNewStaff({...newStaff, department: e.target.value})}
                  >
                    <option value="">Select Department</option>
                    {departments.map((d: any) => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>

                <div className="w-full">
                  <label className="label-text">Designation</label>
                  <select 
                    className="input-field"
                    value={newStaff.designation}
                    onChange={(e: any) => setNewStaff({...newStaff, designation: e.target.value})}
                  >
                    <option value="">Select Designation</option>
                    {designations.map((d: any) => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>

                <Input label="Joining Date" type="date" value={newStaff.joiningDate} onChange={(e: any) => setNewStaff({...newStaff, joiningDate: e.target.value})} />
              </div>

              <div className="mt-8 flex gap-3">
                <button onClick={() => setShowAddStaff(false)} className="flex-1 py-4 font-bold text-text-sub hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                <button onClick={handleAddStaff} className="flex-1 btn-primary py-4">Save Staff</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CommunicatePanel = ({ notifications, setNotifications, templates, setTemplates }: any) => {
  const [activeTab, setActiveTab] = useState('notice-board');
  const [showAddNotice, setShowAddNotice] = useState(false);
  const [newNotice, setNewNotice] = useState<Partial<Notification>>({
    type: 'Info',
    targetRoles: ['admin', 'teacher', 'student', 'parent'],
    date: new Date().toISOString().split('T')[0]
  });

  const handleAddNotice = () => {
    if (!newNotice.title || !newNotice.message) return;
    const notice: Notification = {
      ...newNotice as Notification,
      id: `NOT-${Date.now()}`
    };
    setNotifications([notice, ...notifications]);
    setShowAddNotice(false);
    setNewNotice({ type: 'Info', targetRoles: ['admin', 'teacher', 'student', 'parent'], date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-text-heading">Communicate</h2>
        <button 
          onClick={() => setShowAddNotice(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> Add Notice
        </button>
      </div>

      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        {[
          { id: 'notice-board', label: 'Notice Board', icon: Bell },
          { id: 'send-message', label: 'Send Email/WhatsApp', icon: MessageCircle },
          { id: 'templates', label: 'Templates', icon: FileText }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-primary'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'notice-board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notifications.map((n: Notification) => (
            <Card key={n.id} className="relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full ${
                n.type === 'Warning' ? 'bg-orange-500' : 
                n.type === 'Success' ? 'bg-green-500' : 
                n.type === 'Fee' ? 'bg-purple-500' : 'bg-blue-500'
              }`} />
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-black text-text-heading">{n.title}</h4>
                <span className="text-[10px] font-bold text-text-sub uppercase">{n.date}</span>
              </div>
              <p className="text-sm text-text-sub mb-4">{n.message}</p>
              <div className="flex flex-wrap gap-2">
                {n.targetRoles.map(role => (
                  <span key={role} className="text-[8px] font-black px-2 py-1 bg-slate-100 rounded-full uppercase text-slate-500">
                    {role}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Notice Modal */}
      <AnimatePresence>
        {showAddNotice && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 w-full max-w-xl shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-text-heading">Add New Notice</h3>
                <button onClick={() => setShowAddNotice(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <Input label="Title" required value={newNotice.title} onChange={(e: any) => setNewNotice({...newNotice, title: e.target.value})} />
                <div className="w-full">
                  <label className="label-text">Message <span className="text-red-500">*</span></label>
                  <textarea 
                    className="input-field min-h-[120px]" 
                    value={newNotice.message}
                    onChange={(e: any) => setNewNotice({...newNotice, message: e.target.value})}
                  />
                </div>
                <div className="w-full">
                  <label className="label-text">Notice Type</label>
                  <select 
                    className="input-field"
                    value={newNotice.type}
                    onChange={(e: any) => setNewNotice({...newNotice, type: e.target.value as any})}
                  >
                    <option value="Info">Information</option>
                    <option value="Warning">Warning</option>
                    <option value="Success">Success</option>
                    <option value="Fee">Fee Related</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button onClick={() => setShowAddNotice(false)} className="flex-1 py-4 font-bold text-text-sub hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                <button onClick={handleAddNotice} className="flex-1 btn-primary py-4">Post Notice</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FrontOfficePanel = ({ enquiries, setEnquiries, visitors, setVisitors, complaints, setComplaints, setView, setFormData, currentUser }: any) => {
  const [activeTab, setActiveTab] = useState('enquiry');
  const [showAddEnquiry, setShowAddEnquiry] = useState(false);
  const [newEnquiry, setNewEnquiry] = useState<Partial<AdmissionEnquiry>>({
    status: 'Pending',
    date: new Date().toISOString().split('T')[0]
  });
  const [newVisitor, setNewVisitor] = useState<Partial<Visitor>>({
    date: new Date().toISOString().split('T')[0],
    inTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  const [newComplaint, setNewComplaint] = useState<Partial<Complaint>>({
    date: new Date().toISOString().split('T')[0],
    status: 'Pending'
  });

  const handleAddEnquiry = () => {
    if (!newEnquiry.name || !newEnquiry.mobile) return;
    const enquiry: AdmissionEnquiry = {
      ...newEnquiry as AdmissionEnquiry,
      id: `ENQ-${Date.now()}`
    };
    setEnquiries([enquiry, ...enquiries]);
    setShowAddEnquiry(false);
    setNewEnquiry({ status: 'Pending', date: new Date().toISOString().split('T')[0] });
  };

  const handleApproveForAdmission = (enquiry: AdmissionEnquiry) => {
    // 1. Update enquiry status
    setEnquiries(enquiries.map((e: AdmissionEnquiry) => 
      e.id === enquiry.id ? { ...e, status: 'Approved' } : e
    ));

    // 2. Pre-fill student registration form
    setFormData({
      name: enquiry.name,
      surname: enquiry.surname,
      mobile: enquiry.mobile,
      email: enquiry.email,
      class: enquiry.class,
      fatherName: enquiry.fatherName,
      motherName: enquiry.motherName,
      address: enquiry.address,
      gender: enquiry.gender,
      fatherMobile: enquiry.mobile // Assuming mobile is father's mobile if not specified
    });

    // 3. Navigate to registration
    setView('register-student');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-text-heading">Front Office</h2>
        <button 
          onClick={() => setShowAddEnquiry(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> New Enquiry
        </button>
      </div>

      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        {[
          { id: 'enquiry', label: 'Admission Enquiry', icon: UserPlus },
          { id: 'visitors', label: 'Visitor Book', icon: BookOpen },
          { id: 'complaints', label: 'Complaints', icon: AlertCircle }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-primary'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'enquiry' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Date</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Student Name</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Mobile</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Class</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Status</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {enquiries.map((e: AdmissionEnquiry) => (
                  <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 text-sm text-text-sub">{e.date}</td>
                    <td className="py-4 text-sm font-bold text-text-heading">{e.name} {e.surname}</td>
                    <td className="py-4 text-sm text-text-sub">{e.mobile}</td>
                    <td className="py-4 text-sm text-text-sub">{e.class}</td>
                    <td className="py-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                        e.status === 'Closed' ? 'bg-slate-100 text-slate-700' : 
                        e.status === 'Follow-up' ? 'bg-orange-100 text-orange-700' : 
                        e.status === 'Approved' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {currentUser?.role === 'admin' && e.status !== 'Approved' && (
                        <button 
                          onClick={() => handleApproveForAdmission(e)}
                          className="text-[10px] font-black text-primary hover:underline uppercase"
                        >
                          Approve for Admission
                        </button>
                      )}
                      {e.status === 'Approved' && (
                        <span className="text-[10px] font-black text-green-600 uppercase">Admission Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'visitors' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-1 p-6">
            <h3 className="text-lg font-bold mb-6">Add Visitor</h3>
            <div className="space-y-4">
              <Input label="Visitor Name" value={newVisitor.name} onChange={(e: any) => setNewVisitor({...newVisitor, name: e.target.value})} />
              <Input label="Mobile" value={newVisitor.mobile} onChange={(e: any) => setNewVisitor({...newVisitor, mobile: e.target.value})} />
              <Input label="Purpose" value={newVisitor.purpose} onChange={(e: any) => setNewVisitor({...newVisitor, purpose: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Date" type="date" value={newVisitor.date} onChange={(e: any) => setNewVisitor({...newVisitor, date: e.target.value})} />
                <Input label="In Time" type="time" value={newVisitor.inTime} onChange={(e: any) => setNewVisitor({...newVisitor, inTime: e.target.value})} />
              </div>
              <button 
                onClick={() => {
                  if (!newVisitor.name || !newVisitor.mobile) return;
                  setVisitors([{...newVisitor, id: Date.now().toString()}, ...visitors]);
                  setNewVisitor({
                    date: new Date().toISOString().split('T')[0],
                    inTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  });
                }}
                className="btn-primary w-full py-3"
              >
                Save Visitor
              </button>
            </div>
          </Card>
          <Card className="md:col-span-2 p-6">
            <h3 className="text-lg font-bold mb-6">Visitor List</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Date</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Name</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Purpose</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">In Time</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Out Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {visitors.map((v: Visitor) => (
                    <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 text-sm text-text-sub">{v.date}</td>
                      <td className="py-4 text-sm font-bold text-text-heading">{v.name}</td>
                      <td className="py-4 text-sm text-text-sub">{v.purpose}</td>
                      <td className="py-4 text-sm text-text-sub">{v.inTime}</td>
                      <td className="py-4 text-sm text-text-sub">
                        {v.outTime ? v.outTime : (
                          <button 
                            onClick={() => setVisitors(visitors.map((vis: Visitor) => vis.id === v.id ? {...vis, outTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} : vis))}
                            className="text-[10px] font-black text-primary hover:underline uppercase"
                          >
                            Mark Out
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'complaints' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-1 p-6">
            <h3 className="text-lg font-bold mb-6">Add Complaint</h3>
            <div className="space-y-4">
              <Input label="Complainant Name" value={newComplaint.name} onChange={(e: any) => setNewComplaint({...newComplaint, name: e.target.value})} />
              <Input label="Complaint Type" value={newComplaint.type} onChange={(e: any) => setNewComplaint({...newComplaint, type: e.target.value})} />
              <Input label="Source" value={newComplaint.source} onChange={(e: any) => setNewComplaint({...newComplaint, source: e.target.value})} />
              <Input label="Date" type="date" value={newComplaint.date} onChange={(e: any) => setNewComplaint({...newComplaint, date: e.target.value})} />
              <div className="w-full">
                <label className="label-text">Description</label>
                <textarea 
                  className="input-field min-h-[100px]" 
                  value={newComplaint.description}
                  onChange={(e: any) => setNewComplaint({...newComplaint, description: e.target.value})}
                />
              </div>
              <button 
                onClick={() => {
                  if (!newComplaint.name || !newComplaint.description) return;
                  setComplaints([{...newComplaint, id: Date.now().toString()}, ...complaints]);
                  setNewComplaint({
                    date: new Date().toISOString().split('T')[0],
                    status: 'Pending'
                  });
                }}
                className="btn-primary w-full py-3"
              >
                Save Complaint
              </button>
            </div>
          </Card>
          <Card className="md:col-span-2 p-6">
            <h3 className="text-lg font-bold mb-6">Complaint List</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Date</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Name</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Type</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Status</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {complaints.map((c: Complaint) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 text-sm text-text-sub">{c.date}</td>
                      <td className="py-4 text-sm font-bold text-text-heading">{c.name}</td>
                      <td className="py-4 text-sm text-text-sub">{c.type}</td>
                      <td className="py-4">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                          c.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-4">
                        {c.status === 'Pending' && (
                          <button 
                            onClick={() => setComplaints(complaints.map((comp: Complaint) => comp.id === c.id ? {...comp, status: 'Resolved'} : comp))}
                            className="text-[10px] font-black text-primary hover:underline uppercase"
                          >
                            Resolve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Add Enquiry Modal */}
      <AnimatePresence>
        {showAddEnquiry && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 w-full max-w-xl shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-text-heading">New Admission Enquiry</h3>
                <button onClick={() => setShowAddEnquiry(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="First Name" required value={newEnquiry.name} onChange={(e: any) => setNewEnquiry({...newEnquiry, name: e.target.value})} />
                <Input label="Surname" required value={newEnquiry.surname} onChange={(e: any) => setNewEnquiry({...newEnquiry, surname: e.target.value})} />
                <Input label="Mobile" required value={newEnquiry.mobile} onChange={(e: any) => setNewEnquiry({...newEnquiry, mobile: e.target.value})} />
                <Input label="Email" value={newEnquiry.email} onChange={(e: any) => setNewEnquiry({...newEnquiry, email: e.target.value})} />
                <Input label="Class" value={newEnquiry.class} onChange={(e: any) => setNewEnquiry({...newEnquiry, class: e.target.value})} />
                <Input label="Gender" value={newEnquiry.gender} onChange={(e: any) => setNewEnquiry({...newEnquiry, gender: e.target.value})} />
                <Input label="Father's Name" value={newEnquiry.fatherName} onChange={(e: any) => setNewEnquiry({...newEnquiry, fatherName: e.target.value})} />
                <Input label="Mother's Name" value={newEnquiry.motherName} onChange={(e: any) => setNewEnquiry({...newEnquiry, motherName: e.target.value})} />
                <Input label="Source" placeholder="e.g. Website, Newspaper" value={newEnquiry.source} onChange={(e: any) => setNewEnquiry({...newEnquiry, source: e.target.value})} />
                <Input label="Date" type="date" value={newEnquiry.date} onChange={(e: any) => setNewEnquiry({...newEnquiry, date: e.target.value})} />
                <div className="md:col-span-2">
                  <label className="label-text">Address</label>
                  <textarea 
                    className="input-field min-h-[80px]" 
                    value={newEnquiry.address}
                    onChange={(e: any) => setNewEnquiry({...newEnquiry, address: e.target.value})}
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button onClick={() => setShowAddEnquiry(false)} className="flex-1 py-4 font-bold text-text-sub hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                <button onClick={handleAddEnquiry} className="flex-1 btn-primary py-4">Save Enquiry</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RoleAssignPanel = ({ users, setUsers }: any) => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const availablePermissions = [
    'Admission', 'QR Attendance', 'QR Late Attendance', 'QR Leaving During School',
    'Leave Application', 'Fee Structure', 'Hostel', 'Syllabus', 'Payment Gateway',
    'WhatsApp', 'Progress Report', 'Transfer Certificate', 'Appreciation Certificate',
    'Birthday Wish', 'Bulk WhatsApp Notification', 'Home Work Assign', 'Bank/Cash Management',
    'ID Card Generate Panel'
  ];

  const togglePermission = (permission: string) => {
    if (!selectedUser) return;
    const newPermissions = selectedUser.permissions.includes(permission)
      ? selectedUser.permissions.filter((p: string) => p !== permission)
      : [...selectedUser.permissions, permission];
    
    const updatedUser = { ...selectedUser, permissions: newPermissions };
    setSelectedUser(updatedUser);
    setUsers(users.map((u: any) => u.id === selectedUser.id ? updatedUser : u));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-text-heading tracking-tight">Role & Permission Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <h3 className="text-lg font-bold mb-4">Users</h3>
          <div className="space-y-2">
            {users.map((u: any) => (
              <button
                key={u.id}
                onClick={() => setSelectedUser(u)}
                className={`w-full text-left p-3 rounded-xl transition-all ${selectedUser?.id === u.id ? 'bg-primary text-white' : 'hover:bg-slate-50'}`}
              >
                <p className="font-bold text-sm">{u.name}</p>
                <p className={`text-[10px] uppercase font-bold ${selectedUser?.id === u.id ? 'text-white/70' : 'text-text-sub'}`}>{u.role} | {u.id}</p>
              </button>
            ))}
          </div>
        </Card>

        <Card className="md:col-span-2">
          {selectedUser ? (
            <>
              <h3 className="text-lg font-bold mb-4">Permissions for {selectedUser.name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availablePermissions.map((p) => (
                  <label key={p} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                    <input
                      type="checkbox"
                      checked={selectedUser.permissions.includes(p)}
                      onChange={() => togglePermission(p)}
                      className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-text-heading">{p}</span>
                  </label>
                ))}
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-text-sub italic">
              Select a user to manage permissions
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

const IncomeExpenseView = ({ incomes, setIncomes, expenses, setExpenses, incomeHeads, setIncomeHeads, expenseHeads, setExpenseHeads }: any) => {
  const [activeTab, setActiveTab] = useState<'income' | 'expense' | 'income-head' | 'expense-head'>('income');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');

  const handleAdd = () => {
    if (activeTab === 'income') {
      setIncomes([...incomes, { ...formData, id: Date.now().toString() }]);
    } else if (activeTab === 'expense') {
      setExpenses([...expenses, { ...formData, id: Date.now().toString() }]);
    } else if (activeTab === 'income-head') {
      setIncomeHeads([...incomeHeads, { ...formData, id: Date.now().toString() }]);
    } else if (activeTab === 'expense-head') {
      setExpenseHeads([...expenseHeads, { ...formData, id: Date.now().toString() }]);
    }
    setShowAddModal(false);
    setFormData({});
  };

  const filteredData = (activeTab === 'income' ? incomes : expenses).filter((item: any) => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-heading tracking-tight uppercase">Income & Expense Management</h1>
          <p className="text-text-sub font-medium">Manage school finances, donations, and operational costs.</p>
        </div>
        <button 
          onClick={() => {
            setFormData({ date: new Date().toISOString().split('T')[0] });
            setShowAddModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} /> Add {activeTab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
        </button>
      </div>

      <div className="flex gap-4 border-b border-slate-200">
        <button onClick={() => setActiveTab('income')} className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === 'income' ? 'border-primary text-primary' : 'border-transparent text-text-sub'}`}>Income</button>
        <button onClick={() => setActiveTab('expense')} className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === 'expense' ? 'border-primary text-primary' : 'border-transparent text-text-sub'}`}>Expense</button>
        <button onClick={() => setActiveTab('income-head')} className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === 'income-head' ? 'border-primary text-primary' : 'border-transparent text-text-sub'}`}>Income Head</button>
        <button onClick={() => setActiveTab('expense-head')} className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === 'expense-head' ? 'border-primary text-primary' : 'border-transparent text-text-sub'}`}>Expense Head</button>
      </div>

      {(activeTab === 'income' || activeTab === 'expense') && (
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`} 
                className="input-field pl-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold text-text-secondary uppercase tracking-wider border-b border-slate-200">
                  <th className="pb-4 px-4">Name</th>
                  <th className="pb-4 px-4">Invoice No</th>
                  <th className="pb-4 px-4">Head</th>
                  <th className="pb-4 px-4">Date</th>
                  <th className="pb-4 px-4">Amount</th>
                  <th className="pb-4 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredData.map((item: any) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-all">
                    <td className="py-4 px-4 font-bold">{item.name}</td>
                    <td className="py-4 px-4">{item.invoiceNumber}</td>
                    <td className="py-4 px-4">{activeTab === 'income' ? item.incomeHead : item.expenseHead}</td>
                    <td className="py-4 px-4">{item.date}</td>
                    <td className="py-4 px-4 font-black text-primary">₹{item.amount.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-slate-100 rounded-lg text-blue-500"><Edit2 size={16} /></button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg text-red-500"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-text-sub font-medium italic">No records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {(activeTab === 'income-head' || activeTab === 'expense-head') && (
        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold text-text-secondary uppercase tracking-wider border-b border-slate-200">
                  <th className="pb-4 px-4">Name</th>
                  <th className="pb-4 px-4">Description</th>
                  <th className="pb-4 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {(activeTab === 'income-head' ? incomeHeads : expenseHeads).map((head: any) => (
                  <tr key={head.id} className="border-b border-slate-100 hover:bg-slate-50 transition-all">
                    <td className="py-4 px-4 font-bold">{head.name}</td>
                    <td className="py-4 px-4 text-text-sub">{head.description}</td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-slate-100 rounded-lg text-blue-500"><Edit2 size={16} /></button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg text-red-500"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-black text-text-heading mb-8 uppercase tracking-tight">Add {activeTab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</h3>
            <div className="space-y-4">
              {(activeTab === 'income' || activeTab === 'expense') ? (
                <>
                  <Input label="Name" value={formData.name} onChange={(e: any) => setFormData({ ...formData, name: e.target.value })} />
                  <Select 
                    label={activeTab === 'income' ? "Income Head" : "Expense Head"} 
                    options={(activeTab === 'income' ? incomeHeads : expenseHeads).map((h: any) => h.name)} 
                    value={activeTab === 'income' ? formData.incomeHead : formData.expenseHead} 
                    onChange={(e: any) => setFormData({ ...formData, [activeTab === 'income' ? 'incomeHead' : 'expenseHead']: e.target.value })} 
                  />
                  <Input label="Invoice Number" value={formData.invoiceNumber} onChange={(e: any) => setFormData({ ...formData, invoiceNumber: e.target.value })} />
                  <Input label="Date" type="date" value={formData.date} onChange={(e: any) => setFormData({ ...formData, date: e.target.value })} />
                  <Input label="Amount" type="number" value={formData.amount} onChange={(e: any) => setFormData({ ...formData, amount: Number(e.target.value) })} />
                  <div className="space-y-2">
                    <label className="label-text">Description</label>
                    <textarea className="input-field min-h-[100px]" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                  </div>
                </>
              ) : (
                <>
                  <Input label="Head Name" value={formData.name} onChange={(e: any) => setFormData({ ...formData, name: e.target.value })} />
                  <div className="space-y-2">
                    <label className="label-text">Description</label>
                    <textarea className="input-field min-h-[100px]" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                  </div>
                </>
              )}
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 rounded-2xl font-bold text-text-sub hover:bg-slate-100 transition-all">Cancel</button>
                <button onClick={handleAdd} className="flex-1 py-4 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/20">Save Record</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const SuperAdminPanel = ({ users, setUsers }: any) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = (userId: string) => {
    if (!newPassword) {
      alert('Please enter a new password');
      return;
    }
    setUsers(users.map((u: any) => u.id === userId ? { ...u, password: newPassword } : u));
    setEditingUserId(null);
    setNewPassword('');
    alert('Password reset successfully!');
  };

  const filteredUsers = users.filter((u: any) => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-heading tracking-tight uppercase">Super Admin Control 🛡️</h1>
          <p className="text-text-secondary font-medium">Manage all user credentials and security settings.</p>
        </div>
      </div>

      <Card className="p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <h3 className="text-xl font-black text-primary flex items-center gap-3 uppercase tracking-tighter">
            <ShieldCheck size={24} /> User Credentials Master List
          </h3>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by ID, Name or Role..." 
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none text-sm font-bold transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-[2rem] border-2 border-slate-50 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] border-b-2 border-slate-100">
                <th className="py-6 px-6">User Info</th>
                <th className="py-6 px-6">Role</th>
                <th className="py-6 px-6">Current Password</th>
                <th className="py-6 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredUsers.map((user: any) => (
                <tr key={user.id} className="border-b border-slate-50 hover:bg-primary/5 transition-all group">
                  <td className="py-6 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black shadow-inner">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="font-black text-text-heading text-base">{user.name}</p>
                        <p className="text-xs font-bold text-primary uppercase tracking-widest">{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                      user.role === 'admin' ? 'bg-red-100 text-red-700' :
                      user.role === 'teacher' ? 'bg-blue-100 text-blue-700' :
                      user.role === 'student' ? 'bg-green-100 text-green-700' :
                      user.role === 'super-admin' ? 'bg-purple-100 text-purple-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-6 px-6">
                    {editingUserId === user.id ? (
                      <input 
                        type="text" 
                        className="input-field py-2 text-xs" 
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center gap-2 font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg w-fit">
                        <Lock size={12} className="text-slate-400" />
                        {user.password || '12345678'}
                      </div>
                    )}
                  </td>
                  <td className="py-6 px-6 text-right">
                    {editingUserId === user.id ? (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setEditingUserId(null)}
                          className="p-2 hover:bg-red-50 rounded-xl text-red-500 transition-colors"
                        >
                          <XCircle size={20} />
                        </button>
                        <button 
                          onClick={() => handleResetPassword(user.id)}
                          className="p-2 hover:bg-green-50 rounded-xl text-green-500 transition-colors"
                        >
                          <CheckCircle2 size={20} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setEditingUserId(user.id)}
                        className="px-4 py-2 bg-white border-2 border-slate-100 rounded-xl text-xs font-black text-primary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm flex items-center gap-2 ml-auto"
                      >
                        <Edit2 size={14} /> Reset Password
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<View>('login');
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([
    { id: 'admin', name: 'Administrator', role: 'admin', permissions: ['all'], password: '123' },
    { id: 'teacher', name: 'Teacher', role: 'teacher', permissions: ['all'], password: '123' },
    { id: 'stu', name: 'Student', role: 'student', permissions: ['all'], password: '123' },
    { id: 'warden', name: 'Hostel Warden', role: 'warden', permissions: ['all'], password: '123' },
    { id: 'DC0018', name: 'Super Admin', role: 'super-admin', permissions: ['all'], password: 'Durgamaa@18' },
    { id: 'TCH-12345', name: 'Rajesh Kumar', role: 'teacher', permissions: ['QR Attendance', 'QR Late Attendance', 'QR Leaving During School', 'Leave Application', 'Syllabus', 'Home Work Assign', 'Progress Report'], password: '123' },
    { id: 'PAR-12345', name: 'Parent of DS-12345', role: 'parent', studentId: 'DS-12345', permissions: ['QR Attendance', 'Leave Application', 'Fee Structure', 'Syllabus', 'Progress Report', 'Home Work Assign'], password: '123' }
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const getStudentDueFees = (student: any) => {
    const classFees = feeMaster.filter((f: any) => f.class === student.class);
    if (classFees.length === 0) return 0;
    
    const paidAmount = feeTransactions
      .filter((t: any) => t.studentId === student.studentId)
      .reduce((sum: number, t: any) => sum + t.totalPaid, 0);
      
    // Sum all fees for the class
    const totalDue = classFees.reduce((sum: number, f: any) => {
      const multiplier = f.frequency === 'Monthly' ? 12 : 
                         f.frequency === 'Quarterly' ? 4 : 
                         f.frequency === 'Half-Yearly' ? 2 : 1;
      return sum + (f.amount * multiplier);
    }, 0);
    
    return Math.max(0, totalDue - paidAmount);
  };
  const [students, setStudents] = useState<Student[]>([]);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [schoolProfile, setSchoolProfile] = useState({
    name: 'Digital School Systems',
    logo: 'https://storage.googleapis.com/cortex-dev-cortex-build-public-assets/ais-dev-b3e775v3rvj7egmf2trpz3-352124703760/tiedknot9%40gmail.com/1742920325178-image-0.png',
    signature: null,
    stamp: null,
    contact: '+91 9876543210',
    address: '123 Education Hub, New Delhi, India',
    gstNo: '22AAAAA0000A1Z5',
    regNo: 'SCH/2024/001',
    wardenPanelId: 'warden',
    wardenPanelPassword: '12345',
    cameraUrls: [
      { id: '1', name: 'Main Gate', url: 'https://picsum.photos/seed/gate/640/480' },
      { id: '2', name: 'Hostel Block A', url: 'https://picsum.photos/seed/hostel/640/480' },
      { id: '3', name: 'Playground', url: 'https://picsum.photos/seed/play/640/480' },
      { id: '4', name: 'Library', url: 'https://picsum.photos/seed/library/640/480' }
    ]
  });
  const [formData, setFormData] = useState<any>({});
  const [selectedPersonForID, setSelectedPersonForID] = useState<any>(null);
  const [idCardTab, setIdCardTab] = useState('student');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Master Data State
  const [masterData, setMasterData] = useState({
    categories: ['General', 'OBC', 'SC', 'ST'],
    castes: ['Hindu', 'Muslim', 'Sikh', 'Christian'],
    religions: ['Hinduism', 'Islam', 'Sikhism', 'Christianity', 'Buddhism', 'Jainism'],
    titles: ['Mr.', 'Miss', 'Mrs.'],
    classes: ['LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
    sections: ['A', 'B', 'C', 'D'],
    subjects: ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi', 'Computer Science'],
    genders: ['Male', 'Female', 'Others'],
    teachers: ['Rajesh Kumar', 'Sunita Devi', 'Amit Shah', 'Priyanka Sharma', 'Vikram Singh', 'Neha Gupta', 'Sanjay Verma', 'Meera Nair', 'Rahul Sharma', 'Sachin Gupta'],
    sessions: ['2023-24', '2024-25', '2025-26']
  });

  const [taxes, setTaxes] = useState(0);
  const [generatedCredentials, setGeneratedCredentials] = useState<any[]>([]);
  
  // Fee Management State
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([
    { id: '1', name: 'Tuition Fee', description: 'Monthly tuition fee' },
    { id: '2', name: 'Library Fee', description: 'Annual library fee' },
    { id: '3', name: 'Transport Fee', description: 'Monthly transport fee' },
    { id: '4', name: 'Early Leave Fee', description: 'Fee for early student leave' },
    { id: '5', name: 'Parent Pickup Fee', description: 'Fee for parent pickup service' }
  ]);
  const [feeMaster, setFeeMaster] = useState<FeeMaster[]>([
    { id: '1', class: 'Class 1', feeType: 'Tuition Fee', amount: 2500, frequency: 'Monthly' },
    { id: '2', class: 'Class 2', feeType: 'Tuition Fee', amount: 2600, frequency: 'Monthly' }
  ]);
  const [feeTransactions, setFeeTransactions] = useState<FeeTransaction[]>([]);
  
  // Academics State
  const [timeTables, setTimeTables] = useState<ClassTimeTable[]>([]);
  const [syllabuses, setSyllabuses] = useState<Syllabus[]>([
    { id: '1', class: '10', subject: 'Mathematics', title: 'Algebra', description: 'Quadratic equations and functions', date: '2024-03-20', status: 'Started' },
    { id: '2', class: '10', subject: 'Science', title: 'Physics', description: 'Light and Optics', date: '2024-03-15', status: 'Completed' },
    { id: '3', class: '9', subject: 'English', title: 'Grammar', description: 'Tenses and Voices', date: '2024-03-18', status: 'Not Started' },
  ]);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [teacherAssignments, setTeacherAssignments] = useState<ClassAssignment[]>([
    { id: '1', class: 'Class 10', section: 'A', classTeacher: 'Rajesh Kumar', subjectTeachers: [{ subject: 'Mathematics', teacher: 'Rajesh Kumar' }], session: '2024-25' },
    { id: '2', class: 'Class 9', section: 'B', classTeacher: 'Sunita Devi', subjectTeachers: [{ subject: 'Science', teacher: 'Rajesh Kumar' }], session: '2024-25' },
    { id: '3', class: 'Class 1', section: 'A', classTeacher: 'Rajesh Kumar', subjectTeachers: [{ subject: 'English', teacher: 'Rajesh Kumar' }], session: '2024-25' },
  ]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  
  // Examination State
  const [exams, setExams] = useState<Exam[]>([]);
  const [examSchedules, setExamSchedules] = useState<ExamSchedule[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    { id: '1', studentId: 'ST-102938', studentName: 'John Doe', class: '10', section: 'A', startDate: '2024-03-25', endDate: '2024-03-26', duration: 2, reason: 'Family function', status: 'Pending', appliedDate: '2024-03-20' },
    { id: '2', studentId: 'ST-102939', studentName: 'Jane Smith', class: '10', section: 'B', startDate: '2024-03-22', endDate: '2024-03-22', duration: 1, reason: 'Medical checkup', status: 'Approved', appliedDate: '2024-03-19', approvedBy: 'Teacher A' },
  ]);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'Fee Reminder', message: 'Your tuition fee for March is due.', date: '2024-03-20', type: 'Fee', targetRoles: ['parent'], targetStudentId: 'ST-102938' },
    { id: '2', title: 'Holiday Notice', message: 'School will be closed on 25th March for Holi.', date: '2024-03-18', type: 'Info', targetRoles: ['admin', 'teacher', 'student', 'parent'] },
  ]);
  
  // Hostel State
  const [hostelRooms, setHostelRooms] = useState<HostelRoom[]>([]);
  const [hostelBeds, setHostelBeds] = useState<HostelBed[]>([]);
  const [hostelStaff, setHostelStaff] = useState<HostelStaff[]>([]);
  const [hostelAttendance, setHostelAttendance] = useState<HostelAttendance[]>([]);
  
  const [staff, setStaff] = useState<Staff[]>([
    {
      id: 'STF-1001',
      name: 'John',
      surname: 'Doe',
      role: 'Teacher',
      department: 'Academic',
      designation: 'Senior Teacher',
      email: 'john.doe@school.com',
      mobile: '9876543210',
      status: 'Active',
      joiningDate: '2022-01-15'
    },
    {
      id: 'STF-1002',
      name: 'Sarah',
      surname: 'Wilson',
      role: 'Admin',
      department: 'Administration',
      designation: 'Admin Head',
      email: 'sarah.w@school.com',
      mobile: '9876543211',
      status: 'Active',
      joiningDate: '2021-06-20'
    }
  ]);
  const [departments, setDepartments] = useState<Department[]>([
    { id: '1', name: 'Academic' },
    { id: '2', name: 'Administration' },
    { id: '3', name: 'Library' },
    { id: '4', name: 'Hostel' }
  ]);
  const [designations, setDesignations] = useState<Designation[]>([
    { id: '1', name: 'Teacher' },
    { id: '2', name: 'Principal' },
    { id: '3', name: 'Librarian' },
    { id: '4', name: 'Warden' }
  ]);
  const [staffLeaveRequests, setStaffLeaveRequests] = useState<any[]>([
    { id: '1', staffId: 'STF-1001', staffName: 'John Doe', startDate: '2024-03-25', endDate: '2024-03-26', reason: 'Personal work', status: 'Pending' },
    { id: '2', staffId: 'STF-1002', staffName: 'Sarah Wilson', startDate: '2024-03-22', endDate: '2024-03-22', reason: 'Medical', status: 'Approved' }
  ]);
  const [admissionEnquiries, setAdmissionEnquiries] = useState<AdmissionEnquiry[]>([
    {
      id: 'ENQ-1',
      name: 'Robert',
      surname: 'Brown',
      mobile: '9988776655',
      email: 'robert@example.com',
      class: 'Class 5',
      source: 'Website',
      date: '2024-03-20',
      status: 'Pending'
    },
    {
      id: 'ENQ-2',
      name: 'Emily',
      surname: 'Davis',
      mobile: '9988776656',
      email: 'emily@example.com',
      class: 'Class 8',
      source: 'Walk-in',
      date: '2024-03-22',
      status: 'Follow-up'
    }
  ]);
  const [incomes, setIncomes] = useState<Income[]>([
    { id: '1', name: 'Annual Donation', incomeHead: 'Donation', invoiceNumber: 'INC-001', date: '2024-03-15', amount: 50000, description: 'Donation from Alumni Association' },
    { id: '2', name: 'Government Aid', incomeHead: 'Aid Received', invoiceNumber: 'INC-002', date: '2024-03-18', amount: 120000, description: 'Quarterly government education grant' },
    { id: '3', name: 'Local Business Sponsorship', incomeHead: 'Donation', invoiceNumber: 'INC-003', date: '2024-03-20', amount: 25000, description: 'Sponsorship for sports day' }
  ]);
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', name: 'Electricity Bill', expenseHead: 'Utility', invoiceNumber: 'EXP-001', date: '2024-03-10', amount: 15000, description: 'Monthly electricity bill for March' },
    { id: '2', name: 'Stationery Purchase', expenseHead: 'Office Supplies', invoiceNumber: 'EXP-002', date: '2024-03-12', amount: 5000, description: 'Bulk purchase of notebooks and pens' },
    { id: '3', name: 'Lab Equipment Repair', expenseHead: 'Maintenance', invoiceNumber: 'EXP-003', date: '2024-03-22', amount: 8500, description: 'Repair of microscope and centrifuge' }
  ]);
  const [incomeHeads, setIncomeHeads] = useState<IncomeHead[]>([
    { id: '1', name: 'Donation', description: 'Donations from various sources' },
    { id: '2', name: 'Aid Received', description: 'Government or NGO aid' },
    { id: '3', name: 'Event Revenue', description: 'Revenue from school events' }
  ]);
  const [expenseHeads, setExpenseHeads] = useState<ExpenseHead[]>([
    { id: '1', name: 'Utility', description: 'Electricity, Water, etc.' },
    { id: '2', name: 'Office Supplies', description: 'Stationery, Printing, etc.' },
    { id: '3', name: 'Maintenance', description: 'Building and equipment repairs' }
  ]);
  const [visitors, setVisitors] = useState<Visitor[]>([
    { id: '1', name: 'Michael Scott', mobile: '9876543210', purpose: 'Meeting with Principal', date: '2024-03-24', inTime: '10:00 AM', outTime: '11:00 AM' },
    { id: '2', name: 'Dwight Schrute', mobile: '9876543211', purpose: 'Admission Enquiry', date: '2024-03-24', inTime: '11:30 AM' }
  ]);
  const [complaints, setComplaints] = useState<Complaint[]>([
    { id: '1', type: 'Infrastructure', source: 'Parent', name: 'Jim Halpert', mobile: '9876543212', date: '2024-03-23', description: 'Broken chair in Class 5A', status: 'Pending' },
    { id: '2', type: 'Academic', source: 'Student', name: 'Pam Beesly', mobile: '9876543213', date: '2024-03-22', description: 'Library books not available', status: 'Resolved', actionTaken: 'New books ordered' }
  ]);
  const [communicationTemplates, setCommunicationTemplates] = useState<CommunicationTemplate[]>([
    { id: '1', name: 'Fee Reminder', subject: 'Fee Payment Due', body: 'Dear Parent, your child\'s fee is due. Please pay at the earliest.', type: 'Email' },
    { id: '2', name: 'Holiday Notice', subject: 'School Holiday', body: 'School will remain closed tomorrow due to public holiday.', type: 'WhatsApp' }
  ]);
  const [userLogs, setUserLogs] = useState<any[]>([
    { id: '1', timestamp: new Date().toLocaleString(), user: 'Admin User', action: 'Logged in to system', ip: '192.168.1.1' },
    { id: '2', timestamp: new Date(Date.now() - 3600000).toLocaleString(), user: 'Teacher Rajesh', action: 'Marked attendance for Class 10A', ip: '192.168.1.45' },
    { id: '3', timestamp: new Date(Date.now() - 7200000).toLocaleString(), user: 'Admin User', action: 'Updated school profile', ip: '192.168.1.1' },
    { id: '4', timestamp: new Date(Date.now() - 86400000).toLocaleString(), user: 'Parent DS-12345', action: 'Viewed fee structure', ip: '172.16.0.12' },
  ]);
  
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([
    { id: '1', title: 'Holi Celebration', date: '2024-03-25', type: 'festival', icon: '🎨', color: 'bg-orange-100 text-orange-700' },
    { id: '2', title: 'Eid-ul-Fitr', date: '2024-04-10', type: 'festival', icon: '🌙', color: 'bg-emerald-100 text-emerald-700' },
    { id: '3', title: 'Christmas', date: '2024-12-25', type: 'festival', icon: '🎅', color: 'bg-red-100 text-red-700' },
    { id: '4', title: 'Navratri', date: '2024-10-03', type: 'festival', icon: '🕉️', color: 'bg-pink-100 text-pink-700' },
    { id: '5', title: 'Ram Navmi', date: '2024-04-17', type: 'festival', icon: '🏹', color: 'bg-yellow-100 text-yellow-700' },
    { id: '6', title: 'Guru Gobind Singh Jayanti', date: '2024-01-17', type: 'festival', icon: '☬', color: 'bg-blue-100 text-blue-700' },
    { id: '7', title: 'PTM - Term 1', date: '2024-05-15', type: 'ptm', color: 'bg-indigo-100 text-indigo-700' },
    { id: '8', title: 'Final Examination', date: '2024-03-10', type: 'examination', color: 'bg-purple-100 text-purple-700' },
  ]);

  // Modal State
  const [modal, setModal] = useState<{ isOpen: boolean, title: string, message: string, onConfirm?: () => void } | null>(null);

  useEffect(() => {
    if (students.length === 0) {
      const indianStudents: Student[] = [
        { 
          id: '1', studentId: 'DS-100001', name: 'Aarav', surname: 'Sharma', class: 'Class 1', section: 'A', gender: 'Male', address: 'New Delhi', category: 'General', religion: 'Hinduism', caste: 'Brahmin',
          fatherName: 'Rajesh Sharma', motherName: 'Sunita Sharma', fatherMobile: '9876543210', motherMobile: '9876543211', bloodGroup: 'A+', emergencyContact: '9876543212', localGuardianContact: '9876543213', email: 'aarav@example.com', allergy: 'None', hasDisability: false, disabilityDetails: '', relationInSchool: { name: '', class: '', section: '' },
          photo: 'https://picsum.photos/seed/aarav/200'
        },
        { 
          id: '2', studentId: 'DS-100002', name: 'Vihaan', surname: 'Gupta', class: 'Class 2', section: 'B', gender: 'Male', address: 'Mumbai', category: 'General', religion: 'Hinduism', caste: 'Vaishya',
          fatherName: 'Amit Gupta', motherName: 'Neha Gupta', fatherMobile: '9876543214', motherMobile: '9876543215', bloodGroup: 'B+', emergencyContact: '9876543216', localGuardianContact: '9876543217', email: 'vihaan@example.com', allergy: 'None', hasDisability: false, disabilityDetails: '', relationInSchool: { name: '', class: '', section: '' },
          photo: 'https://picsum.photos/seed/vihaan/200'
        },
        { 
          id: '3', studentId: 'DS-100003', name: 'Advik', surname: 'Verma', class: 'Class 3', section: 'C', gender: 'Male', address: 'Bangalore', category: 'OBC', religion: 'Hinduism', caste: 'Kshatriya',
          fatherName: 'Sanjay Verma', motherName: 'Meera Verma', fatherMobile: '9876543218', motherMobile: '9876543219', bloodGroup: 'O+', emergencyContact: '9876543220', localGuardianContact: '9876543221', email: 'advik@example.com', allergy: 'None', hasDisability: false, disabilityDetails: '', relationInSchool: { name: '', class: '', section: '' },
          photo: 'https://picsum.photos/seed/advik/200'
        },
        { 
          id: '4', studentId: 'DS-100004', name: 'Ananya', surname: 'Iyer', class: 'Class 4', section: 'D', gender: 'Female', address: 'Chennai', category: 'General', religion: 'Hinduism', caste: 'Brahmin',
          fatherName: 'Subramanian Iyer', motherName: 'Lakshmi Iyer', fatherMobile: '9876543222', motherMobile: '9876543223', bloodGroup: 'AB+', emergencyContact: '9876543224', localGuardianContact: '9876543225', email: 'ananya@example.com', allergy: 'None', hasDisability: false, disabilityDetails: '', relationInSchool: { name: '', class: '', section: '' },
          photo: 'https://picsum.photos/seed/ananya/200'
        },
        { 
          id: '5', studentId: 'DS-100005', name: 'Ishani', surname: 'Reddy', class: 'Class 5', section: 'A', gender: 'Female', address: 'Hyderabad', category: 'General', religion: 'Hinduism', caste: 'Reddy',
          fatherName: 'Venkat Reddy', motherName: 'Kavitha Reddy', fatherMobile: '9876543226', motherMobile: '9876543227', bloodGroup: 'A-', emergencyContact: '9876543228', localGuardianContact: '9876543229', email: 'ishani@example.com', allergy: 'None', hasDisability: false, disabilityDetails: '', relationInSchool: { name: '', class: '', section: '' },
          photo: 'https://picsum.photos/seed/ishani/200'
        },
      ];
      setStudents(indianStudents);
    }

    if (hostelRooms.length === 0) {
      const initialRooms: HostelRoom[] = [
        { id: '1', roomNumber: '101', floor: '1st', type: 'AC', category: 'Deluxe', capacity: 2, gender: 'Male', price: 5000 },
        { id: '2', roomNumber: '102', floor: '1st', type: 'Non-AC', category: 'Standard', capacity: 4, gender: 'Male', price: 3000 },
        { id: '3', roomNumber: '201', floor: '2nd', type: 'AC', category: 'Deluxe', capacity: 2, gender: 'Female', price: 5500 },
      ];
      setHostelRooms(initialRooms);
      
      const initialBeds: HostelBed[] = [
        { id: '1', roomId: '1', bedNumber: '101-A', status: 'Occupied', studentId: 'DS-100001' },
        { id: '2', roomId: '1', bedNumber: '101-B', status: 'Available' },
        { id: '3', roomId: '2', bedNumber: '102-A', status: 'Occupied', studentId: 'DS-100002' },
        { id: '4', roomId: '2', bedNumber: '102-B', status: 'Available' },
        { id: '5', roomId: '2', bedNumber: '102-C', status: 'Available' },
        { id: '6', roomId: '2', bedNumber: '102-D', status: 'Available' },
      ];
      setHostelBeds(initialBeds);
    }
  }, []);

  const showModal = (title: string, message: string, onConfirm?: () => void) => {
    setModal({ isOpen: true, title, message, onConfirm });
  };

  const handleProfileUpdate = (updates: any) => {
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    
    if (updates.password) {
      setUserLogs(prev => [{
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        user: currentUser.name,
        action: 'Password Reset',
        details: `Password changed to: ${updates.password}`,
        ip: '192.168.1.1'
      }, ...prev]);
    }
    
    alert('Profile updated successfully!');
  };

  // Master Data Handlers
  const addMasterItem = (key: string, value: string) => {
    if (!value) return;
    setMasterData(prev => ({
      ...prev,
      [key]: [...(prev as any)[key], value]
    }));
  };

  const deleteMasterItem = (key: string, index: number) => {
    setMasterData(prev => ({
      ...prev,
      [key]: (prev as any)[key].filter((_: any, i: number) => i !== index)
    }));
  };

  const editMasterItem = (key: string, index: number, newValue: string) => {
    if (!newValue) return;
    setMasterData(prev => ({
      ...prev,
      [key]: (prev as any)[key].map((v: any, i: number) => i === index ? newValue : v)
    }));
  };

  const generateCredentials = (type: 'Student' | 'Teacher', count: number = 1) => {
    const newCreds = [];
    for (let i = 0; i < count; i++) {
      const id = (type === 'Student' ? 'STU' : 'TCH') + Math.floor(10000 + Math.random() * 90000);
      const password = Math.random().toString(36).slice(-8);
      newCreds.push({ type, id, password, date: new Date().toLocaleString() });
    }
    setGeneratedCredentials(prev => [...prev, ...newCreds]);
  };

  // Login State
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isQRLogin, setIsQRLogin] = useState(false);

  const handleLogin = (e?: React.FormEvent, scannedId?: string) => {
    if (e) e.preventDefault();
    const id = scannedId || loginId;

    // Super Admin Check
    if (id === 'DC0018' && loginPassword === 'Durgamaa@18') {
      setLoginError('');
      const superAdmin = users.find(u => u.id === 'DC0018');
      setCurrentUser(superAdmin);
      setView('dashboard');
      return;
    }

    const user = users.find(u => u.id === id);
    const isValidPassword = user && (scannedId || loginPassword === (user.password || '12345678') || loginPassword === '12345');

    if (user && isValidPassword) {
      setLoginError('');
      setCurrentUser(user);
      if (user.role === 'admin' || user.role === 'super-admin') setView('dashboard');
      else if (user.role === 'teacher') setView('teacher-panel');
      else if (user.role === 'parent') setView('parent-panel');
      else if (user.role === 'warden') setView('hostel');
      else setView('dashboard');
    } else if (id === schoolProfile.wardenPanelId && (scannedId || loginPassword === schoolProfile.wardenPanelPassword)) {
      setLoginError('');
      setCurrentUser({ role: 'warden', name: 'Hostel Warden' });
      setView('hostel');
    } else if (id.startsWith('TCH-')) {
      // Mock teacher login for new IDs
      setLoginError('');
      const teacherName = 'Teacher ' + id.split('-')[1];
      const newUser = { id: id, name: teacherName, role: 'teacher', permissions: ['attendance', 'homework', 'syllabus', 'leaves'] };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      setView('teacher-panel');
    } else if (id.startsWith('PAR-')) {
      // Mock parent login - linked to a student
      const studentId = id.replace('PAR-', 'DS-');
      const student = students.find(s => s.studentId === studentId);
      if (student) {
        setLoginError('');
        const newUser = { id: id, name: `Parent of ${student.name}`, role: 'parent', studentId: student.studentId, permissions: ['attendance', 'homework', 'syllabus', 'leaves', 'fees'] };
        setUsers([...users, newUser]);
        setCurrentUser(newUser);
        setView('parent-panel');
      } else {
        setLoginError('No student found for this parent ID.');
      }
    } else {
      // Check if it's a student ID
      const student = students.find(s => s.studentId === id);
      if (student) {
        setLoginError('');
        setCurrentUser({ role: 'student', ...student });
        setView('dashboard');
      } else {
        setLoginError('Invalid ID or Password. Please try again.');
      }
    }
  };

  const generateStudentId = () => {
    return 'DS-' + Math.floor(100000 + Math.random() * 900000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudentId) {
      const updatedStudents = students.map(s => 
        s.id === editingStudentId ? { ...formData, id: s.id, studentId: s.studentId } : s
      );
      setStudents(updatedStudents);
      showModal('Success', 'Student Details Updated Successfully!');
    } else {
      const newStudent = {
        ...formData,
        id: Date.now().toString(),
        studentId: generateStudentId(),
      };
      setStudents([...students, newStudent]);
      showModal('Success', `Student Registered Successfully! ID: ${newStudent.studentId}`);
    }
    setEditingStudentId(null);
    setFormData({});
    setView('dashboard');
  };

  if (view === 'login') {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 bg-cover bg-center relative"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop")' }}
      >
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-[2px]"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Central Logo Area */}
          <div className="text-center mb-10 relative">
            <div className="relative inline-block">
              <img 
                src={schoolProfile.logo} 
                alt="Digital School Systems Logo" 
                className="w-64 md:w-80 h-auto drop-shadow-2xl mx-auto"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="login-glass rounded-[32px] overflow-hidden shadow-2xl border-white/40">
            <div className="bg-linear-to-b from-primary/10 to-transparent py-8 text-center border-b border-white/20">
              <h2 className="text-xl font-bold text-text-heading tracking-tight">Portal Access</h2>
              <p className="text-slate-500 font-medium text-xs mt-1 uppercase tracking-widest">Secure Login for Students & Staff</p>
            </div>

            <div className="p-8 space-y-5">
              <div className="flex gap-4 p-1 bg-slate-100 rounded-xl mb-4">
                <button 
                  onClick={() => setIsQRLogin(false)}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${!isQRLogin ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
                >
                  ID/Password
                </button>
                <button 
                  onClick={() => setIsQRLogin(true)}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${isQRLogin ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
                >
                  QR Login
                </button>
              </div>

              {!isQRLogin ? (
                <form onSubmit={(e) => handleLogin(e)} className="space-y-5">
                  <div className="space-y-1">
                    <div className="relative">
                      <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                      <input 
                        type="text" 
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white/90 placeholder:text-slate-400 text-base font-medium" 
                        placeholder="Username"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        className="w-full pl-12 pr-12 py-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white/90 placeholder:text-slate-400 text-base font-medium" 
                        placeholder="Password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                      >
                        {showPassword ? <Eye size={20} /> : <ScanLine size={20} />}
                      </button>
                    </div>
                  </div>

                  {loginError && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 flex items-center gap-2"
                    >
                      <AlertCircle size={18} />
                      {loginError}
                    </motion.div>
                  )}

                  <button 
                    type="submit"
                    className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-wider"
                  >
                    Enter Dashboard
                  </button>

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input type="checkbox" className="peer sr-only" />
                        <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                        <CheckCircle2 className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" size={14} />
                      </div>
                      <span className="text-sm font-semibold text-slate-600 group-hover:text-primary transition-colors">Remember Me</span>
                    </label>
                    <button type="button" className="text-sm font-bold text-primary hover:underline">Forgot Password?</button>
                  </div>
                </form>
              ) : (
                <div className="space-y-5">
                  <div className="relative aspect-square bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-200">
                    <div id="login-qr-reader" className="w-full h-full"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <div className="w-48 h-48 border-2 border-primary/50 rounded-2xl border-dashed animate-pulse"></div>
                      <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Scan your ID Card QR</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const scanner = new Html5Qrcode("login-qr-reader");
                      scanner.start(
                        { facingMode: "user" },
                        { fps: 10, qrbox: 250 },
                        (decodedText) => {
                          handleLogin(undefined, decodedText);
                          scanner.stop();
                        },
                        () => {}
                      );
                    }}
                    className="w-full bg-secondary text-white py-4 rounded-xl font-black text-lg shadow-xl shadow-secondary/30 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <QrCode size={24} /> Start QR Scanner
                  </button>
                </div>
              )}
            </div>

            <div className="bg-primary/5 py-4 text-center border-t border-white/20">
              <p className="text-[10px] text-text-heading/60 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                <span className="w-8 h-[1px] bg-primary/20"></span>
                Powered by <span className="text-primary">JOSHODA</span>
                <span className="w-8 h-[1px] bg-primary/20"></span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[100] lg:relative lg:z-0
        ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full lg:w-24 lg:translate-x-0'} 
        bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out overflow-hidden
      `}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-50">
          <div className="shrink-0">
            <img 
              src={schoolProfile.logo || 'https://images.unsplash.com/photo-1594608661623-aa0bd3a67d28?q=80&w=200&auto=format&fit=crop'} 
              alt="Logo" 
              className={`${isSidebarOpen ? 'w-12' : 'w-10'} h-auto transition-all`}
              referrerPolicy="no-referrer"
            />
          </div>
          {isSidebarOpen && (
            <div className="overflow-hidden whitespace-nowrap">
              <h2 className="font-black text-sm leading-tight text-primary tracking-tighter">DIGITAL SCHOOL</h2>
              <p className="text-[9px] text-secondary font-bold uppercase tracking-widest">SYSTEMS</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar scrollbar-left pb-10">
          <SidebarItem 
            icon={LayoutDashboard} 
            label={isSidebarOpen ? "Dashboard" : ""} 
            active={view === 'dashboard'} 
            onClick={() => setView('dashboard')} 
          />
          {currentUser?.role === 'teacher' && (
            <SidebarItem 
              icon={UserCog} 
              label={isSidebarOpen ? "Teacher Panel" : ""} 
              active={view === 'teacher-panel'} 
              onClick={() => setView('teacher-panel')} 
            />
          )}
          {currentUser?.role === 'parent' && (
            <SidebarItem 
              icon={Users} 
              label={isSidebarOpen ? "Parent Portal" : ""} 
              active={view === 'parent-panel'} 
              onClick={() => setView('parent-panel')} 
            />
          )}
          {currentUser?.role === 'admin' && (
            <>
              <SidebarItem 
                icon={BarChart3} 
                label={isSidebarOpen ? "Admin 360" : ""} 
                active={view === 'admin-360'} 
                onClick={() => setView('admin-360')} 
              />
              <SidebarItem 
                icon={Users} 
                label={isSidebarOpen ? "Class 360" : ""} 
                active={view === 'class-360'} 
                onClick={() => setView('class-360')} 
              />
              <SidebarItem 
                icon={UserPlus} 
                label={isSidebarOpen ? "Register Student" : ""} 
                active={view === 'register-student'} 
                onClick={() => {
                  setEditingStudentId(null);
                  setIsViewOnly(false);
                  setFormData({});
                  setView('register-student');
                }} 
              />
              <SidebarItem 
                icon={Users} 
                label={isSidebarOpen ? "Student List" : ""} 
                active={view === 'student-list'} 
                onClick={() => setView('student-list')} 
              />
              <SidebarItem 
                icon={Receipt} 
                label={isSidebarOpen ? "Fee Management" : ""} 
                active={view === 'fee-management'} 
                onClick={() => setView('fee-management')} 
              />
              <SidebarItem 
                icon={Wallet} 
                label={isSidebarOpen ? "Due Fees" : ""} 
                active={view === 'due-fees'} 
                onClick={() => setView('due-fees')} 
              />
              <SidebarItem 
                icon={CalendarRange} 
                label={isSidebarOpen ? "Leave Management" : ""} 
                active={view === 'leave-management'} 
                onClick={() => setView('leave-management')} 
              />
              <SidebarItem 
                icon={UserCog} 
                label={isSidebarOpen ? "Role Assign" : ""} 
                active={view === 'role-assign'} 
                onClick={() => setView('role-assign')} 
              />
              <SidebarItem 
                icon={Building2} 
                label={isSidebarOpen ? "Front Office" : ""} 
                active={view === 'front-office'} 
                onClick={() => setView('front-office')} 
              />
              <SidebarItem 
                icon={UserCog} 
                label={isSidebarOpen ? "Human Resource" : ""} 
                active={view === 'human-resource'} 
                onClick={() => setView('human-resource')} 
              />
              <SidebarItem 
                icon={MessageCircle} 
                label={isSidebarOpen ? "Communicate" : ""} 
                active={view === 'communicate'} 
                onClick={() => setView('communicate')} 
              />
              <SidebarItem 
                icon={Coins} 
                label={isSidebarOpen ? "Income & Expense" : ""} 
                active={view === 'income-expense'} 
                onClick={() => setView('income-expense')} 
              />
              <SidebarItem 
                icon={ShieldCheck} 
                label={isSidebarOpen ? "User Logs" : ""} 
                active={view === 'user-logs'} 
                onClick={() => setView('user-logs')} 
              />
            </>
          )}
          {currentUser?.role === 'student' && (
            <SidebarItem 
              icon={Wallet} 
              label={isSidebarOpen ? "My Due Fees" : ""} 
              active={view === 'due-fees'} 
              onClick={() => setView('due-fees')} 
            />
          )}
          {currentUser?.role === 'super-admin' && (
            <SidebarItem 
              icon={ShieldCheck} 
              label={isSidebarOpen ? "Super Admin Panel" : ""} 
              active={view === 'super-admin-panel'} 
              onClick={() => setView('super-admin-panel')} 
            />
          )}
          <SidebarItem 
            icon={BookOpen} 
            label={isSidebarOpen ? "Academics" : ""} 
            active={view === 'academics'} 
            onClick={() => setView('academics')} 
          />
          <SidebarItem 
            icon={UserCheck} 
            label={isSidebarOpen ? "Attendance" : ""} 
            active={view === 'attendance'} 
            onClick={() => setView('attendance')} 
          />
          <SidebarItem 
            icon={ClipboardList} 
            label={isSidebarOpen ? "Examination" : ""} 
            active={view === 'examination'} 
            onClick={() => setView('examination')} 
          />
          <SidebarItem 
            icon={UserPlus} 
            label={isSidebarOpen ? "ID Cards & Certs" : ""} 
            active={view === 'id-cards'} 
            onClick={() => setView('id-cards')} 
          />
          <SidebarItem 
            icon={Home} 
            label={isSidebarOpen ? "Hostel" : ""} 
            active={view === 'hostel'} 
            onClick={() => setView('hostel')} 
          />
          <SidebarItem 
            icon={Camera} 
            label={isSidebarOpen ? "Live Camera" : ""} 
            active={view === 'live-camera'} 
            onClick={() => setView('live-camera')} 
          />
          <SidebarItem 
            icon={Calendar} 
            label={isSidebarOpen ? "Calendar" : ""} 
            active={view === 'calendar'} 
            onClick={() => setView('calendar')} 
          />
          <SidebarItem 
            icon={BarChart3} 
            label={isSidebarOpen ? "Reports" : ""} 
            active={view === 'reports'} 
            onClick={() => setView('reports')} 
          />
          <SidebarItem 
            icon={Settings} 
            label={isSidebarOpen ? "Settings" : ""} 
            active={view === 'settings'} 
            onClick={() => setView('settings')} 
          />
          <div className="mt-auto p-4 text-center border-t border-slate-100">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">A Digital Communique Product</p>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => setView('login')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
        <div className="p-4 text-center border-t border-slate-50">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">A Digital Communique Product</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full pb-20 lg:pb-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-text-secondary"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 lg:hidden">
              <img 
                src={schoolProfile.logo || 'https://images.unsplash.com/photo-1594608661623-aa0bd3a67d28?q=80&w=200&auto=format&fit=crop'} 
                alt="Logo" 
                className="w-8 h-8 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search students, records..." 
                className="bg-slate-100 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 relative">
            <button className="p-2 hover:bg-slate-100 rounded-full text-text-secondary relative hidden sm:block">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-warning rounded-full border-2 border-white"></span>
            </button>
            <div 
              className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-slate-200 cursor-pointer hover:bg-slate-50 p-1 rounded-xl transition-all"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold">{currentUser?.name || 'Admin User'}</p>
                <p className="text-[10px] text-text-secondary uppercase">{currentUser?.role === 'admin' ? 'Super Admin' : currentUser?.role}</p>
              </div>
              <img 
                src={currentUser?.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.id || 'admin'}`} 
                alt="Avatar" 
                className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-100 object-cover"
              />
            </div>

            {showProfileMenu && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-[110] overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-50">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account</p>
                </div>
                <button 
                  onClick={() => {
                    setView('profile-settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-all"
                >
                  <User size={18} className="text-primary" />
                  <span>Profile Settings</span>
                </button>
                <button 
                  onClick={() => {
                    setCurrentUser(null);
                    setView('login');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {view === 'profile-settings' && (
              <motion.div key="profile-settings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-black text-text-heading tracking-tight uppercase">Profile Settings</h1>
                      <p className="text-text-sub font-medium">Update your personal information and security settings.</p>
                    </div>
                  </div>

                  <Card className="p-8">
                    <div className="flex flex-col items-center mb-10">
                      <div className="relative group">
                        <img 
                          src={currentUser?.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.id || 'admin'}`} 
                          alt="Profile" 
                          className="w-32 h-32 rounded-[2.5rem] bg-slate-100 object-cover border-4 border-white shadow-xl"
                        />
                        <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-all">
                          <Camera size={20} />
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  handleProfileUpdate({ photo: reader.result });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                      <h3 className="mt-4 text-xl font-black text-text-heading uppercase tracking-tight">{currentUser?.name}</h3>
                      <p className="text-text-sub text-sm font-bold uppercase tracking-widest">{currentUser?.role}</p>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input 
                          label="Full Name" 
                          value={currentUser?.name} 
                          onChange={(e: any) => handleProfileUpdate({ name: e.target.value })} 
                        />
                        <Input 
                          label="User ID" 
                          value={currentUser?.id} 
                          disabled 
                        />
                      </div>

                      <div className="pt-6 border-t border-slate-100">
                        <h4 className="text-sm font-black text-text-heading uppercase tracking-widest mb-4">Security Settings</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                          <Input 
                            label="New Password" 
                            type="password" 
                            placeholder="Enter new password"
                            id="new-password-input"
                          />
                          <button 
                            onClick={() => {
                              const pass = (document.getElementById('new-password-input') as HTMLInputElement).value;
                              if (pass.length < 5) {
                                alert('Password must be at least 5 characters long');
                                return;
                              }
                              handleProfileUpdate({ password: pass });
                              (document.getElementById('new-password-input') as HTMLInputElement).value = '';
                            }}
                            className="btn-primary py-4"
                          >
                            Update Password
                          </button>
                        </div>
                        <p className="mt-2 text-[10px] text-text-sub italic">Note: Password changes are logged for security auditing by super admins.</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}

            {view === 'user-logs' && (
              <motion.div key="user-logs" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="space-y-8">
                  <div>
                    <h1 className="text-3xl font-black text-text-heading tracking-tight uppercase">User Activity Logs</h1>
                    <p className="text-text-sub font-medium">Monitor sensitive actions and security events across the system.</p>
                  </div>

                  <Card className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-[10px] font-bold text-text-secondary uppercase tracking-wider border-b border-slate-200">
                            <th className="pb-4 px-4">Timestamp</th>
                            <th className="pb-4 px-4">User</th>
                            <th className="pb-4 px-4">Action</th>
                            <th className="pb-4 px-4">Details</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {userLogs.map((log: any) => (
                            <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50 transition-all">
                              <td className="py-4 px-4 font-mono text-xs text-text-sub">{log.timestamp}</td>
                              <td className="py-4 px-4">
                                <div className="font-bold">{log.user || log.userName}</div>
                                {log.userId && <div className="text-[10px] text-text-sub uppercase tracking-widest">{log.userId}</div>}
                              </td>
                              <td className="py-4 px-4">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                  log.action === 'Password Reset' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {log.action}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-text-sub">{log.details || log.ip || 'N/A'}</td>
                            </tr>
                          ))}
                          {userLogs.length === 0 && (
                            <tr>
                              <td colSpan={4} className="py-12 text-center text-text-sub font-medium italic">No logs recorded yet.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}
            {view === 'super-admin-panel' && (
              <SuperAdminPanel users={users} setUsers={setUsers} />
            )}
            {view === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold">Welcome Back! 🌿</h1>
                    <p className="text-text-secondary">Here's what's happening in your school today.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingStudentId(null);
                      setFormData({});
                      setView('register-student');
                    }} 
                    className="btn-primary flex items-center gap-2"
                  >
                    <UserPlus size={20} />
                    New Registration
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Students', value: students.length + 1240, icon: Users, color: 'bg-primary' },
                    { label: 'Attendance', value: '94%', icon: CheckCircle2, color: 'bg-secondary' },
                    { label: 'Pending Fees', value: '12', icon: AlertCircle, color: 'bg-accent' },
                    { label: 'New Admissions', value: students.length, icon: GraduationCap, color: 'bg-purple-600' },
                  ].map((stat, i) => (
                    <Card key={i} className="flex items-center gap-4 p-6">
                      <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg shadow-black/5`}>
                        <stat.icon size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] text-text-sub uppercase font-bold tracking-wider">{stat.label}</p>
                        <p className="text-2xl font-bold text-text-heading">{stat.value}</p>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Sparkles size={20} className="text-primary" />
                    Quick Access
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                      { label: 'Attendance', icon: UserCheck, view: 'attendance', color: 'bg-blue-500' },
                      { label: 'Fees', icon: Wallet, view: 'fee-management', color: 'bg-green-500' },
                      { label: 'Early Leave', icon: CalendarRange, view: 'leave-management', color: 'bg-purple-500' },
                      { label: 'Homework', icon: BookOpen, view: 'teacher-panel', color: 'bg-orange-500' },
                      { label: 'Hostel', icon: Bed, view: 'hostel', color: 'bg-rose-500' },
                    ].map((shortcut, i) => (
                      <button 
                        key={i} 
                        onClick={() => setView(shortcut.view as any)}
                        className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                      >
                        <div className={`w-12 h-12 ${shortcut.color} rounded-xl flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform`}>
                          <shortcut.icon size={24} />
                        </div>
                        <span className="text-xs font-bold text-text-secondary">{shortcut.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <Card className="lg:col-span-2">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <Users size={20} className="text-primary" />
                      Recent Registrations
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-xs text-text-secondary uppercase border-b border-slate-100">
                            <th className="pb-4 font-bold">Student</th>
                            <th className="pb-4 font-bold">ID</th>
                            <th className="pb-4 font-bold">Class</th>
                            <th className="pb-4 font-bold">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {students.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="py-8 text-center text-text-secondary italic">No recent registrations</td>
                            </tr>
                          ) : (
                            students.slice(-5).reverse().map((s) => (
                              <tr key={s.id} className="text-sm">
                                <td className="py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-primary font-bold">
                                      {s.name[0]}
                                    </div>
                                    <span className="font-medium">{s.name} {s.surname}</span>
                                  </div>
                                </td>
                                <td className="py-4 font-mono text-xs">{s.studentId}</td>
                                <td className="py-4">{s.class} - {s.section}</td>
                                <td className="py-4">
                                  <span className="px-2 py-1 bg-green-100 text-green-600 rounded-md text-[10px] font-bold uppercase">Active</span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card>

                  <Card>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold">School Calendar</h3>
                      <button onClick={() => setView('calendar')} className="text-xs font-bold text-primary hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                      {calendarEvents
                        .filter(e => new Date(e.date) >= new Date())
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .slice(0, 3)
                        .map((event, i) => (
                        <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-[10px] font-black text-primary uppercase tracking-wider">{event.type}</p>
                            {event.icon && <span className="text-sm">{event.icon}</span>}
                          </div>
                          <p className="font-bold text-sm text-text-heading">{event.title}</p>
                          <p className="text-[10px] text-text-sub mt-1 flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      ))}
                      {calendarEvents.length === 0 && (
                        <p className="text-center py-8 text-text-sub italic text-sm">No upcoming events</p>
                      )}
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}

            {view === 'register-student' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-5xl mx-auto"
              >
                <div className="mb-8">
                  <h1 className="text-3xl font-bold">{editingStudentId ? 'Edit Student Details' : 'Student Registration'}</h1>
                  <p className="text-text-secondary">{editingStudentId ? 'Update the details below.' : 'Fill in the details to enroll a new student.'}</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-8">
                  {/* Basic Information */}
                  <Card className={isViewOnly ? "pointer-events-none opacity-90" : ""}>
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                      <Users size={20} />
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex gap-2">
                        <div className="w-1/3">
                          <Select 
                            label="Title" 
                            options={masterData.titles} 
                            value={formData.title || ''}
                            onChange={(e: any) => setFormData({...formData, title: e.target.value})} 
                          />
                        </div>
                        <div className="flex-1">
                          <Input 
                            label="First Name" 
                            required 
                            value={formData.name || ''}
                            onChange={(e: any) => setFormData({...formData, name: e.target.value})} 
                          />
                        </div>
                      </div>
                      <Input 
                        label="Surname" 
                        required 
                        value={formData.surname || ''}
                        onChange={(e: any) => setFormData({...formData, surname: e.target.value})} 
                      />
                      <Select 
                        label="Class" 
                        options={masterData.classes} 
                        required 
                        value={formData.class || ''}
                        onChange={(e: any) => setFormData({...formData, class: e.target.value})} 
                      />
                      <Select 
                        label="Section" 
                        options={masterData.sections} 
                        required 
                        value={formData.section || ''}
                        onChange={(e: any) => setFormData({...formData, section: e.target.value})} 
                      />
                      <Select 
                        label="Caste" 
                        options={masterData.castes} 
                        value={formData.caste || ''}
                        onChange={(e: any) => setFormData({...formData, caste: e.target.value})} 
                      />
                      <Select 
                        label="Category" 
                        options={masterData.categories} 
                        value={formData.category || ''}
                        onChange={(e: any) => setFormData({...formData, category: e.target.value})} 
                      />
                      <Select 
                        label="Religion" 
                        options={masterData.religions} 
                        value={formData.religion || ''}
                        onChange={(e: any) => setFormData({...formData, religion: e.target.value})} 
                      />
                      <Select 
                        label="Gender" 
                        options={masterData.genders} 
                        required 
                        value={formData.gender || ''}
                        onChange={(e: any) => setFormData({...formData, gender: e.target.value})} 
                      />
                      <Select 
                        label="Blood Group" 
                        options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']} 
                        value={formData.bloodGroup || ''}
                        onChange={(e: any) => setFormData({...formData, bloodGroup: e.target.value})} 
                      />
                      <Input 
                        label="Email ID" 
                        type="email" 
                        value={formData.email || ''}
                        onChange={(e: any) => setFormData({...formData, email: e.target.value})} 
                      />
                    </div>
                  </Card>

                  {/* Family Details */}
                  <Card className={isViewOnly ? "pointer-events-none opacity-90" : ""}>
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                      <HeartPulse size={20} />
                      Family & Contact Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input 
                        label="Father's Name" 
                        required 
                        value={formData.fatherName || ''}
                        onChange={(e: any) => setFormData({...formData, fatherName: e.target.value})} 
                      />
                      <Input 
                        label="Mother's Name" 
                        required 
                        value={formData.motherName || ''}
                        onChange={(e: any) => setFormData({...formData, motherName: e.target.value})} 
                      />
                      <Input 
                        label="Father's Mobile Number" 
                        type="tel" 
                        required 
                        value={formData.fatherMobile || ''}
                        onChange={(e: any) => setFormData({...formData, fatherMobile: e.target.value})} 
                      />
                      <Input 
                        label="Mother's Mobile Number" 
                        type="tel" 
                        required 
                        value={formData.motherMobile || ''}
                        onChange={(e: any) => setFormData({...formData, motherMobile: e.target.value})} 
                      />
                      <Input 
                        label="Emergency Contact Number" 
                        type="tel" 
                        required 
                        value={formData.emergencyContact || ''}
                        onChange={(e: any) => setFormData({...formData, emergencyContact: e.target.value})} 
                      />
                      <Input 
                        label="Local Guardian Contact Number" 
                        type="tel" 
                        value={formData.localGuardianContact || ''}
                        onChange={(e: any) => setFormData({...formData, localGuardianContact: e.target.value})} 
                      />
                    </div>
                    <div className="mt-6">
                      <label className="label-text">Residential Address</label>
                      <textarea 
                        className="input-field min-h-[100px]" 
                        placeholder="Enter full address..."
                        value={formData.address || ''}
                        onChange={(e: any) => setFormData({...formData, address: e.target.value})}
                      ></textarea>
                    </div>
                  </Card>

                  {/* Health & Relations */}
                  <Card className={isViewOnly ? "pointer-events-none opacity-90" : ""}>
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                      <AlertCircle size={20} />
                      Health & School Relations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input 
                        label="Any Allergies?" 
                        placeholder="Mention if any..." 
                        value={formData.allergy || ''}
                        onChange={(e: any) => setFormData({...formData, allergy: e.target.value})} 
                      />
                      <div className="flex flex-col gap-4">
                        <Select 
                          label="Any Disability?" 
                          options={['No', 'Yes']} 
                          value={formData.hasDisability ? 'Yes' : 'No'}
                          onChange={(e: any) => setFormData({...formData, hasDisability: e.target.value === 'Yes'})} 
                        />
                        {formData.hasDisability && (
                          <Input 
                            label="Disability Details" 
                            placeholder="Please mention details..." 
                            required 
                            value={formData.disabilityDetails || ''}
                            onChange={(e: any) => setFormData({...formData, disabilityDetails: e.target.value})} 
                          />
                        )}
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                        <p className="text-sm font-bold text-text-secondary uppercase">Relation in School (Sibling/Relative)</p>
                        <div className="grid grid-cols-2 gap-4">
                          <Input 
                            label="Relation Name" 
                            placeholder="Name" 
                            value={formData.relationInSchool?.name || ''}
                            onChange={(e: any) => setFormData({
                              ...formData, 
                              relationInSchool: { ...formData.relationInSchool, name: e.target.value }
                            })}
                          />
                          <Input 
                            label="Class/Section" 
                            placeholder="e.g. 8-A" 
                            value={formData.relationInSchool?.classSection || ''}
                            onChange={(e: any) => setFormData({
                              ...formData, 
                              relationInSchool: { ...formData.relationInSchool, classSection: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Document Uploads */}
                  <Card>
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                      <FileText size={20} />
                      Document Uploads
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <FileUpload label="Student Photo" required />
                      <FileUpload label="Student Aadhaar Card" required />
                      <FileUpload label="Parents Documents" required />
                      <FileUpload label="Student Signature" icon={Signature} required />
                    </div>
                  </Card>

                  <div className="flex justify-end gap-4 pb-10">
                    <button 
                      type="button" 
                      onClick={() => {
                        setEditingStudentId(null);
                        setIsViewOnly(false);
                        setFormData({});
                        setView('student-list');
                      }}
                      className="px-6 py-2.5 rounded-xl font-medium text-text-secondary hover:bg-slate-200 transition-all"
                    >
                      {isViewOnly ? 'Back to List' : 'Cancel'}
                    </button>
                    {!isViewOnly && (
                      <button type="submit" className="btn-primary">
                        {editingStudentId ? 'Update Student' : 'Register Student'}
                      </button>
                    )}
                  </div>
                </form>
              </motion.div>
            )}

            {view === 'student-list' && (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-3xl font-bold">Student Directory</h1>
                    <p className="text-text-secondary">Manage and view all enrolled students.</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all flex items-center gap-2">
                      <FileText size={18} />
                      Export PDF
                    </button>
                    <button 
                      onClick={() => {
                        setEditingStudentId(null);
                        setFormData({});
                        setView('register-student');
                      }} 
                      className="btn-primary flex items-center gap-2"
                    >
                      <UserPlus size={20} />
                      Add New
                    </button>
                  </div>
                </div>

                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs text-text-secondary uppercase border-b border-slate-100">
                          <th className="pb-4 font-bold">Student ID</th>
                          <th className="pb-4 font-bold">Name</th>
                          <th className="pb-4 font-bold">Class</th>
                          <th className="pb-4 font-bold">QR Code</th>
                          <th className="pb-4 font-bold">Father's Name</th>
                          <th className="pb-4 font-bold">Contact</th>
                          <th className="pb-4 font-bold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {students.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-text-secondary italic">
                              No students found. Start by registering a new student.
                            </td>
                          </tr>
                        ) : (
                          students.map((s) => (
                            <tr key={s.id} className="text-sm hover:bg-slate-50/50 transition-all">
                              <td className="py-4 font-mono text-xs text-primary font-bold">{s.studentId}</td>
                              <td className="py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold overflow-hidden">
                                    {s.photo ? (
                                      <img src={s.photo} alt={s.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    ) : (
                                      s.name[0]
                                    )}
                                  </div>
                                  <span className="font-semibold">{s.name} {s.surname}</span>
                                </div>
                              </td>
                              <td className="py-4">{s.class} - {s.section}</td>
                              <td className="py-4">
                                <div className="w-10 h-10 bg-white border border-slate-200 p-1 rounded-lg">
                                  <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${s.studentId}`} 
                                    alt="QR" 
                                    className="w-full h-full object-contain"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              </td>
                              <td className="py-4">{s.fatherName}</td>
                              <td className="py-4">
                                <div className="flex items-center gap-1 text-text-secondary">
                                  <Phone size={14} />
                                  {s.fatherMobile}
                                </div>
                              </td>
                              <td className="py-4">
                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => {
                                      setEditingStudentId(s.id);
                                      setFormData(s);
                                      setIsViewOnly(true);
                                      setView('register-student');
                                    }}
                                    className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-all" 
                                    title="View Details"
                                  >
                                    <Eye size={18} />
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setEditingStudentId(s.id);
                                      setFormData(s);
                                      setIsViewOnly(false);
                                      setView('register-student');
                                    }}
                                    className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all" 
                                    title="Edit Student"
                                  >
                                    <Edit2 size={18} />
                                  </button>
                                  <button 
                                    onClick={() => {
                                      const nextClass = masterData.classes[masterData.classes.indexOf(s.class) + 1];
                                      if (!nextClass) {
                                        alert('This student is already in the highest class.');
                                        return;
                                      }
                                      showModal(
                                        'Promote Student',
                                        `Are you sure you want to promote ${s.name} from ${s.class} to ${nextClass}?`,
                                        () => {
                                          const updated = students.map(std => std.id === s.id ? { ...std, class: nextClass } : std);
                                          setStudents(updated);
                                          alert(`${s.name} promoted to ${nextClass}!`);
                                        }
                                      );
                                    }}
                                    className="p-2 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-all" 
                                    title="Promote Student"
                                  >
                                    <ArrowUpCircle size={18} />
                                  </button>
                                  <button 
                                    onClick={() => {
                                      showModal(
                                        'Confirm Delete', 
                                        `Are you sure you want to delete ${s.name}? This action cannot be undone.`,
                                        () => setStudents(students.filter(std => std.id !== s.id))
                                      );
                                    }}
                                    className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all" 
                                    title="Delete Student"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </motion.div>
            )}

            {view === 'attendance' && (
              <motion.div
                key="attendance"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Attendance 
                  students={students} 
                  attendance={attendance} 
                  setAttendance={setAttendance} 
                  masterData={masterData} 
                  currentUser={currentUser}
                />
              </motion.div>
            )}

            {view === 'live-camera' && (
              <motion.div
                key="live-camera"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <LiveCamera cameraUrls={schoolProfile.cameraUrls} />
              </motion.div>
            )}

            {view === 'teacher-panel' && (
              <motion.div key="teacher-panel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <TeacherPanel 
                  syllabuses={syllabuses} 
                  setSyllabuses={setSyllabuses} 
                  leaveRequests={leaveRequests} 
                  setLeaveRequests={setLeaveRequests} 
                  notifications={notifications}
                  currentUser={currentUser}
                  teacherAssignments={teacherAssignments}
                  activities={activities}
                  setActivities={setActivities}
                  masterData={{...masterData, students}}
                />
              </motion.div>
            )}

            {view === 'parent-panel' && (
              <motion.div key="parent-panel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <ParentPanel 
                  students={students}
                  examResults={examResults}
                  homeworks={homeworks}
                  syllabuses={syllabuses}
                  leaveRequests={leaveRequests}
                  setLeaveRequests={setLeaveRequests}
                  notifications={notifications}
                  feeTransactions={feeTransactions}
                  feeMaster={feeMaster}
                  currentUser={currentUser}
                />
              </motion.div>
            )}

            {view === 'human-resource' && (
              <motion.div key="human-resource" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <HumanResourcePanel 
                  staff={staff}
                  setStaff={setStaff}
                  departments={departments}
                  setDepartments={setDepartments}
                  designations={designations}
                  setDesignations={setDesignations}
                  leaveRequests={staffLeaveRequests}
                  setLeaveRequests={setStaffLeaveRequests}
                />
              </motion.div>
            )}

            {view === 'communicate' && (
              <motion.div key="communicate" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <CommunicatePanel 
                  notifications={notifications}
                  setNotifications={setNotifications}
                  templates={communicationTemplates}
                  setTemplates={setCommunicationTemplates}
                />
              </motion.div>
            )}

            {view === 'front-office' && (
              <motion.div key="front-office" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <FrontOfficePanel 
                  enquiries={admissionEnquiries}
                  setEnquiries={setAdmissionEnquiries}
                  visitors={visitors}
                  setVisitors={setVisitors}
                  complaints={complaints}
                  setComplaints={setComplaints}
                  setView={setView}
                  setFormData={setFormData}
                  currentUser={currentUser}
                />
              </motion.div>
            )}

            {view === 'leave-management' && (
              <motion.div key="leave-management" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="space-y-8 pb-20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-black text-text-heading tracking-tight">Leave Management</h1>
                      <p className="text-text-sub font-medium">Overview of all student leave requests and approvals.</p>
                    </div>
                  </div>
                  <Card>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Student</th>
                            <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Class/Sec</th>
                            <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Duration</th>
                            <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Reason</th>
                            <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Status</th>
                            <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Approved By</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {leaveRequests.map((l: LeaveRequest) => (
                            <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-4">
                                <p className="text-sm font-bold">{l.studentName}</p>
                                <p className="text-[10px] text-text-sub uppercase">{l.studentId}</p>
                              </td>
                              <td className="py-4 text-sm font-medium text-text-sub">{l.class}-{l.section}</td>
                              <td className="py-4">
                                <p className="text-sm font-bold">{l.duration} Days</p>
                                <p className="text-[10px] text-text-sub">{l.startDate} to {l.endDate}</p>
                              </td>
                              <td className="py-4 text-sm text-text-sub max-w-xs truncate">{l.reason}</td>
                              <td className="py-4">
                                <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                                  l.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                                  l.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                }`}>
                                  {l.status}
                                </span>
                              </td>
                              <td className="py-4">
                                {l.status === 'Pending' ? (
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => setLeaveRequests(leaveRequests.map(r => r.id === l.id ? {...r, status: 'Approved', approvedBy: 'Admin'} : r))}
                                      className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all"
                                      title="Approve"
                                    >
                                      <CheckCircle2 size={16} />
                                    </button>
                                    <button 
                                      onClick={() => setLeaveRequests(leaveRequests.map(r => r.id === l.id ? {...r, status: 'Rejected', approvedBy: 'Admin'} : r))}
                                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                                      title="Reject"
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-sm font-medium text-text-sub">{l.approvedBy || '-'}</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}

            {view === 'role-assign' && (
              <motion.div
                key="role-assign"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <RoleAssignPanel users={users} setUsers={setUsers} />
              </motion.div>
            )}

            {view === 'calendar' && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <CalendarView 
                  calendarEvents={calendarEvents} 
                  setCalendarEvents={setCalendarEvents} 
                  currentUser={currentUser} 
                />
              </motion.div>
            )}

            {view === 'reports' && (
              <motion.div
                key="reports"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <ReportsView 
                  students={students}
                  feeTransactions={feeTransactions}
                  attendance={attendance}
                  homeworks={homeworks}
                  hostelAttendance={hostelAttendance}
                  masterData={masterData}
                  leaveRequests={leaveRequests}
                  userLogs={userLogs}
                />
              </motion.div>
            )}

            {view === 'income-expense' && (
              <motion.div
                key="income-expense"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <IncomeExpenseView 
                  incomes={incomes} 
                  setIncomes={setIncomes} 
                  expenses={expenses} 
                  setExpenses={setExpenses} 
                  incomeHeads={incomeHeads} 
                  setIncomeHeads={setIncomeHeads} 
                  expenseHeads={expenseHeads} 
                  setExpenseHeads={setExpenseHeads} 
                />
              </motion.div>
            )}

            {view === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8 pb-20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-text-heading">Settings</h1>
                    <p className="text-text-sub">Manage your profile and system configurations.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Profile Section - Visible to All */}
                  <div className="lg:col-span-1">
                    <Card className="sticky top-8">
                      <div className="flex flex-col items-center text-center p-4">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 overflow-hidden border-2 border-primary/20">
                          {currentUser?.role === 'student' && students.find((s: any) => s.studentId === currentUser.id)?.photo ? (
                            <img 
                              src={students.find((s: any) => s.studentId === currentUser.id).photo} 
                              alt={currentUser?.name} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <UserCircle size={48} />
                          )}
                        </div>
                        <h3 className="text-xl font-bold">{currentUser?.name}</h3>
                        <p className="text-sm text-text-sub uppercase font-bold tracking-wider">{currentUser?.role}</p>
                        <p className="text-xs text-text-sub mt-1">ID: {currentUser?.id || currentUser?.studentId || 'N/A'}</p>
                      </div>
                      <div className="mt-6 space-y-4">
                        <Input label="Email Address" value={currentUser?.email || ''} disabled />
                        <Input label="Phone Number" value={currentUser?.mobile || ''} disabled />
                        <button className="btn-primary w-full py-3 mt-4">Update Profile</button>
                      </div>
                    </Card>
                  </div>

                  {/* Admin Only Settings */}
                  {currentUser?.role === 'admin' ? (
                    <div className="lg:col-span-2 space-y-8">
                      <Card>
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                          <School size={20} />
                          School Profile
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input 
                            label="School Name" 
                            value={schoolProfile.name} 
                            onChange={(e: any) => setSchoolProfile({...schoolProfile, name: e.target.value})} 
                          />
                          <Input 
                            label="Contact Number" 
                            value={schoolProfile.contact} 
                            onChange={(e: any) => setSchoolProfile({...schoolProfile, contact: e.target.value})} 
                          />
                          <Input 
                            label="GST Number" 
                            value={schoolProfile.gstNo} 
                            onChange={(e: any) => setSchoolProfile({...schoolProfile, gstNo: e.target.value})} 
                          />
                          <Input 
                            label="Registration Number" 
                            value={schoolProfile.regNo} 
                            onChange={(e: any) => setSchoolProfile({...schoolProfile, regNo: e.target.value})} 
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                          <Input 
                            label="Warden Panel ID" 
                            value={schoolProfile.wardenPanelId} 
                            onChange={(e: any) => setSchoolProfile({...schoolProfile, wardenPanelId: e.target.value})} 
                          />
                          <Input 
                            label="Warden Panel Password" 
                            type="password"
                            value={schoolProfile.wardenPanelPassword} 
                            onChange={(e: any) => setSchoolProfile({...schoolProfile, wardenPanelPassword: e.target.value})} 
                          />
                        </div>
                        <div className="mt-6">
                          <label className="label-text">School Address</label>
                          <textarea 
                            className="input-field min-h-[100px]" 
                            value={schoolProfile.address}
                            onChange={(e: any) => setSchoolProfile({...schoolProfile, address: e.target.value})}
                          ></textarea>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                          <FileUpload 
                            label="School Logo" 
                            icon={ImageIcon} 
                            preview={schoolProfile.logo}
                            onChange={(e: any) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setSchoolProfile({...schoolProfile, logo: reader.result as string});
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <FileUpload 
                            label="Authorized Signature" 
                            icon={Signature} 
                            preview={schoolProfile.signature}
                            onChange={(e: any) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setSchoolProfile({...schoolProfile, signature: reader.result as string});
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <FileUpload 
                            label="Official Stamp" 
                            icon={Stamp} 
                            preview={schoolProfile.stamp}
                            onChange={(e: any) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setSchoolProfile({...schoolProfile, stamp: reader.result as string});
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </div>
                      </Card>

                      <Card>
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                          <Percent size={20} />
                          Financial Settings
                        </h3>
                        <div className="max-w-xs">
                          <Input 
                            label="Set Tax (%)" 
                            type="number" 
                            value={taxes} 
                            onChange={(e: any) => setTaxes(e.target.value)} 
                          />
                          <p className="helper-text">This tax percentage will be applied to all fee structures.</p>
                        </div>
                      </Card>

                      <Card>
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                          <Video size={20} />
                          Live Camera Settings
                        </h3>
                        <div className="space-y-4">
                          {(schoolProfile as any).cameraUrls.map((cam: any, index: number) => (
                            <div key={cam.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                              <Input 
                                label={`Camera ${index + 1} Name`} 
                                value={cam.name} 
                                onChange={(e: any) => {
                                  const newUrls = [...(schoolProfile as any).cameraUrls];
                                  newUrls[index].name = e.target.value;
                                  setSchoolProfile({...schoolProfile, cameraUrls: newUrls});
                                }} 
                              />
                              <Input 
                                label={`Camera ${index + 1} URL`} 
                                value={cam.url} 
                                onChange={(e: any) => {
                                  const newUrls = [...(schoolProfile as any).cameraUrls];
                                  newUrls[index].url = e.target.value;
                                  setSchoolProfile({...schoolProfile, cameraUrls: newUrls});
                                }} 
                              />
                            </div>
                          ))}
                          <p className="helper-text">Configure the RTSP or HTTP stream URLs for your school's live cameras.</p>
                        </div>
                      </Card>

                      <Card>
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                          <BookOpenCheck size={20} />
                          Master Data Management
                        </h3>
                        <div className="space-y-8">
                          {[
                            { key: 'categories', label: 'Categories', icon: TagIcon },
                            { key: 'castes', label: 'Castes', icon: Users },
                            { key: 'religions', label: 'Religions', icon: HeartPulse },
                            { key: 'titles', label: 'Titles', icon: UserCheck },
                            { key: 'classes', label: 'Classes', icon: GraduationCap },
                            { key: 'sections', label: 'Sections', icon: Hash },
                            { key: 'subjects', label: 'Subjects', icon: BookOpen },
                            { key: 'genders', label: 'Genders', icon: UserPlus }
                          ].map((section) => (
                            <div key={section.key} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                  <section.icon size={18} className="text-primary" />
                                  <h4 className="font-bold text-text-heading">{section.label}</h4>
                                </div>
                                <button 
                                  onClick={() => {
                                    const val = prompt(`Enter new ${section.label.toLowerCase()}:`);
                                    if (val) addMasterItem(section.key, val);
                                  }}
                                  className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                                >
                                  <Plus size={14} />
                                  Add New
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {(masterData as any)[section.key].map((item: string, idx: number) => (
                                  <div key={idx} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                                    <span className="text-sm font-medium">{item}</span>
                                    <div className="flex items-center gap-1 border-l border-slate-100 ml-1 pl-1">
                                      <button 
                                        onClick={() => {
                                          const val = prompt(`Edit ${section.label.toLowerCase()}:`, item);
                                          if (val) editMasterItem(section.key, idx, val);
                                        }}
                                        className="p-1 text-slate-400 hover:text-primary transition-colors"
                                      >
                                        <Edit2 size={12} />
                                      </button>
                                      <button 
                                        onClick={() => {
                                          showModal(
                                            'Confirm Delete',
                                            `Are you sure you want to delete "${item}" from ${section.label}?`,
                                            () => deleteMasterItem(section.key, idx)
                                          );
                                        }}
                                        className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
                  ) : (
                    <div className="lg:col-span-2">
                      <Card>
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                          <Lock size={20} />
                          Account Security
                        </h3>
                        <div className="space-y-6">
                          <Input label="Current Password" type="password" />
                          <Input label="New Password" type="password" />
                          <Input label="Confirm New Password" type="password" />
                          <button className="btn-primary w-full py-4 mt-4">Change Password</button>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {view === 'fee-management' && (
              <motion.div
                key="fee-management"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <FeeManagement 
                  students={students}
                  feeTypes={feeTypes}
                  setFeeTypes={setFeeTypes}
                  feeMaster={feeMaster}
                  setFeeMaster={setFeeMaster}
                  feeTransactions={feeTransactions}
                  setFeeTransactions={setFeeTransactions}
                  schoolProfile={schoolProfile}
                  masterData={masterData}
                  showModal={showModal}
                  leaveRequests={leaveRequests}
                  getStudentDueFees={getStudentDueFees}
                />
              </motion.div>
            )}

            {view === 'academics' && (
              <motion.div
                key="academics"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Academics 
                  students={students}
                  setStudents={setStudents}
                  masterData={masterData}
                  timeTables={timeTables}
                  setTimeTables={setTimeTables}
                  syllabuses={syllabuses}
                  setSyllabuses={setSyllabuses}
                  homeworks={homeworks}
                  setHomeworks={setHomeworks}
                  teacherAssignments={teacherAssignments}
                  setTeacherAssignments={setTeacherAssignments}
                  currentUser={currentUser}
                />
              </motion.div>
            )}

            {view === 'examination' && (
              <motion.div
                key="examination"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <ExaminationModule 
                  exams={exams}
                  setExams={setExams}
                  examSchedules={examSchedules}
                  setExamSchedules={setExamSchedules}
                  examResults={examResults}
                  setExamResults={setExamResults}
                  students={students}
                  masterData={masterData}
                  currentUser={currentUser}
                />
              </motion.div>
            )}

            {view === 'id-cards' && (
              <motion.div
                key="id-cards"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <IDCardsModule 
                  students={students}
                  staff={staff}
                  masterData={masterData}
                  schoolProfile={schoolProfile}
                  examResults={examResults}
                  selectedPerson={selectedPersonForID}
                  setSelectedPerson={setSelectedPersonForID}
                  activeTab={idCardTab}
                  setActiveTab={setIdCardTab}
                />
              </motion.div>
            )}

            {view === 'hostel' && (
              <motion.div
                key="hostel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <HostelModule 
                  students={students}
                  rooms={hostelRooms}
                  setRooms={setHostelRooms}
                  beds={hostelBeds}
                  setBeds={setHostelBeds}
                  staff={hostelStaff}
                  setStaff={setHostelStaff}
                  attendance={hostelAttendance}
                  setAttendance={setHostelAttendance}
                  feeTransactions={feeTransactions}
                  masterData={masterData}
                  currentUser={currentUser}
                  showModal={showModal}
                />
              </motion.div>
            )}

            {view === 'admin-360' && (
              <motion.div
                key="admin-360"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Admin360View 
                  students={students}
                  feeTransactions={feeTransactions}
                  attendance={attendance}
                  masterData={masterData}
                />
              </motion.div>
            )}

            {view === 'class-360' && (
              <motion.div
                key="class-360"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Class360View 
                  students={students}
                  feeTransactions={feeTransactions}
                  attendance={attendance}
                  masterData={masterData}
                />
              </motion.div>
            )}

            {view === 'due-fees' && (
              <motion.div
                key="due-fees"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <DueFeesModule 
                  students={students}
                  feeTransactions={feeTransactions}
                  feeMaster={feeMaster}
                  currentUser={currentUser}
                  masterData={masterData}
                  getStudentDueFees={getStudentDueFees}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="p-4 bg-white border-t border-slate-100 text-center shrink-0">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">A Digital Communique Product</p>
        </footer>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex items-center justify-around p-2 z-[100] lg:hidden">
        <button 
          onClick={() => setView('dashboard')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${view === 'dashboard' ? 'text-primary' : 'text-slate-400'}`}
        >
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-bold uppercase">Home</span>
        </button>
        <button 
          onClick={() => setView('academics')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${view === 'academics' ? 'text-primary' : 'text-slate-400'}`}
        >
          <BookOpen size={20} />
          <span className="text-[10px] font-bold uppercase">Study</span>
        </button>
        <button 
          onClick={() => setView('attendance')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${view === 'attendance' ? 'text-primary' : 'text-slate-400'}`}
        >
          <UserCheck size={20} />
          <span className="text-[10px] font-bold uppercase">Attend</span>
        </button>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${isSidebarOpen ? 'text-primary' : 'text-slate-400'}`}
        >
          <Menu size={20} />
          <span className="text-[10px] font-bold uppercase">Menu</span>
        </button>
      </nav>

      {/* Custom Modal */}
      <AnimatePresence>
        {modal?.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModal(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[24px] p-8 shadow-2xl relative z-10 w-full max-w-md"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${modal.onConfirm ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {modal.onConfirm ? <AlertCircle size={24} /> : <CheckCircle2 size={24} />}
                </div>
                <h3 className="text-xl font-bold text-text-heading">{modal.title}</h3>
              </div>
              <p className="text-text-sub mb-8 leading-relaxed">{modal.message}</p>
              <div className="flex gap-3">
                {modal.onConfirm ? (
                  <>
                    <button 
                      onClick={() => setModal(null)}
                      className="flex-1 py-3 rounded-xl font-bold text-text-sub hover:bg-slate-100 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        modal.onConfirm?.();
                        setModal(null);
                      }}
                      className="flex-1 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                    >
                      Confirm
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setModal(null)}
                    className="w-full py-3 rounded-xl font-bold bg-primary text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                  >
                    Got it
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const HostelModule = ({ 
  students, 
  rooms, 
  setRooms, 
  beds, 
  setBeds, 
  staff, 
  setStaff, 
  attendance, 
  setAttendance, 
  feeTransactions,
  masterData,
  currentUser,
  showModal
}: any) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [scanning, setScanning] = useState(false);
  
  // Form states
  const [roomForm, setRoomForm] = useState<any>({ roomNumber: '', floor: '', capacity: 4, type: 'Non-AC', gender: 'Male', category: 'Standard', price: 0 });
  const [staffForm, setStaffForm] = useState<any>({ name: '', role: 'Warden', mobile: '', email: '', shift: 'Day' });
  const [enrollForm, setEnrollForm] = useState<any>({ studentId: '', roomId: '', bedId: '' });

  // Filters
  const [filterClass, setFilterClass] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [filterSearch, setFilterSearch] = useState('');

  useEffect(() => {
    let html5QrCode: any = null;
    
    const startScanner = async () => {
      if (scanning) {
        try {
          // Small delay to ensure DOM element is ready
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const element = document.getElementById("qr-reader");
          if (!element) return;

          html5QrCode = new Html5Qrcode("qr-reader");
          await html5QrCode.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            (decodedText: string) => {
              handleAttendance(decodedText, 'Present');
              setScanning(false);
            },
            (errorMessage: string) => {
              // Ignore constant scan errors
            }
          ).catch((err: any) => {
            console.error("Scanner start error:", err);
          });
        } catch (err) {
          console.error("Scanner initialization error:", err);
        }
      }
    };

    startScanner();

    return () => {
      if (html5QrCode) {
        if (html5QrCode.isScanning) {
          html5QrCode.stop().then(() => {
            html5QrCode.clear();
          }).catch((err: any) => console.error("Scanner stop error:", err));
        } else {
          try {
            html5QrCode.clear();
          } catch (e) {}
        }
      }
    };
  }, [scanning]);

  const handleAddRoom = () => {
    if (roomForm.id) {
      setRooms(rooms.map((r: any) => r.id === roomForm.id ? roomForm : r));
    } else {
      const newRoom = { ...roomForm, id: Date.now().toString() };
      setRooms([...rooms, newRoom]);
      
      // Auto-create beds for the room
      const newBeds: HostelBed[] = [];
      for (let i = 1; i <= roomForm.capacity; i++) {
        newBeds.push({
          id: `${newRoom.id}-bed-${i}`,
          roomId: newRoom.id,
          bedNumber: `${newRoom.roomNumber}-${i}`,
          status: 'Available'
        });
      }
      setBeds([...beds, ...newBeds]);
    }
    setShowRoomModal(false);
    setRoomForm({ roomNumber: '', floor: '', capacity: 4, type: 'Non-AC', gender: 'Male', category: 'Standard', price: 0 });
  };

  const handleAddStaff = () => {
    if (staffForm.id) {
      setStaff(staff.map((s: any) => s.id === staffForm.id ? staffForm : s));
    } else {
      setStaff([...staff, { ...staffForm, id: Date.now().toString() }]);
    }
    setShowStaffModal(false);
    setStaffForm({ name: '', role: 'Warden', mobile: '', email: '', shift: 'Day' });
  };

  const handleEnrollStudent = () => {
    const updatedBeds = beds.map((b: HostelBed) => 
      b.id === enrollForm.bedId ? { ...b, status: 'Occupied', studentId: enrollForm.studentId } : b
    );
    setBeds(updatedBeds);
    setShowEnrollModal(false);
    setEnrollForm({ studentId: '', roomId: '', bedId: '' });
  };

  const getStudentFeeStatus = (studentId: string) => {
    const transactions = feeTransactions.filter((t: any) => t.studentId === studentId);
    if (transactions.length === 0) return { status: 'Due', color: 'text-red-500' };
    return { status: 'Paid', color: 'text-green-500' };
  };

  const handleAttendance = (studentId: string, status: any) => {
    const newRecord = {
      id: Date.now().toString(),
      studentId,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      status
    };
    setAttendance([...attendance, newRecord]);
  };

  const filteredStudents = students.filter((s: any) => 
    (!filterClass || s.class === filterClass) &&
    (!filterSection || s.section === filterSection) &&
    (!filterSearch || s.name.toLowerCase().includes(filterSearch.toLowerCase()) || s.studentId.includes(filterSearch))
  );

  const stats = {
    totalRooms: rooms.length,
    totalBeds: beds.length,
    occupiedBeds: beds.filter((b: any) => b.status === 'Occupied').length,
    availableBeds: beds.filter((b: any) => b.status === 'Available').length,
    staffCount: staff.length
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-heading tracking-tight">Hostel Management</h1>
          <p className="text-text-sub font-medium">Manage rooms, beds, student enrollment, and attendance.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowRoomModal(true)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            <Plus size={20} /> Add Room
          </button>
          <button 
            onClick={() => setShowStaffModal(true)}
            className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all"
          >
            <UserCog size={20} /> Add Staff
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { label: 'Total Rooms', value: stats.totalRooms, icon: DoorOpen, color: 'bg-blue-500' },
          { label: 'Total Beds', value: stats.totalBeds, icon: Bed, color: 'bg-indigo-500' },
          { label: 'Occupied', value: stats.occupiedBeds, icon: Users, color: 'bg-orange-500' },
          { label: 'Available', value: stats.availableBeds, icon: CheckCircle2, color: 'bg-emerald-500' },
          { label: 'Hostel Staff', value: stats.staffCount, icon: ShieldCheck, color: 'bg-purple-500' }
        ].map((stat, i) => (
          <Card key={i} className="p-6 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-16 h-16 ${stat.color} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:scale-150`}></div>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} text-white rounded-xl flex items-center justify-center shadow-lg`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-text-heading">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
        {[
          { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
          { id: 'rooms', label: 'Rooms & Beds', icon: Building2 },
          { id: 'enrollment', label: 'Enrollment', icon: UserPlus },
          { id: 'attendance', label: 'Attendance', icon: ScanLine },
          { id: 'staff', label: 'Staff', icon: UserCog }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-text-sub hover:text-text-heading hover:bg-white/50'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="p-6 lg:col-span-2">
                <h3 className="font-bold text-text-heading mb-6 flex items-center gap-2">
                  <BarChart3 size={18} className="text-primary" />
                  Occupancy Overview
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Occupied', value: stats.occupiedBeds, fill: '#f97316' },
                      { name: 'Vacant', value: stats.availableBeds, fill: '#10b981' },
                      { name: 'Maintenance', value: beds.filter((b: any) => b.status === 'Maintenance').length, fill: '#ef4444' }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: '#f8fafc' }}
                      />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-text-heading mb-6 flex items-center gap-2">
                  <PieChartIcon size={18} className="text-primary" />
                  Bed Distribution
                </h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Occupied', value: stats.occupiedBeds },
                          { name: 'Vacant', value: stats.availableBeds }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="#f97316" />
                        <Cell fill="#10b981" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-xs font-bold">Occupied</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-xs font-bold">Vacant</span>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="font-bold text-text-heading mb-6 flex items-center gap-2">
                  <Clock size={18} className="text-primary" />
                  Recent Attendance
                </h3>
                <div className="space-y-4">
                  {attendance.length === 0 ? (
                    <p className="text-center py-12 text-text-secondary italic">No attendance records found for today.</p>
                  ) : (
                    attendance.slice(-5).reverse().map((record: any) => {
                      const student = students.find((s: any) => s.studentId === record.studentId);
                      return (
                        <div key={record.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-primary">
                              {student?.name[0]}
                            </div>
                            <div>
                              <p className="font-bold text-sm">{student?.name} {student?.surname}</p>
                              <p className="text-[10px] text-text-secondary uppercase">{record.time}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                            record.status === 'Present' ? 'bg-green-100 text-green-600' :
                            record.status === 'Late' ? 'bg-orange-100 text-orange-600' :
                            record.status === 'Leave' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {record.status}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-text-heading mb-6 flex items-center gap-2">
                  <Building2 size={18} className="text-primary" />
                  Room Occupancy
                </h3>
                <div className="space-y-4">
                  {rooms.map((room: any) => {
                    const roomBeds = beds.filter((b: any) => b.roomId === room.id);
                    const occupied = roomBeds.filter((b: any) => b.status === 'Occupied').length;
                    const percentage = (occupied / room.capacity) * 100;
                    return (
                      <div key={room.id} className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-bold">Room {room.roomNumber} ({room.type})</span>
                          <span className="text-text-secondary">{occupied} / {room.capacity} Beds</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${percentage > 90 ? 'bg-red-500' : percentage > 50 ? 'bg-orange-500' : 'bg-emerald-500'}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'rooms' && (
          <motion.div key="rooms" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room: any) => (
              <Card key={room.id} className="overflow-hidden group">
                <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black tracking-tighter">ROOM {room.roomNumber}</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{room.floor} Floor · {room.type} · {room.category}</p>
                    <p className="text-xs font-black text-emerald-400 mt-1">₹{room.price} / Month</p>
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${room.gender === 'Male' ? 'bg-blue-500/20 text-blue-400' : 'bg-pink-500/20 text-pink-400'}`}>
                    {room.gender}
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {beds.filter((b: any) => b.roomId === room.id).map((bed: any) => {
                      const student = students.find((s: any) => s.studentId === bed.studentId);
                      return (
                        <div key={bed.id} className={`p-3 rounded-xl border transition-all ${
                          bed.status === 'Occupied' 
                            ? 'bg-orange-50 border-orange-100' 
                            : bed.status === 'Maintenance'
                            ? 'bg-red-50 border-red-100'
                            : 'bg-emerald-50 border-emerald-100'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Bed {bed.bedNumber.split('-').pop()}</span>
                            <Bed size={14} className={bed.status === 'Occupied' ? 'text-orange-500' : bed.status === 'Maintenance' ? 'text-red-500' : 'text-emerald-500'} />
                          </div>
                          <p className="text-xs font-bold truncate">
                            {bed.status === 'Occupied' ? student?.name || 'Assigned' : bed.status}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <button 
                    onClick={() => {
                      setRoomForm(room);
                      setShowRoomModal(true);
                    }}
                    className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-text-heading font-bold text-sm transition-all"
                  >
                    Manage Room
                  </button>
                </div>
              </Card>
            ))}
          </motion.div>
        )}

        {activeTab === 'enrollment' && (
          <motion.div key="enrollment" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            <Card className="p-6">
              <div className="flex flex-wrap gap-4 items-end mb-8">
                <div className="flex-1 min-w-[200px]">
                  <label className="label-text">Search Student</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      className="input-field pl-10" 
                      placeholder="Name or ID..." 
                      value={filterSearch}
                      onChange={(e) => setFilterSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-40">
                  <label className="label-text">Class</label>
                  <select className="input-field" value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
                    <option value="">All</option>
                    {masterData.classes.map((c: string) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="w-40">
                  <label className="label-text">Section</label>
                  <select className="input-field" value={filterSection} onChange={(e) => setFilterSection(e.target.value)}>
                    <option value="">All</option>
                    {masterData.sections.map((s: string) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <button 
                  onClick={() => setShowEnrollModal(true)}
                  className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg"
                >
                  Assign New Bed
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] font-bold text-text-secondary uppercase tracking-wider border-b border-slate-200">
                      <th className="pb-4 px-4">Student</th>
                      <th className="pb-4 px-4">Class/Sec</th>
                      <th className="pb-4 px-4">Room/Bed</th>
                      <th className="pb-4 px-4">Fee Status</th>
                      <th className="pb-4 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {beds.filter((b: any) => b.status === 'Occupied').map((bed: any) => {
                      const student = students.find((s: any) => s.studentId === bed.studentId);
                      const room = rooms.find((r: any) => r.id === bed.roomId);
                      const fee = getStudentFeeStatus(student?.studentId);
                      
                      if (filterClass && student?.class !== filterClass) return null;
                      if (filterSection && student?.section !== filterSection) return null;
                      if (filterSearch && !student?.name.toLowerCase().includes(filterSearch.toLowerCase()) && !student?.studentId.includes(filterSearch)) return null;

                      return (
                        <tr key={bed.id} className="border-b border-slate-100 hover:bg-slate-50 transition-all">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                {student?.name[0]}
                              </div>
                              <div>
                                <p className="font-bold">{student?.name} {student?.surname}</p>
                                <p className="text-[10px] text-text-secondary">{student?.studentId}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-medium">{student?.class} - {student?.section}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold">Room {room?.roomNumber}</span>
                              <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-bold">Bed {bed.bedNumber.split('-').pop()}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`font-bold ${fee.color}`}>{fee.status}</span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button 
                              onClick={() => {
                                showModal(
                                  'Confirm De-enrollment',
                                  `Are you sure you want to remove ${student?.name} from Room ${room?.roomNumber}, Bed ${bed.bedNumber.split('-').pop()}?`,
                                  () => {
                                    const updatedBeds = beds.map((b: HostelBed) => 
                                      b.id === bed.id ? { ...b, status: 'Available', studentId: undefined } : b
                                    );
                                    setBeds(updatedBeds);
                                  }
                                );
                              }}
                              className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'attendance' && (
          <motion.div key="attendance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            <div className="flex flex-col items-center justify-center py-10 space-y-8">
              <div className="w-full max-w-md text-center space-y-6">
                <div className="w-32 h-32 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto text-primary">
                  <ScanLine size={64} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-text-heading">QR Attendance Scanner</h3>
                  <p className="text-text-sub">Scan student ID card to mark hostel attendance.</p>
                </div>
                
                <div className="p-8 bg-white rounded-[32px] shadow-2xl border border-slate-100">
                  {scanning ? (
                    <div className="space-y-6">
                      <div id="qr-reader" className="w-full rounded-2xl overflow-hidden bg-slate-900 aspect-square flex items-center justify-center">
                        <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Initializing Camera...</p>
                      </div>
                      <button 
                        onClick={() => setScanning(false)}
                        className="w-full py-4 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all"
                      >
                        Stop Scanner
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <button 
                        onClick={() => setScanning(true)}
                        className="w-full py-6 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center gap-3"
                      >
                        <QrCode size={24} />
                        Start Scanning
                      </button>
                      <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Supports Late, Present, Absent, Leave</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Card className="p-6">
              <h3 className="font-bold text-text-heading mb-6 flex items-center gap-2">
                <UserCheck2 size={18} className="text-primary" />
                Manual Attendance / Leave Marking
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] font-bold text-text-secondary uppercase tracking-wider border-b border-slate-200">
                      <th className="pb-4 px-4">Student</th>
                      <th className="pb-4 px-4">Room/Bed</th>
                      <th className="pb-4 px-4 text-right">Mark Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {beds.filter((b: any) => b.status === 'Occupied').map((bed: any) => {
                      const student = students.find((s: any) => s.studentId === bed.studentId);
                      const room = rooms.find((r: any) => r.id === bed.roomId);
                      const todayRecord = attendance.find((a: any) => a.studentId === student?.studentId && a.date === new Date().toISOString().split('T')[0]);

                      return (
                        <tr key={bed.id} className="border-b border-slate-100 hover:bg-slate-50 transition-all">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                {student?.name[0]}
                              </div>
                              <div>
                                <p className="font-bold">{student?.name} {student?.surname}</p>
                                <p className="text-[10px] text-text-secondary">{student?.studentId}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold">Room {room?.roomNumber} - Bed {bed.bedNumber.split('-').pop()}</span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleAttendance(student.studentId, 'Present')}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                                  todayRecord?.status === 'Present' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600 hover:bg-green-200'
                                }`}
                              >
                                Present
                              </button>
                              <button 
                                onClick={() => handleAttendance(student.studentId, 'Leave')}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                                  todayRecord?.status === 'Leave' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                }`}
                              >
                                <img 
                                  src="https://storage.googleapis.com/cortex-dev-cortex-build-public-assets/ais-dev-qwpf4dfgd7b2nhd2genpku-212916940376/nehatripathifreelance%40gmail.com/1742561480073-image-1.png" 
                                  alt="L" 
                                  className="w-4 h-4 object-contain"
                                  referrerPolicy="no-referrer"
                                />
                                Leave
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'staff' && (
          <motion.div key="staff" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {staff.map((s: any) => (
              <Card key={s.id} className="p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-12 -mt-12"></div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-primary font-black text-2xl">
                    {s.name[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-text-heading uppercase tracking-tight">{s.name}</h3>
                    <p className="text-xs font-bold text-primary uppercase tracking-widest">{s.role}</p>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-text-sub">
                    <Phone size={16} />
                    <span className="font-medium">{s.mobile}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-sub">
                    <Mail size={16} />
                    <span className="font-medium">{s.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-sub">
                    <Clock size={16} />
                    <span className="font-medium">Shift: {s.shift}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setStaffForm(s);
                      setShowStaffModal(true);
                    }}
                    className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-text-heading font-bold text-xs transition-all"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => {
                      showModal(
                        'Confirm Delete',
                        `Are you sure you want to remove ${s.name} from hostel staff?`,
                        () => setStaff(staff.filter((st: any) => st.id !== s.id))
                      );
                    }}
                    className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </Card>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      {showRoomModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowRoomModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[32px] p-8 shadow-2xl relative z-10 w-full max-w-md">
            <h3 className="text-2xl font-black text-text-heading mb-6">{roomForm.id ? 'Edit Room' : 'Add New Room'}</h3>
            <div className="space-y-4">
              <Input label="Room Number" value={roomForm.roomNumber} onChange={(e: any) => setRoomForm({ ...roomForm, roomNumber: e.target.value })} />
              <Input label="Floor" value={roomForm.floor} onChange={(e: any) => setRoomForm({ ...roomForm, floor: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Category" placeholder="e.g. Deluxe" value={roomForm.category} onChange={(e: any) => setRoomForm({ ...roomForm, category: e.target.value })} />
                <Input label="Price / Month" type="number" value={roomForm.price} onChange={(e: any) => setRoomForm({ ...roomForm, price: parseFloat(e.target.value) })} />
              </div>
              <Input label="Capacity (Beds)" type="number" value={roomForm.capacity} onChange={(e: any) => setRoomForm({ ...roomForm, capacity: parseInt(e.target.value) })} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Type</label>
                  <select className="input-field" value={roomForm.type} onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}>
                    <option value="Non-AC">Non-AC</option>
                    <option value="AC">AC</option>
                  </select>
                </div>
                <div>
                  <label className="label-text">Gender</label>
                  <select className="input-field" value={roomForm.gender} onChange={(e) => setRoomForm({ ...roomForm, gender: e.target.value })}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
              <button onClick={handleAddRoom} className="w-full py-4 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/20 mt-4">
                {roomForm.id ? 'Update Room' : 'Create Room'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showStaffModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowStaffModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[32px] p-8 shadow-2xl relative z-10 w-full max-w-md">
            <h3 className="text-2xl font-black text-text-heading mb-6">{staffForm.id ? 'Edit Staff' : 'Add Hostel Staff'}</h3>
            <div className="space-y-4">
              <Input label="Full Name" value={staffForm.name} onChange={(e: any) => setStaffForm({ ...staffForm, name: e.target.value })} />
              <div>
                <label className="label-text">Role</label>
                <select className="input-field" value={staffForm.role} onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}>
                  <option value="Warden">Warden</option>
                  <option value="Assistant Warden">Assistant Warden</option>
                  <option value="Security">Security</option>
                  <option value="Cleaning Staff">Cleaning Staff</option>
                </select>
              </div>
              <Input label="Mobile Number" value={staffForm.mobile} onChange={(e: any) => setStaffForm({ ...staffForm, mobile: e.target.value })} />
              <Input label="Email Address" value={staffForm.email} onChange={(e: any) => setStaffForm({ ...staffForm, email: e.target.value })} />
              <div>
                <label className="label-text">Shift</label>
                <select className="input-field" value={staffForm.shift} onChange={(e) => setStaffForm({ ...staffForm, shift: e.target.value })}>
                  <option value="Day">Day</option>
                  <option value="Night">Night</option>
                </select>
              </div>
              <button onClick={handleAddStaff} className="w-full py-4 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/20 mt-4">
                {staffForm.id ? 'Update Staff Member' : 'Add Staff Member'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showEnrollModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowEnrollModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[32px] p-8 shadow-2xl relative z-10 w-full max-w-md">
            <h3 className="text-2xl font-black text-text-heading mb-6">Assign Bed to Student</h3>
            <div className="space-y-4">
              <div>
                <label className="label-text">Select Student</label>
                <select className="input-field" value={enrollForm.studentId} onChange={(e) => setEnrollForm({ ...enrollForm, studentId: e.target.value })}>
                  <option value="">Choose Student...</option>
                  {students.map((s: any) => (
                    <option key={s.id} value={s.studentId}>{s.name} {s.surname} ({s.studentId})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-text">Select Room</label>
                <select className="input-field" value={enrollForm.roomId} onChange={(e) => setEnrollForm({ ...enrollForm, roomId: e.target.value, bedId: '' })}>
                  <option value="">Choose Room...</option>
                  {rooms.map((r: any) => <option key={r.id} value={r.id}>Room {r.roomNumber} ({r.floor} Floor)</option>)}
                </select>
              </div>
              {enrollForm.roomId && (
                <div>
                  <label className="label-text">Select Bed</label>
                  <select className="input-field" value={enrollForm.bedId} onChange={(e) => setEnrollForm({ ...enrollForm, bedId: e.target.value })}>
                    <option value="">Choose Bed...</option>
                    {beds.filter((b: any) => b.roomId === enrollForm.roomId && b.status === 'Available').map((b: any) => (
                      <option key={b.id} value={b.id}>Bed {b.bedNumber.split('-').pop()}</option>
                    ))}
                  </select>
                </div>
              )}
              <button 
                onClick={handleEnrollStudent} 
                disabled={!enrollForm.studentId || !enrollForm.bedId}
                className="w-full py-4 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/20 mt-4 disabled:opacity-50"
              >
                Confirm Assignment
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const IDCardsModule = ({ 
  students, 
  staff, 
  masterData, 
  schoolProfile, 
  examResults,
  selectedPerson,
  setSelectedPerson,
  activeTab,
  setActiveTab
}: any) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  const filteredPeople = activeTab === 'teacher' || activeTab === 'experience' 
    ? staff 
    : students.filter((s: any) => 
        (!selectedClass || s.class === selectedClass) && 
        (!selectedSection || s.section === selectedSection)
      );

  const tabs = [
    { id: 'student', label: 'Student ID', icon: UserCircle },
    { id: 'teacher', label: 'Staff ID', icon: UserCheck },
    { id: 'marksheet', label: 'Mark Sheet', icon: ClipboardList },
    { id: 'experience', label: 'Experience Cert', icon: Briefcase },
    { id: 'awards', label: 'Award Cert', icon: Trophy },
    { id: 'appraisal', label: 'Appraisal Cert', icon: Star },
    { id: 'hostel', label: 'Hostel Card', icon: Home },
    { id: 'transfer', label: 'Transfer Cert', icon: FileOutput },
    { id: 'migration', label: 'Migration Cert', icon: FileSpreadsheet },
  ];

  const IDCard = ({ person, type = 'student', orientation = 'portrait' }: { person: any, type?: string, orientation?: 'portrait' | 'landscape' }) => (
    <div className={`${orientation === 'portrait' ? 'w-[350px] h-[500px]' : 'w-[500px] h-[320px]'} bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 relative flex ${orientation === 'portrait' ? 'flex-col' : 'flex-row'}`}>
      {/* Header */}
      <div className={`${orientation === 'portrait' ? 'bg-primary p-6' : 'bg-primary w-1/3 p-4'} text-white text-center relative overflow-hidden flex flex-col justify-center items-center`}>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-white rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white rounded-full blur-2xl"></div>
        </div>
        <div className="relative z-10">
          <h2 className={`${orientation === 'portrait' ? 'text-lg' : 'text-sm'} font-black tracking-tight uppercase leading-tight`}>{schoolProfile.name}</h2>
          <p className="text-[10px] opacity-80 font-medium mt-1 uppercase tracking-widest">Identity Card</p>
        </div>
        {orientation === 'landscape' && (
          <div className="mt-4 w-20 h-20 bg-white rounded-xl p-1 shadow-inner">
             <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${person.studentId || person.id || 'TCH-12345'}`} 
              alt="QR Code" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 flex ${orientation === 'portrait' ? 'flex-col' : 'flex-row'} items-center ${orientation === 'portrait' ? 'pt-6 px-6' : 'p-6 gap-6'}`}>
        <div className={`${orientation === 'portrait' ? 'w-24 h-24' : 'w-24 h-24'} rounded-2xl border-4 border-primary/10 p-1 ${orientation === 'portrait' ? 'mb-4' : ''} shrink-0`}>
          <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center text-primary font-black text-4xl overflow-hidden">
            {person.photo ? <img src={person.photo} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : person.name[0]}
          </div>
        </div>

        {orientation === 'portrait' && (
          <div className="w-24 h-24 bg-white rounded-xl p-2 shadow-sm border border-slate-100 mb-4 flex items-center justify-center">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${person.studentId || person.id || 'TCH-12345'}`} 
              alt="QR Code" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        <div className="flex-1 w-full">
          <h3 className={`${orientation === 'portrait' ? 'text-xl' : 'text-lg'} font-black text-text-heading ${orientation === 'portrait' ? 'text-center' : ''} uppercase tracking-tight`}>{person.name} {person.surname}</h3>
          <p className={`text-primary font-bold text-sm ${orientation === 'portrait' ? 'mb-4 text-center' : 'mb-4'} uppercase tracking-widest`}>{type === 'teacher' ? 'Faculty Member' : 'Student'}</p>

          <div className="w-full space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-[8px] font-bold text-text-secondary uppercase tracking-wider">ID Number</span>
              <span className="text-[10px] font-black text-text-heading font-mono">{person.studentId || person.id || 'TCH-12345'}</span>
            </div>
            {type !== 'teacher' && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-bold text-text-secondary uppercase tracking-wider">Class & Sec</span>
                  <span className="text-[10px] font-black text-text-heading">{person.class} - {person.section}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-bold text-text-secondary uppercase tracking-wider">Blood Group</span>
                  <span className="text-[10px] font-black text-red-600">{person.bloodGroup || 'B+'}</span>
                </div>
              </>
            )}
            <div className="flex justify-between items-center">
              <span className="text-[8px] font-bold text-text-secondary uppercase tracking-wider">Contact</span>
              <span className="text-[10px] font-black text-text-heading">{person.fatherMobile || person.mobile || '+91 98765 43210'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer (Portrait Only) */}
      {orientation === 'portrait' && (
        <div className="p-6 bg-white border-t border-slate-100 flex items-center justify-center">
          <div className="flex flex-col gap-1 items-center">
            <div className="w-32 h-8 border-b border-slate-300"></div>
            <p className="text-[8px] font-bold text-text-secondary uppercase tracking-widest">Authorized Signatory / Principal</p>
          </div>
        </div>
      )}
      
      {/* Card Strip */}
      <div className={`${orientation === 'portrait' ? 'h-2 w-full' : 'w-2 h-full'} bg-primary`}></div>
    </div>
  );

  const MarkSheet = ({ student, results }: { student: any, results: any[] }) => (
    <div className="w-[800px] min-h-[1000px] bg-white p-12 shadow-2xl border-4 border-slate-200 relative mx-auto font-serif">
      <div className="text-center mb-10 border-b-2 border-slate-100 pb-8">
        <h1 className="text-3xl font-black text-primary uppercase tracking-tighter mb-2">{schoolProfile.name}</h1>
        <p className="text-text-sub font-bold uppercase tracking-widest text-xs">{schoolProfile.address}</p>
        <h2 className="text-2xl font-black text-text-heading mt-6 uppercase">Academic Progress Report</h2>
        <p className="text-sm font-bold text-text-sub">Academic Session: 2023-24</p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <div className="space-y-2">
          <p className="text-xs uppercase font-bold text-text-secondary">Student Name</p>
          <p className="text-lg font-black text-text-heading">{student.name} {student.surname}</p>
          <p className="text-xs uppercase font-bold text-text-secondary mt-4">Father's Name</p>
          <p className="text-sm font-bold text-text-heading">{student.fatherName}</p>
        </div>
        <div className="space-y-2 text-right">
          <p className="text-xs uppercase font-bold text-text-secondary">Student ID</p>
          <p className="text-lg font-black text-primary font-mono">{student.studentId}</p>
          <p className="text-xs uppercase font-bold text-text-secondary mt-4">Class & Section</p>
          <p className="text-sm font-bold text-text-heading">{student.class} - {student.section}</p>
        </div>
      </div>

      <table className="w-full border-collapse mb-10">
        <thead>
          <tr className="bg-primary text-white">
            <th className="p-4 text-left border border-primary text-sm uppercase font-black">Subject</th>
            <th className="p-4 text-center border border-primary text-sm uppercase font-black">Max Marks</th>
            <th className="p-4 text-center border border-primary text-sm uppercase font-black">Obtained</th>
            <th className="p-4 text-center border border-primary text-sm uppercase font-black">Grade</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {results.map((res, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
              <td className="p-4 border border-slate-200 font-bold text-text-heading">{res.subject}</td>
              <td className="p-4 border border-slate-200 text-center font-bold">100</td>
              <td className="p-4 border border-slate-200 text-center font-black text-primary">{res.marks}</td>
              <td className="p-4 border border-slate-200 text-center font-bold">
                {res.marks >= 90 ? 'A+' : res.marks >= 80 ? 'A' : res.marks >= 70 ? 'B' : 'C'}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-slate-100">
            <td className="p-4 border border-slate-200 font-black uppercase text-sm">Grand Total</td>
            <td className="p-4 border border-slate-200 text-center font-black">{results.length * 100}</td>
            <td className="p-4 border border-slate-200 text-center font-black text-primary">
              {results.reduce((acc, curr) => acc + curr.marks, 0)}
            </td>
            <td className="p-4 border border-slate-200 text-center font-black">
              {Math.round(results.reduce((acc, curr) => acc + curr.marks, 0) / results.length)}%
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="grid grid-cols-3 gap-8 mt-20">
        <div className="text-center">
          <div className="w-32 h-10 border-b border-slate-300 mx-auto mb-2"></div>
          <p className="text-[10px] font-bold text-text-secondary uppercase">Class Teacher</p>
        </div>
        <div className="text-center">
          <div className="w-32 h-10 border-b border-slate-300 mx-auto mb-2"></div>
          <p className="text-[10px] font-bold text-text-secondary uppercase">Examination Head</p>
        </div>
        <div className="text-center">
          <div className="w-32 h-10 border-b border-slate-300 mx-auto mb-2"></div>
          <p className="text-[10px] font-bold text-text-secondary uppercase">Principal</p>
        </div>
      </div>
    </div>
  );

  const ExperienceCertificate = ({ staff }: { staff: any }) => (
    <div className="w-[800px] min-h-[1000px] bg-white p-20 shadow-2xl border-[16px] border-double border-slate-100 relative mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-primary uppercase tracking-tighter mb-2">{schoolProfile.name}</h1>
        <p className="text-text-sub font-bold uppercase tracking-widest text-sm">{schoolProfile.address}</p>
        <div className="w-40 h-1 bg-primary mx-auto mt-8"></div>
        <h2 className="text-3xl font-black text-text-heading mt-12 uppercase underline underline-offset-8">Experience Certificate</h2>
      </div>

      <div className="space-y-10 text-xl leading-relaxed text-justify">
        <div className="flex justify-between font-bold text-text-secondary mb-12">
          <span>Ref: EXP/2024/{staff.id.split('-')[1]}</span>
          <span>Date: {new Date().toLocaleDateString()}</span>
        </div>

        <p>TO WHOM IT MAY CONCERN</p>

        <p>This is to certify that <span className="font-black border-b-2 border-slate-300 px-4">{staff.name} {staff.surname}</span> has been 
        working with <span className="font-black">{schoolProfile.name}</span> as a <span className="font-black border-b-2 border-slate-300 px-4">{staff.designation || staff.role}</span> in 
        the <span className="font-black border-b-2 border-slate-300 px-4">{staff.department || 'Academic'}</span> department from 
        <span className="font-black border-b-2 border-slate-300 px-4">{staff.joiningDate || '01/06/2021'}</span> to 
        <span className="font-black border-b-2 border-slate-300 px-4">{new Date().toLocaleDateString()}</span>.</p>

        <p>During his/her tenure, we found him/her to be hardworking, dedicated, and committed to his/her duties. 
        He/She possesses a good character and has been an asset to our institution.</p>

        <p>We wish him/her all the very best for his/her future endeavors.</p>

        <div className="mt-32">
          <div className="w-56 h-12 border-b-2 border-slate-300 mb-2"></div>
          <p className="font-bold text-text-secondary uppercase text-sm">Authorized Signatory</p>
          <p className="font-black text-text-heading uppercase">{schoolProfile.name}</p>
        </div>
      </div>
    </div>
  );

  const AppraisalCertificate = ({ person, title = "Outstanding Performance" }: { person: any, title?: string }) => (
    <div className="w-[1000px] h-[700px] bg-white p-12 shadow-2xl border-[20px] border-double border-primary/20 relative mx-auto overflow-hidden">
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div className="border-4 border-primary/10 h-full w-full p-12 flex flex-col items-center justify-center text-center relative z-10">
        <div className="mb-8 p-6 bg-primary/5 rounded-full">
          <Trophy size={60} className="text-primary" />
        </div>
        <h1 className="text-5xl font-black text-primary uppercase tracking-tighter mb-4">Certificate of Appraisal</h1>
        <p className="text-xl font-bold text-text-sub uppercase tracking-[0.3em] mb-12">This is awarded to</p>
        
        <h2 className="text-6xl font-black text-text-heading mb-8 font-serif italic">{person.name} {person.surname}</h2>
        
        <div className="w-64 h-1 bg-primary mb-8"></div>
        
        <p className="text-2xl font-bold text-text-sub max-w-2xl leading-relaxed">
          In recognition of your <span className="text-primary font-black">{title}</span> and exceptional contribution to the school's sports and extracurricular activities.
        </p>

        <div className="flex justify-between w-full mt-16 px-12">
          <div className="text-center">
            <div className="w-40 h-px bg-slate-300 mb-2"></div>
            <p className="text-[10px] font-bold text-text-secondary uppercase">Activity Coordinator</p>
          </div>
          <div className="text-center">
            <div className="w-40 h-px bg-slate-300 mb-2"></div>
            <p className="text-[10px] font-bold text-text-secondary uppercase">Principal</p>
          </div>
        </div>
      </div>
    </div>
  );

  const HostelCard = ({ student }: { student: any }) => (
    <div className="w-[350px] h-[500px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 relative flex flex-col">
      <div className="bg-emerald-600 p-6 text-white text-center">
        <h2 className="text-lg font-black uppercase tracking-tight">{schoolProfile.name}</h2>
        <p className="text-[10px] opacity-80 font-medium mt-1 uppercase tracking-widest">Hostel Identity Card</p>
      </div>
      <div className="flex-1 flex flex-col items-center pt-8 px-6">
        <div className="w-28 h-28 rounded-full border-4 border-emerald-100 p-1 mb-6">
          <div className="w-full h-full rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-3xl overflow-hidden">
            {student.photo ? <img src={student.photo} alt="" className="w-full h-full object-cover" /> : student.name[0]}
          </div>
        </div>
        <h3 className="text-xl font-black text-text-heading text-center uppercase">{student.name} {student.surname}</h3>
        <div className="w-full mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-[9px] font-bold text-text-secondary uppercase mb-1">Room No</p>
              <p className="text-sm font-black text-emerald-600">H-402</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-[9px] font-bold text-text-secondary uppercase mb-1">Block</p>
              <p className="text-sm font-black text-emerald-600">A-Block</p>
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <p className="text-[9px] font-bold text-text-secondary uppercase mb-1">Warden Contact</p>
            <p className="text-sm font-black text-text-heading">+91 99887 76655</p>
          </div>
        </div>
      </div>
      <div className="p-6 flex justify-center">
        <QrCode size={60} className="text-emerald-600 opacity-20" />
      </div>
      <div className="h-2 bg-emerald-600 w-full"></div>
    </div>
  );

  const TransferCertificate = ({ student }: { student: any }) => (
    <div className="w-[800px] min-h-[1000px] bg-white p-16 shadow-2xl border-[12px] border-double border-primary/20 relative mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-primary uppercase tracking-tighter mb-2">{schoolProfile.name}</h1>
        <p className="text-text-sub font-bold uppercase tracking-widest text-sm">{schoolProfile.address}</p>
        <div className="w-32 h-1 bg-primary mx-auto mt-6"></div>
        <h2 className="text-3xl font-black text-text-heading mt-8 uppercase underline underline-offset-8">Transfer Certificate</h2>
      </div>

      <div className="space-y-8 text-lg leading-loose">
        <div className="flex justify-between font-bold text-text-secondary">
          <span>Sl. No: TC/2024/042</span>
          <span>Admission No: {student.studentId}</span>
        </div>

        <p>This is to certify that <span className="font-black border-b-2 border-slate-300 px-4">{student.name} {student.surname}</span>, 
        Son/Daughter of <span className="font-black border-b-2 border-slate-300 px-4">{student.fatherName}</span> and 
        <span className="font-black border-b-2 border-slate-300 px-4">{student.motherName || 'N/A'}</span> was admitted to this school on 
        <span className="font-black border-b-2 border-slate-300 px-4">01/04/2022</span> on a Transfer Certificate from 
        <span className="font-black border-b-2 border-slate-300 px-4">Global Public School</span> and left on 
        <span className="font-black border-b-2 border-slate-300 px-4">15/03/2024</span> with a <span className="font-black border-b-2 border-slate-300 px-4">Good</span> character.</p>

        <p>He/She was then studying in the <span className="font-black border-b-2 border-slate-300 px-4">{student.class}</span> class. 
        All sums due to the school on his/her account have been remitted.</p>

        <div className="grid grid-cols-2 gap-12 mt-20">
          <div>
            <p className="font-bold text-text-secondary uppercase text-xs mb-1">Date of Issue</p>
            <p className="font-black text-text-heading">18/03/2024</p>
          </div>
          <div className="text-right">
            <div className="w-48 h-12 border-b-2 border-slate-300 ml-auto mb-2"></div>
            <p className="font-bold text-text-secondary uppercase text-xs">Principal's Signature</p>
          </div>
        </div>
      </div>
    </div>
  );

  const AwardCertificate = ({ student, awardTitle = "Excellence in Academics" }: { student: any, awardTitle?: string }) => (
    <div className="w-[1000px] h-[700px] bg-white p-12 shadow-2xl border-[20px] border-double border-amber-400 relative mx-auto overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <Trophy className="w-full h-full scale-150 rotate-12" />
      </div>
      
      <div className="border-4 border-amber-200 h-full w-full p-12 flex flex-col items-center justify-center text-center relative z-10">
        <Trophy size={80} className="text-amber-500 mb-8" />
        <h1 className="text-5xl font-black text-amber-600 uppercase tracking-tighter mb-4">Certificate of Achievement</h1>
        <p className="text-xl font-bold text-text-sub uppercase tracking-[0.3em] mb-12">This award is proudly presented to</p>
        
        <h2 className="text-6xl font-black text-text-heading mb-8 font-serif italic">{student.name} {student.surname}</h2>
        
        <div className="w-64 h-1 bg-amber-400 mb-8"></div>
        
        <p className="text-2xl font-bold text-text-sub max-w-2xl leading-relaxed">
          In recognition of your outstanding <span className="text-amber-600 font-black">{awardTitle}</span> during the academic session 2023-24.
        </p>

        <div className="flex justify-between w-full mt-16 px-12">
          <div className="text-center">
            <div className="w-48 h-px bg-slate-300 mb-2"></div>
            <p className="text-xs font-bold text-text-secondary uppercase">Class Teacher</p>
          </div>
          <div className="text-center">
            <div className="w-48 h-px bg-slate-300 mb-2"></div>
            <p className="text-xs font-bold text-text-secondary uppercase">Principal</p>
          </div>
        </div>
      </div>
    </div>
  );

  const MigrationCertificate = ({ student }: { student: any }) => (
    <div className="w-[800px] min-h-[1000px] bg-white p-16 shadow-2xl border-[12px] border-double border-indigo-400/20 relative mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-indigo-600 uppercase tracking-tighter mb-2">{schoolProfile.name}</h1>
        <p className="text-text-sub font-bold uppercase tracking-widest text-sm">{schoolProfile.address}</p>
        <div className="w-32 h-1 bg-indigo-600 mx-auto mt-6"></div>
        <h2 className="text-3xl font-black text-text-heading mt-8 uppercase underline underline-offset-8">Migration Certificate</h2>
      </div>

      <div className="space-y-8 text-lg leading-loose">
        <div className="flex justify-between font-bold text-text-secondary">
          <span>Sl. No: MC/2024/{Math.floor(Math.random() * 1000)}</span>
          <span>Admission No: {student.studentId}</span>
        </div>

        <p className="mt-10">This is to certify that <span className="font-black border-b-2 border-slate-300 px-4">{student.name} {student.surname}</span>, 
        Son/Daughter of <span className="font-black border-b-2 border-slate-300 px-4">{student.fatherName}</span>, 
        a student of this school in <span className="font-black border-b-2 border-slate-300 px-4">{student.class}</span>, 
        is hereby granted this Migration Certificate at his/her own request.</p>

        <p>The school has no objection to his/her continuing his/her studies in any other recognized University/Board.</p>
        
        <p>His/Her date of birth as per school records is <span className="font-black border-b-2 border-slate-300 px-4">{student.dob || '01/01/2010'}</span>.</p>

        <div className="grid grid-cols-2 gap-12 mt-32">
          <div>
            <p className="font-bold text-text-secondary uppercase text-xs mb-1">Date of Issue</p>
            <p className="font-black text-text-heading">{new Date().toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <div className="w-48 h-12 border-b-2 border-slate-300 ml-auto mb-2"></div>
            <p className="font-bold text-text-secondary uppercase text-xs">Principal's Signature</p>
          </div>
        </div>
      </div>
    </div>
  );

  const [bulkMode, setBulkMode] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async (person: any) => {
    const element = document.getElementById(`card-${person.id || person.studentId}`);
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: orientation === 'portrait' ? 'portrait' : 'landscape',
        unit: 'px',
        format: orientation === 'portrait' ? [canvas.width, canvas.height] : [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${activeTab}-${person.name}-${person.studentId || person.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try printing instead.');
    }
  };

  const handleBulkDownload = async () => {
    alert('Bulk download started. This may take a moment...');
    for (const p of filteredPeople) {
      await handleDownloadPDF(p);
      // Small delay to prevent browser from blocking multiple downloads
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-heading tracking-tight">ID Cards & Certificates 🪪</h1>
          <p className="text-text-sub font-medium">Generate professional identity cards and official certificates.</p>
        </div>
        {selectedPerson && (
          <div className="flex items-center gap-4 no-print">
            {(activeTab === 'student' || activeTab === 'teacher') && (
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button 
                  onClick={() => setOrientation('portrait')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${orientation === 'portrait' ? 'bg-white text-primary shadow-sm' : 'text-text-secondary hover:text-primary'}`}
                >
                  Portrait
                </button>
                <button 
                  onClick={() => setOrientation('landscape')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${orientation === 'landscape' ? 'bg-white text-primary shadow-sm' : 'text-text-secondary hover:text-primary'}`}
                >
                  Landscape
                </button>
              </div>
            )}
            <button 
              onClick={() => setSelectedPerson(null)}
              className="flex items-center gap-2 text-text-sub hover:text-primary font-bold transition-all"
            >
              <ArrowRightLeft size={18} className="rotate-180" /> Back to List
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit no-print">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSelectedPerson(null);
              setBulkMode(false);
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-text-sub hover:text-text-heading hover:bg-white/50'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Selection Sidebar */}
        <div className="lg:col-span-1 space-y-6 no-print">
          <Card className="p-6">
            <h3 className="font-bold text-text-heading mb-4 flex items-center gap-2">
              <Filter size={18} className="text-primary" />
              Selection Filter
            </h3>
            <div className="space-y-4">
              {(activeTab !== 'teacher' && activeTab !== 'experience') && (
                <>
                  <div>
                    <label className="label-text">Select Class</label>
                    <select 
                      className="input-field text-sm"
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                    >
                      <option value="">All Classes</option>
                      {masterData.classes.map((c: string) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-text">Select Section</label>
                    <select 
                      className="input-field text-sm"
                      value={selectedSection}
                      onChange={(e) => setSelectedSection(e.target.value)}
                    >
                      <option value="">All Sections</option>
                      {masterData.sections.map((s: string) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </>
              )}
              {selectedClass && activeTab !== 'teacher' && activeTab !== 'experience' && (
                <button 
                  onClick={() => {
                    setBulkMode(!bulkMode);
                    setSelectedPerson(null);
                  }}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    bulkMode 
                      ? 'bg-primary text-white shadow-lg' 
                      : 'bg-white border border-slate-200 text-text-heading hover:bg-slate-50'
                  }`}
                >
                  <FileOutput size={18} />
                  {bulkMode ? 'Exit Bulk Mode' : 'Generate All Certs'}
                </button>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-text-heading mb-4">Select {activeTab === 'teacher' || activeTab === 'experience' ? 'Staff' : 'Student'}</h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {filteredPeople.map((person: any) => (
                <button
                  key={person.id}
                  onClick={() => setSelectedPerson(person)}
                  className={`w-full text-left p-3 rounded-xl font-bold text-sm transition-all border ${
                    selectedPerson?.id === person.id
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-slate-50 border-transparent text-text-sub hover:border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{person.name} {person.surname}</span>
                    <span className="text-[10px] opacity-60">{person.studentId || person.id}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-3">
          {bulkMode ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-0 z-20 no-print">
                <div>
                  <h3 className="font-black text-text-heading">Bulk Generation Mode</h3>
                  <p className="text-xs text-text-sub">Generating {filteredPeople.length} {activeTab}s for Class {selectedClass}</p>
                </div>
                <div className="flex items-center gap-2 no-print">
                  <button onClick={handleBulkDownload} className="btn-secondary flex items-center gap-2">
                    <Download size={20} />
                    Download All
                  </button>
                  <button onClick={handlePrint} className="btn-primary flex items-center gap-2">
                    <Printer size={20} />
                    Print All
                  </button>
                </div>
              </div>
              <div className="space-y-12">
                {filteredPeople.map((p: any) => (
                  <div key={p.id} className="flex flex-col items-center">
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
                      {activeTab === 'student' && <div id={`card-${p.id || p.studentId}`}><IDCard person={p} orientation={orientation} /></div>}
                      {activeTab === 'teacher' && <div id={`card-${p.id || p.studentId}`}><IDCard person={p} type="teacher" orientation={orientation} /></div>}
                      {activeTab === 'hostel' && <div id={`card-${p.id || p.studentId}`}><HostelCard student={p} /></div>}
                      {activeTab === 'transfer' && <div id={`card-${p.id || p.studentId}`}><TransferCertificate student={p} /></div>}
                      {activeTab === 'migration' && <div id={`card-${p.id || p.studentId}`}><MigrationCertificate student={p} /></div>}
                      {activeTab === 'awards' && <div id={`card-${p.id || p.studentId}`}><AwardCertificate student={p} /></div>}
                      {activeTab === 'appraisal' && <div id={`card-${p.id || p.studentId}`}><AppraisalCertificate person={p} /></div>}
                      {activeTab === 'marksheet' && (
                        <div id={`card-${p.id || p.studentId}`}>
                          <MarkSheet 
                            student={p} 
                            results={examResults.filter((r: any) => r.studentId === p.studentId)} 
                          />
                        </div>
                      )}
                    </div>
                    <div className="w-full border-b-2 border-dashed border-slate-300 my-8 no-print"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Card className="p-12 min-h-[600px] flex flex-col items-center justify-center bg-slate-50/50 border-dashed border-2 border-slate-200">
              {selectedPerson ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-8"
                >
                  <div className="bg-white p-4 rounded-[32px] shadow-2xl" id={`card-${selectedPerson.id || selectedPerson.studentId}`}>
                    {activeTab === 'student' && <IDCard person={selectedPerson} orientation={orientation} />}
                    {activeTab === 'teacher' && <IDCard person={selectedPerson} type="teacher" orientation={orientation} />}
                    {activeTab === 'hostel' && <HostelCard student={selectedPerson} />}
                    {activeTab === 'transfer' && <TransferCertificate student={selectedPerson} />}
                    {activeTab === 'migration' && <MigrationCertificate student={selectedPerson} />}
                    {activeTab === 'awards' && <AwardCertificate student={selectedPerson} />}
                    {activeTab === 'experience' && <ExperienceCertificate staff={selectedPerson} />}
                    {activeTab === 'appraisal' && <AppraisalCertificate person={selectedPerson} />}
                    {activeTab === 'marksheet' && (
                      <MarkSheet 
                        student={selectedPerson} 
                        results={examResults.filter((r: any) => r.studentId === selectedPerson.studentId)} 
                      />
                    )}
                  </div>

                  <div className="flex gap-4 no-print">
                    <button 
                      onClick={() => window.print()}
                      className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                    >
                      <Printer size={20} />
                      Print Document
                    </button>
                    <button 
                      onClick={() => handleDownloadPDF(selectedPerson)}
                      className="flex items-center gap-2 bg-white border border-slate-200 px-8 py-4 rounded-2xl font-black hover:bg-slate-50 transition-all"
                    >
                      <Download size={20} />
                      Download PDF
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center space-y-4 no-print">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                    <UserCircle size={40} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-text-heading">No Selection</h4>
                    <p className="text-text-sub max-w-xs mx-auto">Please select a {activeTab === 'teacher' || activeTab === 'experience' ? 'staff member' : 'student'} from the sidebar to preview their {tabs.find(t => t.id === activeTab)?.label}.</p>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const ExaminationModule = ({ 
  students, 
  masterData, 
  currentUser, 
  exams, 
  setExams, 
  examSchedules, 
  setExamSchedules, 
  examResults, 
  setExamResults 
}: any) => {
  const [activeTab, setActiveTab] = useState<'setup' | 'schedule' | 'marks' | 'report' | 'stats'>('setup');
  
  // Exam Setup Form
  const [examForm, setExamForm] = useState({
    name: '',
    type: 'Main',
    startDate: '',
    endDate: '',
    status: 'Upcoming' as Exam['status']
  });

  // Exam Schedule Form
  const [scheduleForm, setScheduleForm] = useState({
    examId: '',
    class: '',
    section: '',
    subject: '',
    date: '',
    startTime: '',
    endTime: '',
    room: ''
  });

  // Marks Entry Form
  const [marksForm, setMarksForm] = useState<any>({});

  const handleAddExam = () => {
    if (!examForm.name || !examForm.startDate) return;
    const newExam: Exam = {
      ...examForm,
      id: Date.now().toString()
    };
    setExams([...exams, newExam]);
    setExamForm({ name: '', type: 'Main', startDate: '', endDate: '', status: 'Upcoming' });
  };

  const handleAddSchedule = () => {
    if (!scheduleForm.examId || !scheduleForm.class || !scheduleForm.subject) return;
    const newSchedule: ExamSchedule = {
      ...scheduleForm,
      id: Date.now().toString()
    };
    setExamSchedules([...examSchedules, newSchedule]);
    setScheduleForm({ examId: '', class: '', section: '', subject: '', date: '', startTime: '', endTime: '', room: '' });
  };

  const handleSaveMarks = (scheduleId: string, studentId: string, studentName: string) => {
    const data = marksForm[`${scheduleId}_${studentId}`] || {};
    if (data.marks === undefined) return;

    const passMarks = 33; // Mock pass marks
    const status = data.marks >= passMarks ? 'Pass' : 'Fail';
    
    // Simple grading logic
    let grade = 'F';
    if (data.marks >= 90) grade = 'A+';
    else if (data.marks >= 80) grade = 'A';
    else if (data.marks >= 70) grade = 'B';
    else if (data.marks >= 60) grade = 'C';
    else if (data.marks >= 50) grade = 'D';
    else if (data.marks >= 33) grade = 'E';

    const newResult: ExamResult = {
      id: Date.now().toString(),
      examScheduleId: scheduleId,
      studentId,
      studentName,
      marks: Number(data.marks),
      maxMarks: 100,
      grade,
      status,
      feedback: data.feedback || '',
      teacherId: currentUser.id
    };

    // Update or add result
    const existingIdx = examResults.findIndex((r: any) => r.examScheduleId === scheduleId && r.studentId === studentId);
    if (existingIdx > -1) {
      const updated = [...examResults];
      updated[existingIdx] = newResult;
      setExamResults(updated);
    } else {
      setExamResults([...examResults, newResult]);
    }
  };

  const filteredSchedules = currentUser?.role === 'student'
    ? examSchedules.filter((s: any) => s.class === currentUser.class && s.section === currentUser.section)
    : examSchedules;

  // Statistics Calculation
  const getStats = () => {
    const stats: any = {
      byClass: {},
      bySection: {},
      bySubject: {}
    };

    examResults.forEach((res: any) => {
      const schedule = examSchedules.find((s: any) => s.id === res.examScheduleId);
      if (!schedule) return;

      const keys = [
        { type: 'byClass', key: schedule.class },
        { type: 'bySection', key: `${schedule.class}-${schedule.section}` },
        { type: 'bySubject', key: schedule.subject }
      ];

      keys.forEach(({ type, key }) => {
        if (!stats[type][key]) {
          stats[type][key] = { total: 0, pass: 0, fail: 0 };
        }
        stats[type][key].total++;
        if (res.status === 'Pass') stats[type][key].pass++;
        else stats[type][key].fail++;
      });
    });

    return stats;
  };

  const stats = getStats();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Examination Management 📝</h1>
          <p className="text-text-secondary">Manage exams, schedules, question papers, and results.</p>
        </div>
      </div>

      <div className="flex gap-4 p-1 bg-slate-100 rounded-2xl w-fit">
        {[
          { id: 'setup', label: 'Exam Setup', icon: Settings, adminOnly: true },
          { id: 'schedule', label: 'Schedule & Papers', icon: Calendar },
          { id: 'marks', label: 'Marks Entry', icon: FileEdit, teacherOnly: true },
          { id: 'report', label: 'Report Cards', icon: ClipboardList },
          { id: 'stats', label: 'Statistics', icon: BarChart3, adminOnly: true }
        ].filter(tab => {
          if (tab.adminOnly && currentUser?.role !== 'admin') return false;
          if (tab.teacherOnly && currentUser?.role !== 'admin' && currentUser?.role !== 'teacher') return false;
          return true;
        }).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-text-sub hover:bg-white/50'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'setup' && (
          <motion.div key="setup" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-1">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                  <Plus size={20} /> Create New Exam
                </h3>
                <div className="space-y-4">
                  <Input label="Exam Name" placeholder="e.g. First Terminal" value={examForm.name} onChange={(e: any) => setExamForm({...examForm, name: e.target.value})} />
                  <Select label="Exam Type" options={['Main', 'Unit Test', 'Practical', 'Viva']} value={examForm.type} onChange={(e: any) => setExamForm({...examForm, type: e.target.value})} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Start Date" type="date" value={examForm.startDate} onChange={(e: any) => setExamForm({...examForm, startDate: e.target.value})} />
                    <Input label="End Date" type="date" value={examForm.endDate} onChange={(e: any) => setExamForm({...examForm, endDate: e.target.value})} />
                  </div>
                  <Select label="Status" options={['Upcoming', 'Ongoing', 'Completed']} value={examForm.status} onChange={(e: any) => setExamForm({...examForm, status: e.target.value})} />
                  <button onClick={handleAddExam} className="btn-primary w-full py-3 mt-4">Create Exam</button>
                </div>
              </Card>

              <Card className="lg:col-span-2">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                  <ClipboardList size={20} /> Exam List
                </h3>
                <div className="space-y-4">
                  {exams.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-text-sub">No exams created yet.</p>
                    </div>
                  ) : (
                    exams.map((exam: any) => (
                      <div key={exam.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-lg">{exam.name}</h4>
                          <p className="text-sm text-text-sub">{exam.type} | {exam.startDate} to {exam.endDate}</p>
                        </div>
                        <span className={`px-4 py-1 rounded-full text-xs font-bold ${
                          exam.status === 'Ongoing' ? 'bg-green-100 text-green-600' : 
                          exam.status === 'Upcoming' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {exam.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'schedule' && (
          <motion.div key="schedule" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {(currentUser?.role === 'admin' || currentUser?.role === 'teacher') && (
                <Card className="lg:col-span-1">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                    <Calendar size={20} /> Schedule Exam
                  </h3>
                  <div className="space-y-4">
                    <Select label="Select Exam" options={exams.map(e => e.name)} value={exams.find(e => e.id === scheduleForm.examId)?.name || ''} onChange={(e: any) => setScheduleForm({...scheduleForm, examId: exams.find(ex => ex.name === e.target.value)?.id || ''})} />
                    <Select label="Class" options={masterData.classes} value={scheduleForm.class} onChange={(e: any) => setScheduleForm({...scheduleForm, class: e.target.value})} />
                    <Select label="Section" options={masterData.sections} value={scheduleForm.section} onChange={(e: any) => setScheduleForm({...scheduleForm, section: e.target.value})} />
                    <Select label="Subject" options={masterData.subjects} value={scheduleForm.subject} onChange={(e: any) => setScheduleForm({...scheduleForm, subject: e.target.value})} />
                    <Input label="Date" type="date" value={scheduleForm.date} onChange={(e: any) => setScheduleForm({...scheduleForm, date: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Start Time" type="time" value={scheduleForm.startTime} onChange={(e: any) => setScheduleForm({...scheduleForm, startTime: e.target.value})} />
                      <Input label="End Time" type="time" value={scheduleForm.endTime} onChange={(e: any) => setScheduleForm({...scheduleForm, endTime: e.target.value})} />
                    </div>
                    <Input label="Room No" value={scheduleForm.room} onChange={(e: any) => setScheduleForm({...scheduleForm, room: e.target.value})} />
                    <button onClick={handleAddSchedule} className="btn-primary w-full py-3 mt-4">Schedule Exam</button>
                  </div>
                </Card>
              )}

              <Card className={(currentUser?.role === 'admin' || currentUser?.role === 'teacher') ? "lg:col-span-2" : "lg:col-span-3"}>
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                  <Clock size={20} /> Exam Time Table
                </h3>
                <div className="space-y-6">
                  {filteredSchedules.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-text-sub">No exams scheduled yet.</p>
                    </div>
                  ) : (
                    filteredSchedules.map((s: any) => (
                      <div key={s.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-bold text-lg">{s.subject}</h4>
                            <p className="text-sm text-text-sub">{s.class} - {s.section} | Room: {s.room}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-primary block">{s.date}</span>
                            <span className="text-[10px] text-text-sub">{s.startTime} - {s.endTime}</span>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all">
                            <Upload size={14} /> Question Paper
                          </button>
                          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all">
                            <Upload size={14} /> Answer Sheet
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'marks' && (
          <motion.div key="marks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                <FileEdit size={20} /> Enter Marks & Feedback
              </h3>
              <div className="space-y-8">
                {examSchedules.map((s: any) => (
                  <div key={s.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="mb-6">
                      <h4 className="font-bold text-xl">{s.subject} ({s.class}-{s.section})</h4>
                      <p className="text-sm text-text-sub">Exam: {exams.find(e => e.id === s.examId)?.name}</p>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-slate-200">
                            <th className="pb-3 px-4">Student Name</th>
                            <th className="pb-3 px-4 w-32">Marks (100)</th>
                            <th className="pb-3 px-4">Feedback</th>
                            <th className="pb-3 px-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {students.filter((st: any) => st.class === s.class && st.section === s.section).map((student: any) => {
                            const result = examResults.find((r: any) => r.examScheduleId === s.id && r.studentId === student.studentId);
                            const currentData = marksForm[`${s.id}_${student.studentId}`] || { marks: result?.marks || '', feedback: result?.feedback || '' };

                            return (
                              <tr key={student.studentId} className="border-b border-slate-100 last:border-0">
                                <td className="py-4 px-4 font-medium">{student.name} {student.surname}</td>
                                <td className="py-4 px-4">
                                  <input 
                                    type="number" 
                                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={currentData.marks}
                                    onChange={(e) => setMarksForm({...marksForm, [`${s.id}_${student.studentId}`]: { ...currentData, marks: e.target.value }})}
                                  />
                                </td>
                                <td className="py-4 px-4">
                                  <input 
                                    type="text" 
                                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="Teacher's feedback"
                                    value={currentData.feedback}
                                    onChange={(e) => setMarksForm({...marksForm, [`${s.id}_${student.studentId}`]: { ...currentData, feedback: e.target.value }})}
                                  />
                                </td>
                                <td className="py-4 px-4 text-right">
                                  <button 
                                    onClick={() => handleSaveMarks(s.id, student.studentId, `${student.name} ${student.surname}`)}
                                    className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary-dark transition-all"
                                  >
                                    Save
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'report' && (
          <motion.div key="report" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {students.filter(s => currentUser?.role === 'student' ? s.studentId === currentUser.id : true).map((student: any) => (
                <Card key={student.studentId} className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16"></div>
                  <div className="flex items-center gap-6 mb-8">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.studentId}`} 
                      alt="Avatar" 
                      className="w-20 h-20 rounded-2xl bg-slate-100 border-4 border-white shadow-lg"
                    />
                    <div>
                      <h3 className="text-2xl font-black text-text-heading tracking-tighter uppercase">{student.name} {student.surname}</h3>
                      <p className="text-sm text-text-sub font-bold uppercase tracking-widest">{student.class} - Section {student.section}</p>
                      <p className="text-xs text-text-sub">Student ID: {student.studentId}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-primary uppercase tracking-wider border-b border-slate-100 pb-2">Academic Performance</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-[10px] font-bold text-text-secondary uppercase tracking-wider border-b border-slate-200">
                            <th className="pb-3">Subject</th>
                            <th className="pb-3 text-center">Marks</th>
                            <th className="pb-3 text-center">Grade</th>
                            <th className="pb-3 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {examSchedules.filter(s => s.class === student.class && s.section === student.section).map((s: any) => {
                            const result = examResults.find(r => r.examScheduleId === s.id && r.studentId === student.studentId);
                            return (
                              <tr key={s.id} className="border-b border-slate-100 last:border-0">
                                <td className="py-3 font-medium">{s.subject}</td>
                                <td className="py-3 text-center font-bold">{result?.marks || '-'} / 100</td>
                                <td className="py-3 text-center">
                                  <span className="px-3 py-1 bg-slate-100 rounded-lg font-bold text-xs">{result?.grade || '-'}</span>
                                </td>
                                <td className="py-3 text-center">
                                  {result ? (
                                    <span className={`px-3 py-1 rounded-lg font-bold text-[10px] uppercase tracking-widest ${
                                      result.status === 'Pass' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                    }`}>
                                      {result.status}
                                    </span>
                                  ) : '-'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Teacher Feedback Section */}
                    <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <h5 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Teacher's Remarks</h5>
                      <div className="space-y-2">
                        {examSchedules.filter(s => s.class === student.class && s.section === student.section).map((s: any) => {
                          const result = examResults.find(r => r.examScheduleId === s.id && r.studentId === student.studentId);
                          if (!result?.feedback) return null;
                          return (
                            <div key={s.id} className="text-xs italic text-text-secondary">
                              <span className="font-bold not-italic text-primary">{s.subject}:</span> "{result.feedback}"
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <button className="w-full mt-6 flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl">
                      <Download size={20} /> Download Report Card
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'stats' && (
          <motion.div key="stats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-6">Class-wise Performance</h4>
                  <div className="space-y-4">
                    {Object.entries(stats.byClass).map(([className, data]: any) => {
                      const passRate = ((data.pass / data.total) * 100).toFixed(1);
                      return (
                        <div key={className} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-bold">{className}</span>
                            <span className="text-text-sub">{passRate}% Pass</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                            <div className="h-full bg-green-500" style={{ width: `${passRate}%` }}></div>
                            <div className="h-full bg-red-500" style={{ width: `${100 - Number(passRate)}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                <Card>
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-6">Section-wise Performance</h4>
                  <div className="space-y-4">
                    {Object.entries(stats.bySection).map(([sectionName, data]: any) => {
                      const passRate = ((data.pass / data.total) * 100).toFixed(1);
                      return (
                        <div key={sectionName} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-bold">{sectionName}</span>
                            <span className="text-text-sub">{passRate}% Pass</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                            <div className="h-full bg-green-500" style={{ width: `${passRate}%` }}></div>
                            <div className="h-full bg-red-500" style={{ width: `${100 - Number(passRate)}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                <Card>
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-6">Subject-wise Performance</h4>
                  <div className="space-y-4">
                    {Object.entries(stats.bySubject).map(([subject, data]: any) => {
                      const passRate = ((data.pass / data.total) * 100).toFixed(1);
                      return (
                        <div key={subject} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-bold">{subject}</span>
                            <span className="text-text-sub">{passRate}% Pass</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                            <div className="h-full bg-green-500" style={{ width: `${passRate}%` }}></div>
                            <div className="h-full bg-red-500" style={{ width: `${100 - Number(passRate)}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
