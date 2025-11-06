import { useEffect, useState } from 'react'
import axios from 'axios'
import './WeatherModule.css'

export default function WeatherModule() {
	const [data, setData] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [searchCity, setSearchCity] = useState('')

	async function fetchWeather(city = '') {
		setIsLoading(true)
		setError('')
		try {
			const params = city ? { city } : {}
			const res = await axios.get('/api/weather', { params })
			setData(res.data)
		} catch (e) {
			setError('Failed to load weather data.')
		} finally {
			setIsLoading(false)
		}
	}

	function handleSearch(e) {
		e.preventDefault()
		if (searchCity.trim()) {
			fetchWeather(searchCity.trim())
		}
	}

	useEffect(() => {
		fetchWeather()
	}, [])

	return (
		<div className="wm-panel">
			<h2 className="wm-title">Weather</h2>
			
			{/* Search Form */}
			<form onSubmit={handleSearch} style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
				<input
					type="text"
					placeholder="Enter city name (e.g., London, New York, Tokyo)"
					value={searchCity}
					onChange={(e) => setSearchCity(e.target.value)}
					style={{
						flex: 1,
						padding: '8px 12px',
						border: '1px solid var(--border)',
						borderRadius: 6,
						fontSize: '14px',
						background: 'var(--surface)',
						color: 'var(--text)'
					}}
				/>
				<button
					type="submit"
					disabled={isLoading}
					style={{
						padding: '8px 16px',
						background: 'var(--accent)',
						color: 'white',
						border: 'none',
						borderRadius: 6,
						cursor: isLoading ? 'not-allowed' : 'pointer',
						fontSize: '14px',
						fontWeight: 500
					}}
				>
					{isLoading ? 'Loading...' : 'Search'}
				</button>
			</form>

			{isLoading && <p className="wm-muted">Loading weather...</p>}
			{error && <p className="wm-error">{error}</p>}
			{data && !isLoading && !error && (
				<>
					<p className="wm-row"><strong>City:</strong> {data.city}</p>
					<p className="wm-row"><strong>Temperature:</strong> {data.temperature}°C</p>
					<p className="wm-row"><strong>Condition:</strong> {data.condition}</p>
					{data.effects && (
						<div className="wm-effects" style={{ marginTop: 16, padding: 12, background: 'var(--surface-2)', borderRadius: 8, border: '1px solid var(--border)' }}>
							<p className="wm-row" style={{ marginBottom: 8 }}><strong>Weather Effects:</strong></p>
							<p className="wm-subtle" style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{data.effects}</p>
						</div>
					)}
					<p className="wm-subtle" style={{ marginTop: 12 }}>Source: {data.provider}</p>
				</>
			)}
		</div>
	)
}


