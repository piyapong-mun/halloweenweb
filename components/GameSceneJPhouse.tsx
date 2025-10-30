'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import BookCard from './Card';
import Arrow from './Arrow';
import { useRef } from 'react';

// --- ค่าคงที่ต่างๆ ---
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

// รายการรางวัล
const possibleCard: Object[] = [
  { path: '/images/ดาบวิเศษ.png', name: 'ดาบวิเศษ ✨', score: 100, description: 'ได้รับ ดาบวิเศษ ✨ +100 คะแนน!' },
  { path: '/images/โล่ในตำนาน.png', name: 'โล่ในตำนาน 🛡️', score: 80, description: 'ได้รับ โล่ในตำนาน 🛡️ +80 คะแนน!' },
  { path: '/images/ยาเพิ่มพลัง.png', name: 'ยาเพิ่มพลัง 🧪', score: 80, description: 'ได้รับ ยาเพิ่มพลัง 🧪 +80 คะแนน!' },
  { path: '/images/แผนที่สมบัติ.png', name: 'แผนที่สมบัติ 🗺️', score: 60, description: 'ได้รับ แผนที่สมบัติ 🗺️ +60 คะแนน!' },
  { path: '/images/ทอง.png', name: 'ทอง 100G 💰', score: 100, description: 'ได้รับ ทอง 100G 💰 +100 คะแนน!' }
];

const possibleRareCard: Object[] = [...possibleCard,
{ path: '/images/ดาบวิเศษ.png', name: 'ดาบวิเศษ ✨', score: 200, description: 'ได้รับ ดาบวิเศษ ✨ +200 คะแนน!' },
{ path: '/images/โล่ในตำนาน.png', name: 'โล่ในตำนาน 🛡️', score: 250, description: 'ได้รับ โล่ในตำนาน 🛡️ +250 คะแนน!' },
];

// สร้าง list คำถาม
const questions = [
  { id: 'q1', text: '1. หากท่านนึกถือสีตัวละครที่ชอบในเทศกาลฮาโลวีน ท่านนึกถึงสีอะไร', options: ['สีเขียว สีฟ้า สีเทา', 'ดำ ขาว แดง', 'ส้ม ฟ้า แดง ขาว'] },
  { id: 'q2', text: '2. หากถึงนึกเทศกาลที่ชอบท่านจะเลือกฤดูอะไร', options: ['ฤดูฝน', 'ฤดูหนาว', 'ฤดูร้อน'] },
  { id: 'q3', text: '3. เลือก 1 ข้อจากตัวละครที่ท่านชอบ', options: ['เออรอล', 'ซินเนทเทียร์', 'ลิเลีย'] },
  { id: 'q4', text: '4. หากท่านต้องทานอาหารที่มีตรงหน้าท่านเลือกทานอันไหน', options: ['สมอง', 'เลือด', 'คน'] },
  { id: 'q5', text: '5. หากเดินไปถึงดอกไม้ทุ่งดอกไม้ตรงหน้าคือดอกไม้ชนิดใด', options: ['Hydrangea', 'Higanbana', 'Foxglove'] },
  { id: 'q6', text: '6. ท่านมีความเชื่อเเบบใด', options: ['วิทยาศาสตร์', 'พระพุทธเจ้า', 'พระเจ้า'] },
  { id: 'q7', text: '7. หากท่านนึกถึงสัตว์คู่ใจท่านจะเลือกสัตว์ชนิดใด', options: ['หมา', 'แมว', 'จิ้งจอก'] },
  { id: 'q8', text: '8. เมื่อท่านพบคูเดตครั้งเเรกท่านจะสนทนาเเบบใด', options: ['พูดไม่รู้เรื่อง', 'พูดสร้างความประทับใจที่ดี', 'พูดจาล่อลวงเจ้าสเนห์'] },
  { id: 'q9', text: '9. หากเดินไปถึงประตูบานนึงท่านคิดว่าหลังประตูจะเป็นสถานที่ใด', options: ['โรงพยาบาลร้าง', 'ศาลเจ้า', 'โบสถ์', 'ถนน'] },

];

// สร้าง Audio object นอก Component
const foundSound = typeof window !== 'undefined' ? new Audio('/sounds/found.mp3') : null;

interface GameSceneProps {
  navigate: (navigate_func: number) => void;
  start: boolean;
  setStart: (start: boolean) => void;
  score: number
}

const GameScene: React.FC<GameSceneProps> = ({ navigate, start, setStart, score }: GameSceneProps) => {
  const [foundItems, setFoundItems] = useState<number[]>([]);
  const [lastReward, setLastReward] = useState<any>(null);
  const [hiddenItems, setHiddenItems] = useState<HiddenItem[]>([]);
  const [Arrows, setArrows] = useState<arrowElement[]>([]);
  const [hiddenPaths, setHiddenPaths] = useState<number>(0);
  const targetRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true); // [New] Add loading state

  // State สำหรับ Modal คำถาม
  const [showQuestionModal, setShowQuestionModal] = useState<boolean>(false);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '', q9: '',
  });
  
  // [เพิ่ม] State สำหรับหน้าคำถาม
  const [currentPage, setCurrentPage] = useState(0); // 0 คือหน้าแรก

  // Random hidden item
  useEffect(() => {
    const hiddenItemsData: HiddenItem[] = [
      // { id: 1, top: 700, left: 450, image_path: '/book.png', item_type: 'normal', width: 60, height: 60 },
      // { id: 2, top: 350, left: 460, image_path: '/book.png', item_type: 'normal', width: 60, height: 60 },
      // { id: 3, top: 80, left: 680, image_path: '/book.png', item_type: 'normal', width: 60, height: 60 },
      // { id: 4, top: 700, left: 100, image_path: '/book.png', item_type: 'normal', width: 60, height: 60 },
      // { id: 5, top: 700, left: 800, image_path: '/book.png', item_type: 'normal', width: 60, height: 60 },
      // { id: 6, top: 600, left: 260, image_path: '/book.png', item_type: 'normal', width: 60, height: 60 },
      // { id: 7, top: 720, left: 640, image_path: '/book.png', item_type: 'normal', width: 60, height: 60 },
      // { id: 8, top: 520, left: 740, image_path: '/book.png', item_type: 'normal', width: 60, height: 60 },
    ];
    setHiddenItems(getRandomItems(hiddenItemsData, 8));
  }, []);

  // Load Arrow
  useEffect(() => {
    if (hiddenPaths === 0) return;
    if (hiddenPaths === 1) {
      const arrowElement: arrowElement[] = [
      { navigate: { navigate_func: navigate, navigate_to: 9 }, custom_image: "/rightarrow.png", rotation: { x: 0, y: 0 }, width: 50, height: 50, top: 600, left: 820 },
      ]
      setArrows(arrowElement)
    }else if (hiddenPaths === 2) {
      const arrowElement: arrowElement[] = [
      { navigate: { navigate_func: navigate, navigate_to: 7 }, custom_image: "/leftarrow.png", rotation: { x: 0, y: 0 }, width: 50, height: 50, top: 620, left: 80 },
      ]
      setArrows(arrowElement)
    }else if (hiddenPaths === 3) {
      const arrowElement: arrowElement[] = [
      { navigate: { navigate_func: navigate, navigate_to: 8 }, custom_image: "/rightarrow.png", rotation: { x: 0, y: 0 }, width: 50, height: 50, top: 600, left: 820 },
      ]
      setArrows(arrowElement)
    }else if (hiddenPaths === 4) {
      const arrowElement: arrowElement[] = [
      { navigate: { navigate_func: navigate, navigate_to: 10 }, custom_image: "/rightarrow.png", rotation: { x: 0, y: 0 }, width: 50, height: 50, top: 600, left: 820 },
      ]
      setArrows(arrowElement)
    }
    
  }, [hiddenPaths, navigate]); // [Fix] Add navigate to dependency array

  useEffect(() => {
    if(start) {
      setShowQuestionModal(true);
    }else {
      setShowQuestionModal(false);
    }
  },[])

  // // TEST Environment
  // useEffect (() => {
  //   setShowQuestionModal(false);
  //   setHiddenPaths(2);
  //   // setStart(true);
  // },[1000])

  // [New] This function runs when the background image has loaded
  const handleImageLoad = () => {
    // 1. Scroll to the target element.
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
    if (lastReward || showQuestionModal) return;

    if (!foundItems.includes(itemId)) {
      let reward;
      foundSound?.play();

      if (item_type === 'special') {
        setFoundItems([...foundItems, itemId]);
        reward = possibleCard[Math.floor(Math.random() * possibleRareCard.length)];
      }
      else {
        setFoundItems([...foundItems, itemId]);
        reward = possibleCard[Math.floor(Math.random() * possibleCard.length)];
      }
      setLastReward(reward);
      setTimeout(() => {
        setLastReward(null);
      }, 3000);
    }
  };

  // Function สำหรับอัปเดตคำตอบ
  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  // [เพิ่ม] Function สำหรับปุ่ม 'ไปต่อ'
  const handleNext = () => {
    const currentQuestionId = questions[currentPage].id;
    // ตรวจสอบว่าตอบคำถามปัจจุบันหรือยัง
    if (answers[currentQuestionId] === '') {
      alert('กรุณาเลือกคำตอบ');
      return;
    }
    // ไปหน้าถัดไป
    setCurrentPage(prevPage => prevPage + 1);
  };

  // [เพิ่ม] Function สำหรับปุ่ม 'ย้อนกลับ'
  const handleBack = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  // Function สำหรับจัดการการส่งฟอร์มคำถาม
  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 

    // ตรวจสอบว่าตอบครบทุกข้อหรือไม่ (เผื่อไว้)
    const allAnswered = Object.values(answers).every(answer => answer !== '');
    if (!allAnswered) {
      alert('กรุณาตอบคำถามให้ครบทุกข้อ');
      return;
    }

    // console.log('คำตอบที่ส่ง:', answers);
    if (answers.q9 === "โรงพยาบาลร้าง") {
      setHiddenPaths(1);
    }else if (answers.q9 === "ศาลเจ้า") {
      setHiddenPaths(2);
    }else if (answers.q9 === "โบสถ์") {
      setHiddenPaths(3);
    }else if (answers.q9 === "ถนน") {
      setHiddenPaths(4);
    }

    // ปิด Modal และเคลียร์คำตอบ
    setAnswers({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '', q9: '',});
    setShowQuestionModal(false);
    setStart(true);
    
    // [แก้ไข] รีเซ็ตหน้ากลับไปที่ 0
    setCurrentPage(0); 
  };

  // [เพิ่ม] ตัวแปรสำหรับคำนวณใน JSX
  const currentQuestion = questions[currentPage];
  const isLastPage = currentPage === questions.length - 1;
  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  };

  return (
    <>
      {/* Loading Overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'black',
        zIndex: 100,
        opacity: isLoading ? 1 : 0,
        pointerEvents: isLoading ? 'auto' : 'none',
        transition: 'opacity 0.5s ease-in-out',
      }} />

      <div style={{
        width: '100vw',
        height: '100vh',
        overflow: 'auto',
        cursor: 'grab',
        backgroundColor: '#111',
        opacity: isLoading ? 0 : 1, // Content invisible while loading
        transition: 'opacity 0.2s ease-in-out',
      }}>
        <div style={{
          position: 'relative',
          width: `${IMAGE_WIDTH}px`,
          height: `${IMAGE_HEIGHT}px`,
          margin: 'auto',
        }}>
          <Image
            src="/japanesehouse.jpg"
            alt="Scrollable Game Background"
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            quality={100}
            priority
            style={{ display: 'block' }}
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
              <audio src="/sounds/bgm.mp3" autoPlay loop hidden />
              {/* ของที่ซ่อนอยู่ */}
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
                      transition: 'transform 0.3s ease, opacity 0.3s ease', // [Edit] Add opacity transition
                      // [FIXED] Opacity was 0.2 (invisible) before.
                      // Now it's 1 (visible) and fades to 0.2 when found.
                      opacity: isFound ? 0.2 : 1 
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

      {/* UI ที่ลอยอยู่บนหน้าจอ */}
      <>
        BookCard
        <div style={{
          position: 'fixed', top: '20px', left: '20px',
          backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: '10px 15px',
          borderRadius: '10px', fontSize: '1rem', zIndex: 10,
        }}>
          {/* [FIXED] Show correct item count */}
          คะแนน: {score}
        </div>

        {/* [แก้ไข] เด้ง ฟอร์ม คำถาม (แบ่งหน้า) */}
        {showQuestionModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 20,
            padding: '20px 0'
          }}>
            <div style={{
              backgroundColor: '#333',
              padding: '20px 30px',
              borderRadius: '10px',
              color: 'white',
              width: '450px', // [แก้ไข] กำหนดความกว้างคงที่
              maxWidth: '90%',
              boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            }}>
              {/* ใช้ฟอร์มเดียวครอบทั้งหมด */}
              <form onSubmit={handleQuestionSubmit}>
                
                {/* หัวข้อคำถาม (แสดงเลขหน้า) */}
                <h3 style={{ marginTop: 0, color: 'white', textAlign: 'center' }}>
                  คำถามข้อที่ {currentPage + 1} / {questions.length}
                </h3>

                {/* แสดงคำถามทีละข้อ */}
                <div key={currentQuestion.id} style={{ marginBottom: '15px', minHeight: '150px' }}>
                  <p style={{ color: 'white', fontWeight: 'bold', margin: '0 0 10px 0' }}>
                    {currentQuestion.text}
                  </p>
                  {/* สร้าง 4 ตัวเลือก */}
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} style={{ marginBottom: '5px' }}>
                      <input
                        type="radio"
                        id={`${currentQuestion.id}-${index}`}
                        name={currentQuestion.id} // ชื่อกลุ่มต้องตรงกัน
                        value={option}
                        checked={answers[currentQuestion.id] === option}
                        onChange={() => handleAnswerChange(currentQuestion.id, option)}
                        style={{ marginRight: '8px' }}
                      />
                      <label htmlFor={`${currentQuestion.id}-${index}`} style={{ color: 'white', cursor: 'pointer' }}>
                        {option}
                      </label>
                    </div>
                  ))}
                </div>

                {/* [เพิ่ม] ส่วนปุ่ม Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                  
                  {/* ปุ่มย้อนกลับ */}
                  <button
                    type="button" // <--- สำคัญ: ต้องเป็น type="button"
                    onClick={handleBack}
                    disabled={currentPage === 0} // ปิดปุ่มเมื่ออยู่หน้าแรก
                    style={{
                      ...buttonStyle,
                      backgroundColor: '#6c757d',
                      opacity: currentPage === 0 ? 0.5 : 1, // ทำให้จางเมื่อ disable
                      cursor: currentPage === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    ย้อนกลับ
                  </button>

                  {/* ปุ่มไปต่อ (แสดงเมื่อไม่ใช่หน้าสุดท้าย) */}
                  {!isLastPage && (
                    <button
                      type="button" // <--- สำคัญ: ต้องเป็น type="button"
                      onClick={handleNext}
                      style={buttonStyle}
                    >
                      ไปต่อ
                    </button>
                  )}

                  {/* ปุ่มตกลง (แสดงเฉพาะหน้าสุดท้าย) */}
                  {isLastPage && (
                    <button
                      type="submit" // <--- เป็น type="submit" เพื่อส่งฟอร์ม
                      style={{
                        ...buttonStyle,
                        backgroundColor: '#28a745' // สีเขียว
                      }}
                    >
                      ตกลง
                    </button>
                  )}
                </div>
                
              </form>
            </div>
          </div>
        )}
{/* 
        <button
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

        {/* ปุ่มเริ่มเกมจะเปิด Modal แทน */}
        {/* [Edit] Also hide start button while loading */}
        {!start && (
          <button onClick={() => setShowQuestionModal(true)} className="start-button"
            style={{ 
              position: 'fixed', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              backgroundColor: 'rgba(0,0,0,0.7)', 
              color: 'white', 
              padding: '10px 15px', 
              borderRadius: '10px', 
              fontSize: '1rem', 
              zIndex: 10,
              opacity: isLoading ? 0 : 1,
              transition: 'opacity 0.5s ease-in-out',
              cursor: isLoading ? 'default' : 'pointer'
            }}>เริ่มเกม</button>
        )}
      </>
    </>
  );
};

export default GameScene;