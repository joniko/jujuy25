import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Función para obtener el motivo de oración actual del Google Sheet
async function getCurrentPrayerMotive() {
  try {
    const sheetsUrl = process.env.NEXT_PUBLIC_SHEETS_URL;
    if (!sheetsUrl) {
      throw new Error('NEXT_PUBLIC_SHEETS_URL not configured');
    }

    const response = await fetch(sheetsUrl, { cache: 'no-store' });
    const csvText = await response.text();
    
    // Parse CSV manualmente (simple parser para Edge runtime)
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    // Obtener hora actual
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    
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
    
    // Si vienen parámetros en la URL, usarlos (para el botón compartir)
    // Si no, obtener el motivo actual del Google Sheet (para OG tags)
    let title = searchParams.get('title');
    let body = searchParams.get('body');
    let hour = searchParams.get('hour');
    
    if (!title || !body) {
      const currentMotive = await getCurrentPrayerMotive();
      title = title || currentMotive.title;
      body = body || currentMotive.body;
      hour = hour || currentMotive.hour;
    }

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
                fontWeight: 'bold',
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
                  fontWeight: 'bold',
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
                fontWeight: 'bold',
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
              fontWeight: 'bold',
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
      }
    );
  } catch (e) {
    console.error(e);
    return new Response('Failed to generate image', { status: 500 });
  }
}

