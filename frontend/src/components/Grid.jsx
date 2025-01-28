import React, { useState, useEffect } from 'react';

const generateColumnHeaders = (cols) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let headers = [];
    for (let i = 0; i < cols; i++) {
        headers.push(letters[i % 26] + (Math.floor(i / 26) + 1));
    }
    return headers;
};

const useGrid = (initialRows, initialCols, initialData) => {
    const [rows, setRows] = useState(initialRows);
    const [cols, setCols] = useState(initialCols);
    const [data, setData] = useState(initialData || []);

    useEffect(() => {
        if (!initialData) {
            setData(Array.from({ length: initialRows }, () => Array.from({ length: initialCols }, () => '')));
        }
    }, [initialRows, initialCols, initialData]);

    const handleCellChange = (rowIndex, colIndex, value) => {
        const newData = [...data];
        newData[rowIndex][colIndex] = value;
        setData(newData);
    };

    const addRow = () => {
        setRows(prev => prev + 1);
        setData(prevData => [...prevData, Array(cols).fill('')]);
    };

    const addColumn = () => {
        setCols(prev => prev + 1);
        setData(prevData => prevData.map(row => [...row, '']));
    };

    const deleteRow = () => {
        if (rows > 1) {
            setRows(prev => prev - 1);
            setData(prevData => prevData.slice(0, -1));
        }
    };

    const deleteColumn = () => {
        if (cols > 1) {
            setCols(prev => prev - 1);
            setData(prevData => prevData.map(row => row.slice(0, -1)));
        }
    };

    return { data, rows, cols, setRows, setCols, setData, handleCellChange, addRow, addColumn, deleteRow, deleteColumn };
};

export default function Grid({ sheetId = 'main', initialRows = 10, initialCols = 10 }) {
    const { data, rows, cols, setRows, setCols, setData, handleCellChange, addRow, addColumn, deleteRow, deleteColumn } = useGrid(initialRows, initialCols);
    const [selectedCellContent, setSelectedCellContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSheetData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/sheets/main`);
                if (!response.ok) {
                    throw new Error('Sheet not found or failed to load');
                }
                const sheetData = await response.json();

                setRows(sheetData.rows || initialRows);
                setCols(sheetData.columns || initialCols);
                setData(sheetData.data || Array.from({ length: initialRows }, () => Array.from({ length: initialCols }, () => '')));
            } catch (err) {
                console.error('Error loading sheet:', err);
                setError('Failed to load sheet data');
            } finally {
                setLoading(false);
            }
        };

        fetchSheetData();
    }, [initialRows, initialCols, setRows, setCols, setData]);  

    const handleCellClick = (rowIndex, colIndex) => {
        setSelectedCellContent(data[rowIndex][colIndex]);
    };

    const handleCellInput = (rowIndex, colIndex, e) => {
        const value = e.target.value;
        setSelectedCellContent(value);
        handleCellChange(rowIndex, colIndex, value);
    };

    const saveSheet = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/sheets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data,
                    rows,
                    columns: cols,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save sheet.');
            }

            const result = await response.json();
            console.log('Sheet saved/updated successfully:', result);
            alert('Sheet saved/updated successfully!');
        } catch (error) {
            console.error('Error saving sheet:', error);
            alert('Failed to save/update sheet.');
        }
    };

    if (loading) {
        return <div>Loading sheet data...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const columnHeaders = generateColumnHeaders(cols);

    return (
        <div className="p-4">
            <div className="mb-4 p-2 bg-gray-100 border border-gray-300 rounded">
                Selected Cell Content: <span className="font-semibold">{selectedCellContent}</span>
            </div>
            <div className="flex mb-4">
                <button onClick={addRow} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Row</button>
                <button onClick={addColumn} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-green-600">Add Column</button>
                <button onClick={deleteRow} className="ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete Row</button>
                <button onClick={deleteColumn} className="ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete Column</button>
                <button onClick={saveSheet} className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Save Sheet</button>
            </div>

            <div className="overflow-auto border border-gray-300">
                <div className="flex sticky top-0 bg-white z-10">
                    <div className="overflow-auto w-10 h-10 flex items-center justify-center border border-gray-300 font-bold"></div>
                    <div className="flex">
                        {columnHeaders.map((header, colIndex) => (
                            <div key={colIndex} className="w-24 h-10 flex items-center justify-center border border-gray-300 font-bold">
                                {header}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex">
                    <div className="flex flex-col sticky left-0 bg-white z-10">
                        {Array.from({ length: rows }, (_, rowIndex) => (
                            <div key={rowIndex} className="w-10 h-10 flex items-center justify-center border border-gray-300 font-bold">
                                {rowIndex + 1}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col">
                        {data.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex">
                                {row.map((cell, colIndex) => (
                                    <input
                                        key={`${rowIndex}-${colIndex}`}
                                        className="w-24 h-10 border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                                        value={cell}
                                        onClick={() => handleCellClick(rowIndex, colIndex)}
                                        onChange={(e) => handleCellInput(rowIndex, colIndex, e)}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
