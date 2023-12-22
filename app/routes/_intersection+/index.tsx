import { type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import { Reducer, useCallback, useEffect, useReducer, useState } from 'react'
import { TrafficRoad } from '#app/components/intersection/traffic-road'
import { type lightStatus } from '#app/components/intersection/types'
import { Button } from '#app/components/ui/button'

export const meta: MetaFunction = () => [{ title: 'Traffic Intersection 🚦' }]

// Configurations
const lanesCount = 4

export const loader = async ({ request }: LoaderFunctionArgs) => {
	return null
}

// local types
type trafficState = {
	lanes: {
		north: number[]
		east: number[]
		south: number[]
		west: number[]
	}
	lights: {
		north: lightStatus[]
		east: lightStatus[]
		south: lightStatus[]
		west: lightStatus[]
	}
}

type trafficActions =
	| { type: 'tick' }
	| { type: 'setLanes'; payload: trafficState['lanes'] }
	| { type: 'setLights'; payload: trafficState['lights'] }

const trafficReducer: Reducer<trafficState, trafficActions> = (
	state,
	action,
) => {
	switch (action.type) {
		case 'tick': {
			const newState = structuredClone(state)

			newState.lanes = incrementCarsPerTick(newState.lanes)

			return newState
		}
		case 'setLanes': {
			// TODO
			return state
			break
		}
		case 'setLights': {
			// TODO
			return state
		}
	}
}

/**
 * Inital state will be an empty intersection
 * with greens in the east/west direction
 * and flashing oranges for the left turns
 */
function initialState() {
	const initalSate: trafficState = {
		lanes: {
			north: new Array(lanesCount).fill(0),
			east: new Array(lanesCount).fill(0),
			south: new Array(lanesCount).fill(0),
			west: new Array(lanesCount).fill(0),
		},
		lights: {
			north: new Array(lanesCount).fill({ color: 'r', time: 0 }),
			east: new Array(lanesCount).fill(0).map((_v, i) => ({
				color: i === 0 ? 'o' : 'g',
				time: 0,
			})),
			south: new Array(lanesCount).fill({ color: 'r', time: 0 }),
			west: new Array(lanesCount).fill(0).map((_v, i) => ({
				color: i === 0 ? 'o' : 'g',
				time: 0,
			})),
		},
	}

	return initalSate
}

/**
 * Add cars to the intersection
 * This function mutates the input object
 */
function incrementCarsPerTick(lanes: trafficState['lanes']) {
	// add 0-4 cars per tick
	const incrementAmount = Math.floor(Math.random() * 5)

	if (incrementAmount === 0) {
		return lanes
	}

	for (let i = 0; i < incrementAmount; i++) {
		// randomize the direction and lane number
		const direction = Math.floor(Math.random() * 4)
		const lane = Math.floor(Math.random() * lanesCount)

		switch (direction) {
			// North
			case 0: {
				lanes.north[lane] += 1
				break
			}
			// East
			case 1: {
				lanes.east[lane] += 1
				break
			}
			// South
			case 2: {
				lanes.south[lane] += 1
				break
			}
			// West
			case 3: {
				lanes.west[lane] += 1
				break
			}
			default:
				console.log('off by one error in incrementCarsPerTick')
				break
		}
	}

	return lanes
}

export default function Index() {
	// Controls
	const [simulationStatus, setSimulationStatus] = useState<
		'stoppped' | 'playing' | 'paused'
	>('stoppped')

	const [state, dispatch] = useReducer(trafficReducer, initialState())

	function toggleSimulation() {
		switch (simulationStatus) {
			case 'playing':
				setSimulationStatus('paused')
				break
			case 'paused':
			case 'stoppped':
				setSimulationStatus('playing')
				break
		}
	}

	// tick function operates outside of React events
	useEffect(() => {
		let intervalId: ReturnType<typeof setTimeout> | null = null
		switch (simulationStatus) {
			case 'playing':
				intervalId = setInterval(() => dispatch({ type: 'tick' }), 1000)
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
	}, [simulationStatus])

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
							lanesState={state.lanes.north}
							lightsState={state.lights.north}
							label="North"
							className="rotate-180"
						/>
					</div>
					<div className="col-start-3 row-start-2">
						<TrafficRoad
							lanesState={state.lanes.east}
							lightsState={state.lights.east}
							label="East"
							className="-rotate-90"
						/>
					</div>
					<div className="col-start-2 row-start-3">
						<TrafficRoad
							lanesState={state.lanes.south}
							lightsState={state.lights.south}
							label="South"
						/>
					</div>
					<div className="col-start-1 row-start-2">
						<TrafficRoad
							lanesState={state.lanes.west}
							lightsState={state.lights.west}
							label="West"
							className="rotate-90"
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
				<li>Decrement cars in lanes on their green light</li>
				<li>Setup timers for lights</li>
				<li>Setup triggers to be a bit smarter</li>
				<li>Setup pedestrian signal and light</li>
			</ul>
		</details>
	)
}
