import { useKiosk } from '@/context/kiosk';
import { GetTicketScreen as GetTicketScreenView } from '@/features/get-ticket/screens/get-ticket-screen';

export default function GetTicketScreen() {
  useKiosk();
  return <GetTicketScreenView />;
}
