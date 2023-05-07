import React, { useState, useMemo } from "react";

function DataTable({ data }) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [searchTerm, setSearchTerm] = useState("");
    const [currentRows, setcurrentRows] = useState([]);

    const columns = useMemo(
        () => [{ name: "Asset Name", accessor: "Asset Name", }, { name: "Business Category", accessor: "Business Category", }, { name: "Risk Rating", accessor: "Risk Rating", }, { name: "Risk Factors", accessor: "Risk Factors", }, { name: "Year", accessor: "Year", },],
        []
    );

    const handleSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    const sortedData = useMemo(() => {
        let sortedData = [...data];
        if (sortConfig.key !== null) {
            sortedData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === "ascending" ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === "ascending" ? 1 : -1;
                }
                return 0;
            });
        }
        return sortedData;
    }, [data, sortConfig]);

    const filteredData = useMemo(() => {
        let searchData = sortedData;
        if (searchTerm !== "") {
            searchData = sortedData.filter((row) =>
                Object.values(row)
                    .join(" ")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );
        }
        return searchData;
    }, [searchTerm, sortedData]);

    const renderTable = () => {
        return (
            <div>
                <div>
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}
                    />
                </div>
                <table>
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th key={column.name} onClick={() => handleSort(column.accessor)}>
                                    {column.name}
                                    {sortConfig.key === column.accessor && (
                                        <span>{sortConfig.direction === "ascending" ? "▲" : "▼"}</span>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredData.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {columns.map((column, columnIndex) => (
                                        <td key={columnIndex}>{row[column.accessor]}</td>
                                    ))}
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        );

    }

    return renderTable();
}

export default DataTable;
