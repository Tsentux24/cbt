<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ClassRoom;
use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassRoomController extends Controller
{
    public function index()
    {
        $classRooms = ClassRoom::with('school')->latest()->get();
        $schools = School::all();
        
        return Inertia::render('Admin/ClassRooms', [
            'classRooms' => $classRooms,
            'schools' => $schools
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'school_id' => 'required|exists:schools,id',
            'name' => 'required|string|max:255',
            'level' => 'required|string|max:50',
        ]);

        ClassRoom::create($request->all());

        return back()->with('success', 'Kelas berhasil ditambahkan!');
    }

    public function update(Request $request, ClassRoom $classRoom)
    {
        $request->validate([
            'school_id' => 'required|exists:schools,id',
            'name' => 'required|string|max:255',
            'level' => 'required|string|max:50',
        ]);

        $classRoom->update($request->all());

        return back()->with('success', 'Kelas berhasil diperbarui!');
    }

    public function destroy(ClassRoom $classRoom)
    {
        $classRoom->delete();
        return back()->with('success', 'Kelas berhasil dihapus!');
    }
}
