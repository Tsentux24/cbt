<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('exam_sessions', function (Blueprint $table) {
            $table->foreignId('question_bank_id')->nullable()->after('school_id')->constrained('question_banks')->nullOnDelete();
            $table->foreignId('class_room_id')->nullable()->after('question_bank_id')->constrained('class_rooms')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('exam_sessions', function (Blueprint $table) {
            $table->dropForeign(['question_bank_id']);
            $table->dropForeign(['class_room_id']);
            $table->dropColumn(['question_bank_id', 'class_room_id']);
        });
    }
};
