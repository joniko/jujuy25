"use client";

import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FAQItem {
  question: string;
  answer: string | string[];
}

interface FAQSection {
  title: string;
  icon: string;
  questions: FAQItem[];
}

const faqData: FAQSection[] = [
  {
    title: "LOGÍSTICA GENERAL",
    icon: "🚌",
    questions: [
      {
        question: "¿Dónde nos encontramos para salir y a qué hora?",
        answer: "El programa requerido para participar del viaje misionero es estar en la Iglesia el día viernes 26/12 a las 05:00 hs hasta el domingo 28/12 a las 13:00 hs"
      },
      {
        question: "¿Cómo será el traslado entre la Iglesia y el Hospedaje?",
        answer: "Queda a cargo de cada uno. En auto/uber son 7 minutos y caminando 30 min. Se utiliza tarjeta SUBE en transporte público."
      },
      {
        question: "¿Cuántas valijas o mochilas puedo llevar?",
        answer: "Recomendamos llevar 1 bolso mediano por persona. Cada uno deberá chequear las condiciones de equipaje que compró en su pasaje."
      },
      {
        question: "¿Necesito llevar mi DNI o algún documento adicional?",
        answer: "Es de carácter OBLIGATORIO que cada uno lleve su DNI."
      }
    ]
  },
  {
    title: "ALIMENTACIÓN Y NECESIDADES PERSONALES",
    icon: "🍽️",
    questions: [
      {
        question: "¿Está incluida la comida o debemos llevar algo?",
        answer: "Dentro del precio que pagamos como jóvenes se incluye la cena del viernes y sábado como también el desayuno del sábado y domingo."
      },
      {
        question: "¿Puedo llevar snacks o bebidas personales?",
        answer: "Sí, se puede. Verificar las políticas de alimentos en la aerolínea/empresa por la que viajes."
      },
      {
        question: "¿Habrá agua potable disponible durante todo el viaje?",
        answer: "Cada uno deberá tener sus bebidas. Está incluida la bebida correspondiente a las comidas."
      },
      {
        question: "¿Se puede llevar termo o mate?",
        answer: "Sí, pero para transportarlo en avión, todo debe estar bien cerrado, vacío y bien embalado. Hay aerolíneas que permiten llevarlo en cabina y otras que te obligarán a despacharlo."
      },
      {
        question: "¿Qué ropa debo llevar en mi equipaje?",
        answer: [
          "Ropa y calzado cómodo y fresco para poder moverte sin problemas. Recomendamos llevar 1 campera liviana y 2 mudas de ropa extra.",
          "El hospedaje incluye 1 manta por cama pero NO incluye sábanas.",
          "Guía de vestimenta:",
          "• Remeras de algodón livianas / camisas manga corta",
          "• Pantalones livianos tipo joggers",
          "• Shorts o bermudas (no muy cortos)",
          "• Campera liviana para las noches o lluvias",
          "• Zapatillas o calzado urbano (evitar sandalias, ojotas, etc)",
          "• Sombreros o gorras",
          "• Toallas chicas"
        ]
      }
    ]
  },
  {
    title: "COSTOS",
    icon: "💰",
    questions: [
      {
        question: "¿Cuál es el costo total del viaje?",
        answer: "Cada uno es responsable de sacar su propio pasaje para ir a Jujuy. Puede organizar su agenda y costos sea en avión, micro o auto. El costo de $47.000 solo incluye hospedaje y comida (pero NO almuerzo)."
      },
      {
        question: "¿Hasta cuándo se puede pagar?",
        answer: "Hasta el sábado 20 de diciembre, última reunión de jóvenes previa al viaje."
      },
      {
        question: "¿Hay algún descuento o plan de pago por etapas?",
        answer: "Se puede pagar en cuotas siempre que para la fecha límite se encuentre abonado en su totalidad."
      },
      {
        question: "¿Puedo donar para otro que no puede pagar el total?",
        answer: "Sí, se puede. Para esto tenes que hablar con algún líder o responsable de la organización."
      }
    ]
  },
  {
    title: "SALUD Y SEGURIDAD",
    icon: "⚕️",
    questions: [
      {
        question: "¿Qué pasa si alguien se enferma durante el viaje?",
        answer: "Se debe avisar inmediatamente a algún líder para que se pueda actuar de inmediato."
      },
      {
        question: "¿Debo llevar mis medicamentos personales?",
        answer: "Tenes que llevar TODOS los medicamentos necesarios que tomes con regularidad recetados por un médico."
      },
      {
        question: "¿Habrá cobertura médica o seguro de viaje?",
        answer: "Cada persona deberá ser responsable y sacar seguro médico si así lo desea con la compañía que compró sus pasajes. Si tenes cobertura médica en Buenos Aires, chequeá que tengas centros de atención en San Salvador de Jujuy."
      }
    ]
  }
];

function FAQAccordion({ question, answer }: FAQItem) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-foreground/10 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 px-1 flex items-start justify-between gap-4 text-left hover:bg-muted/30 transition-colors rounded-lg"
      >
        <span className="font-bold text-foreground text-sm md:text-base leading-tight flex-1">
          {question}
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground/60 mt-0.5 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-1 pb-4 text-muted-foreground text-sm md:text-base leading-relaxed space-y-2">
          {Array.isArray(answer) ? (
            answer.map((line, idx) => (
              <p key={idx} className={line.startsWith('•') ? 'ml-4' : ''}>
                {line}
              </p>
            ))
          ) : (
            <p>{answer}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-8 pb-24">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="flex items-center justify-center gap-3">
            <HelpCircle className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
              Preguntas Frecuentes
            </h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            Toda la información que necesitás para el viaje misionero a Jujuy
          </p>
        </div>

        {/* FAQ Sections */}
        {faqData.map((section, sectionIdx) => (
          <Card key={sectionIdx} className="overflow-hidden border-foreground/10">
            <CardHeader className="bg-muted/50 border-b border-foreground/10 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl font-black uppercase tracking-wide">
                <span className="text-2xl">{section.icon}</span>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="space-y-1">
                {section.questions.map((faq, faqIdx) => (
                  <FAQAccordion key={faqIdx} {...faq} />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Footer Note */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              ¿Tenés alguna otra pregunta? Hablá con algún líder o responsable de la organización.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

