import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

/**
 * Clean Pro - Input Component
 * 
 * Focus/Error states, 아이콘 지원
 */

const Input = ({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    onFocus,
    onBlur,
    style,
    inputStyle,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    const containerStyles = [
        styles.container,
        isFocused && styles.containerFocused,
        error && styles.containerError,
        style,
    ];

    const inputStyles = [
        styles.input,
        leftIcon && styles.inputWithLeftIcon,
        rightIcon && styles.inputWithRightIcon,
        inputStyle,
    ];

    return (
        <View style={styles.wrapper}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View style={containerStyles}>
                {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

                <TextInput
                    style={inputStyles}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholderTextColor={colors.text.hint}
                    {...props}
                />

                {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
            </View>

            {(error || helperText) && (
                <Text style={error ? styles.errorText : styles.helperText}>
                    {error || helperText}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: spacing.md,
    },

    label: {
        ...typography.body,
        fontFamily: 'SUIT-SemiBold',
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },

    container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        borderWidth: 1,
        borderColor: colors.border.main,
        borderRadius: borderRadius.md,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.md,
    },

    containerFocused: {
        borderColor: colors.primary[500],
        borderWidth: 2,
    },

    containerError: {
        borderColor: colors.error,
        borderWidth: 2,
    },

    input: {
        flex: 1,
        ...typography.body,
        fontFamily: 'SUIT-Regular',
        color: colors.text.primary,
        paddingVertical: 0, // Reset default padding
    },

    inputWithLeftIcon: {
        marginLeft: spacing.sm,
    },

    inputWithRightIcon: {
        marginRight: spacing.sm,
    },

    leftIcon: {
        marginRight: spacing.sm,
    },

    rightIcon: {
        marginLeft: spacing.sm,
    },

    errorText: {
        ...typography.caption,
        color: colors.error,
        marginTop: spacing.xs,
    },

    helperText: {
        ...typography.caption,
        color: colors.text.secondary,
        marginTop: spacing.xs,
    },
});

export default Input;
