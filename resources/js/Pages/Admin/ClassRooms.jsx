import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import Swal from 'sweetalert2';

export default function ClassRooms({ classRooms, schools }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        level: 'X',
        school_id: schools && schools.length > 0 ? schools[0].id : '',
    });

    const openAddModal = () => {
        reset();
        setEditingClass(null);
        setIsModalOpen(true);
    };

    const openEditModal = (cr) => {
        setEditingClass(cr);
        setData({
            name: cr.name,
            level: cr.level || 'X',
            school_id: cr.school_id,
        });
        setIsModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingClass) {
            put(route('admin.class-rooms.update', editingClass.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        } else {
            post(route('admin.class-rooms.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        }
    };

    const deleteClass = (id) => {
        Swal.fire({
            title: 'Hapus Kelas?',
            text: "Data kelas ini akan dihapus permanen!",
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
                router.delete(route('admin.class-rooms.destroy', id));
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Kelas | ApexCBT" />

            <div className="flex flex-col w-full pb-16 pt-6">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="font-headline-xl text-[32px] font-bold text-on-surface tracking-tight leading-tight">Manajemen Kelas</h1>
                        <p className="font-body-sm text-[14px] text-on-surface-variant max-w-3xl leading-relaxed mt-1">
                            Kelola data kelas untuk pengelompokan siswa dan distribusi ujian secara terstruktur.
                        </p>
                    </div>
                    <button onClick={openAddModal} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-fixed text-on-primary text-[14px] font-bold transition-all shadow-[0_0_20px_rgba(76,215,246,0.25)] active:scale-[0.98]">
                        <span className="material-symbols-outlined text-[20px]">add_circle</span>
                        <span>Tambah Kelas Baru</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {classRooms && classRooms.length > 0 ? (
                        classRooms.map((cr) => (
                            <div key={cr.id} className="bg-surface-container-low border border-surface-container-high rounded-2xl p-6 shadow-xl flex flex-col gap-3 relative group">
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                    <button onClick={() => openEditModal(cr)} className="p-2 rounded-lg bg-surface-container text-on-surface hover:bg-primary hover:text-on-primary transition-colors">
                                        <span className="material-symbols-outlined text-[16px]">edit</span>
                                    </button>
                                    <button onClick={() => deleteClass(cr.id)} className="p-2 rounded-lg bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-colors">
                                        <span className="material-symbols-outlined text-[16px]">delete</span>
                                    </button>
                                </div>
                                
                                <div className="w-12 h-12 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center font-bold text-title-lg shadow-inner">
                                    {cr.level}
                                </div>
                                
                                <div className="mt-2">
                                    <h3 className="font-bold text-on-surface text-headline-sm">{cr.name}</h3>
                                    <p className="text-on-surface-variant font-label-sm text-[12px]">{cr.school?.name}</p>
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-surface-container-high flex items-center justify-between">
                                    <span className="text-on-surface-variant text-[12px]">Total Siswa</span>
                                    <span className="font-bold text-primary">0 Siswa</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full bg-surface-container-low border border-surface-container-high rounded-2xl p-12 shadow-sm flex flex-col items-center justify-center gap-3 text-center">
                            <span className="material-symbols-outlined text-[48px] text-on-surface-variant/50">school</span>
                            <h3 className="font-title-md text-on-surface font-bold">Belum Ada Kelas</h3>
                            <p className="font-body-sm text-on-surface-variant max-w-sm">Silakan tambah kelas baru untuk memulai pengelompokan siswa.</p>
                        </div>
                    )}
                </div>
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={submit} className="p-6 bg-surface">
                    <h2 className="text-lg font-medium text-on-surface mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">{editingClass ? 'edit' : 'add_circle'}</span>
                        {editingClass ? 'Edit Kelas' : 'Tambah Kelas Baru'}
                    </h2>
                    
                    <div className="mb-6">
                        <InputLabel htmlFor="school_id" value="Instansi Sekolah" />
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

                    <div className="mb-6 flex gap-4">
                        <div className="w-1/3">
                            <InputLabel htmlFor="level" value="Tingkat (Level)" />
                            <select
                                id="level"
                                name="level"
                                value={data.level}
                                className="mt-1 block w-full bg-surface-container border-surface-container-highest text-on-surface rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                onChange={(e) => setData('level', e.target.value)}
                                required
                            >
                                <option value="X">Kelas X</option>
                                <option value="XI">Kelas XI</option>
                                <option value="XII">Kelas XII</option>
                                <option value="VII">Kelas VII</option>
                                <option value="VIII">Kelas VIII</option>
                                <option value="IX">Kelas IX</option>
                            </select>
                            <InputError message={errors.level} className="mt-2" />
                        </div>
                        <div className="w-2/3">
                            <InputLabel htmlFor="name" value="Nama Kelas (Misal: X IPA 1)" />
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
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => setIsModalOpen(false)}>Batal</SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={processing}>{editingClass ? 'Simpan Perubahan' : 'Simpan Kelas'}</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
