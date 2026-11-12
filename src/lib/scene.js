import * as THREE from 'three';

/**
 * Two readings of the same freight network.
 *
 * Night is the original dispatch console: additive light on black.
 * Day is the same console under daylight — additive blending washes out on
 * a white page, so the palette darkens, the lanes switch to normal
 * blending, and the fog fades to the page colour.
 */
const PALETTES = {
  night: {
    amber: '#FFB41F',
    mint: '#3BE8B0',
    steel: '#5C7BE0',
    fog: '#05070C',
    fogDensity: 0.0165,
    hub: '#0E141F',
    ringOpacity: 0.6,
    dust: '#8FA8D0',
    dustOpacity: 0.4,
    laneOpacity: 0.5,
    additive: true,
  },
  day: {
    amber: '#C97F00',
    mint: '#0E9E6C',
    steel: '#3D5BD1',
    fog: '#FFFFFF',
    fogDensity: 0.0115,
    hub: '#E2E8F0',
    ringOpacity: 0.55,
    dust: '#8496B0',
    dustOpacity: 0.24,
    laneOpacity: 0.42,
    additive: false,
  },
};

/** The theme currently painted on the document. */
export function currentSceneTheme() {
  if (typeof document === 'undefined') return 'night';
  return document.documentElement.getAttribute('data-theme') === 'day' ? 'day' : 'night';
}

/** Deterministic PRNG so the network looks the same on every load. */
function rng(seed = 20261111) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * "Freight network" — an ambient 3D field of hubs and lanes with cargo
 * packets moving along the arcs. Scroll drives the camera through it.
 */
export function createFreightScene(canvas) {
  const rand = rng();
  let theme = currentSceneTheme();
  let P = PALETTES[theme];

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(P.fog, P.fogDensity);

  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 400);
  camera.position.set(0, 0, 62);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));

  const root = new THREE.Group();
  scene.add(root);

  /* ---------------- hubs ---------------- */
  const HUB_COUNT = 34;
  const hubs = [];
  for (let i = 0; i < HUB_COUNT; i++) {
    const a = rand() * Math.PI * 2;
    const r = 12 + Math.pow(rand(), 0.62) * 30;
    const y = (rand() - 0.5) * 16;
    hubs.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r * 0.78));
  }

  const hubGeo = new THREE.SphereGeometry(0.3, 10, 10);
  const hubMat = new THREE.MeshBasicMaterial({ color: P.hub });
  const hubMesh = new THREE.InstancedMesh(hubGeo, hubMat, HUB_COUNT);
  const hubRingGeo = new THREE.SphereGeometry(0.62, 10, 10);
  // White base so the per-instance tint reads as intended instead of being
  // multiplied into an already-saturated colour.
  const hubRingMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: P.ringOpacity,
    wireframe: true,
  });
  const hubRing = new THREE.InstancedMesh(hubRingGeo, hubRingMat, HUB_COUNT);
  const dummy = new THREE.Object3D();
  const tint = new THREE.Color();
  const hubKinds = [];
  hubs.forEach((h, i) => {
    dummy.position.copy(h);
    dummy.updateMatrix();
    hubMesh.setMatrixAt(i, dummy.matrix);
    const s = 0.6 + rand() * 0.9;
    dummy.scale.setScalar(s);
    dummy.updateMatrix();
    hubRing.setMatrixAt(i, dummy.matrix);
    const kind = rand() > 0.72 ? 'mint' : 'amber';
    hubKinds.push(kind);
    tint.set(P[kind]);
    hubRing.setColorAt(i, tint);
  });
  root.add(hubMesh, hubRing);

  /* ---------------- lanes ---------------- */
  const lanes = [];
  const lanePositions = [];
  const laneColors = [];
  const SEGMENTS = 26;

  for (let i = 0; i < HUB_COUNT; i++) {
    const links = 1 + Math.floor(rand() * 3);
    for (let l = 0; l < links; l++) {
      const j = Math.floor(rand() * HUB_COUNT);
      if (j === i) continue;
      const a = hubs[i];
      const b = hubs[j];
      const mid = a.clone().add(b).multiplyScalar(0.5);
      const dir = mid.clone().setY(0).normalize();
      mid.add(dir.multiplyScalar(3.4 + rand() * 5.5));
      mid.y += (rand() - 0.5) * 6;

      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      const pts = curve.getPoints(SEGMENTS);
      const kind = rand() > 0.78 ? 'mint' : rand() > 0.5 ? 'amber' : 'steel';
      const c = new THREE.Color(P[kind]);
      const alpha = 0.12 + rand() * 0.34;
      const vStart = laneColors.length / 3;
      for (let k = 0; k < pts.length - 1; k++) {
        lanePositions.push(pts[k].x, pts[k].y, pts[k].z, pts[k + 1].x, pts[k + 1].y, pts[k + 1].z);
        laneColors.push(c.r, c.g, c.b, c.r, c.g, c.b);
      }
      lanes.push({
        curve,
        kind,
        color: c,
        alpha,
        vStart,
        vCount: laneColors.length / 3 - vStart,
        speed: 0.045 + rand() * 0.075,
        offset: rand(),
      });
    }
  }

  const laneGeo = new THREE.BufferGeometry();
  laneGeo.setAttribute('position', new THREE.Float32BufferAttribute(lanePositions, 3));
  laneGeo.setAttribute('color', new THREE.Float32BufferAttribute(laneColors, 3));
  const laneMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: P.laneOpacity,
    blending: P.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    depthWrite: false,
  });
  root.add(new THREE.LineSegments(laneGeo, laneMat));

  /* ---------------- cargo packets ---------------- */
  const PACKETS = 64;
  const pktGeo = new THREE.SphereGeometry(0.2, 8, 8);
  const pktMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 });
  const packets = new THREE.InstancedMesh(pktGeo, pktMat, PACKETS);
  const packetState = [];
  for (let i = 0; i < PACKETS; i++) {
    packetState.push({
      lane: lanes[Math.floor(rand() * lanes.length)],
      t: rand(),
      dir: rand() > 0.5 ? 1 : -1,
    });
  }
  root.add(packets);

  /* ---------------- dust ---------------- */
  const DUST = 900;
  const dustPos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) {
    dustPos[i * 3] = (rand() - 0.5) * 120;
    dustPos[i * 3 + 1] = (rand() - 0.5) * 70;
    dustPos[i * 3 + 2] = (rand() - 0.5) * 120 - 10;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({
    color: P.dust,
    size: 0.16,
    transparent: true,
    opacity: P.dustOpacity,
    sizeAttenuation: true,
    depthWrite: false,
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  /* ---------------- theme switching ---------------- */
  function setTheme(next) {
    const t = next === 'day' ? 'day' : 'night';
    if (t === theme) return;
    theme = t;
    P = PALETTES[t];

    scene.fog.color.set(P.fog);
    scene.fog.density = P.fogDensity;
    hubMat.color.set(P.hub);
    hubRingMat.opacity = P.ringOpacity;
    laneMat.opacity = P.laneOpacity;
    laneMat.blending = P.additive ? THREE.AdditiveBlending : THREE.NormalBlending;
    laneMat.needsUpdate = true;
    dustMat.color.set(P.dust);
    dustMat.opacity = P.dustOpacity;

    const ring = new THREE.Color();
    hubKinds.forEach((kind, i) => {
      ring.set(P[kind]);
      hubRing.setColorAt(i, ring);
    });
    if (hubRing.instanceColor) hubRing.instanceColor.needsUpdate = true;

    const arr = laneGeo.attributes.color.array;
    lanes.forEach((l) => {
      l.color.set(P[l.kind]);
      for (let v = l.vStart; v < l.vStart + l.vCount; v++) {
        arr[v * 3] = l.color.r;
        arr[v * 3 + 1] = l.color.g;
        arr[v * 3 + 2] = l.color.b;
      }
    });
    laneGeo.attributes.color.needsUpdate = true;
  }

  /* ---------------- camera rig ---------------- */
  let scroll = 0;
  let targetScroll = 0;
  let px = 0;
  let py = 0;
  let tpx = 0;
  let tpy = 0;
  let running = true;
  let visible = true;
  const clock = new THREE.Clock();

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  const io = new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
    },
    { threshold: 0 }
  );
  io.observe(canvas);

  function frame() {
    if (!running) return;
    requestAnimationFrame(frame);
    if (!visible) return;

    const t = clock.getElapsedTime();
    scroll += (targetScroll - scroll) * 0.06;
    px += (tpx - px) * 0.045;
    py += (tpy - py) * 0.045;

    // camera path: slow drift + scroll push + pointer parallax
    const orbit = t * 0.045;
    const depth = scroll * 26;
    camera.position.x = 11 + Math.sin(orbit) * 4.5 + px * 5.5;
    camera.position.y = Math.cos(orbit * 0.7) * 2.2 + py * 3.4 - scroll * 5;
    camera.position.z = 62 - depth;
    camera.lookAt(6 + px * 1.4, -scroll * 3.2 + py * 0.6, -6 - depth * 0.55);

    // packets
    const m = new THREE.Object3D();
    for (let i = 0; i < PACKETS; i++) {
      const p = packetState[i];
      p.t += p.speed * p.dir * 0.016;
      if (p.t > 1) {
        p.t = 0;
        p.dir = 1;
      }
      if (p.t < 0) {
        p.t = 1;
        p.dir = -1;
      }
      const pos = p.lane.curve.getPoint(p.t);
      m.position.copy(pos);
      const s = 0.6 + Math.sin(t * 3 + i) * 0.28;
      m.scale.setScalar(s);
      m.updateMatrix();
      packets.setMatrixAt(i, m.matrix);
      packets.setColorAt(i, p.lane.color);
    }
    packets.instanceMatrix.needsUpdate = true;
    if (packets.instanceColor) packets.instanceColor.needsUpdate = true;

    // hub pulse
    const pulse = 1 + Math.sin(t * 1.6) * 0.06;
    hubRing.scale.setScalar(pulse);

    root.rotation.y = t * 0.014;
    dust.rotation.y = -t * 0.006;

    renderer.render(scene, camera);
  }

  resize();
  window.addEventListener('resize', resize);
  frame();

  return {
    setScroll(v) {
      targetScroll = v;
    },
    setPointer(x, y) {
      tpx = x;
      tpy = y;
    },
    setRunning(v) {
      running = v;
    },
    setTheme,
    getTheme() {
      return theme;
    },
    dispose() {
      io.disconnect();
      window.removeEventListener('resize', resize);
      renderer.dispose();
    },
  };
}
