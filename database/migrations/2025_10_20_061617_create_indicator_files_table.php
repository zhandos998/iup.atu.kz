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
        Schema::create('indicator_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('indicator_value_id')->constrained()->onDelete('cascade');
            $table->string('path'); // путь в storage
            $table->string('original_name'); // оригинальное имя файла
            $table->foreignId('uploaded_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('indicator_files');
    }
};
