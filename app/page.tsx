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
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<OcrResult[]>([]);

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
        <h1 className="text-5xl font-bold text-white mb-8 text-center bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
          OCR Results
        </h1>

        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by file name..."
              value={searchQuery}
              onChange={(e) => {
                const query = e.target.value;
                setSearchQuery(query);
                const filtered = ocrResults.filter(result =>
                  result.fileName.toLowerCase().includes(query.toLowerCase())
                );
                setFilteredResults(filtered);
              }}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {(searchQuery ? filteredResults : ocrResults).length === 0 ? (
          <div className="text-center text-gray-400">
            No OCR results found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-800">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-red-500">File Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-red-500">Content Preview</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-red-500">Date</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-red-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {(searchQuery ? filteredResults : ocrResults).map((result) => (
                  <tr
                    key={result.id}
                    className="group bg-gray-900 bg-opacity-50 hover:bg-opacity-100 transition-all duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="text-white font-medium group-hover:text-red-500 transition-colors">
                        {result.fileName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-300 line-clamp-2 max-w-xl">
                        {result.text}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-400">
                        {result.timestamp?.toDate?.().toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/result/${result.id}`}
                        className="flex items-center justify-center text-red-500 group-hover:text-red-400 transition-colors"
                      >
                        <span className="mr-2">View Details</span>
                        <svg
                          className="w-4 h-4 transform transition-transform group-hover:translate-x-1"
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
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
