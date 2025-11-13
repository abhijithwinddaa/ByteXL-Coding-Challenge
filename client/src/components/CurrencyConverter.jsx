import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import './CurrencyConverter.css'

const CURRENCIES = ['INR','USD','EUR','GBP','AUD','CAD','JPY','CNY','AED','SGD']

export default function CurrencyConverter() {
	const [amount, setAmount] = useState(100)
	const [from, setFrom] = useState('INR')
	const [to, setTo] = useState('USD')
	const [data, setData] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [lastConversion, setLastConversion] = useState(null)

	async function fetchConversion(value) {
		setIsLoading(true)
		setError('')
    try {
      const res = await axios.get('/api/currency', { params: { amount: value, from, to } })
      setData(res.data)
      const val = res.data?.[to]
      if (typeof val === 'number') {
        setLastConversion({ amount: value, from, to, value: val, ts: Date.now() })
      }
		} catch (_e) {
			setError('Failed to convert currency.')
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchConversion(amount)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [from, to])

	return (
		<div className="cc-panel">
			<h2 className="cc-title">Money Converter</h2>
			<div className="cc-form">
				<label htmlFor="amt"><strong>Amount</strong></label>
				<input
					id="amt"
					type="number"
					value={amount}
					min={0}
					onChange={(e) => setAmount(Number(e.target.value))}
					className="cc-input"
				/>
				<select className="cc-input" value={from} onChange={(e) => setFrom(e.target.value)}>
					{CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
				</select>
				<span>→</span>
				<select className="cc-input" value={to} onChange={(e) => setTo(e.target.value)}>
					{CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
				</select>
				<button className="cc-btn cc-primary" onClick={() => fetchConversion(amount)}>Convert</button>
			</div>

			{isLoading && <p className="cc-muted">Converting...</p>}
			{error && <p className="cc-error">{error}</p>}
			{data && !isLoading && !error && (
				<div style={{ marginTop: 16 }}>
					<div className="cc-row" style={{ fontSize: '1.2em', marginBottom: 8 }}>
						{data.fromSymbol ? `${data.fromSymbol} ` : ''}{amount} {from} = <strong>{data.toSymbol ? `${data.toSymbol} ` : ''}{data?.[to]}</strong> {to}
					</div>
					{data.fromSymbol && data.toSymbol && (
						<div className="cc-subtle" style={{ fontSize: '0.9em', marginTop: 8, padding: 8, background: 'var(--surface-2)', borderRadius: 6 }}>
							<strong>Currency Symbols:</strong> {from} ({data.fromName}) = {data.fromSymbol} | {to} ({data.toName}) = {data.toSymbol}
						</div>
					)}
					{data.rate && (
						<div className="cc-subtle" style={{ fontSize: '0.85em', marginTop: 4 }}>
							Exchange Rate: 1 {from} = {data.rate.toFixed(4)} {to}
						</div>
					)}
				</div>
			)}

			{/* Recent Conversion - Only shown in Currency component */}
			{lastConversion && (Date.now() - lastConversion.ts < 60_000) && (
				<div style={{ marginTop: 24, padding: 12, border: '1px solid var(--border)', borderRadius: 12, background: 'var(--surface-2)' }}>
					<strong>Recent Conversion:</strong>
					<div style={{ marginTop: 6 }}>
						{lastConversion.amount} {lastConversion.from} → {lastConversion.to}: {lastConversion.value}
					</div>
					<div className="cc-subtle" style={{ fontSize: '0.85em', marginTop: 4 }}>
						This will disappear in {Math.max(0, 60 - Math.floor((Date.now() - lastConversion.ts)/1000))}s
					</div>
				</div>
			)}
		</div>
	)
}


