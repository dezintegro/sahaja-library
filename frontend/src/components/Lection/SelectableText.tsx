import {
  useFloating,
  useDismiss,
  useInteractions,
  flip,
  shift,
  inline,
  autoUpdate,
  arrow,
  FloatingArrow,
  offset,
} from '@floating-ui/react'
import { useEffect, useRef, useState } from 'react'
import { VKIcon, VKShareButton } from 'react-share'

function buildShareUrl() {
  return 'https://vk.com/share.php?url=https%3A%2F%2Flocalhost%3A3000%2Flections%2F1264%3Fhighlight%3D%25D0%25BA%25D1%2580%25D0%25B8%25D1%2588%25D0%25BD%25D0%25B0&noparse=0&no_vk_links=0&'
}

export default function SelectableText() {
  const [isOpen, setIsOpen] = useState(false)
  const arrowRef = useRef(null)

  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom',
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      inline(),
      flip(),
      shift(),
      offset(10),
      arrow({
        element: arrowRef,
      }),
    ],
    whileElementsMounted: autoUpdate,
  })

  const dismiss = useDismiss(context)

  const { getFloatingProps } = useInteractions([dismiss])

  useEffect(() => {
    function handleMouseUp(event: MouseEvent) {
      if (refs.floating.current?.contains(event.target as Element | null)) {
        return
      }

      setTimeout(() => {
        const selection = window.getSelection()
        const range =
          typeof selection?.rangeCount === 'number' && selection.rangeCount > 0 ? selection.getRangeAt(0) : null

        if (selection?.isCollapsed) {
          setIsOpen(false)
          return
        }

        if (range) {
          refs.setReference({
            getBoundingClientRect: () => range.getBoundingClientRect(),
            getClientRects: () => range.getClientRects(),
          })
          setIsOpen(true)
        }
      })
    }

    function handleMouseDown(event: MouseEvent) {
      if (refs.floating.current?.contains(event.target as Element | null)) {
        return
      }

      if (window.getSelection()?.isCollapsed) {
        setIsOpen(false)
      }
    }

    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousedown', handleMouseDown)

    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousedown', handleMouseDown)
    }
  }, [refs])

  return (
    <>
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
            background: 'transparent',
            color: 'white',
            padding: 4,
          }}
          {...getFloatingProps()}
        >
          <FloatingArrow ref={arrowRef} context={context} />
          <VKShareButton url={window.location.href}>
            <VKIcon size={32} round />
            <a>Link</a>
          </VKShareButton>
        </div>
      )}
    </>
  )
}
