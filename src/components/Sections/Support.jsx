import { useState } from 'react'
import { Send, MessageCircle, HelpCircle, Bug, Lightbulb, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useData } from '@/contexts/DataContext'
import { useAuth } from '@/contexts/AuthContext'

export function Support() {
  const { user } = useAuth()
  const { supportTickets, addSupportTicket } = useData()
  const [formData, setFormData] = useState({
    type: 'duvida',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.subject.trim() || !formData.message.trim()) {
      return
    }

    setIsSubmitting(true)

    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 1000))

    const ticket = {
      type: formData.type,
      subject: formData.subject,
      message: formData.message,
      userEmail: user.email,
      userName: user.name
    }

    addSupportTicket(ticket)

    setFormData({
      type: 'duvida',
      subject: '',
      message: ''
    })

    setIsSubmitting(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 5000)
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'duvida': return <HelpCircle className="h-4 w-4" />
      case 'bug': return <Bug className="h-4 w-4" />
      case 'sugestao': return <Lightbulb className="h-4 w-4" />
      case 'feedback': return <MessageCircle className="h-4 w-4" />
      default: return <MessageCircle className="h-4 w-4" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'duvida': return 'bg-blue-100 text-blue-800'
      case 'bug': return 'bg-red-100 text-red-800'
      case 'sugestao': return 'bg-green-100 text-green-800'
      case 'feedback': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'aberto': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'em-andamento': return <AlertCircle className="h-4 w-4 text-blue-600" />
      case 'resolvido': return <CheckCircle className="h-4 w-4 text-green-600" />
      default: return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const userTickets = supportTickets.filter(ticket => ticket.userEmail === user.email)

  const faqItems = [
    {
      question: 'Como criar uma nova anotação no Caderno Digital?',
      answer: 'Acesse a seção "Caderno Digital" e clique no botão "Nova Anotação". Preencha o título, matéria e conteúdo, depois clique em "Criar Anotação".'
    },
    {
      question: 'Como acompanhar meu progresso nos estudos?',
      answer: 'Utilize a seção "Planejamento" para criar planos de estudo e acompanhar seu progresso. Você pode definir metas e marcar o percentual concluído.'
    },
    {
      question: 'Como funciona o sistema de Testes Rápidos?',
      answer: 'Na seção "Testes Rápidos", escolha uma matéria e responda às questões. Ao final, você receberá sua pontuação e poderá revisar as respostas.'
    },
    {
      question: 'Posso editar minhas anotações depois de criadas?',
      answer: 'Sim! No Caderno Digital, clique no ícone de edição (lápis) em qualquer anotação para modificá-la.'
    },
    {
      question: 'Como organizar eventos na Agenda?',
      answer: 'Acesse a "Agenda", selecione uma data e clique em "Novo Evento". Você pode criar aulas, provas, sessões de estudo e prazos.'
    },
    {
      question: 'Meus dados ficam salvos?',
      answer: 'Sim, todos os seus dados são salvos localmente no seu navegador. Para não perder informações, evite limpar os dados do navegador.'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-amber-600 mb-2">
          Suporte e Feedback
        </h1>
        <p className="text-gray-600">
          Encontrou algum problema ou tem sugestões? Estamos aqui para ajudar!
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Mensagem enviada com sucesso!</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Recebemos sua mensagem e responderemos em breve.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário de Contato */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Entre em Contato</CardTitle>
              <CardDescription>
                Descreva sua dúvida, problema ou sugestão
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Solicitação</Label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="duvida">Dúvida</option>
                    <option value="bug">Reportar Bug</option>
                    <option value="sugestao">Sugestão</option>
                    <option value="feedback">Feedback Geral</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Descreva brevemente o assunto"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Descreva detalhadamente sua dúvida, problema ou sugestão..."
                    rows={6}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Meus Tickets */}
          {userTickets.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Minhas Solicitações</CardTitle>
                <CardDescription>
                  Acompanhe o status das suas mensagens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userTickets.slice(0, 3).map((ticket) => (
                    <div key={ticket.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(ticket.type)}
                          <span className="font-medium text-sm">{ticket.subject}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(ticket.status)}
                          <Badge className={getTypeColor(ticket.type)}>
                            {ticket.type.charAt(0).toUpperCase() + ticket.type.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {ticket.message.length > 100 
                          ? ticket.message.substring(0, 100) + '...'
                          : ticket.message
                        }
                      </p>
                      <div className="text-xs text-gray-500">
                        {new Date(ticket.date).toLocaleDateString('pt-BR')} às {new Date(ticket.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                  {userTickets.length > 3 && (
                    <p className="text-sm text-gray-500 text-center">
                      +{userTickets.length - 3} solicitações anteriores
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* FAQ */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Perguntas Frequentes</CardTitle>
              <CardDescription>
                Respostas para as dúvidas mais comuns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <details key={index} className="group">
                    <summary className="flex items-center justify-between cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                      <span className="font-medium text-sm">{item.question}</span>
                      <HelpCircle className="h-4 w-4 text-gray-400 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="mt-2 p-3 text-sm text-gray-600 bg-gray-50 rounded-lg">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Informações de Contato */}
          <Card>
            <CardHeader>
              <CardTitle>Outras Formas de Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <MessageCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-gray-600">suporte@direitoorganizado.com.br</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium">Horário de Atendimento</div>
                  <div className="text-sm text-gray-600">Segunda a Sexta, 9h às 18h</div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-medium text-amber-900 mb-2">💡 Dica</h4>
                <p className="text-amber-800 text-sm">
                  Para um atendimento mais rápido, seja específico ao descrever seu problema 
                  e inclua informações sobre o navegador que está usando.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas de Suporte */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <MessageCircle className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{supportTickets.length}</div>
                <div className="text-sm text-gray-600">Total de Tickets</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {supportTickets.filter(t => t.status === 'resolvido').length}
                </div>
                <div className="text-sm text-gray-600">Resolvidos</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

