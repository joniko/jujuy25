"use client";

import { AlertCircle, WifiOff } from 'lucide-react';
import { Card } from "@/components/ui/card";

interface OfflineMessageProps {
  hasCachedData?: boolean;
  className?: string;
}

/**
 * Componente unificado para mostrar mensajes de estado offline
 */
export default function OfflineMessage({ hasCachedData = false, className = "" }: OfflineMessageProps) {
  if (hasCachedData) {
    return (
      <Card className={`border-orange-200 bg-orange-50/50 ${className}`}>
        <div className="p-4 flex items-start gap-3">
          <WifiOff className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-orange-800 font-medium">
              Sin conexión a internet
            </p>
            <p className="text-xs text-orange-700 mt-1">
              Mostrando datos guardados anteriormente
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`border-red-200 bg-red-50/50 ${className}`}>
      <div className="p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-red-800 font-medium">
            Sin conexión a internet
          </p>
          <p className="text-xs text-red-700 mt-1">
            Conecta a internet para cargar los datos
          </p>
        </div>
      </div>
    </Card>
  );
}

/**
 * Función helper para obtener el mensaje de error unificado
 */
export function getOfflineErrorMessage(error: unknown): { hasCachedData: boolean; message: string } {
  if (error instanceof Error) {
    if (error.message.includes('No internet connection') || error.message.includes('no cached data')) {
      const hasCachedData = !error.message.includes('no cached data');
      return {
        hasCachedData,
        message: hasCachedData 
          ? 'Sin conexión a internet. Mostrando datos guardados anteriormente.'
          : 'Sin conexión y sin datos guardados. Conecta a internet para cargar los datos.'
      };
    }
  }
  
  return {
    hasCachedData: false,
    message: 'Error al cargar los datos'
  };
}

