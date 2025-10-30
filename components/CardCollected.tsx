'use client';
import React from 'react';
import Image from 'next/image';

interface BookCardProps {
  path: string;
  name: string;
  description?: string;
}

const BookCard: React.FC<BookCardProps> = ({ path}) => {
  return ( 
        <div >
          <Image
            src={path}
            alt='book'
            width={160}
            height={240}
            className="object-contain"
            // style={{backgroundColor: 'red'}}
          />
        </div>
        );
};

export default BookCard;
