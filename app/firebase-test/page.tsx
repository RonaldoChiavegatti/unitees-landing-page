import { FirebaseTest } from "@/components/firebase-test";

export default function FirebaseTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Página de Teste do Firebase</h1>
      <p className="text-gray-600 mb-6">
        Esta página permite testar a integração com o Firebase para verificar se tudo está funcionando corretamente.
      </p>
      
      <FirebaseTest />
    </div>
  );
} 