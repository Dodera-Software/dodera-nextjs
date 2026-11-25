import {
    AdditiveBlending,
    BufferAttribute,
    BufferGeometry,
    Color,
    PerspectiveCamera,
    Points,
    Scene,
    ShaderMaterial,
    WebGLRenderer,
} from "three";

export interface HeroFieldOptions {
    markSrc: string;
    onReady: () => void;
}

const FIELD = {
    sampleSize: 200,
    sampleStep: 2,
    layers: 3,
    depth: 0.3,
    dust: 2600,
    markWidth: 2.7,
    fov: 32,
    cameraZ: 9,
    pixelRatioCap: 1.75,
    pointSize: 78,
    pointerEase: 0.06,
    palette: { ink: "#f2f0f5", brand: "#ff2f57", deep: "#d0102e", ember: "#ff5a3c" },
} as const;

const VERTEX =`
uniform float uTime;
uniform float uAssemble;
uniform float uExit;
uniform float uSize;
uniform float uPixelRatio;
attribute vec3 aScatter;
attribute vec3 aColor;
attribute float aSeed;
attribute float aDust;
varying vec3 vColor;
varying float vAlpha;

void main() {
    float delay = aSeed * 0.45;
    float a = aDust > 0.5 ? 0.0 : smoothstep(delay, delay + 0.55, uAssemble);
    vec3 p = mix(aScatter, position, a);
    float drift = mix(0.22, 0.01, a);
    p += vec3(sin(uTime * 0.55 + aSeed * 41.0), cos(uTime * 0.47 + aSeed * 29.0), sin(uTime * 0.38 + aSeed * 17.0)) * drift;
    vec3 dir = normalize(position + vec3(0.0, 0.0, 1.4));
    p += (dir * 3.2 + aScatter * 0.35) * uExit * (0.5 + aSeed);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float size = aDust > 0.5 ? 0.55 : mix(0.75, 1.0, a);
    gl_PointSize = uSize * uPixelRatio * size * (0.55 + aSeed * 0.9) / -mv.z;
    vColor = aColor;
    float twinkle = 0.75 + 0.25 * sin(uTime * 1.7 + aSeed * 90.0);
    vAlpha = (aDust > 0.5 ? 0.4 * twinkle : mix(0.45, 0.95, a)) * (1.0 - uExit * 0.85);
}
`;

const FRAGMENT =`
varying vec3 vColor;
varying float vAlpha;

void main() {
    float d = length(gl_PointCoord - 0.5);
    float halo = smoothstep(0.5, 0.0, d);
    float core = smoothstep(0.2, 0.0, d);
    float alpha = (halo * halo * 0.55 + core) * vAlpha;
    gl_FragColor = vec4(vColor * alpha, alpha);
}
`;

const random = (seed: number) => {
    const x = Math.sin(seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
};

async function sampleMark(src: string): Promise<{ positions: number[]; colors: number[] }> {
    const image = new Image();
    image.decoding = "async";
    image.src = src;
    await image.decode();
    const size = FIELD.sampleSize;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("2d context unavailable");
    ctx.drawImage(image, 0, 0, size, size);
    const { data } = ctx.getImageData(0, 0, size, size);
    const positions: number[] = [];
    const colors: number[] = [];
    const scale = FIELD.markWidth / size;
    const color = new Color();
    for (let y = 0; y < size; y += FIELD.sampleStep) {
        for (let x = 0; x < size; x += FIELD.sampleStep) {
            const i = (y * size + x) * 4;
            if (data[i + 3] < 140) continue;
            color.setRGB(data[i] / 255, data[i + 1] / 255, data[i + 2] / 255);
            for (let layer = 0; layer < FIELD.layers; layer++) {
                const jitter = random(x * 7.1 + y * 3.3 + layer);
                positions.push((x - size / 2) * scale + (jitter - 0.5) * scale, -(y - size / 2) * scale + (random(jitter * 9) - 0.5) * scale, (layer / (FIELD.layers - 1) - 0.5) * FIELD.depth);
                colors.push(color.r, color.g, color.b);
            }
        }
    }
    return { positions, colors };
}

function scatterPoint(seed: number, radius: number): [number, number, number] {
    const u = random(seed * 1.7);
    const v = random(seed * 3.1);
    const r = radius * (0.35 + Math.cbrt(random(seed * 5.3)) * 0.65);
    const theta = u * Math.PI * 2;
    const phi = Math.acos(2 * v - 1);
    return [r * Math.sin(phi) * Math.cos(theta) * 1.6, r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi) - 1.5];
}

export class HeroField {
    private renderer: WebGLRenderer;
    private scene = new Scene();
    private camera = new PerspectiveCamera(FIELD.fov, 1, 0.1, 100);
    private material: ShaderMaterial;
    private points: Points | null = null;
    private frame = 0;
    private running = false;
    private visible = true;
    private start = performance.now();
    private pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    private resizeObserver: ResizeObserver;
    private intersectionObserver: IntersectionObserver;

    constructor(private readonly canvas: HTMLCanvasElement, private readonly options: HeroFieldOptions) {
        this.renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
        this.renderer.setClearColor(0x000000, 0);
        this.camera.position.set(0, 0, FIELD.cameraZ);
        this.material = new ShaderMaterial({
            vertexShader: VERTEX,
            fragmentShader: FRAGMENT,
            transparent: true,
            depthWrite: false,
            blending: AdditiveBlending,
            uniforms: {
                uTime: { value: 0 },
                uAssemble: { value: 0 },
                uExit: { value: 0 },
                uSize: { value: FIELD.pointSize },
                uPixelRatio: { value: 1 },
            },
        });
        this.resizeObserver = new ResizeObserver(() => this.resize());
        this.resizeObserver.observe(canvas);
        this.intersectionObserver = new IntersectionObserver(([entry]) => {
            this.visible = entry.isIntersecting;
            this.sync();
        });
        this.intersectionObserver.observe(canvas);
        window.addEventListener("pointermove", this.onPointer, { passive: true });
        document.addEventListener("visibilitychange", this.sync);
        this.resize();
    }

    async load() {
        const { positions, colors } = await sampleMark(this.options.markSrc);
        const markCount = positions.length / 3;
        const count = markCount + FIELD.dust;
        const position = new Float32Array(count * 3);
        const scatter = new Float32Array(count * 3);
        const color = new Float32Array(count * 3);
        const seed = new Float32Array(count);
        const dust = new Float32Array(count);
        const toRgb = (hex: string) => {
            const n = parseInt(hex.slice(1), 16);
            return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
        };
        const ink = toRgb(FIELD.palette.ink);
        const brand = toRgb(FIELD.palette.brand);
        const deep = toRgb(FIELD.palette.deep);
        const ember = toRgb(FIELD.palette.ember);
        for (let i = 0; i < count; i++) {
            const s = random(i + 0.5);
            seed[i] = s;
            const [sx, sy, sz] = scatterPoint(i + 1, i < markCount ? 4.2 : 7.5);
            scatter.set([sx, sy, sz], i * 3);
            if (i < markCount) {
                position.set(positions.slice(i * 3, i * 3 + 3), i * 3);
                const r = colors[i * 3];
                const g = colors[i * 3 + 1];
                const b = colors[i * 3 + 2];
                const tone = r > 0.85 && g > 0.85 && b > 0.85 ? ink : g < 0.05 && b < 0.1 ? deep : brand;
                color.set(tone, i * 3);
            } else {
                position.set([sx, sy, sz], i * 3);
                color.set(s > 0.8 ? ember : ink, i * 3);
                dust[i] = 1;
            }
        }
        const geometry = new BufferGeometry();
        geometry.setAttribute("position", new BufferAttribute(position, 3));
        geometry.setAttribute("aScatter", new BufferAttribute(scatter, 3));
        geometry.setAttribute("aColor", new BufferAttribute(color, 3));
        geometry.setAttribute("aSeed", new BufferAttribute(seed, 1));
        geometry.setAttribute("aDust", new BufferAttribute(dust, 1));
        this.points = new Points(geometry, this.material);
        this.points.frustumCulled = false;
        this.scene.add(this.points);
        this.layout();
        this.render();
        this.options.onReady();
        this.sync();
    }

    setAssemble(value: number) {
        this.material.uniforms.uAssemble.value = value;
    }

    setExit(value: number) {
        this.material.uniforms.uExit.value = value;
        this.sync();
    }

    dispose() {
        this.running = false;
        cancelAnimationFrame(this.frame);
        this.resizeObserver.disconnect();
        this.intersectionObserver.disconnect();
        window.removeEventListener("pointermove", this.onPointer);
        document.removeEventListener("visibilitychange", this.sync);
        this.points?.geometry.dispose();
        this.material.dispose();
        this.renderer.dispose();
    }

    private onPointer = (event: PointerEvent) => {
        this.pointer.tx = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.ty = (event.clientY / window.innerHeight) * 2 - 1;
    };

    private sync = () => {
        const shouldRun = Boolean(this.points) && this.visible && !document.hidden && this.material.uniforms.uExit.value < 0.999;
        if (shouldRun === this.running) return;
        this.running = shouldRun;
        if (shouldRun) this.frame = requestAnimationFrame(this.tick);
        else cancelAnimationFrame(this.frame);
    };

    private resize() {
        const { clientWidth: w, clientHeight: h } = this.canvas;
        if (!w || !h) return;
        const ratio = Math.min(window.devicePixelRatio || 1, FIELD.pixelRatioCap);
        this.renderer.setPixelRatio(ratio);
        this.renderer.setSize(w, h, false);
        this.material.uniforms.uPixelRatio.value = ratio * (h / 900);
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.layout();
        if (!this.running) this.render();
    }

    private layout() {
        if (!this.points) return;
        const halfWidth = Math.tan((FIELD.fov * Math.PI) / 360) * FIELD.cameraZ * this.camera.aspect;
        this.points.position.x = this.camera.aspect > 1.2 ? halfWidth * 0.5 : 0;
        this.points.position.y = this.camera.aspect > 1.2 ? 0.45 : 0.9;
    }

    private tick = () => {
        if (!this.running) return;
        const t = (performance.now() - this.start) / 1000;
        this.material.uniforms.uTime.value = t;
        const p = this.pointer;
        p.x += (p.tx - p.x) * FIELD.pointerEase;
        p.y += (p.ty - p.y) * FIELD.pointerEase;
        if (this.points) {
            this.points.rotation.y = p.x * 0.42 + Math.sin(t * 0.21) * 0.12;
            this.points.rotation.x = p.y * 0.22 + Math.cos(t * 0.17) * 0.05;
        }
        this.render();
        this.frame = requestAnimationFrame(this.tick);
    };

    private render() {
        this.renderer.render(this.scene, this.camera);
    }
}
