import { useState } from "react"

type Side = "top" | "bottom" | "left" | "right"

interface TooltipProps {
  children: React.ReactNode
  label: string
  side?: Side
}

const LIFTED = "#1F2030"

const pos: Record<Side, string> = {
  top:    "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left:   "right-full top-1/2 -translate-y-1/2 mr-2",
  right:  "left-full top-1/2 -translate-y-1/2 ml-2",
}

const arrow: Record<Side, React.CSSProperties> = {
  top: {
    position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
    width: 0, height: 0,
    borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
    borderTop: `5px solid ${LIFTED}`,
  },
  bottom: {
    position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)",
    width: 0, height: 0,
    borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
    borderBottom: `5px solid ${LIFTED}`,
  },
  left: {
    position: "absolute", left: "100%", top: "50%", transform: "translateY(-50%)",
    width: 0, height: 0,
    borderTop: "5px solid transparent", borderBottom: "5px solid transparent",
    borderLeft: `5px solid ${LIFTED}`,
  },
  right: {
    position: "absolute", right: "100%", top: "50%", transform: "translateY(-50%)",
    width: 0, height: 0,
    borderTop: "5px solid transparent", borderBottom: "5px solid transparent",
    borderRight: `5px solid ${LIFTED}`,
  },
}

export function Tooltip({ children, label, side = "top" }: TooltipProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className={`absolute z-[200] anim-fadeIn tooltip-box ${pos[side]}`}>
          {label}
          <div style={arrow[side]} />
        </div>
      )}
    </div>
  )
}
