const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const getHeaders = () => ({
  "Accept": "application/json",
  "X-Requested-With": "XMLHttpRequest",
});

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    if (response.status === 422 && error.errors) {
      const firstError = Object.values(error.errors)[0];
      throw new Error(Array.isArray(firstError) ? firstError[0] : error.message);
    }

    throw new Error(error.message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null;
  }

  return response.json();
}

export interface Document {
  id: string;
  dossier_id: string;
  type: string;
  original_name: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  created_at: string;
  updated_at: string;
}

export interface Dossier {
  id: string;
  created_at: string;
  updated_at: string;
}

export async function createDossier(): Promise<Dossier> {
  const response = await fetch(`${API_URL}/dossiers`, {
    method: "POST",
    headers: {
      ...getHeaders(),
      "Content-Type": "application/json",
    },
  });

  const data = await handleResponse(response);
  return data.data;
}

export async function uploadDocument(
  dossierId: string,
  type: string,
  file: File
): Promise<Document> {
  const formData = new FormData();
  formData.append("dossier_id", dossierId);
  formData.append("type", type);
  formData.append("file", file);

  const response = await fetch(`${API_URL}/documents`, {
    method: "POST",
    headers: getHeaders(),
    body: formData,
  });

  const data = await handleResponse(response);
  return data.data;
}

export async function getDocuments(dossierId: string): Promise<{
  visa: Document[];
  passport: Document[];
  supporting_document: Document[];
}> {
  const response = await fetch(`${API_URL}/dossiers/${dossierId}/documents`, {
    headers: getHeaders(),
  });

  const data = await handleResponse(response);
  return data.data;
}

export async function deleteDocument(documentId: string): Promise<void> {
  const response = await fetch(`${API_URL}/documents/${documentId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  await handleResponse(response);
}
