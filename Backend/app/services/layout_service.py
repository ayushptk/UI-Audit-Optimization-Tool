def analyze_layout(layers, rules):
    issues = []
    max_offset = rules["maxMisalignment"]

    for layer in layers:
        if abs(layer["x"] % 8) > max_offset:
            issues.append({
                "issue": "Misaligned element",
                "position_x": layer["x"],
                "suggest": f"Snap to nearest 8px grid"
            })

    return issues
