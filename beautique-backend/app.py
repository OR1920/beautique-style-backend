from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4
from diffusers import StableDiffusionImg2ImgPipeline
import torch, PIL.Image as Image, io, os

app = app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["*"],
                   allow_methods=["*"], allow_headers=["*"])

pipe = StableDiffusionImg2ImgPipeline.from_pretrained(
    "tloen/stable-makeup-diffusion",
    torch_dtype=torch.float16
).to("cuda")

STYLE_MAP = {
    "wedding": ["romantic bridal makeup", "glamorous bride", "classic red-lip bride"],
    "party": ["bold smokey eyes", "glitter glam", "festival neon"],
    "casual": ["natural day look", "soft blush tones", "everyday fresh"],
    "interview": ["neutral matte finish", "light eyeshadow + gloss", "subtle pink look"],
    "date": ["rosy romantic", "cat-eye charm", "gold shimmer glow"]
}

@app.post("/match")
async def match(image: UploadFile,
                event: str = Form(...),
                n_styles: int = Form(3)):
    img_bytes = await image.read()
    src = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    prompts = STYLE_MAP.get(event, STYLE_MAP["casual"])[:n_styles]
    out = []
    for p in prompts:
        img = pipe(prompt=p, image=src,
                   num_inference_steps=25,
                   strength=0.75,
                   guidance_scale=7).images[0]
        fname = f"{uuid4()}.jpg"
        os.makedirs("static", exist_ok=True)
        img.save(f"static/{fname}")
        out.append({"url": f"/static/{fname}", "title": p.title(), "reason": p})
    return out
