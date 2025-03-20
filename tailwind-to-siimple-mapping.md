# Tailwind to Siimple CSS Mapping

This document outlines the conversion of Tailwind utility classes to custom CSS rules in our project, aligned with the Siimple CSS framework.

## Spacing
- **Tailwind:** `pt-6`, `pb-6`  
  **CSS:** `padding-top: 1.5rem; padding-bottom: 1.5rem;`
- **Tailwind:** `px-4`  
  **CSS:** `padding-left: 1rem; padding-right: 1rem;`
- **Tailwind:** `py-2`  
  **CSS:** `padding-top: 0.5rem; padding-bottom: 0.5rem;`
- **Tailwind:** `md:px-8`  
  **CSS:** In a media query (min-width: 768px): `padding-left: 2rem; padding-right: 2rem;`

## Typography & Font
- **Tailwind:** `font-semibold`  
  **CSS:** `font-weight: 600;`
- **Tailwind:** `antialiased`  
  **CSS:** `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`

## Borders & Rounding
- **Tailwind:** `rounded`  
  **CSS:** `border-radius: 0.25rem;`

## Buttons
- **Tailwind Button:**  
  Previously used classes on `.btn` for background color, padding, font, etc.  
  **Mapped to:** Custom CSS rules as defined in `globals.css` for `.btn` and `.btn:hover`.
- **Siimple Equivalent:** The Siimple CSS framework provides `.siimple-btn` class that can be used for buttons.

## Layout
- The `container-custom` class uses padding utilities now defined with standard CSS.
- **Siimple Equivalent:** Siimple provides `.siimple-container` for container elements.

## Note on Siimple CSS
- The Siimple CSS framework is included via CDN and provides a clean, minimal design system.
- Siimple CSS follows a BEM-like naming convention where components are prefixed with `siimple-`.
- For additional components and utilities, refer to the [Siimple CSS documentation](https://docs.siimple.xyz/).

## Siimple Class References

Here are some common Siimple classes that can replace Tailwind utilities:

### Layout
- `.siimple-container` - Container with auto margins and responsive padding
- `.siimple-grid` - CSS grid system
- `.siimple-card` - Card component with padding and optional shadow

### Typography
- `.siimple-h1` through `.siimple-h6` - Heading styles
- `.siimple-paragraph` - Paragraph styling
- `.siimple-small` - Small text

### Colors
- `.siimple-bg-[color]` - Background colors
- `.siimple-color-[color]` - Text colors

### Components
- `.siimple-btn` - Button styles
- `.siimple-alert` - Alert/notification styling
- `.siimple-form` - Form component

This mapping document serves as a guide for the refactoring process and future maintenance.