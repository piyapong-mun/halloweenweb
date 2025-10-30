'use client';

import React, { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import GameSceneRoad from './GameSceneRoad';
import GameSceneTemple from './GameSceneTemple';
import GameSceneForest from './GameSceneForest';
import GameSceneSwam from './GameSceneSwam';
import GameSceneSchool from './GameSceneSchool';
import GameSceneJPhouse from './GameSceneJPhouse';
import GameSceneWoodhouse from './GameSceneWoodhouse';
import GameSceneJPtemple from './GameSceneTempleJP';
import GameSceneBoth from './GameSceneBoth';
import GameSceneHospital from './GameSceneHP';
import GameSceneRoadFN from './GameSceneRoadFN';
import Finish from './Finish';
import { da, no } from 'zod/locales';
import { finished } from 'stream';
import { set } from 'zod';


interface hiddenPaths {
  temple: boolean;
  forest: boolean;
}

interface Card {
  id: number;
  count: number; // จำนวนที่ผู้เล่นสะสม
}

const Stage: React.FC = () => {

  useEffect(() => {
    const checkStatus = async () => {
      const res = await fetch('/api/checkstatus', { method: 'GET' });
      if (res) {
        const data = await res.json();
        console.log(data);
        if (data.status === 'finish') {
          setScence(11);
          setScore(data.score);
          setCards(data.card);
        }
        
      }
      }
    checkStatus();
    setIsLoading(false);
  }, []);



  // useEffect(() => {
  //   const checkStatus = async () => {
  //     const res = await fetch('/api/updatestatus', { method: 'POST', body: JSON.stringify({ status: 'play', score: 10, card: [{ id: 0, count: 0 },{ id: 1, count: 0 }] }) });
  //     }
  //   checkStatus();
  // }, []);

  const [scence, setScence] = useState<number>(0);
  const [start, setStart] = useState<boolean>(false);
  const [hiddenPaths, setHiddenPaths] = useState<hiddenPaths>({ temple: false, forest: false });
  const [cards, setCards] = useState<Card[]>([]);
  const [foundItems, setFoundItems] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function finishgame() {
    const res = await fetch('/api/updatestatus', { method: 'POST', body: JSON.stringify({ status: 'finish', score: score, card: cards }) });
    setScence(11);
    if (res.status !== 200) {
      alert('ไม่สามารถบันทึกข้อมูลได้');
    }
  }


  function handleClick(scence: number) {
    if (scence === 6) {
      setHiddenPaths((prevPaths) => ({ ...prevPaths, temple: true }));
    } else if (scence === 4) {
      setHiddenPaths((prevPaths) => ({ ...prevPaths, forest: true }));
    }

    setScence(scence);
  }

  function addCards(id: number | null) {
    console.log('id', id);
    if (id === null) {
      return;
    }

    if (id >= 0 && id <= 24) {
      setScore(score + 100);
    } else if (id >= 25 && id <= 37) {
      setScore(score + 200);
    } else if (id >= 38 && id <= 41) {
      setScore(score + 300);
    } else if (id >= 42 && id <= 44) {
      setScore(score + 400);
    }

    // Check if the card already exists in the array
    const existingCard = cards.find((card) => card.id === id);
    if (!existingCard) {
      setCards([...cards, { id: id, count: 1 }]);
      return;
    } else {
      const updatedCards = cards.map((card) => {
        if (card.id === id) {
          return { ...card, count: card.count + 1 };
        }
        return card;
      });
      setCards(updatedCards);
    }

  }

  useEffect(() => {
    console.log('cards', cards);
  }, [cards]);

  function loadScence(scence: number) {
    if (scence === 0) {
      return <GameSceneRoad navigate={handleClick} start={start} setStart={setStart} addCard={addCards} foundItems={foundItems} setFoundItems={setFoundItems}  score={score}/>;
    }
    else if (scence === 1) {
      return <GameSceneTemple navigate={handleClick} start={start} setStart={setStart} hiddenPath={hiddenPaths} addCard={addCards} foundItems={foundItems} setFoundItems={setFoundItems} score={score} />
    }
    else if (scence === 2) {
      return <GameSceneForest navigate={handleClick} start={start} setStart={setStart} hiddenPath={hiddenPaths} addCard={addCards} foundItems={foundItems} setFoundItems={setFoundItems} score={score}  />
    }
    else if (scence === 3) {
      return <GameSceneSwam navigate={handleClick} start={start} setStart={setStart} addCard={addCards} foundItems={foundItems} setFoundItems={setFoundItems} score={score}/>
    }
    else if (scence === 4) {
      return <GameSceneSchool navigate={handleClick} start={start} setStart={setStart} addCard={addCards} foundItems={foundItems} setFoundItems={setFoundItems} score={score}  />
    } else if (scence === 5) {
      return <GameSceneJPhouse navigate={handleClick} start={start} setStart={setStart} score={score} />
    }
    else if (scence === 6) {
      return <GameSceneWoodhouse navigate={handleClick} start={start} setStart={setStart} addCard={addCards} foundItems={foundItems} setFoundItems={setFoundItems} score={score} />
    }
    else if (scence === 7) {
      return <GameSceneJPtemple navigate={handleClick} start={start} setStart={setStart} addCard={addCards} foundItems={foundItems} setFoundItems={setFoundItems} score={score} finishgame={finishgame} />
    }
    else if (scence === 8) {
      return <GameSceneBoth navigate={handleClick} start={start} setStart={setStart} addCard={addCards} foundItems={foundItems} setFoundItems={setFoundItems} score={score} finishgame={finishgame}  />
    }
    else if (scence === 9) {
      return <GameSceneHospital navigate={handleClick} start={start} setStart={setStart} addCard={addCards}  foundItems={foundItems} setFoundItems={setFoundItems} score={score} finishgame={finishgame} />
    }else if (scence === 10) {
      return <GameSceneRoadFN navigate={handleClick} start={start} setStart={setStart} addCard={addCards} foundItems={foundItems} setFoundItems={setFoundItems} score={score} finishgame={finishgame} />
    }
    else {
      return <Finish cards={cards} score={score} />
    }
  }

  return (
    <div className="stage">
      {!isLoading && loadScence(scence)}
    </div>
  );
};

export default Stage;
