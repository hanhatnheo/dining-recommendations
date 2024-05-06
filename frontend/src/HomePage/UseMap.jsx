import { useMap } from "react-map-gl"
import React, { useMemo, useEffect, useState } from "react"

export const UseMap = () => {
  const { current: map } = useMap()
  const [currentBounds, setCurrentBounds] = useState()
  const [isMoving, setIsMoving] = useState(false)

  useEffect(() => {

    if (!map) {
        return;
    }

    const updateBounds = () => {
      setCurrentBounds(map.getBounds());
      setIsMoving(false);
    }

    const startMoving = () => {
      setIsMoving(true);
    }

    map.on("movestart", startMoving)
    map.on("moveend", updateBounds)

    return () => {
      map.off("movestart", startMoving)
      map.off("moveend", updateBounds)
    }
  }, [map])

  const value = useMemo(
    () => ({
      bounds: isMoving ? null : currentBounds,
      isMoving: isMoving,
    }),
    [isMoving, currentBounds]
  )

  return value
}