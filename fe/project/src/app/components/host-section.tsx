import { DollarSign, TrendingUp, Shield } from 'lucide-react';

export function HostSection() {
  const benefits = [
    { icon: DollarSign, text: 'Earn up to $10,000/year' },
    { icon: TrendingUp, text: 'Set your own rates' },
    { icon: Shield, text: '$1M insurance coverage' }
  ];

  return (
    <section id="host" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="rounded-2xl overflow-hidden shadow-xl"
          style={{
            background: `linear-gradient(135deg, rgba(30, 64, 175, 0.95) 0%, rgba(30, 58, 138, 0.95) 100%), url('https://images.unsplash.com/photo-1616196293194-70efbabfe379?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBlYXJuaW5ncyUyMG1vbmV5fGVufDF8fHx8MTc2ODMwODEwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="px-6 py-12 sm:px-8 sm:py-16 md:px-16 md:py-20">
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Turn your car into earnings
              </h2>
              <p className="text-lg sm:text-xl text-white/90 mb-8">
                Join thousands of hosts earning extra income by sharing their vehicles when they're not using them.
              </p>
              
              <div className="flex flex-wrap gap-4 sm:gap-6 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-white">
                    <benefit.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-base sm:text-lg">{benefit.text}</span>
                  </div>
                ))}
              </div>

              <button 
                className="px-8 py-4 rounded-lg font-semibold text-white shadow-lg transition-all hover:opacity-90 hover:scale-105"
                style={{ backgroundColor: '#F97316' }}
              >
                Start Earning
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}