---
layout: assignment
title: "Assignment 1: Camera Projection and Perspective"
date: 2026-02-03
slug: assignment-1
problems:
  - number: 1
    title: "Portrait Distortion - Close-up vs Zoomed"
    description: "Comparing facial distortion when photographed close-up versus from a distance with zoom."
    images:
      - src: "/assets/images/assignment-1/problem1-closeup.jpg"
        caption: "Close-up portrait showing distortion"
      - src: "/assets/images/assignment-1/problem1-zoomed.jpg"
        caption: "Zoomed portrait from distance showing natural proportions"
    explanation: |
      The second portrait looks much better because of the difference in perspective projection caused by camera distance.
      
      When taking a close-up photo (first image), the camera is very close to the subject's face, typically 1-2 feet away. At this distance, different parts of the face are at significantly different distances from the camera lens. The nose, being closest to the camera, appears disproportionately large compared to the ears and sides of the face. This creates the characteristic "distorted" look of close-up portraits where facial features appear exaggerated and unnatural.
      
      In the second photo, by stepping back several feet and using optical zoom, we maintain the same field of view (face size in frame) but change the perspective projection. At this greater distance, the relative difference in distance between the nose and ears becomes much smaller as a percentage of the total distance to the camera. This makes the perspective closer to orthographic projection, where parallel lines remain parallel and proportions are preserved more naturally.
      
      Mathematically, in perspective projection, the size of an object on the image plane is inversely proportional to its distance from the camera. When very close, small changes in depth create large changes in perceived size. When farther away, these depth differences become negligible relative to the camera distance, resulting in more natural proportions.
      
      This is why professional portrait photographers typically use telephoto lenses (85mm-135mm) and shoot from a distance - it produces flattering, natural-looking portraits by reducing perspective distortion.

  - number: 2
    title: "Urban Scene Compression - Zoomed vs Walk-up"
    description: "Comparing a zoomed street view versus walking closer without zoom."
    images:
      - src: "/assets/images/assignment-1/problem2-zoomed.jpg"
        caption: "Zoomed-in view of street showing compressed perspective"
      - src: "/assets/images/assignment-1/problem2-walkup.jpg"
        caption: "Walk-up view showing expanded depth"
    explanation: |
      The first zoomed picture appears flattened or compressed because of the telephoto compression effect, while the second walk-up photo shows more depth and separation between objects.
      
      When using zoom from a distance (first image), we're using a longer focal length to capture the scene. This creates a narrow field of view where objects at different depths appear much closer together than they actually are. Buildings, cars, and people along the street seem stacked on top of each other with minimal separation. This "telephoto compression" makes the scene look two-dimensional and flattened.
      
      In the second photo, by walking closer and using a wider angle (no zoom), we capture a wider field of view with strong perspective cues. Objects closer to the camera appear much larger than those farther away, creating a pronounced depth gradient. The street appears to recede dramatically into the distance, with clear separation between foreground, middle ground, and background elements.
      
      This difference occurs because perspective projection depends on the viewing angle and distance. With telephoto (zoomed), the narrow viewing angle means rays from the camera to objects are nearly parallel - similar to orthographic projection. Objects at different depths subtend nearly the same angle, so they appear similar in size. With wide angle (close-up), the large viewing angle creates strongly converging rays, emphasizing perspective and depth.
      
      This effect is commonly used in filmmaking: telephoto lenses compress space and flatten scenes (useful for making crowds look denser or cities look more congested), while wide angles exaggerate space and create drama (useful for making rooms look larger or emphasizing distance).

  - number: 3
    title: "Perspective vs Orthographic Projection"
    description: "Creating images demonstrating perspective and orthographic projection of the same scene."
    images:
      - src: "/assets/images/assignment-1/problem3-perspective.jpg"
        caption: "Perspective projection - note converging parallel lines"
      - src: "/assets/images/assignment-1/problem3-orthographic.jpg"
        caption: "Orthographic projection - parallel lines remain parallel"
    explanation: |
      These two images demonstrate the fundamental difference between perspective and orthographic projection.
      
      **Perspective Projection (First Image):**
      The first image was taken close to the scene with a normal or wide-angle lens. In this image, you can clearly see parallel lines converging toward vanishing points. For example, the edges of a rectangular table or the sides of a building appear to meet in the distance, even though we know they are parallel in reality. This is characteristic of perspective projection, which models how the human eye and camera lenses see the world.
      
      In perspective projection, the projection center is at a finite distance (the camera's position), and rays from scene points to the projection center create images on the image plane. Objects farther from the camera appear smaller, and parallel lines in 3D converge to vanishing points in the 2D image.
      
      **Orthographic Projection (Second Image):**
      The second image was created by either: (1) using heavy zoom from a far distance, or (2) cropping the central portion of a zoomed image. This approximates orthographic projection. In this image, parallel lines in the real world remain parallel in the image - they do not converge. The red lines I've added highlight straight edges in the scene, showing they remain parallel rather than converging.
      
      In true orthographic projection, the projection center is at infinity, meaning projection rays are parallel rather than converging. This eliminates perspective effects: objects maintain their size regardless of distance from the camera, and parallel lines remain parallel.
      
      **Technical Implementation:**
      To approximate orthographic projection with a camera, we use the telephoto effect: by using a very long focal length (high zoom) from a great distance, the angle subtended by the scene becomes very small. This makes the projection rays nearly parallel, approximating orthographic conditions. The cropping method works similarly - by taking only the center portion of a highly zoomed image, we're effectively selecting rays that are nearly parallel.
      
      **Practical Differences:**
      - Perspective projection preserves depth cues and looks natural to human perception
      - Orthographic projection preserves actual proportions and is useful for technical drawings, architectural plans, and computer-aided design
      - Perspective shows "what it looks like," orthographic shows "what it is"
---

This assignment explores how camera position and zoom settings affect the geometric properties of captured images, specifically examining perspective distortion and the difference between perspective and orthographic projection.

## Overview

Through three exercises, we investigate:
1. How camera distance affects portrait quality due to perspective distortion
2. How telephoto compression flattens urban scenes
3. The fundamental difference between perspective and orthographic projection

These concepts are crucial in computer vision for understanding camera models, 3D reconstruction, and image formation.