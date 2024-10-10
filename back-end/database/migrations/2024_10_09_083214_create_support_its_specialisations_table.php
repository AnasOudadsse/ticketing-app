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
        Schema::create('support_its_specialisations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('specialisation_id')->constrained('specialisations')->onDelete('cascade');
            $table->foreignId('support_it_id')->constrained('support_its')->onDelete('cascade');
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
        Schema::dropIfExists('support_its_specialisations');
    }
};
