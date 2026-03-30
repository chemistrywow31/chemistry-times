# User-Facing Error Messages

## Applicability

- Applies to: `backend-engineer`, `frontend-engineer`, `code-reviewer`, `qa-engineer`
- Scope: All API error responses and their frontend display

## Rule Content

### Backend: Always Return Structured Error Codes

Every user-reachable error in the Go backend MUST be returned as an `AppError` with a snake_case `Message` that serves as an **error code**, not a raw English sentence.

```go
// CORRECT — structured error code
return nil, &AppError{StatusCode: 422, Code: 422, Message: "scene_based_mode_required"}

// WRONG — raw sentence that leaks to the user as-is
return nil, fmt.Errorf("resolve AI provider: %w", err)
```

Only use `fmt.Errorf` for genuinely unexpected internal errors (DB failures, network issues) where `handleError()` converting to "Internal server error" is acceptable. If the error is caused by **user action or missing configuration**, it MUST be an `AppError`.

### Backend: Error Code Naming Convention

- Use `snake_case` for all error codes
- Be specific: `ai_provider_unavailable` not `ai_error`
- Include the domain: `script_must_be_final_to_lock` not `must_be_final`
- Do not include dynamic data in the message itself; use separate fields if needed

### Frontend: Never Display Raw Backend Messages

The frontend MUST translate every backend error message into the user's language using the `tApiError()` function from `useTranslation()`.

```tsx
// CORRECT — translated error
const { tApiError } = useTranslation();
setError(tApiError(err));

// WRONG — raw backend message shown to user
setError(err instanceof Error ? err.message : 'Failed');
```

### Frontend: Error Mapping Registry

All backend error codes are mapped in `apps/web/src/lib/api-errors.ts` with corresponding i18n keys under `apiErrors.*` in both `en.ts` and `zh-TW.ts`.

When adding a new backend error code:
1. Add the `AppError` with a snake_case message in the Go service
2. Add the mapping in `api-errors.ts` (`ERROR_MAP` or `PREFIX_MAP`)
3. Add `apiErrors.<key>` translations in both `en.ts` and `zh-TW.ts`
4. Use action-oriented language: tell the user **what to do**, not just what went wrong

### Frontend: Error Message Guidelines

User-facing error messages must:
- **Explain the cause** in plain language (no technical codes or jargon)
- **Guide the user** on how to fix it (e.g., "Please click 'Switch Mode' in the toolbar")
- **Reference UI elements by their visible label** (e.g., "Admin → AI Providers")
- Be written in both English and Traditional Chinese

### Frontend: Using tApiError

The `tApiError` function is available from `useTranslation()` and accepts either an `Error` object or a string:

```tsx
const { tApiError } = useTranslation();

try {
  await apiPost('/scripts/123/mode', { mode: 'SCENE_BASED' });
} catch (err) {
  // Automatically translates the backend error to the user's locale
  setError(tApiError(err));
}
```

## Violation Determination

- Backend returns `fmt.Errorf` for a user-actionable error → Violation
- Frontend displays `err.message` directly from an API call without translation → Violation
- New backend error code added without corresponding i18n translations → Violation
- Error message only states the problem without guidance on resolution → Violation

## Exceptions

- `fmt.Errorf` is acceptable for wrapping genuine infrastructure errors (DB, network) where the generic "Internal server error" fallback is appropriate
- Validation errors from `go-playground/validator` may pass through as-is since they are field-level and handled by form validation on the frontend
