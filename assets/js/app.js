import initialize from "./init.js";
import sanitizeFilename from "./inputs/file.js";
import conditionals from "./features/conditionals.js";
import pagination from "./features/pagination.js";
import settings from "./features/settings.js";

initialize();
sanitizeFilename();
settings();
pagination();
conditionals();