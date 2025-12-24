import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Users, Heart, HandHeart, Sparkles } from "lucide-react";

export const metadata = {
  title: 'Propósito',
  description: 'El propósito y la visión del Viaje Misionero Jujuy 25',
};

export default function Proposito() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-balance">
            Viaje Misionero Jujuy 25
          </h1>
        </div>

        {/* Personal Message */}
        <Card className="bg-primary/10 border-primary border-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">Lleguemos alineados</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed"> 
            <p>
              Lleguemos <strong className="text-primary">alineados</strong>. Con el mismo corazón, 
              el mismo propósito, la misma pasión. No venimos como turistas, venimos como <strong>embajadores de Cristo</strong>.
            </p>
            <div className="bg-background p-4 rounded-lg border border-primary/20 mt-4">
              <p className="font-semibold text-primary mb-2">Nuestro compromiso:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Servir</strong> con amor y humildad en cada momento</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Dar testimonio</strong> con nuestras palabras y acciones</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Mostrar a Jesús</strong> en todo lo que hagamos</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Purpose 1 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-2xl">1. Activación Espiritual de los Jóvenes</CardTitle>
                <CardDescription className="text-base">
                  Generando lazos espirituales y activando dones, llamados y propósitos
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-base leading-relaxed">
            <p>
              Queremos ver cómo ambas iglesias no solo generan <strong className="text-primary">lazos espirituales</strong>, 
              sino que también sean activadas en <strong className="text-primary">dones, llamados y propósitos</strong>.
            </p>
          </CardContent>
        </Card>

        {/* Purpose 2 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-2xl">2. Altares de Adoración e Intercesión</CardTitle>
                <CardDescription className="text-base">
                  Adoración e intercesión pública en lugares estratégicos de la ciudad
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-base leading-relaxed">
            <p>
              Estableceremos <strong className="text-primary">altares de adoración e intercesión pública</strong> 
              en plazas, hospitales, lugares de gobierno y más.
            </p>
          </CardContent>
        </Card>

        {/* Purpose 3 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <HandHeart className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-2xl">3. Activación Misionera (Hechos 4)</CardTitle>
                <CardDescription className="text-base">
                  Equipos evangelísticos y de servicio compartiendo a Jesús con denuedo
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-base leading-relaxed">
            <p>
              Salir con <strong className="text-primary">denuedo a compartir a Jesús y servir a la ciudad</strong>. 
              Equipos evangelísticos en plazas, equipos de oración en hospitales, 
              equipos de servicio en barrios y ayuda práctica.
            </p>
          </CardContent>
        </Card>

        {/* Closing Message */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary border-2">
          <CardContent className="pt-6 space-y-4">
            <div className="text-center space-y-3">
              <Heart className="w-8 h-8 text-primary mx-auto" />
              <h3 className="text-2xl font-bold">Nuestro corazón</h3>
            </div>
            <div className="space-y-3 text-base leading-relaxed">
              <p className="text-center italic text-muted-foreground">
                Que en todo momento, en todo lugar, con toda persona, 
                <strong className="text-foreground"> mostremos a Jesús</strong>. 
                Que nuestro testimonio hable más fuerte que nuestras palabras. 
                Que sirvamos con amor genuino. Que lleguemos alineados en un mismo propósito: 
                <strong className="text-foreground"> glorificar a Dios y ver vidas transformadas</strong>.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

