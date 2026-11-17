import React, { useState } from 'react';

interface CardComponentProps {
  nominee: string;
  aux?: string;
  genre?: string;
  background?: string;
  active: boolean;
  setActiveCard: (nominee: string) => void;
}

const CardComponent: React.FC<CardComponentProps> = ({ nominee, aux = "NULL", genre = "", background, active, setActiveCard }) => {
  const [isActive, setIsActive] = useState(false);

  const handleCardClick = () => {
    setActiveCard(nominee);
    setIsActive(!isActive);
  };

  return (
    <div
      className={`relative overflow-hidden aspect-square w-full text-left group hover:translate-x-2 hover:translate-y-2 transition-all duration-300 cursor-pointer 
        ${active ? 'bg-black translate-x-2 translate-y-2 grayscale' : 'bg-white grayscale-0'}
      `}
      onClick={handleCardClick}
      style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className={`p-4 w-full h-full flex flex-col justify-between ${active ? 'bg-white text-black' : 'bg-black text-white'} bg-opacity-45 transition-all duration-300`}>
        <div>
          <h1 className="font-montserrat font-bold relative text-lg xl:text-xl tracking-tight leading-snug">{nominee}</h1>
          <h2 className={`font-barlow text-sm font-semibold opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 mt-1 ${active ? 'opacity-100 ' : '-translate-x-10'}`}>{aux}</h2>
          <h3 className={`font-barlow text-xs font-normal opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${active ? 'opacity-100 ' : '-translate-x-10'}`}>{genre}</h3>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
