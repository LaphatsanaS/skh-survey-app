import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, BarChart3, ArrowRight, LogOut, Home } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();

  const handleCreateSurvey = () => {
    navigate('/admin/create-survey');
  };

  const handleViewResults = () => {
    alert('ดูผลการประเมิน - Coming soon!');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header - Mobile Responsive */}
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-base">A</span>
              </div>
              <div>
                <h1 className="font-bold text-base sm:text-lg">Admin Panel</h1>
                <p className="text-xs text-gray-500 hidden sm:block">ระบบจัดการแบบประเมิน</p>
              </div>
            </div>
            
            {/* Navigation Buttons - Mobile Responsive */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleBackToHome}
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 hover:text-black hover:bg-gray-100 px-2 sm:px-4 py-2 rounded-lg transition-colors"
              >
                <Home size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">กลับหน้าหลัก</span>
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-2 sm:px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">ออกจากระบบ</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Main Actions - Mobile Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-16">
          {/* Create Survey */}
          <button 
            onClick={handleCreateSurvey}
            className="group bg-black hover:bg-gray-800 text-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-left transition-all duration-200 hover:scale-105"
          >
            <div className="flex items-start justify-between mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <PlusCircle size={24} className="sm:w-8 sm:h-8" />
              </div>
              <ArrowRight className="text-white/60 group-hover:text-white transition-colors" size={20} />
            </div>
            <h2 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-3">
              สร้างแบบประเมินใหม่
            </h2>
            <p className="text-gray-400 text-sm sm:text-lg">
              เพิ่มแบบประเมินความเสี่ยงเข้าสู่ระบบ
            </p>
          </button>

          {/* View Results */}
          <button 
            onClick={handleViewResults}
            className="group bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-left transition-all duration-200 hover:scale-105"
          >
            <div className="flex items-start justify-between mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm">
                <BarChart3 size={24} className="text-black sm:w-8 sm:h-8" />
              </div>
              <ArrowRight className="text-gray-400 group-hover:text-black transition-colors" size={20} />
            </div>
            <h2 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-3 text-black">
              ดูผลการประเมิน
            </h2>
            <p className="text-gray-600 text-sm sm:text-lg">
              วิเคราะห์และดาวน์โหลดข้อมูล
            </p>
          </button>
        </div>

        {/* Quick Stats - Mobile Responsive */}
        <div className="border-t pt-8 sm:pt-12">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-4 sm:mb-6 uppercase tracking-wider">
            สถิติรวม
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            <div>
              <p className="text-3xl sm:text-5xl font-bold mb-1 sm:mb-2">12</p>
              <p className="text-gray-600 text-xs sm:text-base">แบบประเมินทั้งหมด</p>
            </div>
            <div>
              <p className="text-3xl sm:text-5xl font-bold mb-1 sm:mb-2">1.8K</p>
              <p className="text-gray-600 text-xs sm:text-base">คำตอบทั้งหมด</p>
            </div>
            <div>
              <p className="text-3xl sm:text-5xl font-bold mb-1 sm:mb-2">8</p>
              <p className="text-gray-600 text-xs sm:text-base">กำลังใช้งาน</p>
            </div>
            <div>
              <p className="text-3xl sm:text-5xl font-bold mb-1 sm:mb-2">43</p>
              <p className="text-gray-600 text-xs sm:text-base">วันนี้</p>
            </div>
          </div>
        </div>

        {/* Recent Activity - Mobile Responsive */}
        <div className="border-t mt-8 sm:mt-12 pt-8 sm:pt-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
              กิจกรรมล่าสุด
            </h3>
            <button className="text-xs sm:text-sm text-black hover:underline">
              ดูทั้งหมด →
            </button>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 sm:py-4 border-b gap-2 sm:gap-0">
              <div>
                <p className="font-medium text-sm sm:text-base">แบบประเมินมะเร็งปากมดลูก</p>
                <p className="text-xs sm:text-sm text-gray-500">มีคำตอบใหม่ 5 รายการ</p>
              </div>
              <span className="text-xs sm:text-sm text-gray-400">2 นาทีที่แล้ว</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 sm:py-4 border-b gap-2 sm:gap-0">
              <div>
                <p className="font-medium text-sm sm:text-base">แบบประเมินโรคหัวใจ</p>
                <p className="text-xs sm:text-sm text-gray-500">มีคำตอบใหม่ 3 รายการ</p>
              </div>
              <span className="text-xs sm:text-sm text-gray-400">15 นาทีที่แล้ว</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 sm:py-4 border-b gap-2 sm:gap-0">
              <div>
                <p className="font-medium text-sm sm:text-base">แบบประเมินโรคเบาหวาน</p>
                <p className="text-xs sm:text-sm text-gray-500">มีคำตอบใหม่ 8 รายการ</p>
              </div>
              <span className="text-xs sm:text-sm text-gray-400">1 ชั่วโมงที่แล้ว</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;