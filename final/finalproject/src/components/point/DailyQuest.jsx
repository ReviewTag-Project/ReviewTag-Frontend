import React, { useState } from 'react';
import { toast } from "react-toastify";

export default function DailyQuest({ setTab }) {
    // 퀘스트 데이터 (나중에 DB와 연동하세요)
    const [quests, setQuests] = useState([
        { 
            id: 1, 
            icon: "✍️", 
            title: "한줄평 남기기", 
            desc: "영화/애니 리뷰 작성",
            current: 0, 
            target: 1, 
            reward: 50, 
            done: false,
            action: "link" 
        },
        { 
            id: 2, 
            icon: "🧠", 
            title: "덕력 고사", 
            desc: "오늘의 영화 퀴즈",
            current: 0, 
            target: 1, 
            reward: 100, 
            done: false,
            action: "quiz" 
        },
        { 
            id: 3, 
            icon: "❤️", 
            title: "취향 공유", 
            desc: "게시글 좋아요 누르기",
            current: 2, 
            target: 3, 
            reward: 30, 
            done: false,
            action: "link" 
        },
        { 
            id: 4, 
            icon: "🎰", 
            title: "운수 좋은 날", 
            desc: "룰렛 1회 돌리기",
            current: 0, 
            target: 1, 
            reward: 20, 
            done: false,
            action: "roulette" 
        },
    ]);

    // 퀘스트 버튼 핸들러
    const handleQuestClick = (quest) => {
        if (quest.done) return;

        if (quest.action === "roulette") {
            setTab("roulette");
            toast.info("🎰 룰렛 탭으로 이동합니다!");
        } else if (quest.action === "quiz") {
            const answer = window.prompt("Q. 'I am your father' 명대사가 나오는 영화는?");
            if (answer && (answer.toLowerCase().includes("스타워즈") || answer.toLowerCase().includes("star wars"))) {
                toast.success("정답입니다! +100P 💯");
                updateProgress(quest.id, 1);
            } else {
                toast.error("땡! 다시 시도해보세요. (힌트: 스OO즈)");
            }
        } else {
            toast.info(`'${quest.title}' 페이지로 이동합니다. (구현 예정)`);
        }
    };

    const updateProgress = (id, amount) => {
        setQuests(prev => prev.map(q => {
            if (q.id === id) {
                const newCurrent = Math.min(q.current + amount, q.target);
                return { ...q, current: newCurrent, done: newCurrent >= q.target };
            }
            return q;
        }));
    };

    const handleClaim = (id) => {
        toast.success("보상이 지급되었습니다! 💰");
        setQuests(prev => prev.map(q => q.id === id ? { ...q, claimed: true } : q));
    };

    return (
        <div className="quest-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-white mb-0">📜 일일 퀘스트</h5>
                <span className="badge bg-dark border border-secondary" style={{fontSize:'0.75rem'}}>Reset 00:00</span>
            </div>

            <div className="quest-list">
                {quests.map((q) => (
                    <div key={q.id} className={`quest-item ${q.done ? 'done-bg' : ''}`}>
                        <div className="d-flex align-items-center">
                            <div className="quest-icon-box me-3">{q.icon}</div>
                            <div className="flex-grow-1">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <span className={`quest-title ${q.done ? 'text-decoration-line-through text-muted' : ''}`}>{q.title}</span>
                                    <span className="quest-reward text-warning fw-bold small">+{q.reward} P</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-end">
                                    <small className="text-secondary me-2" style={{fontSize:'0.8rem'}}>{q.desc}</small>
                                    {q.done && !q.claimed ? (
                                        <button className="btn btn-xs btn-primary py-0 px-2 fw-bold" style={{fontSize:'0.75rem'}} onClick={() => handleClaim(q.id)}>받기</button>
                                    ) : q.claimed ? (
                                        <span className="text-muted small">완료</span>
                                    ) : (
                                        <span className="text-neon-mint small fw-bold">{q.current} / {q.target}</span>
                                    )}
                                </div>
                                <div className="progress mt-2" style={{height: '4px', backgroundColor: '#333'}}>
                                    <div className="progress-bar" style={{width: `${(q.current / q.target) * 100}%`, backgroundColor: q.done ? '#00d2d3' : '#e50914'}}></div>
                                </div>
                            </div>
                            {!q.done && (
                                <button className="btn btn-link text-secondary p-0 ms-2" onClick={() => handleQuestClick(q)} title="바로가기">🚀</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}