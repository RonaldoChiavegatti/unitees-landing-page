"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreditCard, ShieldCheck, CircleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

// Esquema de validação
const paymentSchema = z.object({
  paymentMethod: z.enum(["credit", "debit", "pix", "boleto"]),
  // Campos específicos para cartão
  cardNumber: z.string().optional()
    .refine((val) => !val || /^\d{16}$/.test(val.replace(/\s/g, "")), {
      message: "Número de cartão inválido",
    }),
  cardName: z.string().optional()
    .refine((val) => !val || val.trim().length > 3, {
      message: "Nome inválido",
    }),
  cardExpiry: z.string().optional()
    .refine((val) => !val || /^(0[1-9]|1[0-2])\/\d{2}$/.test(val), {
      message: "Data de validade inválida (MM/AA)",
    }),
  cardCvv: z.string().optional()
    .refine((val) => !val || /^\d{3,4}$/.test(val), {
      message: "CVV inválido",
    }),
  
  // Dados de instalação (para cartão)
  installments: z.enum(["1", "2", "3", "4", "5", "6"]).optional(),
})
.refine(
  (data) => {
    // Se o método for cartão, todos os campos de cartão são obrigatórios
    if (data.paymentMethod === "credit" || data.paymentMethod === "debit") {
      return !!data.cardNumber && !!data.cardName && !!data.cardExpiry && !!data.cardCvv;
    }
    return true;
  },
  {
    message: "Preencha todos os campos do cartão",
    path: ["cardNumber"],
  }
);

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  onSubmit: (values: PaymentFormValues) => void;
  isLoading?: boolean;
  total: number;
}

export function PaymentForm({ onSubmit, isLoading = false, total }: PaymentFormProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("credit")
  const [pixCodeGenerated, setPixCodeGenerated] = useState(false)
  
  // Inicializar formulário com react-hook-form
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "credit",
      cardNumber: "",
      cardName: "",
      cardExpiry: "",
      cardCvv: "",
      installments: "1",
    },
  })
  
  // Formatar número de cartão enquanto digita
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ");
    return formatted.substring(0, 19); // Limitar a 16 dígitos (19 com espaços)
  }
  
  // Formatar data de validade
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    
    if (cleaned.length >= 3) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    } else {
      return cleaned;
    }
  }
  
  // Gerar código PIX falso
  const generatePixCode = () => {
    setPixCodeGenerated(true)
  }
  
  // Manipular mudança de método de pagamento
  const handlePaymentMethodChange = (value: string) => {
    setSelectedPaymentMethod(value);
    
    if (value === "pix" && !pixCodeGenerated) {
      generatePixCode();
    }
    
    form.setValue("paymentMethod", value as PaymentFormValues["paymentMethod"]);
  }
  
  const handleSubmit = (values: PaymentFormValues) => {
    onSubmit(values)
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Método de Pagamento</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => handlePaymentMethodChange(value)}
                    defaultValue="credit"
                    className="grid grid-cols-2 gap-4 pt-2"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="credit" id="credit" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer flex items-center" htmlFor="credit">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Cartão de Crédito
                      </FormLabel>
                    </FormItem>
                    
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="debit" id="debit" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer flex items-center" htmlFor="debit">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Cartão de Débito
                      </FormLabel>
                    </FormItem>
                    
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="pix" id="pix" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer flex items-center" htmlFor="pix">
                        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13.8 17H10L6 7H9.8L13.8 17Z" fill="currentColor" />
                          <path d="M14.9 17H18.3L22.4 7H19L14.9 17Z" fill="currentColor" />
                          <path d="M14.6 3.3L12.8 6.1H15.9L17.7 3.3H14.6Z" fill="currentColor" />
                          <path d="M9.1 3.3L7.3 6.1H10.4L12.2 3.3H9.1Z" fill="currentColor" />
                          <path d="M9.3 17.7L7.5 20.5H10.6L12.4 17.7H9.3Z" fill="currentColor" />
                        </svg>
                        PIX
                      </FormLabel>
                    </FormItem>
                    
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="boleto" id="boleto" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer flex items-center" htmlFor="boleto">
                        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                          <line x1="6" y1="8" x2="6" y2="16" stroke="currentColor" strokeWidth="2" />
                          <line x1="10" y1="8" x2="10" y2="16" stroke="currentColor" strokeWidth="2" />
                          <line x1="14" y1="8" x2="14" y2="16" stroke="currentColor" strokeWidth="2" />
                          <line x1="18" y1="8" x2="18" y2="16" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        Boleto
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Conteúdo específico baseado no método de pagamento */}
          <div className="mt-6">
            {(selectedPaymentMethod === "credit" || selectedPaymentMethod === "debit") && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número do Cartão</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          value={formatCardNumber(field.value || "")}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cardName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome no Cartão</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Nome completo"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cardExpiry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Validade</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="MM/AA"
                            maxLength={5}
                            value={formatExpiryDate(field.value || "")}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cardCvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código de Segurança (CVV)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="123"
                            maxLength={4}
                            type="tel"
                            inputMode="numeric"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {selectedPaymentMethod === "credit" && (
                  <FormField
                    control={form.control}
                    name="installments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parcelamento</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="1">À vista - R$ {total.toFixed(2)}</option>
                            <option value="2">2x de R$ {(total / 2).toFixed(2)}</option>
                            <option value="3">3x de R$ {(total / 3).toFixed(2)}</option>
                            <option value="4">4x de R$ {(total / 4).toFixed(2)}</option>
                            <option value="5">5x de R$ {(total / 5).toFixed(2)}</option>
                            <option value="6">6x de R$ {(total / 6).toFixed(2)}</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}
            
            {selectedPaymentMethod === "pix" && (
              <div className="space-y-4">
                <div className="border rounded-md p-4 text-center">
                  <div className="bg-slate-50 p-4 inline-block rounded-md mb-3">
                    <svg className="h-24 w-24 mx-auto" viewBox="0 0 100 100">
                      <rect x="5" y="5" width="90" height="90" fill="#ffffff" />
                      <rect x="15" y="15" width="10" height="10" fill="#000000" />
                      <rect x="25" y="15" width="10" height="10" fill="#000000" />
                      <rect x="35" y="15" width="10" height="10" fill="#000000" />
                      <rect x="15" y="25" width="10" height="10" fill="#000000" />
                      <rect x="35" y="25" width="10" height="10" fill="#000000" />
                      <rect x="45" y="25" width="10" height="10" fill="#000000" />
                      <rect x="15" y="35" width="10" height="10" fill="#000000" />
                      <rect x="25" y="35" width="10" height="10" fill="#000000" />
                      <rect x="45" y="35" width="10" height="10" fill="#000000" />
                      <rect x="55" y="15" width="10" height="10" fill="#000000" />
                      <rect x="75" y="15" width="10" height="10" fill="#000000" />
                      <rect x="55" y="25" width="10" height="10" fill="#000000" />
                      <rect x="65" y="25" width="10" height="10" fill="#000000" />
                      <rect x="55" y="35" width="10" height="10" fill="#000000" />
                      <rect x="75" y="35" width="10" height="10" fill="#000000" />
                      <rect x="15" y="55" width="10" height="10" fill="#000000" />
                      <rect x="35" y="55" width="10" height="10" fill="#000000" />
                      <rect x="15" y="65" width="10" height="10" fill="#000000" />
                      <rect x="25" y="65" width="10" height="10" fill="#000000" />
                      <rect x="15" y="75" width="10" height="10" fill="#000000" />
                      <rect x="35" y="75" width="10" height="10" fill="#000000" />
                      <rect x="45" y="75" width="10" height="10" fill="#000000" />
                      <rect x="55" y="55" width="10" height="10" fill="#000000" />
                      <rect x="65" y="55" width="10" height="10" fill="#000000" />
                      <rect x="75" y="55" width="10" height="10" fill="#000000" />
                      <rect x="55" y="65" width="10" height="10" fill="#000000" />
                      <rect x="55" y="75" width="10" height="10" fill="#000000" />
                      <rect x="75" y="75" width="10" height="10" fill="#000000" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">PIX Copia e Cola</p>
                  <p className="text-xs text-gray-500 mb-2">
                    Escaneie o código QR ou copie o código abaixo
                  </p>
                  <div className="relative">
                    <Input 
                      value="00020126580014br.gov.bcb.pix0136f5c68947-d695-4e31-b8c4-8d5fa4d32f3e5204000053039865802BR5925UNITEES SERVICES LTDA6009SAO PAULO62070503***6304E2CA" 
                      readOnly 
                      className="pr-20 text-xs bg-slate-50"
                    />
                    <Button 
                      type="button"
                      variant="secondary" 
                      size="sm" 
                      className="absolute right-1 top-1 h-7 text-xs"
                      onClick={() => {
                        navigator.clipboard.writeText("00020126580014br.gov.bcb.pix0136f5c68947-d695-4e31-b8c4-8d5fa4d32f3e5204000053039865802BR5925UNITEES SERVICES LTDA6009SAO PAULO62070503***6304E2CA");
                      }}
                    >
                      Copiar
                    </Button>
                  </div>
                  <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
                    <CircleAlert className="h-4 w-4 mr-1 text-amber-500" />
                    O pagamento é processado em até 30 minutos
                  </div>
                </div>
              </div>
            )}
            
            {selectedPaymentMethod === "boleto" && (
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <svg className="h-8 w-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                        <line x1="6" y1="8" x2="6" y2="16" stroke="currentColor" strokeWidth="2" />
                        <line x1="10" y1="8" x2="10" y2="16" stroke="currentColor" strokeWidth="2" />
                        <line x1="14" y1="8" x2="14" y2="16" stroke="currentColor" strokeWidth="2" />
                        <line x1="18" y1="8" x2="18" y2="16" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      <div>
                        <h3 className="font-medium">Boleto Bancário</h3>
                        <p className="text-sm text-gray-500">O boleto será gerado após finalizar o pedido</p>
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800 flex items-start gap-2">
                      <CircleAlert className="h-5 w-5 flex-shrink-0 text-amber-500" />
                      <p>
                        O prazo de compensação do boleto é de até 3 dias úteis. 
                        Seu pedido só será processado após a confirmação do pagamento.
                      </p>
                    </div>
                    
                    <Button 
                      type="button"
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => {}}
                    >
                      Gerar Boleto
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between mb-4">
              <span className="text-sm font-medium">Total</span>
              <span className="text-lg font-bold">R$ {total.toFixed(2)}</span>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Processando..." : "Finalizar Pagamento"}
            </Button>
            
            <div className="flex items-center justify-center mt-4 text-xs text-gray-500">
              <ShieldCheck className="h-4 w-4 mr-1" />
              Pagamento seguro e criptografado
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
} 