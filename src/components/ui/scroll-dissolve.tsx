"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  colorFrom: string;
  colorTo: string;
  height?: string;
  className?: string;
};

const VERTEX_SRC = `
  attribute vec2 a_position;
  varying vec2 vUv;
  void main() {
    vUv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SRC = `
precision mediump float;

uniform float uTime;
uniform float uProgress;
uniform vec3 uColorFrom;
uniform vec3 uColorTo;
uniform vec2 uResolution;

varying vec2 vUv;

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * valueNoise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / uResolution.y;
  vec2 nUv = uv * vec2(aspect, 1.0);

  // Multi-octave value noise drives the dissolve front
  float n = fbm(nUv * 3.0 + vec2(uTime * 0.04, uTime * 0.03));

  // Top of canvas = 0, bottom = 1
  float wipeMask = 1.0 - uv.y;

  // Noise amplitude fades near top/bottom edges so the dissolve never bleeds
  // past the panel boundaries — the panel matches the solid sections above/below.
  float edgeFade = smoothstep(0.0, 0.18, uv.y) * smoothstep(1.0, 0.82, uv.y);
  float noiseAmp = 0.35 * edgeFade;
  float displaced = wipeMask + (n - 0.5) * noiseAmp;

  // Threshold maps uProgress [0..1] -> [1.5..-0.5] so that:
  //   progress=0  -> threshold above max(displaced) -> entire panel = colorFrom
  //   progress=1  -> threshold below min(displaced) -> entire panel = colorTo
  float threshold = 1.5 - uProgress * 2.0;
  float wipe = smoothstep(threshold - 0.15, threshold + 0.15, displaced);

  vec3 col = mix(uColorFrom, uColorTo, wipe);

  // Film grain, also faded at edges
  float grain = (hash21(uv * uResolution + uTime) - 0.5) * 0.025 * edgeFade;
  col += grain;

  gl_FragColor = vec4(col, 1.0);
}
`;

const hexToRgb = (hex: string): [number, number, number] => {
  const m = hex.replace("#", "").match(/.{1,2}/g);
  if (!m || m.length < 3) return [0, 0, 0];
  return [
    parseInt(m[0], 16) / 255,
    parseInt(m[1], 16) / 255,
    parseInt(m[2], 16) / 255,
  ];
};

const compileShader = (gl: WebGLRenderingContext, type: number, src: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    const kind = type === gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT";
    console.error(`[ScrollDissolve] ${kind} shader compile failed:`, log || "(no info log)");
    console.error(`[ScrollDissolve] ${kind} source:\n${src}`);
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

const ScrollDissolve = ({
  colorFrom,
  colorTo,
  height = "60vh",
  className = "",
}: Props) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const gl =
      (canvas.getContext("webgl", {
        antialias: false,
        alpha: false,
        premultipliedAlpha: false,
        powerPreference: "low-power",
      }) as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl || gl.isContextLost()) {
      setSupported(false);
      return;
    }

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
    if (!vs || !fs) {
      setSupported(false);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      setSupported(false);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      setSupported(false);
      return;
    }

    gl.useProgram(program);

    // Fullscreen triangle (covers entire NDC)
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "uTime");
    const uProgress = gl.getUniformLocation(program, "uProgress");
    const uColorFrom = gl.getUniformLocation(program, "uColorFrom");
    const uColorTo = gl.getUniformLocation(program, "uColorTo");
    const uResolution = gl.getUniformLocation(program, "uResolution");

    const fromRgb = hexToRgb(colorFrom);
    const toRgb = hexToRgb(colorTo);
    gl.uniform3f(uColorFrom, fromRgb[0], fromRgb[1], fromRgb[2]);
    gl.uniform3f(uColorTo, toRgb[0], toRgb[1], toRgb[2]);

    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const updateProgress = () => {
      const rect = wrap.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const total = rect.height + viewportH;
      const traveled = viewportH - rect.top;
      progressRef.current = Math.max(0, Math.min(1, traveled / total));
    };
    const onScroll = () => updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    updateProgress();

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setSupported(false);
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    let mounted = true;
    let raf = 0;
    const start = performance.now();

    const loop = (now: number) => {
      if (!mounted || gl.isContextLost()) return;
      gl.uniform1f(uTime, (now - start) * 0.001);
      gl.uniform1f(uProgress, progressRef.current);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      if (!gl.isContextLost()) {
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      }
    };
  }, [colorFrom, colorTo, reduceMotion]);

  if (reduceMotion || !supported) {
    return (
      <div
        ref={wrapRef}
        aria-hidden="true"
        className={`relative w-full ${className}`}
        style={{
          height,
          background: `linear-gradient(to bottom, ${colorFrom}, ${colorTo})`,
        }}
      />
    );
  }

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`relative w-full ${className}`}
      style={{ height }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default ScrollDissolve;
