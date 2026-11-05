import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function StudentManagement({ students, schools, classRooms }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        nisn: '',
        password: '',
        school_id: '',
        class_room_id: '',
    });

    const openAddModal = () => {
        reset();
        setEditingStudent(null);
        setShowAddModal(true);
    };

    const openEditModal = (student) => {
        setEditingStudent(student);
        setData({
            name: student.user.name,
            nisn: student.nisn,
            password: '', // Leave blank unless they want to change it
            school_id: student.school_id,
            class_room_id: student.class_room_id || '',
        });
        setShowAddModal(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingStudent) {
            put(`/admin/students/${editingStudent.id}`, {
                onSuccess: () => {
                    setShowAddModal(false);
                    reset();
                }
            });
        } else {
            post('/admin/students', {
                onSuccess: () => {
                    setShowAddModal(false);
                    reset();
                }
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Siswa | ApexCBT" />

            <div className="flex flex-col w-full pb-16">
                <div className="relative w-full overflow-hidden">
                    <div className="absolute -top-32 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-6 mb-8 relative z-10">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <span className="font-label-sm text-[12px] text-outline uppercase tracking-wider">Superadmin Console</span>
                                <span className="text-outline-variant font-label-sm text-[12px]">/</span>
                                <span className="font-label-sm text-[12px] text-primary uppercase tracking-wider font-semibold">Peserta Ujian</span>
                            </div>
                            <h1 className="font-headline-xl text-[32px] font-bold text-on-surface tracking-tight leading-tight mt-1">Manajemen Data Siswa & Token Akses</h1>
                            <p className="font-body-sm text-[14px] text-on-surface-variant max-w-3xl leading-relaxed mt-1">
                                Kelola identitas peserta ujian, generate credential massal, dan sinkronisasi data roster siswa lintas sekolah.
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-bright text-on-surface text-[14px] font-medium transition-all shadow-sm border border-surface-container-high">
                                <span className="material-symbols-outlined text-[18px] text-secondary">upload_file</span>
                                <span>Import Dapodik CSV</span>
                            </button>
                            <button 
                                onClick={openAddModal}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-fixed text-on-primary text-[14px] font-bold transition-all shadow-[0_0_20px_rgba(76,215,246,0.25)] active:scale-[0.98]"
                            >
                                <span className="material-symbols-outlined text-[20px]">person_add</span>
                                <span>+ Tambah Siswa Baru</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-surface-container-low border border-surface-container-high rounded-2xl p-6 shadow-xl flex flex-col gap-5 relative z-10">
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-2">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-[24px]">group</span>
                                <h2 className="font-headline-md text-[20px] font-bold text-on-surface">Direktori Peserta</h2>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="relative">
                                <input className="bg-surface-container border border-surface-container-highest px-3 py-2.5 pl-9 rounded-xl font-body-sm text-[13px] text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary transition-all w-64" placeholder="Cari NISN atau Nama Siswa..." type="text" />
                                <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[18px] text-outline">search</span>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-xl bg-surface-container border border-surface-container-highest">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container-high/50 text-outline font-label-sm text-[11px] uppercase tracking-wider border-b border-surface-container-highest">
                                    <th className="py-3 px-4 font-semibold">NISN</th>
                                    <th className="py-3 px-4 font-semibold">Identitas Peserta</th>
                                    <th className="py-3 px-4 font-semibold">Institusi / Kelas</th>
                                    <th className="py-3 px-4 text-center font-semibold">Status Auth</th>
                                    <th className="py-3 px-4 text-right font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container-high font-body-sm text-[13px] text-on-surface">
                                {students && students.data.map(student => (
                                    <tr key={student.id} className="hover:bg-surface-container-high/40 transition-colors">
                                        <td className="py-3.5 px-4 font-mono text-primary font-semibold">
                                            {student.nisn}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <div className="font-semibold text-on-surface">{student.user?.name}</div>
                                            <div className="text-[11px] text-outline mt-0.5">Role: SISWA</div>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <div className="text-on-surface font-medium">{student.school?.name}</div>
                                            <div className="text-[11px] text-tertiary mt-0.5 font-bold">{student.class_room?.name || 'Belum Masuk Kelas'}</div>
                                        </td>
                                        <td className="py-3.5 px-4 text-center">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-container/20 border border-tertiary/30 text-tertiary font-label-sm text-[11px] font-bold uppercase tracking-wide">
                                                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Aktif
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-right flex justify-end gap-1">
                                            <button onClick={() => openEditModal(student)} className="p-1.5 rounded-lg hover:bg-surface-container-high text-outline hover:text-primary transition-colors" title="Edit Siswa">
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </button>
                                            <button className="p-1.5 rounded-lg hover:bg-surface-container-high text-outline hover:text-error transition-colors" title="Hapus Akun">
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
                    <div className="relative bg-surface-container-low border border-surface-container-highest rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-surface-container-highest flex items-center justify-between">
                            <h2 className="font-headline-md text-on-surface font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">{editingStudent ? 'edit' : 'person_add'}</span> 
                                {editingStudent ? 'Edit Siswa' : 'Tambah Siswa Baru'}
                            </h2>
                            <button onClick={() => setShowAddModal(false)} className="text-outline hover:text-on-surface transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={submit} className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-label-md text-on-surface-variant mb-1">Nama Lengkap Siswa</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} required className="w-full bg-surface-container border border-surface-container-highest rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" />
                            </div>
                            <div>
                                <label className="block text-sm font-label-md text-on-surface-variant mb-1">NISN</label>
                                <input type="text" value={data.nisn} onChange={e => setData('nisn', e.target.value)} required className="w-full bg-surface-container border border-surface-container-highest rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary font-mono" />
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-sm font-label-md text-on-surface-variant mb-1">Sekolah</label>
                                    <select value={data.school_id} onChange={e => setData('school_id', e.target.value)} required className="w-full appearance-none bg-surface-container border border-surface-container-highest rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
                                        <option value="" disabled>Pilih Sekolah</option>
                                        {schools && schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-sm font-label-md text-on-surface-variant mb-1">Kelas</label>
                                    <select value={data.class_room_id} onChange={e => setData('class_room_id', e.target.value)} required className="w-full appearance-none bg-surface-container border border-surface-container-highest rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
                                        <option value="" disabled>Pilih Kelas</option>
                                        {classRooms && classRooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-label-md text-on-surface-variant mb-1">Password {editingStudent && <span className="text-outline text-[11px]">(Kosongkan jika tidak diubah)</span>}</label>
                                <input type="text" value={data.password} onChange={e => setData('password', e.target.value)} required={!editingStudent} className="w-full bg-surface-container border border-surface-container-highest rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary font-mono tracking-widest" />
                            </div>
                            
                            <div className="mt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2.5 rounded-xl font-label-md font-semibold text-on-surface-variant hover:bg-surface-container transition-colors">
                                    Batal
                                </button>
                                <button type="submit" disabled={processing} className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-fixed text-on-primary font-label-md font-bold transition-colors disabled:opacity-50">
                                    {processing ? 'Menyimpan...' : 'Simpan Data'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
