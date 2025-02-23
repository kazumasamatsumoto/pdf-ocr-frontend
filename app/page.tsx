"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../src/firebase/config";
import Link from "next/link";

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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-12 text-center bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
          OCR Results
        </h1>

        {ocrResults.length === 0 ? (
          <div className="text-center text-gray-400">
            No OCR results found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ocrResults.map((result) => (
              <Link
                key={result.id}
                href={`/result/${result.id}`}
                className="group bg-gray-900 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-600/20"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white truncate group-hover:text-red-500 transition-colors">
                      {result.fileName}
                    </h2>
                    <span className="text-sm text-gray-400">
                      {result.timestamp?.toDate?.().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 line-clamp-3">
                      {result.text}
                    </p>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-800 group-hover:bg-gray-700 transition-colors">
                  <span className="text-red-500 group-hover:text-red-400 font-medium text-sm flex items-center">
                    View Details
                    <svg
                      className="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
