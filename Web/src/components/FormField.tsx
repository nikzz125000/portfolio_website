import { forwardRef } from "react";
import type { FieldError } from "react-hook-form";
import { TextField, Box } from "@mui/material";

interface FormFieldProps {
  label: string;
  error?: FieldError;
  required?: boolean;
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  disabled?: boolean;
}

// ✅ forward ref from register to MUI TextField
export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      error,
      required = false,
      name,
      
      onChange,
      onBlur,
      type = "text",
      autoComplete,
      placeholder,
      disabled,
    },
    ref
  ) => (
    <Box mb={2}>
      <TextField
        fullWidth
        label={label}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        error={!!error}
        helperText={error?.message}
        disabled={disabled}
        variant="outlined"
        size="small"
        inputRef={ref} // ✅ pass the ref here!
      />
    </Box>
  )
);

FormField.displayName = "FormField"; // ✅ needed for forwardRef
