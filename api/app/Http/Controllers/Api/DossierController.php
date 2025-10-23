<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DossierResource;
use App\Models\Dossier;
use Illuminate\Http\JsonResponse;

class DossierController extends Controller
{
    public function store(): JsonResponse
    {
        try {
            $dossier = Dossier::create();

            return (new DossierResource($dossier))
                ->response()
                ->setStatusCode(201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create dossier.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
