import React, { useState } from 'react';import './styles.css';
import {MdDownload} from "react-icons/md";

export default function Datatable({ data }) {
    const [itemsSelected, setItemsSelected] = useState(0);
    const columns = data[0] && Object.keys(data[0]);

    function downloadClickHandler() {
        let listMessage = '';
        for(let row of data) {
            if(row['selected'] === "true") {
                listMessage += `Device: ${row['device']}\nPath: ${row['path']}\n`;
            }
        }
        listMessage.length > 0 ? alert(listMessage) : alert('No items were selected to download');
    }

    function selectClickHandler(e, item) {
        e.target.checked ? setItemsSelected(itemsSelected+1) : setItemsSelected(itemsSelected-1);
        getSelectionStatus();
        highlightSelectedRows();
    }

    function highlightSelectedRows() {

        const grid = document.getElementById("tableGrid");
        const checkBoxes = grid.getElementsByTagName("INPUT");

        for (let i = 0; i < checkBoxes.length; i++) {
            let row = checkBoxes[i].parentNode.parentNode;
            if (checkBoxes[i].checked) {
                row.style.background = "#E0E0E0FF";
            } else {
                row.style.background = "#FFFFFF";
            }
        }
    }

    function getSelectionStatus() {
        let itemsSelected = 0;
        let itemsCanSelect = 0;

        for(let row of data) {
            if(row['selected'] === "true") {
                itemsSelected++;
            }
            if(row['status'] === "available") {
                itemsCanSelect++;
            }
        }
        setItemsSelected(itemsSelected);
        if(itemsCanSelect > 0 && itemsSelected > 0 && itemsCanSelect > itemsSelected) {
            document.getElementById("selectAllCheckbox").indeterminate = true;
        } else if(itemsSelected === 0 && itemsCanSelect > 0) {
            document.getElementById("selectAllCheckbox").indeterminate = false;
            document.getElementById("selectAllCheckbox").checked = false;
        } else {
            document.getElementById("selectAllCheckbox").indeterminate = false;
            document.getElementById("selectAllCheckbox").checked = true;
        }
    }

    function selectAllClickHandler(e) {
        const checkboxes = document.getElementsByName('fileCheckbox');
        for(let checkbox of checkboxes) {
            checkbox.checked = !checkbox.hasAttribute('disabled') && e.target.checked;
        }
        for(let row of data) {
            if(e.target.checked) {
                if(row['status'] === "available") {
                    row['selected'] = "true";
                } else {
                    row['selected'] = "false";
                }
            } else {
                row['selected'] = "false";
            }
        }
        getSelectionStatus();
        highlightSelectedRows()
    }

    return (
        <>
            <div className='tableHeaderWrapper'>
                <div className="tableHeaderItem"><input type="checkbox" id="selectAllCheckbox" onChange={selectAllClickHandler} /> { itemsSelected === 0 ? `None Selected` : `Selected ${itemsSelected}` }</div>
                <div className="tableHeaderItem" onClick={downloadClickHandler}> <MdDownload /> Download Selected</div>
            </div>
            <table id="dataTable" cellPadding={0} cellSpacing={0}>
                <thead>
                <tr className="headerRow">
                    { data[0] && columns.map((heading) =>
                        <>
                            {heading !== 'selected' ? (
                            <th>{heading}</th>
                            ) : (<th></th>)}
                        </>
                    )}
                </tr>
                </thead>
                <tbody id="tableGrid">
                { data.map((row) => (
                    <tr>
                        { columns.map((column, index) => (
                            <td>
                                { index === 0 ? (
                                    <input type="checkbox" name="fileCheckbox" disabled={row['status'] !== 'available'} onChange={(e) => {
                                        e.target.checked ? row['selected'] = "true" : row['selected'] = "false";
                                        selectClickHandler(e);
                                    }}/>
                                ) : (
                                    <>
                                        { row[column] === 'available' ? (
                                        <span className="dot"></span> ) : (<span className="dot-none"></span>)}  {row[column]}
                                    </>
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
}
