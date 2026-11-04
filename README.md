# Assistant

**Assistant** is an offline AI app. Download an AI model once, then chat with no internet. Chats, profile and photos stay on the device.

Developed by **Jian Ray Pairat**.

## What's inside

| File | What it does |
|---|---|
| `index.html` | The whole app (screens, styles and logic) |
| `sw.js` | Makes the app open offline and turns on multi-core speed |
| `manifest.webmanifest` | Lets phones install the app |
| `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | App icons |

## Put it online with GitHub Pages (free, about 5 minutes)

1. On GitHub, create a new **public** repository, for example `Assistant_AI`.
2. Click **Add file → Upload files** and upload every file in this folder (keep them at the top level, not inside a sub-folder). Click **Commit changes**.
3. Open **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
4. Wait about a minute. Your link will look like `https://YOUR-USERNAME.github.io/Assistant_AI/`.
5. Open the link in **Chrome** on your phone, go to **Models**, and download a model on Wi-Fi. When it finishes, turn on airplane mode and chat: it still works.

Install it: in Chrome tap **⋮ → Add to Home screen / Install app**, or use the **Install** button in the **You** tab.

## Turn it into an Android app (APK / Play Store)

1. Go to **pwabuilder.com** and paste your GitHub Pages link.
2. Choose **Android → Generate package**. You get a signed app bundle for the Play Store and an APK for testing.
3. Keep the signing key file PWABuilder gives you. You need it for every future update.

## Models

33 models from 229 MB to 5.8 GB, all downloaded straight from Hugging Face:

- **Compact (under 1 GB), for any phone:** LFM2 350M, SmolLM2 360M, Qwen2.5 0.5B, Qwen2.5 Coder 0.5B, Qwen3 0.6B, LFM2 700M, SmolVLM 500M (photos), LFM2.5 VL 450M (photos), LFM2.5 1.2B, LFM2.5 1.2B Thinking, Gemma 3 1B, Llama 3.2 1B, Qwen2.5 1.5B, Qwen2.5 Coder 1.5B
- **Small (1–2 GB):** DeepSeek R1 Distill 1.5B, SmolLM2 1.7B, Qwen3 1.7B, LFM2 VL 1.6B (photos), Gemma 2 2B, SmolLM3 3B, Qwen2.5 Coder 3B
- **Medium (2–4 GB), for phones with lots of memory or computers:** Llama 3.2 3B, Qwen2.5 VL 3B (photos), Phi-3.5 Mini, Phi-4 Mini, Qwen3 4B, Gemma 3 4B (photos)
- **Large (over 4 GB), for computers with 16 GB of memory:** Mistral 7B, Qwen2.5 7B, DeepSeek R1 Distill 7B, Llama 3.1 8B, Qwen3 8B, Gemma 2 9B

Some models offer two qualities (for example *Balanced* Q4_K_M and *Max quality* Q8_0). The app checks the device and labels each model *Runs smoothly*, *Runs, a bit slower* or *Heavy for this device*, and asks before downloading a heavy one.

## How it works

- The AI engine is **wllama 3.8.1** (llama.cpp compiled to WebAssembly). It's loaded from the jsDelivr CDN the first time and then saved for offline use.
- Models are GGUF files downloaded from Hugging Face into the browser's private storage (OPFS). They are never uploaded anywhere.
- On devices with WebGPU, the app uses the GPU for faster replies and falls back to the processor automatically.
- Works best in **Chrome or Edge**. Safari and older browsers use a slower compatibility mode that can't open models over 3.5 GB.

## Things to know

- Keep the app open while a model downloads. It asks the phone to keep the screen awake during downloads and replies.
- Small on-device models are fast and private, but they make more mistakes than big online AIs.
- Each model keeps its own license (Apache 2.0, MIT, Gemma Terms, Llama Community License, LFM Open License, Qwen Research License). Qwen2.5 Coder 3B and Qwen2.5 VL 3B are for non-commercial use only. Check the licenses before earning money with the app.
