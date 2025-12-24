import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
  title: 'Propósito',
  description: 'El fundamento bíblico y la visión detrás del movimiento de oración',
};

export default function Proposito() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-balance">
            El Propósito de Orar Sin Cesar
          </h1>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Una comunidad unida en oración continua, siguiendo el llamado bíblico a interceder sin cesar
          </p>
        </div>

        {/* Biblical Foundation */}
        <Card className="bg-primary/5 border-primary">
          <CardHeader>
            <CardTitle className="text-2xl">Fundamento Bíblico</CardTitle>
            <CardDescription className="text-base">
              La Palabra de Dios nos llama a una vida de oración constante
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="bg-card p-4 rounded-lg border border-border">
                <p className="text-sm font-semibold text-primary mb-2">1 Tesalonicenses 5:17</p>
                <p className="text-base italic">&ldquo;Oren sin cesar&rdquo;</p>
              </div>
              
              <div className="bg-card p-4 rounded-lg border border-border">
                <p className="text-sm font-semibold text-primary mb-2">Mateo 18:20</p>
                <p className="text-base italic">
                  &ldquo;Porque donde dos o tres se reúnen en mi nombre, allí estoy yo en medio de ellos&rdquo;
                </p>
              </div>
              
              <div className="bg-card p-4 rounded-lg border border-border">
                <p className="text-sm font-semibold text-primary mb-2">Santiago 5:16</p>
                <p className="text-base italic">
                  &ldquo;La oración del justo es poderosa y eficaz&rdquo;
                </p>
              </div>

              <div className="bg-card p-4 rounded-lg border border-border">
                <p className="text-sm font-semibold text-primary mb-2">Lucas 18:1</p>
                <p className="text-base italic">
                  &ldquo;Jesús les contó una parábola para enseñarles que debían orar siempre, sin desanimarse&rdquo;
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vision Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Nuestra Visión</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed">
            <p>
              <strong>Viaje Misionero: Jujuy 25</strong> nace del deseo de ver a nuestra comunidad transformada 
              por el poder de la oración continua. Creemos que cuando nos unimos en oración, Dios se mueve 
              de maneras extraordinarias.
            </p>
            <p>
              Este movimiento no es solo una iniciativa, es una respuesta al llamado de Dios a ser una 
              casa de oración. Cada hora del día, alguien está intercediendo por nuestra iglesia, 
              nuestras familias, nuestra ciudad y las naciones.
            </p>
            <p>
              Al participar, no solo oras por ti, sino que te unes a una cadena ininterrumpida de 
              intercesión que cubre cada momento del día y la noche. Tu oración se suma a la de otros 
              hermanos, creando una atmósfera espiritual poderosa.
            </p>
          </CardContent>
        </Card>

        {/* Mission Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Nuestra Misión</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-primary">🔥 Mantener el fuego</h3>
                <p className="text-muted-foreground">
                  Mantener una cobertura de oración continua, sin que el fuego se apague
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-primary">🤝 Unir a la comunidad</h3>
                <p className="text-muted-foreground">
                  Conectar a hermanos de diferentes edades y trasfondos en un propósito común
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-primary">💪 Fortalecer la fe</h3>
                <p className="text-muted-foreground">
                  Edificar nuestra fe colectiva y ver testimonios del poder de Dios
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-primary">🌍 Impactar al mundo</h3>
                <p className="text-muted-foreground">
                  Ser luz en nuestra comunidad y expandir el reino de Dios
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-accent/10 border-accent">
          <CardContent className="pt-6 text-center space-y-4">
            <h3 className="text-2xl font-bold">¿Estás listo para unirte?</h3>
            <p className="text-muted-foreground text-balance max-w-2xl mx-auto">
              No importa dónde estés o qué hora sea, siempre hay un lugar para ti en esta 
              cadena de oración. Únete ahora y sé parte del movimiento.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Comenzar a Orar
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

