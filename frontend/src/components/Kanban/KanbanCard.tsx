import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CardModal from './CardModal';
import styles from './KanbanCard.module.css';

interface Card {
  id: string;
  title: string;
  description?: string;
  value?: number;
  columnId: string;
  contact?: { id: string; name: string } | null;
  vehicle?: { id: string; brand: string; model: string } | null;
}

interface Props {
  card: Card;
  boardId: string;
}

export default function KanbanCard({ card, boardId }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: { columnId: card.columnId, position: 0 },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`card-surface ${styles.card} ${isDragging ? styles.dragging : ''}`}
        onClick={(e) => {
          // Only open modal on direct click, not after drag
          if (!isDragging) {
            e.stopPropagation();
            setModalOpen(true);
          }
        }}
      >
        <p className={styles.title}>{card.title}</p>

        {card.description && (
          <p className={styles.description}>{card.description}</p>
        )}

        <div className={styles.meta}>
          {card.contact && (
            <span className={styles.tag}>👤 {card.contact.name}</span>
          )}
          {card.vehicle && (
            <span className={styles.tag}>🚗 {card.vehicle.brand} {card.vehicle.model}</span>
          )}
          {card.value != null && (
            <span className={styles.value}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(card.value)}
            </span>
          )}
        </div>
      </div>

      {modalOpen && (
        <CardModal
          cardId={card.id}
          boardId={boardId}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
