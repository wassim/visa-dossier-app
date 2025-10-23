<?php

use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\DossierController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/dossiers', [DossierController::class, 'store']);

Route::get('/dossiers/{dossier}/documents', [DocumentController::class, 'index']);
Route::post('/documents', [DocumentController::class, 'upload']);
Route::get('/documents/{document}/download', [DocumentController::class, 'download']);
Route::delete('/documents/{document}', [DocumentController::class, 'destroy']);
