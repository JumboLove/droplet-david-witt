import { type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import { useEffect, useState } from 'react'
import { TrafficRoad } from '#app/components/intersection/traffic-road'
import { type lightStatus } from '#app/components/intersection/types'
import { Button } from '#app/components/ui/button'

// local types

export const meta: MetaFunction = () => [{ title: 'Traffic Intersection 🚦' }]

// Configurations
const lanesCount = 4

export const loader = async ({ request }: LoaderFunctionArgs) => {
	return null
}

export default function Index() {
	// Controls
	const [simulationStatus, setSimulationStatus] = useState<
		'stoppped' | 'playing' | 'paused'
	>('stoppped')

	// Used for the 'tick' loop
	const [intervalId, setIntervalId] = useState<ReturnType<
		typeof setTimeout
	> | null>(null)

	// Traffic data
	const [northLanes, setNorthLanes] = useState<number[]>(
		new Array(lanesCount).fill(0),
	)
	const [southLanes, setSouthLanes] = useState<number[]>(
		new Array(lanesCount).fill(0),
	)
	const [eastLanes, setEastLanes] = useState<number[]>(
		new Array(lanesCount).fill(0),
	)
	const [westLanes, setWestLanes] = useState<number[]>(
		new Array(lanesCount).fill(0),
	)

	// Light data
	const [northLights, setNorthLights] = useState<lightStatus[]>(
		new Array(lanesCount).fill({ color: 'r', time: 0 }),
	)

	const [southLights, setSouthLights] = useState<lightStatus[]>(
		new Array(lanesCount).fill({ color: 'r', time: 0 }),
	)

	const [eastLights, setEastLights] = useState<lightStatus[]>(() => {
		return new Array(lanesCount).fill(0).map((_v, i) => ({
			color: i === 0 ? 'o' : 'g',
			time: 0,
		}))
	})

	const [westLights, setWestLights] = useState<lightStatus[]>(() => {
		return new Array(lanesCount).fill(0).map((_v, i) => ({
			color: i === 0 ? 'o' : 'g',
			time: 0,
		}))
	})

	function toggleSimulation() {
		switch (simulationStatus) {
			case 'playing':
				setSimulationStatus('paused')
				intervalId && clearInterval(intervalId)
				break
			case 'paused':
			case 'stoppped':
				setSimulationStatus('playing')
				setIntervalId(setInterval(updateState, 1000))
				break
			default:
				// Error if reaching default case
				break
		}
	}

	// Runs on every tick
	function updateState() {
		console.log('running update State')

		// generate new cars randomly

		// process next tick position for cars with a green light

		// set the next state of the lights
	}

	// Clean up interval when component unmounts
	useEffect(() => {
		return () => {
			if (intervalId) {
				clearInterval(intervalId)
			}
		}
	}, [intervalId])

	return (
		<main className="container relative min-h-screen">
			<ToDoList />

			<div className="outline outline-blue-300">
				<Button onClick={toggleSimulation}>
					{simulationStatus === 'playing' ? '⏸︎' : '▶'}
				</Button>
			</div>

			<div className="aspect-square w-[800px] max-w-full  outline outline-red-300 ">
				<div className="grid h-full grid-cols-3 grid-rows-3">
					<div className="col-start-2 row-start-1">
						<TrafficRoad
							lanesState={northLanes}
							lightsState={northLights}
							label="North"
							className="rotate-180"
						/>
					</div>
					<div className="col-start-1 row-start-2">
						<TrafficRoad
							lanesState={westLanes}
							lightsState={westLights}
							label="West"
							className="rotate-90"
						/>
					</div>
					<div className="col-start-3 row-start-2">
						<TrafficRoad
							lanesState={eastLanes}
							lightsState={eastLights}
							label="East"
							className="-rotate-90"
						/>
					</div>
					<div className="col-start-2 row-start-3">
						<TrafficRoad
							lanesState={southLanes}
							lightsState={southLights}
							label="South"
						/>
					</div>
				</div>
			</div>
		</main>
	)
}

function ToDoList() {
	return (
		<details open>
			<summary>TODO</summary>
			<ul>
				<li>Setup traffic light component to receive signals</li>
				<li>Setup state manager</li>
				<li>Setup control inputs - start, pause, reset</li>
				<li>Setup configurations - light times, car spawn rate</li>
			</ul>
		</details>
	)
}
