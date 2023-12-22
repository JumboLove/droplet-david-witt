// r = red | do no cross
// y = yellow | stop if not in intersection
// g = green | go
// o = orange | flashing turn - go if no other cars are coming the other way
export type lightStatus = { color: 'r' | 'y' | 'g' | 'o' }
export const pedestrians = ['💃', '🕺', '🚶', '🏃‍♀️'] as const
export type PedestrianType = keyof typeof pedestrians
