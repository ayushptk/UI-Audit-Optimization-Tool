from pydantic import BaseModel, field_validator
from typing import Any, Dict, Optional, Union
from datetime import datetime
import json
import re


def _parse_maybe_fenced_json(value: Any) -> Any:
    """If `value` is a JSON string (possibly fenced with ```json), parse it.
    Otherwise return the original value.
    """
    if isinstance(value, dict):
        return value
    if not isinstance(value, str):
        return value

    fence_regex = re.compile(r"```(?:json)?\s*([\s\S]*?)\s*```", re.I)
    m = fence_regex.search(value)
    json_str = m.group(1) if m else value
    try:
        return json.loads(json_str)
    except Exception:
        return value


class AiAnalysisCreate(BaseModel):
    design_id: int
    # accept a dict OR a string containing JSON (possibly fenced); validator will try to parse
    result: Union[Dict[str, Any], str, Any]

    @field_validator("result", mode="before")
    def _validate_result(cls, v):
        return _parse_maybe_fenced_json(v)


class AiAnalysisRead(BaseModel):
    id: int
    design_id: int
    user_id: int
    result: Union[Dict[str, Any], str, Any]
    created_at: Optional[datetime]

    model_config = {
        "from_attributes": True
    }

    @field_validator("result", mode="before")
    def _validate_result_read(cls, v):
        return _parse_maybe_fenced_json(v)
