import React from 'react';

export const WorkshopEnvironment: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-[#1b1510] text-stone-800 flex flex-col items-center overflow-x-hidden selection:bg-amber-800 selection:text-amber-100">
      {/* Ambient Workshop Background Lighting & Texture */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Soft morning sunbeams streaming down from window slats */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[800px] bg-gradient-to-b from-amber-200/10 via-amber-300/5 to-transparent blur-3xl transform -rotate-12"></div>
        <div className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-gradient-to-t from-stone-900/60 to-transparent blur-2xl"></div>

        {/* Subtle bamboo slat shadows overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[repeating-linear-gradient(45deg,#fff_0px,#fff_2px,transparent_2px,transparent_30px)]"></div>
      </div>

      {/* Main Interactive Stage Container */}
      <main className="relative z-10 w-full max-w-5xl px-4 py-6 md:py-8 flex flex-col items-center my-auto">
        {children}
      </main>

      {/* Workshop Ground Floor Rim */}
      <div className="fixed bottom-0 inset-x-0 h-16 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent pointer-events-none z-10"></div>
    </div>
  );
};
