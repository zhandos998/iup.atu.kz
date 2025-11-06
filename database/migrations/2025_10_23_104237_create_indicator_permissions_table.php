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

        Schema::create('indicator_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('indicator_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade'); // конкретный пользователь (если null — правило глобальное)
            $table->string('role')->nullable(); // можно привязать к роли
            $table->boolean('can_edit_plan')->default(false);
            $table->boolean('can_edit_fact')->default(false);
            $table->boolean('can_add_files')->default(false);
            $table->boolean('can_delete_files')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('indicator_permissions');
    }
};
