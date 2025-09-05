# Exemplo de Integração Frontend - Validação Imóvel do Mês

## Como lidar com o erro de "Imóvel do Mês já existe"

### Exemplo de Resposta da API

Quando o usuário tenta marcar um imóvel como "imóvel do mês" e já existe outro marcado, a API retorna:

```json
{
  "success": false,
  "message": "Já existe um imóvel do mês cadastrado",
  "details": {
    "existingProperty": {
      "id": "456e7890-e89b-12d3-a456-426614174001",
      "titulo": "Apartamento moderno com vista panorâmica"
    }
  }
}
```

### Exemplo de Tratamento no Frontend (React/TypeScript)

```typescript
// Função para alternar imóvel do mês
const togglePropertyOfMonth = async (propertyId: string) => {
  try {
    const response = await fetch(`/api/properties/${propertyId}/toggle-property-of-month`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.success) {
      // Sucesso - atualizar estado local
      setProperties(prev => prev.map(prop => 
        prop.id === propertyId 
          ? { ...prop, imovel_do_mes: data.data.imovel_do_mes }
          : prop
      ));
      
      toast.success(data.message);
    } else {
      // Erro - mostrar modal de confirmação
      if (data.details?.existingProperty) {
        const { id, titulo } = data.details.existingProperty;
        
        // Mostrar modal perguntando se quer substituir
        const shouldReplace = await showReplaceConfirmation({
          currentProperty: titulo,
          currentId: id
        });
        
        if (shouldReplace) {
          // Primeiro remover o imóvel atual do mês
          await removePropertyOfMonth(id);
          // Depois marcar o novo como imóvel do mês
          await togglePropertyOfMonth(propertyId);
        }
      } else {
        toast.error(data.message);
      }
    }
  } catch (error) {
    console.error('Erro ao alterar imóvel do mês:', error);
    toast.error('Erro interno do servidor');
  }
};

// Função para remover imóvel do mês
const removePropertyOfMonth = async (propertyId: string) => {
  const response = await fetch(`/api/properties/${propertyId}/toggle-property-of-month`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return response.json();
};

// Componente de Modal de Confirmação
const showReplaceConfirmation = ({ currentProperty, currentId }: {
  currentProperty: string;
  currentId: string;
}): Promise<boolean> => {
  return new Promise((resolve) => {
    setShowModal({
      title: 'Imóvel do Mês Já Existe',
      message: `O imóvel "${currentProperty}" já está marcado como imóvel do mês. Deseja substituí-lo?`,
      onConfirm: () => {
        setShowModal(null);
        resolve(true);
      },
      onCancel: () => {
        setShowModal(null);
        resolve(false);
      }
    });
  });
};
```

### Exemplo de Modal de Confirmação (JSX)

```jsx
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} className="text-yellow-500" />
        </div>
        <h3 className="text-xl font-bold text-[var(--verde-escuro)] mb-2">
          {showModal.title}
        </h3>
        <p className="text-[var(--marrom-suave)] mb-6">
          {showModal.message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={showModal.onCancel}
            className="flex-1 px-4 py-2 border-2 border-[var(--bege-claro)] text-[var(--verde-escuro)] font-semibold rounded-xl hover:bg-[var(--bege-claro)] transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={showModal.onConfirm}
            className="flex-1 px-4 py-2 bg-[var(--verde-escuro)] hover:bg-[var(--marrom-suave)] text-white font-semibold rounded-xl transition-colors duration-200"
          >
            Substituir
          </button>
        </div>
      </div>
    </div>
  </div>
)}
```

### Exemplo de Tratamento no Formulário de Criação/Edição

```typescript
// No formulário de criação/edição de propriedade
const handleSubmit = async (formData: PropertyFormData) => {
  try {
    const response = await fetch('/api/properties', {
      method: 'POST', // ou 'PUT' para edição
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (data.success) {
      toast.success('Propriedade salva com sucesso!');
      navigate('/admin/properties');
    } else {
      // Verificar se é erro de imóvel do mês
      if (data.details?.existingProperty) {
        const { titulo } = data.details.existingProperty;
        
        toast.error(
          `Já existe um imóvel do mês: "${titulo}". Desmarque-o primeiro ou altere o status deste imóvel.`,
          { duration: 5000 }
        );
      } else {
        // Outros erros de validação
        if (data.errors) {
          data.errors.forEach((error: any) => {
            setFieldError(error.field, error.message);
          });
        } else {
          toast.error(data.message);
        }
      }
    }
  } catch (error) {
    console.error('Erro ao salvar propriedade:', error);
    toast.error('Erro interno do servidor');
  }
};
```

### Exemplo de Toast Personalizado

```typescript
// Toast com ação para ir direto ao imóvel existente
const showImovelDoMesError = (existingProperty: { id: string; titulo: string }) => {
  toast.error(
    `Já existe um imóvel do mês: "${existingProperty.titulo}"`,
    {
      duration: 6000,
      action: {
        label: 'Ver Imóvel',
        onClick: () => {
          navigate(`/admin/properties/edit/${existingProperty.id}`);
        }
      }
    }
  );
};
```

## Fluxo Recomendado

1. **Tentativa de Marcar**: Usuário tenta marcar imóvel como "imóvel do mês"
2. **Verificação**: API verifica se já existe outro imóvel marcado
3. **Erro com Detalhes**: Se existir, retorna erro com ID e título do imóvel atual
4. **Opções para o Usuário**:
   - **Cancelar**: Não fazer nada
   - **Substituir**: Remover o atual e marcar o novo
   - **Ir ao Imóvel Atual**: Navegar para editar o imóvel existente
5. **Feedback Visual**: Mostrar claramente qual imóvel está marcado como "imóvel do mês"

## Benefícios desta Abordagem

- ✅ **Transparência**: Usuário sabe exatamente qual imóvel está marcado
- ✅ **Facilidade**: Pode ir direto ao imóvel existente para desmarcá-lo
- ✅ **Flexibilidade**: Pode escolher substituir ou cancelar
- ✅ **UX Melhorada**: Feedback claro e ações intuitivas
