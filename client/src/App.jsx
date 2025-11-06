import { useState } from 'react'
import WeatherModule from './components/WeatherModule'
import CurrencyConverter from './components/CurrencyConverter'
import QuoteGenerator from './components/QuoteGenerator'

export default function App() {
	const [view, setView] = useState('Home')

	const Card = ({ title, img, onClick }) => (
		<button className="card card-hover" onClick={onClick} aria-label={title}>
			<img className="card-icon" src={img} alt={title} />
			<div className="card-title">{title}</div>
		</button>
	)

	return (
		<div className="app-shell">
			<header className="app-header">
				{view !== 'Home' ? (
					<button className="back-btn" onClick={() => setView('Home')}>← Back</button>
				) : (
					<div />
				)}
				<h1 className="brand">InfoHub</h1>
				<div />
			</header>

			{view === 'Home' && (
				<main className="home">
					<div className="cards">
						<Card
							title="Weather"
							img="https://img.icons8.com/fluency/96/sun.png"
							onClick={() => setView('Weather')}
						/>
						<Card
							title="Currency"
							img="https://img.icons8.com/fluency/96/currency-exchange.png"
							onClick={() => setView('Currency')}
						/>
						<Card
							title="Quotes"
							img="https://img.icons8.com/fluency/96/quote.png"
							onClick={() => setView('Quotes')}
						/>
					</div>

				</main>
			)}

			{view === 'Weather' && (
				<main className="module"><WeatherModule /></main>
			)}
			{view === 'Currency' && (
				<main className="module"><CurrencyConverter /></main>
			)}
			{view === 'Quotes' && (
				<main className="module"><QuoteGenerator /></main>
			)}
		</div>
	)
}


