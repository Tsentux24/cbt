<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\School;
use App\Models\ClassRoom;
use App\Models\Student;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Roles
        $roleSuperadmin = Role::firstOrCreate(['name' => 'SUPERADMIN']);
        $roleGuru = Role::firstOrCreate(['name' => 'GURU']);
        $rolePengawas = Role::firstOrCreate(['name' => 'PENGAWAS']);
        $roleSiswa = Role::firstOrCreate(['name' => 'SISWA']);

        // 2. Create School
        $school = School::firstOrCreate(
            ['name' => 'SMAN 1 Jakarta'],
            [
                'address' => 'Jl. Budi Utomo No. 7',
                'status' => 'Aktif',
            ]
        );

        // 3. Create Class Room
        $classRoom = ClassRoom::firstOrCreate(
            ['name' => 'XII IPA 1'],
            [
                'school_id' => $school->id,
                'level' => '12',
            ]
        );

        // 4. Create Superadmin User
        $superadminUser = User::firstOrCreate(
            ['email' => 'admin@apexcbt.local'],
            [
                'name' => 'Super Administrator',
                'username' => 'superadmin',
                'password' => Hash::make('password123'), // Default password
                'school_id' => $school->id,
            ]
        );
        $superadminUser->assignRole($roleSuperadmin);

        // 5. Create Test Student User
        $nisn = '0064928174';
        $studentUser = User::firstOrCreate(
            ['username' => $nisn],
            [
                'name' => 'Siswa Tester Ujian',
                'email' => 'siswa@apexcbt.local',
                'password' => Hash::make('123456'), // PIN: 123456
                'school_id' => $school->id,
            ]
        );
        $studentUser->assignRole($roleSiswa);

        // 6. Create Student Profile
        Student::firstOrCreate(
            ['nisn' => $nisn],
            [
                'user_id' => $studentUser->id,
                'school_id' => $school->id,
                'class_room_id' => $classRoom->id,
                'status' => 'Aktif',
            ]
        );

        // 7. Create Subjects
        $subjectMat = \App\Models\Subject::firstOrCreate([
            'school_id' => $school->id,
            'name' => 'Matematika Peminatan',
            'code' => 'MAT',
        ]);
        
        $subjectFis = \App\Models\Subject::firstOrCreate([
            'school_id' => $school->id,
            'name' => 'Fisika Terapan',
            'code' => 'FIS',
        ]);

        // 8. Create Question Banks
        \App\Models\QuestionBank::firstOrCreate([
            'name' => 'PKT-MAT-XII-01',
            'school_id' => $school->id,
            'subject_id' => $subjectMat->id,
            'description' => 'Matematika Peminatan (Analisis Vektor & Kalkulus)',
            'created_by' => $superadminUser->id,
            'status' => 'Siap Uji',
        ]);

        \App\Models\QuestionBank::firstOrCreate([
            'name' => 'PKT-FIS-XII-LAB',
            'school_id' => $school->id,
            'subject_id' => $subjectFis->id,
            'description' => 'Fisika Terapan & Pengukuran Laboratorium Modern',
            'created_by' => $superadminUser->id,
            'status' => 'Siap Uji',
        ]);
    }
}
