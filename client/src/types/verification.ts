export interface Service {
  key: string;
  name: string;
  description: string;
  icon?: React.ElementType;
}

export interface VerificationLayoutProps {
  title: string;
  description: string;
  services: Service[];
  selectedService: Service;
  onServiceChange: (service: Service) => void;
  children: React.ReactNode;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'file' | 'json' | 'radio' | 'camera';
  required: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  accept?: string;
  pattern?: string;
  title?: string;
}
