import { type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import { useCallback, useEffect, useState } from 'react'
import { TrafficRoad } from '#app/components/intersection/traffic-road'
import { type lightStatus } from '#app/components/intersection/types'
import { Button } from '#app/components/ui/button'

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
				break
			case 'paused':
			case 'stoppped':
				setSimulationStatus('playing')
				break
			default:
				// Error if reaching default case
				break
		}
	}

	const incrementCarsPerTick = useCallback(() => {
		// add 0-4 cars per tick
		const incrementAmount = Math.floor(Math.random() * 5)
		console.log(`Adding ${incrementAmount} cars`)

		if (incrementAmount === 0) {
			return
		}

		const updatedNorthLanes = [...northLanes]
		const updatedEastLanes = [...eastLanes]
		const updatedSouthLanes = [...southLanes]
		const updatedWestLanes = [...westLanes]

		for (let i = 0; i < incrementAmount; i++) {
			// randomize the direction and lane number
			const direction = Math.floor(Math.random() * 4)
			const lane = Math.floor(Math.random() * lanesCount)

			switch (direction) {
				// North
				case 0: {
					updatedNorthLanes[lane] += 1
					break
				}
				// East
				case 1: {
					updatedEastLanes[lane] += 1
					break
				}
				// South
				case 2: {
					updatedSouthLanes[lane] += 1
					break
				}
				// West
				case 3: {
					updatedWestLanes[lane] += 1
					break
				}
				default:
					console.log('off by one error')
					break
			}
		}

		// Set new lane values
		setNorthLanes(updatedNorthLanes)
		setEastLanes(updatedEastLanes)
		setSouthLanes(updatedSouthLanes)
		setWestLanes(updatedWestLanes)
	}, [eastLanes, northLanes, southLanes, westLanes])

	// Runs on every tick
	const updateState = useCallback(() => {
		console.log('running update State')

		// generate new cars randomly
		incrementCarsPerTick()

		// process next tick position for cars with a green light

		// set the next state of the lights
	}, [incrementCarsPerTick])

	// tick function operates outside of React events
	useEffect(() => {
		let intervalId: ReturnType<typeof setTimeout> | null = null
		switch (simulationStatus) {
			case 'playing':
				intervalId = setInterval(updateState, 1000)
				break
			case 'paused':
			case 'stoppped':
				intervalId && clearInterval(intervalId)
			default:
				break
		}

		return () => {
			if (intervalId) {
				clearInterval(intervalId)
			}
		}
	}, [simulationStatus, updateState])

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
		<details>
			<summary>TODO</summary>
			<ul>
				<li>Setup state manager</li>
				<li>Setup control inputs - reset</li>
				<li>Setup configurations - light times, car spawn rate</li>
				<li>Spawn cars, assign to lanes</li>
				<li>Setup tick logic</li>
				<li>Setup pedestrian signal and light</li>
			</ul>
		</details>
	)
}
