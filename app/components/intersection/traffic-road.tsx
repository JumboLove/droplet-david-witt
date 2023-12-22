import { cn } from '#app/utils/misc'
import { TrafficLight } from './traffic-light'
import { type lightStatus } from './types'

export function TrafficRoad({
	lanesState,
	lightsState,
	label,
	className,
}: {
	lanesState: number[]
	lightsState: lightStatus[]
	label: String
	className?: String
}) {
	// subtract 1 since both left turn lanes will consume the same lane
	const oppositeLanes = new Array(lanesState.length - 1).fill(0)

	return (
		<div
			className={cn(
				'relative flex h-full flex-row justify-evenly text-center outline outline-green-200',
				className,
			)}
		>
			<div className="absolute  bottom-2 text-center text-3xl font-semibold text-primary/30">
				{label}
			</div>
			{/* Visual space for the other traffic lanes */}
			{oppositeLanes.map((opp, j) => (
				<div key={j} className="flex-1"></div>
			))}
			{/* Our traffic lanes */}
			{lanesState.map((cars, i) => (
				<div key={i} className="relative flex flex-1">
					<div className="absolute -left-2 -top-[5rem]  h-[42px] scale-[0.4]">
						<TrafficLight state={lightsState[i]} isLeftTurnLight={i === 0} />
					</div>
					<Lane cars={cars} position={i} />
				</div>
			))}
		</div>
	)
}

function Lane({ cars, position }: { cars: number; position: number }) {
	let label = ''
	const displayCars = Math.min(cars, 4)
	const remainingCount = cars - 4

	switch (position) {
		case 0:
			label = '⬅️'
			break
		case 1:
		case 2:
			label = '⬆️'
			break
		case 3:
			label = '➡️'
		default:
			break
	}
	return (
		<div className="relative">
			<div className="absolute inset-0 -top-6 text-center font-semibold text-primary/30">
				{label}
			</div>
			<div>{'🚗'.repeat(displayCars)}</div>
			{remainingCount > 0 && <div>+{remainingCount}</div>}
		</div>
	)
}
