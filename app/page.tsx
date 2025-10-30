// import GameScene from '@/components/GameScene';
import Stage from '@/components/Statge';
import BookCard from '@/components/Card';
import React, { JSX } from 'react';

export default function Home(): JSX.Element {
  
  return (
    <main>
      {/* <GameScene /> */}
      <Stage />
      {/* <BookCard path={'/background.jpg'} name={'ดาบวิเศษ ✨'} /> */}
    </main>
  );
}