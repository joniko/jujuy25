import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Función para obtener el motivo de oración actual del Google Sheet
async function getCurrentPrayerMotive() {
  try {
    const sheetsUrl = process.env.NEXT_PUBLIC_SHEETS_URL;
    if (!sheetsUrl) {
      console.log('NEXT_PUBLIC_SHEETS_URL not configured, using default values');
      const currentHour = new Date().getHours();
      return { 
        title: 'Únete a orar con nosotros', 
        body: 'Cadena de oración 24/7 - Cada hora un nuevo motivo',
        hour: currentHour.toString()
      };
    }

    const response = await fetch(sheetsUrl, { 
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    
    // Parse CSV manualmente (simple parser para Edge runtime)
    const lines = csvText.split('\n');
    
    // Obtener hora actual
    const now = new Date();
    const currentHour = now.getHours();
    
    // Buscar el motivo que corresponde a la hora actual
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;
      
      // Parse la línea (considerando que puede haber comas dentro de comillas)
      const match = line.match(/^([^,]*),([^,]*),(.*)$/);
      if (!match) continue;
      
      const hora = match[1].trim();
      const titulo = match[2].trim().replace(/^"|"$/g, '');
      const bajada = match[3].trim().replace(/^"|"$/g, '');
      
      // Convertir hora del CSV al formato de 24h
      let csvHour = 0;
      if (hora.includes('AM') || hora.includes('PM')) {
        // Formato 12h
        const hourMatch = hora.match(/(\d+):?(\d*)\s*(AM|PM)/i);
        if (hourMatch) {
          csvHour = parseInt(hourMatch[1]);
          if (hourMatch[3].toUpperCase() === 'PM' && csvHour !== 12) {
            csvHour += 12;
          } else if (hourMatch[3].toUpperCase() === 'AM' && csvHour === 12) {
            csvHour = 0;
          }
        }
      } else {
        // Formato 24h
        const hourMatch = hora.match(/(\d+)/);
        if (hourMatch) {
          csvHour = parseInt(hourMatch[1]);
        }
      }
      
      if (csvHour === currentHour) {
        return { title: titulo, body: bajada, hour: currentHour.toString() };
      }
    }
    
    // Si no se encuentra, devolver el primero disponible
    return { 
      title: 'Únete a orar con nosotros', 
      body: 'Cadena de oración 24/7',
      hour: currentHour.toString()
    };
  } catch (error) {
    console.error('Error fetching prayer motive:', error);
    return { 
      title: 'Únete a orar con nosotros', 
      body: 'Cadena de oración 24/7',
      hour: new Date().getHours().toString()
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Valores por defecto
    let title = searchParams.get('title') || 'Únete a orar con nosotros';
    let body = searchParams.get('body') || 'Cadena de oración 24/7 - Cada hora un nuevo motivo';
    let hour = searchParams.get('hour') || new Date().getHours().toString();
    
    // Si no vienen parámetros, intentar obtener del Google Sheet
    if (!searchParams.has('title') && !searchParams.has('body')) {
      try {
        const currentMotive = await getCurrentPrayerMotive();
        if (currentMotive && currentMotive.title && currentMotive.body) {
          title = currentMotive.title;
          body = currentMotive.body;
          hour = currentMotive.hour;
        }
      } catch (error) {
        console.error('Error getting current motive, using defaults:', error);
        // Usar los valores por defecto ya asignados
      }
    }

    // Cargar fuente Inter desde Google Fonts
    const interRegular = await fetch(
      'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff'
    ).then((res) => res.arrayBuffer());

    const interBold = await fetch(
      'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff'
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fef6f1',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #fde8d9 2%, transparent 0%), radial-gradient(circle at 75px 75px, #fde8d9 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            padding: '60px',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 700,
                fontFamily: 'Inter',
                background: 'linear-gradient(to right, #9f1239, #dc2626)',
                backgroundClip: 'text',
                color: 'transparent',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Oremos 24/7 🙏
            </div>
          </div>

          {/* Main Content Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'white',
              borderRadius: '24px',
              padding: '48px',
              maxWidth: '900px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: '3px solid #fca5a5',
            }}
          >
            {/* Hour badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  backgroundColor: '#fee2e2',
                  color: '#991b1b',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  fontSize: 20,
                  fontWeight: 700,
                  fontFamily: 'Inter',
                  display: 'flex',
                }}
              >
                🕐 {hour}:00
              </div>
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                fontFamily: 'Inter',
                color: '#1f2937',
                marginBottom: '24px',
                lineHeight: 1.2,
                display: 'flex',
              }}
            >
              {title}
            </div>

            {/* Body */}
            <div
              style={{
                fontSize: 28,
                fontFamily: 'Inter',
                color: '#6b7280',
                lineHeight: 1.5,
                display: 'flex',
              }}
            >
              {body}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: '40px',
              fontSize: 32,
              color: '#9f1239',
              fontWeight: 700,
              fontFamily: 'Inter',
              display: 'flex',
            }}
          >
            oremos.app
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: interRegular,
            style: 'normal',
            weight: 400,
          },
          {
            name: 'Inter',
            data: interBold,
            style: 'normal',
            weight: 700,
          },
        ],
      }
    );
  } catch (e) {
    console.error(e);
    return new Response('Failed to generate image', { status: 500 });
  }
}

