"use client"

import { CircularProgress } from "@mui/material"

export const Loading = () => {
  return (
    <div style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <CircularProgress />
    </div>
  )
}