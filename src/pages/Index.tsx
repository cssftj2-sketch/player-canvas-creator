import { TemplateCanvas } from '@/components/TemplateCanvas';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-gold rounded-lg flex items-center justify-center">
              <span className="font-display text-xl text-primary-foreground">FC</span>
            </div>
            <div>
              <h1 className="font-display text-2xl text-gold tracking-wide">
                PLAYER STATS BUILDER
              </h1>
              <p className="text-xs text-muted-foreground font-heading tracking-wider">
                CREATE STUNNING FOOTBALL INFOGRAPHICS
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-muted-foreground">
                Double-click elements to edit
              </p>
              <p className="text-xs text-muted-foreground">
                Drag elements to reposition
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Canvas Area */}
      <main className="flex-1">
        <TemplateCanvas />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-4">
        <div className="container mx-auto px-6 text-center">
          <p className="text-xs text-muted-foreground">
            Upload a player image • Edit stats by double-clicking • Drag elements to customize layout
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
