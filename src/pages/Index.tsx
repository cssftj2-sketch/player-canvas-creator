import { TemplateCanvas } from '@/components/TemplateCanvas';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

const HeaderContent = () => {
  const { t, isRTL } = useTheme();
  
  return (
    <header className="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className={`container mx-auto px-6 py-4 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
            <span className="font-bold text-xl text-white">FC</span>
          </div>
          <div className={isRTL ? 'text-right' : ''}>
            <h1 className="font-bold text-2xl text-amber-400 tracking-wide">
              {t('header.title')}
            </h1>
            <p className="text-xs text-neutral-400 tracking-wider">
              {t('header.subtitle')}
            </p>
          </div>
        </div>
        
        <div className={`hidden sm:block ${isRTL ? 'text-left' : 'text-right'}`}>
          <p className="text-xs text-neutral-400">
            {t('tip.doubleClick')}
          </p>
          <p className="text-xs text-neutral-400">
            {t('tip.drag')}
          </p>
        </div>
      </div>
    </header>
  );
};

const FooterContent = () => {
  const { t } = useTheme();
  
  return (
    <footer className="border-t border-neutral-800 bg-neutral-900/50 py-4">
      <div className="container mx-auto px-6 text-center">
        <p className="text-xs text-neutral-500">
          {t('footer.tip')}
        </p>
      </div>
    </footer>
  );
};

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-neutral-950 flex flex-col">
        <HeaderContent />
        <main className="flex-1">
          <TemplateCanvas />
        </main>
        <FooterContent />
      </div>
    </ThemeProvider>
  );
};

export default Index;
