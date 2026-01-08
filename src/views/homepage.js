import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, LayoutDashboard } from 'lucide-react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import LoginModal from '../components/loginModal';

function Homepage({ isAdminLoggedIn, onLoginSuccess, onLogout }) {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [surveyTopics, setSurveyTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const surveysRef = collection(db, 'surveys');
      const querySnapshot = await getDocs(surveysRef);
      const surveys = [];
      const today = new Date().toISOString().split('T')[0];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        if (!data.active) return;
        if (data.startDate > today) return;
        if (data.hasEndDate && data.endDate && data.endDate < today) return;

        surveys.push({
          id: doc.id,
          ...data
        });
      });

      setSurveyTopics(surveys);
    } catch (error) {
      console.error('Error fetching surveys:', error);
      alert('ไม่สามารถโหลดแบบประเมินได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = () => {
    if (isAdminLoggedIn) {
      navigate('/admin');
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = () => {
    onLoginSuccess();
  };

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
  };

  const handleStartSurvey = () => {
    alert(`เริ่มทำแบบประเมิน: ${selectedTopic.title}`);
  };

  const handleBack = () => {
    setSelectedTopic(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (selectedTopic) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {selectedTopic.image && (
              <div className="w-full h-64 md:h-80 overflow-hidden">
                <img 
                  src={selectedTopic.image} 
                  alt={selectedTopic.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-pink-600 mb-4">
                {selectedTopic.intro || selectedTopic.title}
              </h2>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                {selectedTopic.description}
              </p>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>คำเตือน:</strong> แบบประเมินความเสี่ยงด้านสุขภาพนี้จัดทำขึ้นเพื่อให้ข้อมูลเบื้องต้นเท่านั้น 
                  ไม่ได้มีเจตนาให้นำไปใช้ทดแทนคำแนะนำทางการแพทย์แต่อย่างใด 
                  หากคุณรู้สึกถึงความผิดปกติที่เกิดขึ้น แนะนำให้เข้ารับการตรวจคัดกรองและปรึกษาแพทย์ผู้เชี่ยวชาญโดยตรง
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
                <p className="text-sm text-gray-700">
                  <strong>หมายเหตุ:</strong> กรณีพบว่ามีความเสี่ยง 
                  ท่านยินยอมให้โรงพยาบาลติดต่อกลับเพื่อให้ข้อมูลเพิ่มเติม
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleStartSurvey}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg text-lg transition-all duration-200 animate-pulse"
                >
                  ทดสอบว่าคุณมีความเสี่ยงแค่ไหน
                </button>
                <button
                  onClick={handleBack}
                  className="sm:w-32 bg-gray-500 hover:bg-gray-600 text-white font-medium py-4 px-6 rounded-xl transition-colors"
                >
                  ย้อนกลับ
                </button>
              </div>
            </div>
          </div>
        </div>

        <footer className="bg-gray-200 py-6 mt-12">
          <div className="max-w-4xl mx-auto px-4 text-center text-gray-600 text-sm">
            <p>แบบประเมินความเสี่ยงโดย แผนกสูตินรีเวช โรงพยาบาลสงขลา</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-2 sm:mb-0">
            <img 
              src="/hospital-logo.png.png" 
              alt="Logo" 
              className="h-10 sm:h-12"
            />

            {isAdminLoggedIn ? (
              <div className="flex items-center gap-2 sm:gap-3 bg-white/10 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-1 sm:gap-2 text-white hover:text-green-100 transition-colors"
                >
                  <LayoutDashboard size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="text-xs sm:text-sm font-medium">Dashboard</span>
                </button>
                <span className="text-white/50 text-xs sm:text-sm">|</span>
                <span className="text-xs sm:text-sm font-medium text-white">admin</span>
                <span className="text-white/50 text-xs sm:text-sm">|</span>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-green-100 transition-colors"
                  title="ออกจากระบบ"
                >
                  <LogIn size={16} className="rotate-180 sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdminLogin}
                className="flex items-center gap-1.5 sm:gap-2 text-white hover:bg-white/10 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors"
              >
                <LogIn size={18} className="sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium">Admin</span>
              </button>
            )}
          </div>

          <div className="mt-2 sm:mt-3">
            <p className="text-sm sm:text-base md:text-lg font-semibold leading-tight">
              ระบบประเมินความเสี่ยงด้านสุขภาพ
            </p>
            <p className="text-green-100 text-xs sm:text-sm mt-0.5 sm:mt-1">
              Health Risk Assessment System
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">กำลังโหลดแบบประเมิน...</p>
          </div>
        ) : surveyTopics.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">ยังไม่มีแบบประเมินในขณะนี้</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {surveyTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleSelectTopic(topic)}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-left"
              >
                {topic.image && (
                  <div className="h-48 overflow-hidden bg-gray-200">
                    <img 
                      src={topic.image} 
                      alt={topic.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {topic.diseaseInfo || topic.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-green-600 font-medium">
                      {topic.department}
                    </span>
                    <span className="text-green-600 font-bold text-sm">
                      เริ่มทำแบบประเมิน →
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <footer className="bg-gray-200 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>แบบประเมินความเสี่ยงโดย แผนกสูตินรีเวช โรงพยาบาลสงขลา</p>
        </div>
      </footer>

      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default Homepage;