"use client";

import React, {useRef, useCallback} from 'react';
import {useDrag, useDrop, DragSourceMonitor, DropTargetMonitor} from 'react-dnd';
import {ItemTypes} from './constants';
import {SidebarMenuButton} from "@/components/ui/sidebar";
import {Icons} from "@/components/icons";

interface SortableItemProps {
  id: number;
  index: number;
  moveNote: (dragIndex: number, hoverIndex: number) => void;
  children: React.ReactNode;
  handleNoteSelect: (id: number) => void;
}

export const SortableItem: React.FC<SortableItemProps> = React.memo(
  ({id, index, moveNote, children, handleNoteSelect}) => {
    const ref = useRef(null);

    const [, drop] = useDrop({
      accept: ItemTypes.NOTE,
      collect: (monitor: DropTargetMonitor) => ({
        isOver: monitor.isOver(),
        handlerId: monitor.getHandlerId(),
      }),
      drop: (item: any, monitor: DropTargetMonitor) => {
        if (!ref.current) {
          return;
        }
        const dragIndex = item.index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) {
          return;
        }

        moveNote(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
    });

    const [{isDragging}, drag] = useDrag({
      type: ItemTypes.NOTE,
      item: () => {
        return {id, index};
      },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    drag(drop(ref));

    return (
      <li
        ref={ref}
        style={{opacity: isDragging ? 0 : 1}}
        data-handler-id=""
      >
        {children}
      </li>
    );
  }
);
