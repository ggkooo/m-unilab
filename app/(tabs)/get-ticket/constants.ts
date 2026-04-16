import type { ServiceOption } from './types';

export const DEFAULT_LOCATION = 'UNILAB';

export const SERVICE_OPTIONS: ServiceOption[] = [
  {
    icon: 'support-agent',
    title: 'Atendimento Normal',
    subtitle: 'Atendimento geral para orientacoes e solicitacoes comuns.',
    variant: 'primary',
  },
  {
    icon: 'priority-high',
    title: 'Atendimento Preferencial',
    subtitle: 'Prioridade para os publicos com atendimento preferencial.',
    variant: 'warning',
    badges: ['60+', 'Gestante', 'Crianca de colo', 'Autista', 'Deficiente'],
  },
  {
    icon: 'inventory-2',
    title: 'Retirada de Exames ou Entrega de Amostras',
    subtitle: 'Atendimento para recebimento de exames ou entrega de amostras.',
    variant: 'success',
    fullWidth: true,
  },
];
