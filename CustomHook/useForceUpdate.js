import React,{useState,useRef} from 'react'

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return [() => setValue(value + 1), value];
  }


export default useForceUpdate