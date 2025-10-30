'use client';
import React from 'react';
import Image from 'next/image';

interface BookCardProps {
  path: string;
  name: string;
  description?: string;
}

const BookCard: React.FC<BookCardProps> = ({ path, name, description }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {/* 📄 Main image ขยายใหญ่ขึ้น */}
      <div className="relative w-[90vw] max-w-[600px] aspect-[3/2]">
        <Image
          src={path}
          alt={name}
          fill
          className="object-contain"
        />
      </div>

      {/* 🏷️ Description text */}
      {description && (
        <p className="mt-3 text-center text-gray-800 font-semibold text-base sm:text-lg">
          {/* {description} */}
        </p>
      )}
    </div>
  );
};

export default BookCard;