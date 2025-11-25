import {
  arrow,
  computePosition,
  FloatingArrow,
  FloatingPortal,
  Placement,
  useFloating,
} from '@floating-ui/react'
import { useEffect, useRef, useState } from 'react'

export default function Tooltip({
  triggerRef,
}: {
  triggerRef: React.RefObject<HTMLElement | null>
}) {
  const { refs, floatingStyles } = useFloating({
    placement: 'top',
  })

  useEffect(() => {
    console.log(triggerRef)
    if (triggerRef?.current) {
      refs.setReference(triggerRef.current)
    }
  }, [triggerRef?.current])

  return (
    <FloatingPortal>
      <div ref={refs.setFloating} style={floatingStyles}>
        Test
      </div>
    </FloatingPortal>
  )
}
