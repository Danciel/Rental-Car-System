import { Search, MapPin, Smile } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: 'Browse & Book',
      description: 'Find the perfect car from thousands of listings in your area. Book instantly with just a few clicks.'
    },
    {
      icon: MapPin,
      title: 'Pick Up',
      description: 'Meet the host at the arranged location or get the car delivered right to your doorstep.'
    },
    {
      icon: Smile,
      title: 'Enjoy the Ride',
      description: 'Hit the road and enjoy your adventure. Return the car when you\'re done and rate your experience.'
    }
  ];

  return (
    <section id="search" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg sm:text-xl text-gray-600">Get on the road in three simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto transition-transform hover:scale-110"
                style={{ backgroundColor: '#1E40AF' }}
              >
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 text-center">
                Step {index + 1}: {step.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}