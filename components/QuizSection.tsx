import React, { useState } from 'react';
import { generateQuiz } from '../services/geminiService';
import { QuizQuestion } from '../types';
import { Play, RotateCcw, Check, X, BrainCircuit, Trophy, Star, Zap, ArrowRight, AlertCircle, Key, RefreshCw, Terminal } from 'lucide-react';

const QuizSection: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizMode, setQuizMode] = useState<'intro' | 'active' | 'result'>('intro');
  const [difficulty, setDifficulty] = useState<'basic' | 'advanced'>('basic');
  const [streak, setStreak] = useState(0);

  const startQuiz = async (level: 'basic' | 'advanced') => {
    setDifficulty(level);
    setLoading(true);
    setError(null);
    setQuestions([]);
    
    try {
      const generated = await generateQuiz(level);
      if (generated && generated.length > 0) {
        setQuestions(generated);
        setCurrentIdx(0);
        setScore(0);
        setStreak(0);
        setSelectedOption(null);
        setQuizMode('active');
      } else {
        setError("문제를 생성하지 못했습니다. 잠시 후 다시 시도해주세요.");
      }
    } catch (e: any) {
      if (e.message === "API_KEY_MISSING") {
        setError("API_KEY_MISSING");
      } else {
        setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenKeySettings = async () => {
    const win = window as any;
    if (win.aistudio) {
      try {
        await win.aistudio.openSelectKey();
        setError(null); // Clear error to allow retry
      } catch (e) {
        console.error(e);
      }
    } else {
        alert("Vercel 설정 페이지에서 환경 변수(VITE_VAIT_API_KEY)를 확인해주세요.");
    }
  };

  const handleAnswer = (optionIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIdx);
    
    if (optionIdx === questions[currentIdx].correctAnswerIndex) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(c => c + 1);
      setSelectedOption(null);
    } else {
      setQuizMode('result');
    }
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-8 animate-fade-in">
        <div className="relative">
          <div className="w-24 h-24 border-8 border-violet-100 border-t-violet-600 rounded-full animate-spin"></div>
          <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-violet-600 w-10 h-10 animate-pulse" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">GerundBot이 문제 생성 중...</h3>
          <p className="text-slate-500">최신 중3 기출 트렌드를 분석하고 있어요!</p>
        </div>
      </div>
    );
  }

  // Intro Screen (and Error State)
  if (quizMode === 'intro') {
    return (
      <div className="max-w-3xl mx-auto text-center py-12 px-4 animate-fade-in">
        <div className="inline-block p-4 bg-violet-100 rounded-3xl mb-8 animate-bounce-slow">
          <BrainCircuit className="w-16 h-16 text-violet-600" />
        </div>
        <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">
          AI 실전 퀴즈 도전
        </h2>
        <p className="text-lg text-slate-600 mb-12 max-w-lg mx-auto leading-relaxed">
          AI가 매번 새로운 문제를 만들어드려요.<br/>
          <span className="font-bold text-violet-600">기본 개념</span>부터 <span className="font-bold text-amber-600">심화 문제</span>까지 마스터해보세요!
        </p>

        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl flex flex-col items-center justify-center gap-4 text-red-600 animate-pulse">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              <span className="font-bold text-lg">
                {error === "API_KEY_MISSING" ? "API 키를 찾을 수 없습니다." : error}
              </span>
            </div>
            {error === "API_KEY_MISSING" && (
              <div className="flex flex-col items-center gap-2 w-full max-w-md">
                <div className="text-xs text-red-500 mt-2 bg-white/50 p-4 rounded-xl w-full text-left leading-relaxed border border-red-100 shadow-sm">
                   <strong className="text-red-700 block mb-2 text-sm border-b border-red-200 pb-1">⚡ 문제 해결 가이드</strong>
                   <ol className="list-decimal pl-4 space-y-1">
                     <li>Vercel 프로젝트 <strong>Settings &gt; Environment Variables</strong> 이동</li>
                     <li>Key: <code className="bg-red-100 px-1 rounded">VITE_VAIT_API_KEY</code> 입력</li>
                     <li>Value: 발급받은 API 키 입력 (AIzaSy...)</li>
                     <li><strong>중요:</strong> 변수 추가 후 <u className="font-bold text-red-700">Deployments 탭에서 Redeploy</u>를 꼭 해야 합니다!</li>
                   </ol>
                   
                   <div className="mt-4 pt-2 border-t border-red-200 text-[10px] text-slate-500 font-mono">
                     <div className="flex items-center gap-1 font-bold text-slate-600 mb-1">
                       <Terminal className="w-3 h-3" /> 환경 진단 정보
                     </div>
                     <div>Vite Mode: {
                        // @ts-ignore
                        (typeof import.meta !== 'undefined' && import.meta.env) ? "Detected (OK)" : "Not Detected"
                     }</div>
                     <div>Key Name: VITE_VAIT_API_KEY</div>
                   </div>
                </div>
                {(window as any).aistudio && (
                  <button 
                      onClick={handleOpenKeySettings}
                      className="mt-2 px-6 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-full font-bold transition-colors flex items-center gap-2"
                  >
                      <Key className="w-4 h-4" />
                      API 키 선택창 열기
                  </button>
                )}
              </div>
            )}
            {error !== "API_KEY_MISSING" && (
                <button 
                  onClick={() => setError(null)}
                  className="mt-2 px-4 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-full text-sm font-bold flex items-center gap-1"
                >
                    <RefreshCw className="w-3 h-3" /> 다시 시도
                </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <button 
            onClick={() => startQuiz('basic')}
            disabled={loading}
            className="group relative overflow-hidden bg-white p-8 rounded-[2rem] shadow-xl border-2 border-transparent hover:border-violet-400 transition-all duration-300 hover:-translate-y-1 text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-violet-100 text-violet-700 text-xs font-bold rounded-full mb-4">Level 1</span>
              <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-violet-700 transition-colors">기본 모드</h3>
              <p className="text-slate-500 text-sm mb-6">주어/목적어/보어 역할 및<br/>필수 암기 동사</p>
              <div className="flex items-center text-violet-600 font-bold text-sm">
                시작하기 <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => startQuiz('advanced')}
            disabled={loading}
            className="group relative overflow-hidden bg-white p-8 rounded-[2rem] shadow-xl border-2 border-transparent hover:border-amber-400 transition-all duration-300 hover:-translate-y-1 text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full mb-4">Level 2</span>
              <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-amber-700 transition-colors">심화 모드</h3>
              <p className="text-slate-500 text-sm mb-6">동명사 vs 현재분사,<br/>의미가 변하는 동사</p>
              <div className="flex items-center text-amber-600 font-bold text-sm">
                도전하기 <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Result Screen
  if (quizMode === 'result') {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-xl mx-auto text-center py-16 px-6 bg-white rounded-[2.5rem] shadow-2xl animate-scale-in border border-slate-100">
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-yellow-200 blur-2xl opacity-50 rounded-full"></div>
          <Trophy className="w-28 h-28 text-yellow-400 relative z-10 animate-float" />
        </div>
        
        <h2 className="text-3xl font-black text-slate-800 mb-2">Quiz Completed!</h2>
        <p className="text-slate-500 mb-8">오늘의 학습 결과는?</p>
        
        <div className="flex justify-center items-end gap-2 mb-10">
          <span className="text-7xl font-black text-violet-600 leading-none">{score}</span>
          <span className="text-2xl font-bold text-slate-400 mb-2">/ {questions.length}</span>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 mb-8 mx-auto max-w-sm">
           {percentage === 100 ? (
             <div className="text-violet-700 font-bold">🎉 Perfect! 동명사 마스터 등극!</div>
           ) : percentage >= 60 ? (
             <div className="text-emerald-600 font-bold">👍 Great job! 조금만 더 하면 완벽해요!</div>
           ) : (
             <div className="text-slate-600 font-bold">💪 Keep going! 개념 복습하고 다시 도전해요.</div>
           )}
        </div>

        <button 
          onClick={() => {
              setQuizMode('intro');
              setError(null);
          }}
          className="w-full sm:w-auto px-10 py-4 bg-violet-600 text-white rounded-xl font-bold text-lg hover:bg-violet-700 transition-all shadow-lg hover:shadow-violet-500/30 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          다시 도전하기
        </button>
      </div>
    );
  }

  // Active Quiz Screen
  const currentQ = questions[currentIdx];
  const isAnswered = selectedOption !== null;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header Info */}
      <div className="flex justify-between items-center mb-6">
        <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-slate-500 shadow-sm border border-slate-100">
          {difficulty === 'basic' ? 'Basic Level' : 'Advanced Level'}
        </span>
        <div className="flex items-center gap-2">
           {streak > 1 && (
             <div className="flex items-center gap-1 text-orange-500 font-bold text-sm animate-pulse">
               <Zap className="w-4 h-4 fill-current" />
               {streak} Combo!
             </div>
           )}
           <span className="text-slate-400 font-bold text-sm">
             Q.{currentIdx + 1} <span className="text-slate-300">/ {questions.length}</span>
           </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[500px] flex flex-col border border-slate-100">
        {/* Progress Bar */}
        <div className="w-full bg-slate-50 h-2">
          <div 
            className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-2 transition-all duration-700 ease-out rounded-r-full"
            style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
          />
        </div>

        <div className="p-6 md:p-10 flex-1 flex flex-col">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 leading-snug">
            {currentQ.question}
          </h3>

          <div className="space-y-3 flex-1">
            {currentQ.options.map((option, idx) => {
              let btnClass = "w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 font-medium relative group ";
              
              if (!isAnswered) {
                btnClass += "border-slate-100 hover:border-violet-200 hover:bg-violet-50 text-slate-700 hover:text-violet-900";
              } else {
                if (idx === currentQ.correctAnswerIndex) {
                  btnClass += "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm";
                } else if (idx === selectedOption) {
                  btnClass += "border-rose-400 bg-rose-50 text-rose-800";
                } else {
                  btnClass += "border-slate-100 text-slate-300 opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={isAnswered}
                  className={btnClass}
                >
                  <div className="flex items-center">
                    <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg mr-4 text-sm font-bold transition-colors ${
                      isAnswered && idx === currentQ.correctAnswerIndex ? 'bg-emerald-100 text-emerald-600' :
                      isAnswered && idx === selectedOption ? 'bg-rose-100 text-rose-600' :
                      'bg-slate-100 text-slate-500 group-hover:bg-violet-100 group-hover:text-violet-600'
                    }`}>
                      {isAnswered && idx === currentQ.correctAnswerIndex ? <Check className="w-5 h-5" /> :
                       isAnswered && idx === selectedOption ? <X className="w-5 h-5" /> :
                       String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-lg">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Area (Next Button or Explanation) */}
        {isAnswered && (
          <div className="bg-slate-50 p-6 md:p-8 border-t border-slate-100 animate-fade-in">
             <div className="mb-6">
                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">
                  <BrainCircuit className="w-4 h-4" /> Explanation
                </h4>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {currentQ.explanation}
                </p>
             </div>
             <button 
               onClick={nextQuestion}
               className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-violet-500/30 transition-all flex items-center justify-center gap-2"
             >
               {currentIdx < questions.length - 1 ? (
                 <>다음 문제 <ArrowRight className="w-5 h-5" /></>
               ) : (
                 <>결과 보기 <Trophy className="w-5 h-5" /></>
               )}
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizSection;