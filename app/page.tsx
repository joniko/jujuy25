"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Papa from 'papaparse';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Share2, ChevronRight, MapPin, MessageCircle, Pencil } from 'lucide-react';
import FullScreenModal from '../components/FullScreenModal';
import YouTubePlayer from '../components/YouTubePlayer';
import MediaDisplay from '../components/MediaDisplay';
import { useSocket } from '../components/SocketProvider';

dayjs.extend(customParseFormat);

interface Message {
  hour: string;
  title: string;
  body: string;
  responsible: string;
  media: string;
}

export default function Home() {
  const router = useRouter();
  const { socket, onlineUsers, userList, mySocketId } = useSocket();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState({ title: '', body: '', media: '', responsible: '' });
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const messageRef = useRef({ title: '', body: '', media: '', responsible: '' });
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [currentComment, setCurrentComment] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const hasJoinedRef = useRef(false);

  // Verificar si hay datos guardados válidos al cargar
  useEffect(() => {
    const checkSavedData = () => {
      try {
        const savedData = localStorage.getItem('oremos_user_data');
        if (savedData) {
          const { name, age, church, timestamp } = JSON.parse(savedData);
          const hoursSinceSaved = (Date.now() - (timestamp || 0)) / (1000 * 60 * 60);
          
          // Si tiene datos válidos (menos de 4 horas) y tiene socket, no mostrar modal
          if (hoursSinceSaved < 4 && name && age && church) {
            return true;
          }
        }
      } catch (error) {
        console.error('Error checking saved data:', error);
      }
      return false;
    };

    const hasValidData = checkSavedData();
    setIsModalOpen(!hasValidData);
  }, []);

  // Auto-join cuando hay datos guardados y socket está conectado
  useEffect(() => {
    if (socket && !hasJoinedRef.current && !isModalOpen) {
      try {
        const savedData = localStorage.getItem('oremos_user_data');
        const savedAttendance = localStorage.getItem('oremos_attendance_data');
        const savedComment = localStorage.getItem('oremos_user_comment');
        
        if (savedData) {
          const { name, age, church, timestamp } = JSON.parse(savedData);
          const hoursSinceSaved = (Date.now() - (timestamp || 0)) / (1000 * 60 * 60);
          
          let attendance = 'online';
          if (savedAttendance) {
            const { type, timestamp: attTimestamp } = JSON.parse(savedAttendance);
            const hoursSinceAtt = (Date.now() - attTimestamp) / (1000 * 60 * 60);
            if (hoursSinceAtt < 5) {
              attendance = type;
            }
          }
          
          if (hoursSinceSaved < 4 && name && age && church) {
            socket.emit('newUser', {
              name: name.trim() || 'Anónimo',
              age: age.trim() || 'N/A',
              church: church.trim() || 'N/A',
              attendance: attendance
            });
            
            // Restaurar comentario si existe
            if (savedComment && savedComment.trim()) {
              setCurrentComment(savedComment);
              // Esperar un momento para que el usuario se registre primero
              setTimeout(() => {
                socket.emit('updateComment', { comment: savedComment.trim() });
              }, 500);
            }
            
            hasJoinedRef.current = true;
          }
        }
      } catch (error) {
        console.error('Error auto-joining:', error);
      }
    }
  }, [socket, isModalOpen]);

  useEffect(() => {
    // Update current comment if user's comment changed
    const myUser = userList?.find((u) => u.id === mySocketId);
    if (myUser) {
      setCurrentComment(myUser.comment || '');
    }
  }, [userList, mySocketId]);

  useEffect(() => {
    const fetchMessages = async (isInitial = false) => {
      try {
        // Solo mostrar loading en el fetch inicial
        if (isInitial) {
          setIsInitialLoading(true);
        }

        const sheetsUrl = process.env.NEXT_PUBLIC_SHEETS_URL || '';
        // Agregar timestamp para evitar cache del navegador
        const cacheBuster = `&t=${Date.now()}`;
        const response = await axios.get(sheetsUrl + cacheBuster, {
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        const parsedData = Papa.parse(response.data, { header: true, skipEmptyLines: true });

        const messages: Message[] = (parsedData.data as Array<{ 
          hora: string; 
          titulo?: string; 
          titutlo?: string; 
          bajada: string; 
          responsable?: string; 
          'Video o imagen'?: string;
          'video/imagen'?: string;
          media?: string;
        }>).map((row) => {
          if (isInitial) {
            console.log('📋 CSV Row:', row);
            console.log('🔍 Available keys:', Object.keys(row));
          }
          
          return {
            hour: row.hora,
            title: row.titulo || row.titutlo || '', // Fallback por si hay typo en el CSV
            body: row.bajada,
            responsible: row.responsable || '',
            media: row['Video o imagen'] || row['video/imagen'] || row.media || ''
          };
        });

        const currentTime = dayjs();
        const currentHour = currentTime.format('h A');

        const currentMessage = messages.find((message: Message) => {
          // Limpiar el formato del CSV: "1:00 a. m." -> "1:00 AM"
          const cleanHour = message.hour
            .replace(/\s+/g, ' ')  // Normalizar espacios
            .replace('a. m.', 'AM')
            .replace('p. m.', 'PM')
            .replace('a.m.', 'AM')
            .replace('p.m.', 'PM')
            .trim();
          
          const messageTime = dayjs(cleanHour, 'h:mm A');
          return currentHour === messageTime.format('h A');
        });

        if (currentMessage) {
          // Crear objeto nuevo para comparar
          const newMessage = {
            title: currentMessage.title,
            body: currentMessage.body,
            media: currentMessage.media,
            responsible: currentMessage.responsible
          };

          // Solo actualizar si hay cambios
          const hasChanges = JSON.stringify(newMessage) !== JSON.stringify(messageRef.current);
          
          if (hasChanges) {
            if (!isInitial) {
              console.log('✅ Cambios detectados en el Excel - Actualizando motivo de oración');
            }
            messageRef.current = newMessage;
            setMessage(newMessage);
          } else if (!isInitial) {
            console.log('ℹ️ Sin cambios detectados');
          }

          if (isInitial) {
            console.log('📊 Current Message Data:', currentMessage);
            console.log('🎬 Media URL:', currentMessage.media);
            console.log('👤 Responsible:', currentMessage.responsible);
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        if (isInitial) {
          setIsInitialLoading(false);
        }
      }
    };

    // Fetch inicial
    fetchMessages(true);
    
    // Auto-refresh cada 30 segundos
    const refreshInterval = setInterval(() => {
      console.log('🔄 Verificando cambios en Google Sheets...');
      fetchMessages(false);
    }, 30000);

    return () => {
      clearInterval(refreshInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleJoin = ({ name, age, church, attendance }: { name: string; age: string; church: string; attendance: 'online' | 'presencial' }) => {
    if (socket) {
      socket.emit('newUser', {
        name: name.trim() || 'Anónimo',
        age: age.trim() || 'N/A',
        church: church.trim() || 'N/A',
        attendance: attendance
      });
      hasJoinedRef.current = true;
      setIsModalOpen(false);
    }
  };

  const handleShare = async () => {
    const currentHour = new Date().getHours();
    
    // Verificar si el navegador soporta Web Share API
    if (!navigator.share) {
      // Fallback: copiar al clipboard
      const shareText = `🙏 Únete a orar con nosotros\n\n${message.title}\n${message.body}\n\n👉 https://oremos.app`;
      try {
        await navigator.clipboard.writeText(shareText);
        alert('¡Texto copiado! Ahora puedes pegarlo donde quieras.');
      } catch (err) {
        console.error('Error al copiar:', err);
      }
      return;
    }

    try {
      const shareData: ShareData = {
        title: `Oremos 24/7 - ${message.title}`,
        text: `🙏 ${message.title}\n\n${message.body}\n\nÚnete a orar con nosotros:`,
        url: 'https://oremos.app'
      };

      // Intentar agregar imagen OG dinámica si el navegador lo soporta
      if (navigator.canShare) {
        try {
          // Generar URL de la imagen OG con el motivo actual
          const ogImageUrl = `/api/og?title=${encodeURIComponent(message.title)}&body=${encodeURIComponent(message.body)}&hour=${currentHour}`;
          const response = await fetch(ogImageUrl);
          
          if (response.ok) {
            const blob = await response.blob();
            const file = new File([blob], 'oremos-motivo.png', { type: 'image/png' });
            
            // Verificar si el navegador puede compartir archivos
            const dataWithFile = { ...shareData, files: [file] };
            if (navigator.canShare(dataWithFile)) {
              await navigator.share(dataWithFile);
              return;
            }
          }
        } catch {
          console.log('No se pudo cargar la imagen OG, compartiendo sin ella');
        }
      }

      // Compartir sin imagen si no se pudo agregar
      await navigator.share(shareData);
    } catch (err) {
      // Usuario canceló o error
      if ((err as Error).name !== 'AbortError') {
        console.error('Error al compartir:', err);
      }
    }
  };

  const handleOpenCommentDialog = () => {
    const myUser = userList.find(u => u.id === mySocketId);
    const userComment = myUser?.comment || '';
    
    // Si no hay comentario en el servidor, intentar cargar desde localStorage
    if (!userComment) {
      try {
        const savedComment = localStorage.getItem('oremos_user_comment');
        if (savedComment) {
          setCurrentComment(savedComment);
        }
      } catch (error) {
        console.error('Error loading comment:', error);
      }
    } else {
      setCurrentComment(userComment);
    }
    
    setCommentDialogOpen(true);
  };

  const handleSaveComment = () => {
    if (socket) {
      socket.emit('updateComment', { comment: currentComment.trim() });
      
      // Guardar comentario en localStorage para persistencia
      try {
        localStorage.setItem('oremos_user_comment', currentComment.trim());
      } catch (error) {
        console.error('Error saving comment:', error);
      }
      
      setCommentDialogOpen(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleUpdateProfile = ({ name, age, church, attendance }: { name: string; age: string; church: string; attendance: 'online' | 'presencial' }) => {
    if (socket) {
      socket.emit('newUser', {
        name: name.trim() || 'Anónimo',
        age: age.trim() || 'N/A',
        church: church.trim() || 'N/A',
        attendance: attendance
      });
      setIsEditModalOpen(false);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-4 md:space-y-6">

          {/* Current Prayer Motive */}
          <Card 
            className="bg-primary/5 border-primary cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push('/cronograma')}
          >
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                  <CardTitle className="text-sm font-bold uppercase text-primary tracking-wide">Motivo de Oración</CardTitle>
                </div>
                <ChevronRight className="w-5 h-5 text-primary" />
              </div>
              {isInitialLoading ? (
                <>
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-5/6" />
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <CardTitle className="text-2xl md:text-3xl md:leading-tight">{message.title}</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">
                      {message.body}
                    </CardDescription>
                  </div>

                   {/* Media del motivo actual */}
                   {!isInitialLoading && message.media && (
                     <CardContent onClick={(e) => e.stopPropagation()} className="p-0">
                       <MediaDisplay media={message.media} title={message.title} />
                     </CardContent>
                   )}
                  
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare();
                    }}
                    variant="outline"
                    className="w-full sm:w-auto border-primary/20 hover:bg-primary/10"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartir
                  </Button>
                </>
              )}
            </CardHeader>
            
          </Card>
          
          {/* YouTube Music Player - Solo se muestra después de unirse */}
          {!isModalOpen && <YouTubePlayer autoplay={true} />}

          {/* Online Users Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>
                  {onlineUsers} {onlineUsers === 1 ? 'persona' : 'personas'} orando ahora
                </span>
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              </CardTitle>
              {userList.some(u => u.attendance === 'presencial') && (
                <p className="text-sm text-muted-foreground">
                  {userList.filter(u => u.attendance === 'presencial').length} presencial{userList.filter(u => u.attendance === 'presencial').length !== 1 ? 'es' : ''} • {userList.filter(u => u.attendance !== 'presencial').length} online
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userList.map((user, index) => {
                  const isMyUser = user.id === mySocketId;
                  
                  return (
                    <div key={index} className="flex items-start space-x-4 py-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium leading-none">
                            {user.name}
                            {isMyUser && <span className="text-xs text-muted-foreground">(tú)</span>}
                          </p>
                          {user.attendance === 'presencial' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                              <MapPin className="w-3 h-3" />
                              Presencial
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {user.age} años • {user.church}
                        </p>
                        {user.comment && (
                          <p className="text-sm text-muted-foreground italic mt-1 line-clamp-2">
                            &quot;{user.comment}&quot;
                          </p>
                        )}
                      </div>
                      {isMyUser && !isModalOpen && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0"
                            onClick={handleEditProfile}
                            title="Editar perfil"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0"
                            onClick={handleOpenCommentDialog}
                            title="Agregar comentario"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <FullScreenModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onJoin={handleJoin}
      />

      {/* Edit Profile Modal */}
      <FullScreenModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onJoin={handleUpdateProfile}
      />

      {/* Comment Dialog */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Comentario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Comparte una impresión espiritual, consulta o indicación (máx. 280 caracteres)
            </p>
            <Input
              placeholder="Escribe tu comentario..."
              value={currentComment}
              onChange={(e) => setCurrentComment(e.target.value.slice(0, 280))}
              maxLength={280}
            />
            <p className="text-xs text-muted-foreground text-right">
              {currentComment.length}/280
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCommentDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveComment}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
