import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { cardsApi } from '@/services/api';

interface CardResult {
  id: string;
  column: { boardId: string };
}

/**
 * When loaded inside the Chatwoot iframe with ?conversation=<id>,
 * looks up the card for that conversation and navigates to its board.
 */
export function useConversationContext() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const conversationParam = searchParams.get('conversation');
  const conversationId = conversationParam ? parseInt(conversationParam, 10) : null;

  const { data: cards = [] } = useQuery<CardResult[]>({
    queryKey: ['card-by-conv', conversationId],
    queryFn: () => cardsApi.list(undefined, conversationId!),
    enabled: conversationId != null && !isNaN(conversationId),
    staleTime: 30_000,
  });

  useEffect(() => {
    if (!conversationId || cards.length === 0) return;
    const card = cards[0];
    setSearchParams({}, { replace: true });
    navigate(`/boards/${card.column.boardId}`, { replace: true });
  }, [cards, conversationId, navigate, setSearchParams]);
}
