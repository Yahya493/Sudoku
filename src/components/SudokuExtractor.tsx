import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { AiOutlineScan } from "react-icons/ai"
import { CgSpinner } from "react-icons/cg"
import Tesseract from 'tesseract.js'
import { getFilledCells } from '../actions/checkActions'
import { t_board } from '../types/types'

declare const cv: any

type Props = {
	setSudokuBoard: Dispatch<SetStateAction<t_board | null>>,
	setCustomGame: Dispatch<SetStateAction<boolean>>,
	loading: boolean,
	setLoading: Dispatch<React.SetStateAction<boolean>>
}

const SudokuExtractor: FC<Props> = ({ setSudokuBoard, setCustomGame, loading, setLoading }) => {
	const [image, setImage] = useState<File | null>(null)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		setError(null)
		if (image) {
			processImage(image)
		}
	}, [image])

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCustomGame(true)
		const file = e.target.files?.[0]
		if (file) {
			setImage(file)
		}
	};

	const processImage = async (file: File) => {
		setLoading(true)
		const imageUrl = URL.createObjectURL(file)
		const imgElement = new Image()
		imgElement.src = imageUrl;

		imgElement.onload = async () => {
			const canvas = document.createElement('canvas')
			
			const maxDimension = 720
			const scale = Math.min(maxDimension / imgElement.width, maxDimension / imgElement.height)
			canvas.width = imgElement.width * scale
			canvas.height = imgElement.height * scale
			const ctx = canvas.getContext('2d')!
			ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height)

			const src = cv.imread(canvas)

			cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY)
			cv.adaptiveThreshold(src, src, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY_INV, 11, 2)

			const contours = new cv.MatVector()
			const hierarchy = new cv.Mat()
			cv.findContours(src, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)

			let largestContour = null;
			let maxArea = 0;
			for (let i = 0; i < contours.size(); i++) {
				const contour = contours.get(i)
				const area = cv.contourArea(contour, false)
				if (area > maxArea) {
					maxArea = area;
					largestContour = contour;
				}
			}
			if (largestContour) {
				const board = performWarp(src, largestContour)
				const extractedDigits = await extractDigits(board)
				if (getFilledCells(extractedDigits) < 20) {
					setError('Unclear or incomplete image')
				}
				else {
					setSudokuBoard(extractedDigits)
				}
			}
			src.delete()
			contours.delete()
			hierarchy.delete()
			setLoading(false)
		};
	};

	const performWarp = (src: any, contour: any) => {
		const rect = cv.boundingRect(contour)
		const dst = src.roi(rect)
		cv.resize(dst, dst, new cv.Size(576, 576))
		return dst
	}

	const extractDigits = async (board: any): Promise<t_board> => {
		const cellSize = board.size().width / 9
		const sudokuArray: t_board = Array.from({ length: 9 }, () => Array(9).fill(0))

		for (let y = 0; y < 9; y++) {
			for (let x = 0; x < 9; x++) {
				const cell = board.roi(new cv.Rect(x * cellSize, y * cellSize, cellSize, cellSize))
				const canvas = document.createElement('canvas')
				cv.imshow(canvas, cell)

				const result = await Tesseract.recognize(canvas)
				const digit = parseInt(result.data.text) || 0;
				sudokuArray[y][x] = digit > 9 ? Math.floor(digit / 10) : digit
				cell.delete()
			}
		}
		return sudokuArray
	}

	const getFileName = () => {
		if (!image) return null
		let name = image?.name
		if (image?.name.length > 24)
			name = image?.name.slice(0, 15) + '...' + image?.name.slice(image?.name.length - 8, image?.name.length)
		return name
	}

	return (
		<div className='text-slate-800 font-bold flex flex-col items-center'>
			<h1 className='text-xl'>Sudoku Extractor</h1>
			<label htmlFor='file' className='cursor-pointer flex gap-2'>
				<span className='text-slate-600 hover:text-blue-400'>{image ? getFileName() : 'Select an image to scan'}</span>
				<AiOutlineScan className=' text-2xl text-blue-400' />
			</label>
			<input type="file" id='file' hidden accept="image/*" onChange={handleImageUpload} />
			{loading && <p className='text-md'>Processing image... <CgSpinner className=' inline text-2xl text-blue-400 animate-spin' /></p>}
			{error && <p className='text-red-600'>{error}</p>}
		</div>
	)
};

export default SudokuExtractor;
