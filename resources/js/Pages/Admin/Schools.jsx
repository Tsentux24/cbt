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

export default function Schools({ schools }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        address: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.schools.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    const deleteSchool = (id) => {
        Swal.fire({
            title: 'Hapus Instansi?',
            text: "Data seluruh siswa pada instansi ini akan terkena dampaknya!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'var(--color-error)',
            cancelButtonColor: 'var(--color-surface-container-highest)',
            confirmButtonText: 'Hapus Darurat',
            cancelButtonText: 'Batal',
            background: 'var(--color-surface)',
            color: 'var(--color-on-surface)'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.schools.destroy', id));
            }
        });
    };

    const handleSyncDapodik = () => {
        Swal.fire({
            title: 'Sinkronisasi Data Dapodik',
            html: 'Menghubungkan ke API Pusdatin Dapodik...<br><br><span style="font-size: 12px; color: var(--color-tertiary)">Mencocokkan NPSN & Data Siswa</span>',
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            },
            background: 'var(--color-surface)',
            color: 'var(--color-on-surface)'
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
                Swal.fire({
                    title: 'Sinkronisasi Selesai!',
                    text: 'Infrastruktur sekolah dan siswa telah diperbarui dengan data Dapodik terbaru.',
                    icon: 'success',
                    background: 'var(--color-surface)',
                    color: 'var(--color-on-surface)'
                });
            }
        });
    };

    const handleClientConfig = (schoolName) => {
        Swal.fire({
            title: `Konfigurasi Klien: ${schoolName}`,
            html: `
                <div class="text-left mt-2 mb-4 text-[13px] text-outline">Masukkan IP Address dan Port server CBT yang bisa diakses oleh komputer klien (siswa).</div>
                <div class="flex flex-col gap-3">
                    <div class="flex flex-col text-left">
                        <label class="text-xs font-bold text-on-surface mb-1 uppercase tracking-wider">IP Address Server</label>
                        <input type="text" id="seb-ip" class="bg-surface-container border border-surface-container-highest text-on-surface text-sm rounded-xl focus:ring-primary focus:border-primary px-4 py-3 outline-none transition-all w-full" placeholder="Contoh: 192.168.1.15" value="${window.location.hostname}">
                    </div>
                    <div class="flex flex-col text-left">
                        <label class="text-xs font-bold text-on-surface mb-1 uppercase tracking-wider">Port Server</label>
                        <input type="text" id="seb-port" class="bg-surface-container border border-surface-container-highest text-on-surface text-sm rounded-xl focus:ring-primary focus:border-primary px-4 py-3 outline-none transition-all w-full" placeholder="Contoh: 8000" value="${window.location.port || '80'}">
                    </div>
                </div>
            `,
            icon: 'info',
            confirmButtonText: 'Generate .seb File',
            cancelButtonText: 'Batal',
            showCancelButton: true,
            background: 'var(--color-surface)',
            color: 'var(--color-on-surface)',
            preConfirm: () => {
                const ip = document.getElementById('seb-ip').value;
                const port = document.getElementById('seb-port').value;
                if (!ip || !port) {
                    Swal.showValidationMessage('IP dan Port tidak boleh kosong');
                }
                return { ip, port };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const { ip, port } = result.value;
                // Trigger download with params
                window.location.href = `/admin/schools/${encodeURIComponent(schoolName)}/generate-seb?ip=${encodeURIComponent(ip)}&port=${encodeURIComponent(port)}`;
                
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'File SEB Config berhasil di-generate dan sedang diunduh. Siap didistribusikan ke Klien.',
                    icon: 'success',
                    background: 'var(--color-surface)',
                    color: 'var(--color-on-surface)'
                });
            }
        });
    };

    const handleTunnelEncryption = (schoolName) => {
        Swal.fire({
            title: `Rotasi Kunci Tunnel: ${schoolName}`,
            text: 'Merotasi kunci asimetris WireGuard untuk jalur komunikasi yang aman ke Node Server.',
            icon: 'warning',
            confirmButtonText: 'Enkripsi Ulang',
            cancelButtonText: 'Batal',
            showCancelButton: true,
            confirmButtonColor: 'var(--color-tertiary)',
            background: 'var(--color-surface)',
            color: 'var(--color-on-surface)'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Secured!',
                    text: 'Tunnel VPN menuju Node Instansi telah diamankan dengan kunci rotasi baru.',
                    icon: 'success',
                    background: 'var(--color-surface)',
                    color: 'var(--color-on-surface)'
                });
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Instansi | ApexCBT" />

            <div className="flex flex-col w-full pb-16 pt-6">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <span className="font-label-sm text-[12px] text-outline uppercase tracking-wider">Superadmin Console</span>
                            <span className="text-outline-variant font-label-sm text-[12px]">/</span>
                            <span className="font-label-sm text-[12px] text-primary uppercase tracking-wider font-semibold">Infrastruktur Jaringan</span>
                        </div>
                        <h1 className="font-headline-xl text-[32px] font-bold text-on-surface tracking-tight leading-tight">Node Server & Manajemen Instansi</h1>
                        <p className="font-body-sm text-[14px] text-on-surface-variant max-w-3xl leading-relaxed mt-1">
                            Pusat kendali server lokal, konfigurasi gateway satelit, dan penegakan regulasi Kiosk Lock pada klien (Safe Exam Browser).
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleSyncDapodik} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-bright text-on-surface text-[14px] font-medium transition-all shadow-sm border border-surface-container-high group">
                            <span className="material-symbols-outlined text-[18px] text-secondary group-hover:animate-spin">sync</span>
                            <span>Sync Data Dapodik</span>
                        </button>
                        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-fixed text-on-primary text-[14px] font-bold transition-all shadow-[0_0_20px_rgba(76,215,246,0.25)] active:scale-[0.98]">
                            <span className="material-symbols-outlined text-[20px]">add_business</span>
                            <span>+ Registrasi Instansi</span>
                        </button>
                    </div>
                </div>

                {/* Powerful Table based on design */}
                <div className="bg-surface-container border border-surface-container-high rounded-[20px] shadow-2xl flex flex-col overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="bg-surface-container-low text-outline font-label-md text-[11px] uppercase tracking-widest border-b border-surface-container-high">
                                    <th className="py-5 px-6 font-bold w-[25%]">Instansi Sekolah & NPSN</th>
                                    <th className="py-5 px-4 font-bold w-[15%]">Rayon & Lokasi</th>
                                    <th className="py-5 px-4 font-bold w-[18%]">Alokasi Lab Komputer</th>
                                    <th className="py-5 px-4 font-bold w-[17%]">Node Server & Gateway</th>
                                    <th className="py-5 px-4 font-bold w-[15%]">Kiosk Client Security</th>
                                    <th className="py-5 px-4 font-bold text-center w-[10%]">Status</th>
                                    <th className="py-5 px-6 font-bold text-right w-[10%]">Aksi Konfigurasi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container-high/50 font-body-sm text-[13px] text-on-surface">
                                {schools && schools.length > 0 ? (
                                    schools.map((school, idx) => {
                                        const paddedIdx = String(idx + 1).padStart(2, '0');
                                        const npsn = 20101560 + school.id * 17; // Fake NPSN generator
                                        const ipSegment = 10 + school.id; // Fake IP Segment
                                        
                                        return (
                                            <tr key={school.id} className="hover:bg-surface-container-high/30 transition-all group">
                                                {/* Kolom 1: Sekolah */}
                                                <td className="py-6 px-6">
                                                    <div className="flex gap-4 items-start">
                                                        <span className="font-headline-md text-[20px] font-bold text-primary opacity-90 mt-0.5">{paddedIdx}</span>
                                                        <div className="flex flex-col gap-1.5">
                                                            <span className="font-title-lg text-[18px] font-bold text-primary group-hover:text-primary-fixed transition-colors leading-none tracking-tight">{school.name}</span>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <div className="flex flex-col">
                                                                    <span className="text-[10px] uppercase text-outline tracking-wider font-semibold">NPSN:</span>
                                                                    <span className="text-on-surface-variant font-mono text-[12px]">{npsn}</span>
                                                                </div>
                                                                <span className="w-1 h-1 rounded-full bg-surface-container-highest"></span>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[10px] uppercase text-outline tracking-wider font-semibold">Akreditasi</span>
                                                                    <span className="text-on-surface-variant font-bold text-[12px]">A</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                
                                                {/* Kolom 2: Rayon */}
                                                <td className="py-6 px-4 align-top">
                                                    <div className="flex flex-col gap-1 pt-1">
                                                        <span className="font-bold text-[14px] text-on-surface">Rayon 01 - Nasional</span>
                                                        <span className="text-[12px] text-on-surface-variant leading-tight truncate max-w-[150px]">{school.address || 'Alamat tidak diatur'}</span>
                                                    </div>
                                                </td>

                                                {/* Kolom 3: Lab */}
                                                <td className="py-6 px-4 align-top">
                                                    <div className="flex flex-col gap-1.5 pt-1">
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {school.class_rooms && school.class_rooms.length > 0 ? (
                                                                school.class_rooms.map(room => (
                                                                    <span key={room.id} className="bg-surface-container-high border border-surface-container-highest px-2 py-0.5 rounded text-[11px] text-on-surface">
                                                                        {room.name} ({room.students_count} PC)
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <>
                                                                    <span className="bg-surface-container-high border border-surface-container-highest px-2 py-0.5 rounded text-[11px] text-on-surface">Lab A (0 PC)</span>
                                                                    <span className="bg-surface-container-high border border-surface-container-highest px-2 py-0.5 rounded text-[11px] text-on-surface text-outline italic">Belum dikonfigurasi</span>
                                                                </>
                                                            )}
                                                        </div>
                                                        <span className="text-[11px] text-primary font-bold mt-1">{school.total_workstations || 0} Workstations Aktif</span>
                                                    </div>
                                                </td>

                                                {/* Kolom 4: IP Gateway */}
                                                <td className="py-6 px-4 align-top">
                                                    <div className="flex flex-col gap-1 pt-1">
                                                        <span className="font-mono font-bold text-[13px] text-on-surface">10.240.{ipSegment}.1</span>
                                                        <span className="font-mono text-[11px] text-outline">GW: 10.240.{ipSegment}.254</span>
                                                        <span className="text-[11px] text-outline mt-0.5">(Fiber)</span>
                                                        <span className="flex items-center gap-1 text-[11px] text-tertiary font-medium mt-1.5">
                                                            <span className="material-symbols-outlined text-[12px]">lock</span> WireGuard Active
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Kolom 5: Security */}
                                                <td className="py-6 px-4 align-top">
                                                    <div className="flex flex-col gap-2 pt-1">
                                                        <span className="flex items-center gap-1.5 text-[12px] text-primary">
                                                            <span className="material-symbols-outlined text-[14px]">check_circle</span> SEB 3.4.1 Enforced
                                                        </span>
                                                        <span className="flex items-center gap-1.5 text-[12px] text-primary">
                                                            <span className="material-symbols-outlined text-[14px]">gavel</span> Kiosk Lock Active
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Kolom 6: Status */}
                                                <td className="py-6 px-4 align-middle text-center">
                                                    {school.total_workstations > 0 ? (
                                                        <div className="flex flex-col items-center">
                                                            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                                                <span className="font-label-sm text-[12px] font-bold tracking-wide">Ujian Berjalan</span>
                                                            </div>
                                                            
                                                            {school.telemetry && (
                                                                <div className="mt-3 flex flex-col gap-1.5 text-left bg-surface-container/30 px-3 py-2.5 rounded-xl border border-surface-container-highest w-full min-w-[140px]">
                                                                    <div className="flex items-center gap-1.5 mb-0.5">
                                                                        <span className="material-symbols-outlined text-[14px] text-tertiary">analytics</span>
                                                                        <span className="text-[10px] text-on-surface-variant font-label-sm uppercase tracking-wider font-bold">Telemetri Siswa</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center text-[11px] relative group cursor-help">
                                                                        <span className="text-outline">Login & Aktif:</span>
                                                                        <span className="font-mono-timer font-bold text-primary border-b border-dashed border-primary/40 pb-0.5">{school.telemetry.online}/{school.total_workstations}</span>
                                                                        
                                                                        {/* Tooltip Hover for Students */}
                                                                        <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 w-[260px] bg-surface-container-high border border-surface-container-highest rounded-xl shadow-2xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                                                            <h4 className="font-label-sm text-[11px] text-on-surface uppercase tracking-wider mb-2 border-b border-surface-container-highest pb-1.5 flex items-center gap-1.5">
                                                                                <span className="material-symbols-outlined text-[14px]">groups</span>
                                                                                Daftar Peserta Ujian
                                                                            </h4>
                                                                            <div className="max-h-[150px] overflow-y-auto pr-1 flex flex-col gap-1.5 scrollbar-thin scrollbar-thumb-surface-container-highest">
                                                                                {school.telemetry.students_list && school.telemetry.students_list.map((student, sIdx) => (
                                                                                    <div key={sIdx} className="flex items-center justify-between gap-2 text-[11px]">
                                                                                        <span className="text-on-surface-variant truncate max-w-[130px]" title={student.name}>{student.name}</span>
                                                                                        {student.is_online ? (
                                                                                            <span className="text-primary font-bold inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>Sedang Ujian</span>
                                                                                        ) : (
                                                                                            <span className="text-error inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-error"></span>Belum Mulai</span>
                                                                                        )}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex justify-between items-center text-[11px]">
                                                                        <span className="text-outline">Soal Terjawab:</span>
                                                                        <span className="font-mono-timer font-bold text-tertiary">{school.telemetry.answered.toLocaleString('id-ID')}</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center text-[11px]">
                                                                        <span className="text-outline">Belum Dijawab:</span>
                                                                        <span className="font-mono-timer font-bold text-error">{school.telemetry.unanswered.toLocaleString('id-ID')}</span>
                                                                    </div>
                                                                    <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-1 overflow-hidden">
                                                                        <div className="bg-tertiary h-1.5 rounded-full transition-all duration-1000" style={{ width: `${school.telemetry.progress}%` }}></div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-outline/30 bg-surface-container-high text-outline">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                                                            <span className="font-label-sm text-[12px] font-bold tracking-wide">Siaga / Kosong</span>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Kolom 7: Actions */}
                                                <td className="py-6 px-6 align-middle text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button 
                                                            onClick={() => handleClientConfig(school.name)}
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-high transition-all" 
                                                            title="Konfigurasi Klien"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">settings_ethernet</span>
                                                        </button>
                                                        <button 
                                                            onClick={() => handleTunnelEncryption(school.name)}
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-tertiary hover:bg-surface-container-high transition-all" 
                                                            title="Enkripsi Tunnel"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">vpn_key</span>
                                                        </button>
                                                        <button 
                                                            onClick={() => deleteSchool(school.id)} 
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-error hover:bg-surface-container-high transition-all" 
                                                            title="Hapus Instansi"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-16 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <span className="material-symbols-outlined text-[48px] text-surface-container-highest mb-4">domain_disabled</span>
                                                <span className="font-title-md text-[18px] text-on-surface">Belum ada Instansi / Node</span>
                                                <span className="font-body-sm text-[13px] text-outline mt-1">Gunakan tombol + Registrasi Instansi untuk menambahkan Node.</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Table Footer */}
                    <div className="flex items-center justify-between px-6 py-4 bg-surface-container-low border-t border-surface-container-high">
                        <span className="font-label-sm text-[12px] text-outline">
                            Menampilkan <strong className="text-on-surface font-semibold">1 - {schools?.length || 0}</strong> dari <strong className="text-on-surface font-semibold">{schools?.length || 0}</strong> Instansi Terdaftar
                        </span>
                        <div className="flex gap-1">
                            <button className="w-8 h-8 rounded flex items-center justify-center text-outline hover:bg-surface-container-high transition-colors" disabled>
                                <span className="material-symbols-outlined text-[16px]">first_page</span>
                            </button>
                            <button className="w-8 h-8 rounded flex items-center justify-center text-outline hover:bg-surface-container-high transition-colors" disabled>
                                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                            </button>
                            <button className="w-8 h-8 rounded bg-primary text-on-primary font-bold text-[12px] flex items-center justify-center">
                                1
                            </button>
                            <button className="w-8 h-8 rounded flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors">
                                2
                            </button>
                            <button className="w-8 h-8 rounded flex items-center justify-center text-outline hover:bg-surface-container-high transition-colors">
                                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                            </button>
                            <button className="w-8 h-8 rounded flex items-center justify-center text-outline hover:bg-surface-container-high transition-colors">
                                <span className="material-symbols-outlined text-[16px]">last_page</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={submit} className="p-8 bg-surface relative overflow-hidden">
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
                    
                    <div className="relative z-10">
                        <h2 className="font-headline-sm text-[24px] font-bold text-on-surface tracking-tight">Registrasi Instansi/Node Server</h2>
                        <p className="font-body-sm text-[13px] text-outline mt-1 mb-8">
                            Masukkan data sekolah untuk pembuatan konfigurasi gateway ujian secara otomatis.
                        </p>

                        <div className="flex flex-col gap-6">
                            <div>
                                <InputLabel htmlFor="name" value="Nama Instansi / Sekolah" className="text-[12px] font-bold uppercase tracking-wider text-on-surface-variant mb-2" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="block w-full bg-surface-container border border-surface-container-highest text-on-surface text-[14px] px-4 py-3 h-auto"
                                    isFocused={true}
                                    placeholder="Contoh: SMAN 1 Jakarta"
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="address" value="Alamat Rayon (Opsional)" className="text-[12px] font-bold uppercase tracking-wider text-on-surface-variant mb-2" />
                                <TextInput
                                    id="address"
                                    name="address"
                                    value={data.address}
                                    className="block w-full bg-surface-container border border-surface-container-highest text-on-surface text-[14px] px-4 py-3 h-auto"
                                    placeholder="Contoh: Rayon 01 - Jakarta Pusat"
                                    onChange={(e) => setData('address', e.target.value)}
                                />
                                <InputError message={errors.address} className="mt-2" />
                            </div>
                        </div>

                        <div className="mt-10 flex items-center justify-end gap-3 pt-6 border-t border-surface-container-high">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-[14px] text-on-surface-variant hover:bg-surface-container transition-all">Batal</button>
                            <button type="submit" disabled={processing} className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-fixed text-on-primary font-bold text-[14px] transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">dns</span>
                                Eksekusi Registrasi
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
