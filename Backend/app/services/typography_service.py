def analyze_typography(text_layers, rules):
    issues = []

    allowed_sizes = rules["allowedFontSizes"]
    allowed_weights = rules["allowedWeights"]

    for t in text_layers:
        size = t["font_size"]
        weight = t["font_weight"]

        if size not in allowed_sizes:
            nearest = min(allowed_sizes, key=lambda x: abs(x - size))
            issues.append({
                "issue": "Non-standard font size",
                "found": size,
                "suggest": nearest,
            })

        if weight not in allowed_weights:
            issues.append({
                "issue": "Inconsistent font weight",
                "found": weight,
                "suggest": allowed_weights,
            })

    return issues
