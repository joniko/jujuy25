"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Smartphone, Share, Download, Plus, MoreVertical } from 'lucide-react';

export default function InstalarPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/')}
            className="shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Instalar Oremos en tu teléfono</h1>
            <p className="text-sm text-muted-foreground">
              Accede más rápido instalando la app en tu pantalla de inicio
            </p>
          </div>
        </div>

        {/* Intro Card */}
        <Card className="bg-primary/5 border-primary">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-lg">¿Por qué instalar?</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Acceso rápido con un toque desde tu pantalla de inicio</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Experiencia de app nativa sin ocupar espacio extra</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Funciona sin conexión para contenido ya cargado</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Notificaciones futuras (próximamente)</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* iOS Instructions */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </div>
              <div>
                <CardTitle>iPhone / iPad (iOS)</CardTitle>
                <CardDescription>Usando Safari</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
                  1
                </div>
                <div className="flex-1 space-y-2">
                  <p className="font-medium">Abre Oremos en Safari</p>
                  <p className="text-sm text-muted-foreground">
                    Asegúrate de estar usando el navegador Safari (no Chrome ni otro navegador)
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
                  2
                </div>
                <div className="flex-1 space-y-2">
                  <p className="font-medium">Toca el botón de Compartir</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Share className="w-4 h-4" />
                    <span>El ícono de compartir en la barra inferior (iOS 15+) o superior (iOS anteriores)</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
                  3
                </div>
                <div className="flex-1 space-y-2">
                  <p className="font-medium">Selecciona &quot;Agregar a Inicio&quot;</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Plus className="w-4 h-4" />
                    <span>Desplázate hacia abajo en el menú y toca esta opción</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
                  4
                </div>
                <div className="flex-1 space-y-2">
                  <p className="font-medium">Confirma la instalación</p>
                  <p className="text-sm text-muted-foreground">
                    Toca &quot;Agregar&quot; en la esquina superior derecha y ¡listo! 🎉
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>💡 Tip:</strong> El ícono de Oremos aparecerá en tu pantalla de inicio junto a tus otras apps.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Android Instructions */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.6 10.81L16.19 9.4l3.56-3.55 1.41 1.41zm-2.59 2.59l-1.41-1.41 1.41-1.42 1.42 1.42zM12 6.5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zM7.81 10.81L6.4 9.4 2.84 12.95l1.41 1.41zm7.39-8.01l-1.42 1.42 1.42 1.41L16.61 4.4zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                </svg>
              </div>
              <div>
                <CardTitle>Android</CardTitle>
                <CardDescription>Usando Chrome</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
                  1
                </div>
                <div className="flex-1 space-y-2">
                  <p className="font-medium">Abre Oremos en Chrome</p>
                  <p className="text-sm text-muted-foreground">
                    Asegúrate de usar Google Chrome como navegador
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
                  2
                </div>
                <div className="flex-1 space-y-2">
                  <p className="font-medium">Abre el menú de Chrome</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MoreVertical className="w-4 h-4" />
                    <span>Toca los tres puntos verticales en la esquina superior derecha</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
                  3
                </div>
                <div className="flex-1 space-y-2">
                  <p className="font-medium">Selecciona &quot;Instalar aplicación&quot;</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Download className="w-4 h-4" />
                    <span>Busca esta opción en el menú desplegable</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
                  4
                </div>
                <div className="flex-1 space-y-2">
                  <p className="font-medium">Confirma la instalación</p>
                  <p className="text-sm text-muted-foreground">
                    Toca &quot;Instalar&quot; en el diálogo que aparece y ¡listo! 🎉
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm text-green-900">
                <strong>💡 Tip:</strong> También puedes ver un banner en la parte superior de la página que dice &quot;Agregar a pantalla de inicio&quot;.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Help Card */}
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              ¿Tienes problemas para instalar?
            </p>
            <p className="text-sm">
              Contacta con tu líder de oración para recibir ayuda personalizada.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

