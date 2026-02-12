import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../styles/theme';

/**
 * Clean Pro - Card Component
 * 
 * 기본 카드 컨테이너
 */

const Card = ({
    children,
    elevation = 'sm',
    padding = 'md',
    style,
    ...props
}) => {
    const cardStyles = [
        styles.base,
        shadows[elevation],
        styles[`padding_${padding}`],
        style,
    ];

    return (
        <View style={cardStyles} {...props}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    base: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border.light,
    },

    // Padding variants
    padding_none: {
        padding: 0,
    },
    padding_sm: {
        padding: spacing.sm,
    },
    padding_md: {
        padding: spacing.md,
    },
    padding_lg: {
        padding: spacing.lg,
    },
    padding_xl: {
        padding: spacing.xl,
    },
});

export default Card;
