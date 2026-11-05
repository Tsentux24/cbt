<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\QuestionBank;
use App\Models\Question;
use App\Models\QuestionOption;
use Inertia\Inertia;

class QuestionController extends Controller
{
    public function index($bankId)
    {
        $bank = QuestionBank::findOrFail($bankId);
        $questions = Question::where('question_bank_id', $bankId)->with('options')->get();

        return Inertia::render('Admin/Questions', [
            'bank' => $bank,
            'questions' => $questions,
        ]);
    }

    public function store(Request $request, $bankId)
    {
        $request->validate([
            'question_text' => 'required|string',
            'options' => 'required|array|min:2',
            'options.*.text' => 'required|string',
            'options.*.is_correct' => 'required|boolean',
        ]);

        $bank = QuestionBank::findOrFail($bankId);

        $question = Question::create([
            'school_id' => $bank->school_id,
            'question_bank_id' => $bank->id,
            'question_text' => $request->question_text,
            'type' => 'multiple_choice',
            'created_by' => auth()->id(),
        ]);

        foreach ($request->options as $opt) {
            QuestionOption::create([
                'question_id' => $question->id,
                'option_text' => $opt['text'],
                'is_correct' => $opt['is_correct'],
            ]);
        }

        return back()->with('success', 'Soal berhasil ditambahkan');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'question_text' => 'required|string',
            'options' => 'required|array|min:2',
            'options.*.text' => 'required|string',
            'options.*.is_correct' => 'required|boolean',
        ]);

        $question = Question::findOrFail($id);
        $question->update([
            'question_text' => $request->question_text,
        ]);

        foreach ($request->options as $opt) {
            if (isset($opt['id'])) {
                $option = QuestionOption::find($opt['id']);
                if ($option && $option->question_id == $question->id) {
                    $option->update([
                        'option_text' => $opt['text'],
                        'is_correct' => $opt['is_correct'],
                    ]);
                }
            } else {
                QuestionOption::create([
                    'question_id' => $question->id,
                    'option_text' => $opt['text'],
                    'is_correct' => $opt['is_correct'],
                ]);
            }
        }

        return back()->with('success', 'Soal berhasil diperbarui');
    }

    public function destroy($id)
    {
        Question::findOrFail($id)->delete();
        return back()->with('success', 'Soal berhasil dihapus');
    }
}
