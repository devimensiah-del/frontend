# War Room Quick Start Guide

## Overview

The Admin War Room is a comprehensive interface for managing strategic analysis reports. This guide will help you get started quickly.

## Accessing the War Room

1. **Navigate to**: `/admin/submissions/[id]`
   - Example: `/admin/submissions/123`

2. **Required**: Admin authentication (JWT token in localStorage)

## Key Features

### 1. Editor Mode
- Edit SWOT analysis (Strengths, Weaknesses, Opportunities, Threats)
- Edit PESTEL analysis (Political, Economic, Social, Technological, Environmental, Legal)
- Edit Porter's Five Forces analysis

### 2. Preview Mode
- Live A4 PDF preview
- Updates in real-time as you edit
- Shows exactly what the client will receive

### 3. Auto-Save
- Automatically saves after 30 seconds of inactivity
- Shows "Salvando..." indicator during save
- No manual action required

### 4. Manual Save
- Click "Salvar" button to save immediately
- Shows success toast: "Rascunho salvo"
- Useful before performing other actions

### 5. Regenerate Analysis
- Click "Refazer Análise"
- Generates new AI-powered analysis
- Replaces current data

### 6. Download PDF
- Click "Baixar PDF"
- Confirms action with dialog
- Saves current changes first
- Downloads PDF file to your computer

### 7. Send Email
- Click "Enviar por Email"
- Confirms recipient email
- Saves current changes first
- Sends report to user
- Updates status to "completed"

## Workflow

### Typical Admin Workflow

```
1. Admin opens War Room for submission
   ↓
2. System loads submission and analysis data
   ↓
3. Admin reviews AI-generated analysis
   ↓
4. Admin edits/refines the analysis
   ↓
5. System auto-saves changes (or manual save)
   ↓
6. Admin previews PDF layout
   ↓
7. Admin downloads PDF (optional)
   ↓
8. Admin sends email to user
   ↓
9. Status updated to "completed"
```

### Editing Workflow

```
1. Select framework tab (SWOT, PESTEL, Porter)
   ↓
2. Edit text in textarea fields
   ↓
3. Each line becomes a bullet point
   ↓
4. System auto-saves after 30 seconds
   ↓
5. Preview updates in real-time
```

## Tips & Best Practices

### Editing Tips

1. **One item per line**: Each line in a textarea becomes a separate bullet point
2. **Clear and concise**: Keep bullet points short and actionable
3. **Professional tone**: Remember this goes to the client
4. **Review preview**: Always check the preview before sending

### Performance Tips

1. **Auto-save is smart**: It only triggers 30 seconds after you stop typing
2. **Manual save is instant**: Use "Salvar" before downloading or sending
3. **Loading states**: Buttons disable during operations to prevent duplicates
4. **Error handling**: Red toasts indicate errors, check console for details

### Collaboration Tips

1. **One admin at a time**: Currently no conflict detection
2. **Save frequently**: Use manual save if you're worried about losing work
3. **Check status**: Verify submission status before making major changes
4. **Email carefully**: Sending email completes the submission permanently

## Keyboard Shortcuts

Currently no keyboard shortcuts implemented. Feature request: `Ctrl+S` for manual save.

## Troubleshooting

### "Erro ao carregar submissão"
- Check if submission ID exists in database
- Verify admin authentication token is valid
- Check browser console for network errors

### "Erro ao salvar"
- Check network connection
- Verify backend is running at `localhost:8080`
- Check if analysis exists for this submission

### "Erro ao gerar PDF"
- Ensure analysis data is complete
- Check if backend PDF service is running
- Verify file system permissions for temp files

### "Erro ao enviar email"
- Verify email service is configured
- Check recipient email is valid
- Ensure SMTP credentials are set in backend

### Auto-save not working
- Check if there are actual changes to save
- Verify 30 seconds have passed since last edit
- Check browser console for errors

## API Endpoints Reference

### Get Submission
```
GET /api/v1/admin/submissions/{id}
Response: { submission: Submission }
```

### Get Analysis
```
GET /api/v1/submissions/{id}/analysis
Response: { analysis: Analysis }
```

### Update Analysis
```
PUT /api/v1/submissions/{id}/analysis
Body: { swot, pestel, porter }
Response: { analysis: Analysis }
```

### Generate Analysis
```
POST /api/v1/submissions/{id}/analysis
Response: { analysis: Analysis }
```

### Generate PDF
```
GET /api/v1/submissions/{id}/analysis/pdf
Response: Blob (application/pdf)
```

### Send Email
```
POST /api/v1/submissions/{id}/analysis/send
Response: { message: string }
```

### Update Status
```
PUT /api/v1/admin/submissions/{id}/status
Body: { status: "completed" }
Response: { submission: Submission }
```

## Common Use Cases

### Use Case 1: Quick Review and Send
```
1. Open War Room
2. Review AI-generated analysis
3. Make minor edits if needed
4. Click "Enviar por Email"
5. Confirm and send
```

### Use Case 2: Major Revision
```
1. Open War Room
2. Click "Refazer Análise" to regenerate
3. Wait for new analysis
4. Edit extensively
5. Click "Salvar" to save manually
6. Preview PDF
7. Download PDF for review
8. Send email when satisfied
```

### Use Case 3: Template-Based Editing
```
1. Open War Room
2. Copy existing analysis structure
3. Paste into new submission
4. Modify for specific company
5. Save and send
```

## Data Structure

### SWOT Format
```typescript
swot: {
  strengths: string[];      // Positive internal factors
  weaknesses: string[];     // Negative internal factors
  opportunities: string[];  // Positive external factors
  threats: string[];        // Negative external factors
}
```

### PESTEL Format
```typescript
pestel: {
  political: string[];      // Government, regulations
  economic: string[];       // Market conditions, GDP
  social: string[];         // Demographics, culture
  technological: string[];  // Innovation, automation
  environmental: string[];  // Sustainability, climate
  legal: string[];          // Laws, compliance
}
```

### Porter's Five Forces Format
```typescript
porter: {
  competitiveRivalry: {
    intensity: string;      // "High", "Medium", "Low"
    factors: string[];      // Specific factors
  },
  threatOfNewEntrants: { ... },
  bargainingPowerOfSuppliers: { ... },
  bargainingPowerOfBuyers: { ... },
  threatOfSubstitutes: { ... }
}
```

## Next Steps

1. **Test the integration**: Try all features with a test submission
2. **Review the code**: Check `app/admin/submissions/[id]/page.tsx`
3. **Customize**: Modify toast messages, add more frameworks
4. **Enhance**: Add keyboard shortcuts, undo/redo, version history

## Support

- **Documentation**: See `WAR_ROOM_INTEGRATION.md` for technical details
- **Issues**: Report bugs via GitHub issues
- **Questions**: Contact the development team

---

**Happy Analyzing! 🎯**
