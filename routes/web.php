<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\StudentAuthController;
use App\Http\Controllers\StudentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/ujian', function () {
    return Inertia::render('Student/Login');
})->name('student.login');

Route::post('/student/login', [StudentAuthController::class, 'store'])->name('student.login.store');

Route::middleware(['auth', 'role:SISWA'])->prefix('student')->group(function () {
    Route::get('/dashboard', [StudentController::class, 'dashboard'])->name('student.dashboard');
    Route::post('/verify-token', [StudentController::class, 'verifyToken'])->name('student.verify_token');
    Route::get('/exam/{token}', [StudentController::class, 'enterExam'])->name('student.exam.engine');
    Route::post('/exam/{id}/submit', [StudentController::class, 'submitExam'])->name('student.exam.submit');
    Route::post('/exam/autosave', [StudentController::class, 'autosave'])->name('student.exam.autosave');
});

Route::get('/dashboard', function () {
    $schools = \App\Models\School::with(['classRooms' => function($query) {
        $query->withCount('students')->with(['students.user']);
    }])->latest()->get();

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

    $kpi = [
        'total_schools' => $schools->count(),
        'active_schools' => min($schools->count(), 18), // Mock active count for now
        'total_labs' => \App\Models\ClassRoom::count(),
        'total_capacity' => \App\Models\Student::count(),
        'online_students' => (int)(\App\Models\Student::count() * 0.89), // Mock 89% occupancy
    ];

    return Inertia::render('Dashboard', [
        'schools' => $schools,
        'kpi' => $kpi
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/admin/schools/{schoolName}/generate-seb', function ($schoolName) {
    $ip = request('ip', request()->getHost());
    $port = request('port', request()->getPort());
    
    // Construct the URL
    $portString = ($port && $port != '80' && $port != '443') ? ':' . $port : '';
    $serverUrl = 'http://' . $ip . $portString;

    $xmlContent = '<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>originatorVersion</key>
    <string>SEB_Win_3.4.1</string>
    <key>startURL</key>
    <string>' . $serverUrl . '/login?school=' . urlencode($schoolName) . '</string>
    <key>sebServerURL</key>
    <string></string>
    <key>hashedQuitPassword</key>
    <string>admin123</string>
    <key>enableBrowserWindowToolbar</key>
    <false/>
    <key>showTaskBar</key>
    <false/>
    <key>allowSpellCheck</key>
    <false/>
    <key>enableSebBrowser</key>
    <true/>
  </dict>
</plist>';

    $filename = 'Config_Klien_' . \Illuminate\Support\Str::slug($schoolName) . '.seb';
    
    return response($xmlContent)
        ->header('Content-Type', 'application/seb')
        ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
})->middleware(['auth', 'verified'])->name('admin.generate.seb');

Route::get('/admin/bank-soal', function () {
    $examSessions = \App\Models\ExamSession::with(['questionBank.subject', 'classRoom'])->latest()->get();
    $questionBanks = \App\Models\QuestionBank::with(['subject', 'creator'])->latest()->get();
    $subjects = \App\Models\Subject::all();
    
    $stats = [
        'totalPaket' => \App\Models\QuestionBank::count(),
        'totalButir' => \App\Models\Question::count(),
        'totalSesiHariIni' => \App\Models\ExamSession::whereDate('start_time', \Carbon\Carbon::today())->count(),
        'totalPeserta' => \App\Models\Student::count()
    ];

    return Inertia::render('Admin/BankSoal', [
        'examSessions' => $examSessions,
        'questionBanks' => $questionBanks,
        'subjects' => $subjects,
        'stats' => $stats,
    ]);
})->middleware(['auth', 'verified'])->name('admin.bank-soal');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/admin/students', [\App\Http\Controllers\Admin\StudentManagementController::class, 'index'])->name('admin.students.index');
    Route::post('/admin/students', [\App\Http\Controllers\Admin\StudentManagementController::class, 'store'])->name('admin.students.store');
    Route::put('/admin/students/{id}', [\App\Http\Controllers\Admin\StudentManagementController::class, 'update'])->name('admin.students.update');
    
    Route::post('/admin/exam-sessions', [\App\Http\Controllers\Admin\ExamSessionController::class, 'store'])->name('admin.exam-sessions.store');
    Route::post('/admin/bank-soal', [\App\Http\Controllers\Admin\QuestionBankController::class, 'store'])->name('admin.bank-soal.store');
    Route::put('/admin/bank-soal/{id}', [\App\Http\Controllers\Admin\QuestionBankController::class, 'update'])->name('admin.bank-soal.update');
    Route::delete('/admin/bank-soal/{id}', [\App\Http\Controllers\Admin\QuestionBankController::class, 'destroy'])->name('admin.bank-soal.destroy');
    Route::get('/admin/bank-soal/export', [\App\Http\Controllers\Admin\QuestionBankController::class, 'export'])->name('admin.bank-soal.export');
    
    Route::get('/admin/bank-soal/{bankId}/questions', [\App\Http\Controllers\Admin\QuestionController::class, 'index'])->name('admin.questions.index');
    Route::post('/admin/bank-soal/{bankId}/questions', [\App\Http\Controllers\Admin\QuestionController::class, 'store'])->name('admin.questions.store');
    Route::put('/admin/questions/{id}', [\App\Http\Controllers\Admin\QuestionController::class, 'update'])->name('admin.questions.update');
    Route::delete('/admin/questions/{id}', [\App\Http\Controllers\Admin\QuestionController::class, 'destroy'])->name('admin.questions.destroy');
    
    Route::get('/admin/schools', [\App\Http\Controllers\Admin\SchoolController::class, 'index'])->name('admin.schools.index');
    Route::post('/admin/schools', [\App\Http\Controllers\Admin\SchoolController::class, 'store'])->name('admin.schools.store');
    Route::delete('/admin/schools/{school}', [\App\Http\Controllers\Admin\SchoolController::class, 'destroy'])->name('admin.schools.destroy');
    
    Route::get('/admin/users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('admin.users.index');
    Route::post('/admin/users', [\App\Http\Controllers\Admin\UserController::class, 'store'])->name('admin.users.store');
    Route::delete('/admin/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('admin.users.destroy');

    Route::get('/admin/subjects', [\App\Http\Controllers\Admin\SubjectController::class, 'index'])->name('admin.subjects.index');
    Route::post('/admin/subjects', [\App\Http\Controllers\Admin\SubjectController::class, 'store'])->name('admin.subjects.store');
    Route::delete('/admin/subjects/{subject}', [\App\Http\Controllers\Admin\SubjectController::class, 'destroy'])->name('admin.subjects.destroy');

    Route::get('/admin/exam-sessions', [\App\Http\Controllers\Admin\ExamSessionController::class, 'index'])->name('admin.exam-sessions.index');
    Route::post('/admin/exam-sessions', [\App\Http\Controllers\Admin\ExamSessionController::class, 'store'])->name('admin.exam-sessions.store');
    Route::delete('/admin/exam-sessions/{examSession}', [\App\Http\Controllers\Admin\ExamSessionController::class, 'destroy'])->name('admin.exam-sessions.destroy');
    Route::get('/admin/exam-sessions/{id}/proctor', [\App\Http\Controllers\Admin\ProctorController::class, 'show'])->name('admin.proctor.show');

    Route::get('/admin/class-rooms', [\App\Http\Controllers\Admin\ClassRoomController::class, 'index'])->name('admin.class-rooms.index');
    Route::post('/admin/class-rooms', [\App\Http\Controllers\Admin\ClassRoomController::class, 'store'])->name('admin.class-rooms.store');
    Route::put('/admin/class-rooms/{classRoom}', [\App\Http\Controllers\Admin\ClassRoomController::class, 'update'])->name('admin.class-rooms.update');
    Route::delete('/admin/class-rooms/{classRoom}', [\App\Http\Controllers\Admin\ClassRoomController::class, 'destroy'])->name('admin.class-rooms.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
