import { redirect } from 'next/navigation';
import { ROUTES } from '@/frontend/config/routes';

export default function RootPage() {
  redirect(ROUTES.HEADACHES);
}
