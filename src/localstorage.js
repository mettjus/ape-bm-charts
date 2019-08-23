export function read() {
	let ls = {}
	if (global.localStorage) {
		try {
			ls = JSON.parse(global.localStorage.getItem('rgl-7')) || {}
		} catch (e) {
			/*Ignore*/
		}
	}
	return ls['layout']
}

export function save(value) {
	if (global.localStorage) {
		global.localStorage.setItem(
			'rgl-7',
			JSON.stringify({
				layout: value,
			})
		)
	}
}
