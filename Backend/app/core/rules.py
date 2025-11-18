UI_RULES = {
    "spacing": {
        "gridUnit": 8,
        "allowedSpacing": [0, 4, 8, 12, 16, 20, 24, 32, 40],
    },

    "typography": {
        "allowedFontSizes": [10, 12, 14, 16, 18, 20, 24, 32, 40],
        "allowedWeights": [300, 400, 500, 600, 700],
    },

    "colors": {
        "minContrastRatio": 4.5  # WCAG AA
    },

    "layout": {
        "maxMisalignment": 3  # allowed pixel range
    },

    "ux": {
        "rules": [
            "CTA buttons should be visually prominent.",
            "Maintain clear hierarchy using font size & weight.",
            "Buttons should have min 44px height for accessibility.",
            "Ensure equal spacing between card components.",
            "Left alignment should be consistent across all sections."
        ]
    }
}
