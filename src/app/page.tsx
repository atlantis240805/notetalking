'use client';

import React, {useState, useEffect, useCallback} from 'react';
import {SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarTrigger, SidebarInput} from '@/components/ui/sidebar';
import {Card, CardContent} from '@/components/ui/card';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Icons} from '@/components/icons';
import {useToast} from "@/hooks/use-toast";
import {
  DndProvider,
  useDrag,
  useDrop,
  DragSourceMonitor,
  DropTargetMonitor,
} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {SortableItem} from './SortableItem';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";

interface Note {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  isFavorite?: boolean;
}

const initialNotes: Note[] = [
  {
    id: 1,
    content: 'This is the first note.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: ['example', 'important'],
    isFavorite: false,
  },
  {
    id: 2,
    content: 'This is the second note.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: ['test'],
    isFavorite: true,
  },
];

enum ItemTypes {
  NOTE = 'note',
}

interface DragItem {
  id: number;
  index: number;
  type: string;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [noteContent, setNoteContent] = useState<string>('');
  const [newTag, setNewTag] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // 'asc' or 'desc'
  const {toast} = useToast();

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
      toast({
        title: "Note Updated",
        description: "Your note has been updated successfully.",
      });
    }
  };

  const handleDeleteNote = () => {
    if (selectedNoteId) {
      const updatedNotes = notes.filter((note) => note.id !== selectedNoteId);
      setNotes(updatedNotes);
      setSelectedNoteId(null);
      setNoteContent('');
      toast({
        title: "Note Deleted",
        description: "Your note has been deleted.",
      });
    }
  };

  const handleAddNote = () => {
    const newNote: Note = {
      id: notes.length > 0 ? Math.max(...notes.map((note) => note.id)) + 1 : 1,
      content: 'New note content',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags: [],
      isFavorite: false,
    };
    setNotes([...notes, newNote]);
    toast({
      title: "Note Added",
      description: "A new note has been added.",
    });
  };

  const addTagToNote = () => {
    if (selectedNoteId && newTag.trim() !== '') {
      const updatedNotes = notes.map((note) => {
        if (note.id === selectedNoteId) {
          const updatedTags = note.tags ? [...note.tags, newTag.trim()] : [newTag.trim()];
          return {...note, tags: updatedTags};
        }
        return note;
      });
      setNotes(updatedNotes);
      setNewTag('');
      toast({
        title: "Tag Added",
        description: `Tag "${newTag.trim()}" has been added to the note.`,
      });
    }
  };

  const removeTagFromNote = (tagToRemove: string) => {
    if (selectedNoteId) {
      const updatedNotes = notes.map((note) => {
        if (note.id === selectedNoteId) {
          const updatedTags = note.tags ? note.tags.filter((tag) => tag !== tagToRemove) : [];
          return {...note, tags: updatedTags};
        }
        return note;
      });
      setNotes(updatedNotes);
      toast({
        title: "Tag Removed",
        description: `Tag "${tagToRemove}" has been removed from the note.`,
      });
    }
  };

  const toggleFavoriteNote = () => {
    if (selectedNoteId) {
      const updatedNotes = notes.map((note) =>
        note.id === selectedNoteId ? {...note, isFavorite: !note.isFavorite} : note
      );
      setNotes(updatedNotes);
      toast({
        title: "Note Favorited",
        description: "Note has been favorited/unfavorited.",
      });
    }
  };

  const sortedNotes = [...notes].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();

    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const moveNote = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setNotes((prevNotes) => {
        const newNotes = [...prevNotes];
        const [draggedNote] = newNotes.splice(dragIndex, 1);
        newNotes.splice(hoverIndex, 0, draggedNote);
        return newNotes;
      });
    },
    [setNotes]
  );

  const renderNote = useCallback(
    (note: Note, index: number) => {
      return (
        <SortableItem
          key={note.id}
          id={note.id}
          index={index}
          moveNote={moveNote}
          handleNoteSelect={handleNoteSelect}
        >
          <SidebarMenuButton onClick={() => handleNoteSelect(note.id)}>
            Note {note.id}
            {note.isFavorite && <Icons.star className="ml-2 h-4 w-4 text-yellow-500" />}
          </SidebarMenuButton>
        </SortableItem>
      );
    },
    [moveNote, handleNoteSelect]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <SidebarProvider>
        <div className="flex h-screen">
          <Sidebar collapsible="icon">
            <SidebarHeader>
              <SidebarTrigger className="md:hidden"/>
              <div className="flex items-center space-x-2">
                <Icons.file className="h-6 w-6"/>
                <h4 className="font-semibold text-md">NoteNest</h4>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarInput placeholder="Search notes..."/>
              <SidebarMenu>
                {sortedNotes.map((note, index) =>
                  renderNote(note, index)
                )}
              </SidebarMenu>
              <div className="mt-2 px-2 flex flex-col space-y-1">
                <Button onClick={handleAddNote} className="w-full">
                  Add Note
                </Button>
                <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort Order"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Oldest First</SelectItem>
                    <SelectItem value="desc">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                    <Button onClick={handleDeleteNote} variant="destructive" className="mr-2">
                      Delete
                    </Button>
                     <Button onClick={toggleFavoriteNote} variant="outline">
                      <Icons.star className="h-4 w-4 mr-2"/>
                      {notes.find(note => note.id === selectedNoteId)?.isFavorite ? 'Unfavorite' : 'Favorite'}
                    </Button>
                  </div>
                </div>
                <Textarea value={noteContent} onChange={handleContentChange} className="h-full resize-none"/>

                {selectedNoteId && (
                  <div className="mt-4">
                    <Label htmlFor="tags">Tags:</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        type="text"
                        id="tags"
                        placeholder="Add new tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                      />
                      <Button type="button" size="sm" onClick={addTagToNote}>
                        Add Tag
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      {notes.find((note) => note.id === selectedNoteId)?.tags?.map((tag) => (
                        <Button key={tag} variant="ghost" size="sm" onClick={() => removeTagFromNote(tag)}>
                          {tag} <Icons.close className="ml-1 h-3 w-3"/>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarProvider>
    </DndProvider>
  );
}
