"use client"


import { Loader2 } from 'lucide-react';


import { Card } from '../_components/ui/card';

const Loading = ({ 
  message = "Carregando Dados...", 
  subMessage = "Buscando relatórios..." 
}) => {


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background transition-colors">
      <Card className="p-8 bg-card">
        <div className="text-center space-y-6">
          <div className="flex justify-center items-center">
            <Loader2 
              className="w-24 h-24 text-primary animate-spin" 
              strokeWidth={1.5} 
            />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-card-foreground">
              {message}
            </h2>
            
            <p className="text-muted-foreground text-lg">
              {subMessage}
            </p>
          </div>
          
          <div className="flex justify-center space-x-4 mt-6">
            <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
            <div className="w-4 h-4 bg-primary rounded-full animate-pulse delay-150"></div>
            <div className="w-4 h-4 bg-primary rounded-full animate-pulse delay-300"></div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Loading;