export interface Project {
  id: string;
  title: string;
  domain: string;
  description: string;
  stack: string[];
  imageUrl: string;
  projectUrl: string;
  liveUrl?: string; // optional — only web projects have a live deployment
  gridClass: string; // 'md:col-span-8', 'md:col-span-6', 'md:col-span-4'
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
    id: "roboboat",
    title: "RoboBoat",
    domain: "Robotics",
    description: "Autonomous vessel designed for marine exploration and environmental monitoring.",
    stack: ["C++", "ROS", "Hardware Design"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwfFqd50_dwuIMIsyuBRbDBmsY4Cs1sushevfMihmMMinekAaLN28PHYAJEvrp-6IqGW_SKYZ6D1sj27kcSxGdVv4ffanZ2GXQRt-6enUjIne5Dj51zAiOs_pbVx5yRZR-ApP5s9iq22wZL6UArSFSiBjgHUd7WQPicGzu_wf4W7ps5q6gd6ZwLmOjpLJFD4oRC4eXwmkbGjw4iWRa1Oi6aCRuseWai-L0STCjXAqGKmj8wOWjL7-KtTqveuZ10gvxfMmcJJMtUVlM",
    projectUrl: "https://github.com/firizqi/roboboat",
    gridClass: "md:col-span-8",
    specializations: ["Embedded Systems", "Software Architecture"],
    details: {
      overview: "An autonomous surface vessel engineered for custom bathymetric navigation and obstacle avoidance. Developed as part of the Bengawan UV team for international marine competitions.",
      challenge: "Processing LiDAR clouds and camera frames in real-time under a constrained physical battery profile. Standard edge servers were too heavy and power-intensive.",
      solution: "Migrated navigation scripts to compiled C++ nodes within ROS, offloading computer vision pipelines onto CUDA cores on an optimized NVIDIA Jetson module.",
      codeSnippetTitle: "ROS Navigation Node Init",
      codeSnippet: `#include <ros/ros.h>
#include <geometry_msgs/Twist.h>

class NavigationController {
public:
    NavigationController() {
        pub_ = nh_.advertise<geometry_msgs::Twist>("/cmd_vel", 10);
        ROS_INFO("Autonomous navigation nodes running successfully.");
    }
private:
    ros::NodeHandle nh_;
    ros::Publisher pub_;
};`,
      codeLanguage: "cpp"
    }
  },
  {
    id: "automawhat",
    title: "Automawhat?",
    domain: "Web Tool",
    description: "Workflow visualizer and logic debugger for developer pipelines.",
    stack: ["Next.js", "TypeScript"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIcT9HvmZG1O4ALbceVwpLSKg8DJPmJsJOzRCRSRWV837YKjF3DXYqmjsbEswnv5LTcKiLmRaWNsR1j5S2EQk6G1-uIofeQzU2uP6NgWSLwZOYnNgA5utCxbhI8A-su2L-WvTn4Gzl9sPYdhrBZ4LehPrxJPUgOY6AZH9jfOA1BomkNEuLEgQPz9HW530PryYoAeOwVXER8NIUX40ET93qzpgMa5ioqLJwly9QjacseFY1qWW__O3uSnhvx49dpkgIPXw-WSRadxWM",
    projectUrl: "https://github.com/firizqi/automawhat",
    liveUrl: "https://automawhat.vercel.app",
    gridClass: "md:col-span-4",
    specializations: ["UI/UX Design", "Software Architecture"],
    details: {
      overview: "A lightweight debugger mapping states, finite automata (NFA/DFA), and state-chart triggers directly into structured workflows. Created to reduce friction during compiler design theory classes.",
      challenge: "Rendering dynamic connection paths between state nodes without causing layout shifting or massive virtual DOM repaints.",
      solution: "Implemented SVG bezier path calculations relative to the absolute viewport bounding rect, throttling calculations on window resize using a React hook.",
      codeSnippetTitle: "Bezier Path Vector Function",
      codeSnippet: `export function getBezierPath(p1: Point, p2: Point): string {
  const dx = Math.abs(p2.x - p1.x) * 0.5;
  const c1 = { x: p1.x + dx, y: p1.y };
  const c2 = { x: p2.x - dx, y: p2.y };
  return \`M \${p1.x} \${p1.y} C \${c1.x} \${c1.y}, \${c2.x} \${c2.y}, \${p2.x} \${p2.y}\`;
}`,
      codeLanguage: "typescript"
    }
  },
  {
    id: "halombg",
    title: "HaloMBG",
    domain: "Mobile App",
    description: "Community engagement platform for regional student empowerment.",
    stack: ["Flutter", "Firebase"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3mScnaOJ2MF6o_uWbZ-rkce_Vl2ekssLnDJecHTPW0ir5AW8r-IurG_rdo8ujuDrWVXp1b9DggDSC1bcAKt99hPuC1ZGSP-8TaFzD3hD9x2wcBpKYlKSNF4vL2tQNHrr4pi-X1JXOvttkH7LOGrA0UOBjZvznAkeaXHUs3rVEX37hAmBSQ1RUl9oTEPs77LMUK8m-83PzJa1X7vwkQs2ZSaOn21P5FjKfGm8m4KM5qNeYgsx45eMFYsGt9a2BFOLIp69nwzzqZger",
    projectUrl: "https://github.com/firizqi/halombg",
    gridClass: "md:col-span-4",
    specializations: ["UI/UX Design", "Software Architecture"],
    details: {
      overview: "Mobile portal allowing students in remote subdistricts to sign up for educational bootcamps, share academic opportunities, and review local mentoring resources.",
      challenge: "Handling unreliable network connectivity in remote areas, leading to frequent app crashes and slow startup times.",
      solution: "Configured offline-first local database caching using Hive DB, syncing changes asynchronously using background worker threads when networks are active.",
      codeSnippetTitle: "Flutter Hive Sync",
      codeSnippet: `Future<void> syncLocalCache() async {
  final box = await Hive.openBox('events');
  if (hasNetworkConnection) {
    final response = await api.fetchLatest();
    await box.putAll(response);
  }
}`,
      codeLanguage: "dart"
    }
  },
  {
    id: "stroke-prediction",
    title: "Stroke Prediction ML",
    domain: "Machine Learning",
    description: "Predictive model utilizing clinical data to identify high-risk patients early.",
    stack: ["Python", "TensorFlow", "Scikit-Learn"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqTCIbjkLDxzCY9fx4UDxEUQzQluiuiHBO3Jy20sERtAFvUjSq5DDc2dxrWjLRB13BQ4cBiA1dIRlIUT4OMg8aYzKmMEVUdNnlfrKD6AmV3S3LtT3DDomUqO3bP-3sztd-wTU89l542m2DQVvacjz1s3qyfAnvaoFZDNK7t3LFc3oiP60LZvJtsZbaPslut6zQNIeERHAHFRBTtkgJ-ilK4werTeM21PQ03FKXIaGGoRR35upsS6mft1ITkDUKChvoQ8ZvkvfGea1k",
    projectUrl: "https://github.com/firizqi/stroke-prediction-ml",
    gridClass: "md:col-span-8",
    specializations: ["Software Architecture"],
    details: {
      overview: "A custom machine learning pipeline that consumes demographic and diagnostic variables to return real-time patient stroke hazard values, optimized for clinical triage.",
      challenge: "Medical datasets suffer from severe class imbalance (stroke cases represent less than 5% of inputs), which causes default models to ignore high-risk instances.",
      solution: "Implemented synthetic over-sampling (SMOTE) inside the pipeline, evaluating configurations using recall scoring and SHAP value explainability indices.",
      codeSnippetTitle: "SHAP Explainer Pipeline",
      codeSnippet: `import shap
import sklearn

def calculate_shap_values(model, X_train):
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X_train)
    shap.summary_plot(shap_values, X_train)
    return shap_values`,
      codeLanguage: "python"
    }
  },
  {
    id: "lectinfor",
    title: "LectInfor",
    domain: "Android App",
    description: "Centralized academic portal for informatics department students.",
    stack: ["Kotlin", "Retrofit"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBk_4zKFkQbD6IBxQoM3gc4WDc68Gbef5KhxMDj8jHJ4lyEUpVNOOcNI8Uw2LmgLitHTanARgohQQQ2KOa66L01vxGIrKlAeFkzZVv4QaSpm_Lk6VPcPtBjmiU3KRxt6M7Cf3bYWTX8IXLTeJ54isFgiXK34WB__sY7Us448NfLLXxqjMemW88OslVmcQ7tAFuSN6XOEDsGu6RJMTuhHtCyUE0-SNjZ_ayg1eSjzDWuxXU38DCyUz6JhCaDyZf4KYNXnNcV4dp0gCON",
    projectUrl: "https://github.com/firizqi/lectinfor",
    gridClass: "md:col-span-6",
    specializations: ["UI/UX Design", "Software Architecture"],
    details: {
      overview: "An Android application designed to aggregate lecture schedules, assign due dates, and dynamically display office hours for Informatics Department professors.",
      challenge: "Aggregating multiple scattered spreadsheets and legacy web portals into a single, cohesive reactive JSON model.",
      solution: "Developed an parsing gateway API in Laravel Sanctum that runs periodic cron scraping jobs, serving clean, unified JSON outputs to the client app.",
      codeSnippetTitle: "Android StateFlow Observer",
      codeSnippet: `class ScheduleViewModel(private val repository: ScheduleRepository) : ViewModel() {
    private val _uiState = MutableStateFlow<ScheduleUiState>(ScheduleUiState.Loading)
    val uiState: StateFlow<ScheduleUiState> = _uiState.asStateFlow()
}`,
      codeLanguage: "kotlin"
    }
  },
  {
    id: "bengawan-uv-website",
    title: "Bengawan UV Website",
    domain: "Web",
    description: "Official digital presence for the Bengawan Unmanned Vehicle Team.",
    stack: ["React", "Tailwind CSS"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbcTmEHw_Z1R6ExwNG8kx_Cpu7XcBS4qPzRcSG4guKM6LIcOvuZ7llNrRKmtZL0N3RvD43UR6bowpfvQfXHoweZEvswpVOEJqgX2e7m5uSHsWHKw2c4kSK8_cxWRch-vocHmYoiLqgGZpN7RlLAqpSJt4QxJn01qPZA2u4Juri6WyeeyhXx-KpPTD-e91W0nkE3mw0l1XuqK_CdbLYr3cHeq-Qe_vsDIAHRxu6HyWBICfeCghjojHWfimvsVPmau6KzR5_LDC4p7Zg",
    projectUrl: "https://github.com/firizqi/bengawan-uv-web",
    liveUrl: "https://bengawanuv.vercel.app",
    gridClass: "md:col-span-6",
    specializations: ["UI/UX Design", "Software Architecture"],
    details: {
      overview: "The digital homepage of the Bengawan Unmanned Vehicle research group, detailing competition timelines, research outputs, and team rosters.",
      challenge: "Building highly immersive scroll entrance animations that run smoothly on mobile browsers and tablets.",
      solution: "Utilized lightweight CSS transitions for standard interactions, deploying targeted GSAP timelines exclusively on larger viewports.",
      codeSnippetTitle: "GSAP Trigger Configuration",
      codeSnippet: `import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
gsap.from(".hero-content", {
  scrollTrigger: ".hero-container",
  opacity: 0,
  y: 50,
  duration: 1.2
});`,
      codeLanguage: "javascript"
    }
  },
];
