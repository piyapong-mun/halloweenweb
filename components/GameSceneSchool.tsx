'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import BookCard from './Card';
import Arrow from './Arrow';
import { useRef } from 'react';

// --- ค่าคงที่ต่างๆ (เหมือนเดิม) ---
const IMAGE_WIDTH = 1024;
const IMAGE_HEIGHT = 1024;

interface HiddenItem {
  id: number;
  top: number;
  left: number;
  image_path: string;
  item_type: 'normal' | 'special';
  width: number;
  height: number;
}

interface arrowElement {
  navigate: {
    navigate_func: (navigate_func: number) => void;
    navigate_to: number;
  };
  custom_image: string;
  rotation: { x: number; y: number };
  width: number;
  height: number;
  top: number;
  left: number;
}

// A function to get N random items from an array
function getRandomItems(arr: any[], n: number): any[] {
  // Create a copy of the array to avoid modifying the original
  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  // Return the first n items
  return shuffled.slice(0, n);
}

function getRandomHiddenItems(hiddenItems: HiddenItem[]): HiddenItem {
  const randomIndex = Math.floor(Math.random() * hiddenItems.length);
  return hiddenItems[randomIndex];
}

interface CardObject {
  path: string;
  name: string;
  score: number;
  description: string;
  id: number;
}

// const possibleRewards: string[] = ['ดาบวิเศษ ✨', 'โล่ในตำนาน 🛡️', 'ยาเพิ่มพลัง 🧪', 'แผนที่สมบัติ 🗺️', 'ทอง 100G 💰'];
const possibleCard: CardObject[] = [
  { path: '/common/0.png', name: 'ดาบวิเศษ ✨', score: 100, description: 'ได้รับ +100 คะแนน!', id: 0 },
  { path: '/common/1.png', name: 'โล่ในตำนาน 🛡️', score: 80, description: 'ได้รับ +80 คะแนน!', id: 1 },
  { path: '/common/2.png', name: 'ยาเพิ่มพลัง 🧪', score: 80, description: 'ได้รับ +80 คะแนน!', id: 2 },
  { path: '/common/3.png', name: 'แผนที่สมบัติ 🗺️', score: 60, description: 'ได้รับ +60 คะแนน!', id: 3 },
  { path: '/common/4.png', name: 'ทอง 100G 💰', score: 100, description: 'ได้รับ +100 คะแนน!', id: 4 }
];

const possibleRareCard: CardObject[] = [...possibleCard,
// { path: '/images/ดาบวิเศษ.png', name: 'ดาบวิเศษ ✨', score: 200, description: 'ได้รับ ดาบวิเศษ ✨ +200 คะแนน!', id: 5 },
// { path: '/images/โล่ในตำนาน.png', name: 'โล่ในตำนาน 🛡️', score: 250, description: 'ได้รับ โล่ในตำนาน 🛡️ +250 คะแนน!', id: 6 },
];


// --- [เพิ่ม] สร้าง Audio object นอก Component เพื่อประสิทธิภาพที่ดีกว่า ---
// เราสร้างไว้ตรงนี้เพื่อไม่ให้มันถูกสร้างใหม่ทุกครั้งที่ re-render
const foundSound = typeof window !== 'undefined' ? new Audio('/sounds/found.mp3') : null;

interface GameSceneProps {
  navigate: (navigate_func: number) => void;
  start: boolean;
  setStart: (start: boolean) => void;
  addCard: (id: number | null) => void;
  foundItems: number[];
  setFoundItems: React.Dispatch<React.SetStateAction<number[]>>;
  score: number
}

const GameScene: React.FC<GameSceneProps> = ({ navigate, start, setStart, addCard ,foundItems, setFoundItems, score}: GameSceneProps) => {
  // const [foundItems, setFoundItems] = useState<number[]>([]);
  const [lastReward, setLastReward] = useState<any>(null);
  const [hiddenItems, setHiddenItems] = useState<HiddenItem[]>([]);
  const [Arrows, setArrows] = useState<arrowElement[]>([]);
  const targetRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true); // [New] Add loading state

  // Random hidden item
  useEffect(() => {
    const hiddenItemsData: HiddenItem[] = [
      { id: 29, top: 700, left: 450, image_path: '/backdoterm.png', item_type: 'normal', width: 60, height: 60 },
      { id: 30, top: 350, left: 460, image_path: '/backdoterm.png', item_type: 'normal', width: 60, height: 60 },
      { id: 31, top: 80, left: 680, image_path: '/backdoterm.png', item_type: 'normal', width: 60, height: 60 },
      { id: 32, top: 700, left: 100, image_path: '/backdoterm.png', item_type: 'normal', width: 60, height: 60 },
      { id: 33, top: 700, left: 800, image_path: '/backdoterm.png', item_type: 'normal', width: 60, height: 60 },
      // { id: 6, top: 600, left: 260, image_path: '/book.png', item_type: 'normal', width: 60, height: 60 },
      // { id: 7, top: 720, left: 640, image_path: '/book.png', item_type: 'normal', width: 60, height: 60 },
      // { id: 8, top: 520, left: 740, image_path: '/book.png', item_type: 'normal', width: 60, height: 60 },
    ];
    setHiddenItems(getRandomItems(hiddenItemsData, 8));
  }, []);

  // Load Arrow
  useEffect(() => {
    const arrowElement : arrowElement[] = [
     { navigate: { navigate_func: navigate, navigate_to: 2 }, custom_image: "/backarrow.png",  rotation: { x:0, y:0 },  width : 50, height :50, top: 950, left: 470 },
    //  { navigate: { navigate_func: navigate, navigate_to: 1 }, custom_image: "/rightarrow.png",  rotation: { x:0, y:0 },  width : 50, height :50, top: 580, left: 850 },
    //  { navigate: { navigate_func: navigate, navigate_to: 1 }, custom_image: "/rightuparrow.png",  rotation: { x:0, y:0 },  width : 50, height :50, top: 850, left: 800 },

    ]
    setArrows(arrowElement)
  }, []);

    // [New] This function runs when the background image has loaded
  const handleImageLoad = () => {
    // 1. Scroll to the target element.
    // We use 'auto' because the scroll is hidden by the black screen.
    // This is instant and feels faster than 'smooth'.
    if (targetRef.current) {
      targetRef.current.scrollIntoView({
        behavior: 'auto', // 'auto' is instant
        block: 'center',
      });
    }
    // 2. Set loading to false, which will trigger the fade-out
    setIsLoading(false);
  };

  const handleItemClick = (itemId: number, item_type: string = 'normal') => {
    if (!foundItems.includes(itemId)) {
      let reward;
      foundSound?.play(); // ใช้ Audio object ที่สร้างไว้

      // ตรวจสอบว่าไอเท็มนี้เป็นไอเท็มพิเศษหรือไม่
      if (item_type === 'special') {
        setFoundItems([...foundItems, itemId]);
        reward = possibleCard[Math.floor(Math.random() * possibleRareCard.length)];
        addCard(reward.id);
      }
      else {
        setFoundItems([...foundItems, itemId]);
        reward = possibleCard[Math.floor(Math.random() * possibleCard.length)];
        addCard(reward.id);
      }

      setLastReward(reward);
      setTimeout(() => setLastReward(null), 3000);
    }

  };

  return (
    <>


      <div style={{
        width: '100vw',
        height: '100vh',
        overflow: 'auto',
        cursor: 'grab',
        backgroundColor: '#111'
      }}>
        <div style={{
          position: 'relative',
          width: `${IMAGE_WIDTH}px`,
          height: `${IMAGE_HEIGHT}px`,
          margin: 'auto',
        }}>
          <Image
            src="/school.jpg"
            alt="Scrollable Game Background"
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            quality={100}
            priority
            style={{ display: 'block' }}
            // [New] Add the onLoad handler here
            onLoad={handleImageLoad}
          />

          <div ref={targetRef} className='Center Element'
            style={
              {
                position: 'absolute',
                top: '600px',
                left: '800px',
              }
            }
          ></div>

          {start &&
            (<>
              {/* <audio src="/sounds/lamp_spark.mp3" autoPlay loop hidden /> */}
              <audio src="/sounds/bgm.mp3" autoPlay loop hidden />

              {/* ของที่ซ่อนอยู่ (เหมือนเดิม) */}
              {hiddenItems.map(item => {
                const isFound = foundItems.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item.id, item.item_type)}
                    style={{
                      position: 'absolute',
                      top: `${item.top}px`,
                      left: `${item.left}px`,
                      zIndex: 2,
                      cursor: 'pointer',
                      transform: isFound ? 'scale(1.25)' : 'scale(1)',
                      transition: 'transform 0.3s ease',
                      opacity: isFound ? 0.8 : 0
                    }}
                  >
                    <Image src={item.image_path} alt="Hidden Item" width={item.width} height={item.height} />
                  </div>
                );
              })}

              {/* Load Arrow */}
              {Arrows.map((arrow, index) => (
                <div
                  key={index}
                  style={{
                    position: 'absolute',
                    top: `${arrow.top}px`,
                    left: `${arrow.left}px`,
                    zIndex: 2,
                    cursor: 'pointer',
                    transform: 'scale(1)',
                    transition: 'transform 0.3s ease',
                  }}
                >
                <Arrow
                  key={index}
                  navigate={arrow.navigate}
                  custom_image={arrow.custom_image}
                  rotation={arrow.rotation}
                  width={arrow.width}
                  height={arrow.height}
                />
                </div>
              ))}
            </>)
          }
        </div>
      </div>

      {/* UI ที่ลอยอยู่บนหน้าจอ (เหมือนเดิม) */}
      <>
        {lastReward && (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        width: 'auto',
        height: 'auto',
      }}
    >
      <BookCard
        path={lastReward.path}
        name={lastReward.name}
        description={lastReward.description}
      />
    </div>
  )}
        <div style={{
          position: 'fixed', top: '20px', left: '20px',
          backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: '10px 15px',
          borderRadius: '10px', fontSize: '1rem', zIndex: 10,
        }}>
          คะแนน: {score}
        </div>
        {/* <button
          onClick={() => {
          }}
          style={{
            position: 'fixed',
            top: '80px',
            left: '20px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '10px',
            fontSize: '1rem',
            zIndex: 10,
          }}
        >
          ดูสมุดสะสม
        </button> */}
        {!start && (
        <button onClick={() => setStart(true)} className="start-button"
          style={{ position: 'fixed', top: '50%', left: '50%', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: '10px 15px', borderRadius: '10px', fontSize: '1rem', zIndex: 10 }}>เริ่มเกม</button>
          )}
      </>

    </>
  );
};

export default GameScene;