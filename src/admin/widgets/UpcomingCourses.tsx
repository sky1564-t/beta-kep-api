import * as React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Box, Flex, Typography } from '@strapi/design-system';
import { useFetchClient, Widget } from '@strapi/strapi/admin';

type Course = {
  documentId: string;
  title: string;
  startDate: string;
  endDate?: string | null;
  registrationStatus: 'open' | 'waitlist' | 'full' | 'closed';
  locale?: string;
};

const STATUS: Record<Course['registrationStatus'], { label: string; bg: string; text: string }> = {
  open: { label: 'Open', bg: 'success100', text: 'success700' },
  waitlist: { label: 'Waitlist', bg: 'warning100', text: 'warning700' },
  full: { label: 'Full', bg: 'danger100', text: 'danger700' },
  closed: { label: 'Closed', bg: 'neutral150', text: 'neutral700' },
};

const formatDate = (value?: string | null) =>
  value
    ? new Date(`${value}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

export const UpcomingCoursesWidget = () => {
  const { get } = useFetchClient();
  const [state, setState] = React.useState<{ loading: boolean; error: boolean; items: Course[] }>({
    loading: true,
    error: false,
    items: [],
  });

  React.useEffect(() => {
    let cancelled = false;
    const today = new Date().toISOString().slice(0, 10);

    get('/content-manager/collection-types/api::course.course', {
      params: {
        page: 1,
        pageSize: 5,
        sort: 'startDate:ASC',
        filters: { $and: [{ startDate: { $gte: today } }] },
      },
    })
      .then(({ data }: any) => {
        if (!cancelled) setState({ loading: false, error: false, items: data?.results ?? [] });
      })
      .catch(() => {
        if (!cancelled) setState({ loading: false, error: true, items: [] });
      });

    return () => {
      cancelled = true;
    };
  }, [get]);

  if (state.loading) return <Widget.Loading />;
  if (state.error) return <Widget.Error />;
  if (!state.items.length) return <Widget.NoData>No upcoming courses yet.</Widget.NoData>;

  return (
    <Flex direction="column" alignItems="stretch" gap={2}>
      {state.items.map((course) => {
        const status = STATUS[course.registrationStatus] ?? STATUS.closed;
        const range = [formatDate(course.startDate), formatDate(course.endDate)].filter(Boolean).join(' – ');
        const href = `/content-manager/collection-types/api::course.course/${course.documentId}${
          course.locale ? `?plugins[i18n][locale]=${course.locale}` : ''
        }`;

        return (
          <Link key={course.documentId} to={href} style={{ textDecoration: 'none' }}>
            <Box padding={3} hasRadius background="neutral100">
              <Flex justifyContent="space-between" alignItems="center" gap={3}>
                <Flex direction="column" alignItems="flex-start" gap={1} style={{ minWidth: 0 }}>
                  <Typography fontWeight="bold" textColor="neutral800" ellipsis>
                    {course.title}
                  </Typography>
                  <Typography variant="pi" textColor="neutral600">
                    {range}
                  </Typography>
                </Flex>
                <Badge backgroundColor={status.bg} textColor={status.text}>
                  {status.label}
                </Badge>
              </Flex>
            </Box>
          </Link>
        );
      })}
    </Flex>
  );
};
