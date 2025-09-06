import React, { useState } from 'react';
import { topicResources } from '../data/conceptNotesData';

const ResourcesButton = ({ topic }) => {
  const [showResources, setShowResources] = useState(false);
  const resources = topicResources[topic];

  if (!resources) return null;

  return (
    <div className="resources-section mb-4">
      <button
        onClick={() => setShowResources(!showResources)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        Learning Resources
        <svg 
          className={`w-4 h-4 transition-transform ${showResources ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showResources && (
        <div className="mt-4 bg-gray-50 rounded-lg p-4 border">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Videos Section */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Video Tutorials
              </h4>
              <div className="space-y-2">
                {resources.videos?.map((video, index) => (
                  <a
                    key={index}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 bg-white rounded border hover:bg-blue-50 transition-colors"
                  >
                    <div className="font-medium text-sm text-blue-700">{video.title}</div>
                    <div className="text-xs text-gray-500">{video.duration}</div>
                  </a>
                ))}
              </div>
            </div>

            {/* Articles Section */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Articles & Tutorials
              </h4>
              <div className="space-y-2">
                {resources.articles?.map((article, index) => (
                  <a
                    key={index}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 bg-white rounded border hover:bg-green-50 transition-colors"
                  >
                    <div className="font-medium text-sm text-green-700">{article.title}</div>
                  </a>
                ))}
              </div>
            </div>

            {/* Practice Section */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Practice Problems
              </h4>
              <div className="space-y-2">
                {resources.practice?.map((practice, index) => (
                  <a
                    key={index}
                    href={practice.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 bg-white rounded border hover:bg-purple-50 transition-colors"
                  >
                    <div className="font-medium text-sm text-purple-700">{practice.title}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesButton;