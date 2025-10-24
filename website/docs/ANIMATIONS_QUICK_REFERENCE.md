# Animation System - Quick Reference Guide

## Installation

```bash
npm install framer-motion
```

## What You Have

### 1. Animation Variants Library

**File**: `src/lib/animations.ts`

#### Entrance Animations

```tsx
import {
  fadeIn,
  slideUp,
  slideDown,
  scaleIn,
  bounceIn,
} from "@/lib/animations";

// Usage
<motion.div variants={fadeIn} initial="hidden" animate="visible">
  Content
</motion.div>;
```

#### Direction Animations

```tsx
import { slideLeft, slideRight, slideUp, slideDown } from "@/lib/animations";
import { slideFromTop, slideFromBottom } from "@/lib/animations";
```

#### Continuous Animations

```tsx
import { pulse, floating, shimmer } from "@/lib/animations";

// Usage
<motion.div animate={floating} className="text-center">
  Floating element
</motion.div>;
```

#### Container Animations

```tsx
import { staggerContainer, staggerItem } from "@/lib/animations";

// Usage
<motion.div variants={staggerContainer} initial="hidden" animate="visible">
  <motion.div variants={staggerItem}>Item 1</motion.div>
  <motion.div variants={staggerItem}>Item 2</motion.div>
  <motion.div variants={staggerItem}>Item 3</motion.div>
</motion.div>;
```

---

## 2. Pre-Built Components

**File**: `src/components/common/AnimationWrappers.tsx`

### PageTransition

Wrap entire pages for smooth transitions

```tsx
import { PageTransition } from "@/components/common/AnimationWrappers";

<PageTransition>
  <YourPageContent />
</PageTransition>;
```

### StaggerContainer + StaggerItem

```tsx
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/common/AnimationWrappers";

<StaggerContainer>
  <StaggerItem>First item</StaggerItem>
  <StaggerItem>Second item</StaggerItem>
  <StaggerItem>Third item</StaggerItem>
</StaggerContainer>;
```

### AnimatedCard

Automatic hover effect with lift

```tsx
import { AnimatedCard } from "@/components/common/AnimationWrappers";

<AnimatedCard className="p-6 bg-white rounded-lg">
  <h3>Card Title</h3>
  <p>Card content</p>
</AnimatedCard>;
```

### AnimatedButton

```tsx
import { AnimatedButton } from "@/components/common/AnimationWrappers";

<AnimatedButton onClick={handleClick} className="btn">
  Click me
</AnimatedButton>;
```

### Floating

Continuous floating animation

```tsx
import { Floating } from "@/components/common/AnimationWrappers";

<Floating className="mt-8">
  <YourElement />
</Floating>;
```

### Pulsing

Continuous pulsing animation

```tsx
import { Pulsing } from "@/components/common/AnimationWrappers";

<Pulsing className="mb-4">
  <YourElement />
</Pulsing>;
```

### SlideIn

Directional slide in

```tsx
import { SlideIn } from '@/components/common/AnimationWrappers';

<SlideIn direction="left" delay={0.2}>
  Slides in from left
</SlideIn>

<SlideIn direction="right">
  Slides in from right
</SlideIn>

<SlideIn direction="up">
  Slides in from top
</SlideIn>

<SlideIn direction="down">
  Slides in from bottom
</SlideIn>
```

### FadeIn

Simple fade with delay control

```tsx
import { FadeIn } from "@/components/common/AnimationWrappers";

<FadeIn delay={0.3} duration={0.8}>
  Fades in
</FadeIn>;
```

### ScaleIn

Scale entrance animation

```tsx
import { ScaleIn } from "@/components/common/AnimationWrappers";

<ScaleIn delay={0.2}>Scales in</ScaleIn>;
```

---

## 3. Ready-to-Use Animated Components

### AnimatedHeroCarousel

**File**: `src/components/home/AnimatedHeroCarousel.tsx`

Features:

- Auto-play with 6-second intervals
- Manual navigation (prev/next buttons)
- Dot indicators
- Smooth fade transitions
- Ken Burns zoom effect on background
- Responsive design

```tsx
import AnimatedHeroCarousel from "@/components/home/AnimatedHeroCarousel";

<AnimatedHeroCarousel />;
```

### AnimatedTestimonialSlider

**File**: `src/components/home/AnimatedTestimonialSlider.tsx`

Features:

- Grid layout (3 cols responsive)
- Auto-advance every 5 seconds
- Navigation controls
- Avatar hover effects
- Staggered card animations

```tsx
import AnimatedTestimonialSlider from "@/components/home/AnimatedTestimonialSlider";

<AnimatedTestimonialSlider />;
```

---

## Common Patterns

### Add Animation to Any Component

```tsx
import { motion } from "framer-motion";
import { slideUp } from "@/lib/animations";

const MyComponent = () => (
  <motion.div variants={slideUp} initial="hidden" animate="visible">
    My Content
  </motion.div>
);
```

### Add Hover Effect

```tsx
<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
  Click me
</motion.button>
```

### Add View-based Animation (Triggers when scrolled into view)

```tsx
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  Content appears when scrolled into view
</motion.div>
```

### Staggered List Animation

```tsx
import { staggerContainer, staggerItem } from "@/lib/animations";

<motion.ul variants={staggerContainer} initial="hidden" animate="visible">
  {items.map((item) => (
    <motion.li key={item.id} variants={staggerItem}>
      {item.name}
    </motion.li>
  ))}
</motion.ul>;
```

---

## Animation Timing Reference

| Animation Type | Duration     | Use Case             |
| -------------- | ------------ | -------------------- |
| fadeIn         | 0.6s         | Page elements        |
| slideUp        | 0.6s         | Content entrance     |
| scaleIn        | 0.5s         | Emphasis effects     |
| bounceIn       | 0.5s         | Playful elements     |
| pulse          | 2s loop      | Attention seekers    |
| floating       | 3s loop      | Decorative elements  |
| hover effects  | 0.3s         | Interactive elements |
| stagger delay  | 0.1s between | Sequential items     |

---

## Tips & Best Practices

### ✅ DO

- Use `whileInView` for scroll animations
- Add `viewport={{ once: true }}` to prevent re-triggering
- Use stagger for list items (looks professional)
- Keep animations under 1 second for UI elements
- Use continuous animations sparingly
- Test on mobile devices

### ❌ DON'T

- Animate every element (overwhelming)
- Use long durations (over 1.5s)
- Add animations to all hover states (too busy)
- Forget about `prefers-reduced-motion` accessibility
- Animate elements that users interact with
- Use too many different animation types on one page

---

## Next Components to Animate

Priority order:

1. **PopularPackages** - Card flip animations
2. **GalleryPreview** - Image reveal animations
3. **StatsCounter** - Number animations on scroll
4. **CtaSection** - Button pulse/bounce
5. **Admin Forms** - Field entrance stagger
6. **Page Transitions** - Route change animations
7. **Navbar** - Menu dropdown animations

---

## Need More Info?

- See `src/lib/animations.ts` for all available variants
- See `src/components/common/AnimationWrappers.tsx` for wrapper components
- See `src/components/home/AnimatedHeroCarousel.tsx` for implementation example
- Framer Motion docs: https://www.framer.com/motion/
