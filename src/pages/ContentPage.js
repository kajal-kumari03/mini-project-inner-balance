import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

const ContentPage = () => {
  const [content, setContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredContent(content);
    } else {
      setFilteredContent(
        content.filter((c) =>
          c.category.toLowerCase().includes(filter.toLowerCase())
        )
      );
    }
  }, [filter, content]);

  const fetchContent = async () => {
    try {
      const response = await axios.get(`${API_URL}/content`);
      setContent(response.data);
      setFilteredContent(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching content:', error);
      setLoading(false);
    }
  };

  const categories = [
    'all',
    'anxiety',
    'depression',
    'stress',
    'burnout',
    'relationship stress',
    'self-esteem',
    'postpartum',
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-beige">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-calm-blue text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-beige">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-calm-blue mb-6">
          Mental Health Resources
        </h1>
        <p className="text-gray-600 mb-6">
          Explore articles, exercises, and tips to support your mental wellness
          journey
        </p>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Filter by Category:
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === cat
                    ? 'bg-calm-blue text-white'
                    : 'bg-white text-gray-700 hover:bg-calm-green/20'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {selectedArticle ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <button
              onClick={() => setSelectedArticle(null)}
              className="text-calm-blue mb-4 hover:underline"
            >
              ← Back to Articles
            </button>
            <h2 className="text-3xl font-bold text-calm-blue mb-4">
              {selectedArticle.title}
            </h2>
            <p className="text-gray-600 mb-6">{selectedArticle.description}</p>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-calm-green mb-3">
                Exercises
              </h3>
              <ul className="list-disc list-inside space-y-2">
                {selectedArticle.exercises.map((exercise, index) => (
                  <li key={index} className="text-gray-700">
                    {exercise}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-calm-lavender mb-3">
                Tips
              </h3>
              <ul className="list-disc list-inside space-y-2">
                {selectedArticle.tips.map((tip, index) => (
                  <li key={index} className="text-gray-700">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {selectedArticle.scenarios && selectedArticle.scenarios.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-calm-blue mb-3">
                  Related Scenarios
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.scenarios.map((scenario, index) => (
                    <span
                      key={index}
                      className="bg-calm-green/20 text-calm-green px-3 py-1 rounded"
                    >
                      {scenario}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
                onClick={() => setSelectedArticle(article)}
              >
                <span className="inline-block bg-calm-green/20 text-calm-green px-3 py-1 rounded text-sm mb-3 capitalize">
                  {article.category}
                </span>
                <h3 className="text-xl font-bold text-calm-blue mb-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.description}
                </p>
                <button className="text-calm-blue hover:underline text-sm font-semibold">
                  Read More →
                </button>
              </div>
            ))}
          </div>
        )}

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No articles found for this category.
            </p>
          </div>
        )}

        <div className="mt-12 bg-gradient-to-r from-calm-blue to-calm-green rounded-lg shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Remember</h2>
          <p className="text-lg">
            Knowledge is power. Understanding your mental health is the first
            step towards healing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContentPage;


