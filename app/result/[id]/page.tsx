"use client";

import { useEffect, useState } from "react";
import React from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../src/firebase/config";
import { useRouter } from "next/navigation";

interface OcrResult {
  id: string;
  imageUrl: string;
  downloadUrl: string;
  fileName: string;
  contentType: string;
  userName: string;
  documentName: string;
  facilityName: string;
  date: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export default function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOcrResult = async () => {
      try {
        const docRef = doc(db, "ocr-result", resolvedParams.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setOcrResult({
            id: docSnap.id,
            ...docSnap.data(),
          } as OcrResult);
        }
      } catch (error) {
        console.error("Error fetching OCR result:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOcrResult();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!ocrResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Result not found</h1>
          <button
            onClick={() => router.push("/")}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/")}
            className="text-red-600 hover:text-red-700 font-medium mb-6 flex items-center"
          >
            ← Back to Home
          </button>
          <h1 className="text-4xl font-bold mb-2">{ocrResult.fileName}</h1>
          <p className="text-gray-400">
            {new Date(ocrResult.createdAt._seconds * 1000).toLocaleString()}
          </p>
        </div>

        {/* Content */}
        <div className="bg-gray-900 rounded-lg p-8 shadow-2xl">
          <div className="prose prose-lg prose-invert max-w-none">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-gray-400">User Name</h3>
                  <p className="text-white">{ocrResult.userName}</p>
                </div>
                <div>
                  <h3 className="text-gray-400">Document Name</h3>
                  <p className="text-white">{ocrResult.documentName}</p>
                </div>
                <div>
                  <h3 className="text-gray-400">Facility Name</h3>
                  <p className="text-white">{ocrResult.facilityName}</p>
                </div>
                <div>
                  <h3 className="text-gray-400">Date</h3>
                  <p className="text-white">{ocrResult.date}</p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-gray-400 mb-2">Document Preview</h3>
                <iframe
                  src={ocrResult.imageUrl}
                  className="w-full h-[600px] rounded-lg"
                  title="PDF Preview"
                />
              </div>
              <div className="mt-4">
                <a
                  href={ocrResult.downloadUrl}
                  className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
