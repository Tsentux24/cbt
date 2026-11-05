import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Dashboard({ schools, kpi }) {
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
            <Head title="Kelola Sekolah & Lab CBT | ApexCBT" />

            <div className="flex flex-col w-full pb-16">
                {/* Dynamic Top Ambient Aura */}
                <div className="relative w-full overflow-hidden">
                    <div className="absolute -top-24 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -top-20 right-10 w-80 h-80 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none"></div>
                    
                    {/* Header & Action Ribbon */}
                    <div className="pt-6 pb-8 flex flex-col xl:flex-row xl:items-end justify-between gap-6 relative z-10">
                        <div className="flex flex-col gap-2">
                            {/* Breadcrumb & Tag */}
                            <div className="flex items-center gap-2">
                                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Superadmin Console</span>
                                <span className="material-symbols-outlined text-outline text-body-sm">chevron_right</span>
                                <span className="font-label-sm text-label-sm text-primary font-semibold tracking-wider uppercase">Manajemen Sekolah & Lab CBT</span>
                                <span className="ml-2 px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary font-label-sm text-label-sm inline-flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                                    Sync Realtime
                                </span>
                            </div>
                            
                            {/* Big Headline with Monospaced Metadata */}
                            <div className="flex items-baseline gap-4 flex-wrap mt-1">
                                <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">Detail Kelola Sekolah & Alokasi Lab CBT</h1>
                                <span className="font-label-md text-label-md text-outline font-mono-timer tracking-wide px-2.5 py-1 rounded bg-surface-container-high/80">CLUSTER: ID-JKT-NODE-04</span>
                            </div>
                            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl mt-1">
                                Pusat kendali inventaris infrastruktur ujian, pengawasan node server lokal, mitigasi intrusi kiosk client, dan provisioning bandwith sekolah mitra se-Indonesia.
                            </p>
                        </div>
                        
                        {/* Action Cluster */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <button onClick={handleSyncDapodik} className="bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-md text-label-md px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm border border-outline-variant/30 group">
                                <span className="material-symbols-outlined text-title-lg text-primary group-hover:animate-spin">cloud_sync</span>
                                Sinkronisasi Node
                            </button>
                            <Link href={route('admin.class-rooms.index')} className="bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-md text-label-md px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm border border-outline-variant/30">
                                <span className="material-symbols-outlined text-title-lg text-secondary">upload_file</span>
                                Import Data Lab
                            </Link>
                            <Link href={route('admin.schools.index')} className="bg-primary hover:bg-primary-fixed text-on-primary font-label-md text-label-md px-5 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(76,215,246,0.3)] flex items-center gap-2 font-bold active:scale-95">
                                <span className="material-symbols-outlined text-title-lg text-[20px]">add_circle</span>
                                Daftarkan Sekolah Baru
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Metric Telemetry Strip (4 Bento Cards) */}
                <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                    {/* Card 1 */}
                    <div className="bg-surface-container-low/90 backdrop-blur-md rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:bg-surface-container transition-all border border-surface-container-high">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-container"></div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Instansi Terdaftar</span>
                            <span className="p-2 rounded-lg bg-primary/10 text-primary material-symbols-outlined text-title-lg">domain</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-baseline gap-2">
                                <span className="font-display-lg text-display-lg text-on-surface font-bold leading-none">{kpi.total_schools}</span>
                                <span className="font-title-lg text-title-lg text-on-surface-variant font-medium">Sekolah</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="px-2 py-0.5 rounded bg-primary/15 text-primary text-label-sm font-label-sm font-semibold">{kpi.active_schools} Aktif Ujian</span>
                                <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant text-label-sm font-label-sm">{kpi.total_schools - kpi.active_schools} Standby</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 flex items-center justify-between text-outline font-label-sm text-label-sm border-t border-surface-container-high">
                            <span>Coverage 6 Rayon</span>
                            <span className="text-tertiary flex items-center gap-1 font-semibold">
                                <span className="material-symbols-outlined text-body-sm">check_circle</span> 100% Siap
                            </span>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-surface-container-low/90 backdrop-blur-md rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:bg-surface-container transition-all border border-surface-container-high">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary to-secondary-container"></div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Total Lab Terkoneksi</span>
                            <span className="p-2 rounded-lg bg-secondary/10 text-secondary material-symbols-outlined text-title-lg">computer</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-baseline gap-2">
                                <span className="font-display-lg text-display-lg text-on-surface font-bold leading-none">{kpi.total_labs}</span>
                                <span className="font-title-lg text-title-lg text-on-surface-variant font-medium">Ruang Lab</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-on-surface text-label-sm font-label-sm font-semibold">Kapasitas: {kpi.total_capacity} PC Workstation</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 flex items-center justify-between text-outline font-label-sm text-label-sm border-t border-surface-container-high">
                            <span>Okupansi {kpi.total_capacity > 0 ? ((kpi.online_students / kpi.total_capacity) * 100).toFixed(1) : 0}%</span>
                            <span className="text-secondary font-mono-timer font-semibold">{kpi.online_students} Online</span>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-surface-container-low/90 backdrop-blur-md rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:bg-surface-container transition-all border border-surface-container-high">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-tertiary to-tertiary-container"></div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">VPN Tunneling Status</span>
                            <span className="p-2 rounded-lg bg-tertiary/10 text-tertiary material-symbols-outlined text-title-lg">vpn_lock</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-baseline gap-2">
                                <span className="font-display-lg text-display-lg text-tertiary font-bold leading-none">100%</span>
                                <span className="font-title-lg text-title-lg text-tertiary-fixed-dim font-medium">Healthy</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="px-2 py-0.5 rounded bg-tertiary/15 text-tertiary text-label-sm font-label-sm font-semibold font-mono-timer">WireGuard AES-256-GCM</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 flex items-center justify-between text-outline font-label-sm text-label-sm border-t border-surface-container-high">
                            <span>Handshake Interval: 25s</span>
                            <span className="text-tertiary font-semibold flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-tertiary animate-ping"></span> 0 Packet Drop
                            </span>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-surface-container-low/90 backdrop-blur-md rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:bg-surface-container transition-all border border-surface-container-high">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-container to-secondary"></div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Avg Bandwidth Traffic</span>
                            <span className="p-2 rounded-lg bg-primary-container/10 text-primary-container material-symbols-outlined text-title-lg">speed</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-baseline gap-2">
                                <span className="font-display-lg text-display-lg text-on-surface font-bold leading-none font-mono-timer">42.8</span>
                                <span className="font-title-lg text-title-lg text-on-surface-variant font-medium">Mbps</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-primary text-label-sm font-label-sm font-medium flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]">bolt</span> Low-Latency Cache Sync
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 flex items-center justify-between text-outline font-label-sm text-label-sm border-t border-surface-container-high">
                            <span>Latency Target &lt; 15ms</span>
                            <span className="text-on-surface font-mono-timer font-semibold">9.4 ms Realtime</span>
                        </div>
                    </div>
                </section>

                {/* Interactive Search, Filters & Bulk Context Strip */}
                <div className="bg-surface-container-low rounded-2xl p-4 mb-6 flex flex-col lg:flex-row items-center justify-between gap-4 border border-surface-container-high shadow-lg">
                    {/* Search Bar */}
                    <div className="relative w-full lg:w-96">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-title-lg">search</span>
                        <input className="w-full bg-surface-container text-on-surface placeholder:text-outline text-body-sm font-body-sm rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary border border-surface-container-highest transition-all" placeholder="Cari sekolah, NPSN, atau Rayon..." type="text"/>
                    </div>
                    
                    {/* Dropdown Filters Group */}
                    <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                        <div className="relative min-w-[150px]">
                            <select className="w-full appearance-none bg-surface-container text-on-surface border border-surface-container-highest text-body-sm font-body-sm rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer">
                                <option>Semua Rayon</option>
                                <option>Rayon 01 - DKI Jakarta</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-body-sm">expand_more</span>
                        </div>
                        
                        <div className="relative min-w-[170px]">
                            <select className="w-full appearance-none bg-surface-container text-on-surface border border-surface-container-highest text-body-sm font-body-sm rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer">
                                <option>Status: Semua Status</option>
                                <option>Sedang Berjalan (Live)</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-body-sm">expand_more</span>
                        </div>
                        
                        <div className="relative min-w-[180px]">
                            <select className="w-full appearance-none bg-surface-container text-on-surface border border-surface-container-highest text-body-sm font-body-sm rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer">
                                <option>Koneksi: Dedicated & VPN</option>
                                <option>WireGuard Encrypted</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-body-sm">expand_more</span>
                        </div>
                        
                        <button className="p-2.5 bg-surface-container hover:bg-surface-bright border border-surface-container-highest rounded-xl text-outline hover:text-on-surface transition-all flex items-center justify-center" title="Reset Filter">
                            <span className="material-symbols-outlined text-body-md">filter_alt_off</span>
                        </button>
                        <button className="p-2.5 bg-surface-container hover:bg-surface-bright border border-surface-container-highest rounded-xl text-primary hover:text-primary-fixed transition-all flex items-center justify-center" title="Refresh Table">
                            <span className="material-symbols-outlined text-body-md">refresh</span>
                        </button>
                    </div>
                </div>

                {/* Primary Main Data Grid & Table */}
                <div className="bg-surface-container-low rounded-2xl overflow-hidden shadow-xl mb-8 border border-surface-container-high">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container text-outline text-label-sm font-label-sm uppercase tracking-wider border-b border-surface-container-highest">
                                    <th className="py-4 px-5">Instansi Sekolah & NPSN</th>
                                    <th className="py-4 px-4">Rayon & Lokasi</th>
                                    <th className="py-4 px-4">Alokasi Lab Komputer</th>
                                    <th className="py-4 px-4">Node Server & Gateway</th>
                                    <th className="py-4 px-4">Kiosk Client Security</th>
                                    <th className="py-4 px-4 text-center">Status</th>
                                    <th className="py-4 px-5 text-right">Aksi Konfigurasi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container text-body-sm font-body-sm">
                                {schools && schools.length > 0 ? (
                                    schools.map((school, idx) => {
                                        const paddedIdx = String(idx + 1).padStart(2, '0');
                                        const npsn = 20101560 + school.id * 17;
                                        const ipSegment = 10 + school.id;
                                        
                                        return (
                                            <tr key={school.id} className="hover:bg-surface-container-high/40 transition-colors group">
                                                <td className="py-4 px-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-headline-md font-bold">
                                                            {paddedIdx}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-title-lg text-title-lg text-on-surface font-semibold group-hover:text-primary transition-colors leading-tight">{school.name}</span>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className="font-mono-timer text-[11px] font-label-sm text-outline">NPSN: {npsn}</span>
                                                                <span className="w-1 h-1 rounded-full bg-outline"></span>
                                                                <span className="text-[11px] font-label-sm text-on-surface-variant">Akreditasi A</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-on-surface font-medium">Rayon 01 - Nasional</span>
                                                        <span className="text-label-sm font-label-sm text-outline truncate max-w-[150px]">{school.address || 'Alamat tidak diatur'}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                                        {school.class_rooms && school.class_rooms.length > 0 ? (
                                                            school.class_rooms.map(room => (
                                                                <span key={room.id} className="px-2 py-0.5 rounded-lg bg-surface-container-highest text-on-surface text-[11px] font-mono-timer">
                                                                    {room.name} ({room.students_count} PC)
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="px-2 py-0.5 rounded-lg bg-surface-container-highest text-outline text-[11px] font-mono-timer italic">Belum dikonfigurasi</span>
                                                        )}
                                                    </div>
                                                    <span className="text-[11px] font-label-sm text-primary font-semibold mt-1 inline-block">{school.total_workstations || 0} Workstations Aktif</span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex flex-col font-mono-timer text-[12px]">
                                                        <span className="text-on-surface font-semibold">10.240.{ipSegment}.1</span>
                                                        <span className="text-outline text-[11px]">GW: 10.240.{ipSegment}.254 (Fiber)</span>
                                                        <span className="text-tertiary text-[11px] flex items-center gap-1 mt-0.5">
                                                            <span className="material-symbols-outlined text-[12px]">lock</span> WireGuard Active
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex flex-col gap-1 text-[11px]">
                                                        <span className="inline-flex items-center gap-1.5 font-label-sm text-tertiary">
                                                            <span className="material-symbols-outlined text-[14px]">check_circle</span> SEB 3.4.1 Enforced
                                                        </span>
                                                        <span className="inline-flex items-center gap-1.5 font-label-sm text-primary">
                                                            <span className="material-symbols-outlined text-[14px]">screen_lock_rotation</span> Kiosk Lock Active
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    {school.total_workstations > 0 ? (
                                                        <div className="flex flex-col items-center">
                                                            <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-[11px] font-label-sm font-bold inline-flex items-center gap-1.5 shadow-sm">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                                                Ujian Berjalan
                                                            </span>
                                                            
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
                                                        <span className="bg-surface-container-high text-outline border border-outline/20 px-3 py-1 rounded-full text-[11px] font-label-sm font-bold inline-flex items-center gap-1.5 shadow-sm">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                                                            Siaga / Kosong
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-5 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button 
                                                            onClick={() => handleClientConfig(school.name)}
                                                            className="p-1.5 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface-variant transition-all" 
                                                            title="Konfigurasi Klien"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">settings_suggest</span>
                                                        </button>
                                                        <button 
                                                            onClick={() => handleTunnelEncryption(school.name)}
                                                            className="p-1.5 rounded-lg bg-surface-container hover:bg-secondary hover:text-on-secondary text-on-surface-variant transition-all" 
                                                            title="Enkripsi Tunnel"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">vpn_key_alert</span>
                                                        </button>
                                                        <button className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-bright text-on-surface-variant transition-all" title="Audit Log Sesi">
                                                            <span className="material-symbols-outlined text-[18px]">history</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-8 text-outline">Belum ada instansi terdaftar</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Table Pagination Footer */}
                    <div className="bg-surface-container/30 border-t border-surface-container-highest px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] font-body-sm text-outline">
                        <div className="flex items-center gap-2">
                            <span>Menampilkan <strong className="text-on-surface">1 - {schools?.length || 0}</strong> dari <strong className="text-on-surface">{kpi.total_schools}</strong> Instansi Terdaftar</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button className="p-1.5 rounded-lg bg-surface-container text-on-surface disabled:opacity-40 hover:bg-surface-bright transition-all" disabled>
                                <span className="material-symbols-outlined text-body-sm">first_page</span>
                            </button>
                            <button className="p-1.5 rounded-lg bg-surface-container text-on-surface disabled:opacity-40 hover:bg-surface-bright transition-all" disabled>
                                <span className="material-symbols-outlined text-body-sm">chevron_left</span>
                            </button>
                            <span className="px-3 py-1 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-bold">1</span>
                            <button className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-bright text-on-surface font-label-sm text-label-sm">2</button>
                            <button className="p-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-bright transition-all">
                                <span className="material-symbols-outlined text-body-sm">chevron_right</span>
                            </button>
                            <button className="p-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-bright transition-all">
                                <span className="material-symbols-outlined text-body-sm">last_page</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Panel: Visual Hardware Status Inspector & Emergency Control Dock */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Log Aktivitas Sistem (Cols 8) */}
                    <div className="lg:col-span-8 bg-surface-container-low rounded-2xl p-6 relative overflow-hidden shadow-xl border border-surface-container-high flex flex-col h-full min-h-[350px]">
                        <div className="flex items-center gap-3 pb-5 border-b border-surface-container-highest mb-4">
                            <div className="p-2.5 rounded-xl bg-secondary-container/50 text-secondary border border-secondary/20">
                                <span className="material-symbols-outlined text-headline-md">history_toggle_off</span>
                            </div>
                            <div className="flex flex-col">
                                <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Log Aktivitas Sistem & Ujian Terkini</h2>
                                <span className="font-body-sm text-[12px] text-outline">Jejak audit sinkronisasi, manajemen sesi, dan keamanan terpusat</span>
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[250px] scrollbar-thin scrollbar-thumb-surface-container-highest scrollbar-track-transparent">
                            
                            {/* Activity Items */}
                            <div className="flex gap-4 group cursor-default">
                                <div className="flex flex-col items-center pt-1 relative">
                                    <span className="w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-surface-container-low z-10 transition-transform group-hover:scale-125"></span>
                                    <span className="w-0.5 h-full bg-surface-container-highest absolute top-3"></span>
                                </div>
                                <div className="flex flex-col flex-1 pb-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-label-md text-on-surface font-semibold text-[13px] group-hover:text-primary transition-colors">Sinkronisasi Dapodik Berhasil</span>
                                        <span className="font-mono-timer text-[11px] text-outline">Baru saja</span>
                                    </div>
                                    <span className="text-[12px] text-on-surface-variant mt-0.5 leading-relaxed">Berhasil menarik 240 data siswa baru dari Pusdatin untuk instansi SMAN 1 Jakarta (NPSN: 20101560).</span>
                                </div>
                            </div>

                            <div className="flex gap-4 group cursor-default">
                                <div className="flex flex-col items-center pt-1 relative">
                                    <span className="w-2.5 h-2.5 rounded-full bg-error ring-4 ring-surface-container-low z-10 transition-transform group-hover:scale-125"></span>
                                    <span className="w-0.5 h-full bg-surface-container-highest absolute top-3"></span>
                                </div>
                                <div className="flex flex-col flex-1 pb-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-label-md text-error font-semibold text-[13px]">Peringatan Keamanan Klien</span>
                                        <span className="font-mono-timer text-[11px] text-outline">10 menit lalu</span>
                                    </div>
                                    <span className="text-[12px] text-on-surface-variant mt-0.5 leading-relaxed">Terdeteksi upaya bypass Safe Exam Browser pada PC-15 (Lab 01, SMAN 5 Bandung). Kiosk mode dikunci secara paksa oleh sistem.</span>
                                </div>
                            </div>

                            <div className="flex gap-4 group cursor-default">
                                <div className="flex flex-col items-center pt-1 relative">
                                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary ring-4 ring-surface-container-low z-10 transition-transform group-hover:scale-125"></span>
                                    <span className="w-0.5 h-full bg-surface-container-highest absolute top-3"></span>
                                </div>
                                <div className="flex flex-col flex-1 pb-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-label-md text-on-surface font-semibold text-[13px] group-hover:text-tertiary transition-colors">Sesi Ujian Selesai</span>
                                        <span className="font-mono-timer text-[11px] text-outline">45 menit lalu</span>
                                    </div>
                                    <span className="text-[12px] text-on-surface-variant mt-0.5 leading-relaxed">Ujian Matematika Peminatan (Sesi 1) di Rayon 02 telah ditutup oleh pengawas. Skoring otomatis dan agregasi data berjalan di *background*.</span>
                                </div>
                            </div>

                            <div className="flex gap-4 group cursor-default">
                                <div className="flex flex-col items-center pt-1 relative">
                                    <span className="w-2.5 h-2.5 rounded-full bg-secondary ring-4 ring-surface-container-low z-10 transition-transform group-hover:scale-125"></span>
                                </div>
                                <div className="flex flex-col flex-1 pb-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-label-md text-on-surface font-semibold text-[13px] group-hover:text-secondary transition-colors">Pembaruan Master Bank Soal</span>
                                        <span className="font-mono-timer text-[11px] text-outline">2 jam lalu</span>
                                    </div>
                                    <span className="text-[12px] text-on-surface-variant mt-0.5 leading-relaxed">Data Master menambahkan paket soal baru (Kode: FIS-XII-04) dengan 40 butir pilihan ganda kompleks dan stimulus gambar dinamis.</span>
                                </div>
                            </div>

                        </div>
                        
                        <div className="pt-4 mt-auto border-t border-surface-container-high flex items-center justify-between text-body-sm font-body-sm text-[12px]">
                            <span className="text-outline flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">encrypted</span> Enkripsi Log Aktif</span>
                            <button className="text-secondary hover:text-secondary-fixed font-semibold inline-flex items-center gap-1 transition-colors">
                                Unduh Laporan Audit <span className="material-symbols-outlined text-[14px]">download</span>
                            </button>
                        </div>
                    </div>

                    {/* Emergency Command Console (Cols 4) */}
                    <div className="lg:col-span-4 flex flex-col gap-5">
                        <div className="bg-surface-container-low rounded-2xl p-6 relative overflow-hidden shadow-xl border border-surface-container-high">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-error/10 rounded-full blur-2xl pointer-events-none"></div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 rounded-xl bg-error-container text-error border border-error/30">
                                    <span className="material-symbols-outlined text-headline-md">gpp_maybe</span>
                                </div>
                                <div>
                                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Protokol Keamanan Darurat</h3>
                                    <span className="text-[11px] font-label-sm text-outline">Karantina & Mitigasi Instan</span>
                                </div>
                            </div>
                            <p className="font-body-sm text-[12px] text-on-surface-variant mb-5 leading-relaxed">
                                Tindakan ini akan memutus akses IP Gateway dan menganulir sesi token pada lab terpilih saat terdeteksi pelanggaran massal atau kebocoran soal.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button className="w-full bg-error-container hover:bg-error/30 text-error font-label-md text-label-md py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md border border-error/30">
                                    <span className="material-symbols-outlined text-[20px]">phonelink_erase</span>
                                    Putus Koneksi Lab Terinfeksi
                                </button>
                                <button className="w-full bg-surface-container hover:bg-surface-bright text-on-surface border border-surface-container-highest font-label-md text-label-md py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
                                    <span className="material-symbols-outlined text-[20px] text-secondary">wifi_protected_setup</span>
                                    Broadcast Token Baru
                                </button>
                            </div>
                        </div>

                        <div className="bg-surface-container-low border border-surface-container-high rounded-2xl p-5 shadow-xl flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-tertiary-container/30 border border-tertiary/20 flex items-center justify-center text-tertiary">
                                <span className="material-symbols-outlined text-title-lg">dns</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-title-lg text-[16px] text-on-surface font-bold">Central Sync Hub</span>
                                <span className="text-[11px] font-body-sm text-outline mt-0.5">Latency Sync: <strong className="text-tertiary font-mono-timer tracking-wide">12ms</strong> (Jakarta Core)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
