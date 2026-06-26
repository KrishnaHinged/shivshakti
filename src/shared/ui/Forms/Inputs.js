import React from "react";

/**
 * Standard Form Input text field component.
 *
 * @param {Object} props
 * @param {string} [props.label] - Field label
 * @param {string} [props.error] - Validation error message to display below input
 * @param {string} [props.className=""] - Extra container classes
 * @param {string} [props.inputClassName=""] - Extra input field classes
 */
export const Input = React.forwardRef(({
  label,
  error,
  className = "",
  inputClassName = "",
  type = "text",
  id,
  required,
  ...rest
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        id={inputId}
        required={required}
        className={`w-full px-4 py-2.5 bg-white border ${
          error ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200" : "border-slate-200 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/20"
        } rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none transition duration-200 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${inputClassName}`}
        {...rest}
      />
      {error && <span className="text-[10px] font-bold text-red-500">{error}</span>}
    </div>
  );
});

Input.displayName = "Input";

/**
 * Standard Form Textarea field component.
 *
 * @param {Object} props
 * @param {string} [props.label] - Field label
 * @param {string} [props.error] - Validation error message to display below textarea
 * @param {string} [props.className=""] - Extra container classes
 * @param {string} [props.inputClassName=""] - Extra textarea field classes
 */
export const Textarea = React.forwardRef(({
  label,
  error,
  className = "",
  inputClassName = "",
  id,
  required,
  rows = 4,
  ...rest
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        required={required}
        rows={rows}
        className={`w-full px-4 py-2.5 bg-white border ${
          error ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200" : "border-slate-200 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/20"
        } rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none transition duration-200 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${inputClassName}`}
        {...rest}
      />
      {error && <span className="text-[10px] font-bold text-red-500">{error}</span>}
    </div>
  );
});

Textarea.displayName = "Textarea";

/**
 * Standard Form Select field component.
 *
 * @param {Object} props
 * @param {string} [props.label] - Field label
 * @param {string} [props.error] - Validation error message to display below select
 * @param {Array<{value: string, label: string}>} [props.options] - Dropdown options array
 * @param {string} [props.className=""] - Extra container classes
 * @param {string} [props.inputClassName=""] - Extra select field classes
 */
export const Select = React.forwardRef(({
  label,
  error,
  options = [],
  children,
  className = "",
  inputClassName = "",
  id,
  required,
  ...rest
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={selectId} className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        required={required}
        className={`w-full px-4 py-2.5 bg-white border ${
          error ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200" : "border-slate-200 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/20"
        } rounded-xl text-xs font-medium text-slate-800 focus:outline-none transition duration-200 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${inputClassName}`}
        {...rest}
      >
        {children || options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-[10px] font-bold text-red-500">{error}</span>}
    </div>
  );
});

Select.displayName = "Select";

/**
 * Standard Form Checkbox input component.
 *
 * @param {Object} props
 * @param {string} [props.label] - Field label
 * @param {string} [props.error] - Validation error message to display
 * @param {string} [props.className=""] - Extra container classes
 */
export const Checkbox = React.forwardRef(({
  label,
  error,
  className = "",
  id,
  ...rest
}, ref) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={checkboxId} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className="w-4 h-4 rounded border-slate-300 text-brand-orange focus:ring-brand-orange/20 cursor-pointer"
          {...rest}
        />
        {label}
      </label>
      {error && <span className="text-[10px] font-bold text-red-500">{error}</span>}
    </div>
  );
});

Checkbox.displayName = "Checkbox";
