import React, { useState, useEffect, useRef } from 'react'
import { BrowserView, MobileView } from 'react-device-detect'
import { useNavigate } from 'react-router-dom';
function CartHeader({ name, route, stepcount }) {
	const didMountRef = useRef(true);
	const navigate = useNavigate()

	const [activeStates, setActiveStates] = useState({
		cartActive: '',
		addressActive: '',
		checkoutActive: ''
	});
	const pathname = window.location.pathname

	useEffect(() => {
		if (didMountRef.current) {

		}
		didMountRef.current = false;
	}, []);

	return (
		<>
			<BrowserView>
				<header className='cartHeader color-background-1 spaced-section'>
					<div className='container'>
						<div className='mheader-left'>
							<a href="/" className="logo"><img src="/img/logo.png" width="70" height="47" /></a>
						</div>
						<div className='mheader-center'>
							<div className="step-by">
								<h3 className={`title-simple title-step title-step1 ${pathname == "/cart" ? "active" : ""}`}>
									<a href="/cart">My Cart</a>
									<svg width="8" height="12" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon icon-breadcrumbs">
										<path d="M1.25 1.5L4.75 5L1.25 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square"></path>
									</svg>
								</h3>
								<h3 className={`title-simple title-step title-step1 ${pathname == "/cart-address" ? "active" : ""}`}>
									<a href="javascript:void(0)">Address</a>
									<svg width="8" height="12" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon icon-breadcrumbs">
										<path d="M1.25 1.5L4.75 5L1.25 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square"></path>
									</svg>
								</h3>
								<h3 className={`title-simple title-step title-step1 ${pathname == "/checkout" ? "active" : ""}`}>
									<a href="javascript:void(0)">Payment</a></h3>
							</div>
						</div>
						<div className='mheader-right justify-content-end'>
							<img src='/img/100SECURE.png' className='secure-img'></img>
						</div>
					</div>
				</header>

			</BrowserView>
			<MobileView>
				<header className='mobileheader spaced-section'>
					<div className='mobileheader-title'>
						<svg width="22" height="17" onClick={() => { navigate(route) }} viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 14L26 14" stroke="currentColor" strokeWidth="3" strokeLinecap="square"></path><path d="M17.6514 3L29.6514 14L17.6514 25" stroke="currentColor" strokeWidth="3" strokeLinecap="square"></path></svg>
						{name}
					</div>
					<div>({stepcount}/3)</div>
				</header>
			</MobileView>
		</>
	)
}

export default CartHeader