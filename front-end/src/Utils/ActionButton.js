import React from "react";

export const ActionButton = ({ onPress = () => {}, color = 'red', title, style }) => {
    return (
        <div onClick={onPress} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 48, width: 200, border: '1px solid ' + color, borderRadius: 24, color: color, ...style }}>
            {title}
        </div>
    )
}
