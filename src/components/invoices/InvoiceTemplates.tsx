interface Template {
  id: string;
  name: string;
  description: string;
  preview_url: string;
  fields: {
    logo_position: 'left' | 'center' | 'right';
    color_scheme: string;
    footer_text?: string;
  };
} 