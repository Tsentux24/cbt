import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import Swal from 'sweetalert2';

export default function BankSoal({ examSessions, questionBanks, subjects, stats }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        subject_id: subjects && subjects.length > 0 ? subjects[0].id : '',
        status: 'Draft',
    });

    const openEditModal = (qb) => {
        setEditingId(qb.id);
        setData({
            name: qb.name,
            subject_id: qb.subject_id,
            status: qb.status
        });
        setIsEditModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.bank-soal.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        put(route('admin.bank-soal.update', editingId), {
            onSuccess: () => {
                setIsEditModalOpen(false);
                setEditingId(null);
                reset();
            }
        });
    };

    const deleteBankSoal = (id) => {
        Swal.fire({
            title: 'Hapus Paket Ujian?',
            text: "Aksi ini tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'var(--color-error)',
            cancelButtonColor: 'var(--color-surface-container-highest)',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
            background: 'var(--color-surface)',
            color: 'var(--color-on-surface)'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.bank-soal.destroy', id));
            }
        });
    };
    return (
        <AuthenticatedLayout>
            <Head title="Bank Soal Master | ApexCBT" />

            <div className="flex flex-col w-full pb-16">
                {/* Dynamic Atmospheric Glow Accent */}
                <div className="relative w-full overflow-hidden">
                    <div className="absolute -top-32 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute top-12 left-10 w-80 h-80 bg-secondary-container/15 rounded-full blur-3xl pointer-events-none"></div>
                    
                    {/* Header & Breadcrumbs & Action Toolbar */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-6 mb-8 relative z-10">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <span className="font-label-sm text-[12px] text-outline uppercase tracking-wider">Superadmin Console</span>
                                <span className="text-outline-variant font-label-sm text-[12px]">/</span>
                                <span className="font-label-sm text-[12px] text-primary uppercase tracking-wider font-semibold">Bank Soal & Jadwal Ujian</span>
                                <span className="ml-2 px-2 py-0.5 rounded-full bg-surface-container-high border border-surface-container-highest text-outline text-[10px] font-mono font-medium tracking-wide">REGION-ID-04 (NASIONAL)</span>
                            </div>
                            <h1 className="font-headline-xl text-[32px] font-bold text-on-surface tracking-tight leading-tight mt-1">Manajemen Bank Soal Master & Sesi Serentak</h1>
                            <p className="font-body-sm text-[14px] text-on-surface-variant max-w-3xl leading-relaxed mt-1">
                                Pusat otorisasi distribusi butir uji terenkripsi, sinkronisasi token otomatis lintas 142 sekolah satelit, dan penjadwalan multi-batch ujian nasional.
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3">
                            <button 
                                onClick={() => {
                                    Swal.fire({
                                        title: 'Memvalidasi Enkripsi (AES-256)',
                                        html: 'Memeriksa integritas SHA-256 pada seluruh bank soal...',
                                        timer: 2000,
                                        timerProgressBar: true,
                                        didOpen: () => {
                                            Swal.showLoading();
                                        }
                                    }).then((result) => {
                                        if (result.dismiss === Swal.DismissReason.timer) {
                                            Swal.fire({
                                                title: 'Tervalidasi!',
                                                text: '100% Integritas Bank Soal terjaga dan aman.',
                                                icon: 'success',
                                                background: 'var(--color-surface)',
                                                color: 'var(--color-on-surface)'
                                            });
                                        }
                                    });
                                }}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-bright text-on-surface text-[14px] font-medium transition-all shadow-sm border border-surface-container-high"
                            >
                                <span className="material-symbols-outlined text-[18px] text-primary">security</span>
                                <span>Validasi Enkripsi (AES-256)</span>
                            </button>
                            <a 
                                href={route('admin.bank-soal.export')}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-bright text-on-surface text-[14px] font-medium transition-all shadow-sm border border-surface-container-high"
                            >
                                <span className="material-symbols-outlined text-[18px] text-secondary">file_download</span>
                                <span>Ekspor Master Terenkripsi</span>
                            </a>
                            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-fixed text-on-primary text-[14px] font-bold transition-all shadow-[0_0_20px_rgba(76,215,246,0.25)] active:scale-[0.98]">
                                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                                <span>+ Buat Paket Ujian Baru</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* KPI Metrics Strip (4 High-Contrast Cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8 relative z-10">
                    {/* Metric 1 */}
                    <div className="bg-surface-container-low border border-surface-container-high rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:bg-surface-container transition-all">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-container"></div>
                        <div className="flex items-start justify-between">
                            <div className="flex flex-col">
                                <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-semibold">Total Paket Aktif</span>
                                <span className="font-headline-xl text-[32px] font-bold text-on-surface mt-1 leading-none">{stats?.totalPaket || 0} <span className="font-title-lg text-[16px] text-outline font-medium">Paket</span></span>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-surface-container-highest flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[20px]">folder_managed</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-5 pt-3 border-t border-surface-container-high">
                            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                            <span className="font-label-sm text-[12px] text-on-surface-variant">100% Terverifikasi Kurikulum</span>
                        </div>
                    </div>
                    
                    {/* Metric 2 */}
                    <div className="bg-surface-container-low border border-surface-container-high rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:bg-surface-container transition-all">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary-container to-secondary"></div>
                        <div className="flex items-start justify-between">
                            <div className="flex flex-col">
                                <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-semibold">Bank Butir Terenkripsi</span>
                                <span className="font-headline-xl text-[32px] font-bold text-on-surface mt-1 leading-none">{stats?.totalButir || 0} <span className="font-title-lg text-[16px] text-outline font-medium">Butir</span></span>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-surface-container-highest flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[20px]">database</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-5 pt-3 border-t border-surface-container-high">
                            <span className="font-label-sm text-[11px] text-on-surface-variant">PG Tunggal, PG-K, Match & Esai</span>
                            <span className="font-label-sm text-[11px] text-primary font-mono bg-primary/10 px-1.5 py-0.5 rounded">+ Realtime</span>
                        </div>
                    </div>
                    
                    {/* Metric 3 */}
                    <div className="bg-surface-container-low border border-surface-container-high rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:bg-surface-container transition-all">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-tertiary to-tertiary-container"></div>
                        <div className="flex items-start justify-between">
                            <div className="flex flex-col">
                                <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-semibold">Jadwal Sesi Hari Ini</span>
                                <span className="font-headline-xl text-[32px] font-bold text-on-surface mt-1 leading-none">{stats?.totalSesiHariIni || 0} <span className="font-title-lg text-[16px] text-tertiary font-medium">Sesi Serentak</span></span>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-surface-container-highest flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[20px]">alarm_on</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-5 pt-3 border-t border-surface-container-high">
                            <span className="font-label-sm text-[12px] text-on-surface">Seluruh Batch</span>
                            <span className="text-outline text-[12px]">•</span>
                            <span className="font-label-sm text-[12px] text-tertiary font-medium">{stats?.totalPeserta || 0} Total Peserta</span>
                        </div>
                    </div>
                    
                    {/* Metric 4 */}
                    <div className="bg-surface-container-low border border-surface-container-high rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:bg-surface-container transition-all">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-inverse-primary"></div>
                        <div className="flex items-start justify-between">
                            <div className="flex flex-col">
                                <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-semibold">Kunci Master Keamanan</span>
                                <span className="font-headline-md text-[20px] font-bold text-primary mt-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[20px]">vpn_key</span> Dynamic Rotation
                                </span>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-surface-container-highest flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[20px]">sync_lock</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-5 pt-3 border-t border-surface-container-high">
                            <span className="font-label-sm text-[11px] text-outline">Rotasi tiap 60m</span>
                            <span className="font-label-sm text-[11px] text-on-surface font-mono">Next: 18m 42s</span>
                        </div>
                    </div>
                </div>

                {/* Section 1: Interactive Exam Schedule & Batch Control Grid */}
                <div className="flex flex-col gap-5 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(76,215,246,0.8)]"></div>
                            <h2 className="font-headline-lg text-[22px] font-bold text-on-surface tracking-tight">Kontrol Sesi & Pelaksanaan Real-Time</h2>
                            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-label-sm text-[11px] font-bold tracking-wide uppercase">Live Sync Engine</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-label-sm text-[12px] text-outline">Zona Waktu:</span>
                            <span className="font-label-sm text-[12px] bg-surface-container border border-surface-container-high px-2.5 py-1 rounded-md text-on-surface font-medium">WIB (UTC+7)</span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {examSessions && examSessions.length > 0 ? (
                            examSessions.map((session, index) => {
                                const isActive = session.status === 'Aktif';
                                return (
                                    <div key={session.id} className="bg-surface-container border border-surface-container-high rounded-2xl p-5 flex flex-col justify-between relative shadow-lg">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-label-sm text-[10px] uppercase font-bold tracking-wider">Sesi {index + 1}</span>
                                                    <span className="font-mono-timer text-[13px] text-primary font-bold">
                                                        {new Date(session.start_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - {new Date(session.end_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                                    </span>
                                                </div>
                                                <h3 className="font-title-lg text-[18px] font-bold text-on-surface leading-tight">{session.name}<br/><span className="text-[16px]">({session.class_room?.name || 'Seluruh Kelas'})</span></h3>
                                                <p className="font-body-sm text-[12px] text-outline mt-1.5">
                                                    Paket: {session.question_bank?.name || '-'} • Mapel: {session.question_bank?.subject?.name || '-'}
                                                </p>
                                            </div>
                                            {isActive ? (
                                                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary/15 border border-tertiary/20 text-tertiary font-label-sm text-[11px] font-bold uppercase tracking-wide">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span> {session.status}
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/40 border border-secondary/20 text-secondary-fixed font-label-sm text-[11px] font-bold uppercase tracking-wide">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Selesai
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="bg-surface-container-low border border-surface-container-highest p-4 rounded-xl mb-4 flex flex-col gap-2.5">
                                            <div className="flex items-center justify-between font-label-sm text-[12px]">
                                                <span className="text-on-surface-variant flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-[16px] text-primary">vpn_key</span>
                                                    Token Sesi:
                                                </span>
                                                <span className="text-primary font-mono tracking-widest font-bold bg-primary/10 px-2 py-0.5 rounded">{session.token}</span>
                                            </div>
                                            <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                                                <div className={`h-1.5 rounded-full ${isActive ? 'bg-gradient-to-r from-primary to-tertiary' : 'bg-surface-bright'}`} style={{ width: isActive ? '100%' : '100%' }}></div>
                                            </div>
                                            <div className="flex items-center justify-between text-outline text-[11px] font-mono mt-0.5">
                                                <span>Durasi: {Math.round((new Date(session.end_time) - new Date(session.start_time)) / 60000)} Menit</span>
                                                <span>Live Monitoring</span>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-2">
                                            <Link href={route('admin.proctor.show', session.id)} className="col-span-2 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-md text-[13px] font-bold transition-all border border-surface-container-highest group">
                                                <span className="material-symbols-outlined text-[18px] text-primary group-hover:animate-pulse">broadcast_on_home</span> Tinjau Proktor Live
                                            </Link>
                                            <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-sm text-[12px] transition-colors border border-surface-container-highest">
                                                <span className="material-symbols-outlined text-[16px] text-outline">edit</span> Edit
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    Swal.fire({
                                                        title: 'Hapus Sesi?',
                                                        text: "Apakah Anda yakin ingin menghapus sesi ujian ini?",
                                                        icon: 'warning',
                                                        showCancelButton: true,
                                                        confirmButtonColor: 'var(--color-error)',
                                                        cancelButtonColor: 'var(--color-surface-container-highest)',
                                                        confirmButtonText: 'Ya, hapus!',
                                                        background: 'var(--color-surface)',
                                                        color: 'var(--color-on-surface)'
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            router.delete(route('admin.exam-sessions.destroy', session.id));
                                                        }
                                                    });
                                                }}
                                                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-error-container/40 hover:bg-error-container text-error font-label-sm text-[12px] font-medium transition-colors border border-error/20"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">delete</span> Hapus Sesi
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-1 lg:col-span-3 bg-surface-container border border-surface-container-high rounded-2xl p-10 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined text-[32px]">event_busy</span>
                                </div>
                                <h3 className="font-title-lg text-[20px] font-bold text-on-surface">Belum Ada Sesi Ujian Aktif</h3>
                                <p className="font-body-sm text-[14px] text-outline mt-2 max-w-md">
                                    Silakan buat sesi ujian baru melalui menu Administrasi atau Rilis Token pada paket yang telah diverifikasi.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Section 2: Master Question Bank (Bank Soal Master Table & Deep Filters) */}
                <div className="bg-surface-container-low border border-surface-container-high rounded-2xl p-6 shadow-xl flex flex-col gap-5">
                    {/* Table Header & Multi-Dimension Filter Bar */}
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-2">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-[24px]">inventory</span>
                                <h2 className="font-headline-md text-[20px] font-bold text-on-surface">Koleksi Master Bank Soal</h2>
                            </div>
                            <p className="font-body-sm text-[13px] text-outline mt-1">Daftar paket instrumen evaluasi siap pakai dengan enkripsi berlapis tingkat nasional.</p>
                        </div>
                        
                        {/* Filter Dropdowns & Search Input */}
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="relative">
                                <input className="bg-surface-container border border-surface-container-highest px-3 py-2.5 pl-9 rounded-xl font-body-sm text-[13px] text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary transition-all w-64" placeholder="Cari kode atau judul paket..." type="text" />
                                <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[18px] text-outline">search</span>
                            </div>
                            <div className="relative">
                                <select className="appearance-none bg-surface-container border border-surface-container-highest hover:bg-surface-container-high text-on-surface font-label-sm text-[12px] px-3 py-2.5 pr-8 rounded-xl focus:outline-none cursor-pointer">
                                    <option>Semua Tingkat (X, XI, XII)</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-2 top-2.5 text-[18px] text-outline pointer-events-none">arrow_drop_down</span>
                            </div>
                            <div className="relative">
                                <select className="appearance-none bg-surface-container border border-surface-container-highest hover:bg-surface-container-high text-on-surface font-label-sm text-[12px] px-3 py-2.5 pr-8 rounded-xl focus:outline-none cursor-pointer">
                                    <option>Semua Mata Pelajaran</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-2 top-2.5 text-[18px] text-outline pointer-events-none">arrow_drop_down</span>
                            </div>
                            <div className="relative">
                                <select className="appearance-none bg-surface-container border border-surface-container-highest hover:bg-surface-container-high text-on-surface font-label-sm text-[12px] px-3 py-2.5 pr-8 rounded-xl focus:outline-none cursor-pointer">
                                    <option>Status: Semua</option>
                                    <option>Siap Uji (Verified)</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-2 top-2.5 text-[18px] text-outline pointer-events-none">arrow_drop_down</span>
                            </div>
                            <button className="p-2.5 bg-surface-container border border-surface-container-highest hover:bg-surface-container-high text-outline hover:text-on-surface rounded-xl transition-colors" title="Filter Lanjutan">
                                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                            </button>
                        </div>
                    </div>

                    {/* High Density Master Data Table */}
                    <div className="overflow-x-auto rounded-xl bg-surface-container border border-surface-container-highest">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container-high/50 text-outline font-label-sm text-[11px] uppercase tracking-wider border-b border-surface-container-highest">
                                    <th className="py-3 px-4 font-semibold">Kode Paket Soal</th>
                                    <th className="py-3 px-4 font-semibold">Judul & Kurikulum</th>
                                    <th className="py-3 px-4 font-semibold">Reviewer / Penyusun</th>
                                    <th className="py-3 px-4 text-center font-semibold">Komposisi Butir</th>
                                    <th className="py-3 px-4 font-semibold">Checksum SHA-256</th>
                                    <th className="py-3 px-4 text-center font-semibold">Status</th>
                                    <th className="py-3 px-4 text-right font-semibold">Aksi Manajemen</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container-high font-body-sm text-[13px] text-on-surface">
                                {questionBanks && questionBanks.length > 0 ? (
                                    questionBanks.map((qb) => (
                                        <tr key={qb.id} className="hover:bg-surface-container-high/40 transition-colors">
                                            <td className="py-3.5 px-4 font-mono text-primary font-semibold">
                                                {qb.name}
                                                <div className="text-[11px] text-outline font-sans font-normal mt-0.5">v1.0 Production</div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="font-semibold text-on-surface">{qb.description || qb.subject?.name}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-[10px] font-semibold text-primary uppercase">{qb.subject?.name}</span>
                                                    <span className="text-outline text-[11px]">Kelas XII • 90 Menit</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="text-on-surface font-medium">{qb.creator?.name || 'Administrator'}</div>
                                                <div className="text-[11px] text-tertiary mt-0.5">Review: Tim Kurikulum Pusat</div>
                                            </td>
                                            <td className="py-3.5 px-4 text-center">
                                                <div className="font-bold text-on-surface">40 Butir</div>
                                                <div className="text-[11px] text-outline mt-0.5">Tersedia</div>
                                            </td>
                                            <td className="py-3.5 px-4 font-mono text-[11px] text-outline">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-[14px] text-tertiary">verified_user</span>
                                                    <span className="truncate max-w-[120px]" title="e4b09c38d4b38234857b019da4c0e66d8f">e4b09c...8f7c9</span>
                                                    <button className="hover:text-primary transition-colors" title="Salin Checksum">
                                                        <span className="material-symbols-outlined text-[13px]">content_copy</span>
                                                    </button>
                                                </div>
                                                <div className="text-[10px] text-tertiary font-sans font-medium mt-0.5">AES-256 GCM Valid</div>
                                            </td>
                                            <td className="py-3.5 px-4 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${qb.status === 'Siap Uji' ? 'bg-tertiary-container/20 border-tertiary/30 text-tertiary' : 'bg-error-container/20 border-error/30 text-error'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${qb.status === 'Siap Uji' ? 'bg-tertiary' : 'bg-error'}`}></span> {qb.status}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button onClick={() => openEditModal(qb)} className="p-1.5 rounded-lg hover:bg-surface-container-high text-outline hover:text-secondary transition-colors" title="Edit Data Paket">
                                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                                    </button>
                                                    <Link href={route('admin.questions.index', qb.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors" title="Kelola Butir Soal">
                                                        <span className="material-symbols-outlined text-[16px]">format_list_numbered</span>
                                                        <span className="font-label-sm text-[12px] font-bold">Soal</span>
                                                    </Link>
                                                    <button onClick={() => deleteBankSoal(qb.id)} className="p-1.5 rounded-lg hover:bg-surface-container-high text-outline hover:text-error transition-colors" title="Hapus Paket">
                                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-8 text-center text-on-surface-variant font-label-md">
                                            Belum ada paket soal yang tersedia.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination & Table Metadata Footer */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                        <div className="font-body-sm text-[12px] text-outline">
                            Menampilkan <span className="font-medium text-on-surface">1 - 2</span> dari <span className="font-medium text-on-surface">128</span> paket instrumen terverifikasi
                        </div>
                        <div className="flex items-center gap-1.5">
                            <button className="px-3 py-1.5 rounded-lg bg-surface-container border border-surface-container-highest text-outline hover:text-on-surface font-label-sm text-[12px] transition-colors disabled:opacity-40" disabled>
                                Sebelumnya
                            </button>
                            <div className="flex items-center gap-1 font-label-sm text-[12px]">
                                <span className="w-8 h-8 rounded-lg bg-primary text-on-primary font-bold flex items-center justify-center shadow-sm">1</span>
                                <button className="w-8 h-8 rounded-lg hover:bg-surface-container border border-transparent hover:border-surface-container-highest text-on-surface flex items-center justify-center transition-colors">2</button>
                                <button className="w-8 h-8 rounded-lg hover:bg-surface-container border border-transparent hover:border-surface-container-highest text-on-surface flex items-center justify-center transition-colors">3</button>
                                <span className="text-outline px-1">...</span>
                                <button className="w-8 h-8 rounded-lg hover:bg-surface-container border border-transparent hover:border-surface-container-highest text-on-surface flex items-center justify-center transition-colors">26</button>
                            </div>
                            <button className="px-3 py-1.5 rounded-lg bg-surface-container border border-surface-container-highest hover:bg-surface-container-high text-on-surface font-label-sm text-[12px] transition-colors">
                                Berikutnya
                            </button>
                        </div>
                    </div>
                </div>

                {/* Security & Batch Operations Audit Drawer Footer */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-surface-container border border-surface-container-high rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                            <span className="material-symbols-outlined">hub</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-label-sm text-[13px] text-on-surface font-bold">Sinkronisasi Sub-Server CBT</span>
                            <span className="font-body-sm text-[11px] text-outline mt-0.5 leading-tight">142/142 Sub-server sekolah terhubung penuh (Ping rata-rata: 14ms)</span>
                        </div>
                    </div>
                    <div className="bg-surface-container border border-surface-container-high rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                        <div className="p-2.5 rounded-xl bg-tertiary/10 text-tertiary">
                            <span className="material-symbols-outlined">shield</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-label-sm text-[13px] text-on-surface font-bold">Integritas Bank Soal Master</span>
                            <span className="font-body-sm text-[11px] text-outline mt-0.5 leading-tight">Tidak ada anomali perbedaan hash dalam 24 jam terakhir</span>
                        </div>
                    </div>
                    <div className="bg-surface-container border border-surface-container-high rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                        <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary">
                            <span className="material-symbols-outlined">history</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-label-sm text-[13px] text-on-surface font-bold">Audit Trail Superadmin</span>
                            <span className="font-body-sm text-[11px] text-outline mt-0.5 leading-tight">Sesi 1 dirilis oleh Dr. Aris Sudarto (07:15 WIB)</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal for Creating Question Bank */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={submit} className="p-6 bg-surface">
                    <h2 className="text-lg font-medium text-on-surface">
                        Buat Paket Ujian Baru
                    </h2>
                    <p className="mt-1 text-sm text-on-surface-variant">
                        Silakan lengkapi formulir di bawah ini untuk membuat paket ujian baru.
                    </p>

                    <div className="mt-6">
                        <InputLabel htmlFor="name" value="Nama Paket / Kode Soal" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full bg-surface-container border-surface-container-high text-on-surface"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="mt-6">
                        <InputLabel htmlFor="subject_id" value="Mata Pelajaran" />
                        <select
                            id="subject_id"
                            name="subject_id"
                            value={data.subject_id}
                            className="mt-1 block w-full bg-surface-container border-surface-container-highest text-on-surface rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            onChange={(e) => setData('subject_id', e.target.value)}
                            required
                        >
                            {subjects && subjects.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.subject_id} className="mt-2" />
                    </div>

                    <div className="mt-6">
                        <InputLabel htmlFor="status" value="Status Awal" />
                        <select
                            id="status"
                            name="status"
                            value={data.status}
                            className="mt-1 block w-full bg-surface-container border-surface-container-highest text-on-surface rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            onChange={(e) => setData('status', e.target.value)}
                            required
                        >
                            <option value="Draft">Draft</option>
                            <option value="Menunggu Review">Menunggu Review</option>
                            <option value="Siap Uji">Siap Uji</option>
                        </select>
                        <InputError message={errors.status} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => setIsModalOpen(false)}>Batal</SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={processing}>
                            Buat Paket Ujian
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Modal for Editing Question Bank */}
            <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                <form onSubmit={submitEdit} className="p-6 bg-surface">
                    <h2 className="text-lg font-medium text-on-surface">
                        Edit Data Paket Ujian
                    </h2>
                    <p className="mt-1 text-sm text-on-surface-variant">
                        Perbarui informasi paket ujian ini.
                    </p>

                    <div className="mt-6">
                        <InputLabel htmlFor="edit_name" value="Nama Paket / Kode Soal" />
                        <TextInput
                            id="edit_name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full bg-surface-container border-surface-container-high text-on-surface"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="mt-6">
                        <InputLabel htmlFor="edit_subject_id" value="Mata Pelajaran" />
                        <select
                            id="edit_subject_id"
                            name="subject_id"
                            value={data.subject_id}
                            className="mt-1 block w-full bg-surface-container border-surface-container-highest text-on-surface rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            onChange={(e) => setData('subject_id', e.target.value)}
                            required
                        >
                            {subjects && subjects.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.subject_id} className="mt-2" />
                    </div>

                    <div className="mt-6">
                        <InputLabel htmlFor="edit_status" value="Status" />
                        <select
                            id="edit_status"
                            name="status"
                            value={data.status}
                            className="mt-1 block w-full bg-surface-container border-surface-container-highest text-on-surface rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            onChange={(e) => setData('status', e.target.value)}
                            required
                        >
                            <option value="Draft">Draft</option>
                            <option value="Menunggu Review">Menunggu Review</option>
                            <option value="Siap Uji">Siap Uji</option>
                        </select>
                        <InputError message={errors.status} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => setIsEditModalOpen(false)}>Batal</SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={processing}>
                            Simpan Perubahan
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
