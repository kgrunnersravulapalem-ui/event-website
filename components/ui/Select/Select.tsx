import styles from './Select.module.css';

interface SelectProps {
    label: string;
    name?: string;
    options: string[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    required?: boolean;
}

/**
 * Select dropdown component
 * Used for T-shirt size and other dropdown selections
 */
const Select = ({ label, name, options, value, onChange, placeholder = 'Select...', required = false }: SelectProps) => {
    return (
        <div className={styles.selectWrapper}>
            <label className={styles.label}>
                {label}
                {required && <span className={styles.required}>*</span>}
            </label>
            <select
                name={name}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                className={styles.select}
                required={required}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;
