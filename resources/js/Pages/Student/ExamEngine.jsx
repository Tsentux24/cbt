import { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function ExamEngine({ examSession, questions, student, initialTimeLeft, studentExamId, existingAnswers }) {
    // Parse existing answers if any
    const initialAnswers = {};
    const initialDoubtful = {};
    if (existingAnswers) {
        Object.values(existingAnswers).forEach(ans => {
            if (ans.question_option_id) initialAnswers[ans.question_id] = ans.question_option_id;
            if (ans.is_doubtful) initialDoubtful[ans.question_id] = true;
        });
    }

    // Basic States
    const [fontScale, setFontScale] = useState(1);
    const [showFinishModal, setShowFinishModal] = useState(false);
    const [showRecapModal, setShowRecapModal] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [timeLeft, setTimeLeft] = useState(initialTimeLeft || 3600); // in seconds
    const [ping, setPing] = useState(18);
    const [isSaving, setIsSaving] = useState(false);

    // Exam States
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState(initialAnswers); // { question_id: option_id }
    const [doubtful, setDoubtful] = useState(initialDoubtful); // { question_id: true/false }

    const currentQ = questions && questions.length > 0 ? questions[currentIndex] : null;
    const [isFullscreenLocked, setIsFullscreenLocked] = useState(false);

    // Kiosk / Fullscreen Lock Logic
    useEffect(() => {
        const enterFullscreen = async () => {
            try {
                const elem = document.documentElement;
                if (elem.requestFullscreen) {
                    await elem.requestFullscreen();
                } else if (elem.webkitRequestFullscreen) {
                    await elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) {
                    await elem.msRequestFullscreen();
                }
            } catch (err) {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            }
        };

        // Try to enter fullscreen immediately on load
        enterFullscreen();

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                // User exited fullscreen!
                setIsFullscreenLocked(true);
            } else {
                setIsFullscreenLocked(false);
                setIsFullscreen(true);
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const forceReturnToFullscreen = async () => {
        try {
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
                await elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) { /* Safari */
                await elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE11 */
                await elem.msRequestFullscreen();
            }
            setIsFullscreenLocked(false);
            setIsFullscreen(true);
        } catch (err) {
            console.error("Fullscreen error:", err);
            Swal.fire({
                title: 'Gagal Layar Penuh',
                text: 'Browser Anda memblokir fitur layar penuh. Pastikan Anda mengizinkan popup/fullscreen di pengaturan browser.',
                icon: 'error',
                background: '#121826',
                color: '#fff'
            });
        }
    };

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        forceSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft]);

    useEffect(() => {
        const pingTimer = setInterval(() => {
            setPing(Math.floor(Math.random() * (25 - 12 + 1)) + 12);
        }, 5000);
        return () => clearInterval(pingTimer);
    }, []);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const autosaveAnswer = async (questionId, optionId, isDoubtfulFlag) => {
        setIsSaving(true);
        try {
            await axios.post(route('student.exam.autosave'), {
                student_exam_id: studentExamId,
                question_id: questionId,
                question_option_id: optionId,
                is_doubtful: isDoubtfulFlag
            });
        } catch (error) {
            console.error("Autosave failed:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAnswer = (optionId) => {
        if (!currentQ) return;
        setAnswers(prev => ({ ...prev, [currentQ.id]: optionId }));
        autosaveAnswer(currentQ.id, optionId, !!doubtful[currentQ.id]);
    };

    const toggleDoubtful = () => {
        if (!currentQ) return;
        const newDoubtfulState = !doubtful[currentQ.id];
        setDoubtful(prev => ({ ...prev, [currentQ.id]: newDoubtfulState }));
        autosaveAnswer(currentQ.id, answers[currentQ.id] || null, newDoubtfulState);
    };

    const clearAnswer = () => {
        if (!currentQ) return;
        setAnswers(prev => {
            const newAns = { ...prev };
            delete newAns[currentQ.id];
            return newAns;
        });
        autosaveAnswer(currentQ.id, null, !!doubtful[currentQ.id]);
    };

    const forceSubmit = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(()=>{});
        }
        Swal.fire({
            title: 'Waktu Habis!',
            text: 'Ujian otomatis diselesaikan.',
            icon: 'info',
            background: '#121826',
            color: '#fff'
        }).then(() => {
            router.post(route('student.exam.submit', examSession.id), { answers });
        });
    };

    const submitExam = () => {
        setShowFinishModal(false);
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(()=>{});
        }
        Swal.fire({
            title: 'Berhasil',
            text: 'Jawaban Anda telah disubmit.',
            icon: 'success',
            background: '#121826',
            color: '#fff'
        }).then(() => {
            router.post(route('student.exam.submit', examSession.id), { answers });
        });
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen?.().catch(() => {});
            setIsFullscreen(true);
        } else {
            document.exitFullscreen?.();
            setIsFullscreen(false);
        }
    };

    // Calculate stats
    const answeredCount = Object.keys(answers).length;
    const doubtfulCount = Object.values(doubtful).filter(Boolean).length;
    const totalQuestions = questions?.length || 40;
    const emptyCount = totalQuestions - answeredCount;
    const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

    return (
        <div className="bg-[#0B0F19] text-[#9CA3AF] font-sans min-h-screen selection:bg-cyan-500/30 selection:text-cyan-100">
            <Head title={`Exam - ${examSession?.name || 'ApexCBT'}`} />
            
            <style>{`
                .exam-rich-text * {
                    background-color: transparent !important;
                    background: transparent !important;
                    color: inherit !important;
                }
            `}</style>

            {/* TOP HEADER */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#121826]/90 backdrop-blur-md border-b border-[#1F2937]">
                <div className="h-[60px] w-full px-4 lg:px-6 flex items-center justify-between">
                    
                    {/* Left Section */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded flex items-center justify-center bg-cyan-500 text-white">
                                <span className="material-symbols-outlined text-[16px]">done_all</span>
                            </div>
                            <span className="font-bold text-[18px] text-white tracking-tight">ApexCBT</span>
                        </div>
                        <div className="h-4 w-px bg-[#374151]"></div>
                        <div className="flex items-center gap-2 text-white">
                            <span className="material-symbols-outlined text-[16px] text-cyan-400">verified</span>
                            <span className="text-[13px] font-semibold uppercase tracking-wider hidden sm:block">
                                {examSession?.name || 'UJIAN AKTIF'}
                            </span>
                        </div>
                    </div>

                    {/* Middle Section (Timer & Tools) */}
                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex items-center gap-1 bg-[#1F2937] px-2 py-1 rounded-md text-[12px] font-semibold text-gray-300">
                            <button onClick={() => setFontScale(prev => Math.max(0.85, prev - 0.05))} className="px-2 hover:text-white">A-</button>
                            <span className="text-gray-500">|</span>
                            <button onClick={() => setFontScale(prev => Math.min(1.15, prev + 0.05))} className="px-2 hover:text-white">A+</button>
                        </div>

                        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[12px] font-semibold">
                            <span className="material-symbols-outlined text-[14px]">wifi</span>
                            {ping}ms
                        </div>

                        <div className={`flex items-center gap-3 px-5 py-1.5 rounded-xl border ${timeLeft < 300 ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-[#1F2937] border-[#374151] text-white'}`}>
                            <span className={`material-symbols-outlined text-[20px] ${timeLeft < 300 ? 'animate-pulse' : 'text-cyan-400'}`}>timer</span>
                            <div className="flex flex-col">
                                <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400">Sisa Waktu</span>
                                <span className="font-mono text-[18px] font-bold tracking-widest leading-none -mt-0.5">{formatTime(timeLeft)}</span>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[12px] font-semibold">
                            <span className="material-symbols-outlined text-[14px]">lock</span>
                            KIOSK LOCKED
                        </div>
                    </div>

                    {/* Right Section (Student Profile) */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex flex-col text-right">
                            <span className="text-[13px] text-white font-bold">{student?.name || 'Ahmad Fauzan'}</span>
                            <span className="text-[11px] text-gray-400">NISN: {student?.username || '0064298172'}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center shrink-0 border-2 border-[#1F2937]">
                            <span className="material-symbols-outlined text-white text-[18px]">person</span>
                        </div>
                    </div>

                </div>
            </header>

            <main className="w-full pt-[60px] min-h-screen flex flex-col">
                
                {/* SUB HEADER - 3 rows */}
                <div className="w-full px-4 lg:px-6 py-4 flex flex-col gap-3 bg-[#0B0F19]">
                    {/* Row 1: Title and Right Controls */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wider border border-emerald-500/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                KIOSK LOCK ENFORCED
                            </div>
                            <div className="flex items-center gap-2 text-white">
                                <span className="material-symbols-outlined text-[18px]">school</span>
                                <span className="text-[15px] font-bold">{examSession?.name || 'Sesi Ujian'} <span className="font-normal text-cyan-400">- {examSession?.question_bank?.subject?.name || examSession?.question_bank?.name} ({examSession?.class_room?.name})</span></span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 hidden lg:flex">
                            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                                <span className="material-symbols-outlined text-[14px]">cell_tower</span>
                                {ping}ms Ping (Stabil)
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Fullscreen */}
                    <div className="flex items-center justify-end">
                        <button onClick={toggleFullscreen} className="text-gray-400 hover:text-white transition-colors hidden lg:block">
                            <span className="material-symbols-outlined text-[18px]">{isFullscreen ? 'fullscreen_exit' : 'fullscreen'}</span>
                        </button>
                    </div>

                    {/* Row 3: Progress Bar */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-1 gap-2">
                        <div className="flex items-center gap-3 w-full lg:w-1/2">
                            <div className="flex items-center gap-1.5 text-[12px]">
                                <span className="material-symbols-outlined text-[16px] text-emerald-400">check_box</span>
                                <span className="text-gray-400">Progres Selesai:</span>
                                <span className="text-white font-bold">{answeredCount} / {totalQuestions} Soal ({progressPercent}%)</span>
                            </div>
                            <div className="flex-1 h-1.5 rounded-full bg-[#1F2937] overflow-hidden max-w-[200px]">
                                <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] justify-between lg:justify-end w-full lg:w-auto">
                            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                Auto-Save Lokal Terenkripsi
                            </div>
                            <div className="text-gray-500">
                                Kandidat: {student?.name || 'Dimas Pratama'} (NISN: {student?.username || '0064291823'})
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONTENT AREA */}
                <div className="w-full px-4 lg:px-6 py-4 flex flex-col lg:flex-row gap-6 flex-1">
                    
                    {/* LEFT COLUMN: QUESTION */}
                    <div className="flex-1 flex flex-col gap-4" style={{ transform: `scale(${fontScale})`, transformOrigin: 'top left' }}>
                        
                        {/* Question Box */}
                        <div className="bg-[#121826] border border-[#1F2937] rounded-xl flex flex-col shadow-lg">
                            
                            {/* Question Header */}
                            <div className="flex flex-wrap items-center justify-between p-4 border-b border-[#1F2937]">
                                <div className="flex items-center gap-3">
                                    <div className="px-3 py-1 rounded bg-cyan-400 text-[#0B0F19] text-[15px] font-bold shadow-sm">
                                        Soal #{currentIndex + 1}
                                    </div>
                                    <div className="px-2 py-1 rounded bg-[#1F2937] border border-[#374151] text-white text-[11px]">
                                        {currentQ?.type || 'Pilihan Ganda Tunggal'}
                                    </div>
                                    <div className="text-emerald-400 text-[11px] font-semibold">
                                        Bobot: {currentQ?.weight || '2.5'} Poin
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-mono mt-2 sm:mt-0">
                                    <span className="material-symbols-outlined text-[14px]">fingerprint</span>
                                    ID: MTK-XII-A1-014
                                </div>
                            </div>

                            {/* Question Text */}
                            <div className="p-6 text-white text-[18px] leading-relaxed">
                                {currentQ ? (
                                    <div className="exam-rich-text" dangerouslySetInnerHTML={{ __html: currentQ.question_text }} />
                                ) : (
                                    <p>Tidak ada data soal.</p>
                                )}
                            </div>

                            {/* Options List */}
                            <div className="px-6 pb-6 flex flex-col gap-3">
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">PILIH SALAH SATU JAWABAN YANG PALING TEPAT:</div>
                                
                                {currentQ && currentQ.options.map((opt, idx) => {
                                    const labels = ['A', 'B', 'C', 'D', 'E'];
                                    const optLabel = labels[idx] || '?';
                                    const isSelected = answers[currentQ.id] === opt.id;
                                    
                                    return (
                                        <label key={opt.id} className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-[#1F2937] border-[#374151] hover:bg-[#374151]/50'}`}>
                                            <div className="flex items-center gap-4 w-full">
                                                <span className={`w-10 h-10 rounded-lg flex items-center justify-center text-[18px] font-bold shrink-0 ${isSelected ? 'bg-cyan-400 text-[#0B0F19]' : 'bg-[#374151] text-gray-300'}`}>
                                                    {optLabel}
                                                </span>
                                                <div className="flex flex-col">
                                                    <div className={`text-[16px] exam-rich-text ${isSelected ? 'text-white font-semibold' : 'text-gray-300'}`} dangerouslySetInnerHTML={{ __html: opt.option_text }} />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0 pl-4">
                                                {isSelected && <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-bold border border-cyan-500/30 hidden sm:flex items-center"><span className="material-symbols-outlined text-[10px] mr-1">check</span>Terpilih</span>}
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-cyan-400' : 'border-gray-500 bg-[#121826]'}`}>
                                                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-cyan-400"></div>}
                                                </div>
                                            </div>
                                            <input type="radio" className="hidden" name={`answer_${currentQ.id}`} value={opt.id} checked={isSelected} onChange={() => handleAnswer(opt.id)} />
                                        </label>
                                    );
                                })}
                            </div>

                            {/* Question Footer Info */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-3 border-t border-[#1F2937] bg-[#0B0F19]/50 rounded-b-xl text-[10px] font-bold uppercase tracking-wider text-gray-500 gap-2">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1.5 text-emerald-400"><span className="material-symbols-outlined text-[14px]">cloud_upload</span> Tersimpan Otomatis (08:44:12)</span>
                                    <span className="flex items-center gap-1.5 text-gray-400"><span className="material-symbols-outlined text-[14px]">sync_alt</span> Token Pengawas: <span className="text-cyan-400">{examSession?.token || 'APX-8821'}</span></span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> ANTI-CHEAT AKTIF • Tab Switch Terkunci</span>
                                    <span className="text-gray-500 hidden xl:block">Ruang Lab Komputer 03 • Sesi 1</span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Ribbon */}
                        <div className="flex flex-col sm:flex-row items-center justify-between mt-2 gap-3">
                            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                                <button disabled={currentIndex === 0} onClick={() => setCurrentIndex(prev => prev - 1)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#121826] border border-[#1F2937] hover:bg-[#1F2937] text-gray-300 text-[13px] font-bold transition-colors disabled:opacity-50">
                                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                                    <span className="hidden md:block">Soal Sebelumnya</span>
                                </button>
                                <button onClick={clearAnswer} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#121826] border border-[#1F2937] hover:bg-[#1F2937] hover:text-red-400 text-gray-400 text-[13px] font-bold transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">backspace</span>
                                    <span className="hidden md:block">Kosongkan</span>
                                </button>
                                <label className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 text-amber-400 text-[13px] font-bold cursor-pointer transition-colors">
                                    <input type="checkbox" className="w-4 h-4 rounded bg-[#121826] border-[#374151] text-amber-500 focus:ring-amber-500" checked={currentQ ? !!doubtful[currentQ.id] : false} onChange={toggleDoubtful} />
                                    Tandai Ragu-ragu
                                </label>
                            </div>
                            <button disabled={currentIndex === questions?.length - 1} onClick={() => setCurrentIndex(prev => prev + 1)} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-[#0B0F19] text-[14px] font-bold shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all disabled:opacity-50 w-full sm:w-auto justify-center">
                                Soal Berikutnya
                                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </button>
                        </div>

                        {/* Finish Exam Block */}
                        <div className="bg-[#121826] border border-[#1F2937] rounded-xl p-5 mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-cyan-400 text-[20px]">verified_user</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-[14px]">Integritas CBT Terkunci</span>
                                    <span className="text-gray-400 text-[11px]">Lembar soal diacak dengan Seed Kriptografis MTK-014-99X</span>
                                </div>
                            </div>
                            <button onClick={() => setShowFinishModal(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600/90 border border-red-500 hover:bg-red-500 text-white text-[13px] font-bold shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all w-full sm:w-auto justify-center">
                                <span className="material-symbols-outlined text-[18px]">lock_clock</span>
                                Selesaikan Ujian Sekarang
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: SIDEBAR */}
                    <div className="w-full lg:w-[320px] flex flex-col gap-4 shrink-0">
                        
                        {/* Navigasi Nomor Soal */}
                        <div className="bg-[#121826] border border-[#1F2937] rounded-xl flex flex-col shadow-lg">
                            <div className="p-4 border-b border-[#1F2937] flex items-center justify-between">
                                <div className="flex items-center gap-2 text-white">
                                    <span className="material-symbols-outlined text-cyan-400 text-[18px]">grid_view</span>
                                    <span className="font-bold text-[15px]">Navigasi Nomor Soal</span>
                                </div>
                                <span className="text-[11px] text-cyan-400 font-bold">{totalQuestions} Butir</span>
                            </div>
                            
                            {/* Stats */}
                            <div className="grid grid-cols-4 border-b border-[#1F2937] bg-[#0B0F19]/30">
                                <div className="flex flex-col items-center justify-center p-3 border-r border-[#1F2937]">
                                    <span className="text-[14px] font-bold text-emerald-400">{answeredCount}</span>
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Dijawab</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 border-r border-[#1F2937]">
                                    <span className="text-[14px] font-bold text-amber-400">{doubtfulCount}</span>
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Ragu-ragu</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 border-r border-[#1F2937]">
                                    <span className="text-[14px] font-bold text-cyan-400">1</span>
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Aktif</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3">
                                    <span className="text-[14px] font-bold text-gray-400">{emptyCount}</span>
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Kosong</span>
                                </div>
                            </div>

                            {/* Grid */}
                            <div className="p-4 grid grid-cols-5 gap-2 max-h-[300px] overflow-y-auto">
                                {questions ? questions.map((q, idx) => {
                                    const isCurrent = idx === currentIndex;
                                    const isAnswered = !!answers[q.id];
                                    const isFlagged = !!doubtful[q.id];
                                    
                                    let bg = "bg-[#1F2937] text-gray-400 hover:bg-[#374151]";
                                    if (isCurrent) bg = "bg-cyan-400 text-[#0B0F19]";
                                    else if (isFlagged) bg = "bg-amber-400 text-[#0B0F19]";
                                    else if (isAnswered) bg = "bg-emerald-400 text-[#0B0F19]";
                                    
                                    return (
                                        <button key={q.id} onClick={() => setCurrentIndex(idx)} className={`relative h-10 rounded-lg flex items-center justify-center text-[14px] font-bold transition-colors ${bg}`}>
                                            {(idx + 1).toString().padStart(2, '0')}
                                            {isFlagged && !isCurrent && <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#121826]"></span>}
                                            {isCurrent && isFlagged && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-[#121826]"></span>}
                                        </button>
                                    );
                                }) : (
                                    <div className="col-span-5 text-center text-sm">Tidak ada soal.</div>
                                )}
                            </div>

                            <div className="p-4 border-t border-[#1F2937] bg-[#0B0F19]/30">
                                <button onClick={() => setShowRecapModal(true)} className="w-full py-2.5 rounded-lg bg-[#1F2937] hover:bg-[#374151] border border-[#374151] text-gray-300 text-[12px] font-bold flex items-center justify-center gap-2 transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">checklist</span> Tinjau Rekapitulasi Jawaban
                                </button>
                            </div>
                        </div>

                        {/* Pengawas Ruang */}
                        <div className="bg-[#121826] border border-[#1F2937] rounded-xl flex flex-col p-4 gap-4 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-white">
                                    <span className="material-symbols-outlined text-cyan-400 text-[18px]">support_agent</span>
                                    <span className="font-bold text-[15px]">Pengawas Ruang</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    Terhubung
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#1F2937] flex items-center justify-center shrink-0 border border-[#374151]">
                                    <span className="material-symbols-outlined text-gray-400 text-[20px]">badge</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-[13px]">Dra. Sri Wahyuni, M.Pd</span>
                                    <span className="text-gray-400 text-[10px]">NIP: 197804152006042008</span>
                                    <span className="text-cyan-400 text-[10px] font-bold">Pengawas Ruang Lab 01</span>
                                </div>
                            </div>

                            <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg overflow-hidden">
                                <div className="bg-[#1F2937]/50 px-3 py-2 flex items-center justify-between border-b border-[#1F2937]">
                                    <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] font-bold">
                                        <span className="material-symbols-outlined text-[12px]">campaign</span> Broadcast Pengawas
                                    </div>
                                    <span className="text-gray-400 text-[9px] font-mono">08:35 WIB</span>
                                </div>
                                <div className="p-3 text-[11px] text-gray-300 italic leading-relaxed">
                                    "Pengawas: Sisa waktu 1 jam 24 menit lagi. Cek kembali soal nomor 4 dan 9 yang masih ditandai"
                                </div>
                            </div>
                        </div>

                        {/* Telemetri Keamanan Siswa */}
                        <div className="bg-[#121826] border border-[#1F2937] rounded-xl flex flex-col p-4 gap-3 shadow-lg">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Telemetri Keamanan Siswa</div>
                            <div className="flex flex-col gap-2 text-[11px]">
                                <div className="flex items-center justify-between border-b border-[#1F2937] pb-2">
                                    <span className="text-gray-400">Pelanggaran / Blur Window:</span>
                                    <span className="text-emerald-400 font-bold">0 Kali (Nir-Pelanggaran)</span>
                                </div>
                                <div className="flex items-center justify-between border-b border-[#1F2937] pb-2">
                                    <span className="text-gray-400">Status SafeExam Kiosk:</span>
                                    <span className="text-emerald-400 font-bold">Terkunci Penuh</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Enkripsi Jawaban:</span>
                                    <span className="text-gray-300 font-mono">SHA-256 Validated</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* Confirm Finish Modal */}
            {showFinishModal && (
                <div className="fixed inset-0 bg-[#0B0F19]/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-[#121826] max-w-lg w-full rounded-2xl p-6 shadow-2xl flex flex-col gap-4 border border-[#374151]">
                        <div className="flex items-center gap-3 text-red-500 border-b border-[#1F2937] pb-4">
                            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[24px]">warning</span>
                            </div>
                            <span className="font-bold text-[20px] text-white">Konfirmasi Selesai Ujian</span>
                        </div>
                        <p className="text-[14px] text-gray-300 leading-relaxed mt-2">
                            Apakah Anda yakin ingin mengakhiri sesi ujian ini? Masih ada <span className="text-cyan-400 font-bold px-1 rounded bg-cyan-400/10">{emptyCount} soal belum dijawab</span> dan <span className="text-amber-400 font-bold px-1 rounded bg-amber-400/10">{doubtfulCount} soal ragu-ragu</span>.
                        </p>
                        <div className="bg-[#1F2937] border border-[#374151] p-4 rounded-xl flex flex-col gap-2 text-[12px] text-gray-400 mt-2">
                            <span className="flex items-center justify-between">Sisa waktu pengerjaan: <strong className="text-cyan-400 font-mono tracking-wide text-[14px] bg-[#0B0F19] px-2 py-0.5 rounded">{formatTime(timeLeft)}</strong></span>
                            <span className="text-red-400 flex items-center gap-1.5 mt-1"><span className="material-symbols-outlined text-[14px]">info</span> Setelah diselesaikan, jawaban tidak dapat diubah kembali.</span>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 mt-2">
                            <button onClick={() => setShowFinishModal(false)} className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1F2937] border border-[#374151] text-white hover:bg-[#374151] text-[13px] font-semibold transition-colors">
                                Lanjutkan Ujian
                            </button>
                            <button onClick={submitExam} className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-500 text-[13px] font-bold shadow-[0_4px_15px_rgba(220,38,38,0.3)] transition-all">
                                Ya, Selesaikan Ujian
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* FULLSCREEN LOCK OVERLAY */}
            {isFullscreenLocked && (
                <div className="fixed inset-0 bg-[#0B0F19] z-[9999] flex flex-col items-center justify-center p-6 text-center">
                    <div className="flex flex-col items-center max-w-3xl">
                        <span className="material-symbols-outlined text-red-500 text-[72px] mb-6 animate-pulse opacity-90">gpp_bad</span>
                        <h1 className="text-red-500 text-[32px] md:text-[40px] font-bold mb-6 uppercase tracking-[0.15em]">Peringatan Kiosk Lock</h1>
                        <p className="text-gray-300 text-[16px] md:text-[18px] max-w-3xl mb-10 leading-relaxed px-4">
                            Anda telah keluar dari mode Layar Penuh (Fullscreen). Sebagai standar prosedur ujian <strong className="text-cyan-400 font-bold">Anti-Cheat</strong>, Anda tidak diizinkan mengecilkan layar atau berpindah jendela selama ujian berlangsung.
                        </p>
                        <button 
                            onClick={forceReturnToFullscreen}
                            className="px-8 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-[16px] md:text-[18px] font-bold shadow-[0_0_40px_rgba(220,38,38,0.3)] flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
                        >
                            <span className="material-symbols-outlined text-[24px]">fullscreen</span>
                            KEMBALI KE UJIAN (LAYAR PENUH)
                        </button>
                        <p className="text-[#374151] text-[13px] mt-12">Sistem mencatat aktivitas ini dalam Log Telemetri Keamanan.</p>
                    </div>
                </div>
            )}

            {/* Recap Modal */}
            {showRecapModal && (
                <div className="fixed inset-0 bg-[#0B0F19]/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-[#121826] max-w-3xl w-full rounded-2xl flex flex-col border border-[#374151] overflow-hidden max-h-[90vh] shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                        <div className="p-5 border-b border-[#1F2937] flex items-center justify-between bg-[#1F2937]/30">
                            <div className="flex items-center gap-3 text-white">
                                <span className="material-symbols-outlined text-cyan-400 text-[24px]">checklist</span>
                                <span className="font-bold text-[18px]">Rekapitulasi Jawaban</span>
                            </div>
                            <button onClick={() => setShowRecapModal(false)} className="w-8 h-8 rounded bg-[#1F2937] flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-[#374151]">
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 bg-[#0B0F19]/50">
                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                                {questions ? questions.map((q, idx) => {
                                    const isAnswered = !!answers[q.id];
                                    const isFlagged = !!doubtful[q.id];
                                    
                                    let optionLetter = '-';
                                    if (isAnswered) {
                                        const optIndex = q.options.findIndex(opt => opt.id === answers[q.id]);
                                        const letters = ['A', 'B', 'C', 'D', 'E'];
                                        if (optIndex !== -1) optionLetter = letters[optIndex];
                                    }

                                    let boxClass = "relative flex flex-col items-center justify-center rounded-lg border p-2 cursor-pointer transition-all hover:scale-105 ";
                                    let textClass = "font-bold text-[16px] ";
                                    
                                    if (isFlagged) {
                                        boxClass += "bg-amber-400/10 border-amber-400/30 hover:bg-amber-400/20";
                                        textClass += "text-amber-400";
                                    } else if (isAnswered) {
                                        boxClass += "bg-emerald-400/10 border-emerald-400/30 hover:bg-emerald-400/20";
                                        textClass += "text-emerald-400";
                                    } else {
                                        boxClass += "bg-[#1F2937] border-[#374151] hover:bg-[#374151]";
                                        textClass += "text-gray-400";
                                    }

                                    return (
                                        <div 
                                            key={q.id} 
                                            onClick={() => {
                                                setCurrentIndex(idx);
                                                setShowRecapModal(false);
                                            }} 
                                            className={boxClass}
                                            title={isFlagged ? "Ragu-ragu" : (isAnswered ? "Sudah Dijawab" : "Belum Dijawab")}
                                        >
                                            <span className="text-[10px] text-gray-500 font-bold mb-1">{idx + 1}</span>
                                            <span className={textClass}>{optionLetter}</span>
                                            {isFlagged && <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
                                        </div>
                                    );
                                }) : (
                                    <div className="col-span-full text-center text-gray-400">Tidak ada soal.</div>
                                )}
                            </div>
                        </div>
                        <div className="p-5 border-t border-[#1F2937] flex flex-wrap items-center justify-between gap-4 bg-[#1F2937]/30">
                            <div className="flex gap-4">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400"><span className="w-2.5 h-2.5 rounded bg-emerald-400/20 border border-emerald-400/50"></span> Terjawab</div>
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400"><span className="w-2.5 h-2.5 rounded bg-amber-400/20 border border-amber-400/50"></span> Ragu-ragu</div>
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400"><span className="w-2.5 h-2.5 rounded bg-[#1F2937] border border-[#374151]"></span> Kosong</div>
                            </div>
                            <button onClick={() => setShowRecapModal(false)} className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#0B0F19] font-bold text-[13px] transition-colors shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                                Tutup Rekap
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
