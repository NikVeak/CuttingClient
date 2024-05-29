import React, {useEffect, useState} from 'react';

const NeedCutTable = React.memo((props)=>{
    const [rows, setRows] = useState([]);

    useEffect(()=>{
        console.log(props.data)
        if (props.data){
            setRows(props.data);
        }

    }, [props.data])

    useEffect(()=>{
        setRows(rows);
        props.onSetTableData(rows);
    }, [rows]);

    const handleInputChange= (id, field, value) =>{
      const updatedRows = rows.map(row=>{
          if (row.id=== id){
              return {...row, [field]:value};
          }
          return row;
      });
      setRows(updatedRows);
    };
    const addRow = (e) => {
        e.preventDefault();

        setRows(prevRows => [...prevRows, { id: prevRows.length + 1, name: `Row ${prevRows.length + 1}` }]);
    };

    const deleteRow = (id) => {
        setRows(prevRows => prevRows.filter(row => row.id !== id));

    };

    return (
        <div className="wrapperTable" data-testid="need-cut">
            <div><h5>Ввод нарезаемых заготовок</h5></div>

            <table className="table" data-testid="table-need">
                <thead>
                <tr>
                    <th>№</th>
                    <th>Длина заготовки (мм)</th>
                    <th>Количество</th>
                    <th><button className="" data-testid="addRow" id="addRow" onClick={addRow}>+</button></th>
                </tr>
                </thead>
                <tbody>
                {rows.map(row => (
                    <tr key={row.id}>
                        <td id="id">
                            {row.id}
                        </td>
                        <td id="cuts" >
                            <input className="tableInput" key={row.id}
                                   name="length_cut"
                                   value={row.cuts}
                                   placeholder="Длина"
                                   onChange={(e) =>
                                       handleInputChange(row.id, "cuts", e.target.value)}
                                   type="number" min="0"/>
                        </td>
                        <td id="counts">
                            <input className="tableInput" key={row.id}
                                   name="length_count"
                                   value={row.counts}
                                   placeholder="Количество"
                                   onChange={(e) =>
                                       handleInputChange(row.id, "counts", e.target.value)}
                                   type="number" min="0" />
                        </td>
                        <td>
                            <button style={{
                                background: "#13a7b9",
                                outline: "none",
                                color: "#ffffff",
                                border: "none",
                                cursor: "pointer",
                                padding: ".1em .6em",
                                fontWeight: "bold",
                                borderRadius: "15px", fontSize: 20
                            }} data-testid="row-1" key={row.id} onClick={() => deleteRow(row.id)}>
                                &mdash;</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
});
export default NeedCutTable;