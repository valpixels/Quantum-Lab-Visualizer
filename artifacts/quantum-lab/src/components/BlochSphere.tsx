import { useEffect, useRef } from "react";
import * as THREE from "three";

interface BlochSphereProps {
  theta: number;
  phi: number;
  /** When true the sphere can be dragged to change the state. */
  interactive?: boolean;
  onStateChange?: (theta: number, phi: number) => void;
  /**
   * What dragging does. "state" changes the qubit (needs `interactive`), "view" just turns the sphere
   * so everyone, including synced students, can look around. Defaults to "state" when interactive, otherwise "view".
   */
  dragMode?: "state" | "view";
  autoRotate?: boolean;
}

/**
 * Bloch vector (x, y, z) = (sinθ cosφ, sinθ sinφ, cosθ) is drawn with three.js axes (x, z, -y).
 * That is a pure rotation, so the picture is not a mirror image: |+⟩ is +X, |i⟩ is +Y, |0⟩ is up.
 */
function blochToScene(theta: number, phi: number): THREE.Vector3 {
  const bx = Math.sin(theta) * Math.cos(phi);
  const by = Math.sin(theta) * Math.sin(phi);
  const bz = Math.cos(theta);
  return new THREE.Vector3(bx, bz, -by).normalize();
}

export default function BlochSphere({
  theta,
  phi,
  interactive = false,
  onStateChange,
  dragMode,
  autoRotate = false,
}: BlochSphereProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  // Handlers are attached once, so they read the latest props through this ref instead of a stale closure.
  const propsRef = useRef({ interactive, onStateChange, dragMode, autoRotate, theta, phi });
  propsRef.current = { interactive, onStateChange, dragMode, autoRotate, theta, phi };

  const sceneApi = useRef<{ setState: (th: number, ph: number) => void } | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const initialW = Math.max(1, container.clientWidth);
    const initialH = Math.max(1, container.clientHeight);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(initialW, initialH);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, initialW / initialH, 0.1, 100);
    camera.position.set(2.5, 1.8, 2.5);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dirLight = new THREE.DirectionalLight(0x6366f1, 1.2);
    dirLight.position.set(3, 5, 3);
    scene.add(dirLight);

    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    sphereGroup.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(1, 48, 48),
        new THREE.MeshPhongMaterial({ color: 0x1e1b4b, transparent: true, opacity: 0.35 }),
      ),
    );
    sphereGroup.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(1.001, 24, 24),
        new THREE.MeshBasicMaterial({ color: 0x4338ca, wireframe: true, transparent: true, opacity: 0.15 }),
      ),
    );

    const equatorPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      equatorPoints.push(new THREE.Vector3(Math.cos(a), 0, Math.sin(a)));
    }
    sphereGroup.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(equatorPoints),
        new THREE.LineBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.5 }),
      ),
    );

    function makeAxis(dir: THREE.Vector3, color: number, label: string) {
      const geo = new THREE.BufferGeometry().setFromPoints([
        dir.clone().multiplyScalar(-1.3),
        dir.clone().multiplyScalar(1.3),
      ]);
      sphereGroup.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color })));
      const sprite = makeTextSprite(label, color);
      sprite.position.copy(dir.clone().multiplyScalar(1.5));
      sphereGroup.add(sprite);
    }
    // Scene axes: Bloch X = scene +x, Bloch Z = scene +y, Bloch Y = scene -z (right-handed).
    makeAxis(new THREE.Vector3(1, 0, 0), 0xef4444, "X");
    makeAxis(new THREE.Vector3(0, 1, 0), 0x22c55e, "Z");
    makeAxis(new THREE.Vector3(0, 0, -1), 0x3b82f6, "Y");

    function addLabel(pos: THREE.Vector3, text: string) {
      const sprite = makeTextSprite(text, 0xffffff);
      sprite.position.copy(pos);
      sphereGroup.add(sprite);
    }
    addLabel(new THREE.Vector3(0, 1.45, 0), "|0⟩");
    addLabel(new THREE.Vector3(0, -1.45, 0), "|1⟩");
    addLabel(new THREE.Vector3(1.65, 0, 0), "|+⟩");
    addLabel(new THREE.Vector3(-1.65, 0, 0), "|-⟩");
    addLabel(new THREE.Vector3(0, 0, -1.65), "|i⟩");
    addLabel(new THREE.Vector3(0, 0, 1.65), "|-i⟩");

    const stateVector = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 1, 0xa855f7, 0.18, 0.12);
    sphereGroup.add(stateVector);

    let curTheta = propsRef.current.theta;
    let curPhi = propsRef.current.phi;
    const setState = (th: number, ph: number) => {
      curTheta = th;
      curPhi = ph;
      stateVector.setDirection(blochToScene(th, ph));
    };
    setState(curTheta, curPhi);
    sceneApi.current = { setState };

    // View orientation (separate from the qubit state).
    let yaw = 0;
    let pitch = 0;
    let dragging = false;
    let dragIsState = false;
    let last = { x: 0, y: 0 };

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (propsRef.current.autoRotate && !dragging) yaw += 0.003;
      sphereGroup.rotation.y = yaw;
      sphereGroup.rotation.x = pitch;
      renderer.render(scene, camera);
    };
    animate();

    const onPointerDown = (e: PointerEvent) => {
      const p = propsRef.current;
      const mode = p.dragMode ?? (p.interactive ? "state" : "view");
      dragIsState = mode === "state" && p.interactive;
      dragging = true;
      last = { x: e.clientX, y: e.clientY };
      container.setPointerCapture?.(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      last = { x: e.clientX, y: e.clientY };
      if (dragIsState) {
        const twoPi = Math.PI * 2;
        const ph = (((curPhi + dx * 0.015) % twoPi) + twoPi) % twoPi;
        const th = Math.max(0, Math.min(Math.PI, curTheta + dy * 0.015));
        setState(th, ph);
        propsRef.current.onStateChange?.(th, ph);
      } else {
        yaw += dx * 0.01;
        pitch = Math.max(-1.2, Math.min(1.2, pitch + dy * 0.01));
      }
    };
    const onPointerUp = (e: PointerEvent) => {
      dragging = false;
      container.releasePointerCapture?.(e.pointerId);
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);

    const resize = () => {
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose?.();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(material) ? material : material ? [material] : []).forEach((m) => {
          (m as THREE.SpriteMaterial).map?.dispose?.();
          m.dispose();
        });
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      sceneApi.current = null;
    };
  }, []);

  // Follow the theta/phi props (presets, sliders, teacher sync).
  useEffect(() => {
    sceneApi.current?.setState(theta, phi);
  }, [theta, phi]);

  const p0 = Math.cos(theta / 2) ** 2;
  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      style={{ touchAction: "none", cursor: "grab" }}
      role="img"
      aria-label={`Bloch sphere. Chance of measuring 0: ${(p0 * 100).toFixed(0)}%, chance of measuring 1: ${((1 - p0) * 100).toFixed(0)}%.`}
    />
  );
}

function makeTextSprite(text: string, color: number): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 128, 64);
  ctx.font = "bold 28px monospace";
  ctx.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 64, 32);
  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(0.4, 0.2, 1);
  return sprite;
}
