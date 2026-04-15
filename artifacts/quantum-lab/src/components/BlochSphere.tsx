import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

interface BlochSphereProps {
  theta: number;
  phi: number;
  interactive?: boolean;
  onStateChange?: (theta: number, phi: number) => void;
}

export default function BlochSphere({
  theta,
  phi,
  interactive = false,
  onStateChange,
}: BlochSphereProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    stateVector: THREE.ArrowHelper;
    animFrame: number;
    isDragging: boolean;
    lastMouse: { x: number; y: number };
    sphereGroup: THREE.Group;
    thetaRef: number;
    phiRef: number;
  } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(2.5, 1.8, 2.5);
    camera.lookAt(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0x6366f1, 1.2);
    dirLight.position.set(3, 5, 3);
    scene.add(dirLight);

    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    const sphereGeo = new THREE.SphereGeometry(1, 48, 48);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x1e1b4b,
      transparent: true,
      opacity: 0.35,
      wireframe: false,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphereGroup.add(sphere);

    const wireGeo = new THREE.SphereGeometry(1.001, 24, 24);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x4338ca,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    sphereGroup.add(new THREE.Mesh(wireGeo, wireMat));

    const equatorPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      equatorPoints.push(new THREE.Vector3(Math.cos(a), 0, Math.sin(a)));
    }
    const equatorGeo = new THREE.BufferGeometry().setFromPoints(equatorPoints);
    const equatorMat = new THREE.LineBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.5 });
    sphereGroup.add(new THREE.Line(equatorGeo, equatorMat));

    function makeAxis(dir: THREE.Vector3, color: number, label: string) {
      const mat = new THREE.LineBasicMaterial({ color });
      const geo = new THREE.BufferGeometry().setFromPoints([
        dir.clone().multiplyScalar(-1.3),
        dir.clone().multiplyScalar(1.3),
      ]);
      sphereGroup.add(new THREE.Line(geo, mat));

      const sprite = makeTextSprite(label, color);
      sprite.position.copy(dir.clone().multiplyScalar(1.5));
      sphereGroup.add(sprite);
    }

    makeAxis(new THREE.Vector3(1, 0, 0), 0xef4444, "X");
    makeAxis(new THREE.Vector3(0, 1, 0), 0x22c55e, "Z");
    makeAxis(new THREE.Vector3(0, 0, 1), 0x3b82f6, "Y");

    function addPoleLabel(pos: THREE.Vector3, text: string) {
      const sprite = makeTextSprite(text, 0xffffff);
      sprite.position.copy(pos);
      sphereGroup.add(sprite);
    }
    addPoleLabel(new THREE.Vector3(0, 1.45, 0), "|0⟩");
    addPoleLabel(new THREE.Vector3(0, -1.45, 0), "|1⟩");
    addPoleLabel(new THREE.Vector3(1.65, 0, 0), "|+⟩");
    addPoleLabel(new THREE.Vector3(-1.65, 0, 0), "|-⟩");

    const arrowDir = new THREE.Vector3(0, 1, 0);
    const stateVector = new THREE.ArrowHelper(arrowDir, new THREE.Vector3(0, 0, 0), 1, 0xa855f7, 0.18, 0.12);
    (stateVector.line.material as THREE.LineBasicMaterial).linewidth = 3;
    sphereGroup.add(stateVector);

    function updateArrow(th: number, ph: number) {
      const x = Math.sin(th) * Math.cos(ph);
      const y = Math.cos(th);
      const z = Math.sin(th) * Math.sin(ph);
      const dir = new THREE.Vector3(x, y, z).normalize();
      stateVector.setDirection(dir);
    }

    updateArrow(theta, phi);

    let animFrame = 0;
    let isDragging = false;
    let lastMouse = { x: 0, y: 0 };
    let thetaRef = theta;
    let phiRef = phi;

    function animate() {
      animFrame = requestAnimationFrame(animate);
      if (!isDragging) {
        sphereGroup.rotation.y += 0.003;
      }
      renderer.render(scene, camera);
    }
    animate();

    sceneRef.current = {
      renderer,
      scene,
      camera,
      stateVector,
      animFrame,
      isDragging,
      lastMouse,
      sphereGroup,
      thetaRef,
      phiRef,
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (!interactive || !sceneRef.current) return;
      sceneRef.current.isDragging = true;
      sceneRef.current.lastMouse = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!sceneRef.current?.isDragging || !interactive) return;
      const dx = e.clientX - sceneRef.current.lastMouse.x;
      const dy = e.clientY - sceneRef.current.lastMouse.y;
      sceneRef.current.lastMouse = { x: e.clientX, y: e.clientY };

      sceneRef.current.phiRef = (sceneRef.current.phiRef + dx * 0.015) % (Math.PI * 2);
      sceneRef.current.thetaRef = Math.max(0, Math.min(Math.PI, sceneRef.current.thetaRef + dy * 0.015));

      updateArrow(sceneRef.current.thetaRef, sceneRef.current.phiRef);

      if (onStateChange) {
        onStateChange(sceneRef.current.thetaRef, sceneRef.current.phiRef);
      }
    };

    const handleMouseUp = () => {
      if (sceneRef.current) sceneRef.current.isDragging = false;
    };

    if (interactive) {
      container.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    const handleResize = () => {
      if (!container || !sceneRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      sceneRef.current.camera.aspect = w / h;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (sceneRef.current) cancelAnimationFrame(sceneRef.current.animFrame);
      if (interactive) {
        container.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      }
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;
    const { stateVector, thetaRef, phiRef } = sceneRef.current;
    const th = interactive ? thetaRef : theta;
    const ph = interactive ? phiRef : phi;
    const x = Math.sin(theta) * Math.cos(phi);
    const y = Math.cos(theta);
    const z = Math.sin(theta) * Math.sin(phi);
    const dir = new THREE.Vector3(x, y, z).normalize();
    stateVector.setDirection(dir);
    sceneRef.current.thetaRef = theta;
    sceneRef.current.phiRef = phi;
  }, [theta, phi]);

  return <div ref={mountRef} className="w-full h-full" />;
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
