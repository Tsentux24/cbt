<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ExamSession;
use App\Models\Student;
use Inertia\Inertia;

class ProctorController extends Controller
{
    public function show($id)
    {
        $session = ExamSession::with(['questionBank.subject', 'classRoom.school'])->findOrFail($id);
        
        // Fetch students related to this class room
        $students = Student::with('user')
            ->where('class_room_id', $session->class_room_id)
            ->get();
            
        // Map students to workstations for the matrix view
        $workstations = $students->map(function ($student, $index) {
            // Mock data for demonstration purposes
            $isOnline = rand(1, 100) > 15; // 85% online
            $hasAlert = rand(1, 100) > 95; // 5% alert
            
            return [
                'pc_number' => str_pad($index + 1, 2, '0', STR_PAD_LEFT),
                'student_id' => $student->id,
                'student_name' => $student->user ? $student->user->name : 'Siswa ' . $student->id,
                'is_online' => $isOnline,
                'has_alert' => $hasAlert,
            ];
        });

        // Add dummy workstations to fill up to 20 for the UI
        $totalPCs = max(20, ceil($students->count() / 10) * 10);
        $workstationsArray = $workstations->toArray();
        for ($i = count($workstationsArray); $i < $totalPCs; $i++) {
            $workstationsArray[] = [
                'pc_number' => str_pad($i + 1, 2, '0', STR_PAD_LEFT),
                'student_id' => null,
                'student_name' => 'Kosong',
                'is_online' => false,
                'has_alert' => false,
            ];
        }

        return Inertia::render('Admin/LiveMatrix', [
            'examSession' => $session,
            'workstations' => collect($workstationsArray),
            'totalStudents' => $students->count(),
            'onlineCount' => collect($workstationsArray)->filter(fn($w) => $w['is_online'])->count(),
            'alertCount' => collect($workstationsArray)->filter(fn($w) => $w['has_alert'])->count(),
        ]);
    }
}
