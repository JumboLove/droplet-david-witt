import { type MetaFunction } from '@remix-run/node'
export const meta: MetaFunction = () => [{ title: 'Traffic Intersection 🚦' }]

export default function Index() {
	return (
		<main className="container relative min-h-screen">
			<p>TODO...</p>
		</main>
	)
}
