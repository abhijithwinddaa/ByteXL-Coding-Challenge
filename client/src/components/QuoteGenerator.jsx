import { useEffect, useState } from 'react'
import axios from 'axios'
import './QuoteGenerator.css'

export default function QuoteGenerator() {
	const [data, setData] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [liked, setLiked] = useState(() => {
		try {
			return JSON.parse(localStorage.getItem('likedQuotes') || '[]')
		} catch { return [] }
	})

	async function loadQuote() {
		setIsLoading(true)
		setError('')
		try {
			const res = await axios.get('/api/quote')
			setData(res.data)
		} catch (_e) {
			setError('Failed to load quote.')
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		loadQuote()
		
		// Auto-refresh quote every 30 seconds
		const interval = setInterval(() => {
			loadQuote()
		}, 30000) // 30 seconds = 30000 milliseconds

		// Cleanup interval on component unmount
		return () => clearInterval(interval)
	}, [])

	function likeCurrent() {
		if (!data) return
		const next = [...liked, data]
		setLiked(next)
		try { localStorage.setItem('likedQuotes', JSON.stringify(next)) } catch {}
	}

	return (
		<div className="q-panel">
			<h2 className="q-title">Motivational Quote</h2>
			{isLoading && <p className="q-muted">Loading...</p>}
			{error && <p className="q-error">{error}</p>}
			{data && !isLoading && !error && (
				<blockquote className="q-quote">
					“{data.text}”
					<footer className="q-footer">— {data.author}</footer>
				</blockquote>
			)}
			<div className="q-actions">
				<button className="q-btn" onClick={likeCurrent}>Like</button>
				<button className="q-btn q-primary" onClick={loadQuote}>New Quote</button>
			</div>

			{liked.length > 0 && (
				<div style={{ marginTop: 16 }}>
					<h3 className="q-title">Liked Motivational Quotes</h3>
					<ul style={{ margin: 0, paddingLeft: 18 }}>
						{liked.map((q, idx) => (
							<li key={idx} style={{ marginBottom: 8 }}>
								<em>“{q.text}”</em> — {q.author}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)
}


