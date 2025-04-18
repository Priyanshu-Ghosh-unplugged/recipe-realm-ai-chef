import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			scale: {
				'102': '1.02',
				'105': '1.05',
				'110': '1.1',
			},
			backgroundImage: {
				'hero-pattern': "url('/hero-pattern.png')",
				'recipe-gradient': 'linear-gradient(135deg, #FF9D6C 0%, #FF6B35 100%)',
				'card-gradient': 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)',
				'spice-pattern': 'radial-gradient(circle, #FF8A5B 2px, transparent 2px), radial-gradient(circle, #FF5154 1px, transparent 1px)',
				'indian-gradient': 'linear-gradient(135deg, #FFA94D 0%, #FF5154 100%)',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Enhanced color palette for Recipe Realm
				recipe: {
					primary: '#FF6B35',    // Warm Orange
					secondary: '#4CB944',  // Fresh Green
					accent: '#FFA94D',     // Light Orange
					background: '#FFFAF5', // Cream
					text: '#2D2926',       // Deep Brown
					pink: '#FF8BA7',       // Soft Pink
					purple: '#9B87F5',     // Lavender
					teal: '#3ABBB3',       // Teal
					yellow: '#FFD166',     // Warm Yellow
					red: '#F25F5C',        // Coral Red
					// New Indian cuisine inspired colors
					saffron: '#FF9933',    // Saffron
					turmeric: '#FFC30B',   // Turmeric Yellow
					chili: '#FF5154',      // Chili Red
					curry: '#E3A018',      // Curry
					cardamom: '#2A603B',   // Cardamom Green
					masala: '#8B4513',     // Masala Brown
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in': {
					'0%': {
						opacity: '0',
						transform: 'translateX(-10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'pulse-soft': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'rotate-center': {
					'0%': {
						transform: 'rotate(0)'
					},
					'100%': {
						transform: 'rotate(360deg)'
					}
				},
				'spice-float': {
					'0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
					'50%': { transform: 'translateY(-10px) rotate(5deg)' }
				},
				'masala-mix': {
					'0%': { transform: 'rotate(0deg) scale(1)' },
					'25%': { transform: 'rotate(10deg) scale(1.05)' },
					'50%': { transform: 'rotate(0deg) scale(1.1)' },
					'75%': { transform: 'rotate(-10deg) scale(1.05)' },
					'100%': { transform: 'rotate(0deg) scale(1)' }
				},
				'shimmer-spice': {
					'0%': { backgroundPosition: '-500px 0' },
					'100%': { backgroundPosition: '500px 0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'slide-in': 'slide-in 0.3s ease-out',
				'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
				'rotate-center': 'rotate-center 8s linear infinite',
				'spice-float': 'spice-float 3s ease-in-out infinite',
				'masala-mix': 'masala-mix 5s ease-in-out infinite',
				'shimmer-spice': 'shimmer-spice 2.5s infinite linear'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
