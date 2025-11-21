# Admin War Room - Backend Integration Complete

## Overview

The Admin War Room is now fully integrated with the real backend API. All operations (save, publish, PDF generation, email sending) are connected to the Go backend at `http://localhost:8080/api/v1`.

## Features Implemented

### 1. Real-Time Data Fetching
- **Submission Data**: Fetched via `adminApi.getSubmission(id)`
- **Analysis Data**: Fetched via `analysisApi.getBySubmissionId(id)`
- **Auto-refresh**: Uses React Query for caching and refetching

### 2. Auto-Save Functionality
- **Debounced Save**: Automatically saves after 30 seconds of inactivity
- **Manual Save**: "Salvar" button for explicit saves
- **Loading States**: Shows "Salvando..." indicator during save operations
- **Error Handling**: Displays toast notifications on save errors

### 3. Action Handlers

#### Save Draft (`handleSaveDraft`)
- **API Call**: `analysisApi.update(submissionId, data)`
- **Data Saved**: SWOT, PESTEL, Porter's Five Forces
- **Toast Notification**: Success/error messages
- **Loading State**: Disables buttons while saving

#### Retry Analysis (`handleRetryAnalysis`)
- **API Call**: `analysisApi.generate(submissionId)`
- **Loading State**: Shows spinning icon and "Gerando..." text
- **Success**: Refetches latest analysis data
- **Toast Notification**: "Análise gerada" on success

#### Download PDF (`handlePublishPDF`)
- **Confirmation Dialog**: Asks user to confirm before generating
- **API Call**: `analysisApi.getPdf(submissionId)`
- **Auto-Save**: Saves current changes before generating PDF
- **Download**: Creates blob URL and triggers download
- **Filename**: `analise-{companyName}.pdf`
- **Toast Notification**: "PDF gerado" on success

#### Send Email (`handleSendEmail`)
- **Confirmation Dialog**: Shows recipient email and impact
- **API Call**: `analysisApi.send(submissionId)`
- **Auto-Save**: Saves current changes before sending
- **Status Update**: Updates submission status to "completed"
- **Toast Notification**: "Email enviado" on success

### 4. UI Components

#### ActionToolbar (`ActionToolbar.tsx`)
- **Buttons**:
  - Refazer Análise (Retry Analysis)
  - Salvar (Save Draft)
  - Baixar PDF (Download PDF)
  - Enviar por Email (Send Email)
- **Loading States**: All buttons show loading states
- **Disabled States**: Buttons disabled during operations
- **Confirmation Dialogs**: For destructive actions (PDF, Email)

#### WarRoomShell (`WarRoomShell.tsx`)
- **Props**: Analysis data, loading states, user email
- **Modes**: Editor and Preview tabs
- **Layout**: Split-screen with editor and preview panels

#### EditorPanel (`EditorPanel.tsx`)
- **Tabs**: SWOT, PESTEL, Porter's Five Forces
- **Real-time Updates**: Changes trigger auto-save
- **Form Fields**: Text areas for each analysis section

#### PreviewPanel (`PreviewPanel.tsx`)
- **Live Preview**: Updates as admin edits
- **PDF Layout**: A4 format preview in iframe
- **Styling**: Editorial design system

### 5. Error Handling

#### Network Errors
- Toast notifications with Portuguese error messages
- Retry options for failed operations
- Graceful degradation on API failures

#### Validation Errors
- Field-level error highlighting (future enhancement)
- User-friendly error messages
- Automatic error recovery

#### Loading States
- Spinner for initial data loading
- Button loading states for all actions
- "Salvando..." indicator for auto-save
- Disabled states prevent duplicate requests

## API Endpoints Used

### Analysis API
```typescript
// Get analysis
GET /api/v1/submissions/{id}/analysis

// Update analysis
PUT /api/v1/submissions/{id}/analysis
Body: { swot, pestel, porter }

// Generate new analysis
POST /api/v1/submissions/{id}/analysis

// Generate PDF
GET /api/v1/submissions/{id}/analysis/pdf
Response: application/pdf (blob)

// Send email
POST /api/v1/submissions/{id}/analysis/send
```

### Admin API
```typescript
// Get submission
GET /api/v1/admin/submissions/{id}

// Update status
PUT /api/v1/admin/submissions/{id}/status
Body: { status: "completed" }
```

## Data Flow

### 1. Page Load
```
User opens /admin/submissions/[id]
  → Fetch submission data (adminApi.getSubmission)
  → Fetch analysis data (analysisApi.getBySubmissionId)
  → Convert to War Room format
  → Initialize local state
  → Render UI
```

### 2. Edit Flow
```
Admin edits field in EditorPanel
  → onAnalysisChange updates local state
  → scheduleAutoSave sets 30s timer
  → Timer expires
  → handleSaveDraft(true) saves to backend
  → No toast shown for auto-save
```

### 3. Manual Save Flow
```
Admin clicks "Salvar"
  → handleSaveDraft(false)
  → analysisApi.update()
  → Show toast: "Rascunho salvo"
  → Update React Query cache
```

### 4. Download PDF Flow
```
Admin clicks "Baixar PDF"
  → Show confirmation dialog
  → Admin confirms
  → handleSaveDraft() saves current changes
  → analysisApi.getPdf()
  → Create blob URL
  → Trigger download
  → Show toast: "PDF gerado"
```

### 5. Send Email Flow
```
Admin clicks "Enviar por Email"
  → Show confirmation dialog with recipient
  → Admin confirms
  → handleSaveDraft() saves current changes
  → analysisApi.send()
  → adminApi.updateSubmissionStatus("completed")
  → Show toast: "Email enviado"
```

## File Structure

```
app/admin/submissions/[id]/
├── page.tsx                      # Main page with API integration
└── _components/
    ├── ActionToolbar.tsx         # Action buttons with dialogs
    ├── WarRoomShell.tsx          # Main layout
    ├── EditorPanel.tsx           # Edit forms
    └── PreviewPanel.tsx          # PDF preview

lib/
├── api/
│   ├── client.ts                 # API client (analysisApi, adminApi)
│   └── error-handler.ts          # Error handling utilities
└── hooks/
    └── use-analysis.ts           # Analysis data hook

components/ui/
├── dialog.tsx                    # Confirmation dialogs
├── toast.tsx                     # Toast notifications
├── toaster.tsx                   # Toast container
└── use-toast.tsx                 # Toast hook
```

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

## Authentication

All API requests include the JWT token from localStorage:
```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## Error Messages (Portuguese)

- **Save**: "Erro ao salvar - Não foi possível salvar as alterações."
- **Generate**: "Erro ao gerar análise - Não foi possível gerar a análise."
- **PDF**: "Erro ao gerar PDF - Não foi possível gerar o PDF."
- **Email**: "Erro ao enviar email - Não foi possível enviar o email."
- **Load**: "Erro ao carregar submissão - Não foi possível carregar os dados."

## Success Messages (Portuguese)

- **Save**: "Rascunho salvo - As alterações foram salvas com sucesso."
- **Generate**: "Análise gerada - Nova análise gerada com sucesso."
- **PDF**: "PDF gerado - O PDF foi baixado com sucesso."
- **Email**: "Email enviado - O relatório foi enviado para o usuário."

## Loading States

- **Initial Load**: Full-screen spinner with "Carregando análise..."
- **Saving**: Button shows "Salvando..." and is disabled
- **Generating**: Button shows spinning icon and "Gerando..."
- **PDF**: Button shows "Gerando PDF..." and is disabled
- **Sending**: Button shows "Enviando..." and is disabled
- **Auto-save**: Small "Salvando..." indicator in toolbar

## Future Enhancements

1. **Optimistic Updates**: Update UI before API response
2. **Conflict Detection**: Handle concurrent edits by multiple admins
3. **Version History**: Track analysis version changes
4. **Undo/Redo**: Allow reverting changes
5. **Rich Text Editing**: WYSIWYG editor for analysis sections
6. **Collaboration**: Real-time multi-user editing
7. **PDF Customization**: Allow template selection
8. **Email Templates**: Customizable email content
9. **Scheduled Sending**: Schedule report delivery
10. **Analytics**: Track time spent, edits made, etc.

## Testing Checklist

- [ ] Load War Room for existing submission
- [ ] Edit SWOT analysis fields
- [ ] Edit PESTEL analysis fields
- [ ] Edit Porter's Five Forces fields
- [ ] Verify auto-save after 30 seconds
- [ ] Click "Salvar" to manually save
- [ ] Click "Refazer Análise" to regenerate
- [ ] Click "Baixar PDF" and confirm download
- [ ] Click "Enviar por Email" and confirm send
- [ ] Verify toast notifications appear
- [ ] Verify loading states work correctly
- [ ] Verify error handling with network disabled
- [ ] Verify confirmation dialogs display correctly

## Known Issues

None at this time.

## Support

For issues or questions, contact the development team.

---

**Status**: ✅ Complete
**Last Updated**: 2025-11-21
**Next Steps**: Integration testing with real backend
