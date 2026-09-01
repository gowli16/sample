# 🌌 WAD_SIG - 3D-Enhanced Technical Club Website

Welcome to the official interactive website of the **Web & App Dev SIG** college technical club. This site features immersive, real-time 3D elements, custom graphics shaders, smooth GSAP scrolling dynamics, 3D mouse card tilt interactions, and an interactive CLI terminal shell.

## 🚀 Live Previewing the Site

Because we loaded all scripts via global script CDNs, the site is immune to local CORS file restrictions. You do not need to install any node modules or start local servers!

1. Open your file explorer.
2. Navigate to the project directory: `C:\Users\menon\sample`
3. Double-click **`index.html`** to launch it in any modern web browser.

---

## 📁 Project Directory Structure

```text
C:\Users\menon\sample\
├── index.html       # Primary semantic layout, structure & glassmorphic panels
├── style.css        # Space Grotesk/Inter typography, custom neon components, scrollbars
├── script.js        # WebGL rendering engine, custom shaders, GSAP animations, interactions
├── assets/          # Generated sci-fi/cyberpunk images
│   ├── web_lead.png
│   ├── app_lead.png
│   ├── design_lead.png
│   ├── gallery_hackathon.png
│   ├── gallery_workshop.png
│   ├── gallery_coding.png
│   └── gallery_celebration.png
└── README.md        # Documentation (this file)
```

---

## ⚡ Technical & Interactive Systems

1. **Global Particles Background**: 1,500 glowing stars drifting in a WebGL canvas. When scrolling past the Projects section towards the Join CTA, the stars transition upward and accelerate up to `5.5x` velocity.
2. **Hero WebGL Globe**: A wireframe particles sphere rotating in real-time. Orbiting HTML tags (`BUILD`, `INNOVATE`, `COLLABORATE`, `DEPLOY`) rotate in 3D sync. Mouse cursor coordinates trigger parallax, and mouse velocity speeds up rotation.
3. **About Section levitating Mesh**: A custom vertex and fragment shader implementing an **Emissive Fresnel glowing ring** that pulses on an Icosahedron, connected to orbiting spheres.
4. **Projects Solar System**: Orbiting planets surrounding a central molten sun running a **procedural swirling Simplex noise shader**. Hovering triggers GSAP scale-ups and detailed cursor tooltips.
5. **Stats count-up**: An Intersection Observer triggers GSAP number tweens.
6. **3D Tilt Cards**: Team member cards tilt in X/Y axes matching cursor location with moving reflections.
7. **Scattered Polaroids**: Polaroids scale, straighten, and cast shadows on hover.
8. **Command Line Terminal Overlay**: A functional retro shell parsing commands like `help`, `about`, `projects`, `join`, `clear`, and `exit`.
