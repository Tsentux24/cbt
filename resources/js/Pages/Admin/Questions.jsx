import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import Swal from 'sweetalert2';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function Questions({ bank, questions }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        question_text: '',
        options: [
            { text: '', is_correct: true },
            { text: '', is_correct: false },
            { text: '', is_correct: false },
            { text: '', is_correct: false },
            { text: '', is_correct: false },
        ]
    });

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            ['link', 'image', 'video'],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'color': [] }, { 'background': [] }],
            ['clean']
        ],
    };

    const optionModules = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            ['image', 'clean']
        ]
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingId) {
            put(route('admin.questions.update', editingId), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                    setEditingId(null);
                    clearErrors();
                }
            });
        } else {
            post(route('admin.questions.store', bank.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                    clearErrors();
                }
            });
        }
    };

    const openAddModal = () => {
        setEditingId(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (q) => {
        setEditingId(q.id);
        clearErrors();
        
        // Pad options if less than 5
        let opts = q.options.map(opt => ({
            id: opt.id,
            text: opt.option_text,
            is_correct: opt.is_correct
        }));
        
        while (opts.length < 5) {
            opts.push({ text: '', is_correct: opts.length === 0 });
        }

        setData({
            question_text: q.question_text,
            options: opts
        });
        setIsModalOpen(true);
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...data.options];
        newOptions[index].text = value;
        setData('options', newOptions);
    };

    const handleCorrectChange = (index) => {
        const newOptions = data.options.map((opt, i) => ({
            ...opt,
            is_correct: i === index
        }));
        setData('options', newOptions);
    };

    const deleteQuestion = (id) => {
        Swal.fire({
            title: 'Hapus Butir Soal?',
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
                router.delete(route('admin.questions.destroy', id));
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Kelola Soal: ${bank.name} | ApexCBT`} />
            
            <style>{`
                .quill-editor .ql-toolbar {
                    background-color: var(--color-surface-container-high, #2b2f36);
                    border-color: var(--color-surface-container-highest, #3f444d);
                    border-top-left-radius: 0.5rem;
                    border-top-right-radius: 0.5rem;
                }
                .quill-editor .ql-toolbar button {
                    color: var(--color-on-surface, #e1e3e8);
                }
                .quill-editor .ql-toolbar .ql-stroke {
                    stroke: var(--color-on-surface, #e1e3e8);
                }
                .quill-editor .ql-toolbar .ql-fill {
                    fill: var(--color-on-surface, #e1e3e8);
                }
                .quill-editor .ql-toolbar .ql-picker {
                    color: var(--color-on-surface, #e1e3e8);
                }
                .quill-editor .ql-container {
                    border-color: var(--color-surface-container-highest, #3f444d);
                    border-bottom-left-radius: 0.5rem;
                    border-bottom-right-radius: 0.5rem;
                    font-family: inherit;
                    font-size: 14px;
                    min-height: 150px;
                }
                .quill-editor.option-editor .ql-container {
                    min-height: 60px;
                }
                .quill-editor .ql-editor {
                    color: var(--color-on-surface, #e1e3e8);
                }
                .quill-editor .ql-editor.ql-blank::before {
                    color: var(--color-on-surface-variant, #9aa0a6);
                }
            `}</style>

            <div className="flex flex-col w-full pb-16 pt-6">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-on-surface-variant font-label-md">
                            <Link href="/admin/bank-soal" className="hover:text-primary transition-colors">Bank Soal</Link>
                            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                            <span>Kelola Soal</span>
                        </div>
                        <h1 className="font-headline-xl text-[32px] font-bold text-on-surface tracking-tight leading-tight">
                            {bank.name}
                        </h1>
                        <p className="font-body-sm text-[14px] text-on-surface-variant max-w-3xl leading-relaxed mt-1">
                            Kelola butir soal, opsi jawaban, dan kunci jawaban untuk paket ini.
                        </p>
                    </div>
                    <button onClick={openAddModal} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-fixed text-on-primary text-[14px] font-bold transition-all shadow-[0_0_20px_rgba(76,215,246,0.25)] active:scale-[0.98]">
                        <span className="material-symbols-outlined text-[20px]">add_task</span>
                        <span>+ Tambah Butir Soal</span>
                    </button>
                </div>

                <div className="flex flex-col gap-5">
                    {questions && questions.length > 0 ? (
                        questions.map((q, index) => (
                            <div key={q.id} className="bg-surface-container-low border border-surface-container-high rounded-2xl p-6 shadow-sm flex flex-col gap-4 relative group">
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                    <button onClick={() => openEditModal(q)} className="p-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                    </button>
                                    <button onClick={() => deleteQuestion(q.id)} className="p-2 rounded-lg bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                    </button>
                                </div>
                                <div className="flex gap-4">
                                    <div className="font-bold text-primary text-title-md">{index + 1}.</div>
                                    <div className="flex flex-col gap-3 flex-1">
                                        <div className="text-on-surface font-body-md" dangerouslySetInnerHTML={{ __html: q.question_text }}></div>
                                        <div className="flex flex-col gap-2 mt-2">
                                            {q.options && q.options.map((opt, i) => (
                                                <div key={opt.id} className={`flex items-start gap-3 p-3 rounded-lg border ${opt.is_correct ? 'bg-primary-container/20 border-primary-container text-on-surface' : 'bg-surface border-surface-container-high text-on-surface-variant'}`}>
                                                    <div className={`font-bold ${opt.is_correct ? 'text-primary' : 'text-on-surface-variant'}`}>
                                                        {String.fromCharCode(65 + i)}.
                                                    </div>
                                                    <div className="font-body-sm flex-1" dangerouslySetInnerHTML={{ __html: opt.option_text }}></div>
                                                    {opt.is_correct && (
                                                        <span className="material-symbols-outlined text-primary text-[18px]" title="Kunci Jawaban">check_circle</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-surface-container-low border border-surface-container-high rounded-2xl p-12 shadow-sm flex flex-col items-center justify-center gap-3 text-center">
                            <span className="material-symbols-outlined text-[48px] text-on-surface-variant/50">quiz</span>
                            <h3 className="font-title-md text-on-surface font-bold">Belum Ada Soal</h3>
                            <p className="font-body-sm text-on-surface-variant max-w-sm">Paket ujian ini masih kosong. Silakan tambahkan butir soal baru atau import dari format Excel.</p>
                        </div>
                    )}
                </div>
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="5xl">
                <form onSubmit={submit} className="p-6 bg-surface max-h-[85vh] overflow-y-auto">
                    <h2 className="text-lg font-medium text-on-surface mb-6">{editingId ? 'Edit Butir Soal' : 'Tambah Butir Soal Baru'}</h2>
                    
                    <div className="mb-6">
                        <InputLabel htmlFor="question_text" value="Pertanyaan (Mendukung Teks Kaya & Gambar)" />
                        <div className="mt-2 quill-editor">
                            <ReactQuill 
                                theme="snow"
                                value={data.question_text}
                                onChange={(content) => setData('question_text', content)}
                                modules={quillModules}
                                placeholder="Ketik pertanyaan atau sisipkan gambar di sini..."
                            />
                        </div>
                        <InputError message={errors.question_text} className="mt-2" />
                    </div>

                    <div className="mb-6">
                        <InputLabel value="Opsi Jawaban & Kunci (Pilih salah satu)" className="mb-3" />
                        <div className="flex flex-col gap-5">
                            {data.options.map((opt, index) => (
                                <div key={index} className="flex items-start gap-4 p-4 rounded-xl border border-surface-container-highest bg-surface-container-low">
                                    <div className="pt-2">
                                        <input 
                                            type="radio" 
                                            name="correct_answer" 
                                            checked={opt.is_correct}
                                            onChange={() => handleCorrectChange(index)}
                                            className="text-primary focus:ring-primary bg-surface-container border-surface-container-highest w-5 h-5 cursor-pointer"
                                            title="Jadikan Kunci Jawaban"
                                        />
                                    </div>
                                    <div className="font-bold text-on-surface-variant w-6 pt-1.5 text-lg">{String.fromCharCode(65 + index)}.</div>
                                    <div className="flex-1 quill-editor option-editor">
                                        <ReactQuill 
                                            theme="snow"
                                            value={opt.text}
                                            onChange={(content) => handleOptionChange(index, content)}
                                            modules={optionModules}
                                            placeholder={`Ketik opsi jawaban ${String.fromCharCode(65 + index)}...`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <SecondaryButton onClick={() => setIsModalOpen(false)}>Batal</SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={processing}>{editingId ? 'Update Soal' : 'Simpan Soal'}</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
