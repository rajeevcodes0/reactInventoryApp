import React, { useContext } from 'react'

import AppManager from '../../store/app-manager'

function Prompt() {
    const AppManagerContext = useContext(AppManager);
    const promptState = AppManagerContext.promptState;
    return (
        <div className={`prompt ${promptState.selectedClassName}`}>
            <p>{promptState.message}</p>
        </div>
    )
}

export default Prompt

