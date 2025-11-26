import React, { useState } from 'react';
import { generateQuiz } from '../services/geminiService';
import { QuizQuestion } from '../types';
import { Play, RotateCcw, Check, X, BrainCircuit, Trophy, Star, Zap, ArrowRight } from 'lucide-react';

const QuizSection: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizMode, setQuizMode] = useState<'intro' | 'active' | 'result'>('intro');
  const [difficulty, setDifficulty] = useState<'basic' | 'advanced'>('basic');
  const [streak, setStreak] = useState(0);

  const startQuiz = async (level: 'basic' | 'advanced') => {
    setDifficulty(level);
    setLoading(true);
    setQuestions([]);
    const generated = await generateQuiz(level);
    if (generated.length > 0) {
      setQuestions(generated);
      setCurrentIdx(0);
      setScore(0);
      setStreak(0);
      setSelectedOption(null);
      setQuizMode('active');
    } else {
      alert("문제를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
    setLoading(false);
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

  // Intro Screen
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <button 
            onClick={() => startQuiz('basic')}
            className="group relative overflow-hidden bg-white p-8 rounded-[2rem] shadow-xl border-2 border-transparent hover:border-violet-400 transition-all duration-300 hover:-translate-y-1 text-left"
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
            className="group relative overflow-hidden bg-white p-8 rounded-[2rem] shadow-xl border-2 border-transparent hover:border-amber-400 transition-all duration-300 hover:-translate-y-1 text-left"
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
          onClick={() => setQuizMode('intro')}
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
                      isAnswered && idx === currentQ.correctAnswerIndex ? 'bg-emerald-200 text-emerald-800' :
                      isAnswered && idx === selectedOption ? 'bg-rose-200 text-rose-800' :
                      'bg-slate-100 text-slate-500 group-hover:bg-violet-200 group-hover:text-violet-700'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-lg">{option}</span>
                  </div>
                  
                  {isAnswered && idx === currentQ.correctAnswerIndex && (
                    <Check className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-600 w-6 h-6" />
                  )}
                  {isAnswered && idx === selectedOption && idx !== currentQ.correctAnswerIndex && (
                    <X className="absolute right-5 top-1/2 -translate-y-1/2 text-rose-500 w-6 h-6" />
                  )}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="mt-8 animate-fade-in">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-violet-500"></div>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-bold text-slate-800 text-lg">해설</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {currentQ.explanation}
                </p>
              </div>
              
              <button
                onClick={nextQuestion}
                className="w-full py-4 bg-violet-600 text-white rounded-xl font-bold text-xl hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 flex items-center justify-center gap-2 group"
              >
                {currentIdx < questions.length - 1 ? (
                  <>다음 문제 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                ) : (
                  <>결과 보기 <Trophy className="w-5 h-5 group-hover:scale-110 transition-transform" /></>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizSection;