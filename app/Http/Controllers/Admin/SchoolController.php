<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\School;
use Inertia\Inertia;

class SchoolController extends Controller
{
    public function index()
    {
        $schools = School::with(['classRooms' => function($query) {
            $query->withCount('students')->with(['students.user']);
        }])->latest()->get();

        // Calculate total active workstations
        $schools->each(function ($school) {
            $school->total_workstations = $school->classRooms->sum('students_count');
            
            // Mock Telemetry Data based on actual workstations
            if ($school->total_workstations > 0) {
                $online = max(0, $school->total_workstations - rand(0, 3));
                $totalQuestions = $online * 40; // Assume 40 questions per student
                $answered = (int)($totalQuestions * (rand(60, 95) / 100)); // 60-95% completed
                $unanswered = $totalQuestions - $answered;
                
                // Get real students if available, else mock
                $realStudents = collect();
                foreach($school->classRooms as $room) {
                    if($room->students) {
                        $realStudents = $realStudents->merge($room->students);
                    }
                }
                
                $studentsList = [];
                if($realStudents->count() > 0) {
                    $counter = 0;
                    foreach($realStudents as $st) {
                        $isOnline = $counter < $online;
                        $studentsList[] = [
                            'name' => $st->user ? $st->user->name : 'Siswa ' . $st->nisn,
                            'status' => $isOnline ? 'Sedang Ujian' : 'Belum Mulai / Offline',
                            'is_online' => $isOnline
                        ];
                        $counter++;
                    }
                } else {
                    for ($i=1; $i <= $school->total_workstations; $i++) {
                        $isOnline = $i <= $online;
                        $studentsList[] = [
                            'name' => 'Peserta Ujian ' . str_pad($i, 3, '0', STR_PAD_LEFT),
                            'status' => $isOnline ? 'Sedang Ujian' : 'Belum Mulai / Offline',
                            'is_online' => $isOnline
                        ];
                    }
                }
                
                $school->telemetry = [
                    'online' => $online,
                    'total_questions' => $totalQuestions,
                    'answered' => $answered,
                    'unanswered' => $unanswered,
                    'progress' => $totalQuestions > 0 ? round(($answered / $totalQuestions) * 100) : 0,
                    'students_list' => $studentsList
                ];
            } else {
                $school->telemetry = null;
            }
        });

        return Inertia::render('Admin/Schools', [
            'schools' => $schools
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string'
        ]);

        School::create($request->all());
        return back()->with('success', 'Sekolah berhasil ditambahkan');
    }

    public function destroy(School $school)
    {
        $school->delete();
        return back()->with('success', 'Sekolah berhasil dihapus');
    }
}
