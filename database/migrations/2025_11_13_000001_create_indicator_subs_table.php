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
        Schema::create('indicator_subs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('indicator_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('code')->nullable(); // например 1.1.1.a.a
            $table->string('title')->nullable();
            $table->integer('plan')->nullable();
            $table->integer('fact')->nullable();
            // $table->json('files')->nullable(); // массив путей к файлам
            $table->timestamps();
        });

        Schema::create('indicator_sub_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('indicator_sub_id')->constrained('indicator_subs')->onDelete('cascade');
            $table->string('path'); // путь к файлу в storage
            $table->string('original_name'); // оригинальное имя
            $table->foreignId('uploaded_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('indicator_subs');
        Schema::dropIfExists('indicator_sub_files');
    }
};
