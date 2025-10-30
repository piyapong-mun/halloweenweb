'use client';
import React from 'react';
import Image from 'next/image';

interface ArrowProps {
    navigate: { navigate_func: (navigate_func: number) => void, navigate_to: number };
    custom_image: string;
    rotation: { x: number; y: number };
    width: number;
    height: number;
}

const walkSound = typeof window !== 'undefined' ? new Audio('/sounds/walk.mp3') : null;

const Arrow: React.FC<ArrowProps> = ({ navigate, custom_image='/Arrow.png', rotation, width, height }) => {



  return (

    <div
        className="image-wrapper"
        style={{ 
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
      }}
        
        onClick={ () => {
          navigate.navigate_func(navigate.navigate_to)
          walkSound?.play();
        }}
      >
        <Image src={custom_image} alt="3D Rotate" width={width} height={height} />
      </div>

  );
};

export default Arrow;
