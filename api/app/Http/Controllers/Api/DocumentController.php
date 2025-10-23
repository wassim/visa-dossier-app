<?php

namespace App\Http\Controllers\Api;

use App\Enums\DocumentType;
use App\Http\Controllers\Controller;
use App\Http\Requests\UploadDocumentRequest;
use App\Http\Resources\DocumentResource;
use App\Models\Document;
use App\Models\Dossier;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentController extends Controller
{
    public function index(Dossier $dossier): JsonResponse
    {
        /** @var \Illuminate\Database\Eloquent\Collection<int, Document> $allDocuments */
        $allDocuments = $dossier->documents()
            ->orderBy('created_at', 'desc')
            ->get();

        /** @var \Illuminate\Support\Collection<string, \Illuminate\Support\Collection<int, Document>> $documents */
        $documents = $allDocuments->groupBy('type.value');

        $grouped = [];
        foreach (DocumentType::cases() as $type) {
            $typeValue = $type->value;
            $grouped[$typeValue] = DocumentResource::collection(
                $documents->get($typeValue, collect())
            );
        }

        return response()->json([
            'data' => $grouped,
        ]);
    }

    public function upload(UploadDocumentRequest $request): JsonResponse
    {
        try {
            $file = $request->file('file');
            $extension = $file->getClientOriginalExtension();
            $uuid = Str::uuid();
            $fileName = "{$uuid}.{$extension}";
            $filePath = "documents/{$fileName}";

            Storage::putFileAs('documents', $file, $fileName);

            $document = Document::create([
                'dossier_id' => $request->input('dossier_id'),
                'type' => $request->input('type'),
                'file_name' => $fileName,
                'original_name' => $file->getClientOriginalName(),
                'file_path' => $filePath,
                'file_size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
            ]);

            return (new DocumentResource($document))
                ->response()
                ->setStatusCode(201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to upload document.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function download(Document $document): StreamedResponse|JsonResponse
    {
        try {
            if (! Storage::exists($document->file_path)) {
                return response()->json([
                    'message' => 'File not found.',
                ], 404);
            }

            return Storage::download($document->file_path, $document->file_name);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to download document.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Document $document): JsonResponse
    {
        try {
            if (Storage::exists($document->file_path)) {
                Storage::delete($document->file_path);
            }

            $document->delete();

            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete document.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
