<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->integer('satisfaction_rating')->nullable()->after('status');
            $table->text('satisfaction_comment')->nullable()->after('satisfaction_rating');
        });
    }

    public function down()
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropColumn('satisfaction_rating');
            $table->dropColumn('satisfaction_comment');
        });
    }
}; 