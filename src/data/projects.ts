export interface Project {
  id: string;
  title: string;
  domain: string;
  description: string;
  stack: string[];
  imageUrl: string;
  projectUrl: string;
  liveUrl?: string; // optional — only web projects have a live deployment
  specializations: string[]; // ["Software Architecture", "Embedded Systems", "UI/UX Design"]
  details: {
    overview: string;
    challenge: string;
    solution: string;
    codeSnippetTitle: string;
    codeSnippet: string;
    codeLanguage: string;
  };
}

export const projects: Project[] = [
  {
    id: "roboboat2026",
    title: "RoboBoat 2026: Autonomous Surface Vehicle",
    domain: "Robotics, Autonomous Systems",
    description: "Autonomous surface vehicle competing in the international RoboBoat challenge.",
    stack: ["Python", "ROS", "MAVROS", "YOLOv4-Tiny", "TensorRT", "OpenCV", "ArduPilot"],
    imageUrl: "/projects/roboboat.webp",
    projectUrl: "https://buvroboboatuns.com",
    specializations: ["Autonomous Systems", "Sensor Fusion", "Embedded Systems"],
    details: {
      overview: "Mandakini Raiden is the autonomous surface vehicle built by the Bengawan UV team at Universitas Sebelas Maret for RoboBoat 2026, combining a Jetson Nano, camera, 2D LiDAR, RTK-GPS, and a Cube Orange flight controller into one system. The goal: make perception, navigation, and control work together reliably in real time, not just make the boat move.",
      challenge: "Making camera, LiDAR, RTK-GPS, and the flight controller act as one system. Each mission (buoy navigation, obstacle avoidance, docking) had to stay reliable in real time on real water.",
      solution: "Built a ROS autonomy stack on a Jetson Nano: YOLOv4-Tiny + TensorRT for real-time detection, fused with LiDAR for spatial awareness and adaptive waypoints. RTK-GPS handles positioning, MAVROS bridges to the Cube Orange flight controller. Tested progressively from simulation to on-water trials.",
      codeSnippetTitle: "Vision-First Steering with GPS Fallback",
      codeSnippet: `def run_mission(camera, detector, handler, waypoint):
    """Steer toward the detected target; fall back to GPS when it's lost."""
    detection = detector.detect(camera.read())
    if detection:
        handler.set_velocity(speed=MISSION_SPEED, yaw_rate=steer_toward(detection))
    else:
        handler.move(*waypoint)`,
      codeLanguage: "python"
    }
  },
  {
    id: "automawow",
    title: "Automawow",
    domain: "Web Tool",
    description: "Interactive automata simulator for Theory of Computation: build, simulate, and convert between NFAs and DFAs entirely in the browser.",
    stack: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    imageUrl: "/projects/automawow.png",
    projectUrl: "https://github.com/Adityamulyaf/Automawow",
    liveUrl: "https://automawow.vercel.app/",
    specializations: ["UI/UX Design", "Software Architecture"],
    details: {
      overview: "Automawow is a visual automata simulator built for a Theory of Computation course. It's a full graph editor for constructing DFAs and NFAs by hand, running or stepping through simulations, and converting between regular expressions, NFAs, and DFAs, all on a custom SVG canvas with zero graph-library dependencies.",
      challenge: "Keeping state diagrams readable as they grow: nodes need to auto-space as a regex compiles into dozens of NFA states, and curved transition edges need to route around each other with no graph library to lean on.",
      solution: "Built the canvas in raw SVG: edges are quadratic bezier curves computed from each pair of node centers, trimmed to start and end at the node's radius instead of overlapping it, with parallel transitions between the same two states offset perpendicular to the line so they don't stack. Thompson's construction, subset construction, and Hopcroft's minimization all run as pure functions feeding that same renderer.",
      codeSnippetTitle: "Curved Edge Path Between Two States",
      codeSnippet: `function calcEdgePath(from: Position, to: Position, offset = 0) {
  const [dx, dy] = [to.x - from.x, to.y - from.y];
  const dist = Math.hypot(dx, dy);
  const [ux, uy] = [dx / dist, dy / dist];

  // Trim both ends to the node's edge, not its center.
  const start = { x: from.x + ux * NODE_RADIUS, y: from.y + uy * NODE_RADIUS };
  const end = { x: to.x - ux * NODE_RADIUS, y: to.y - uy * NODE_RADIUS };
  if (offset === 0) return \`M \${start.x} \${start.y} L \${end.x} \${end.y}\`;

  // Bow perpendicular to the line so parallel transitions don't overlap.
  const mid = {
    x: (start.x + end.x) / 2 - uy * offset,
    y: (start.y + end.y) / 2 + ux * offset,
  };
  return \`M \${start.x} \${start.y} Q \${mid.x} \${mid.y} \${end.x} \${end.y}\`;
}`,
      codeLanguage: "typescript"
    }
  },
];
