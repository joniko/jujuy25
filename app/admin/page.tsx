"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Papa from 'papaparse';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Edit, Trash2, Pin, LogOut } from 'lucide-react';
import { Switch } from "@/components/ui/switch";

interface FeedPost {
  titulo: string;
  descripcion: string;
  media: string;
  destacado: boolean;
  fecha: string;
}

interface LibraryItem {
  titulo: string;
  bajada: string;
  url: string;
  nombre: string;
  tipo: string;
  peso: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Feed state
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);
  const [feedDialogOpen, setFeedDialogOpen] = useState(false);
  const [editingFeedIndex, setEditingFeedIndex] = useState<number | null>(null);
  const [feedForm, setFeedForm] = useState<FeedPost>({
    titulo: '',
    descripcion: '',
    media: '',
    destacado: false,
    fecha: new Date().toISOString()
  });

  // Library state
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [libraryDialogOpen, setLibraryDialogOpen] = useState(false);
  const [editingLibraryIndex, setEditingLibraryIndex] = useState<number | null>(null);
  const [libraryForm, setLibraryForm] = useState<LibraryItem>({
    titulo: '',
    bajada: '',
    url: '',
    nombre: '',
    tipo: '',
    peso: ''
  });

  // Check authentication on mount
  useEffect(() => {
    const authToken = sessionStorage.getItem('admin_auth');
    if (authToken === 'authenticated') {
      setIsAuthenticated(true);
      loadFeedData();
      loadLibraryData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const adminUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin';

    if (username === adminUsername && password === adminPassword) {
      sessionStorage.setItem('admin_auth', 'authenticated');
      setIsAuthenticated(true);
      setLoginError('');
      loadFeedData();
      loadLibraryData();
    } else {
      setLoginError('Usuario o contraseña incorrectos');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  // Load Feed data
  const loadFeedData = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SHEETS_URL || '';
      const feedGid = process.env.NEXT_PUBLIC_SHEETS_FEED_GID || '';
      
      let sheetsUrl = baseUrl;
      if (feedGid) {
        if (baseUrl.includes('gid=')) {
          sheetsUrl = baseUrl.replace(/gid=\d+/, `gid=${feedGid}`);
        } else {
          sheetsUrl = baseUrl.replace('output=csv', `gid=${feedGid}&single=true&output=csv`);
        }
      }

      const response = await axios.get(sheetsUrl + `&t=${Date.now()}`);
      const parsedData = Papa.parse(response.data, { header: true, skipEmptyLines: true });

      const rows = parsedData.data as Array<{
        titulo?: string;
        descripcion?: string;
        media?: string;
        destacado?: string;
        fecha?: string;
      }>;

      const posts: FeedPost[] = rows
        .filter(row => row.titulo && row.titulo.trim() !== '')
        .map(row => ({
          titulo: row.titulo || '',
          descripcion: row.descripcion || '',
          media: row.media || '',
          destacado: row.destacado?.toLowerCase() === 'true' || row.destacado?.toLowerCase() === 'sí' || row.destacado?.toLowerCase() === 'si',
          fecha: row.fecha || new Date().toISOString()
        }));

      setFeedPosts(posts);
    } catch (error) {
      console.error('Error loading feed:', error);
    }
  };

  // Load Library data
  const loadLibraryData = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SHEETS_URL || '';
      const bibliotecaGid = process.env.NEXT_PUBLIC_SHEETS_BIBLIOTECA_GID || '';
      
      let sheetsUrl = baseUrl;
      if (bibliotecaGid) {
        if (baseUrl.includes('gid=')) {
          sheetsUrl = baseUrl.replace(/gid=\d+/, `gid=${bibliotecaGid}`);
        } else {
          sheetsUrl = baseUrl.replace('output=csv', `gid=${bibliotecaGid}&single=true&output=csv`);
        }
      }

      const response = await axios.get(sheetsUrl + `&t=${Date.now()}`);
      const parsedData = Papa.parse(response.data, { header: true, skipEmptyLines: true });

      const rows = parsedData.data as Array<{
        titulo?: string;
        bajada?: string;
        url?: string;
        nombre?: string;
        tipo?: string;
        peso?: string;
      }>;

      const items: LibraryItem[] = rows
        .filter(row => row.titulo && row.titulo.trim() !== '')
        .map(row => ({
          titulo: row.titulo || '',
          bajada: row.bajada || '',
          url: row.url || '',
          nombre: row.nombre || '',
          tipo: row.tipo || '',
          peso: row.peso || ''
        }));

      setLibraryItems(items);
    } catch (error) {
      console.error('Error loading library:', error);
    }
  };

  // Feed CRUD operations
  const handleOpenFeedDialog = (index: number | null = null) => {
    if (index !== null) {
      setEditingFeedIndex(index);
      setFeedForm(feedPosts[index]);
    } else {
      setEditingFeedIndex(null);
      setFeedForm({
        titulo: '',
        descripcion: '',
        media: '',
        destacado: false,
        fecha: new Date().toISOString()
      });
    }
    setFeedDialogOpen(true);
  };

  const handleSaveFeed = async () => {
    const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL || process.env.WEBHOOK_URL;
    
    if (!webhookUrl) {
      alert('⚠️ Error: WEBHOOK_URL no está configurado en las variables de entorno.');
      return;
    }

    try {
      const isEditing = editingFeedIndex !== null;
      const action = isEditing ? 'update' : 'create';
      
      const response = await axios.post(webhookUrl, {
        action: action,
        sheet: 'Feed',
        index: editingFeedIndex,
        item: feedForm
      });

      if (response.data.success) {
        // Actualizar estado local
        const updatedPosts = [...feedPosts];
        
        if (isEditing) {
          updatedPosts[editingFeedIndex] = feedForm;
        } else {
          updatedPosts.push(feedForm);
        }

        setFeedPosts(updatedPosts);
        setFeedDialogOpen(false);
        
        alert(`✅ ${isEditing ? 'Actualizado' : 'Creado'} exitosamente en Google Sheets!`);
        
        // Recargar datos después de 1 segundo
        setTimeout(() => {
          loadFeedData();
        }, 1000);
      } else {
        alert(`❌ Error: ${response.data.error || 'No se pudo guardar'}`);
      }
    } catch (error) {
      console.error('Error saving feed:', error);
      alert(`❌ Error al guardar: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  const handleDeleteFeed = async (index: number) => {
    if (!confirm('¿Estás seguro de eliminar este post?')) {
      return;
    }

    const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL || process.env.WEBHOOK_URL;
    
    if (!webhookUrl) {
      alert('⚠️ Error: WEBHOOK_URL no está configurado en las variables de entorno.');
      return;
    }

    try {
      const response = await axios.post(webhookUrl, {
        action: 'delete',
        sheet: 'Feed',
        index: index
      });

      if (response.data.success) {
        const updatedPosts = feedPosts.filter((_, i) => i !== index);
        setFeedPosts(updatedPosts);
        
        alert('✅ Eliminado exitosamente de Google Sheets!');
        
        // Recargar datos después de 1 segundo
        setTimeout(() => {
          loadFeedData();
        }, 1000);
      } else {
        alert(`❌ Error: ${response.data.error || 'No se pudo eliminar'}`);
      }
    } catch (error) {
      console.error('Error deleting feed:', error);
      alert(`❌ Error al eliminar: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  // Library CRUD operations
  const handleOpenLibraryDialog = (index: number | null = null) => {
    if (index !== null) {
      setEditingLibraryIndex(index);
      setLibraryForm(libraryItems[index]);
    } else {
      setEditingLibraryIndex(null);
      setLibraryForm({
        titulo: '',
        bajada: '',
        url: '',
        nombre: '',
        tipo: '',
        peso: ''
      });
    }
    setLibraryDialogOpen(true);
  };

  const handleSaveLibrary = async () => {
    const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL || process.env.WEBHOOK_URL;
    
    if (!webhookUrl) {
      alert('⚠️ Error: WEBHOOK_URL no está configurado en las variables de entorno.');
      return;
    }

    try {
      const isEditing = editingLibraryIndex !== null;
      const action = isEditing ? 'update' : 'create';
      
      const response = await axios.post(webhookUrl, {
        action: action,
        sheet: 'Biblioteca',
        index: editingLibraryIndex,
        item: libraryForm
      });

      if (response.data.success) {
        // Actualizar estado local
        const updatedItems = [...libraryItems];
        
        if (isEditing) {
          updatedItems[editingLibraryIndex] = libraryForm;
        } else {
          updatedItems.push(libraryForm);
        }

        setLibraryItems(updatedItems);
        setLibraryDialogOpen(false);
        
        alert(`✅ ${isEditing ? 'Actualizado' : 'Creado'} exitosamente en Google Sheets!`);
        
        // Recargar datos después de 1 segundo
        setTimeout(() => {
          loadLibraryData();
        }, 1000);
      } else {
        alert(`❌ Error: ${response.data.error || 'No se pudo guardar'}`);
      }
    } catch (error) {
      console.error('Error saving library:', error);
      alert(`❌ Error al guardar: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  const handleDeleteLibrary = async (index: number) => {
    if (!confirm('¿Estás seguro de eliminar este recurso?')) {
      return;
    }

    const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL || process.env.WEBHOOK_URL;
    
    if (!webhookUrl) {
      alert('⚠️ Error: WEBHOOK_URL no está configurado en las variables de entorno.');
      return;
    }

    try {
      const response = await axios.post(webhookUrl, {
        action: 'delete',
        sheet: 'Biblioteca',
        index: index
      });

      if (response.data.success) {
        const updatedItems = libraryItems.filter((_, i) => i !== index);
        setLibraryItems(updatedItems);
        
        alert('✅ Eliminado exitosamente de Google Sheets!');
        
        // Recargar datos después de 1 segundo
        setTimeout(() => {
          loadLibraryData();
        }, 1000);
      } else {
        alert(`❌ Error: ${response.data.error || 'No se pudo eliminar'}`);
      }
    } catch (error) {
      console.error('Error deleting library:', error);
      alert(`❌ Error al eliminar: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Admin Panel</CardTitle>
            <CardDescription className="text-center">
              Ingresa tus credenciales para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  required
                />
              </div>

              {loginError && (
                <p className="text-sm text-red-600">{loginError}</p>
              )}

              <Button type="submit" className="w-full">
                Ingresar
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.push('/')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Admin dashboard
  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Gestiona el contenido de la aplicación</p>
            </div>
          </div>
          
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="biblioteca">Biblioteca</TabsTrigger>
          </TabsList>

          {/* Feed Tab */}
          <TabsContent value="feed" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {feedPosts.length} publicaciones
              </p>
              <Button onClick={() => handleOpenFeedDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva publicación
              </Button>
            </div>

            <div className="grid gap-4">
              {feedPosts.map((post, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{post.titulo}</CardTitle>
                          {post.destacado && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                              <Pin className="w-3 h-3" />
                              Destacado
                            </span>
                          )}
                        </div>
                        {post.descripcion && (
                          <CardDescription className="line-clamp-2">
                            {post.descripcion}
                          </CardDescription>
                        )}
                        {post.media && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Media: {post.media}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenFeedDialog(index)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteFeed(index)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Biblioteca Tab */}
          <TabsContent value="biblioteca" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {libraryItems.length} recursos
              </p>
              <Button onClick={() => handleOpenLibraryDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo recurso
              </Button>
            </div>

            <div className="grid gap-4">
              {libraryItems.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{item.titulo}</CardTitle>
                        {item.bajada && (
                          <CardDescription className="line-clamp-2">
                            {item.bajada}
                          </CardDescription>
                        )}
                        <div className="mt-2 space-y-1">
                          {item.nombre && (
                            <p className="text-xs text-muted-foreground">
                              Archivos: {item.nombre}
                            </p>
                          )}
                          {item.tipo && (
                            <p className="text-xs text-muted-foreground">
                              Tipos: {item.tipo}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenLibraryDialog(index)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteLibrary(index)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Feed Dialog */}
        <Dialog open={feedDialogOpen} onOpenChange={setFeedDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingFeedIndex !== null ? 'Editar publicación' : 'Nueva publicación'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="feed-titulo">Título *</Label>
                <Input
                  id="feed-titulo"
                  value={feedForm.titulo}
                  onChange={(e) => setFeedForm({ ...feedForm, titulo: e.target.value })}
                  placeholder="Título de la publicación"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feed-descripcion">Descripción</Label>
                <Textarea
                  id="feed-descripcion"
                  value={feedForm.descripcion}
                  onChange={(e) => setFeedForm({ ...feedForm, descripcion: e.target.value })}
                  placeholder="Descripción o contenido"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feed-media">Media (URL de YouTube o imagen)</Label>
                <Input
                  id="feed-media"
                  value={feedForm.media}
                  onChange={(e) => setFeedForm({ ...feedForm, media: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=... o URL de imagen"
                />
                <p className="text-xs text-muted-foreground">
                  Acepta: URLs de YouTube, imágenes (jpg, png, etc.)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="feed-destacado"
                  checked={feedForm.destacado}
                  onCheckedChange={(checked) => setFeedForm({ ...feedForm, destacado: checked })}
                />
                <Label htmlFor="feed-destacado" className="cursor-pointer">
                  Destacar publicación (aparecerá primero)
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feed-fecha">Fecha</Label>
                <Input
                  id="feed-fecha"
                  type="datetime-local"
                  value={feedForm.fecha ? new Date(feedForm.fecha).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setFeedForm({ ...feedForm, fecha: new Date(e.target.value).toISOString() })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setFeedDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveFeed} disabled={!feedForm.titulo.trim()}>
                {editingFeedIndex !== null ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Library Dialog */}
        <Dialog open={libraryDialogOpen} onOpenChange={setLibraryDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingLibraryIndex !== null ? 'Editar recurso' : 'Nuevo recurso'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lib-titulo">Título *</Label>
                <Input
                  id="lib-titulo"
                  value={libraryForm.titulo}
                  onChange={(e) => setLibraryForm({ ...libraryForm, titulo: e.target.value })}
                  placeholder="Título del recurso"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lib-bajada">Descripción</Label>
                <Textarea
                  id="lib-bajada"
                  value={libraryForm.bajada}
                  onChange={(e) => setLibraryForm({ ...libraryForm, bajada: e.target.value })}
                  placeholder="Descripción breve"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lib-url">URLs (separadas por coma)</Label>
                <Textarea
                  id="lib-url"
                  value={libraryForm.url}
                  onChange={(e) => setLibraryForm({ ...libraryForm, url: e.target.value })}
                  placeholder="https://drive.google.com/..., https://..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lib-nombre">Nombres de archivos (separados por |)</Label>
                <Input
                  id="lib-nombre"
                  value={libraryForm.nombre}
                  onChange={(e) => setLibraryForm({ ...libraryForm, nombre: e.target.value })}
                  placeholder="Manual de Intercesor | Guía de Oración"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lib-tipo">Tipos de archivo (separados por |)</Label>
                <Input
                  id="lib-tipo"
                  value={libraryForm.tipo}
                  onChange={(e) => setLibraryForm({ ...libraryForm, tipo: e.target.value })}
                  placeholder="PDF | Video"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lib-peso">Tamaños (separados por |, opcional)</Label>
                <Input
                  id="lib-peso"
                  value={libraryForm.peso}
                  onChange={(e) => setLibraryForm({ ...libraryForm, peso: e.target.value })}
                  placeholder="2.5 MB | 15 MB"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setLibraryDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveLibrary} disabled={!libraryForm.titulo.trim()}>
                {editingLibraryIndex !== null ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}

