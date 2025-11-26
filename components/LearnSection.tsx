import React from 'react';
import { LearningCard } from '../types';
import { BookOpen, CheckCircle, Star, AlertTriangle, ArrowRight, Bookmark } from 'lucide-react';

const concepts: LearningCard[] = [
  {
    title: "동명사(Gerund)란?",
    type: "concept",
    content: "동사원형 + -ing 형태로, 동사의 성질을 가지면서 '명사' 역할을 해요. 문장에서 주어, 목적어, 보어 자리에 들어갑니다.",
    examples: [
      "Running is good for health. (주어: 달리는 것은)",
      "My hobby is taking pictures. (보어: 사진 찍는 것이다)",
      "I started learning English. (목적어: 영어 배우는 것을)"
    ]
  },
  {
    title: "동명사 vs 현재분사 구별",
    type: "concept",
    content: "형태는 같지만 역할이 달라요! 동명사는 '용도/목적(~하기 위한)', 현재분사는 '상태/진행(~하고 있는)'을 나타냅니다.",
    examples: [
      "🛏️ a sleeping bag (잠자기를 위한 가방 = 침낭) → 동명사",
      "👶 a sleeping baby (자고 있는 아기) → 현재분사",
      "💃 Look at the dancing girl. (춤추고 있는) → 현재분사"
    ]
  },
  {
    title: "동명사만 목적어로 쓰는 동사",
    type: "usage",
    content: "시험에 가장 많이 나오는 내용! 이 동사들 뒤에는 to부정사가 오면 안 돼요.",
    examples: [
      "🔥 암기팁: MEGA PEP'S (Mind, Enjoy, Give up, Avoid, Practice, Escape, Postpone, Stop...)",
      "I enjoy playing soccer. (O)",
      "I enjoy to play soccer. (X)"
    ]
  },
  {
    title: "뜻이 달라지는 동사",
    type: "tip",
    content: "뒤에 동명사가 오느냐, to부정사가 오느냐에 따라 의미가 달라져요. 문맥을 잘 봐야 해요!",
    examples: [
      "Remember meeting him (만난 것을 기억하다 - 과거)",
      "Remember to meet him (만날 것을 기억하다 - 미래)",
      "Stop smoking (담배를 끊다)",
      "Stop to smoke (담배 피우기 위해 멈추다)"
    ]
  }
];

const LearnSection: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-10">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-bold shadow-sm">
          <BookOpen className="w-4 h-4" />
          <span>핵심 개념 정리</span>
        </div>
        <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">
          동명사, <span className="text-violet-600">이것만 알면 끝!</span>
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          중학교 3학년 영어 시험에 꼭 나오는 핵심 포인트만 모았어요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {concepts.map((card, idx) => (
          <div 
            key={idx} 
            className="group bg-white rounded-3xl p-1 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_30px_-4px_rgba(124,58,237,0.2)] transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-full bg-white rounded-[20px] p-6 md:p-8 flex flex-col border border-slate-100 relative overflow-hidden">
              {/* Decorative Background Icon */}
              <div className="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                {card.type === 'concept' && <Bookmark size={120} />}
                {card.type === 'usage' && <CheckCircle size={120} />}
                {card.type === 'tip' && <AlertTriangle size={120} />}
              </div>

              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className={`p-3 rounded-2xl ${
                  card.type === 'concept' ? 'bg-blue-100 text-blue-600' : 
                  card.type === 'usage' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {card.type === 'concept' && <BookOpen className="w-6 h-6" />}
                  {card.type === 'usage' && <CheckCircle className="w-6 h-6" />}
                  {card.type === 'tip' && <AlertTriangle className="w-6 h-6" />}
                </div>
                <h3 className="text-xl font-bold text-slate-800">{card.title}</h3>
              </div>
              
              <p className="text-slate-600 mb-6 font-medium leading-relaxed relative z-10">
                {card.content}
              </p>

              <div className="mt-auto bg-slate-50 rounded-2xl p-5 border border-slate-100 relative z-10 group-hover:bg-violet-50 group-hover:border-violet-100 transition-colors">
                <h4 className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider group-hover:text-violet-500">
                  <Star className="w-3 h-3" /> Examples
                </h4>
                <ul className="space-y-3">
                  {card.examples.map((ex, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700 group-hover:text-slate-800">
                      <ArrowRight className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                      <span className="font-medium">{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearnSection;