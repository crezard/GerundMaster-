import React, { useState } from 'react';
import { AppView } from './types';
import LearnSection from './components/LearnSection';
import QuizSection from './components/QuizSection';
import ChatSection from './components/ChatSection';
import { BookOpen, Edit3, MessageCircle, GraduationCap, ChevronRight, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);

  const renderContent = () => {
    switch (currentView) {
      case AppView.LEARN:
        return <LearnSection />;
      case AppView.QUIZ:
        return <QuizSection />;
      case AppView.CHAT:
        return <ChatSection />;
      case AppView.HOME:
      default:
        return (
          <div className="max-w-6xl mx-auto space-y-16 py-12 px-4 animate-fade-in">
            {/* Hero Section */}
            <div className="text-center space-y-6 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-200/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
              
              <div className="inline-flex items-center justify-center p-5 bg-white rounded-[2rem] shadow-xl mb-6 animate-bounce-slow ring-4 ring-violet-50">
                <GraduationCap className="w-16 h-16 text-violet-600" />
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-slate-800 tracking-tight font-poppins">
                Gerund<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">Master</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                중3 영어의 핵심, <span className="text-violet-700 font-bold bg-violet-100 px-2 rounded-lg">동명사</span>를 
                가장 쉽고 재미있게 정복하는 방법!
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <button 
                onClick={() => setCurrentView(AppView.LEARN)}
                className="group relative bg-white p-8 rounded-[2.5rem] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 overflow-hidden text-left"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-125"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">개념 쏙쏙 학습</h3>
                  <p className="text-slate-500 mb-6 leading-relaxed">
                    동명사의 역할과 핵심 규칙,<br/>시험에 나오는 포인트만 정리!
                  </p>
                  <div className="flex items-center text-blue-600 font-bold group-hover:gap-2 transition-all">
                    시작하기 <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </button>

              <button 
                onClick={() => setCurrentView(AppView.QUIZ)}
                className="group relative bg-white p-8 rounded-[2.5rem] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 overflow-hidden text-left"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-125"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    <Edit3 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">AI 실전 퀴즈</h3>
                  <p className="text-slate-500 mb-6 leading-relaxed">
                    무한으로 생성되는 문제로<br/>내 실력을 테스트해보세요.
                  </p>
                  <div className="flex items-center text-amber-600 font-bold group-hover:gap-2 transition-all">
                    도전하기 <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </button>

              <button 
                onClick={() => setCurrentView(AppView.CHAT)}
                className="group relative bg-white p-8 rounded-[2.5rem] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 overflow-hidden text-left"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-violet-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-125"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mb-6 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">AI 튜터 질문</h3>
                  <p className="text-slate-500 mb-6 leading-relaxed">
                    모르는 게 생겼나요?<br/>GerundBot이 친절하게 알려줘요!
                  </p>
                  <div className="flex items-center text-violet-600 font-bold group-hover:gap-2 transition-all">
                    물어보기 <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-violet-200 selection:text-violet-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div 
              className="flex items-center gap-3 cursor-pointer group" 
              onClick={() => setCurrentView(AppView.HOME)}
            >
              <div className="bg-violet-100 p-2 rounded-xl group-hover:bg-violet-600 transition-colors duration-300">
                <GraduationCap className="w-6 h-6 text-violet-600 group-hover:text-white" />
              </div>
              <span className="font-poppins font-extrabold text-2xl text-slate-800 tracking-tight">
                Gerund<span className="text-violet-600">Master</span>
              </span>
            </div>
            
            <div className="hidden sm:flex space-x-2">
              {[
                { id: AppView.LEARN, label: '개념 학습', icon: BookOpen },
                { id: AppView.QUIZ, label: '실전 퀴즈', icon: Edit3 },
                { id: AppView.CHAT, label: 'AI 튜터', icon: MessageCircle }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                    currentView === item.id 
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' 
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-5rem)]">
        {renderContent()}
      </main>

      {/* Mobile Bottom Nav */}
      <div className="sm:hidden fixed bottom-6 left-4 right-4 bg-white/90 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl flex justify-around p-2 z-50 ring-1 ring-black/5">
        {[
          { id: AppView.HOME, icon: GraduationCap, label: '홈' },
          { id: AppView.LEARN, icon: BookOpen, label: '학습' },
          { id: AppView.QUIZ, icon: Edit3, label: '퀴즈' },
          { id: AppView.CHAT, icon: MessageCircle, label: '튜터' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl w-full transition-all ${
              currentView === item.id 
                ? 'text-violet-600 bg-violet-50' 
                : 'text-slate-400'
            }`}
          >
            <item.icon className={`w-6 h-6 ${currentView === item.id ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;