from enum import Enum

class Separators(Enum):
    COMMA = "Comma"
    SPACE = "Space"

class EdgeStyle(Enum):
    SOLID = "Solid"
    DASHED = "Dashed"
    DOTTED = "Dotted"
    BOLD = "Bold"
    INVISIBLE = "Invis"

class EdgeColor(Enum):
    BLACK = "Black"
    RED = "Red"
    BLUE = "Blue"
    GREEN = "Green"
    ORANGE = "Orange"
    PURPLE = "Purple"
    YELLOW = "Yellow"
    CYAN = "Cyan"
    MAGENTA = "Magenta"
    BROWN = "Brown"
    GRAY = "Gray"
    PINK = "Pink"
    LIME = "Lime"
    NAVY = "Navy"
    TEAL = "Teal"

class Font(Enum):
    TIMES_ROMAN = "Times-Roman"
    ARIAL = "Arial"
    COURIER_NEW = "Courier New"
    HELVETICA = "Helvetica"
    MY_OWN_FONT = "My own font"

class ExportFormat(Enum):
    PNG = "png"
    SVG = "svg"