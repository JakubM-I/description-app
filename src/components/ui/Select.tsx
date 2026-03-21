export type SelectOption = {
  value: string
  label: string
}

type SelectProps = {
  id: string
  label: string
  placeholder: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  disabled?: boolean
  hint?: string
}

export const Select = ({
  id,
  label,
  placeholder,
  value,
  options,
  onChange,
  disabled = false,
  hint,
}: SelectProps) => {
  const hintId = hint ? `${id}-hint` : undefined

  return (
    <div className="form-field">
      <label className="form-field__label" htmlFor={id}>
        {label}
      </label>
      <select
        aria-describedby={hintId}
        className="form-field__control"
        disabled={disabled}
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint ? (
        <p className="form-field__hint" id={hintId}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}
