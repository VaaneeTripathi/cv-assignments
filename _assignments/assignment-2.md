---
layout: assignment
title: "Assignment 2: Harris Corner Detection & SIFT Feature Matching"
date: 2026-04-05
slug: assignment-2
problems:
  - number: 1
    title: "Part A — Ground Truth Annotation"
    description: "Take an image of a building in Ashoka which has lots of corners. Manually annotate ~50 corners (40-60) to form ground truth."
    images:
      - src: "/assets/images/assignment-2/building-original.jpeg"
        caption: "Original image of an Ashoka University building (1600×720)"
      - src: "/assets/images/assignment-2/gt-annotated-66.png"
        caption: "66 manually annotated ground truth corners (green crosses)"
    explanation: |
        I chose a building with clearly visible structural elements — vertical red stone pillars, horizontal ledges between floors, rectangular windows, and a roofline. This provides a rich set of Harris-style corners (L, T, and X junctions).

        **Annotation methodology:**

        I initially annotated 253 points using the VGG Image Annotator (VIA), which included every visible feature transition. However, many of these were points along straight edges (e.g., along a pillar's edge or a horizontal ledge) rather than true corners. I then curated the set down to 66 points using strict criteria:

        1. **Keep only where two distinct edges meet at an angle** — L-junctions (window corners), T-junctions (where a ledge meets a pillar), and X-junctions.
        2. **Remove points along straight edges** — a point on a vertical pillar or horizontal ledge is an edge, not a corner in the Harris sense.
        3. **Remove all points on the decorative lattice screen** (right side of image) — this is repetitive texture, not isolated corner structure.
        4. **Remove redundant nearby points** — where two annotations were within ~15px on the same feature, keep only one.

        The final 66 points is slightly above the 40-60 target but every point is a genuine corner where two edges intersect. The annotations are distributed across the building's structural features: window corners, pillar-ledge junctions, roofline transitions, and canopy edges.

  - number: 2
    title: "Part A — Harris Corner Detection"
    description: "Use the CV2 Harris corner detector to detect corner scores."
    images:
      - src: "/assets/images/assignment-2/harris-response.png"
        caption: "Harris corner response map — brighter regions indicate higher cornerness"
    explanation: |
        The Harris corner detector works by analyzing the local gradient structure at each pixel. For each pixel, it computes the **structure tensor** (second moment matrix) from image gradients in a local window:

        ```
        M = [ Σ(Ix²)    Σ(Ix·Iy) ]
            [ Σ(Ix·Iy)  Σ(Iy²)   ]
        ```

        The Harris response is then: **R = det(M) - k · trace(M)²**

        - **Corners** have large positive R (both eigenvalues large — intensity changes sharply in two directions)
        - **Edges** have large negative R (one eigenvalue large, one small)
        - **Flat regions** have R near zero

        **Parameters used:**
        - `blockSize = 3` — size of the neighbourhood for the structure tensor
        - `ksize = 3` — Sobel kernel size for gradient computation
        - `k = 0.04` — Harris free parameter (standard value)

        **Preprocessing:** A Gaussian blur with kernel size 7 was applied before Harris detection. This is critical because the image contains a decorative lattice screen that generates very strong texture-based responses. The blur suppresses fine-grained texture while preserving the structural edges at window/pillar/ledge junctions.

        **Non-Maximum Suppression (NMS):** After computing the Harris response, NMS with a 31×31 window was applied. A pixel is kept only if it is the local maximum within this window AND has a positive response. This prevents clusters of detections around a single real corner. The large NMS window was necessary because the building's stone surface texture and lattice screen produce dense clusters of responses that would otherwise dominate the detection count.

  - number: 3
    title: "Part A — Thresholded Corner Detection"
    description: "Threshold with different thresholds and for each thresholded detection find precision and recall with respect to ground truth. For each threshold plot the detected corners on the image."
    images:
      - src: "/assets/images/assignment-2/corners-low-thresh.png"
        caption: "Low threshold (0.001 × max) — 641 detections, Precision=0.092, Recall=0.894"
      - src: "/assets/images/assignment-2/corners-mid-thresh.png"
        caption: "Medium threshold (0.026 × max) — 351 detections, Precision=0.142, Recall=0.758"
      - src: "/assets/images/assignment-2/corners-high-thresh.png"
        caption: "High threshold (0.272 × max) — 25 detections, Precision=0.000, Recall=0.000"
    explanation: |
        Green circles show the 66 ground truth annotations; red crosses show Harris detections at each threshold.

        **Matching methodology:** For computing precision and recall, a detection is counted as a True Positive (TP) if it falls within 20 pixels of a ground truth point. To avoid double-counting, **one-to-one greedy matching** is used — detection-GT pairs are sorted by distance, and each GT point and each detection can match at most once.

        - **Precision** = TP / (TP + FP) — "of the corners I detected, how many are real?"
        - **Recall** = TP / (TP + FN) — "of the real corners, how many did I detect?"

        **Observations across thresholds:**

        At **low threshold**, Harris detects 641 corners. Recall is high (0.894 — Harris finds 59 of 66 GT corners) but precision is low (0.092) because most detections are real corners on the building that simply aren't in our 66-point ground truth set. The lattice screen also contributes many detections.

        At **medium threshold**, detections reduce to 351. Precision improves slightly (0.142) as weaker responses are filtered out, while recall remains reasonable (0.758).

        At **high threshold**, only 25 detections survive — and these are all on the lattice screen, which has the strongest Harris responses in the image. Since none of our GT points are on the lattice, both precision and recall drop to zero. This reveals an important insight: **the strongest Harris responses come from repetitive texture, not structural corners.**

        50 threshold values were swept using geometric spacing (finer resolution at low thresholds, coarser at high) across 0.001 to 0.5 times the maximum Harris response.

  - number: 4
    title: "Part A — Precision-Recall Curve and AUC (Bonus)"
    description: "Plot the precision and recall curve. Estimate area under curve."
    images:
      - src: "/assets/images/assignment-2/pr-curve.png"
        caption: "Precision-Recall curve with AUC = 0.1073"
    explanation: |
        The PR curve plots precision against recall across all 50 thresholds. The Area Under Curve (AUC) was computed using trapezoidal integration: **AUC = 0.1073**.

        **Why is the AUC relatively low?**

        This is not a bug — it reflects a genuine limitation of evaluating a dense-corner detector against sparse ground truth:

        1. **Sparse GT in a corner-rich scene:** The building has 200-300+ visible corners (every window corner, pillar-ledge junction, stone block boundary). Our GT annotates only 66 of them. Even a perfect detector would produce ~200 "false positives" that are actually real corners we didn't annotate. This caps achievable precision at roughly 66/266 ≈ 0.25.

        2. **Texture dominates the response:** The decorative lattice screen produces the highest Harris responses in the image. As the threshold increases, structural building corners (moderate response) are filtered out first, leaving only texture-based detections — which have no GT matches. This causes the unusual shape where both precision and recall collapse at high thresholds, rather than the typical tradeoff where precision rises as recall falls.

        3. **Gaussian blur helps but doesn't eliminate the problem:** Pre-blurring with a 7×7 kernel suppressed many texture responses and improved AUC from 0.045 to 0.107, but the lattice's spatial frequency is low enough that it survives moderate blurring.

        **Progression of improvements:**

        | Configuration | AUC |
        |---|---|
        | 253 GT points, no NMS, no blur | 0.029 |
        | 66 curated GT + NMS (21×21) | 0.045 |
        | + Larger NMS (31×31) + blur (k=5) | 0.091 |
        | + Stronger blur (k=7) | **0.107** |

        The key lesson: PR AUC depends not just on detector quality, but critically on **how well the ground truth covers the scene's actual corners** and the **ratio of textured to structural regions** in the image.

  - number: 5
    title: "Part B — SIFT Keypoints and Consecutive Pair Matching"
    description: "Take the set of images provided — the camera is moving around a stack of mulch. For each image find SIFT keypoints and features using CV2. For all pairs of consecutive images, match features and find total cost of matching."
    images:
      - src: "/assets/images/assignment-2/sift-comparison.png"
        caption: "Per-pair comparison: total matching cost (left) and number of good matches (right)"
    explanation: |
        **SIFT (Scale-Invariant Feature Transform)** detects keypoints that are invariant to scale, rotation, and partially invariant to illumination and viewpoint changes. Each keypoint receives a 128-dimensional descriptor encoding the local gradient pattern.

        **Setup:**
        - 19 images (`oyla_0001.jpg` through `oyla_0037.jpg`, odd-numbered) of a camera moving around a stack of mulch
        - SIFT detected 10,000-22,000 keypoints per image (1920×1440 resolution)
        - Matching used `cv2.BFMatcher` with L2 norm and `knnMatch(k=2)`
        - **Lowe's ratio test** (threshold = 0.75): for each descriptor, the best match is kept only if its distance is less than 75% of the second-best match distance. This rejects ambiguous matches where a descriptor could plausibly match multiple targets.

        **19 consecutive pairs** (including wrap-around oyla_0037 → oyla_0001):

        | Pair | Good Matches | Total Cost |
        |---|---|---|
        | oyla_0001 ↔ oyla_0003 | 6,232 | 887,748 |
        | oyla_0003 ↔ oyla_0005 | 6,707 | 902,808 |
        | oyla_0013 ↔ oyla_0015 | 12,116 | 960,460 |
        | oyla_0035 ↔ oyla_0037 | 608 | 102,547 |
        | oyla_0037 ↔ oyla_0001 | 51 | 8,999 |
        | **Average** | **3,891** | **541,275** |

        Note the large variation: pairs where the camera moved little (e.g., 0013→0015: 12,116 matches) share far more visual content than pairs where the camera moved significantly or changed viewpoint (e.g., 0037→0001: only 51 matches, essentially showing different sides of the mulch stack).

  - number: 6
    title: "Part B — Random Pair Matching and Comparison"
    description: "Randomly choose 19 pairs of images and match features. Is the cost of consecutive pairs lower or the cost of random pairs? Why?"
    images:
      - src: "/assets/images/assignment-2/sift-summary.png"
        caption: "Average total matching cost: consecutive (541,275) vs random (37,756)"
    explanation: |
        **19 random non-consecutive pairs** were selected (seed = 42 for reproducibility). Results:

        | Metric | Consecutive | Random |
        |---|---|---|
        | Average good matches | **3,891** | 222 |
        | Average total cost | **541,275** | 37,756 |
        | Average cost per match | **139** | 170 |

        **The total cost of consecutive pairs is higher** (about 14× higher). This may seem counterintuitive, but it is explained by what "total cost" measures:

        **Total cost = Σ (distance of each good match)**

        Consecutive frames share most of the same scene due to small camera movement. This means:
        - Many features are visible in both images → many pass Lowe's ratio test → **far more good matches** (3,891 vs 222)
        - Each individual match has a low distance (features are very similar)
        - But the **sum** over thousands of matches is large

        Random pairs show different views of the mulch stack with little visual overlap:
        - Few features match across such different viewpoints → Lowe's ratio test rejects most as ambiguous → **very few good matches** (222)
        - The total cost, being a sum over very few terms, is small

        **However, the average cost per match tells the real story:**
        - Consecutive: 541,275 / 3,891 = **139 per match**
        - Random: 37,756 / 222 = **170 per match**

        Per-match cost **is lower for consecutive pairs**, confirming that consecutive frames produce higher-quality matches (more similar descriptors). The total cost is higher simply because there are so many more of them.

        **Physical intuition:** Consecutive frames differ by a small camera rotation/translation, so the same physical surface patch appears in nearly the same orientation and scale in both frames — its SIFT descriptor barely changes. Random pairs may show the mulch from opposite sides, where the same physical patch (if visible at all) looks completely different — yielding high descriptor distances or failing the ratio test entirely.
---
