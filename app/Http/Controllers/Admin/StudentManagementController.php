<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentManagementController extends Controller
{
    public function index()
    {
        $students = Student::with(['user', 'school', 'classRoom'])->paginate(10);
        $schools = School::all();
        $classRooms = \App\Models\ClassRoom::all();

        return Inertia::render('Admin/StudentManagement', [
            'students' => $students,
            'schools' => $schools,
            'classRooms' => $classRooms,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nisn' => 'required|string|unique:students,nisn',
            'password' => 'required|string|min:6',
            'school_id' => 'required|exists:schools,id',
            'class_room_id' => 'required|exists:class_rooms,id',
        ]);

        $user = \App\Models\User::create([
            'name' => $validated['name'],
            'username' => $validated['nisn'],
            'email' => $validated['nisn'] . '@student.apexcbt.local',
            'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
            'school_id' => $validated['school_id'],
        ]);

        $roleSiswa = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'SISWA']);
        $user->assignRole($roleSiswa);

        Student::create([
            'nisn' => $validated['nisn'],
            'user_id' => $user->id,
            'school_id' => $validated['school_id'],
            'class_room_id' => $validated['class_room_id'],
            'status' => 'Aktif',
        ]);

        return redirect()->back()->with('success', 'Siswa berhasil ditambahkan');
    }

    public function update(Request $request, $id)
    {
        $student = Student::with('user')->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nisn' => 'required|string|unique:students,nisn,' . $student->id,
            'school_id' => 'required|exists:schools,id',
            'class_room_id' => 'required|exists:class_rooms,id',
        ]);

        $student->user->update([
            'name' => $validated['name'],
            'username' => $validated['nisn'],
            'email' => $validated['nisn'] . '@student.apexcbt.local',
        ]);

        if ($request->filled('password')) {
            $student->user->update(['password' => \Illuminate\Support\Facades\Hash::make($request->password)]);
        }

        $student->update([
            'nisn' => $validated['nisn'],
            'school_id' => $validated['school_id'],
            'class_room_id' => $validated['class_room_id'],
        ]);

        return redirect()->back()->with('success', 'Data siswa berhasil diperbarui');
    }
}
