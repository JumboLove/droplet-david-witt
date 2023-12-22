import { type PedestrianType } from './types'

export function PedestrianWaitingArea({
	pedestrians,
}: {
	pedestrians: Array<PedestrianType>
}) {
	// randomize positions here to make it seem like a dance party

	const displayPedestrians = pedestrians.slice(0, 8)
	const rest = pedestrians.slice(8)

	return (
		<div className="relative h-full w-full">
			{displayPedestrians.map((icon, i) => {
				const randomTop = Math.floor(Math.random() * 80) + '%'
				const randomLeft = Math.floor(Math.random() * 80) + '%'
				return (
					<div
						key={i}
						className="absolute"
						style={{
							top: randomTop,
							left: randomLeft,
						}}
					>
						{icon as String}
					</div>
				)
			})}
			{rest.length > 0 && (
				<div className="text-md absolute bottom-4 right-4 align-bottom font-semibold">
					+{rest.length}
				</div>
			)}
		</div>
	)
}
