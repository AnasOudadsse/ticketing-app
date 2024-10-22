<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->foreignId('problem_id')->constrained('problems')->onDelete('cascade');
            $table->text('description');
            $table->string('attachement')->nullable();
            $table->enum('status', ['opened', 'reserved', 'resolved', 'closed'])->default('opened');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('reserved_by')->nullable()->constrained('users')->onDelete('set null'); // supportIt reserve un ticket, peut être null au départ
            $table->foreignId('admin_id')->nullable()->constrained('users')->onDelete('set null'); // admin qui a assigné le ticket
            $table->timestamp('resolution_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tickets');
    }
};
