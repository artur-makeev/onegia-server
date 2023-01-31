import { HttpService } from '@nestjs/axios/dist';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { map, catchError, lastValueFrom } from 'rxjs';
import { GetAddressesDto, GetCitiesDto, GetDeliveryDetailsDto } from './dto/cdek.dto';


@Injectable()
export class CdekService {
	public token: string;

	constructor(
		private readonly httpService: HttpService,
	) {
		this.token = '';
	}

	async auth() {
		try {
			const data = {
				grant_type: 'client_credentials',
				client_id: process.env.CDEK_ACCOUNT,
				client_secret: process.env.CDEK_PASSWORD
			};

			const config = {
				headers: { 'content-type': 'application/x-www-form-urlencoded' }
			}

			const request = this.httpService
				.post(
					`${process.env.CDEK_API_URL}/oauth/token?parameters`,
					data,
					config
				)
				.pipe(map(response => response.data?.access_token))
				.pipe(
					catchError(() => {
						throw new ForbiddenException('Cdek auth not available');
					}),
				);

			this.token = await lastValueFrom(request);
			//	setTimeout(() => {
			//		this.token = '';
			//	}, 3400)
			return 0;
		} catch (e) {
			console.log(e.message);

		};
	}

	getToken() {
		return this.token;
	}

	async getRegions() {
		if (!this.token) {
			await this.auth();
		}

		const config = {
			headers: { 'Authorization': `Bearer ${this.token}` },
			params: { 'country_codes': 'RU' }
		};

		let regions;
		let authFailed = true;

		try {
			const request = this.httpService
				.get(`${process.env.CDEK_API_URL}/location/regions`, config)
				.pipe(map(response => response.data));
			regions = await lastValueFrom(request);
			authFailed = false;
		} catch (e) {
			console.log(e)
		}

		if (authFailed) {
			await this.auth();
			const request = this.httpService
				.get(`${process.env.CDEK_API_URL}/location/regions`, config)
				.pipe(map(response => response.data));
			regions = await lastValueFrom(request);
		}

		regions = regions.map(region => {
			return {
				region: region.region,
				region_code: region.region_code
			}
		})
		return regions;
	}

	async getCities(query: GetCitiesDto) {
		if (!this.token) {
			await this.auth();
		}

		const config = {
			headers: { 'Authorization': `Bearer ${this.token}` },
			params: { 'region_code': query.region_code }
		};

		let cities;
		let authFailed = true;

		try {
			const request = this.httpService
				.get(`${process.env.CDEK_API_URL}/location/cities`, config)
				.pipe(map(response => response.data));
			cities = await lastValueFrom(request);
			authFailed = false;
		} catch (e) {
			console.log(e)
		}

		if (authFailed) {
			await this.auth();
			const request = this.httpService
				.get(`${process.env.CDEK_API_URL}/location/cities`, config)
				.pipe(map(response => response.data));
			cities = await lastValueFrom(request);
		}

		cities = cities.map(city => {
			return {
				code: city.code,
				city: city.city,
				longitude: city.longitude,
				latitude: city.latitude,
			}
		});

		return cities;
	}

	async getAddresses(query: GetAddressesDto) {
		if (!this.token) {
			await this.auth();
		}

		const config = {
			headers: { 'Authorization': `Bearer ${this.token}` },
			params: { 'city_code': query.city_code }
		};

		let addresses;
		let authFailed = true;

		try {
			const request = this.httpService
				.get(`${process.env.CDEK_API_URL}/deliverypoints`, config)
				.pipe(map(response => response.data));
			addresses = await lastValueFrom(request);
			authFailed = false;
		} catch (e) {
			console.log(e)
		}

		if (authFailed) {
			await this.auth();
			const request = this.httpService
				.get(`${process.env.CDEK_API_URL}/deliverypoints`, config)
				.pipe(map(response => response.data));
			addresses = await lastValueFrom(request);
		}

		addresses = addresses.map(address => {
			return {
				code: address.code,
				address: address.location.address_full,
				longitude: address.location.longitude,
				latitude: address.location.latitude
			}
		})

		return addresses;
	}

	async getDeliveryDetails({ to_address, weight }: GetDeliveryDetailsDto) {
		if (!this.token) {
			await this.auth();
		}

		const config = {
			headers: { 'Authorization': `Bearer ${this.token}` },
		};

		const body = {
			tariff_code: "136",
			from_location: {
				address: "Россия, Республика Карелия, Петрозаводск, Пр-т Первомайский, 15"
			},
			to_location: {
				address: to_address
			},
			packages: {
				weight: weight
			}
		}

		let deliveryDetails;
		let authFailed = true;

		try {
			const request = this.httpService
				.post(`${process.env.CDEK_API_URL}/calculator/tariff`, body, config)
				.pipe(map(response => response.data));
			deliveryDetails = await lastValueFrom(request);
			authFailed = false;
		} catch (e) {
			console.log(e)
		}

		if (authFailed) {
			await this.auth();
			const request = this.httpService
				.post(`${process.env.CDEK_API_URL}/calculator/tariff`, body, config)
				.pipe(map(response => response.data));
			deliveryDetails = await lastValueFrom(request);
		}

		deliveryDetails = {
			total_sum: deliveryDetails.total_sum,
			period_min: deliveryDetails.period_min,
			period_max: deliveryDetails.period_max
		}
		return deliveryDetails;
	}
}