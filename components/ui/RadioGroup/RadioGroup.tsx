import styles from './RadioGroup.module.css';

interface RadioGroupProps {
    label: string;
    name: string;
    options: string[];
    value?: string;
    onChange?: (value: string) => void;
    required?: boolean;
}

/**
 * RadioGroup component for selecting a single option from multiple choices
 * Used for gender, blood group, etc.
 */
const RadioGroup = ({ label, name, options, value, onChange, required = false }: RadioGroupProps) => {
    return (
        <div className={styles.radioGroup}>
            <label className={styles.label}>
                {label}
                {required && <span className={styles.required}>*</span>}
            </label>
            <div className={styles.options}>
                {options.map((option) => (
                    <label key={option} className={styles.radioOption}>
                        <input
                            type="radio"
                            name={name}
                            value={option}
                            checked={value === option}
                            onChange={(e) => onChange?.(e.target.value)}
                            className={styles.radioInput}
                        />
                        <span className={styles.radioLabel}>{option}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default RadioGroup;
