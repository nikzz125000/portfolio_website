# 3D Components for Portfolio Website

This directory contains reusable 3D components built with React Three Fiber and Three.js, designed to add interactive 3D experiences to your portfolio website.

## 🚀 Quick Start

### Installation

The required dependencies are already installed:

```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing @types/three
```

### Basic Usage

```tsx
import ThreeDSection from "../../components/3D/ThreeDSection";

// In your component
<ThreeDSection deviceType="desktop" height="500px" showControls={true} />;
```

## 📁 Component Structure

```
src/components/3D/
├── Scene3D.tsx           # Main 3D scene wrapper
├── MovingObject.tsx      # Animated 3D objects
├── Lighting.tsx          # Scene lighting setup
├── Effects.tsx           # Post-processing effects
├── ThreeDSection.tsx     # Complete 3D section with controls
├── ThreeDStyles.css      # Styling for 3D components
└── index.ts              # Export file for easy imports
```

## 🎯 Components Overview

### 1. ThreeDSection (Main Component)

The main component that combines everything into a complete 3D experience.

**Props:**

- `deviceType`: "mobile" | "tablet" | "desktop" - For responsive design
- `height`: string - Height of the 3D scene
- `showControls`: boolean - Whether to show the control panel
- `className`: string - Additional CSS classes
- `style`: React.CSSProperties - Additional inline styles

**Features:**

- Responsive design for all device types
- Interactive controls (hidden on mobile for better UX)
- Smooth animations and transitions
- Professional styling with gradients

### 2. Scene3D

The core 3D scene wrapper that sets up the Canvas and environment.

**Props:**

- `objectType`: "cube" | "sphere" | "cone" | "text" - Type of 3D object
- `animationSpeed`: number - Speed of animations (0-3)
- `enableControls`: boolean - Enable camera controls
- `objectColor`: string - Color of the 3D object
- `position`: [number, number, number] - Position of the object

### 3. MovingObject

Renders different types of 3D objects with animations.

**Object Types:**

- **Cube**: Default 3D cube with smooth animations
- **Sphere**: Smooth sphere with realistic lighting
- **Cone**: Geometric cone with dynamic scaling
- **Text**: 3D text with custom fonts

**Animations:**

- Bouncing motion on Y-axis
- Continuous rotation
- Interactive scaling on hover/click
- Color changes on interaction

### 4. Lighting

Professional lighting setup for realistic 3D rendering.

**Features:**

- Ambient lighting for overall illumination
- Directional lighting with shadows
- Colored fill lights for atmosphere
- Optimized shadow mapping

### 5. Effects

Post-processing effects for enhanced visual quality.

**Effects Included:**

- Bloom for glowing highlights
- Depth of field for focus effects
- Subtle noise for texture
- Vignette for cinematic look

## 🎨 Customization

### Changing Object Colors

```tsx
<ThreeDSection objectColor="#ff6b6b" deviceType="desktop" />
```

### Adjusting Animation Speed

```tsx
<ThreeDSection animationSpeed={2.5} deviceType="desktop" />
```

### Custom Heights

```tsx
<ThreeDSection height="600px" deviceType="desktop" />
```

## 📱 Responsive Design

The components automatically adapt to different screen sizes:

- **Mobile**: Compact layout, controls hidden, optimized performance
- **Tablet**: Balanced layout with essential controls
- **Desktop**: Full-featured experience with all controls

## 🎭 Animation Features

### Interactive Elements

- **Hover Effects**: Objects scale up and change color
- **Click Effects**: Objects scale down and become transparent
- **Smooth Transitions**: All animations use easing functions

### Performance Optimizations

- Device pixel ratio optimization
- Efficient shadow mapping
- Optimized geometry rendering
- Responsive animation speeds

## 🔧 Advanced Usage

### Custom 3D Objects

```tsx
import { Scene3D, MovingObject } from "../../components/3D";

<Scene3D objectType="custom" enableControls={true}>
  <MovingObject
    type="cube"
    animationSpeed={1.5}
    color="#ff6b6b"
    position={[0, 0, 0]}
  />
</Scene3D>;
```

### Standalone Components

```tsx
import { Lighting, Effects } from "../../components/3D";

<Canvas>
  <Lighting />
  <YourCustomObject />
  <Effects />
</Canvas>;
```

## 🎨 Styling

### CSS Classes Available

- `.3d-scene-container` - Main 3D scene wrapper
- `.3d-section` - Complete 3D section
- `.controls-3d` - Control panel styling
- `.control-group` - Individual control groups
- `.loading-container` - Loading state styling

### Custom Styling

```css
.3d-scene-container {
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.controls-3d {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}
```

## 🚀 Performance Tips

1. **Mobile Optimization**: Controls are hidden on mobile for better performance
2. **Efficient Rendering**: Uses React Three Fiber's optimized rendering
3. **Shadow Optimization**: Configurable shadow quality based on device
4. **Animation Throttling**: Smooth animations without performance impact

## 🐛 Troubleshooting

### Common Issues

1. **Canvas Not Rendering**

   - Ensure parent container has explicit height/width
   - Check for CSS conflicts

2. **Poor Performance on Mobile**

   - Controls are automatically hidden on mobile
   - Animation speeds are optimized for touch devices

3. **Objects Not Receiving Shadows**
   - Verify `castShadow` and `receiveShadow` are enabled
   - Check lighting setup

### Debug Mode

Enable debug information in development:

```tsx
<Scene3D enableControls={true} debug={process.env.NODE_ENV === "development"} />
```

## 🔮 Future Enhancements

- Physics integration with @react-three/cannon
- VR/AR support with @react-three/xr
- Advanced shader materials
- 3D model loading (GLTF/GLB)
- Particle systems
- Audio-reactive animations

## 📚 Resources

- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber)
- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Drei](https://github.com/pmndrs/drei)
- [Performance Optimization Guide](https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance)

## 🤝 Contributing

When adding new 3D components:

1. Follow the existing component structure
2. Add TypeScript interfaces for all props
3. Include responsive design considerations
4. Add proper error handling
5. Update this README with new features

## 📄 License

This component library is part of the portfolio website project and follows the same licensing terms.
