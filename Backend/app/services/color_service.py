from colorthief import ColorThief

def analyze_colors(file_path, rules):
    color_thief = ColorThief(file_path)
    palette = color_thief.get_palette(color_count=6)

    return {
        "primary_colors": palette[:2],
        "secondary_colors": palette[2:],
    }
