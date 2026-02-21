"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

type Axis = "x" | "y" | "z";

type MeshMeta = {
  name: string;
  sizeLabel: string;
  vertices: number;
  triangles: number;
};

type ThreeState = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  grid: THREE.GridHelper;
  axisGroup: THREE.Group;
  mesh?: THREE.Mesh;
  keyLight: THREE.DirectionalLight;
  rimLight: THREE.DirectionalLight;
  lightDistance: number;
  gizmoRenderer: THREE.WebGLRenderer;
  gizmoScene: THREE.Scene;
  gizmoCamera: THREE.OrthographicCamera;
};

const BRAND_COLOR = 0x0f8bfd;
const BRAND_LIGHT = 0xe0f0ff;
const ACCENT_COLOR = 0x12b886;
const MUTED_COLOR = 0x52525b;
const GRID_MAJOR = 0xe0f0ff;
const GRID_MINOR = 0xe4e4e7;
const WORLD_UP = new THREE.Vector3(0, 0, 1);
const ORIGIN = new THREE.Vector3(0, 0, 0);
const FIXED_LIGHT_AZIMUTH = 35;
const FIXED_LIGHT_ELEVATION = 45;

const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  const units = ["KB", "MB", "GB"];
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(2)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
};

const createAxisGroup = (size: number) => {
  const group = new THREE.Group();
  const addAxis = (direction: THREE.Vector3, color: number) => {
    const start = direction.clone().multiplyScalar(-size);
    const end = direction.clone().multiplyScalar(size);
    const geometry = new THREE.BufferGeometry().setFromPoints([
      start,
      end,
    ]);
    const material = new THREE.LineBasicMaterial({ color });
    const line = new THREE.Line(geometry, material);
    line.frustumCulled = false;
    group.add(line);
  };

  addAxis(new THREE.Vector3(1, 0, 0), BRAND_COLOR);
  addAxis(new THREE.Vector3(0, 1, 0), ACCENT_COLOR);
  addAxis(new THREE.Vector3(0, 0, 1), MUTED_COLOR);

  return group;
};

const disposeMesh = (mesh?: THREE.Mesh) => {
  if (!mesh) return;
  if (mesh.geometry) mesh.geometry.dispose();
  if (Array.isArray(mesh.material)) {
    mesh.material.forEach((material) => material.dispose());
  } else if (mesh.material) {
    mesh.material.dispose();
  }
};

const fitCameraToMesh = (
  viewer: ThreeState,
  radius: number,
  direction?: THREE.Vector3,
) => {
  if (!viewer.mesh) return;

  const fov = THREE.MathUtils.degToRad(viewer.camera.fov);
  let distance = radius / Math.sin(fov / 2);
  distance *= 1.2;

  const dir = direction
    ? direction.clone().normalize()
    : new THREE.Vector3(1, 1, 1).normalize();
  viewer.camera.position.copy(ORIGIN).add(dir.multiplyScalar(distance));
  viewer.camera.near = Math.max(distance / 100, 0.01);
  viewer.camera.far = distance * 100;
  viewer.camera.updateProjectionMatrix();
  viewer.controls.target.copy(ORIGIN);
  viewer.controls.update();
};

type MeshMetrics = {
  box: THREE.Box3;
  size: THREE.Vector3;
  center: THREE.Vector3;
  maxDim: number;
  radius: number;
};

const updateLightPositions = (
  viewer: ThreeState,
  azimuthDeg: number,
  elevationDeg: number,
) => {
  const azimuth = THREE.MathUtils.degToRad(azimuthDeg);
  const elevation = THREE.MathUtils.degToRad(elevationDeg);
  const distance = viewer.lightDistance || 8;
  const planar = Math.cos(elevation) * distance;
  const x = planar * Math.cos(azimuth);
  const y = planar * Math.sin(azimuth);
  const z = Math.sin(elevation) * distance;

  viewer.keyLight.position.set(x, y, z);
  viewer.keyLight.target.position.copy(ORIGIN);

  const rimAzimuth = azimuth + Math.PI;
  const rimElevation = THREE.MathUtils.degToRad(
    Math.max(15, Math.min(35, elevationDeg * 0.6)),
  );
  const rimPlanar = Math.cos(rimElevation) * distance;
  viewer.rimLight.position.set(
    rimPlanar * Math.cos(rimAzimuth),
    rimPlanar * Math.sin(rimAzimuth),
    Math.sin(rimElevation) * distance,
  );
  viewer.rimLight.target.position.copy(ORIGIN);
};

const updateViewerForMesh = (viewer: ThreeState): MeshMetrics | null => {
  if (!viewer.mesh) return null;

  viewer.mesh.updateWorldMatrix(true, false);
  const box = new THREE.Box3().setFromObject(viewer.mesh);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const maxDim = Math.max(size.x, size.y, size.z, 1);
  const corners = [
    new THREE.Vector3(box.min.x, box.min.y, box.min.z),
    new THREE.Vector3(box.min.x, box.min.y, box.max.z),
    new THREE.Vector3(box.min.x, box.max.y, box.min.z),
    new THREE.Vector3(box.min.x, box.max.y, box.max.z),
    new THREE.Vector3(box.max.x, box.min.y, box.min.z),
    new THREE.Vector3(box.max.x, box.min.y, box.max.z),
    new THREE.Vector3(box.max.x, box.max.y, box.min.z),
    new THREE.Vector3(box.max.x, box.max.y, box.max.z),
  ];
  let radius = 0;
  corners.forEach((corner) => {
    radius = Math.max(radius, corner.length());
  });
  radius = Math.max(radius, 0.5);

  viewer.grid.scale.setScalar(Math.max(maxDim / 8, 1));
  viewer.axisGroup.scale.setScalar(Math.max(maxDim * 50, 100));

  viewer.controls.minDistance = Math.max(radius * 0.2, 0.05);
  viewer.controls.maxDistance = Math.max(radius * 20, 10);
  viewer.lightDistance = Math.max(maxDim * 2.5, 6);
  updateLightPositions(viewer, FIXED_LIGHT_AZIMUTH, FIXED_LIGHT_ELEVATION);

  return { box, size, center, maxDim, radius };
};

export const StlViewer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gizmoRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const threeRef = useRef<ThreeState | null>(null);
  const pendingFileRef = useRef<File | null>(null);
  const baseQuaternionRef = useRef<THREE.Quaternion | null>(null);

  const [status, setStatus] = useState<
    "init" | "ready" | "loading" | "loaded" | "error"
  >("init");
  const [statusText, setStatusText] = useState("Preparing renderer...");
  const [progress, setProgress] = useState(0);
  const [meshMeta, setMeshMeta] = useState<MeshMeta | null>(null);
  const [activeAxis, setActiveAxis] = useState<Axis>("z");
  const [isDragging, setIsDragging] = useState(false);

  const overlayMessage = useMemo(() => {
    if (status === "init") return "Preparing renderer...";
    if (status === "ready" && !meshMeta) {
      return "Drop an STL to start viewing.";
    }
    if (status === "loading") return "Loading STL...";
    if (status === "error") return statusText;
    return null;
  }, [status, meshMeta, statusText]);

  const alignToAxis = (axis: Axis) => {
    const viewer = threeRef.current;
    if (!viewer?.mesh) return;

    const axisMap: Record<Axis, THREE.Vector3> = {
      x: new THREE.Vector3(1, 0, 0),
      y: new THREE.Vector3(0, 1, 0),
      z: new THREE.Vector3(0, 0, 1),
    };
    const upVector = WORLD_UP.clone();
    const baseQuaternion =
      baseQuaternionRef.current ?? viewer.mesh.quaternion.clone();
    const rotation = new THREE.Quaternion().setFromUnitVectors(
      axisMap[axis].clone().normalize(),
      upVector,
    );
    viewer.mesh.quaternion.copy(baseQuaternion).premultiply(rotation);
    viewer.mesh.updateMatrixWorld();
    updateViewerForMesh(viewer);
    setActiveAxis(axis);
  };

  const handleFiles = (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".stl")) {
      setStatus("error");
      setStatusText("Only .stl files are supported in the viewer.");
      return;
    }

    if (!threeRef.current) {
      pendingFileRef.current = file;
      return;
    }

    loadStl(file);
  };

  const loadStl = (file: File) => {
    const viewer = threeRef.current;
    if (!viewer) return;

    setStatus("loading");
    setStatusText("Reading STL...");
    setProgress(0);
    setMeshMeta(null);

    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const percent = Math.round((event.loaded / event.total) * 100);
      setProgress(percent);
      setStatusText(`Reading STL... ${percent}%`);
    };
    reader.onerror = () => {
      setStatus("error");
      setStatusText("Could not read the STL file.");
    };
    reader.onload = () => {
      try {
        const loader = new STLLoader();
        const geometry = loader.parse(reader.result as ArrayBuffer);
        geometry.computeVertexNormals();
        geometry.computeBoundingBox();
        if (geometry.boundingBox) {
          const center = new THREE.Vector3();
          geometry.boundingBox.getCenter(center);
          const minZ = geometry.boundingBox.min.z;
          geometry.translate(-center.x, -center.y, -minZ);
        }
        geometry.computeBoundingBox();

        const material = new THREE.MeshStandardMaterial({
          color: BRAND_COLOR,
          metalness: 0.12,
          roughness: 0.6,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, 0);
        if (viewer.mesh) {
          viewer.scene.remove(viewer.mesh);
          disposeMesh(viewer.mesh);
        }
        viewer.mesh = mesh;
        baseQuaternionRef.current = mesh.quaternion.clone();
        viewer.scene.add(mesh);

        const position = geometry.attributes.position;
        const vertices = position?.count ?? 0;
        const triangles = Math.round(vertices / 3);
        setMeshMeta({
          name: file.name,
          sizeLabel: formatBytes(file.size),
          vertices,
          triangles,
        });

        const metrics = updateViewerForMesh(viewer);

        setStatus("loaded");
        setStatusText("Model ready.");
        setProgress(100);

        const viewDirection = viewer.camera.position
          .clone()
          .sub(viewer.controls.target)
          .normalize();
        const radius = metrics?.radius ?? 1;
        fitCameraToMesh(viewer, radius, viewDirection);

        alignToAxis(activeAxis);
      } catch (error) {
        setStatus("error");
        setStatusText("STL parsing failed. Try a different file.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const gizmoCanvas = gizmoRef.current;
    if (!container || !canvas || !gizmoCanvas) return;

    const scene = new THREE.Scene();
    scene.up.copy(WORLD_UP);
    scene.background = null;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000);
    camera.up.copy(WORLD_UP);
    camera.position.set(2.5, 2.5, 2.5);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 0.5;
    controls.maxDistance = 2000;
    controls.target.copy(ORIGIN);

    const grid = new THREE.GridHelper(10, 10, GRID_MAJOR, GRID_MINOR);
    grid.rotation.x = Math.PI / 2;
    grid.position.set(0, 0, 0);
    if (Array.isArray(grid.material)) {
      grid.material.forEach((material) => {
        material.depthWrite = false;
      });
    } else {
      grid.material.depthWrite = false;
    }
    scene.add(grid);

    const axisGroup = createAxisGroup(1.25);
    scene.add(axisGroup);

    const ambientLight = new THREE.AmbientLight(BRAND_LIGHT, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
    scene.add(keyLight);
    scene.add(keyLight.target);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
    scene.add(rimLight);
    scene.add(rimLight.target);

    const gizmoRenderer = new THREE.WebGLRenderer({
      canvas: gizmoCanvas,
      alpha: true,
      antialias: true,
    });
    gizmoRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    gizmoRenderer.setClearColor(0x000000, 0);

    const gizmoScene = new THREE.Scene();
    const gizmoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    gizmoCamera.up.copy(WORLD_UP);
    gizmoCamera.position.set(0, 0, 2);
    gizmoScene.add(createAxisGroup(0.65));

    threeRef.current = {
      renderer,
      scene,
      camera,
      controls,
      grid,
      axisGroup,
      keyLight,
      rimLight,
      lightDistance: 8,
      gizmoRenderer,
      gizmoScene,
      gizmoCamera,
    };

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      gizmoRenderer.setSize(96, 96, false);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    updateLightPositions(
      threeRef.current,
      FIXED_LIGHT_AZIMUTH,
      FIXED_LIGHT_ELEVATION,
    );

    setStatus("ready");
    setStatusText("Drop an STL to start viewing.");

    let animationId = 0;
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);

      const gizmoDir = camera.position
        .clone()
        .sub(controls.target)
        .normalize();
      gizmoCamera.position.copy(gizmoDir.multiplyScalar(2.5));
      gizmoCamera.lookAt(gizmoScene.position);
      gizmoRenderer.render(gizmoScene, gizmoCamera);

      animationId = requestAnimationFrame(animate);
    };
    animate();

    if (pendingFileRef.current) {
      loadStl(pendingFileRef.current);
      pendingFileRef.current = null;
    }

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      controls.dispose();
      disposeMesh(threeRef.current?.mesh);
      renderer.dispose();
      gizmoRenderer.dispose();
      threeRef.current = null;
    };
  }, []);


  return (
    <div className="rounded-2xl border border-muted-200 bg-white shadow-card">
      <div className="space-y-3 border-b border-muted-200 px-6 py-6 md:px-8">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-brand-dark">
          <span>Three.js - STL Viewer</span>
          <span className="rounded-full bg-accent/10 px-3 py-1 text-[0.65rem] font-semibold tracking-wide text-accent-dark">
            Local Rendering
          </span>
        </div>
        <h2 className="text-2xl font-heading font-semibold text-muted-900 md:text-3xl">
          Upload an STL and inspect it instantly.
        </h2>
        <p className="max-w-3xl text-sm text-muted-600">
          Drag and drop your model for a quick on-device preview. Orbit, zoom,
          and align the model to X/Y/Z while keeping the grid fixed to validate
          orientation before submitting your print request.
        </p>
      </div>

      <div className="grid gap-6 px-6 py-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:px-8">
        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-500">
              Upload STL
            </p>
            <label
              htmlFor="stl-upload"
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  inputRef.current?.click();
                }
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                handleFiles(event.dataTransfer.files);
              }}
              className={`flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-6 text-center text-sm transition ${
                isDragging
                  ? "border-brand bg-brand-light/60 text-brand-dark"
                  : "border-muted-200 bg-brand-light/40 text-muted-600 hover:border-brand/60"
              }`}
            >
              <span className="font-semibold text-muted-900">
                Drop your STL here or click to upload
              </span>
              <span className="text-xs text-muted-500">
                Files stay in your browser for local rendering.
              </span>
              <input
                id="stl-upload"
                ref={inputRef}
                type="file"
                accept=".stl"
                className="sr-only"
                onChange={(event) => handleFiles(event.target.files)}
              />
            </label>
          </div>

          <div className="rounded-2xl border border-muted-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-500">
              <span>Status</span>
              <span className="text-muted-600">{statusText}</span>
            </div>
            <div className="mt-3">
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                className="h-2 w-full overflow-hidden rounded-full bg-muted-200"
              >
                <div
                  className="h-full rounded-full bg-brand transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-500">
                {status === "loading"
                  ? "Reading STL data and preparing geometry."
                  : "Viewer idle and ready for a model."}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-muted-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-500">
              File Metadata
            </p>
            {meshMeta ? (
              <dl className="mt-3 space-y-2 text-sm text-muted-600">
                <div className="flex items-center justify-between">
                  <dt className="font-semibold text-muted-900">Filename</dt>
                  <dd className="truncate pl-4">{meshMeta.name}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="font-semibold text-muted-900">Size</dt>
                  <dd>{meshMeta.sizeLabel}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="font-semibold text-muted-900">Vertices</dt>
                  <dd>{meshMeta.vertices.toLocaleString()}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="font-semibold text-muted-900">Triangles</dt>
                  <dd>{meshMeta.triangles.toLocaleString()}</dd>
                </div>
              </dl>
            ) : (
              <p className="mt-3 text-sm text-muted-500">
                Upload an STL file to see geometry details and measurements.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-muted-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-500">
              Model Alignment
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["x", "y", "z"] as Axis[]).map((axis) => (
                <button
                  key={axis}
                  type="button"
                  onClick={() => alignToAxis(axis)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                    activeAxis === axis
                      ? "border-brand bg-brand text-white shadow-card"
                      : "border-muted-200 bg-white text-muted-600 hover:border-brand/60 hover:text-brand-dark"
                  }`}
                >
                  {axis}-axis
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-500">
              Rotates the model so the selected axis becomes vertical.
            </p>
          </div>

        </div>

        <div className="relative overflow-hidden rounded-2xl border border-muted-200 bg-white shadow-sm">
          <div ref={containerRef} className="relative h-[420px] w-full">
            <canvas ref={canvasRef} className="block h-full w-full" />
            <canvas
              ref={gizmoRef}
              className="pointer-events-none absolute bottom-4 right-4 block h-24 w-24 rounded-full border border-muted-200 bg-white/80 shadow-sm"
            />
            {overlayMessage ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 text-sm font-semibold text-muted-600">
                {overlayMessage}
              </div>
            ) : null}
          </div>
          <div className="flex items-center justify-between border-t border-muted-200 px-4 py-3 text-xs text-muted-500">
            <span>Orbit: drag | Zoom: scroll</span>
            <span>Up Axis: {activeAxis.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

