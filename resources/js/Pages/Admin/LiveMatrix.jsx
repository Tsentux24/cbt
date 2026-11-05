import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function LiveMatrix({ examSession, workstations, totalStudents, onlineCount, alertCount }) {
    return (
        <AuthenticatedLayout>
            <Head title={`Live Matrix - ${examSession.title || 'Proctor'} | ApexCBT`} />

            <div className="flex flex-col w-full pb-16 pt-6">
                <div className="flex items-center gap-2 mb-6">
                    <Link href={route('admin.bank-soal')} className="text-outline hover:text-primary transition-colors flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        <span className="font-label-sm text-[13px] font-bold">Kembali ke Dasbor Ujian</span>
                    </Link>
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="font-headline-xl text-[32px] font-bold text-on-surface tracking-tight leading-tight">Proctor Live Matrix</h1>
                        <p className="font-body-sm text-[14px] text-on-surface-variant max-w-3xl leading-relaxed mt-1">
                            Monitoring workstation Kiosk hardware heartbeat secara real-time via telemetry daemon untuk sesi <span className="text-primary font-bold">{examSession.title || 'Ujian'}</span>.
                        </p>
                    </div>
                </div>

                {/* Dashboard Card */}
                <div className="bg-[#11141E] border border-surface-container-high rounded-[24px] p-8 shadow-2xl flex flex-col gap-8">
                    {/* Header Matrix */}
                    <div className="flex flex-wrap items-start justify-between gap-6 pb-6 border-b border-surface-container-high/50">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl border border-surface-container-highest flex items-center justify-center bg-surface-container/50">
                                <span className="material-symbols-outlined text-[28px] text-primary">grid_view</span>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-3">
                                    <h2 className="font-headline-sm text-[24px] font-bold text-white tracking-tight">Live Matrix: {examSession.class_room?.name || 'Lab CBT Utama 01'}</h2>
                                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold text-[12px]">{examSession.class_room?.school?.name || 'Instansi Terhubung'}</span>
                                </div>
                                <p className="font-body-sm text-[14px] text-outline mt-1">Monitoring workstation Kiosk hardware heartbeat secara real-time via telemetry daemon</p>
                            </div>
                        </div>

                        {/* Status Legend */}
                        <div className="flex items-center gap-6 pt-2">
                            <div className="flex items-center gap-3">
                                <span className="w-3.5 h-3.5 rounded-full bg-[#4ADE80] animate-pulse"></span>
                                <div className="flex flex-col">
                                    <span className="font-bold text-[13px] text-white">Online</span>
                                    <span className="font-bold text-[13px] text-white">({onlineCount})</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-3.5 h-3.5 rounded-full bg-[#F87171]"></span>
                                <div className="flex flex-col">
                                    <span className="font-bold text-[13px] text-white">Offline / Alert</span>
                                    <span className="font-bold text-[13px] text-white">({alertCount})</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Matrix Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-4 mt-2">
                        {workstations.map((ws, idx) => (
                            <div 
                                key={idx} 
                                className={`
                                    flex flex-col items-center justify-center p-4 rounded-xl border transition-all cursor-default relative overflow-hidden group
                                    ${ws.has_alert 
                                        ? 'bg-[#F87171]/5 border-[#F87171]/30 hover:border-[#F87171]' 
                                        : 'bg-surface-container-low/50 border-surface-container-highest hover:border-surface-container-high'
                                    }
                                `}
                                title={ws.student_name}
                            >
                                <span className={`material-symbols-outlined text-[28px] mb-2 ${ws.has_alert ? 'text-[#F87171]' : 'text-[#4ADE80]'}`}>
                                    {ws.has_alert ? 'error' : 'monitor'}
                                </span>
                                <span className={`font-mono text-[16px] font-bold mb-3 ${ws.has_alert ? 'text-white' : 'text-outline-variant'}`}>
                                    {ws.pc_number}
                                </span>
                                <span className={`w-1.5 h-1.5 rounded-full ${ws.has_alert ? 'bg-[#F87171]' : (ws.is_online ? 'bg-[#4ADE80]' : 'bg-surface-container-highest')}`}></span>
                                
                                {/* Tooltip / Popover on hover */}
                                <div className="absolute inset-0 bg-surface-container/95 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center backdrop-blur-sm z-10">
                                    <span className="text-[10px] text-primary font-bold line-clamp-2 leading-tight">{ws.student_name}</span>
                                    {ws.student_id ? (
                                        <span className="text-[9px] text-outline mt-1 font-mono">{ws.is_online ? 'Online' : (ws.has_alert ? 'Alert' : 'Idle')}</span>
                                    ) : (
                                        <span className="text-[9px] text-outline mt-1 font-mono">Kosong</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Info */}
                    <div className="flex items-center justify-between pt-6 border-t border-surface-container-high/50 mt-4">
                        <span className="font-mono text-[13px] text-outline">
                            Klien ID: LAB01-CL-40-WIN11-64BIT
                        </span>
                        <button className="flex items-center gap-1.5 text-primary font-bold text-[14px] hover:text-primary-fixed transition-colors">
                            Buka Telemetry Monitor Lengkap <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
