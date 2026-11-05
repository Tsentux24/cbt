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

export default function Users({ users, roles }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        username: '',
        password: '',
        role: roles && roles.length > 0 ? roles[0].name : '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    const deleteUser = (id) => {
        Swal.fire({
            title: 'Hapus Pengguna?',
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
                router.delete(route('admin.users.destroy', id));
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Pengguna | ApexCBT" />

            <div className="flex flex-col w-full pb-16 pt-6">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="font-headline-xl text-[32px] font-bold text-on-surface tracking-tight leading-tight">Manajemen Pengguna</h1>
                        <p className="font-body-sm text-[14px] text-on-surface-variant max-w-3xl leading-relaxed mt-1">
                            Kelola data Guru, Pengawas, dan Superadmin di dalam sistem CBT.
                        </p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-fixed text-on-primary text-[14px] font-bold transition-all shadow-[0_0_20px_rgba(76,215,246,0.25)] active:scale-[0.98]">
                        <span className="material-symbols-outlined text-[20px]">person_add</span>
                        <span>+ Tambah Pengguna</span>
                    </button>
                </div>

                <div className="bg-surface-container-low border border-surface-container-high rounded-2xl p-6 shadow-xl flex flex-col gap-5">
                    <div className="overflow-x-auto rounded-xl bg-surface-container border border-surface-container-highest">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container-high/50 text-outline font-label-sm text-[11px] uppercase tracking-wider border-b border-surface-container-highest">
                                    <th className="py-3 px-4 font-semibold">Nama Lengkap</th>
                                    <th className="py-3 px-4 font-semibold">Username/NIP</th>
                                    <th className="py-3 px-4 text-center font-semibold">Peran (Role)</th>
                                    <th className="py-3 px-4 text-right font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container-high font-body-sm text-[13px] text-on-surface">
                                {users && users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-surface-container-high/40 transition-colors">
                                            <td className="py-3.5 px-4 font-semibold text-primary">{user.name}</td>
                                            <td className="py-3.5 px-4 text-on-surface-variant">{user.username}</td>
                                            <td className="py-3.5 px-4 text-center">
                                                {user.roles && user.roles.map(r => (
                                                    <span key={r.id} className="px-2 py-0.5 rounded bg-surface-container border border-surface-container-highest text-primary font-bold text-[11px] uppercase tracking-wide">
                                                        {r.name}
                                                    </span>
                                                ))}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <button onClick={() => deleteUser(user.id)} className="p-1.5 rounded-lg hover:bg-surface-container-high text-outline hover:text-error transition-colors" title="Hapus">
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-8 text-center text-on-surface-variant font-label-md">
                                            Belum ada data pengguna.
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
                    <h2 className="text-lg font-medium text-on-surface">Tambah Pengguna Baru</h2>
                    <div className="mt-6">
                        <InputLabel htmlFor="name" value="Nama Lengkap" />
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
                        <InputLabel htmlFor="username" value="Username / NIP" />
                        <TextInput
                            id="username"
                            name="username"
                            value={data.username}
                            className="mt-1 block w-full bg-surface-container border-surface-container-high text-on-surface"
                            onChange={(e) => setData('username', e.target.value)}
                            required
                        />
                        <InputError message={errors.username} className="mt-2" />
                    </div>
                    <div className="mt-6">
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            name="password"
                            type="password"
                            value={data.password}
                            className="mt-1 block w-full bg-surface-container border-surface-container-high text-on-surface"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>
                    <div className="mt-6">
                        <InputLabel htmlFor="role" value="Peran (Role)" />
                        <select
                            id="role"
                            name="role"
                            value={data.role}
                            className="mt-1 block w-full bg-surface-container border-surface-container-highest text-on-surface rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            onChange={(e) => setData('role', e.target.value)}
                            required
                        >
                            {roles && roles.map(r => (
                                <option key={r.id} value={r.name}>{r.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.role} className="mt-2" />
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
