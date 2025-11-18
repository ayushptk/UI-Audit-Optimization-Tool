from fastapi import APIRouter, UploadFile
from app.services.file_service import save_uploaded_file
from app.services.spacing_service import analyze_spacing
from app.services.typography_service import analyze_typography
from app.services.color_service import analyze_colors
from app.services.layout_service import analyze_layout
from app.services.ux_service import analyze_ux
from app.core.rules import UI_RULES
from app.utils.extract_layers import extract_mock_layers

router = APIRouter()

@router.post("/analyze-ui")
async def analyze_ui(file: UploadFile):
    file_path = save_uploaded_file(file)

    # Extract layers (later replace with real extraction)
    data = extract_mock_layers()
    layers = data["layers"]
    text_layers = data["text_layers"]

    return {
        "spacing": analyze_spacing(layers, UI_RULES["spacing"]),
        "typography": analyze_typography(text_layers, UI_RULES["typography"]),
        "colors": analyze_colors(file_path, UI_RULES["colors"]),
        "layout": analyze_layout(layers, UI_RULES["layout"]),
        "ux": analyze_ux(UI_RULES["ux"]),
    }
