def extract_mock_layers():
    return {
        "layers": [
            {"x": 20, "y": 20, "width": 200, "height": 40},
            {"x": 20, "y": 80, "width": 200, "height": 40},
            {"x": 25, "y": 140, "width": 200, "height": 40},  # misaligned
        ],
        "text_layers": [
            {"font_size": 15, "font_weight": 300},
            {"font_size": 16, "font_weight": 600},
            {"font_size": 22, "font_weight": 400},
        ]
    }
