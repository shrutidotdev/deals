import React from 'react'

const Authlayout = async({
    children,
}: {
    children: React.ReactNode
}) => {
  return (
    <div className='min-h-screen flex justify-center items-center bg-primary'>
        {children}
    </div>
  )
}

export default Authlayout