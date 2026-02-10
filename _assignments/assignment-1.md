---
layout: assignment
title: "Assignment 1: Camera Projection and Perspective"
date: 2026-02-03
slug: assignment-1
problems:
  - number: 1
    title: "Image Distortion - Close-up vs Zoomed"
    description: "Take a picture of your friend from close up. You get a typical distorted image. Now step back several feet from your subject, zoom in, and take a second picture. Try to get the face in the second photo to be the same size as in the first photo. If you've done things right, the second portrait should look much better than the first one. Why?"
    images:
      - src: "/assets/images/assignment-1/riya-closeup.jpeg"
        caption: "Close-up portrait of a dear friend who reluctantly agreed to do this"
      - src: "/assets/images/assignment-1/riya-zoom.jpeg"
        caption: "Zoomed portrait"
      - src: "/assets/images/assignment-1/saroj-didi-closeup.jpeg"
        caption: "Close-up portrait of Saroj Didi from outside campus"
      - src: "/assets/images/assignment-1/saroj-didi-zoom.jpeg"
        caption: "Zoomed potrait"
      - src: "/assets/images/assignment-1/sign-closeup.jpeg"
        caption: "Close-up image of a sign"
      - src: "/assets/images/assignment-1/sign-zoom.jpeg"
        caption: "Zooming on the same sign"
    explanation: |
        If we look closely, one can see that in all of these cases, the resolution of the closeup image is much better than the zoomed image. This, at first, seemed to be opposite of what should happen according to the question. I then looked at two things:
        1. Why does the question say zoom should be better and in what way?
        2. Why does my camera not achieve that?

        **Why does the question say zoom should be better and in what way?**

        The question is referring to the improvement in perspective distortion, not necessarily image resolution or sharpness. When photographing a face from very close range, different facial features are at vastly different distances from the camera. For instance, if the nose is 30cm away, the ears might be 45cm away—a 50% difference in distance. Due to perspective projection, objects closer to the camera appear disproportionately larger. This creates the characteristic "fisheye" effect where noses appear bulbous, foreheads look enlarged, and ears seem smaller than they should be.

        When you step back to, say, 3 meters and zoom in to maintain the same face size in the frame, the nose might be 3.0m away while the ears are 3.15m away—only a 5% difference. All facial features are now at much more similar relative distances from the camera, so the perspective distortion is greatly reduced. The face appears flatter, more natural, and more closely matches how we perceive faces in person. 

        **Why does my camera not achieve that?**

        The Xiaomi 11T Pro (my camera), like most smartphones, has multiple camera modules with different focal lengths. The main camera uses a wide-angle lens (approximately 26mm equivalent), which is excellent for close-up shots and has the best sensor, optics, and computational photography capabilities. When you zoom in on a smartphone, one of two things happens:

        1. **Digital zoom**: The phone crops into the main camera's image and upscales it. This reduces effective resolution significantly and introduces artifacts from interpolation.

        2. **Lens switching**: The phone switches to a secondary telephoto camera (if available), which typically has an inferior sensor, smaller aperture, and less sophisticated processing compared to the main camera.

        In both cases, the image quality degradation—loss of resolution, detail, dynamic range, and low-light performance—outweighs the geometric improvement from better perspective. The main camera is optimized to be the flagship sensor, so despite the worse perspective distortion at close range, it produces sharper, cleaner images overall.

        Therefore, while the theoretical principle about perspective distortion is correct and applies to traditional cameras with a single, high-quality lens that can zoom optically, modern smartphones prioritize image quality from their best sensor over geometric accuracy.


  - number: 2
    title: "Scenery - Zoom vs Closeup"
    description: " Let's repeat the same procedure in reverse, for an urban scene. Pick a nice view down a long street (or a walking path on campus), zoom in, and take a photo. Now, walk down the street in the direction of your first shot, and take a second photo without zoom, such that the scene in the two photos appears approximately the same size. The first picture should look flattened, or compressed, compared to the second. Why?"
    images:
      - src: "/assets/images/assignment-1/scene-zoom.jpeg"
        caption: "Zoomed-in view of TSB"
      - src: "/assets/images/assignment-1/scene-closeup.jpeg"
        caption: "Closeup view of TSB"
    explanation: |

        Looking at the two images provided, the first image is the zoomed-in shot taken from farther away. The second image has been taken from closer to the scene without zoom. This follows the expected behavior described in the question.

        **Why does the zoomed-in image look flattened or compressed compared to the close-up image?**

        This phenomenon is the inverse of what we observed in Question 1, and it demonstrates the same fundamental principle of perspective projection working in the opposite direction.

        When you zoom in from a distant position, objects at different depths in the scene are all at relatively similar distances from the camera. For instance, if the nearest architectural element is 50 meters away and the farthest visible element is 60 meters away, that's only a 20% difference in distance. According to perspective projection, the size ratio between these objects is determined by the ratio of their distances from the camera. Since 50m and 60m are relatively close in ratio (60/50 = 1.2), the depth in the scene appears compressed—objects at different depths appear more similar in size than they actually are.

        This creates the characteristic "telephoto compression" effect where:
        - Foreground and background elements appear closer together than they are in reality
        - The spatial separation between layers of depth is minimized
        - The scene looks "flattened" as if everything exists on nearly the same plane
        - Background objects appear larger relative to foreground objects

        When you walk closer to the scene and take the second photo without zoom, the nearest elements might now be 10 meters away while the farthest elements are still around 60 meters away—a 500% difference in distance (60/10 = 6). This dramatic difference in the distance ratios causes:
        - Foreground objects to appear much larger relative to background objects
        - Greater perceived depth and spatial separation between elements
        - A more three-dimensional, "stretched out" appearance
        - The scene feeling more immersive and having stronger depth cues.

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