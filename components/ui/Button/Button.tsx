
import styles from './Button.module.css';
import { ReactNode } from 'react';
import clsx from 'clsx';
import { motion, HTMLMotionProps } from 'framer-motion';

// Extend HTMLMotionProps instead of ButtonHTMLAttributes to resolve conflict
interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
    fullWidth?: boolean;
}

const Button = ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className,
    children,
    ...props
}: ButtonProps) => {
    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            className={clsx(
                styles.button,
                styles[variant],
                styles[size],
                { [styles.fullWidth]: fullWidth },
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;
