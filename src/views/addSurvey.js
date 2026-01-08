import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Trash2, GripVertical, Upload } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

function CreateSurveyPage() {
  const navigate = useNavigate();

  // Basic Information
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [diseaseInfo, setDiseaseInfo] = useState('');
  const [introText, setIntroText] = useState('');
  const [heroImage, setHeroImage] = useState(null);
  const [heroImagePreview, setHeroImagePreview] = useState(null);

  // Questions
  const [questions, setQuestions] = useState([
    { id: 1, question: '', answers: [{ id: 1, text: '', score: 0 }] }
  ]);

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Question Management
  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question: '',
      answers: [{ id: Date.now(), text: '', score: 0 }]
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleDeleteQuestion = (questionId) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== questionId));
    }
  };

  const handleQuestionChange = (questionId, value) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, question: value } : q
    ));
  };

  // Answer Management
  const handleAddAnswer = (questionId) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          answers: [...q.answers, { id: Date.now(), text: '', score: 0 }]
        };
      }
      return q;
    }));
  };

  const handleDeleteAnswer = (questionId, answerId) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.answers.length > 1) {
        return {
          ...q,
          answers: q.answers.filter(a => a.id !== answerId)
        };
      }
      return q;
    }));
  };

  const handleAnswerChange = (questionId, answerId, field, value) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          answers: q.answers.map(a =>
            a.id === answerId ? { ...a, [field]: value } : a
          )
        };
      }
      return q;
    }));
  };

  // Validation
  const validateForm = () => {
    if (!surveyTitle.trim()) {
      alert('❌ กรุณากรอกหัวข้อแบบประเมิน');
      return false;
    }

    if (!surveyDescription.trim()) {
      alert('❌ กรุณากรอกคำอธิบายแบบประเมิน');
      return false;
    }

    if (!department.trim()) {
      alert('❌ กรุณากรอกชื่อแผนก');
      return false;
    }

    if (!phone.trim()) {
      alert('❌ กรุณากรอกเบอร์ติดต่อ');
      return false;
    }

    // Check if all questions have text
    const emptyQuestions = questions.filter(q => !q.question.trim());
    if (emptyQuestions.length > 0) {
      alert('❌ กรุณากรอกคำถามให้ครบทุกข้อ');
      return false;
    }

    // Check if all answers have text
    for (let q of questions) {
      const emptyAnswers = q.answers.filter(a => !a.text.trim());
      if (emptyAnswers.length > 0) {
        alert('❌ กรุณากรอกคำตอบให้ครบทุกตัวเลือก');
        return false;
      }
    }

    return true;
  };

  // Submit
  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    try {
      let imageUrl = null;
  
      // Upload image if exists
      if (heroImage) {
        const imageRef = ref(storage, `surveys/${Date.now()}_${heroImage.name}`);
        await uploadBytes(imageRef, heroImage);
        imageUrl = await getDownloadURL(imageRef);
      }
  
      // Save to Firestore
      const surveyData = {
        title: surveyTitle,
        description: surveyDescription,
        department: department,
        phone: phone,
        diseaseInfo: diseaseInfo,
        intro: introText,
        heroImage: imageUrl,
        questions: questions,
        createdAt: new Date().toISOString(),
        active: true
      };
  
      await addDoc(collection(db, 'surveys'), surveyData);
  
      alert('✅ สร้างแบบประเมินสำเร็จ!');
      navigate('/admin');
    } catch (error) {
      console.error('Error saving survey:', error);
      alert('❌ เกิดข้อผิดพลาด: ' + error.message);
    }
  };

  // Back
  const handleBack = () => {
    if (window.confirm('คุณต้องการย้อนกลับหรือไม่? ข้อมูลที่ยังไม่ได้บันทึกจะหายไป')) {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Mobile Responsive */}
      <header className="border-b sticky top-0 bg-white z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-xl font-bold">สร้างแบบประเมินใหม่</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">
                กรอกข้อมูลเพื่อสร้างแบบประเมินความเสี่ยง
              </p>
            </div>
            
            <button 
              onClick={handleBack}
              className="text-gray-600 hover:text-black transition-colors p-2"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Basic Information - Mobile Responsive */}
        <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-12">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-1">ข้อมูลพื้นฐาน</h2>
            <p className="text-gray-500 text-xs sm:text-sm">กรอกรายละเอียดของแบบประเมิน</p>
          </div>

          {/* Survey Title */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              หัวข้อแบบประเมิน <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={surveyTitle}
              onChange={(e) => setSurveyTitle(e.target.value)}
              placeholder="เช่น แบบประเมินความเสี่ยงโรคเบาหวาน"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* Survey Description */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              คำอธิบายแบบประเมิน <span className="text-red-500">*</span>
            </label>
            <textarea
              value={surveyDescription}
              onChange={(e) => setSurveyDescription(e.target.value)}
              placeholder="อธิบายวัตถุประสงค์และรายละเอียดของแบบประเมิน"
              rows={3}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
            />
          </div>

          {/* Intro Text */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              ข้อความแนะนำ (แสดงด้านบนของหน้าแบบประเมิน)
            </label>
            <textarea
              value={introText}
              onChange={(e) => setIntroText(e.target.value)}
              placeholder="เช่น: เช็กซิ? คุณกำลังเสี่ยงมะเร็งปากมดลูกอยู่หรือไม่"
              rows={2}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
            />
          </div>

          {/* Department, Phone, Disease Info - Mobile Stacked */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                แผนก <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="เช่น ศูนย์นรีเวช"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                เบอร์ติดต่อ <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0-2596-7888 ต่อ 2401-2"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                ชื่อโรค/หัวข้อย่อย
              </label>
              <input
                type="text"
                value={diseaseInfo}
                onChange={(e) => setDiseaseInfo(e.target.value)}
                placeholder="เช่น Diabetes Type 2"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>

          {/* Hero Image Upload - Mobile Responsive */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              รูปภาพหน้าปก
            </label>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <label className="flex-1 w-full cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 sm:p-8 hover:border-black transition-colors">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Upload className="text-gray-400 mb-2" size={24} />
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">
                      คลิกเพื่ออัพโหลดรูปภาพ
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG สูงสุด 5MB
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {heroImagePreview && (
                <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden border border-gray-200">
                  <img 
                    src={heroImagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Questions Section - Mobile Responsive */}
        <div className="border-t pt-8 sm:pt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-1">คำถาม</h2>
              <p className="text-gray-500 text-xs sm:text-sm">เพิ่มคำถามและตัวเลือกคำตอบพร้อมคะแนน</p>
            </div>
            <button
              onClick={handleAddQuestion}
              className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
              เพิ่มคำถาม
            </button>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {questions.map((question, qIndex) => (
              <div key={question.id} className="bg-gray-50 rounded-2xl p-4 sm:p-6 relative">
                {/* Question Header - Mobile Responsive */}
                <div className="flex items-start gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="flex items-center gap-1 sm:gap-2 mt-2 sm:mt-3">
                    <GripVertical size={18} className="text-gray-400 cursor-move sm:w-5 sm:h-5" />
                    <span className="text-base sm:text-lg font-bold text-gray-400">
                      {qIndex + 1}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => handleQuestionChange(question.id, e.target.value)}
                      placeholder="พิมพ์คำถาม"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-0 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-base sm:text-lg font-medium"
                    />
                  </div>

                  {questions.length > 1 && (
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="mt-2 sm:mt-3 text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                      title="ลบคำถาม"
                    >
                      <Trash2 size={18} className="sm:w-5 sm:h-5" />
                    </button>
                  )}
                </div>

                {/* Answers - Mobile Responsive */}
                <div className="ml-6 sm:ml-11 space-y-3">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">ตัวเลือกคำตอบ</p>
                    <p className="text-xs text-gray-500 hidden sm:block">คะแนนสำหรับประเมินความเสี่ยง</p>
                  </div>
                  
                  {question.answers.map((answer, aIndex) => (
                    <div key={answer.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                      <span className="text-xs sm:text-sm text-gray-400 font-medium w-6 hidden sm:block">
                        {aIndex + 1}.
                      </span>
                      
                      <div className="flex items-center gap-2 w-full sm:flex-1">
                        <span className="text-xs text-gray-400 font-medium sm:hidden">
                          {aIndex + 1}.
                        </span>
                        <input
                          type="text"
                          value={answer.text}
                          onChange={(e) => handleAnswerChange(question.id, answer.id, 'text', e.target.value)}
                          placeholder="พิมพ์คำตอบ"
                          className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-0 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>

                      <div className="flex items-center gap-2 ml-8 sm:ml-0">
                        <input
                          type="number"
                          value={answer.score}
                          onChange={(e) => handleAnswerChange(question.id, answer.id, 'score', parseInt(e.target.value) || 0)}
                          placeholder="0"
                          className="w-16 sm:w-20 px-2 sm:px-3 py-2 sm:py-2.5 text-sm sm:text-base border-0 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-center"
                        />
                        <span className="text-xs text-gray-500">คะแนน</span>

                        {question.answers.length > 1 && (
                          <button
                            onClick={() => handleDeleteAnswer(question.id, answer.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors ml-1"
                            title="ลบคำตอบ"
                          >
                            <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => handleAddAnswer(question.id)}
                    className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-black font-medium mt-3 sm:mt-4 px-2 py-1"
                  >
                    <Plus size={14} className="sm:w-4 sm:h-4" />
                    เพิ่มคำตอบ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t">
          <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
            <span className="text-red-500">*</span> ช่องที่จำเป็นต้องกรอก
          </p>
          
          <button 
            onClick={handleSubmit}
            className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white px-6 sm:px-8 py-3 rounded-xl font-medium transition-colors"
          >
            สร้างแบบประเมิน
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateSurveyPage;