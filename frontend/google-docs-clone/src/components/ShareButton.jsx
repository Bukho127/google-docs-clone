import { LuShare } from "react-icons/lu"

const ShareButton = () =>{
  return (
    <button className='flex items-center gap 2 px-3 py4 bg-blue-700 text-white w-10 h-8'>
        Share
        <LuShare />
    </button>
  )
}

export default ShareButton
