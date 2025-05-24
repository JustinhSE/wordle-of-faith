
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from "@/components/ui/card";

const GameplayPreview = () => {
  const gameScreenshots = [
    {
      id: 1,
      title: "Start a New Game",
      description: "Begin your Biblical word challenge journey",
      image: "/screenshot1.png", // These would be actual screenshots in a real app
    },
    {
      id: 2,
      title: "Make Your First Guess",
      description: "Type in your first 5-letter Biblical word",
      image: "/screenshot2.png",
    },
    {
      id: 3,
      title: "Get Feedback",
      description: "See which letters are correct, present, or absent",
      image: "/screenshot3.png",
    },
    {
      id: 4,
      title: "Solve the Puzzle",
      description: "Use your knowledge to solve the word in 6 tries or less",
      image: "/screenshot4.png",
    }
  ];

  // Generate placeholder screenshot for demo purposes
  const generatePlaceholder = (id: number, title: string) => {
    const colors = ['gray-200', 'gray-300', 'gray-100', 'gray-200'];
    const color = colors[id % colors.length];
    
    return (
      <div className={`flex flex-col items-center justify-center h-48 bg-gradient-to-br from-${color} to-${color} rounded-lg border border-gray-300`}>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {Array(5).fill(0).map((_, idx) => (
            <div 
              key={idx} 
              className={`w-8 h-8 flex items-center justify-center font-bold text-white
                ${idx === id % 5 ? 'bg-green-500' : idx === (id + 1) % 5 ? 'bg-yellow-500' : 'bg-gray-400'}
                rounded border border-gray-200 dark:border-gray-700`}
            >
              {String.fromCharCode(65 + idx)}
            </div>
          ))}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-12 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Game Preview</h2>
      <Carousel className="w-full">
        <CarouselContent>
          {gameScreenshots.map((screenshot) => (
            <CarouselItem key={screenshot.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow dark:bg-gray-800">
                  <CardContent className="flex flex-col items-center p-6">
                    {generatePlaceholder(screenshot.id, screenshot.title)}
                    <div className="mt-4 text-center">
                      <h3 className="font-medium">{screenshot.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{screenshot.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-4">
          <CarouselPrevious className="relative inset-0 translate-y-0 -left-0" />
          <CarouselNext className="relative inset-0 translate-y-0 -right-0" />
        </div>
      </Carousel>
    </div>
  );
};

export default GameplayPreview;
