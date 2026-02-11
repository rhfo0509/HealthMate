import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';

/**
 * Clean Pro - Button Component
 * 
 * Variants: primary, secondary, outline, ghost
 * Sizes: sm, md, lg
 */

const Button = ({
    children,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    style,
    textStyle,
    ...props
}) => {
    const buttonStyles = [
        styles.base,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        style,
    ];

    const textStyles = [
        styles.textBase,
        styles[`text_${variant}`],
        styles[`text_${size}`],
        disabled && styles.textDisabled,
        textStyle,
    ];

    return (
        <Pressable
            style={({ pressed }) => [
                ...buttonStyles,
                pressed && !disabled && styles.pressed,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <ActivityIndicator
                    color={
                        variant === 'outline' || variant === 'ghost'
                            ? colors.primary[500]
                            : colors.text.inverse
                    }
                />
            ) : (
                <Text style={textStyles}>{children}</Text>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    // Base Styles
    base: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.md,
        ...shadows.sm,
    },

    textBase: {
        ...typography.button,
    },

    // Variants
    primary: {
        backgroundColor: colors.primary[500],
    },
    secondary: {
        backgroundColor: colors.accent.main,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary[500],
        ...shadows.none,
    },
    ghost: {
        backgroundColor: 'transparent',
        ...shadows.none,
    },

    // Text Colors
    text_primary: {
        color: colors.text.inverse,
    },
    text_secondary: {
        color: colors.gray[900],
    },
    text_outline: {
        color: colors.primary[500],
    },
    text_ghost: {
        color: colors.primary[500],
    },

    // Sizes
    sm: {
        height: 36,
        paddingHorizontal: spacing.md,
    },
    md: {
        height: 44,
        paddingHorizontal: spacing.lg,
    },
    lg: {
        height: 52,
        paddingHorizontal: spacing.xl,
    },

    text_sm: {
        fontSize: 14,
    },
    text_md: {
        fontSize: 16,
    },
    text_lg: {
        fontSize: 18,
    },

    // States
    pressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    disabled: {
        backgroundColor: colors.gray[300],
        ...shadows.none,
    },
    textDisabled: {
        color: colors.text.disabled,
    },
});

export default Button;
