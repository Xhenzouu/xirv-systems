import "./Panel.css"

interface PanelProps {
  title?: string
  children: React.ReactNode
}

function Panel({
  title,
  children,
}: PanelProps) {
  return (
    <section className="xirv-panel">

      {title && (
        <h2>
          {title}
        </h2>
      )}

      <div>
        {children}
      </div>

    </section>
  )
}

export default Panel