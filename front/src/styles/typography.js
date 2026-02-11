/**
 * Clean Pro - Typography System
 * 
 * Cafe24Ssurround (Display) + Paperlogy (Body) 조합
 */

export const fonts = {
    display: 'Cafe24Ssurround',     // 임팩트 제목
    displayAir: 'Cafe24SsurroundAir', // 얇은 제목 (옵션)
    heading: 'Paperlogy-SemiBold',
    body: 'Paperlogy-Regular',
    medium: 'Paperlogy-Medium',
    bold: 'Paperlogy-Bold',
};

export const typography = {
    // Display - 큰 제목 (카페24 써라운드)
    display1: {
        fontFamily: 'Cafe24Ssurround',
        fontSize: 40,
        lineHeight: 48,
        letterSpacing: -0.5,
    },
    display2: {
        fontFamily: 'Cafe24Ssurround',
        fontSize: 32,
        lineHeight: 40,
        letterSpacing: -0.25,
    },

    // Headings (Paperlogy)
    h1: {
        fontFamily: 'Paperlogy-Bold',
        fontSize: 28,
        lineHeight: 36,
        letterSpacing: 0,
    },
    h2: {
        fontFamily: 'Paperlogy-SemiBold',
        fontSize: 24,
        lineHeight: 32,
        letterSpacing: 0,
    },
    h3: {
        fontFamily: 'Paperlogy-SemiBold',
        fontSize: 20,
        lineHeight: 28,
        letterSpacing: 0,
    },
    h4: {
        fontFamily: 'Paperlogy-SemiBold',
        fontSize: 18,
        lineHeight: 24,
        letterSpacing: 0,
    },

    // Body Text (Paperlogy)
    bodyLarge: {
        fontFamily: 'Paperlogy-Regular',
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0,
    },
    body: {
        fontFamily: 'Paperlogy-Regular',
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0,
    },
    bodySmall: {
        fontFamily: 'Paperlogy-Regular',
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0,
    },

    // Special Purpose
    button: {
        fontFamily: 'Paperlogy-SemiBold',
        fontSize: 16,
        lineHeight: 20,
        letterSpacing: 0.5,
    },
    caption: {
        fontFamily: 'Paperlogy-Regular',
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0,
    },
    overline: {
        fontFamily: 'Paperlogy-SemiBold',
        fontSize: 10,
        lineHeight: 16,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },

    // Numeric/Stats
    statLarge: {
        fontFamily: 'Paperlogy-Bold',
        fontSize: 48,
        lineHeight: 56,
        letterSpacing: -1,
    },
    stat: {
        fontFamily: 'Paperlogy-SemiBold',
        fontSize: 32,
        lineHeight: 40,
        letterSpacing: -0.5,
    },
    statSmall: {
        fontFamily: 'Paperlogy-Medium',
        fontSize: 20,
        lineHeight: 28,
        letterSpacing: 0,
    },
};

export default typography;
