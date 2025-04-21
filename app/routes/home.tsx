import type { Route } from './+types/home';
import Feed from '../../src/pages/Feed';

export function meta /* eslint-disable-next-line @typescript-eslint/no-unused-vars */(
  _args: Route.MetaArgs
) {
  return [
    { title: 'HipVan Feed' },
    { name: 'description', content: 'Responsive Feed with Video Banner' },
  ];
}

export default function Home() {
  return <Feed />;
}
