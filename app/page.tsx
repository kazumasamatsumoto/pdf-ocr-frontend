"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../src/firebase/config";

interface OcrResult {
  id: string;
  text: string;
  timestamp: any;
  fileName: string;
}

export default function Home() {
  const [ocrResults, setOcrResults] = useState<OcrResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOcrResults = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ocr-result"));
        const results = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as OcrResult[];

        // Sort by timestamp in descending order
        results.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds);
        setOcrResults(results);
      } catch (error) {
        console.error("Error fetching OCR results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOcrResults();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
          OCR Results
        </h1>

        {ocrResults.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400">
            No OCR results found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ocrResults.map((result) => (
              <div
                key={result.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white truncate">
                      {result.fileName}
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {result.timestamp?.toDate?.().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                      {result.text}
                    </p>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                  <button
                    onClick={() =>
                      window.open(`/result/${result.id}`, "_blank")
                    }
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors duration-200"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
