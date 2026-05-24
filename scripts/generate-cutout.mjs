/**
 * Regenerate profile-photo-cutout.png from profile-photo.jpg (requires rembg[cpu]).
 * Run: python -m pip install "rembg[cpu]" pillow
 *      node scripts/generate-cutout.mjs  (or use the Python one-liner in README)
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const py = process.env.PYTHON ?? "python";
const script = `
from rembg import remove
from PIL import Image
from pathlib import Path
p = Path(${JSON.stringify(join(root, "assets/images"))})
inp, out = p / "profile-photo.jpg", p / "profile-photo-cutout.png"
img = remove(Image.open(inp))
w = 720
img = img.resize((w, int(img.height * w / img.width)), Image.Resampling.LANCZOS)
img.save(out, optimize=True)
print(out)
`;

const r = spawnSync(py, ["-c", script], { stdio: "inherit" });
process.exit(r.status ?? 1);
