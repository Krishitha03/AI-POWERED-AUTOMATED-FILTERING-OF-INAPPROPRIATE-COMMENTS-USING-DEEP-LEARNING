import React from 'react';

export const Box:React.FC<{name: string}> = ({name})=>{
    return (
      <div className="box"> 
        {name}
      </div>
    );
}