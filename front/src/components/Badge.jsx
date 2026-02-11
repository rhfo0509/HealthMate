import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

/**
 * Clean Pro - Badge Component
 * 
 * 상태 표시용 작은 뱃지
 * Types: success, warning, error, info, default
 */

const Badge = ({
    children,
    type = 'default',
    size = 'md',
    style,
    textStyle,
    ...props
}) => {
    const badgeStyles = [
        styles.base,
        styles[type],
        styles[`size_${size}`],
        style,
    ];

    const textStyles = [
        styles.textBase,
        styles[`text_${type}`],
        styles[`textSize_${size}`],
        textStyle,
    ];

    return (
        <View style={badgeStyles} {...props}>
            <Text style={textStyles}>{children}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    base: {
        alignSelf: 'flex-start',
        borderRadius: borderRadius.full,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
    },

    textBase: {
        ...typography.caption,
    },

    // Types
    success: {
        backgroundColor: colors.success + '20', // 20% opacity
    },
    warning: {
        backgroundColor: colors.warning + '20',
    },
    error: {
        backgroundColor: colors.error + '20',
    },
    info: {
        backgroundColor: colors.info + '20',
    },
    default: {
        backgroundColor: colors.gray[200],
    },

    // Text colors
    text_success: {
        color: colors.success,
    },
    text_warning: {
        color: colors.warning,
    },
    text_error: {
        color: colors.error,
    },
    text_info: {
        color: colors.info,
    },
    text_default: {
        color: colors.text.secondary,
    },

    // Sizes
    size_sm: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
    },
    size_md: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
    },
    size_lg: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
    },

    textSize_sm: {
        fontSize: 10,
    },
    textSize_md: {
        fontSize: 12,
    },
    textSize_lg: {
        fontSize: 14,
    },
});

export default Badge;
