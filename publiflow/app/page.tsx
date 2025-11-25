import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">PubliFlow</h1>
      <p className="text-xl mb-8">Gestão de Parcerias para Influenciadores</p>
      <div className="flex gap-4">
        <Button>Login</Button>
        <Button variant="outline">Saiba Mais</Button>
      </div>
    </div>
  );
}
