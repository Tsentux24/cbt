import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import Swal from 'sweetalert2';

export default function ExamSessions({ sessions, schools, classRooms, questionBanks }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        school_id: schools && schools.length > 0 ? schools[0].id : '',
        class_room_id: '',
        question_bank_id: '',
        duration: 120, // default 2 hours
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.exam-sessions.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    const deleteSession = (id) => {
        Swal.fire({
            title: 'Hapus Sesi Ujian?',
            text: "Aksi ini tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'var(--color-error)',
            cancelButtonColor: 'var(--color-surface-container-highest)',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
            background: 'var(--color-surface)',
            color: 'var(--color-on-surface)',
            customClass: { container: 'z-[99999]' }
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.exam-sessions.destroy', id));
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Sesi & Pelaksanaan | ApexCBT" />

            <div className="flex flex-col w-full pb-16 pt-6">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="font-headline-xl text-[32px] font-bold text-on-surface tracking-tight leading-tight">Sesi & Pelaksanaan</h1>
                        <p className="font-body-sm text-[14px] text-on-surface-variant max-w-3xl leading-relaxed mt-1">
                            Buat jadwal pelaksanaan, kontrol akses, dan hasilkan Token ujian untuk siswa.
                        </p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-fixed text-on-primary text-[14px] font-bold transition-all shadow-[0_0_20px_rgba(76,215,246,0.25)] active:scale-[0.98]">
                        <span className="material-symbols-outlined text-[20px]">add_circle</span>
                        <span>Buat Sesi Ujian & Token</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sessions && sessions.length > 0 ? (
                        sessions.map((session, index) => {
                            const isLive = session.status === 'Aktif';
                            const isDone = session.status === 'Selesai';
                            const badgeColor = isLive ? 'bg-tertiary/20 text-tertiary border-tertiary/30' : (isDone ? 'bg-surface-container-highest text-on-surface-variant border-outline/30' : 'bg-surface-container-high text-outline border-outline/30');
                            const indicatorColor = isLive ? 'bg-tertiary animate-pulse' : (isDone ? 'bg-on-surface-variant' : 'bg-outline');
                            
                            return (
                            <div key={session.id} className="bg-[#121623] border border-[#1e2538] rounded-2xl p-5 flex flex-col gap-4 relative shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                                <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => deleteSession(session.id)} className="p-1.5 rounded bg-error/20 text-error hover:bg-error hover:text-on-error transition-colors">
                                        <span className="material-symbols-outlined text-[16px]">delete</span>
                                    </button>
                                </div>
                                
                                {/* Header: Sesi, Waktu, Status */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded bg-[#06B6D4] text-[#003640] font-bold text-[10px] tracking-wider">SESI {index + 1}</span>
                                        <span className="text-[#bcc9cd] font-mono font-semibold text-[12px]">
                                            {new Date(session.start_time).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})} - {new Date(session.end_time).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})} WIB
                                        </span>
                                    </div>
                                    <div className={`px-2.5 py-1 rounded-full border flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase ${badgeColor}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${indicatorColor}`}></span>
                                        {session.status}
                                    </div>
                                </div>

                                {/* Title & Subtitle */}
                                <div className="flex flex-col gap-1">
                                    <h3 className="font-bold text-white text-[18px] leading-tight">{session.name}</h3>
                                    <span className="text-[#869397] text-[12px]">{session.question_bank?.name} • {session.class_room?.name}</span>
                                </div>

                                {/* Progress Bar / Stats */}
                                <div className="flex flex-col gap-2 mt-2">
                                    <div className="flex items-center justify-between text-[11px]">
                                        <span className="text-[#bcc9cd] font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">group</span> Partisipasi: 0 / 0 Peserta</span>
                                        <span className="text-[#10B981] font-bold">0% Hadir</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-[#1e2538] rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-[#06B6D4] to-[#10B981] w-[0%]"></div>
                                    </div>
                                </div>

                                {/* Divider & Info Strip */}
                                <div className="flex items-center justify-between border-t border-[#1e2538] pt-3 mt-1">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-[#869397] font-semibold uppercase tracking-wider">Sisa Waktu</span>
                                        <span className={`font-mono text-[13px] font-bold ${isLive ? 'text-[#ffb4ab]' : 'text-[#bcc9cd]'}`}>
                                            {isLive ? 'BERJALAN' : (isDone ? 'SELESAI' : 'MENUNGGU')}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] text-[#869397] font-semibold uppercase tracking-wider">Token Aktif</span>
                                        <span className="font-mono text-[16px] font-bold text-[#4cd7f6] tracking-[0.1em] bg-[#4cd7f6]/10 px-2 py-0.5 rounded">{session.token}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <button 
                                        onClick={() => Swal.fire({title: 'Broadcast Berhasil', text: 'Token telah disebarkan ke seluruh siswa di Sesi ini', icon: 'success', background: 'var(--color-surface)', color: 'var(--color-on-surface)'})}
                                        className="bg-[#1e2538] hover:bg-[#2c354d] text-[#bcc9cd] py-2 rounded-lg text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors border border-[#2c354d]">
                                        <span className="material-symbols-outlined text-[16px]">campaign</span> Broadcast
                                    </button>
                                    <button 
                                        onClick={() => Swal.fire({title: 'Waktu Ditambahkan', text: '15 Menit darurat telah ditambahkan ke seluruh klien', icon: 'info', background: 'var(--color-surface)', color: 'var(--color-on-surface)'})}
                                        className="bg-[#1e2538] hover:bg-[#2c354d] text-[#10B981] py-2 rounded-lg text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors border border-[#10B981]/30">
                                        <span className="material-symbols-outlined text-[16px]">more_time</span> +15m Darurat
                                    </button>
                                    <button 
                                        onClick={() => Swal.fire({title: 'Sesi Dipause', text: 'Ujian dihentikan sementara. Siswa tidak bisa menjawab soal.', icon: 'warning', background: 'var(--color-surface)', color: 'var(--color-on-surface)'})}
                                        className="bg-[#1e2538] hover:bg-[#2c354d] text-[#bcc9cd] py-2 rounded-lg text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors border border-[#2c354d]">
                                        <span className="material-symbols-outlined text-[16px]">pause_circle</span> Pause Sesi
                                    </button>
                                    <button 
                                        onClick={() => Swal.fire({title: 'Kunci Sesi', text: 'Sesi Ujian dikunci. Tidak ada lagi siswa yang bisa masuk.', icon: 'error', background: 'var(--color-surface)', color: 'var(--color-on-surface)', confirmButtonColor: '#ffb4ab'})}
                                        className="bg-[#93000a] hover:bg-[#ffb4ab] hover:text-[#690005] text-[#ffdad6] py-2 rounded-lg text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors border border-[#ffb4ab]/30">
                                        <span className="material-symbols-outlined text-[16px]">lock</span> Kunci Sesi
                                    </button>
                                </div>
                            </div>
                        )})
                    ) : (
                        <div className="col-span-full bg-surface-container-low border border-surface-container-high rounded-2xl p-12 shadow-sm flex flex-col items-center justify-center gap-3 text-center">
                            <span className="material-symbols-outlined text-[48px] text-on-surface-variant/50">event_busy</span>
                            <h3 className="font-title-md text-on-surface font-bold">Belum Ada Jadwal</h3>
                            <p className="font-body-sm text-on-surface-variant max-w-sm">Jadwal kosong. Silakan buat Sesi Ujian baru untuk men-generate Token pertama Anda.</p>
                        </div>
                    )}
                </div>
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={submit} className="p-6 bg-surface">
                    <h2 className="text-lg font-medium text-on-surface mb-6">Buat Sesi Ujian Baru</h2>
                    
                    <div className="mb-6">
                        <InputLabel htmlFor="name" value="Nama Sesi (Contoh: Sesi Pagi X IPA 1)" />
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

                    <div className="mb-6 flex gap-4">
                        <div className="w-1/2">
                            <InputLabel htmlFor="school_id" value="Sekolah / Instansi" />
                            <select
                                id="school_id"
                                name="school_id"
                                value={data.school_id}
                                className="mt-1 block w-full bg-surface-container border-surface-container-highest text-on-surface rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                onChange={(e) => setData('school_id', e.target.value)}
                                required
                            >
                                {schools && schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            <InputError message={errors.school_id} className="mt-2" />
                        </div>
                        <div className="w-1/2">
                            <InputLabel htmlFor="class_room_id" value="Target Kelas" />
                            <select
                                id="class_room_id"
                                name="class_room_id"
                                value={data.class_room_id}
                                className="mt-1 block w-full bg-surface-container border-surface-container-highest text-on-surface rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                onChange={(e) => setData('class_room_id', e.target.value)}
                                required
                            >
                                <option value="" disabled>Pilih Kelas Target</option>
                                {classRooms && classRooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <InputError message={errors.class_room_id} className="mt-2" />
                        </div>
                    </div>

                    <div className="mb-6 flex gap-4">
                        <div className="w-1/2">
                            <InputLabel htmlFor="question_bank_id" value="Bank Soal" />
                            <select
                                id="question_bank_id"
                                name="question_bank_id"
                                value={data.question_bank_id}
                                className="mt-1 block w-full bg-surface-container border-surface-container-highest text-on-surface rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                onChange={(e) => setData('question_bank_id', e.target.value)}
                                required
                            >
                                <option value="" disabled>Pilih Bank Soal</option>
                                {questionBanks && questionBanks.map(q => <option key={q.id} value={q.id}>{q.name}</option>)}
                            </select>
                            <InputError message={errors.question_bank_id} className="mt-2" />
                        </div>
                        <div className="w-1/2">
                            <InputLabel htmlFor="duration" value="Durasi (dalam menit)" />
                            <TextInput
                                id="duration"
                                name="duration"
                                type="number"
                                value={data.duration}
                                className="mt-1 block w-full bg-surface-container border-surface-container-high text-on-surface"
                                onChange={(e) => setData('duration', e.target.value)}
                                required
                            />
                            <InputError message={errors.duration} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => setIsModalOpen(false)}>Batal</SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={processing}>Simpan & Buat Token</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
