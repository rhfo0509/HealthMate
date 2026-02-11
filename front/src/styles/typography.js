/**
 * Clean Pro - Typography System
 * 
 * Cafe24Ssurround (Display) + SUIT (Body) 조합
 */

export const fonts = {
    display: 'Cafe24Ssurround',     // 임팩트 제목
    displayAir: 'Cafe24SsurroundAir', // 얇은 제목 (옵션)
    heading: 'SUIT-SemiBold',
    body: 'SUIT-Regular',
    medium: 'SUIT-Medium',
    light: 'SUIT-Light',
    bold: 'SUIT-Bold',
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

    // Headings (SUIT)
    h1: {
        fontFamily: 'SUIT-Bold',
        fontSize: 28,
        lineHeight: 36,
        letterSpacing: 0,
    },
    h2: {
        fontFamily: 'SUIT-SemiBold',
        fontSize: 24,
        lineHeight: 32,
        letterSpacing: 0,
    },
    h3: {
        fontFamily: 'SUIT-SemiBold',
        fontSize: 20,
        lineHeight: 28,
        letterSpacing: 0,
    },
    h4: {
        fontFamily: 'SUIT-SemiBold',
        fontSize: 18,
        lineHeight: 24,
        letterSpacing: 0,
    },

    // Body Text (SUIT)
    bodyLarge: {
        fontFamily: 'SUIT-Regular',
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0,
    },
    body: {
        fontFamily: 'SUIT-Regular',
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0,
    },
    bodySmall: {
        fontFamily: 'SUIT-Regular',
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0,
    },

    // Special Purpose
    button: {
        fontFamily: 'SUIT-SemiBold',
        fontSize: 16,
        lineHeight: 20,
        letterSpacing: 0.5,
    },
    caption: {
        fontFamily: 'SUIT-Regular',
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0,
    },
    overline: {
        fontFamily: 'SUIT-SemiBold',
        fontSize: 10,
        lineHeight: 16,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },

    // Numeric/Stats
    statLarge: {
        fontFamily: 'SUIT-Bold',
        fontSize: 48,
        lineHeight: 56,
        letterSpacing: -1,
    },
    stat: {
        fontFamily: 'SUIT-SemiBold',
        fontSize: 32,
        lineHeight: 40,
        letterSpacing: -0.5,
    },
    statSmall: {
        fontFamily: 'SUIT-Medium',
        fontSize: 20,
        lineHeight: 28,
        letterSpacing: 0,
    },
};

export default typography;
