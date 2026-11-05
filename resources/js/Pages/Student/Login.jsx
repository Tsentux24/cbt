import InputError from '@/Components/InputError';
import { Head, useForm, Link } from '@inertiajs/react';

export default function StudentLogin({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        nisn: '',
        password: '',
        token: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/student/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-on-surface font-body-md p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(6,182,212,0.14),rgba(15,19,29,0))] opacity-90"></div>
            <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(#1c1f2a_1px,transparent_1px)] [background-size:24px_24px] opacity-35"></div>

            <Head title="Login Peserta | ApexCBT" />

            <div className="w-full max-w-md bg-surface-container p-8 rounded-2xl shadow-2xl border border-outline-variant/30 relative z-10 backdrop-blur-xl">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-primary text-[32px]">school</span>
                    </div>
                    <h1 className="text-2xl font-bold font-headline-lg text-primary">Apex<span className="text-on-surface">CBT</span></h1>
                    <p className="text-sm font-label-sm text-on-surface-variant mt-2 tracking-wide uppercase">Portal Akses Peserta Ujian</p>
                </div>

                {status && <div className="mb-4 text-sm font-medium text-tertiary">{status}</div>}

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-label-md text-on-surface-variant mb-1" htmlFor="nisn">Nomor Induk Siswa Nasional (NISN)</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-outline text-[20px]">badge</span>
                            <input
                                id="nisn"
                                type="text"
                                name="nisn"
                                value={data.nisn}
                                autoComplete="username"
                                autoFocus
                                placeholder="Contoh: 0064928174"
                                onChange={(e) => setData('nisn', e.target.value)}
                                className="w-full bg-surface-container-high border border-outline-variant/50 rounded-xl pl-11 pr-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-outline"
                            />
                        </div>
                        <InputError message={errors.nisn} className="mt-2 text-error" />
                    </div>

                    <div>
                        <label className="block text-sm font-label-md text-on-surface-variant mb-1" htmlFor="password">Kata Sandi / PIN</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-outline text-[20px]">key</span>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                autoComplete="current-password"
                                placeholder="Masukkan PIN peserta"
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full bg-surface-container-high border border-outline-variant/50 rounded-xl pl-11 pr-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-outline"
                            />
                        </div>
                        <InputError message={errors.password} className="mt-2 text-error" />
                    </div>

                    <div>
                        <label className="block text-sm font-label-md text-on-surface-variant mb-1" htmlFor="token">Token Ujian (Opsional)</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-outline text-[20px]">tag</span>
                            <input
                                id="token"
                                type="text"
                                name="token"
                                value={data.token}
                                placeholder="Cth: K7P9-X2MQ"
                                onChange={(e) => setData('token', e.target.value.toUpperCase())}
                                className="w-full bg-surface-container-high border border-outline-variant/50 rounded-xl pl-11 pr-4 py-3 text-on-surface font-mono uppercase tracking-widest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-outline"
                            />
                        </div>
                        <InputError message={errors.token} className="mt-2 text-error" />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-gradient-to-r from-primary to-primary-container hover:opacity-90 text-on-primary font-label-md font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-6"
                    >
                        {processing ? (
                            <>
                                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                                Memvalidasi...
                            </>
                        ) : (
                            <>
                                <span>Masuk Ruang CBT</span>
                                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                            </>
                        )}
                    </button>
                </form>
                
                <div className="mt-6 pt-6 border-t border-outline-variant/30 text-center">
                    <p className="text-xs text-on-surface-variant flex justify-center items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">security</span>
                        Sesi Terenkripsi End-to-End
                    </p>
                </div>
            </div>
        </div>
    );
}
