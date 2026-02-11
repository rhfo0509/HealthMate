/**
 * Clean Pro - Theme (통합 디자인 시스템)
 * 
 * 모든 디자인 토큰을 한 곳에서 export
 */

import colors from './colors';
import typography from './typography';
import { spacing, borderRadius, shadows, zIndex } from './spacing';

export const theme = {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    zIndex,
};

export default theme;

// 개별 export도 제공
export { colors, typography, spacing, borderRadius, shadows, zIndex };
