import "./Card.css"

interface CardProps {
  title?: string
  headerAction?: React.ReactNode
  children: React.ReactNode
}

function Card({
  title,
  headerAction,
  children,
}: CardProps) {

  return (
    <section className="xirv-card">

      {(title || headerAction) && (
        <div className="card-header">

          {title && (
            <h3>
              {title}
            </h3>
          )}

          {headerAction}

        </div>
      )}

      <div className="card-content">
        {children}
      </div>

    </section>
  )
}

export default Card