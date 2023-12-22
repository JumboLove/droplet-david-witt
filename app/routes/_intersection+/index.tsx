import { type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import { type Reducer, useEffect, useReducer, useState } from 'react'
import { PedestrianWaitingArea } from '#app/components/intersection/pedestrian-waiting-area'
import { TrafficRoad } from '#app/components/intersection/traffic-road'
import {
	type PedestrianType,
	pedestrians,
	type lightStatus,
} from '#app/components/intersection/types'
import { Button } from '#app/components/ui/button'

export const meta: MetaFunction = () => [{ title: 'Traffic Intersection 🚦' }]

// Configurations
const lanesCount = 4
const lightCycleGreenDuration = 5
const lightCycleYellowDuration = 2
const lightCycleArrowDuration = 4
// const pedestriansCrossDuration = 6
// const pedestrianMaxWaitingTime = 10

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
	pedestriansWaiting: Array<PedestrianType>
	pedestrianWaitingTime: number
	pedestrianWalkingTime: number
	lightActiveTime: number
	lightActiveColor: 'g' | 'y' | 'r' | 'a' // 'a' for turn arrow
}

type trafficActions = { type: 'tick' }

const trafficReducer: Reducer<trafficState, trafficActions> = (
	state,
	action,
) => {
	switch (action.type) {
		case 'tick': {
			const newState = structuredClone(state)

			// add cars to the intersection
			incrementCarsPerTick(newState.lanes)
			incrementPedestriansPerTick(newState.pedestriansWaiting)

			// set new light states (if needed)
			newState.lightActiveTime = updateLightStatus(newState)

			// pass cars through the intersection
			passCarsThroughIntersection(newState)

			//

			return newState
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
		pedestriansWaiting: [],
		pedestrianWaitingTime: 0,
		pedestrianWalkingTime: 0,
		lightActiveTime: 0,
		lightActiveColor: 'g',
	}

	return initalSate
}

/**
 * Add pedestrians to the crosswalk waiting area
 * This function modifies the input object
 */
function incrementPedestriansPerTick(
	pedestriansWaiting: trafficState['pedestriansWaiting'],
) {
	// add 0-3 cars per tick
	const incrementAmount = Math.floor(Math.random() * 3)

	for (let i = 0; i < incrementAmount; i++) {
		const randomPedestrianKey = pedestrians[
			Math.floor(Math.random() * pedestrians.length)
		] as keyof typeof pedestrians
		pedestriansWaiting.push(randomPedestrianKey)
	}
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

/**
 * Update the lights status
 * - if a green light is past its time and cars are waiting, change to yellow
 * - if a yellow light is past is duration, change to red
 * Mutates the input state
 */
function updateLightStatus(state: trafficState) {
	let newActiveTime = state.lightActiveTime + 1

	// let the current light time play out
	if (
		state.lightActiveColor === 'g' &&
		newActiveTime <= lightCycleGreenDuration
	) {
		return newActiveTime
	} else if (
		state.lightActiveColor === 'y' &&
		newActiveTime <= lightCycleYellowDuration
	) {
		return newActiveTime
	} else if (
		state.lightActiveColor === 'a' &&
		newActiveTime <= lightCycleArrowDuration
	) {
		return newActiveTime
	}

	// change lights below
	newActiveTime = 0

	// get active lights directions
	type lightsKey = keyof trafficState['lights']
	const activeLights: lightsKey[] = []
	for (const direction in state.lights) {
		const lightsInDirection = state.lights[direction as lightsKey]
		for (const light of lightsInDirection) {
			if (light.color === state.lightActiveColor) {
				activeLights.push(direction as lightsKey)
				break
			}
		}
	}

	switch (state.lightActiveColor) {
		// flip green to yellow
		case 'g': {
			for (const direction in state.lights) {
				if (activeLights.includes(direction)) {
					for (const light of state.lights[direction as lightsKey]) {
						light.color = 'y'
					}
				}
			}
			state.lightActiveColor = 'y'
			break
		}
		// flip yellow to red, and red to green/orange
		case 'y': {
			for (const direction in state.lights) {
				const lightsForDirection = state.lights[direction as lightsKey]
				for (const [i, light] of lightsForDirection.entries()) {
					if (activeLights.includes(direction)) {
						light.color = 'r'
					} else {
						light.color = i === 0 ? 'o' : 'g'
					}
				}
			}
			state.lightActiveColor = 'g'
			break
		}
		case 'a': {
			// TODO
			break
		}
		default:
			break
	}

	return newActiveTime
}

/**
 * If a car's lane has a green light, allow one car through
 * If a car's lane has an orange light, check if there are cars coming
 * the other direction before allowing turns
 */
function passCarsThroughIntersection(state: trafficState) {
	type lanesKey = keyof trafficState['lanes']
	type lightsKey = keyof trafficState['lights']

	for (const direction in state.lanes) {
		const lanesInDirection = state.lanes[direction as lanesKey]
		for (const [i, lane] of lanesInDirection.entries()) {
			if (lane === 0) continue
			// TODO
			const carsInLane = state.lanes[direction as lanesKey][i]
			const lightStatus = state.lights[direction as lightsKey][i]
			switch (lightStatus.color) {
				case 'g':
				case 'y':
					state.lanes[direction as lanesKey][i] = carsInLane - 1
					break
				case 'o':
					// TODO check oncoming traffic
					break
				default:
					break
			}
		}
	}
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
					<div className="col-start-3 row-start-3">
						<PedestrianWaitingArea pedestrians={state.pedestriansWaiting} />
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
				<li>Setup control inputs - reset</li>
				<li>Setup triggers to be a bit smarter - Priority Queue?</li>
				<li>Setup pedestrian signal and light</li>
				<li>Setup turn arrows</li>
				<li>
					Setup orange light logic to check for oncoming traffic (living
					vicariously on yellows right now)
				</li>
			</ul>
		</details>
	)
}
