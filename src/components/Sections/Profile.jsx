import { useState, useEffect } from 'react'
import { User, Save, X, Edit, Camera, Mail, Calendar, BookOpen, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/contexts/AuthContext'
import { useData } from '@/contexts/DataContext'

export function Profile() {
  const { user, updateUser, updateUserPreferences } = useAuth()
  const { notes, testResults, events, studyPlans } = useData()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: user?.name || '',
    studyGoal: user?.studyGoal || '',
    favoriteSubjects: user?.favoriteSubjects || []
  })

  // Estados para preferências sincronizadas
  const [preferences, setPreferences] = useState({
    emailNotifications: user?.preferences?.emailNotifications ?? true,
    darkMode: user?.preferences?.darkMode ?? false,
    studyReminders: user?.preferences?.studyReminders ?? true
  })

  // Atualizar preferências quando o usuário mudar
  useEffect(() => {
    if (user?.preferences) {
      setPreferences({
        emailNotifications: user.preferences.emailNotifications ?? true,
        darkMode: user.preferences.darkMode ?? false,
        studyReminders: user.preferences.studyReminders ?? true
      })
      
      // Aplicar modo escuro se estiver ativo
      if (user.preferences.darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [user])

  // Atualizar dados de edição quando o usuário mudar
  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || '',
        studyGoal: user.studyGoal || '',
        favoriteSubjects: user.favoriteSubjects || []
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    const result = await updateUser({
      name: editData.name,
      studyGoal: editData.studyGoal,
      favoriteSubjects: editData.favoriteSubjects
    })
    
    if (result?.success) {
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditData({
      name: user?.name || '',
      studyGoal: user?.studyGoal || '',
      favoriteSubjects: user?.favoriteSubjects || []
    })
    setIsEditing(false)
  }

  const handlePreferenceChange = async (key, value) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)
    
    // Aplicar modo escuro imediatamente
    if (key === 'darkMode') {
      if (value) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('darkMode', 'true')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('darkMode', 'false')
      }
    }
    
    // Salvar no Firebase
    await updateUserPreferences(newPreferences)
  }

  // Calcular estatísticas dinâmicas
  const calculateStats = () => {
    const notesCount = notes?.length || 0
    const testsCount = testResults?.length || 0
    
    // Calcular dias de estudo únicos baseado em datas de atividades
    const uniqueDates = new Set()
    
    // Adicionar datas das anotações
    notes?.forEach(note => {
      if (note.date) {
        const date = new Date(note.date).toDateString()
        uniqueDates.add(date)
      }
    })
    
    // Adicionar datas dos testes
    testResults?.forEach(test => {
      if (test.date) {
        const date = new Date(test.date).toDateString()
        uniqueDates.add(date)
      }
    })
    
    // Adicionar datas dos eventos
    events?.forEach(event => {
      if (event.date) {
        const date = new Date(event.date).toDateString()
        uniqueDates.add(date)
      }
    })
    
    // Adicionar datas dos planos de estudo
    studyPlans?.forEach(plan => {
      if (plan.date) {
        const date = new Date(plan.date).toDateString()
        uniqueDates.add(date)
      }
    })
    
    const studyDays = uniqueDates.size
    
    // Calcular média de acertos dos testes
    const totalQuestions = testResults?.reduce((sum, test) => sum + (test.totalQuestions || 0), 0) || 0
    const correctAnswers = testResults?.reduce((sum, test) => sum + (test.correctAnswers || 0), 0) || 0
    const averageScore = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
    
    return {
      notesCount,
      testsCount,
      studyDays,
      averageScore: `${averageScore}%`
    }
  }

  const stats = calculateStats()
  
  const statsData = [
    { label: 'Anotações Criadas', value: stats.notesCount.toString(), icon: BookOpen },
    { label: 'Testes Realizados', value: stats.testsCount.toString(), icon: User },
    { label: 'Dias de Estudo', value: stats.studyDays.toString(), icon: Calendar },
    { label: 'Média de Acertos', value: stats.averageScore, icon: User }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-600 mb-2">
            Meu Perfil
          </h1>
          <p className="text-gray-600">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>
        {!isEditing && (
          <Button 
            onClick={() => setIsEditing(true)}
            variant="outline"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Suas informações básicas na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="" alt="Foto do perfil" />
                    <AvatarFallback className="text-lg bg-amber-100 text-amber-700">
                      {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium">{user?.name || 'Usuário'}</h3>
                  <p className="text-sm text-gray-500">Estudante de Direito</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      name="name"
                      value={editData.name}
                      onChange={handleInputChange}
                      placeholder="Como você gostaria de ser chamado(a)?"
                    />
                  ) : (
                    <div className="p-2 bg-gray-50 rounded-md">
                      {user?.name || 'Não informado'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="p-2 bg-gray-50 rounded-md flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    {user?.email || 'Não informado'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studyGoal">Objetivo de Estudo</Label>
                  {isEditing ? (
                    <Input
                      id="studyGoal"
                      name="studyGoal"
                      value={editData.studyGoal}
                      onChange={handleInputChange}
                      placeholder="Qual seu objetivo principal?"
                    />
                  ) : (
                    <div className="p-2 bg-gray-50 rounded-md">
                      {user?.studyGoal || 'Não definido'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Membro desde</Label>
                  <div className="p-2 bg-gray-50 rounded-md flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {user?.joinDate ? new Date(user.joinDate).toLocaleDateString('pt-BR') : 'Não informado'}
                  </div>
                </div>
              </div>

              {/* Favorite Subjects */}
              <div className="space-y-2">
                <Label>Matérias Favoritas</Label>
                <div className="flex flex-wrap gap-2">
                  {user?.favoriteSubjects?.length > 0 ? (
                    user.favoriteSubjects.map((subject, index) => (
                      <Badge key={index} variant="secondary">
                        {subject}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Nenhuma matéria favorita definida</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex space-x-2 pt-4">
                  <Button onClick={handleSave} className="bg-amber-600 hover:bg-amber-700">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Preferências</CardTitle>
              <CardDescription>
                Configure como você quer usar a plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-amber-600" />
                  <div>
                    <p className="font-medium">Notificações por e-mail</p>
                    <p className="text-sm text-gray-500">Receber lembretes e atualizações</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.emailNotifications}
                  onCheckedChange={(value) => handlePreferenceChange('emailNotifications', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {preferences.darkMode ? (
                    <Moon className="h-4 w-4 text-amber-600" />
                  ) : (
                    <Sun className="h-4 w-4 text-amber-600" />
                  )}
                  <div>
                    <p className="font-medium">Modo escuro</p>
                    <p className="text-sm text-gray-500">Usar tema escuro na interface</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.darkMode}
                  onCheckedChange={(value) => handlePreferenceChange('darkMode', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-amber-600" />
                  <div>
                    <p className="font-medium">Lembretes de estudo</p>
                    <p className="text-sm text-gray-500">Notificações para manter a rotina</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.studyReminders}
                  onCheckedChange={(value) => handlePreferenceChange('studyReminders', value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
              <CardDescription>
                Seu progresso na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {statsData.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-4 w-4 text-amber-600" />
                      <span className="text-sm">{stat.label}</span>
                    </div>
                    <span className="font-medium">{stat.value}</span>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Conta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Alterar senha
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Exportar dados
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                Excluir conta
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

