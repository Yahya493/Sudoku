import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
import Tesseract from 'tesseract.js';
import { isEmptyBoard } from '../actions/checkActions';
import { t_board } from '../types/types';
import { AiOutlineScan } from "react-icons/ai"
import { CgSpinner } from "react-icons/cg"

declare const cv: any

type Props = {
	setSudokuBoard: Dispatch<SetStateAction<t_board | null>>,
	setCustomGame: Dispatch<SetStateAction<boolean>>
}

const SudokuExtractor: React.FC<Props> = ({ setSudokuBoard, setCustomGame }) => {
	// const [sudokuBoard, setSudokuBoard] = useState<t_board | null>(null);
	const [image, setImage] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null)

	// useEffect(() => {
	//   console.table(sudokuBoard)
	// }, [sudokuBoard])

	useEffect(() => {
		setError(null)
		if (image) {
			processImage(image);
		}
	}, [image]);

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCustomGame(true)
		const file = e.target.files?.[0];
		if (file) {
			setImage(file);
		}
	};

	const processImage = async (file: File) => {
		setLoading(true);
		const imageUrl = URL.createObjectURL(file);
		const imgElement = new Image();
		imgElement.src = imageUrl;

		imgElement.onload = async () => {
			const canvas = document.createElement('canvas');
			canvas.width = imgElement.width;
			canvas.height = imgElement.height;
			const ctx = canvas.getContext('2d')!;
			ctx.drawImage(imgElement, 0, 0);

			const src = cv.imread(canvas);  // Use OpenCV to read the image

			// Step 1: Convert to grayscale and threshold
			cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY);
			cv.adaptiveThreshold(src, src, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY_INV, 11, 2);

			// Step 2: Find contours (detect the largest contour as Sudoku grid)
			const contours = new cv.MatVector();
			const hierarchy = new cv.Mat();
			cv.findContours(src, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

			let largestContour = null;
			let maxArea = 0;
			for (let i = 0; i < contours.size(); i++) {
				const contour = contours.get(i);
				const area = cv.contourArea(contour, false);
				if (area > maxArea) {
					maxArea = area;
					largestContour = contour;
				}
			}

			// Assume largest contour is the Sudoku board; perform perspective transform
			if (largestContour) {
				// Perspective transform setup
				const board = performWarp(src, largestContour);

				// Split the grid into 9x9 cells and perform OCR on each
				const extractedDigits = await extractDigits(board);
				if (isEmptyBoard(extractedDigits)) {
					setError('Unclear or incomplete image')
				}
				else {
					setSudokuBoard(extractedDigits);
				}
			}

			src.delete();
			contours.delete();
			hierarchy.delete();
			setLoading(false);
		};
	};

	// Helper function to perform perspective warp to get a top-down view of Sudoku grid
	const performWarp = (src: any, contour: any) => {
		const rect = cv.boundingRect(contour);
		const dst = src.roi(rect);
		cv.resize(dst, dst, new cv.Size(576, 576)); // 28x28 cells for 9x9 grid
		return dst;
	};

	// Function to split into cells and recognize digits with Tesseract
	const extractDigits = async (board: any): Promise<t_board> => {
		const cellSize = board.size().width / 9;
		const sudokuArray: t_board = Array.from({ length: 9 }, () => Array(9).fill(0));

		for (let y = 0; y < 9; y++) {
			for (let x = 0; x < 9; x++) {
				const cell = board.roi(new cv.Rect(x * cellSize, y * cellSize, cellSize, cellSize));
				const canvas = document.createElement('canvas');
				cv.imshow(canvas, cell);

				const result = await Tesseract.recognize(canvas)
				// .then(({ data }) => {
				const digit = parseInt(result.data.text) || 0;
				sudokuArray[y][x] = digit > 9 ? Math.floor(digit / 10) : digit;
				// });
				cell.delete();
			}
		}
		// console.table(sudokuArray)
		return sudokuArray;
	};

	return (
		<div className='text-slate-800 font-bold '>
			<h1 className='text-xl'>Sudoku Extractor</h1>
			<label htmlFor='file' className='cursor-pointer flex gap-2'>
				<span className='text-slate-600'>{image ? image?.name : 'Select an image to scan'}</span>
				<AiOutlineScan className=' text-2xl text-blue-400' />
			</label>
			<input type="file" id='file' hidden accept="image/*" onChange={handleImageUpload} />
			{loading && <p className='text-md'>Processing image... <CgSpinner className=' inline text-2xl text-blue-400 animate-spin'/></p>}
			{error && <p className='text-red-600'>{error}</p>}
			{/* {sudokuBoard && (
        <div>
          <h2>Extracted Sudoku Board</h2>
          <table>
            <tbody>
              {sudokuBoard.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell !== 0 ? cell : ''}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )} */}
		</div>
	);
};

export default SudokuExtractor;
