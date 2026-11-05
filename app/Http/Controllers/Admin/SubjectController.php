<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Subject;
use App\Models\School;
use Inertia\Inertia;

class SubjectController extends Controller
{
    public function index()
    {
        $subjects = Subject::with('school')->latest()->get();
        $schools = School::all();
        return Inertia::render('Admin/Subjects', [
            'subjects' => $subjects,
            'schools' => $schools,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50',
            'school_id' => 'required|exists:schools,id',
        ]);

        Subject::create($request->all());

        return back()->with('success', 'Mata Pelajaran berhasil ditambahkan');
    }

    public function destroy(Subject $subject)
    {
        $subject->delete();
        return back()->with('success', 'Mata Pelajaran berhasil dihapus');
    }
}
