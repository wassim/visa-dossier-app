import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import { DocumentUploadCard } from "~/components/document-upload-card";
import { createDossier } from "~/lib/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Visa Dossier Application" },
    { name: "description", content: "Upload your visa application documents" },
  ];
}

export default function Home() {
  const [dossierId, setDossierId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initDossier = async () => {
      const existingId = localStorage.getItem("dossierId");

      if (existingId) {
        setDossierId(existingId);
        setIsLoading(false);
      } else {
        try {
          const dossier = await createDossier();
          localStorage.setItem("dossierId", dossier.id);
          setDossierId(dossier.id);
        } catch (error) {
          console.error("Failed to create dossier:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initDossier();
  }, []);

  if (isLoading || !dossierId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 pt-6 pb-20 max-w-5xl">
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Visa Dossier App - Documents
          </h1>
          <span className="text-sm text-gray-500 font-mono">
            ID: {dossierId}
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <DocumentUploadCard
            title="Visa"
            description="Upload your completed national visa request form."
            dossierId={dossierId}
            type="visa"
          />

          <DocumentUploadCard
            title="Passport"
            description="Valid for at least 6 months from submission date."
            dossierId={dossierId}
            type="passport"
          />

          <DocumentUploadCard
            title="Supporting documents"
            description="Additional documents required for your application."
            dossierId={dossierId}
            type="supporting_document"
          />
        </div>
      </div>
    </div>
  );
}
