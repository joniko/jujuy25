"use client";

import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Papa from 'papaparse';
import { fetchWithOfflineFallback, isOnline } from '@/lib/offline-cache';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  icon: string;
  questions: FAQItem[];
}

// Mapeo de categorías a iconos
const categoryIcons: Record<string, string> = {
  'Logística General': '🚌',
  'Alimentación': '🍽️',
  'Costos': '💰',
  'Salud y Seguridad': '⚕️'
};

function FAQAccordion({ question, answer }: FAQItem) {
  const [isOpen, setIsOpen] = useState(false);

  // Dividir respuesta en párrafos si tiene saltos de línea o comas como separadores
  const answerLines = answer.split(/[,\n]/).map(line => line.trim()).filter(line => line.length > 0);
  const hasMultipleLines = answerLines.length > 1;

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
        <div className="px-1 pb-4 text-muted-foreground text-sm md:text-base leading-relaxed">
          {hasMultipleLines ? (
            <div className="space-y-2">
              {answerLines.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          ) : (
            <p>{answer}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [faqData, setFaqData] = useState<FAQSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setIsLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_SHEETS_URL || '';
        const gid = process.env.NEXT_PUBLIC_SHEETS_FAQS_GID || '';
        
        if (!baseUrl || !gid) {
          console.error('FAQ Sheets URL or GID not configured');
          setIsLoading(false);
          return;
        }

        // Construir URL con GID
        // Si la URL base no tiene gid, agregarlo. Si ya tiene uno, reemplazarlo
        let sheetsUrl = baseUrl;
        if (baseUrl.includes('gid=')) {
          sheetsUrl = baseUrl.replace(/gid=\d+/, `gid=${gid}`);
        } else {
          // Agregar gid a la URL
          sheetsUrl = baseUrl.replace(/output=csv/, `gid=${gid}&single=true&output=csv`);
        }

        // Usar cache offline si no hay conexión
        let csvData: string;
        const online = isOnline();
        
        if (online) {
          const cacheBuster = `&t=${Date.now()}`;
          try {
            csvData = await fetchWithOfflineFallback(sheetsUrl + cacheBuster);
          } catch (error) {
            csvData = await fetchWithOfflineFallback(sheetsUrl);
          }
        } else {
          csvData = await fetchWithOfflineFallback(sheetsUrl);
        }
        
        const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true });

        // Agrupar por categoría
        const groupedData: Record<string, FAQItem[]> = {};
        
        (parsedData.data as Array<{ 
          pregunta: string; 
          respuesta: string; 
          categoria: string;
        }>).forEach((row) => {
          const category = row.categoria?.trim() || 'General';
          const question = row.pregunta?.trim() || '';
          const answer = row.respuesta?.trim() || '';
          
          if (!question || !answer) return;
          
          if (!groupedData[category]) {
            groupedData[category] = [];
          }
          
          groupedData[category].push({
            question,
            answer
          });
        });

        // Convertir a array de secciones
        const sections: FAQSection[] = Object.entries(groupedData).map(([category, questions]) => ({
          title: category.toUpperCase(),
          icon: categoryIcons[category] || '❓',
          questions
        }));

        setFaqData(sections);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFAQs();
  }, []);

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

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden border-foreground/10">
                <CardHeader className="bg-muted/50 border-b border-foreground/10 pb-4">
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="p-4 md:p-6 space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : faqData.length === 0 ? (
          <Card className="border-muted">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No hay preguntas frecuentes disponibles en este momento.</p>
            </CardContent>
          </Card>
        ) : (
          <>
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
          </>
        )}
      </div>
    </main>
  );
}

