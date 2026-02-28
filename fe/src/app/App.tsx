import { useState } from 'react';
import { Navbar } from '@/app/components/navbar';
import { HeroSection } from '@/app/components/hero-section';
import { HowItWorks } from '@/app/components/how-it-works';
import { HostSection } from '@/app/components/host-section';
import { FAQSection } from '@/app/components/faq-section';
import { Footer } from '@/app/components/footer';
import { SearchPage } from '@/app/components/search-page';
import { Admin } from '@/app/components/admin/admin.jsx';

type Page = 'home' | 'search' | 'admin';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('admin');

  // Show admin panel if on admin page
  if (currentPage === 'admin') {
    return <Admin onBackToSite={() => setCurrentPage('home')} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      
      {currentPage === 'home' ? (
        <>
          <HeroSection onSearchClick={() => setCurrentPage('search')} />
          <HowItWorks />
          <HostSection />
          <FAQSection />
          <Footer />
        </>
      ) : (
        <>
          <SearchPage />
          <Footer />
        </>
      )}
    </div>
  );
}
