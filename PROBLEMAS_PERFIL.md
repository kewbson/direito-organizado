# Problemas Identificados no Perfil

## Dados Estáticos no Profile.jsx

### 1. Estatísticas Hardcoded
- **Anotações Criadas**: Valor fixo "24"
- **Testes Realizados**: Valor fixo "12" 
- **Dias de Estudo**: Valor fixo "28"
- **Média de Acertos**: Valor fixo "78%"

### 2. Preferências não Sincronizadas
- **Notificações por e-mail**: Estado local não salvo no Firebase
- **Modo escuro**: Apenas localStorage, não sincronizado
- **Lembretes de estudo**: Estado local não salvo no Firebase

### 3. Dados do Usuário Parcialmente Sincronizados
- **Nome**: ✅ Sincronizado com Firebase
- **Email**: ✅ Sincronizado com Firebase  
- **Objetivo de Estudo**: ✅ Sincronizado com Firebase
- **Data de Cadastro**: ✅ Sincronizado com Firebase
- **Matérias Favoritas**: ✅ Sincronizado com Firebase

## Soluções Necessárias

### 1. Implementar Cálculo Dinâmico de Estatísticas
- Conectar com DataContext para obter dados reais
- Calcular anotações criadas a partir do array `notes`
- Calcular testes realizados a partir do array `testResults`
- Calcular dias de estudo baseado em datas dos dados
- Calcular média de acertos dos testes realizados

### 2. Sincronizar Preferências com Firebase
- Salvar preferências no documento do usuário
- Carregar preferências do Firebase ao inicializar
- Atualizar Firebase quando preferências mudarem

### 3. Melhorar Estrutura de Dados do Usuário
- Adicionar campo `preferences` no documento do usuário
- Incluir campos para estatísticas calculadas se necessário

