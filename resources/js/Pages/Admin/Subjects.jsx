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

export default function Subjects({ subjects, schools }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        code: '',
        school_id: schools && schools.length > 0 ? schools[0].id : '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.subjects.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    const deleteSubject = (id) => {
        Swal.fire({
            title: 'Hapus Mata Pelajaran?',
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
                router.delete(route('admin.subjects.destroy', id));
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Mata Pelajaran | ApexCBT" />

            <div className="flex flex-col w-full pb-16 pt-6">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="font-headline-xl text-[32px] font-bold text-on-surface tracking-tight leading-tight">Mata Pelajaran</h1>
                        <p className="font-body-sm text-[14px] text-on-surface-variant max-w-3xl leading-relaxed mt-1">
                            Kelola data mata pelajaran yang diajarkan dan akan diujikan.
                        </p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-fixed text-on-primary text-[14px] font-bold transition-all shadow-[0_0_20px_rgba(76,215,246,0.25)] active:scale-[0.98]">
                        <span className="material-symbols-outlined text-[20px]">library_add</span>
                        <span>+ Tambah Mata Pelajaran</span>
                    </button>
                </div>

                <div className="bg-surface-container-low border border-surface-container-high rounded-2xl p-6 shadow-xl flex flex-col gap-5">
                    <div className="overflow-x-auto rounded-xl bg-surface-container border border-surface-container-highest">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container-high/50 text-outline font-label-sm text-[11px] uppercase tracking-wider border-b border-surface-container-highest">
                                    <th className="py-3 px-4 font-semibold">Kode Mapel</th>
                                    <th className="py-3 px-4 font-semibold">Nama Mata Pelajaran</th>
                                    <th className="py-3 px-4 font-semibold">Sekolah</th>
                                    <th className="py-3 px-4 text-right font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container-high font-body-sm text-[13px] text-on-surface">
                                {subjects && subjects.length > 0 ? (
                                    subjects.map((subject) => (
                                        <tr key={subject.id} className="hover:bg-surface-container-high/40 transition-colors">
                                            <td className="py-3.5 px-4 font-bold text-secondary">{subject.code}</td>
                                            <td className="py-3.5 px-4 font-semibold text-primary">{subject.name}</td>
                                            <td className="py-3.5 px-4 text-on-surface-variant">{subject.school?.name}</td>
                                            <td className="py-3.5 px-4 text-right">
                                                <button onClick={() => deleteSubject(subject.id)} className="p-1.5 rounded-lg hover:bg-surface-container-high text-outline hover:text-error transition-colors" title="Hapus">
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-8 text-center text-on-surface-variant font-label-md">
                                            Belum ada data mata pelajaran.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={submit} className="p-6 bg-surface">
                    <h2 className="text-lg font-medium text-on-surface">Tambah Mata Pelajaran Baru</h2>
                    <div className="mt-6">
                        <InputLabel htmlFor="code" value="Kode Mata Pelajaran (Contoh: MAT, FIS, BIND)" />
                        <TextInput
                            id="code"
                            name="code"
                            value={data.code}
                            className="mt-1 block w-full bg-surface-container border-surface-container-high text-on-surface"
                            isFocused={true}
                            onChange={(e) => setData('code', e.target.value.toUpperCase())}
                            required
                        />
                        <InputError message={errors.code} className="mt-2" />
                    </div>
                    <div className="mt-6">
                        <InputLabel htmlFor="name" value="Nama Mata Pelajaran" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full bg-surface-container border-surface-container-high text-on-surface"
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div className="mt-6">
                        <InputLabel htmlFor="school_id" value="Sekolah" />
                        <select
                            id="school_id"
                            name="school_id"
                            value={data.school_id}
                            className="mt-1 block w-full bg-surface-container border-surface-container-highest text-on-surface rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            onChange={(e) => setData('school_id', e.target.value)}
                            required
                        >
                            {schools && schools.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.school_id} className="mt-2" />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => setIsModalOpen(false)}>Batal</SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={processing}>Simpan</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
