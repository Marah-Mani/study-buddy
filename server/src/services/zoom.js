// eslint-disable-next-line import/no-extraneous-dependencies
const axios = require('axios');

class Zoom {
	constructor() {
		this.apiKey = process.env.ZOOM_CLIENT_ID;
		this.apiSecret = process.env.ZOOM_SECRET_ID;
		this.baseUrl = 'https://api.zoom.us/v2';
	}

	async generateAccessToken() {
		const retryCount = 2; // Reduced retry count
		const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

		for (let attempt = 1; attempt <= retryCount; attempt++) {
			try {
				const response = await axios.post(
					'https://zoom.us/oauth/token',
					new URLSearchParams({
						grant_type: 'account_credentials',
						account_id: 'Ixt2K9r4QoOOldcZiG2ntQ'
					}).toString(),
					{
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							Authorization:
								'Basic YW1sbjJDV1I0bTRvbFNGMkN3UDNBOmF4cnFJRm1CbUtkd1BmRGJvbjBtbGk2RTM1Nkg2dFh3'
						}
					}
				);

				return response.data.access_token;
			} catch (error) {
				const errorMsg = error.response ? error.response.data : error.message;
				console.error(`Error getting access token on attempt ${attempt}:`, errorMsg);

				// Abort quickly if the error is due to invalid credentials or critical issues
				if (error.response && error.response.status === 401) {
					throw new Error('Invalid credentials. Aborting.');
				}

				if (attempt < retryCount) {
					console.log(`Retrying... (${attempt}/${retryCount})`);
					await delay(1000); // Short delay before retrying
				} else {
					throw new Error('Failed to generate access token after multiple attempts');
				}
			}
		}
	}

	async createMeeting(data) {
		try {
			const formattedDate = data.startDate;
			const payload = {
				topic: data.title,
				type: 2,
				start_time: formattedDate,
				duration: 60,
				timezone: 'UTC'
			};
			const response = await axios.post(`${this.baseUrl}/users/me/meetings`, payload, {
				headers: {
					Authorization: `Bearer ${await this.generateAccessToken()}`,
					'Content-Type': 'application/json'
				}
			});
			return response.data;
		} catch (error) {
			console.error('Error creating meeting:', error);
			throw new Error(error.response ? error.response.data : 'Internal Server Error');
		}
	}

	async updateMeeting(meetingId, topic, startTime, duration) {
		try {
			const response = await axios.patch(
				`${this.baseUrl}/meetings/${meetingId}`,
				{
					topic,
					start_time: startTime,
					duration
				},
				{
					headers: {
						Authorization: `Bearer ${this.apiKey}.${this.apiSecret}`,
						'Content-Type': 'application/json'
					}
				}
			);
			return response.data;
		} catch (error) {
			throw new Error(error.response ? error.response.data : 'Internal Server Error');
		}
	}

	async getAllMeetings() {
		try {
			const response = await axios.get(`${this.baseUrl}/users/me/meetings`, {
				headers: {
					Authorization: `Bearer ${await this.generateAccessToken()}`,
					'Content-Type': 'application/json'
				}
			});
			return response.data;
		} catch (error) {
			throw new Error(error.response ? error.response.data : 'Internal Server Error');
		}
	}

	async getSingleMeeting(meetingId) {
		try {
			const response = await axios.get(`${this.baseUrl}/meetings/${meetingId}`, {
				headers: {
					Authorization: `Bearer ${this.apiKey}.${this.apiSecret}`,
					'Content-Type': 'application/json'
				}
			});
			return response.data;
		} catch (error) {
			throw new Error(error.response ? error.response.data : 'Internal Server Error');
		}
	}

	async deleteMeeting(meetingId) {
		try {
			const response = await axios.delete(`${this.baseUrl}/meetings/${meetingId}`, {
				headers: {
					Authorization: `Bearer ${this.apiKey}.${this.apiSecret}`,
					'Content-Type': 'application/json'
				}
			});
			return response.data;
		} catch (error) {
			throw new Error(error.response ? error.response.data : 'Internal Server Error');
		}
	}
}

module.exports = Zoom;
