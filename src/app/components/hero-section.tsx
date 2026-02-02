interface HeroSectionProps {
  onSearchClick?: () => void;
}

export function HeroSection({ onSearchClick }: HeroSectionProps) {
  return (
    <section id="home" className="relative h-[500px] sm:h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXJ8ZW58MXx8fHwxNzY4MTk4OTUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6">
          Your Journey, Your Choice
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8">
          Rent the perfect car for your next adventure.
        </p>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={onSearchClick}
            className="w-full sm:w-auto px-8 py-3 rounded-lg text-white font-semibold transition-all hover:opacity-90 hover:scale-105 shadow-lg"
            style={{ backgroundColor: '#1E40AF' }}
          >
            Find a Car
          </button>
          <button 
            className="w-full sm:w-auto px-8 py-3 rounded-lg font-semibold transition-all border-2 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:scale-105"
            style={{ borderColor: '#ffffff' }}
          >
            List Your Car
          </button>
        </div>
      </div>
    </section>
  );
}