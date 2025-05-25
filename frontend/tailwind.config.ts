// frontend/tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // This will cover app/page.tsx
    // "*.{js,ts,jsx,tsx,mdx}" // This is very broad, usually not needed if others are correct
  ],
  theme: {
        extend: {
                colors: {
                        background: 'hsl(var(--background))',
                        foreground: 'hsl(var(--foreground))',
                        card: {
                                DEFAULT: 'hsl(var(--card))',
                                foreground: 'hsl(var(--card-foreground))'
                        },
                        popover: {
                                DEFAULT: 'hsl(var(--popover))',
                                foreground: 'hsl(var(--popover-foreground))'
                        },
                        primary: {
                                DEFAULT: 'hsl(var(--primary))',
                                foreground: 'hsl(var(--primary-foreground))'
                        },
                        secondary: {
                                DEFAULT: 'hsl(var(--secondary))',
                                foreground: 'hsl(var(--secondary-foreground))'
                        },
                        muted: {
                                DEFAULT: 'hsl(var(--muted))',
                                foreground: 'hsl(var(--muted-foreground))'
                        },
                        accent: {
                                DEFAULT: 'hsl(var(--accent))',
                                foreground: 'hsl(var(--accent-foreground))'
                        },
                        destructive: {
                                DEFAULT: 'hsl(var(--destructive))',
                                foreground: 'hsl(var(--destructive-foreground))'
                        },
                        border: 'hsl(var(--border))',
                        input: 'hsl(var(--input))',
                        ring: 'hsl(var(--ring))',
                        chart: { // Kept from your original
                                '1': 'hsl(var(--chart-1))',
                                '2': 'hsl(var(--chart-2))',
                                '3': 'hsl(var(--chart-3))',
                                '4': 'hsl(var(--chart-4))',
                                '5': 'hsl(var(--chart-5))'
                        },
                        sidebar: { // Kept from your original
                                DEFAULT: 'hsl(var(--sidebar-background))',
                                foreground: 'hsl(var(--sidebar-foreground))',
                                primary: 'hsl(var(--sidebar-primary))',
                                'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                                accent: 'hsl(var(--sidebar-accent))',
                                'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                                border: 'hsl(var(--sidebar-border))',
                                ring: 'hsl(var(--sidebar-ring))'
                        },
                        // === NEW DESIGN Tailwind Color Mapping START ===
                        'morocco-red': 'hsl(var(--morocco-red))',
                        'morocco-orange': 'hsl(var(--morocco-orange))',
                        'morocco-gold': 'hsl(var(--morocco-gold))',
                        'morocco-teal': 'hsl(var(--morocco-teal))',
                        'morocco-navy': 'hsl(var(--morocco-navy))',
                        'morocco-cream': 'hsl(var(--morocco-cream))',
                        'morocco-sand': 'hsl(var(--morocco-sand))',
                        // === NEW DESIGN Tailwind Color Mapping END ===
                },
                backgroundImage: { // Keep existing, add if new design needs specific named gradients
                        // 'zellige': "url('/patterns/zellige.svg')", // Remove if zellige.svg is not part of new design
                        // 'zellige-border': "url('/patterns/zellige-border.svg')", // Remove if not part of new design
                        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                        "gradient-conic":
                                "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                },
                borderRadius: {
                        // 'zellige': '2rem 0.5rem 2rem 0.5rem', // Remove if not part of new design
                        lg: 'var(--radius)',
                        md: 'calc(var(--radius) - 2px)',
                        sm: 'calc(var(--radius) - 4px)'
                },
                keyframes: {
                        'accordion-down': {
                                from: { height: '0' },
                                to: { height: 'var(--radix-accordion-content-height)' }
                        },
                        'accordion-up': {
                                from: { height: 'var(--radix-accordion-content-height)' },
                                to: { height: '0' }
                        },
                        // Add slidePattern if you want to use it with Tailwind animation utilities, though it's already CSS keyframes
                },
                animation: {
                        'accordion-down': 'accordion-down 0.2s ease-out',
                        'accordion-up': 'accordion-up 0.2s ease-out',
                        // 'slide-pattern': 'slidePattern 8s linear infinite' // If you added keyframes above
                }
        }
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
export default config;