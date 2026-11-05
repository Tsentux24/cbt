<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ExamSession;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

use Inertia\Inertia;
use App\Models\School;

class ExamSessionController extends Controller
{
    public function index()
    {
        $sessions = ExamSession::with(['school', 'questionBank', 'classRoom'])->latest()->get();
        $schools = School::all();
        $classRooms = \App\Models\ClassRoom::all();
        $questionBanks = \App\Models\QuestionBank::all();
        
        return Inertia::render('Admin/ExamSessions', [
            'sessions' => $sessions,
            'schools' => $schools,
            'classRooms' => $classRooms,
            'questionBanks' => $questionBanks,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'school_id' => 'required|exists:schools,id',
            'class_room_id' => 'required|exists:class_rooms,id',
            'question_bank_id' => 'required|exists:question_banks,id',
            'name' => 'required|string|max:255',
            'duration' => 'required|integer|min:10', // Menit
        ]);

        $token = strtoupper(Str::random(6));

        ExamSession::create([
            'school_id' => $request->school_id,
            'class_room_id' => $request->class_room_id,
            'question_bank_id' => $request->question_bank_id,
            'name' => $request->name,
            'token' => $token,
            'status' => 'Aktif',
            'start_time' => now(),
            'end_time' => now()->addMinutes((int) $request->duration),
        ]);

        return redirect()->back()->with('success', "Berhasil! Sesi ujian dibuat dengan Token: $token");
    }

    public function destroy(ExamSession $examSession)
    {
        $examSession->delete();
        return back()->with('success', 'Sesi ujian berhasil dihapus');
    }
}
