<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->timestamp('rated_at')->nullable()->after('satisfaction_comment');
            $table->unsignedBigInteger('rated_by')->nullable()->after('rated_at');
            $table->foreign('rated_by')->references('id')->on('users')->onDelete('set null');
            $table->integer('response_time_rating')->nullable()->after('rated_by');
            $table->integer('resolution_quality_rating')->nullable()->after('response_time_rating');
            $table->integer('communication_rating')->nullable()->after('resolution_quality_rating');
            $table->boolean('would_recommend')->nullable()->after('communication_rating');
        });
    }

    public function down()
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropForeign(['rated_by']);
            $table->dropColumn([
                'rated_at',
                'rated_by', 
                'response_time_rating',
                'resolution_quality_rating',
                'communication_rating',
                'would_recommend'
            ]);
        });
    }
}; 