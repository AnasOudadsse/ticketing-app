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
            $table->foreignId('problem_id')->constrained('problems')->onDelete('cascade');
            $table->text('description');
            $table->string('status');
            $table->string('attachement')->nullable();
            $table->unsignedBigInteger('supportItID')->nullable();
            $table->foreign('supportItID')->references('id')->on('support_its');
            $table->unsignedBigInteger('adminID')->nullable();
            $table->foreign('adminID')->references('id')->on('admins');
            $table->unsignedBigInteger('clientID');
            $table->foreign('clientID')->references('client_id')->on('clients');
            $table->timestamps();
            $table->timestamp('resolution_date')->nullable();
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
