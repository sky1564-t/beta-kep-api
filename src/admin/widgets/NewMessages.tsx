import * as React from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex, Typography } from '@strapi/design-system';
import { useFetchClient, Widget } from '@strapi/strapi/admin';

type Message = {
  documentId: string;
  name: string;
  subject?: string | null;
  message: string;
  email?: string | null;
  phone?: string | null;
  createdAt: string;
};

const timeAgo = (iso: string) => {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 60) return `${Math.max(minutes, 1)} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

export const NewMessagesWidget = () => {
  const { get } = useFetchClient();
  const [state, setState] = React.useState<{ loading: boolean; error: boolean; items: Message[]; total: number }>({
    loading: true,
    error: false,
    items: [],
    total: 0,
  });

  React.useEffect(() => {
    let cancelled = false;

    get('/content-manager/collection-types/api::contact-message.contact-message', {
      params: {
        page: 1,
        pageSize: 4,
        sort: 'createdAt:DESC',
        filters: { $and: [{ state: { $eq: 'new' } }] },
      },
    })
      .then(({ data }: any) => {
        if (!cancelled) {
          setState({
            loading: false,
            error: false,
            items: data?.results ?? [],
            total: data?.pagination?.total ?? 0,
          });
        }
      })
      .catch(() => {
        if (!cancelled) setState({ loading: false, error: true, items: [], total: 0 });
      });

    return () => {
      cancelled = true;
    };
  }, [get]);

  if (state.loading) return <Widget.Loading />;
  if (state.error) return <Widget.Error />;
  if (!state.items.length) return <Widget.NoData>No new messages.</Widget.NoData>;

  return (
    <Flex direction="column" alignItems="stretch" gap={2}>
      <Typography variant="pi" textColor="neutral600">
        {state.total} new {state.total === 1 ? 'message' : 'messages'} waiting for a reply
      </Typography>
      {state.items.map((item) => (
        <Link
          key={item.documentId}
          to={`/content-manager/collection-types/api::contact-message.contact-message/${item.documentId}`}
          style={{ textDecoration: 'none' }}
        >
          <Box padding={3} hasRadius background="neutral100">
            <Flex justifyContent="space-between" alignItems="baseline" gap={2}>
              <Typography fontWeight="bold" textColor="neutral800" ellipsis>
                {item.name}
              </Typography>
              <Typography variant="pi" textColor="neutral500">
                {timeAgo(item.createdAt)}
              </Typography>
            </Flex>
            <Typography variant="pi" textColor="neutral600" ellipsis tag="p">
              {item.subject ? `${item.subject} — ` : ''}
              {item.message}
            </Typography>
          </Box>
        </Link>
      ))}
    </Flex>
  );
};
