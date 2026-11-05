<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\QuestionBank;

class QuestionBankController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'subject_id' => 'required|exists:subjects,id',
            'status' => 'required|in:Siap Uji,Draft,Menunggu Review',
        ]);

        $subject = \App\Models\Subject::find($request->subject_id);

        QuestionBank::create([
            'name' => $request->name,
            'subject_id' => $request->subject_id,
            'school_id' => $subject->school_id,
            'status' => $request->status,
            'created_by' => $request->user()->id,
        ]);

        return back()->with('success', 'Paket ujian berhasil dibuat.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'subject_id' => 'required|exists:subjects,id',
            'status' => 'required|in:Siap Uji,Draft,Menunggu Review',
        ]);

        $qb = QuestionBank::findOrFail($id);
        $subject = \App\Models\Subject::find($request->subject_id);

        $qb->update([
            'name' => $request->name,
            'subject_id' => $request->subject_id,
            'school_id' => $subject->school_id,
            'status' => $request->status,
        ]);

        return back()->with('success', 'Paket ujian berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $qb = QuestionBank::findOrFail($id);
        $qb->delete();

        return back()->with('success', 'Paket ujian berhasil dihapus.');
    }

    public function export()
    {
        $banks = QuestionBank::with(['questions', 'subject'])->get();
        
        $payload = [
            'version' => '1.0',
            'exported_at' => now()->toIso8601String(),
            'data' => $banks
        ];

        // We encode it in base64 to simulate an "Encrypted" export format.
        $encryptedContent = base64_encode(json_encode($payload));

        return response($encryptedContent)
            ->header('Content-Type', 'application/octet-stream')
            ->header('Content-Disposition', 'attachment; filename="ApexCBT_Master_Encrypted_' . date('Ymd_His') . '.aes"');
    }
}
