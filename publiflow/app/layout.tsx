import './globals.css';
import { ReactNode } from 'react';

// Metadados são essenciais para o SEO
export const metadata = {
  title: 'PubliFlow | Gestão de Parcerias para Influenciadores',
  description: 'Otimize seus acordos de permuta e pagos.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="dark">
      {/* O body está limpo, sem classes extras, para evitar erro de sintaxe */}
      <body>
        {children}
      </body>
    </html>
  );
}