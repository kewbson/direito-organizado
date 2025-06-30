import { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import { AuthPage } from './components/Auth/AuthPage'
import { Sidebar } from './components/Layout/Sidebar'
import { MobileBottomNav } from './components/Layout/MobileBottomNav'
import { Dashboard } from './components/Sections/Dashboard'
import { DigitalNotebook } from './components/Sections/DigitalNotebook'
import { StudyPlanning } from './components/Sections/StudyPlanning'
import { Calendar } from './components/Sections/Calendar'
import { QuickTests } from './components/Sections/QuickTests'
import { Support } from './components/Sections/Support'
import { Profile } from './components/Sections/Profile'
import './App.css'

function AppContent() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const { isAuthenticated, isLoading } = useAuth()

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não estiver autenticado, mostrar página de login
  if (!isAuthenticated) {
    return <AuthPage />
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />
      case 'notebook':
        return <DigitalNotebook />
      case 'planning':
        return <StudyPlanning />
      case 'calendar':
        return <Calendar />
      case 'tests':
        return <QuickTests />
      case 'support':
        return <Support />
      case 'profile':
        return <Profile />
      default:
        return <Dashboard />
    }
  }

  return (
    <DataProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Sidebar - Desktop */}
          <Sidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection}
            className="hidden md:block"
          />
          
          {/* Sidebar - Mobile */}
          <Sidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection}
            className="md:hidden"
          />

          {/* Main Content */}
          <main className="flex-1 md:ml-0">
            <div className="p-4 md:p-6 pb-20 md:pb-6">
              {renderSection()}
            </div>
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
        />
      </div>
    </DataProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App

