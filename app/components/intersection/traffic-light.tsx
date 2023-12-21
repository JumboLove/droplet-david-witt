import { cn } from '#app/utils/misc'
import { type lightStatus } from './types'

export function TrafficLight({
	state,
	isLeftTurnLight,
}: {
	state: lightStatus
	isLeftTurnLight: boolean
}) {
	return (
		<div className="flex flex-col gap-2 bg-slate-500 p-2">
			<div
				className={cn('aspect-square w-4 rounded-full bg-red-500', {
					'opacity-50': state.color !== 'r',
				})}
			>
				<span className="sr-only">
					Red light{state.color === 'r' ? ' active' : ''}
				</span>
			</div>
			<div
				className={cn(
					'aspect-square w-4 rounded-full bg-yellow-500 opacity-50',
					{
						'opacity-50': state.color !== 'y',
					},
				)}
			>
				<span className="sr-only">
					Yellow light{state.color === 'y' ? ' active' : ''}
				</span>
			</div>
			<div
				className={cn(
					'aspect-square w-4 rounded-full bg-green-500 opacity-50',
					{
						'opacity-50': state.color !== 'g',
					},
				)}
			>
				<span className="sr-only">
					Green light{state.color === 'g' ? ' active' : ''}
				</span>
			</div>

			{isLeftTurnLight && (
				<div
					className={cn(
						'aspect-square w-4 rounded-full bg-orange-500 opacity-50',
						{
							'opacity-50': state.color !== 'o',
						},
					)}
				>
					<span className="sr-only">
						Orange light{state.color === 'o' ? ' active' : ''}
					</span>
				</div>
			)}
		</div>
	)
}
