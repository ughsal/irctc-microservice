const gridLines = Array.from({ length: 9 }, (_, index) => index);

export default function GlobeMapVisual() {
  return (
    <section className="travel-visual" aria-label="Railway route network illustration">
      <div className="travel-visual__grain" />
      <div className="travel-visual__eyebrow">IRCTC / NETWORK 01</div>

      <div className="travel-visual__copy">
        <p className="travel-visual__kicker">CONNECTED RAIL</p>
        <h2>Every journey starts with a line on the map.</h2>
        <p>
          Move from a single station to the entire network. Search, plan, and keep every trip in one calm place.
        </p>
      </div>

      <div className="travel-visual__stage" aria-hidden="true">
        <div className="orbit orbit--one" />
        <div className="orbit orbit--two" />
        <div className="orbit orbit--three" />
        <div className="globe">
          <span className="globe__latitude globe__latitude--one" />
          <span className="globe__latitude globe__latitude--two" />
          <span className="globe__longitude globe__longitude--one" />
          <span className="globe__longitude globe__longitude--two" />
          <span className="globe__core" />
        </div>

        <svg className="route-map" viewBox="0 0 620 360" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="routeGradient" x1="80" y1="80" x2="540" y2="290" gradientUnits="userSpaceOnUse">
              <stop stopColor="#5EEAD4" />
              <stop offset="0.52" stopColor="#38BDF8" />
              <stop offset="1" stopColor="#FCD34D" />
            </linearGradient>
            <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g className="route-map__grid">
            {gridLines.map(line => (
              <path key={`vertical-${line}`} d={`M ${40 + line * 68} 20 V 340`} />
            ))}
            {gridLines.slice(0, 6).map(line => (
              <path key={`horizontal-${line}`} d={`M 25 ${42 + line * 56} H 595`} />
            ))}
          </g>

          <path className="route-map__coast" d="M94 84C142 48 193 86 226 119C254 147 260 168 301 183C344 199 380 169 421 182C461 194 476 233 523 257C542 267 555 282 548 302" />
          <path className="route-map__route" filter="url(#softGlow)" d="M107 275C151 221 200 240 237 192C273 146 298 92 353 102C412 113 405 205 467 206C510 207 523 157 550 115" />
          <path className="route-map__route route-map__route--secondary" d="M102 110C163 109 182 175 238 176C291 178 319 231 375 250C423 266 477 248 532 283" />

          <g className="route-map__node">
            <circle cx="107" cy="275" r="8" />
            <circle cx="353" cy="102" r="8" />
            <circle cx="467" cy="206" r="8" />
            <circle cx="550" cy="115" r="8" />
          </g>
        </svg>
      </div>

      <div className="travel-visual__caption">
        <span>LIVE ROUTE INTELLIGENCE</span>
        <span className="travel-visual__caption-dot" />
        <span>INDIA</span>
      </div>
    </section>
  );
}
