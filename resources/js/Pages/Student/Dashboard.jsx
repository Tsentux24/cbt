import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Dashboard({ active_exams, upcoming_exams, statistics }) {
    const { flash, auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        token: '',
    });

    const submitToken = (e) => {
        e.preventDefault();
        post(route('student.verify_token'));
    };

    return (
        <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen">
            <Head title="Dashboard | ApexCBT" />

            <header className="h-16 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container-high flex items-center justify-between px-gutter">
                <div className="flex items-center gap-3">
                    <img 
                        alt="ApexCBT" 
                        className="h-8 w-auto object-contain" 
                        src="https://lh3.googleusercontent.com/aida/AEtjO1V1LoidolPy0B4DuKBJ4wx8veBRTm-70XjmTiALDkdtTweqUH7Ne6lY9Y0Ke_s2SDkd5PyEQ67u86xFzuqB4ubKJ4W2NtP2zLszQKAkAYm2tDr-35Q43xYKyCt9hzUrGKTuAVXdFmPSQps6QdF5G9x8RH2gm54-XpkmlxfQmOElglqz6S2TiWbwfXIazz_tskbqgMGsXlkmZXj-6OLrKQUrAS2fHa8MdcyUaiBqesjkutpr6yowYqxyBsQ"
                    />
                    <div className="flex flex-col hidden sm:flex">
                        <span className="font-headline-md text-headline-md tracking-tight text-on-surface">ApexCBT</span>
                        <span className="font-label-sm text-label-sm text-primary tracking-wider uppercase">Student Portal</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
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
                    <div className="flex items-center gap-3 pl-3 border-l border-surface-container-highest">
                        <div className="flex flex-col text-right hidden sm:flex">
                            <span className="font-label-md text-label-md font-bold">{auth?.user?.name}</span>
                            <span className="font-label-sm text-label-sm text-outline">Siswa</span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {auth?.user?.name?.charAt(0) || 'S'}
                        </div>
                    </div>
                </div>
            </header>

            <main className="py-12 bg-background">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-surface-container-low shadow-lg sm:rounded-2xl border border-surface-container-highest p-8">
                        <div className="text-on-surface">
                            <h3 className="text-[24px] font-bold text-primary font-heading tracking-tight">Halo, {auth?.user?.name}!</h3>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                                <p className="text-[15px] text-on-surface-variant">Kamu memiliki <strong className="text-primary">{active_exams.length} ujian aktif</strong> dan {upcoming_exams.length} ujian yang akan datang.</p>
                                <Link 
                                    href={route('logout')} 
                                    method="post" 
                                    as="button"
                                    className="px-5 py-2.5 bg-error-container/50 hover:bg-error-container text-on-error-container border border-error/30 font-bold rounded-xl text-[14px] transition-all flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">logout</span>
                                    Akhiri Sesi / Keluar
                                </Link>
                            </div>
                            
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-surface-container p-6 rounded-2xl border border-surface-container-highest shadow-sm">
                                    <p className="text-[13px] text-outline font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px] text-primary">key</span>
                                        Token Ujian Aktif
                                    </p>
                                    <form onSubmit={submitToken} className="flex gap-2">
                                        <input 
                                            type="text" 
                                            value={data.token}
                                            onChange={e => setData('token', e.target.value.toUpperCase())}
                                            placeholder="Ketik Token..." 
                                            required 
                                            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface font-mono tracking-widest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary uppercase text-[16px] shadow-inner" 
                                        />
                                        <button disabled={processing} type="submit" className="px-6 py-3 bg-primary hover:bg-primary-fixed-dim text-on-primary font-bold rounded-xl transition-colors whitespace-nowrap shadow-md active:scale-95 flex items-center gap-2 disabled:opacity-50">
                                            <span>Mulai</span>
                                            <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                                        </button>
                                    </form>
                                    {flash.error && <p className="mt-3 text-[14px] text-error font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">error</span> {flash.error}</p>}
                                    {flash.success && <p className="mt-3 text-[14px] text-primary font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">check_circle</span> {flash.success}</p>}
                                    {errors.token && <p className="mt-3 text-[14px] text-error flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">error</span> {errors.token}</p>}
                                </div>
                                <div className="bg-surface-container p-6 rounded-2xl border border-surface-container-highest shadow-sm flex flex-col justify-center relative overflow-hidden">
                                    <div className="absolute -right-8 -bottom-8 opacity-5">
                                        <span className="material-symbols-outlined text-[120px]">emoji_events</span>
                                    </div>
                                    <p className="text-[13px] text-outline font-medium uppercase tracking-wider mb-2 relative z-10">Peringkat Kelas</p>
                                    <div className="flex items-baseline gap-2 relative z-10">
                                        <span className="text-5xl font-bold text-primary tracking-tighter">{statistics.rank !== '-' ? '#' : ''}{statistics.rank}</span>
                                        <span className="text-on-surface-variant font-medium">/ {statistics.total_students} Siswa</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
