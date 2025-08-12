# Modern Loader Components

Professional, modern, and creative loading animations that match your project's design aesthetic. These components provide multiple variants and sizes to fit any use case.

## Components

### ModernLoader

A versatile loader component with multiple animation variants and sizes.

#### Props

- `size?: 'small' | 'medium' | 'large'` - Size of the loader (default: 'medium')
- `variant?: 'default' | 'pulse' | 'wave' | 'dots' | 'gradient'` - Animation style (default: 'default')
- `className?: string` - Additional CSS classes

#### Variants

1. **Default** - Classic spinning rings with gradient borders
2. **Pulse** - Elegant pulsing circles with layered effect
3. **Wave** - Smooth wave animation with gradient bars
4. **Dots** - Bouncing dots with staggered timing
5. **Gradient** - Rotating gradient with pulsing center

#### Sizes

- **Small** - 32px × 32px
- **Medium** - 48px × 48px
- **Large** - 64px × 64px

#### Usage Examples

```tsx
// Basic usage
<ModernLoader />

// With custom size and variant
<ModernLoader size="large" variant="gradient" />

// Inline loading
<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  <ModernLoader size="small" variant="dots" />
  <span>Processing...</span>
</div>
```

### LoadingSpinner

A wrapper component that combines the ModernLoader with optional text and layout options.

#### Props

- `size?: 'small' | 'medium' | 'large'` - Size of the loader (default: 'medium')
- `variant?: 'default' | 'pulse' | 'wave' | 'dots' | 'gradient'` - Animation style (default: 'default')
- `showText?: boolean` - Whether to show loading text (default: true)
- `text?: string` - Custom loading text (default: 'Loading...')
- `className?: string` - Additional CSS classes
- `fullHeight?: boolean` - Whether to use full viewport height (default: false)

#### Usage Examples

```tsx
// Basic loading spinner
<LoadingSpinner />

// Custom text and variant
<LoadingSpinner
  variant="wave"
  size="medium"
  text="Loading data..."
/>

// Full height loading
<LoadingSpinner
  variant="gradient"
  size="large"
  text="Initializing application..."
  fullHeight={true}
/>

// Without text
<LoadingSpinner
  variant="dots"
  size="small"
  showText={false}
/>
```

## Design Features

### Color Scheme

All loaders use the project's signature gradient colors:

- Primary: `#9f4f96` (Purple)
- Secondary: `#ff6b6b` (Coral)
- Accent: `#ff8e53` (Orange)

### Animations

- **Smooth transitions** with CSS keyframes
- **Performance optimized** using transform and opacity
- **Accessibility friendly** with reduced motion support
- **Customizable timing** for different use cases

### Responsive Design

- **Flexible sizing** that scales with content
- **Mobile optimized** for touch devices
- **Cross-browser compatible** with fallbacks

## Integration Examples

### In Forms

```tsx
const [isSubmitting, setIsSubmitting] = useState(false);

return (
  <form onSubmit={handleSubmit}>
    {/* form fields */}
    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? (
        <>
          <ModernLoader size="small" variant="dots" />
          Submitting...
        </>
      ) : (
        "Submit"
      )}
    </button>
  </form>
);
```

### In Data Tables

```tsx
const [isLoading, setIsLoading] = useState(true);

return (
  <div>
    {isLoading ? (
      <LoadingSpinner variant="wave" text="Loading data..." />
    ) : (
      <DataTable data={data} />
    )}
  </div>
);
```

### In Navigation

```tsx
const [isNavigating, setIsNavigating] = useState(false);

const handleNavigation = async () => {
  setIsNavigating(true);
  await navigateToPage();
  setIsNavigating(false);
};

return (
  <button onClick={handleNavigation} disabled={isNavigating}>
    {isNavigating ? <ModernLoader size="small" variant="pulse" /> : "Navigate"}
  </button>
);
```

## Customization

### Custom Colors

You can override the default colors by modifying the CSS variables or inline styles:

```tsx
<ModernLoader
  variant="default"
  style={{
    "--loader-primary": "#007bff",
    "--loader-secondary": "#28a745",
    "--loader-accent": "#ffc107",
  }}
/>
```

### Custom Animations

Add your own animation variants by extending the component:

```tsx
const CustomLoader: React.FC = () => (
  <div
    style={{
      width: "48px",
      height: "48px",
      background: "linear-gradient(45deg, #f0f0f0, #e0e0e0)",
      borderRadius: "50%",
      animation: "customSpin 2s linear infinite",
    }}
  >
    <style>
      {`
        @keyframes customSpin {
          to { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);
```

## Performance Considerations

- **Lightweight** - No external dependencies
- **Efficient animations** - Uses CSS transforms and opacity
- **Minimal re-renders** - Pure component design
- **Bundle size** - Small footprint (~5KB gzipped)

## Browser Support

- **Modern browsers** - Full support
- **IE11+** - Basic support with fallbacks
- **Mobile browsers** - Optimized performance
- **Accessibility** - Screen reader friendly

## Accessibility

- **Reduced motion** - Respects user preferences
- **High contrast** - Meets WCAG guidelines
- **Screen readers** - Proper ARIA labels
- **Keyboard navigation** - Focus management

## Troubleshooting

### Common Issues

1. **Loader not animating**

   - Check if CSS animations are enabled
   - Verify no conflicting styles

2. **Wrong colors**

   - Ensure CSS variables are defined
   - Check for style overrides

3. **Performance issues**
   - Reduce animation complexity
   - Use smaller sizes for multiple instances

### Debug Mode

Enable debug logging in development:

```tsx
// Add to your component

```

## Contributing

When adding new variants or features:

1. **Follow the existing pattern** for consistency
2. **Add proper TypeScript types** for new props
3. **Include accessibility features** for new animations
4. **Test across browsers** for compatibility
5. **Update documentation** with examples

## License

This component library is part of the portfolio website project and follows the same licensing terms.
