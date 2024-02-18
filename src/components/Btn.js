import React from 'react'

function Btn({ label, onClick }) {
    return (
        <button onClick={onClick}>{label}</button>
      );
}

export default Btn