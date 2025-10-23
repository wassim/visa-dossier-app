import { useState } from "react";
import { Plus, X, FileText, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  uploadDocument,
  deleteDocument,
  getDocuments,
  type Document,
} from "~/lib/api";

interface DocumentUploadCardProps {
  title: string;
  description: string;
  dossierId: string;
  type: string;
  acceptedTypes?: string;
  maxSize?: string;
}

export function DocumentUploadCard({
  title,
  description,
  dossierId,
  type,
  acceptedTypes = "PDF, JPG, PNG",
  maxSize = "4MB",
}: DocumentUploadCardProps) {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: allDocuments } = useQuery({
    queryKey: ["documents", dossierId],
    queryFn: () => getDocuments(dossierId),
  });

  const documents = allDocuments?.[type as keyof typeof allDocuments] || [];

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadDocument(dossierId, type, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", dossierId] });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (documentId: string) => deleteDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", dossierId] });
    },
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    setError(null);

    for (const file of Array.from(selectedFiles)) {
      await uploadMutation.mutateAsync(file);
    }

    event.target.value = "";
  };

  const handleRemove = (documentId: string) => {
    deleteMutation.mutate(documentId);
  };

  return (
    <Card className="w-full shadow-none">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              {documents.length > 0 && (
                <span className="px-2 py-1 text-xs text-gray-500 rounded-md border border-gray-200 bg-gray-100">
                  {documents.length} file(s)
                </span>
              )}
            </div>
            <CardDescription className="mt-1 text-sm text-gray-600">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {documents.length > 0 && (
          <div className="space-y-2">
            {documents.map((doc: Document) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
              >
                {doc.mime_type.startsWith("image/") ? (
                  <img
                    src={`${import.meta.env.API_URL || "http://127.0.0.1:8000/api"}/documents/${doc.id}/download`}
                    alt={doc.original_name}
                    className="h-12 w-12 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-200">
                    <FileText className="h-6 w-6 text-gray-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {doc.original_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(doc.id)}
                  disabled={deleteMutation.isPending}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="relative">
          <input
            type="file"
            id={`file-${title.replace(/\s+/g, "-")}`}
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg"
            multiple
            onChange={handleFileChange}
            disabled={uploadMutation.isPending}
          />
          <label
            htmlFor={`file-${title.replace(/\s+/g, "-")}`}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 transition-colors hover:border-gray-400 hover:bg-gray-100 ${
              uploadMutation.isPending ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-gray-600" />
                <p className="mt-4 text-sm font-medium text-gray-700">
                  Uploading...
                </p>
              </>
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-gray-400">
                  <Plus className="h-6 w-6 text-gray-600" />
                </div>
                <p className="mt-4 text-sm font-medium text-gray-700">
                  Click to upload
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {acceptedTypes} (max. {maxSize})
                </p>
              </>
            )}
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
