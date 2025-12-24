import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Users, Heart } from "lucide-react";

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
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <MapPin className="w-5 h-5" />
            <p className="text-lg">
              Jóvenes de la iglesia El Encuentro de Luis Guillón, Buenos Aires
            </p>
          </div>
        </div>

        {/* Introduction */}
        <Card className="bg-primary/5 border-primary">
          <CardHeader>
            <CardTitle className="text-2xl">Nuestro Propósito</CardTitle>
            <CardDescription className="text-base">
              Un viaje misionero con tres objetivos fundamentales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed">
            <p>
              Este es un viaje de los jóvenes de la iglesia <strong>El Encuentro</strong> de 
              Luis Guillón, Buenos Aires. Nuestro corazón es ver a ambas iglesias unidas en un 
              propósito común de activación espiritual, adoración e intercesión, y servicio misionero.
            </p>
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
                  Unión y activación de ambas iglesias
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-base leading-relaxed">
            <p>
              Queremos ver, como ambas iglesias, no solo generan lazos espirituales, sino que también, 
              sean activadas en <strong>dones, llamados y propósitos</strong>.
            </p>
            <p className="text-muted-foreground">
              Este viaje es una oportunidad para que los jóvenes descubran y activen los dones que 
              Dios les ha dado, identifiquen su llamado y caminen en el propósito que Él tiene para sus vidas.
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
                  Adoración pública en lugares estratégicos
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-base leading-relaxed">
            <p>
              Estableceremos <strong>altares de adoración e intercesión pública</strong> en:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Plazas públicas</li>
              <li>Hospitales</li>
              <li>Lugares de gobierno</li>
              <li>Y más espacios estratégicos</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Creemos que la adoración y la intercesión pública tienen un poder transformador 
              sobre las ciudades y las naciones.
            </p>
          </CardContent>
        </Card>

        {/* Purpose 3 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <span className="text-2xl">📖</span>
              </div>
              <div>
                <CardTitle className="text-2xl">3. Hechos 4 - Activación Misionera</CardTitle>
                <CardDescription className="text-base">
                  Salir con denuedo a compartir a Jesús y servir
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-base leading-relaxed">
            <p>
              Salir con <strong>denuedo a compartir a Jesús y servir a la ciudad</strong>.
            </p>
            <div className="space-y-3 mt-4">
              <p className="font-semibold text-primary">Cómo lo haremos:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Equipos en plazas:</strong> Compartiendo el evangelio en espacios públicos</li>
                <li><strong>Equipos en hospitales:</strong> Llevando esperanza y oración a quienes lo necesitan</li>
                <li><strong>Equipos en barrios:</strong> Visitando y sirviendo a las comunidades</li>
                <li><strong>Ayuda práctica:</strong> Demostrando el amor de Dios a través de acciones concretas</li>
              </ul>
            </div>
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mt-4">
              <p className="text-sm font-semibold text-primary mb-2">Hechos 4:29-31</p>
              <p className="text-sm italic text-muted-foreground">
                &ldquo;Y ahora, Señor, mira sus amenazas, y concede a tus siervos que hablen tu palabra 
                con toda confianza... Y cuando hubieron orado, el lugar en que estaban congregados tembló; 
                y todos fueron llenos del Espíritu Santo, y hablaban con denuedo la palabra de Dios.&rdquo;
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-accent/10 border-accent">
          <CardContent className="pt-6 text-center space-y-4">
            <h3 className="text-2xl font-bold">Únete a este propósito</h3>
            <p className="text-muted-foreground text-balance max-w-2xl mx-auto">
              Cada oración, cada adoración, cada acto de servicio cuenta. 
              Sé parte de este viaje misionero que transformará vidas y ciudades.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

