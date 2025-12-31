import { TemplateCanvas } from '@/components/TemplateCanvas';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

const HeaderContent = () => {
  const { t, isRTL } = useTheme();
  
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className={`container mx-auto px-6 py-4 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 gradient-gold rounded-lg flex items-center justify-center">
            <span className="font-display text-xl text-primary-foreground">FC</span>
          </div>
          <div className={isRTL ? 'text-right' : ''}>
            <h1 className="font-display text-2xl text-gold tracking-wide">
              {t('header.title')}
            </h1>
            <p className="text-xs text-muted-foreground font-heading tracking-wider">
              {t('header.subtitle')}
            </p>
          </div>
        </div>
        
        <div className={`hidden sm:block ${isRTL ? 'text-left' : 'text-right'}`}>
          <p className="text-xs text-muted-foreground">
            {t('tip.doubleClick')}
          </p>
          <p className="text-xs text-muted-foreground">
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
    <footer className="border-t border-border bg-card/30 py-4">
      <div className="container mx-auto px-6 text-center">
        <p className="text-xs text-muted-foreground">
          {t('footer.tip')}
        </p>
      </div>
    </footer>
  );
};

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background flex flex-col">
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
