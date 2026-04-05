import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { boardsApi, cardsApi } from '@/services/api';
import KanbanColumn from '@/components/Kanban/KanbanColumn';
import styles from './BoardPage.module.css';

interface Card {
  id: string;
  title: string;
  description?: string;
  value?: number;
  position: number;
  columnId: string;
  contact?: { id: string; name: string } | null;
  vehicle?: { id: string; brand: string; model: string } | null;
  assignee?: { id: string; name: string } | null;
  dueDate?: string | null;
}

interface Column {
  id: string;
  name: string;
  position: number;
  color?: string | null;
  cards: Card[];
}

interface Board {
  id: string;
  name: string;
  columns: Column[];
}

export default function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const queryClient = useQueryClient();

  const { data: board, isLoading } = useQuery<Board>({
    queryKey: ['board', boardId],
    queryFn: () => boardsApi.get(boardId!),
    enabled: !!boardId,
  });

  const moveMutation = useMutation({
    mutationFn: ({ cardId, columnId, position }: { cardId: string; columnId: string; position: number }) =>
      cardsApi.move(cardId, columnId, position),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['board', boardId] }),
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // over.id is either a column id or a card id
    const targetColumnId = (over.data.current as { columnId?: string })?.columnId ?? (over.id as string);
    const targetPosition = (over.data.current as { position?: number })?.position ?? 0;

    moveMutation.mutate({
      cardId: active.id as string,
      columnId: targetColumnId,
      position: targetPosition,
    });
  };

  if (isLoading) return <div className={styles.loading}>Carregando quadro...</div>;
  if (!board) return <div className={styles.loading}>Quadro não encontrado.</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>📋 {board.name}</h1>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className={styles.columns}>
          {board.columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              boardId={board.id}
              onCardCreated={() => queryClient.invalidateQueries({ queryKey: ['board', boardId] })}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
