'use client';

import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import Link from 'next/link';

export default function Search({ articles }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [fuse, setFuse] = useState(null);

  useEffect(() => {
    // Initialize Fuse.js with search options
    const fuseInstance = new Fuse(articles, {
      keys: [
        { name: 'title', weight: 2 },
        { name: 'description', weight: 1.5 },
        { name: 'tags', weight: 1 },
        { name: 'content', weight: 0.5 }
      ],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 2
    });
    setFuse(fuseInstance);
  }, [articles]);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    
    if (!searchQuery.trim() || !fuse) {
      setResults([]);
      return;
    }

    const searchResults = fuse.search(searchQuery);
    setResults(searchResults.slice(0, 10)); // Limit to 10 results
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search articles... (e.g., 'react hooks', 'nginx', 'deployment')"
          className="w-full px-4 py-3 pr-10 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
        />
        <svg
          className="absolute right-3 top-3.5 w-6 h-6 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Search Results */}
      {query && (
        <div className="mt-4 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {results.map(({ item, score }) => (
                <li key={item.slug}>
                  <Link
                    href={`/articles/${item.slug}`}
                    className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        {item.tags && item.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {item.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="ml-4 text-xs text-gray-400">
                        {Math.round((1 - score) * 100)}% match
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}

      {/* Search Tips */}
      {!query && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Try searching for: "react", "deployment", "nginx", "mongodb", etc.
        </div>
      )}
    </div>
  );
}
