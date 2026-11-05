import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export default function AuthenticatedLayout({ children }) {
    const user = usePage().props.auth.user;
    const { flash } = usePage().props;
    
    // Quick helper to determine active path
    const { url } = usePage();
    const isActive = (path) => url.startsWith(path);

    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: flash.success,
                showConfirmButton: false,
                timer: 4000,
                timerProgressBar: true,
                background: 'var(--color-surface-container-high)',
                color: 'var(--color-on-surface)',
                iconColor: 'var(--color-primary)',
                customClass: {
                    container: 'z-[99999]'
                }
            });
        }
        if (flash?.error) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: flash.error,
                showConfirmButton: false,
                timer: 4000,
                timerProgressBar: true,
                background: 'var(--color-surface-container-high)',
                color: 'var(--color-on-surface)',
                iconColor: 'var(--color-error)',
                customClass: {
                    container: 'z-[99999]'
                }
            });
        }
    }, [flash]);

    return (
        <div className="bg-background font-body-md text-on-surface antialiased min-h-screen">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
                <div className="flex flex-col">
                    <div className="h-16 px-space-lg flex items-center gap-3 bg-surface-container-low">
                        <img 
                            alt="ApexCBT" 
                            className="h-8 w-auto object-contain" 
                            src="https://lh3.googleusercontent.com/aida/AEtjO1V1LoidolPy0B4DuKBJ4wx8veBRTm-70XjmTiALDkdtTweqUH7Ne6lY9Y0Ke_s2SDkd5PyEQ67u86xFzuqB4ubKJ4W2NtP2zLszQKAkAYm2tDr-35Q43xYKyCt9hzUrGKTuAVXdFmPSQps6QdF5G9x8RH2gm54-XpkmlxfQmOElglqz6S2TiWbwfXIazz_tskbqgMGsXlkmZXj-6OLrKQUrAS2fHa8MdcyUaiBqesjkutpr6yowYqxyBsQ"
                        />
                        <div className="flex flex-col">
                            <span className="font-headline-md text-headline-md tracking-tight text-on-surface">ApexCBT</span>
                            <span className="font-label-sm text-label-sm text-primary tracking-wider uppercase">Assessment Engine</span>
                        </div>
                    </div>
                    
                    <div className="px-space-md py-space-sm">
                        <div className="px-space-sm py-space-xs font-label-sm text-label-sm uppercase tracking-wider text-outline">Main Console</div>
                    </div>
                    
                    <nav className="flex flex-col gap-1 px-space-md">
                        <Link 
                            href={route('dashboard')} 
                            className={`flex items-center gap-3 px-space-md py-2.5 rounded-lg transition-all ${isActive('/dashboard') ? 'bg-primary text-on-primary font-bold shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-medium'}`}
                        >
                            <span className="material-symbols-outlined text-title-lg">dashboard</span>
                            <span className="font-label-md text-label-md">Overview Dashboard</span>
                        </Link>
                        <Link 
                            href="/admin/bank-soal" 
                            className={`flex items-center gap-3 px-space-md py-2.5 rounded-lg transition-all ${isActive('/admin/bank-soal') ? 'bg-primary text-on-primary font-bold shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-medium'}`}
                        >
                            <span className="material-symbols-outlined text-title-lg">inventory</span>
                            <span className="font-label-md text-label-md">Bank Soal & Ujian</span>
                        </Link>
                        <Link 
                            href="/admin/students" 
                            className={`flex items-center gap-3 px-space-md py-2.5 rounded-lg transition-all ${isActive('/admin/students') ? 'bg-primary text-on-primary font-bold shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-medium'}`}
                        >
                            <span className="material-symbols-outlined text-title-lg">group</span>
                            <span className="font-label-md text-label-md">Data Peserta (Siswa)</span>
                        </Link>
                        <Link 
                            href="/admin/subjects" 
                            className={`flex items-center gap-3 px-space-md py-2.5 rounded-lg transition-all ${isActive('/admin/subjects') ? 'bg-primary text-on-primary font-bold shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-medium'}`}
                        >
                            <span className="material-symbols-outlined text-title-lg">menu_book</span>
                            <span className="font-label-md text-label-md">Mata Pelajaran</span>
                        </Link>
                        <Link 
                            href="/admin/schools" 
                            className={`flex items-center gap-3 px-space-md py-2.5 rounded-lg transition-all ${isActive('/admin/schools') ? 'bg-primary text-on-primary font-bold shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-medium'}`}
                        >
                            <span className="material-symbols-outlined text-title-lg">account_balance</span>
                            <span className="font-label-md text-label-md">Manajemen Sekolah</span>
                        </Link>
                        <Link 
                            href="/admin/exam-sessions" 
                            className={`flex items-center gap-3 px-space-md py-2.5 rounded-lg transition-all ${isActive('/admin/exam-sessions') ? 'bg-primary text-on-primary font-bold shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-medium'}`}
                        >
                            <span className="material-symbols-outlined text-title-lg">generating_tokens</span>
                            <span className="font-label-md text-label-md">Sesi & Token</span>
                        </Link>
                        <Link 
                            href="/admin/class-rooms" 
                            className={`flex items-center gap-3 px-space-md py-2.5 rounded-lg transition-all ${isActive('/admin/class-rooms') ? 'bg-primary text-on-primary font-bold shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-medium'}`}
                        >
                            <span className="material-symbols-outlined text-title-lg">domain_add</span>
                            <span className="font-label-md text-label-md">Manajemen Kelas</span>
                        </Link>
                        <Link 
                            href="/admin/users" 
                            className={`flex items-center gap-3 px-space-md py-2.5 rounded-lg transition-all ${isActive('/admin/users') ? 'bg-primary text-on-primary font-bold shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-medium'}`}
                        >
                            <span className="material-symbols-outlined text-title-lg">manage_accounts</span>
                            <span className="font-label-md text-label-md">Manajemen Pengguna</span>
                        </Link>
                    </nav>
                </div>
                
                <div className="p-space-md">
                    <div className="bg-surface-container rounded-xl p-space-md flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span className="font-label-sm text-label-sm text-outline">Sesi Ujian ID</span>
                            <span className="font-label-sm text-label-sm text-primary">CBT-2024-X9</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                            <span className="font-body-sm text-body-sm text-on-surface">Enkripsi AES-256 Aktif</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Wrapper */}
            <div className="pl-72 flex flex-col min-h-screen">
                {/* Header */}
                <header className="fixed top-0 left-72 right-0 h-16 bg-surface/80 backdrop-blur-xl z-40 flex items-center justify-between px-gutter shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container-high">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-space-sm py-space-xs rounded-full bg-surface-container text-on-surface-variant border border-surface-container-high">
                            <span className="material-symbols-outlined text-body-sm text-primary">verified_user</span>
                            <span className="font-label-sm text-label-sm text-on-surface">Mode Superadmin Aktif</span>
                        </div>
                        <div className="hidden md:flex items-center gap-2 px-space-sm py-space-xs rounded-full bg-surface-container border border-surface-container-high">
                            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                            <span className="font-label-sm text-label-sm text-tertiary">Server Live</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-space-lg">
                        <div className="hidden sm:flex items-center gap-2 bg-surface-container-low px-space-md py-1 rounded-lg border border-surface-container-high">
                            <span className="material-symbols-outlined text-body-sm text-primary">schedule</span>
                            <span className="font-mono-timer text-body-md text-primary font-bold tracking-wider">09:42:18</span>
                            <span className="font-label-sm text-label-sm text-outline">WIB</span>
                        </div>
                        
                        <button 
                            onClick={() => {
                                if (document.documentElement.classList.contains('dark')) {
                                    document.documentElement.classList.remove('dark');
                                    localStorage.setItem('theme', 'light');
                                } else {
                                    document.documentElement.classList.add('dark');
                                    localStorage.setItem('theme', 'dark');
                                }
                            }}
                            className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors border border-surface-container-high"
                            title="Toggle Light/Dark Mode"
                        >
                            <span className="material-symbols-outlined dark:hidden block">light_mode</span>
                            <span className="material-symbols-outlined hidden dark:block">dark_mode</span>
                        </button>
                        <button className="relative p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors border border-surface-container-high">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        </button>
                        
                        <div className="pl-space-sm flex items-center">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-3 focus:outline-none bg-surface-container-low hover:bg-surface-container px-3 py-1.5 rounded-xl transition-colors border border-transparent hover:border-surface-container-high">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="hidden lg:flex flex-col text-left">
                                            <span className="font-label-md text-label-md text-on-surface leading-tight">{user.name}</span>
                                            <span className="font-label-sm text-label-sm text-outline leading-tight">{user.email}</span>
                                        </div>
                                        <span className="material-symbols-outlined text-on-surface-variant text-body-sm">arrow_drop_down</span>
                                    </button>
                                </Dropdown.Trigger>
                                
                                <Dropdown.Content contentClasses="py-1 bg-surface-container-high border border-outline-variant/30 text-on-surface mt-2 shadow-2xl rounded-xl">
                                    <Dropdown.Link href={route('profile.edit')} className="text-on-surface hover:bg-surface-bright hover:text-primary transition-colors flex items-center gap-2 font-label-md">
                                        <span className="material-symbols-outlined text-[18px]">person</span> Profile Settings
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button" className="text-error hover:bg-error-container hover:text-error transition-colors flex items-center gap-2 font-label-md">
                                        <span className="material-symbols-outlined text-[18px]">logout</span> Terminate Session
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </header>
                
                {/* Main Content Area */}
                <main className="relative pt-16 bg-background w-full px-gutter min-h-screen flex flex-col flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
