import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cardsApi } from '@/services/api';
import KanbanCard from './KanbanCard';
import styles from './KanbanColumn.module.css';

interface Card {
  id: string;
  title: string;
  description?: string;
  value?: number;
  position: number;
  columnId: string;
  contact?: { id: string; name: string } | null;
  vehicle?: { id: string; brand: string; model: string } | null;
}

interface Column {
  id: string;
  name: string;
  color?: string | null;
  cards: Card[];
}

interface Props {
  column: Column;
  boardId: string;
  onCardCreated: () => void;
}

export default function KanbanColumn({ column, boardId, onCardCreated }: Props) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const queryClient = useQueryClient();

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { columnId: column.id, position: column.cards.length },
  });

  const createCard = useMutation({
    mutationFn: (t: string) =>
      cardsApi.create({ title: t, columnId: column.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] });
      onCardCreated();
      setTitle('');
      setAdding(false);
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) createCard.mutate(title.trim());
  };

  const cardIds = column.cards.map((c) => c.id);

  return (
    <div
      ref={setNodeRef}
      className={`${styles.column} ${isOver ? styles.dragOver : ''}`}
    >
      <div className={styles.header}>
        {column.color && <span className={styles.dot} style={{ background: column.color }} />}
        <span className={styles.name}>{column.name}</span>
        <span className={styles.count}>{column.cards.length}</span>
      </div>

      <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
        <div className={styles.cards}>
          {column.cards.map((card) => (
            <KanbanCard key={card.id} card={card} boardId={boardId} />
          ))}
        </div>
      </SortableContext>

      {adding ? (
        <form className={styles.addForm} onSubmit={handleAdd}>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título do card..."
            autoFocus
          />
          <div className={styles.addActions}>
            <button className="btn btn-accent" type="submit" disabled={!title.trim()}>
              Adicionar
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => setAdding(false)}>
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button className={styles.addBtn} onClick={() => setAdding(true)}>
          + Adicionar card
        </button>
      )}
    </div>
  );
}
