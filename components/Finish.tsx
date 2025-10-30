'use client';

import React, { useState } from 'react';
import Card from './CardCollected';

interface Card {
  id: number;
  count: number; // จำนวนที่ผู้เล่นสะสม

}

interface CollectionProps {
  cards: Card[];
    score: number;
}

const CARDS_PER_PAGE = 6; // ปรับน้อยลงสำหรับมือถือ

const Collection: React.FC<CollectionProps> = ({ cards, score }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(cards.length / CARDS_PER_PAGE);

  const paginatedCards = cards.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="p-4 bg-black min-h-screen text-white flex flex-col items-start" >
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center w-full">การ์ดของคุณ</h1>
      <h2>คะแนน: {score}</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 justify-end w-full" >
        {paginatedCards.map((card) => (
          <div key={card.id} className="relative">
            <Card path={`/common/${card.id}.png`} name="การ์ด" />
            <span className="absolute top-1 right-1 bg-white text-black rounded-full px-2 py-0.5 text-xs font-bold shadow">
              x{card.count}
            </span>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-3 w-full">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg text-white font-medium ${
            currentPage === 1 ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Prev
        </button>
        <span className="text-sm sm:text-base font-medium mx-2">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg text-white font-medium ${
            currentPage === totalPages ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Collection;
