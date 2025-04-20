
'use client';

import React, {useState, useEffect} from 'react';
import {SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarTrigger, SidebarInput} from '@/components/ui/sidebar';
import {Card, CardContent} from '@/components/ui/card';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Icons} from '@/components/icons';

interface Note {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

const initialNotes: Note[] = [
  {
    id: 1,
    content: 'This is the first note.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    content: 'This is the second note.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function Home() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [noteContent, setNoteContent] = useState<string>('');

  useEffect(() => {
    if (selectedNoteId) {
      const selectedNote = notes.find((note) => note.id === selectedNoteId);
      if (selectedNote) {
        setNoteContent(selectedNote.content);
      }
    }
  }, [selectedNoteId, notes]);

  const handleNoteSelect = (id: number) => {
    setSelectedNoteId(id);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNoteContent(e.target.value);
  };

  const handleUpdateNote = () => {
    if (selectedNoteId) {
      const updatedNotes = notes.map((note) =>
        note.id === selectedNoteId ? {...note, content: noteContent, updated_at: new Date().toISOString()} : note
      );
      setNotes(updatedNotes);
    }
  };

  const handleDeleteNote = () => {
    if (selectedNoteId) {
      const updatedNotes = notes.filter((note) => note.id !== selectedNoteId);
      setNotes(updatedNotes);
      setSelectedNoteId(null);
      setNoteContent('');
    }
  };

  const handleAddNote = () => {
    const newNote: Note = {
      id: notes.length > 0 ? Math.max(...notes.map((note) => note.id)) + 1 : 1,
      content: 'New note content',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setNotes([...notes, newNote]);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarTrigger className="md:hidden" />
            <div className="flex items-center space-x-2">
              <Icons.file className="h-6 w-6" />
              <h4 className="font-semibold text-md">NoteNest</h4>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarInput placeholder="Search notes..." />
            <SidebarMenu>
              {notes.map((note) => (
                <SidebarMenuItem key={note.id}>
                  <SidebarMenuButton onClick={() => handleNoteSelect(note.id)}>Note {note.id}</SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <Button onClick={handleAddNote} className="w-full mt-4">
              Add Note
            </Button>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 p-4">
          <Card className="h-full">
            <CardContent className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Note Content</h2>
                <div>
                  <Button onClick={handleUpdateNote} variant="secondary" className="mr-2">
                    Update
                  </Button>
                  <Button onClick={handleDeleteNote} variant="destructive">
                    Delete
                  </Button>
                </div>
              </div>
              <Textarea value={noteContent} onChange={handleContentChange} className="h-full resize-none" />
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
}
