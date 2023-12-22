import { type PedestrianType } from './types'

export function PedestrianWaitingArea({
	pedestrians,
}: {
	pedestrians: Array<PedestrianType>
}) {
	// randomize positions here to make it seem like a dance party

	return (
		<div className="relative h-full w-full">
			{pedestrians.map((icon, i) => {
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
		</div>
	)
}
