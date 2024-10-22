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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('role',['admin','supportIt','client']);
            $table->enum('role_in_creation',['admin','supportIt','client']);
            // $table->foreignId('specialisation_id')->nullable()->constrained('specialisations')->onDelete('cascade');
            $table->foreignId('fonction_id')->constrained('fonctions')->onDelete('cascade'); // si, it, planifiacation, scolarite, audio visual, communication, qualite, administration, addmision, achat, 
            $table->foreignId('departement_id')->constrained('departements')->onDelete('cascade'); // um6ss, fmc, maf, fmd, efm, fmb, fm6sips, esm6iss, eim6p, em6sv
            $table->foreignId('localisation_id')->constrained('localisations')->onDelete('cascade'); // Anfa 1: Batiment A, Batiment B, Batiment C, Batiment D, La ligue arab: Batiment A, Batiment B, Anfa 2: fsts
            $table->rememberToken();
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
        Schema::dropIfExists('users');
    }
};
