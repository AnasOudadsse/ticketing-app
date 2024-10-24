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
        Schema::table('tickets', function (Blueprint $table) {
            $table->foreignId('resolved_by')->nullable()->constrained('users')->onDelete('cascade');//client
            $table->foreignId('closed_by')->nullable()->constrained('users')->onDelete('set null'); // supportIt reserve un ticket, peut être null au départ
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropColumn('created_by');
            $table->dropColumn('reserved_by');
        });
    }
};
