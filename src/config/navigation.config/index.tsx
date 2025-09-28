// import type { NavigationTree } from '@/@types/navigation';
import IconDashboard from '@/assets/svgs/navbar/dashboard.svg';
import IconAccount from '@/assets/svgs/navbar/account.svg';
import IconCard from '@/assets/svgs/navbar/card.svg';
import IconSaving from '@/assets/svgs/navbar/save-money.svg';
import IconLoan from '@/assets/svgs/navbar/loan.svg';
import IconMoneyTransfer from '@/assets/svgs/navbar/money-transfer.svg';
import IconPayment from '@/assets/svgs/navbar/payment.svg';
import IconPhoneService from '@/assets/svgs/navbar/phone-service.svg';
import IconInsurance from '@/assets/svgs/navbar/insurance.svg';

const navigationConfig: NavigationTree[] = [
  {
    key: 'dashboard',
    path: '/dashboard',
    title: 'Trang chủ',
    translateKey: '',
    icon: IconDashboard,
    authority: [],
    subMenu: [],
  },
  {
    key: 'divider',
    path: '',
    title: '',
    translateKey: '',
    icon: IconDashboard,
    authority: [],
    subMenu: [],
  },
  {
    key: 'accounts',
    path: '/accounts',
    title: 'Tài khoản',
    translateKey: '',
    icon: IconAccount,
    authority: [],
    subMenu: [],
  },
  {
    key: 'cards',
    path: '/cards',
    title: 'Thẻ',
    translateKey: '',
    icon: IconCard,
    authority: [],
    subMenu: [],
  },
  {
    key: 'saveMoney',
    path: '/saveMoney',
    title: 'Tiết kiệm',
    translateKey: '',
    icon: IconSaving,
    authority: [],
    subMenu: [],
  },
  {
    key: 'loans',
    path: '/loans',
    title: 'Khoản vay',
    translateKey: '',
    icon: IconLoan,
    authority: [],
    subMenu: [],
  },
  {
    key: 'divider',
    path: '',
    title: '',
    translateKey: '',
    icon: IconDashboard,
    authority: [],
    subMenu: [],
  },
  {
    key: 'moneyTransfer',
    path: '/moneyTransfer',
    title: 'Chuyển tiền',
    translateKey: '',
    icon: IconMoneyTransfer,
    authority: [],
    subMenu: [],
  },
  {
    key: 'payment',
    path: '/payment',
    title: 'Thanh toán',
    translateKey: '',
    icon: IconPayment,
    authority: [],
    subMenu: [],
  },
  {
    key: 'phoneService',
    path: '/phoneService',
    title: 'Dịch vụ điện thoại',
    translateKey: '',
    icon: IconPhoneService,
    authority: [],
    subMenu: [],
  },
  {
    key: 'insurance',
    path: '/insurance',
    title: 'Bảo hiểm',
    translateKey: '',
    icon: IconInsurance,
    authority: [],
    subMenu: [],
  },
  {
    key: 'divider',
    path: '',
    title: '',
    translateKey: '',
    icon: IconDashboard,
    authority: [],
    subMenu: [],
  },
  {
    key: 'others',
    path: '/others',
    title: 'Dịch vụ khác',
    translateKey: '',
    icon: IconInsurance,
    authority: [],
    subMenu: [
      {
        key: 'test',
        path: 'test',
        authority: [],
        title: 'Test',
        translateKey: 'string',
      },
      {
        key: 'test',
        path: 'test',
        authority: [],
        title: 'Test',
        translateKey: 'string',
      },
    ],
  },
];

export default navigationConfig;
