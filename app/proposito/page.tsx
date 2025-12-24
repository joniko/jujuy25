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
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <MapPin className="w-5 h-5" />
            <p className="text-lg">
              Jóvenes de la iglesia El Encuentro de Luis Guillón, Buenos Aires
            </p>
          </div>
        </div>

        {/* Personal Message */}
        <Card className="bg-primary/10 border-primary border-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">Una palabra para ti</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed">
            <p className="font-medium">
              Hermano, hermana... este viaje no es casualidad.
            </p>
            <p>
              Cada uno de ustedes <strong className="text-primary">invirtió de su bolsillo</strong> para estar aquí. 
              Ese sacrificio no es en vano. Dios tiene un propósito específico para cada uno en este viaje.
            </p>
            <p>
              Queremos que lleguemos <strong className="text-primary">alineados</strong>. Con el mismo corazón, 
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
                  De ambas iglesias
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed">
            <p className="text-lg font-medium">
              Queremos ver, como ambas iglesias, no solo generan <strong className="text-primary">lazos espirituales</strong>, 
              sino que también, sean activadas en <strong className="text-primary">dones, llamados y propósitos</strong>.
            </p>
            <div className="space-y-3">
              <p>
                Este viaje misionero es más que una experiencia; es un <strong>momento de activación</strong>. 
                Un tiempo donde los jóvenes de ambas iglesias se unen no solo para servir, sino para descubrir 
                y activar lo que Dios ha puesto en cada uno.
              </p>
              <p className="text-muted-foreground">
                Creemos que cada joven tiene dones únicos, un llamado específico y un propósito divino. 
                Este viaje es la oportunidad para que esos dones se manifiesten, ese llamado se confirme 
                y ese propósito se active.
              </p>
            </div>
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mt-4">
              <p className="text-sm italic text-muted-foreground">
                &ldquo;Porque somos hechura suya, creados en Cristo Jesús para buenas obras, 
                las cuales Dios preparó de antemano para que anduviésemos en ellas.&rdquo; 
                <span className="font-semibold text-primary"> - Efesios 2:10</span>
              </p>
            </div>
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
                  Adoración e intercesión pública
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed">
            <p className="text-lg font-medium">
              Estableceremos <strong className="text-primary">altares de adoración e intercesión pública</strong> 
              en lugares estratégicos de la ciudad.
            </p>
            <div className="space-y-3">
              <p className="font-semibold text-foreground">Dónde lo haremos:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li className="text-muted-foreground"><strong className="text-foreground">Plazas públicas:</strong> Donde la comunidad se reúne</li>
                <li className="text-muted-foreground"><strong className="text-foreground">Hospitales:</strong> Llevando esperanza y oración</li>
                <li className="text-muted-foreground"><strong className="text-foreground">Lugares de gobierno:</strong> Intercediendo por las autoridades</li>
                <li className="text-muted-foreground"><strong className="text-foreground">Y más espacios estratégicos:</strong> Donde Dios nos guíe</li>
              </ul>
            </div>
            <p className="mt-4">
              Creemos que la adoración y la intercesión pública tienen un <strong className="text-primary">poder transformador</strong> 
              sobre las ciudades y las naciones. Cuando adoramos públicamente, declaramos la soberanía de Dios. 
              Cuando intercedemos, cambiamos la atmósfera espiritual.
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
                <CardTitle className="text-2xl">3. Hechos 4 - Activación Misionera</CardTitle>
                <CardDescription className="text-base">
                  Salir con denuedo a compartir a Jesús y servir
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed">
            <p className="text-lg font-medium">
              Salir con <strong className="text-primary">denuedo a compartir a Jesús y servir a la ciudad</strong>.
            </p>
            <p>
              Este es el corazón de nuestro viaje: <strong>mostrar a Jesús</strong> no solo con nuestras palabras, 
              sino con nuestras acciones. Cada momento es una oportunidad para que otros vean el amor de Cristo 
              a través de nosotros.
            </p>
            <div className="space-y-3 mt-4">
              <p className="font-semibold text-foreground">Cómo lo haremos:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li className="text-muted-foreground">
                  <strong className="text-foreground">Equipos en plazas:</strong> Compartiendo el evangelio con amor y respeto
                </li>
                <li className="text-muted-foreground">
                  <strong className="text-foreground">Equipos en hospitales:</strong> Llevando esperanza, oración y consuelo
                </li>
                <li className="text-muted-foreground">
                  <strong className="text-foreground">Equipos en barrios:</strong> Visitando, escuchando y sirviendo a las comunidades
                </li>
                <li className="text-muted-foreground">
                  <strong className="text-foreground">Ayuda práctica:</strong> Demostrando el amor de Dios a través de acciones concretas
                </li>
              </ul>
            </div>
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mt-4">
              <p className="text-sm font-semibold text-primary mb-2">Hechos 4:29-31</p>
              <p className="text-sm italic text-muted-foreground mb-3">
                &ldquo;Y ahora, Señor, mira sus amenazas, y concede a tus siervos que hablen tu palabra 
                con toda confianza... Y cuando hubieron orado, el lugar en que estaban congregados tembló; 
                y todos fueron llenos del Espíritu Santo, y hablaban con denuedo la palabra de Dios.&rdquo;
              </p>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Recuerda:</strong> No solo hablamos de Jesús, 
                <strong className="text-primary"> mostramos a Jesús</strong>. Cada sonrisa, cada acto de servicio, 
                cada palabra de aliento es una oportunidad para que otros vean el amor de Cristo en nosotros.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Heart Message */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary border-2">
          <CardContent className="pt-6 space-y-4">
            <div className="text-center space-y-3">
              <Heart className="w-8 h-8 text-primary mx-auto" />
              <h3 className="text-2xl font-bold">Lleguemos alineados</h3>
            </div>
            <div className="space-y-3 text-base leading-relaxed">
              <p>
                Este viaje es más que un viaje. Es una <strong className="text-primary">oportunidad</strong> 
                para que Dios use nuestras vidas de maneras que ni siquiera imaginamos.
              </p>
              <p>
                Has invertido de tu bolsillo. Has hecho el sacrificio. Ahora, <strong>déjate usar por Dios</strong>. 
                Permite que Él te sorprenda. Permite que tu vida sea un testimonio vivo de Su amor.
              </p>
              <div className="bg-background/80 p-4 rounded-lg border border-primary/20 mt-4">
                <p className="font-semibold text-primary mb-2 text-center">Nuestro corazón:</p>
                <p className="text-center text-sm italic text-muted-foreground">
                  &ldquo;Que en todo momento, en todo lugar, con toda persona, 
                  <strong className="text-foreground"> mostremos a Jesús</strong>. 
                  Que nuestro testimonio hable más fuerte que nuestras palabras. 
                  Que sirvamos con amor genuino. Que lleguemos alineados en un mismo propósito: 
                  <strong className="text-foreground"> glorificar a Dios y ver vidas transformadas</strong>.&rdquo;
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

