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
        Schema::create('indicators', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('code'); // 1.1.1 и т.д.
            $table->string('title', 511); // Наименование показателя
            $table->string('unit')->nullable(); // Единица измерения (например, "академический час")
            $table->text('note')->nullable(); // Примечание / описание
            $table->foreignId('parent_id')->nullable()->constrained('indicators')->nullOnDelete();
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('indicators');
    }
};
