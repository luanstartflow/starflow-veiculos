import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { boardsApi } from '@/services/api';
import styles from './ListPage.module.css';
import boardStyles from './BoardsManagePage.module.css';

interface Column {
  id: string;
  name: string;
  position: number;
  color?: string | null;
  _count: { cards: number };
}

interface Board {
  id: string;
  name: string;
  columns: Column[];
}

const COLOR_OPTIONS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6B7280'];

export default function BoardsManagePage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [newBoardName, setNewBoardName] = useState('');
  const [expandedBoard, setExpandedBoard] = useState<string | null>(null);
  const [newColName, setNewColName] = useState('');
  const [newColColor, setNewColColor] = useState(COLOR_OPTIONS[0]);
  const [editingCol, setEditingCol] = useState<{ id: string; name: string; color: string } | null>(null);

  const { data: boards = [], isLoading } = useQuery<Board[]>({
    queryKey: ['boards'],
    queryFn: boardsApi.list,
  });

  const createBoard = useMutation({
    mutationFn: (name: string) => boardsApi.create(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      setNewBoardName('');
    },
  });

  const addColumn = useMutation({
    mutationFn: ({ boardId, name, color }: { boardId: string; name: string; color: string }) =>
      boardsApi.addColumn(boardId, { name, color }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      setNewColName('');
      setNewColColor(COLOR_OPTIONS[0]);
    },
  });

  const updateColumn = useMutation({
    mutationFn: ({ boardId, colId, data }: { boardId: string; colId: string; data: { name?: string; color?: string } }) =>
      boardsApi.updateColumn(boardId, colId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      setEditingCol(null);
    },
  });

  const removeColumn = useMutation({
    mutationFn: ({ boardId, colId }: { boardId: string; colId: string }) =>
      boardsApi.removeColumn(boardId, colId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['boards'] }),
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gerenciar Quadros</h1>
      </div>

      {/* Create board */}
      <div className={`card-surface ${boardStyles.createBox}`}>
        <h3 className={boardStyles.subTitle}>Novo Quadro</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className="input"
            style={{ flex: 1 }}
            placeholder="Nome do quadro..."
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && newBoardName.trim()) createBoard.mutate(newBoardName.trim()); }}
          />
          <button
            className="btn btn-primary"
            disabled={!newBoardName.trim()}
            onClick={() => createBoard.mutate(newBoardName.trim())}
          >
            Criar
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className={styles.empty}>Carregando...</p>
      ) : boards.length === 0 ? (
        <p className={styles.empty}>Nenhum quadro ainda.</p>
      ) : (
        <div className={boardStyles.boardList}>
          {boards.map((board) => (
            <div key={board.id} className={`card-surface ${boardStyles.boardItem}`}>
              <div className={boardStyles.boardHeader}>
                <span className={boardStyles.boardName}>📋 {board.name}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: 11, padding: '3px 10px' }}
                    onClick={() => navigate(`/boards/${board.id}`)}
                  >
                    Abrir
                  </button>
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: 11, padding: '3px 10px' }}
                    onClick={() => setExpandedBoard(expandedBoard === board.id ? null : board.id)}
                  >
                    {expandedBoard === board.id ? 'Fechar' : 'Editar colunas'}
                  </button>
                </div>
              </div>

              {expandedBoard === board.id && (
                <div className={boardStyles.colSection}>
                  {/* Existing columns */}
                  {board.columns.map((col) => (
                    <div key={col.id} className={boardStyles.colRow}>
                      {editingCol?.id === col.id ? (
                        <>
                          <input
                            className="input"
                            style={{ flex: 1 }}
                            value={editingCol.name}
                            onChange={(e) => setEditingCol({ ...editingCol, name: e.target.value })}
                          />
                          <div className={boardStyles.colorRow}>
                            {COLOR_OPTIONS.map((c) => (
                              <button
                                key={c}
                                className={boardStyles.colorBtn}
                                style={{ background: c, outline: editingCol.color === c ? '2px solid #000' : 'none' }}
                                onClick={() => setEditingCol({ ...editingCol, color: c })}
                              />
                            ))}
                          </div>
                          <button
                            className="btn btn-primary"
                            style={{ fontSize: 11, padding: '3px 10px' }}
                            onClick={() =>
                              updateColumn.mutate({
                                boardId: board.id,
                                colId: editingCol.id,
                                data: { name: editingCol.name, color: editingCol.color },
                              })
                            }
                          >
                            Salvar
                          </button>
                          <button
                            className="btn btn-ghost"
                            style={{ fontSize: 11, padding: '3px 8px' }}
                            onClick={() => setEditingCol(null)}
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <>
                          {col.color && (
                            <span className={boardStyles.colDot} style={{ background: col.color }} />
                          )}
                          <span className={boardStyles.colName}>{col.name}</span>
                          <span className={boardStyles.colCount}>{col._count?.cards ?? 0} cards</span>
                          <button
                            className="btn btn-ghost"
                            style={{ fontSize: 11, padding: '3px 8px', marginLeft: 'auto' }}
                            onClick={() => setEditingCol({ id: col.id, name: col.name, color: col.color ?? COLOR_OPTIONS[0] })}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-ghost"
                            style={{ fontSize: 11, padding: '3px 8px', color: 'var(--color-error, #EF4444)' }}
                            onClick={() => {
                              if (confirm('Remover coluna? Os cards serão excluídos.')) {
                                removeColumn.mutate({ boardId: board.id, colId: col.id });
                              }
                            }}
                          >
                            Remover
                          </button>
                        </>
                      )}
                    </div>
                  ))}

                  {/* Add new column */}
                  <div className={boardStyles.addColForm}>
                    <input
                      className="input"
                      style={{ flex: 1 }}
                      placeholder="Nome da coluna..."
                      value={newColName}
                      onChange={(e) => setNewColName(e.target.value)}
                    />
                    <div className={boardStyles.colorRow}>
                      {COLOR_OPTIONS.map((c) => (
                        <button
                          key={c}
                          className={boardStyles.colorBtn}
                          style={{ background: c, outline: newColColor === c ? '2px solid #000' : 'none' }}
                          onClick={() => setNewColColor(c)}
                        />
                      ))}
                    </div>
                    <button
                      className="btn btn-accent"
                      style={{ fontSize: 12, padding: '4px 12px' }}
                      disabled={!newColName.trim()}
                      onClick={() => {
                        if (newColName.trim()) {
                          addColumn.mutate({ boardId: board.id, name: newColName.trim(), color: newColColor });
                        }
                      }}
                    >
                      + Coluna
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
