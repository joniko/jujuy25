import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Obtener parámetros de la URL o valores por defecto
    const title = searchParams.get('title') || 'Únete a orar con nosotros';
    const body = searchParams.get('body') || 'Cadena de oración 24/7';
    const hour = searchParams.get('hour') || new Date().getHours().toString();

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

