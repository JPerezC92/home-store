import config from '@hs/playwright-config'

export default config({
	webServer: {
		command: 'pnpm run dev',
		url: 'http://localhost:3001',
		reuseExistingServer: true,
	},
})
