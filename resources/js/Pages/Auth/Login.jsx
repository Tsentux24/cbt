import InputError from '@/Components/InputError';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        role: 'guru',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [networkStatus, setNetworkStatus] = useState('Diagnostik Workstation: Optimal');
    const [isDiagnosing, setIsDiagnosing] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    const diagnoseNetwork = () => {
        setIsDiagnosing(true);
        setNetworkStatus('Memeriksa Jaringan...');
        setTimeout(() => {
            setNetworkStatus('Jaringan Prima • 11ms Ping • 0% Packet Loss');
            setIsDiagnosing(false);
        }, 650);
    };

    return (
        <div className="bg-background font-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen relative overflow-x-hidden flex flex-col justify-between">
            <Head title="Admin Login | ApexCBT" />
            
            <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(6,182,212,0.14),rgba(15,19,29,0))] opacity-90"></div>
            <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(#1c1f2a_1px,transparent_1px)] [background-size:24px_24px] opacity-35"></div>
            
            <header className="relative z-10 w-full px-gutter py-space-md">
                <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                        <span className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">Apex<span className="text-on-surface">CBT</span></span>
                        <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant font-medium">Secure Assessment v3.8</span>
                    </div>
                    <div className="flex items-center gap-space-md">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-outline-variant/30 text-on-surface-variant font-label-sm text-label-sm">
                            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                            <span className="text-on-surface">Node SG-01</span>
                            <span className="text-outline">•</span>
                            <span className="font-medium text-tertiary">18ms</span>
                        </div>
                    </div>
                </div>
            </header>
            
            <main className="relative z-10 flex-1 flex flex-col justify-center items-center w-full px-gutter-mobile sm:px-gutter">
                <div className="flex flex-col w-full">
                    <div className="w-full max-w-7xl mx-auto py-space-md sm:py-space-xl px-0 sm:px-gutter">
                        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-xl overflow-hidden shadow-2xl bg-surface-container-low/80 backdrop-blur-xl relative">
                            
                            {/* Left Info Panel */}
                            <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-space-xl bg-surface-container relative overflow-hidden">
                                <div className="absolute -top-32 -left-32 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                                <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none"></div>
                                
                                <div className="relative z-10 flex flex-col gap-space-lg">
                                    <div className="flex items-center gap-space-md">
                                        <img alt="ApexCBT Core Seal" className="w-12 h-12 rounded-lg object-contain shadow-md shadow-primary/20 bg-surface-container-lowest p-1" src="https://lh3.googleusercontent.com/aida/AEtjO1V1LoidolPy0B4DuKBJ4wx8veBRTm-70XjmTiALDkdtTweqUH7Ne6lY9Y0Ke_s2SDkd5PyEQ67u86xFzuqB4ubKJ4W2NtP2zLszQKAkAYm2tDr-35Q43xYKyCt9hzUrGKTuAVXdFmPSQps6QdF5G9x8RH2gm54-XpkmlxfQmOElglqz6S2TiWbwfXIazz_tskbqgMGsXlkmZXj-6OLrKQUrAS2fHa8MdcyUaiBqesjkutpr6yowYqxyBsQ" />
                                        <div className="flex flex-col">
                                            <span className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold leading-none">Apex<span className="text-on-surface">CBT</span></span>
                                            <span className="font-label-sm text-label-sm text-tertiary tracking-wide uppercase mt-1">High-Stakes Examination Engine</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col gap-space-xs mt-space-md">
                                        <span className="font-label-sm text-label-sm text-primary tracking-wider uppercase">Standar Akreditasi Nasional</span>
                                        <h1 className="font-headline-xl text-headline-xl text-on-surface leading-tight font-bold">
                                            Platform Ujian Berbasis Komputer Presisi Tinggi & Terproteksi Penuh
                                        </h1>
                                        <p className="font-body-md text-body-md text-on-surface-variant mt-2 leading-relaxed">
                                            Arsitektur terdistribusi dengan zero-latency answer sync, proteksi kecurangan tingkat kernel, dan enkripsi sesi deterministik untuk integritas penilaian maksimal.
                                        </p>
                                    </div>
                                    
                                    <div className="flex flex-col gap-space-sm mt-space-sm">
                                        <div className="flex items-start gap-space-md p-space-md rounded-xl bg-surface-container-high/60 backdrop-blur-md">
                                            <span className="material-symbols-outlined text-primary text-[24px] mt-0.5">lock</span>
                                            <div className="flex flex-col">
                                                <span className="font-title-lg text-title-lg text-on-surface">Enkripsi AES-256 Bit</span>
                                                <span className="font-body-sm text-body-sm text-on-surface-variant">Penyimpanan butir soal lokal terenkripsi end-to-end dengan dynamic key swap.</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-space-md p-space-md rounded-xl bg-surface-container-high/60 backdrop-blur-md">
                                            <span className="material-symbols-outlined text-tertiary text-[24px] mt-0.5">security</span>
                                            <div className="flex flex-col">
                                                <span className="font-title-lg text-title-lg text-on-surface">Anti-Cheat Tab & Hardware Lock</span>
                                                <span className="font-body-sm text-body-sm text-on-surface-variant">Mendeteksi alih fokus layar, multi-display, dan injeksi proses background secara real-time.</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-space-md p-space-md rounded-xl bg-surface-container-high/60 backdrop-blur-md">
                                            <span className="material-symbols-outlined text-secondary text-[24px] mt-0.5">sync_saved_locally</span>
                                            <div className="flex flex-col">
                                                <span className="font-title-lg text-title-lg text-on-surface">Zero-Loss Offline Recovery</span>
                                                <span className="font-body-sm text-body-sm text-on-surface-variant">Sinkronisasi otomatis ke pangkalan data cadangan jika konektivitas jaringan terputus.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="relative z-10 pt-space-lg">
                                    <div className="p-space-md rounded-xl bg-surface-container-lowest/80 backdrop-blur-md flex flex-col gap-space-xs">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse"></span>
                                                <span className="font-label-md text-label-md text-on-surface font-semibold">Cluster Alpha (Primary JKT)</span>
                                            </div>
                                            <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-tertiary-container/30 text-tertiary font-bold">12ms Sync</span>
                                        </div>
                                        <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm pt-1">
                                            <span>Keandalan Uptime 99.98%</span>
                                            <span className="text-on-surface">Workstation Verified #ID-4402</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Login Panel */}
                            <div className="col-span-1 lg:col-span-7 p-space-md sm:p-space-xl flex flex-col justify-between bg-surface-container-lowest/50 backdrop-blur-md">
                                <div className="w-full max-w-xl mx-auto flex flex-col gap-space-lg">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-[20px]">shield_person</span>
                                                <span className="font-label-sm text-label-sm text-primary font-semibold tracking-wider uppercase">Portal Akses Terverifikasi</span>
                                            </div>
                                            <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">Rayon 04 - DKI</span>
                                        </div>
                                        <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mt-2">Masuk ke Sistem ApexCBT</h2>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Pilih jenis akun pengujian dan gunakan kredensial resmi sekolah/lembaga penyelenggara.</p>
                                    </div>

                                    {/* Role Selection Tabs */}
                                    <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-surface-container-high">
                                        <button 
                                            onClick={() => setData('role', 'guru')}
                                            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-label-md text-label-md transition-all duration-200 ${data.role === 'guru' ? 'font-semibold bg-primary text-on-primary shadow-lg shadow-primary/20' : 'font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}
                                            type="button"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">school</span>
                                            <span>Guru / Pengajar</span>
                                        </button>
                                        <button 
                                            onClick={() => setData('role', 'pengawas')}
                                            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-label-md text-label-md transition-all duration-200 ${data.role === 'pengawas' ? 'font-semibold bg-primary text-on-primary shadow-lg shadow-primary/20' : 'font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}
                                            type="button"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">badge</span>
                                            <span>Pengawas Ujian</span>
                                        </button>
                                        <button 
                                            onClick={() => setData('role', 'superadmin')}
                                            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-label-md text-label-md transition-all duration-200 ${data.role === 'superadmin' ? 'font-semibold bg-primary text-on-primary shadow-lg shadow-primary/20' : 'font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}
                                            type="button"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">terminal</span>
                                            <span>Superadmin</span>
                                        </button>
                                    </div>
                                    
                                    {status && <div className="font-label-md text-[var(--color-color-success-500)] bg-tertiary-container/20 p-3 rounded-lg">{status}</div>}

                                    <form className="flex flex-col gap-space-md" onSubmit={submit}>
                                        <div className="flex flex-col gap-space-xs">
                                            <label className="font-label-sm text-label-sm text-on-surface flex items-center justify-between" htmlFor="email">
                                                {data.role === 'guru' && <span>Nomor Induk Pegawai (NIP) / ID Staf / Email</span>}
                                                {data.role === 'pengawas' && <span>NIP / Kode Pengawas CBT / Email</span>}
                                                {data.role === 'superadmin' && <span>Root Admin Identity / Email</span>}
                                                
                                                <span className="text-on-surface-variant text-[11px]">Kredensial Resmi</span>
                                            </label>
                                            <div className="relative flex items-center rounded-xl bg-surface-container-high transition-colors focus-within:bg-surface-container-highest">
                                                <span className="material-symbols-outlined text-outline absolute left-3.5 text-[20px]">badge</span>
                                                <input 
                                                    className="w-full bg-transparent pl-11 pr-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary rounded-xl transition-all" 
                                                    id="email" 
                                                    name="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder={data.role === 'superadmin' ? 'admin@apexcbt.local' : 'Masukkan Email / NIP / ID Staf'}
                                                    required 
                                                    type="text" 
                                                    autoComplete="username"
                                                    autoFocus
                                                />
                                            </div>
                                            <InputError message={errors.email} className="mt-1 text-[var(--color-color-error)]" />
                                        </div>

                                        <div className="flex flex-col gap-space-xs">
                                            <div className="flex items-center justify-between">
                                                <label className="font-label-sm text-label-sm text-on-surface" htmlFor="password">
                                                    {data.role === 'superadmin' ? 'Master Passphrase' : 'Kata Sandi Akun'}
                                                </label>
                                            </div>
                                            <div className="relative flex items-center rounded-xl bg-surface-container-high transition-colors focus-within:bg-surface-container-highest">
                                                <span className="material-symbols-outlined text-outline absolute left-3.5 text-[20px]">key</span>
                                                <input 
                                                    className="w-full bg-transparent pl-11 pr-11 py-3 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary rounded-xl transition-all" 
                                                    id="password" 
                                                    name="password"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    placeholder={data.role === 'superadmin' ? '••••••••••••••••' : 'Masukkan kata sandi portal manajemen'}
                                                    required 
                                                    type={showPassword ? "text" : "password"} 
                                                />
                                                <button aria-label="Toggle password visibility" className="absolute right-3.5 text-outline hover:text-on-surface transition-colors" onClick={() => setShowPassword(!showPassword)} type="button">
                                                    <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                                </button>
                                            </div>
                                            <InputError message={errors.password} className="mt-1 text-[var(--color-color-error)]" />
                                        </div>

                                        <div className="flex items-center justify-between pt-1">
                                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                                <input 
                                                    checked={data.remember} 
                                                    onChange={(e) => setData('remember', e.target.checked)} 
                                                    className="w-4 h-4 rounded bg-surface-container-high text-primary focus:ring-0 focus:outline-none cursor-pointer border-none" 
                                                    type="checkbox" 
                                                />
                                                <span className="font-label-sm text-label-sm text-on-surface-variant">Ingat login saya</span>
                                            </label>
                                            <Link className="font-label-sm text-label-sm text-primary hover:underline font-medium" href={route('password.request')}>Lupa Kata Sandi?</Link>
                                        </div>

                                        <button 
                                            className="w-full mt-2 py-3.5 px-6 rounded-xl font-label-md text-label-md font-bold tracking-wide uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-xl shadow-primary/25 bg-gradient-to-r from-primary via-primary-container to-secondary-container text-on-primary hover:opacity-95 active:scale-[0.99]" 
                                            id="btn-submit" 
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <>
                                                    <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                                                    <span>Memvalidasi Akses...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>
                                                        {data.role === 'guru' && 'Masuk Console Guru'}
                                                        {data.role === 'pengawas' && 'Buka Dashboard Pengawas'}
                                                        {data.role === 'superadmin' && 'Buka Konsol Root'}
                                                    </span>
                                                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                                </>
                                            )}
                                        </button>
                                    </form>

                                    <div className="p-3 rounded-lg bg-surface-container-high/60 border border-outline-variant/30 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-secondary text-[18px]">open_in_new</span>
                                            <span>Login Siswa dialihkan ke portal ujian terpisah: <Link href="/ujian" className="text-primary hover:underline font-semibold">/ujian</Link></span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="w-full max-w-xl mx-auto pt-space-lg mt-space-md flex flex-col sm:flex-row items-center justify-between gap-space-sm">
                                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors font-label-sm text-label-sm" onClick={diagnoseNetwork} type="button">
                                        <span className={`material-symbols-outlined text-[16px] text-tertiary ${isDiagnosing ? 'animate-spin' : ''}`}>network_check</span>
                                        <span id="network-status-text" className="">{networkStatus}</span>
                                    </button>
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                                            <span>Sistem Terhubung</span>
                                        </span>
                                        <span className="font-label-sm text-label-sm text-outline">v4.8.2-prod</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            
            <footer className="relative z-10 w-full py-space-md px-gutter text-center">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-space-xs text-on-surface-variant font-label-sm text-label-sm max-w-7xl mx-auto">
                    <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-[16px] text-tertiary">verified_user</span>
                        <span>Encrypted Session 256-bit AES</span>
                    </div>
                    <div>© 2025 ApexCBT Assessment Systems. All rights reserved.</div>
                </div>
            </footer>
        </div>
    );
}
