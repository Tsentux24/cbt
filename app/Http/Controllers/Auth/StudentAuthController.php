<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class StudentAuthController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'nisn' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        if (Auth::attempt(['username' => $request->nisn, 'password' => $request->password])) {
            $request->session()->regenerate();

            if (!Auth::user()->hasRole('SISWA')) {
                Auth::logout();
                throw ValidationException::withMessages([
                    'nisn' => 'Akun bukan berstatus Siswa.',
                ]);
            }

            return redirect()->intended(route('student.dashboard', absolute: false));
        }

        throw ValidationException::withMessages([
            'nisn' => trans('auth.failed'),
        ]);
    }
}
