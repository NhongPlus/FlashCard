import { Suspense } from 'react';
import LoadingScreen from '@/components/Layout/LoadingScreen/LoadingScreen';
import AllRoutes from './AppRoutes';
import { HeaderMenu } from '@/components/Header/HeaderMenu';

const Views = () => (
  <>
    <HeaderMenu />
    <Suspense fallback={<LoadingScreen />}>
      <AllRoutes />
    </Suspense>
  </>
);

export default Views;
