import { Dispatch, SetStateAction, useEffect, useState } from 'react'

type Props = {
	// initialSeconds: number,
	paused?: boolean,
	seconds: number,
	setSeconds: Dispatch<SetStateAction<number>>
}

const Timer = ({ paused = false, seconds, setSeconds }: Props) => {
	// const [seconds, setSeconds] = useState(initialSeconds)

	useEffect(() => {
		if (paused) return
		const intervalId = setInterval(() => {
			setSeconds(prevSeconds => prevSeconds + 1)
		}, 1000)

		return () => clearInterval(intervalId)
	}, [seconds, paused])

	const formatTime = (time: number): string => {
		const minutes = Math.floor(time / 60)
		const secs = time % 60
		return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
	}

	return (
		<div>{formatTime(seconds)}</div>
	)
}

export default Timer
