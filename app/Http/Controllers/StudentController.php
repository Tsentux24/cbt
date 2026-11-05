<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function dashboard()
    {
        $student = auth()->user()->student;
        
        // Fetch active exams for the student's class
        $active_exams = \App\Models\ExamSession::where('class_room_id', $student->class_room_id ?? 0)
                            ->where('status', 'Aktif')
                            ->with('questionBank')
                            ->get();

        $upcoming_exams = \App\Models\ExamSession::where('class_room_id', $student->class_room_id ?? 0)
                            ->where('status', 'Terjadwal')
                            ->with('questionBank')
                            ->get();

        $totalStudentsInClass = \App\Models\Student::where('class_room_id', $student->class_room_id ?? 0)->count();

        return Inertia::render('Student/Dashboard', [
            'active_exams' => $active_exams,
            'upcoming_exams' => $upcoming_exams,
            'statistics' => [
                'average' => '-', 
                'rank' => '-',
                'total_students' => $totalStudentsInClass > 0 ? $totalStudentsInClass : 1
            ]
        ]);
    }

    public function verifyToken(Request $request)
    {
        $request->validate(['token' => 'required|string']);
        
        $student = auth()->user()->student;
        $session = \App\Models\ExamSession::where('token', $request->token)->first();

        if (!$session) {
            return back()->with('error', 'Token tidak valid atau sesi tidak ditemukan.');
        }

        if ($session->status !== 'Aktif') {
            return back()->with('error', 'Sesi ujian belum dimulai atau sudah selesai.');
        }

        if ($session->class_room_id !== $student->class_room_id) {
            return back()->with('error', 'Token ini tidak diperuntukkan bagi kelas Anda.');
        }

        // Ideally here we create a StudentExam record to track progress, but for now we redirect
        return redirect()->route('student.exam.engine', ['token' => $session->token]);
    }

    public function enterExam($token)
    {
        $student = auth()->user()->student;
        $session = \App\Models\ExamSession::where('token', $token)
                        ->where('status', 'Aktif')
                        ->where('class_room_id', $student->class_room_id)
                        ->with(['questionBank.questions.options', 'questionBank.subject', 'classRoom'])
                        ->firstOrFail();

        // Tracker for student progress
        $studentExam = \App\Models\StudentExam::firstOrCreate(
            ['student_id' => $student->id, 'exam_session_id' => $session->id],
            ['start_time' => \Carbon\Carbon::now(), 'status' => 'Sedang Mengerjakan']
        );

        $timeLeft = (int) \Carbon\Carbon::now()->diffInSeconds(\Carbon\Carbon::parse($session->end_time), false);

        // Load existing answers
        $existingAnswers = \App\Models\StudentAnswer::where('student_exam_id', $studentExam->id)
                                ->get()
                                ->keyBy('question_id');

        return Inertia::render('Student/ExamEngine', [
            'examSession' => $session,
            'questions' => $session->questionBank->questions,
            'student' => auth()->user(),
            'initialTimeLeft' => max(0, $timeLeft),
            'studentExamId' => $studentExam->id,
            'existingAnswers' => $existingAnswers
        ]);
    }

    public function submitExam(Request $request, $id)
    {
        $session = \App\Models\ExamSession::findOrFail($id);
        $student = auth()->user()->student;

        $studentExam = \App\Models\StudentExam::where('exam_session_id', $session->id)
                            ->where('student_id', $student->id)
                            ->firstOrFail();

        $studentExam->update([
            'end_time' => \Carbon\Carbon::now(),
            'status' => 'Selesai'
        ]);

        return redirect()->route('student.dashboard')->with('success', 'Ujian berhasil diselesaikan!');
    }

    public function autosave(Request $request)
    {
        $request->validate([
            'student_exam_id' => 'required|exists:student_exams,id',
            'question_id' => 'required|exists:questions,id',
            'question_option_id' => 'nullable|exists:question_options,id',
            'is_doubtful' => 'required|boolean'
        ]);

        \App\Models\StudentAnswer::updateOrCreate(
            [
                'student_exam_id' => $request->student_exam_id,
                'question_id' => $request->question_id
            ],
            [
                'question_option_id' => $request->question_option_id,
                'is_doubtful' => $request->is_doubtful
            ]
        );

        return response()->json(['status' => 'saved']);
    }
}
