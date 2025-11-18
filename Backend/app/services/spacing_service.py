def analyze_spacing(layers, rules):
    issues = []
    grid = rules["gridUnit"]

    layers_sorted = sorted(layers, key=lambda x: x["y"])

    for i in range(len(layers_sorted) - 1):
        a = layers_sorted[i]
        b = layers_sorted[i+1]

        spacing = b["y"] - (a["y"] + a["height"])

        if spacing % grid != 0:
            nearest = round(spacing / grid) * grid
            issues.append({
                "issue": "Inconsistent spacing",
                "found_spacing": spacing,
                "suggested_spacing": nearest,
            })

    return issues
